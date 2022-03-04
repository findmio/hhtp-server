import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
const pkg = JSON.parse(fs.readFileSync(path.resolve(process.argv[1], '../../package.json'), 'utf-8'));
import http from 'http';
import os from 'os';

const networkInterfaces = os.networkInterfaces();

export default class HttpServer {
  constructor(options) {
    this.version = options.version;
    this.port = options.port;
  }
  start() {
    if (this.version) {
      console.log(pkg.version);
      return;
    }
    this.createServer();
  }
  printNetwork() {
    const addresses = [];
    Object.keys(networkInterfaces).forEach(function (dev) {
      networkInterfaces[dev].forEach(function (details) {
        if (details.family === 'IPv4') {
          addresses.push(details.address)
        }
      });
    });

    console.log(chalk.yellow('\nAvailable on:'));

    addresses.forEach(item => {
      console.log(chalk.green(`  http://${item}:${this.port}`));
    })
  }
  createServer() {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        data: 'Hello World!'
      }));
    });
    server.listen(this.port);

    this.printNetwork();

    console.log(chalk.yellow('\nHit CTRL-C to stop the server'));
  }
}