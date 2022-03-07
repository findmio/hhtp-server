import chalk from 'chalk';
import path from 'path';
import http from 'http';
import os from 'os';
import open from 'open';
import ejs from 'ejs';
import fs from 'fs/promises';

import { srcPath } from './utils/path.js';
import { getVersion } from './utils/package.js';

const networkInterfaces = os.networkInterfaces();

export default class HttpServer {
  constructor(options) {
    this.version = options.version;
    this.port = options.port;
    this.addresses = [];
    this.runAddress = process.cwd();

    this.getAddress();
  }

  start() {
    if (this.version) {
      console.log(getVersion);
      return;
    }
    this.createServer();
  }

  getAddress() {
    Object.keys(networkInterfaces).forEach((dev) => {
      networkInterfaces[dev].forEach((details) => {
        if (details.family === 'IPv4') {
          this.addresses.push(`http://${details.address}:${this.port}`)
        }
      });
    });
  }

  openLink() {
    open(this.addresses[0]);
  }

  printNetwork() {
    console.log(chalk.yellow('\nAvailable on:'));
    this.addresses.forEach(item => {
      console.log(chalk.green(`  ${item}`));
    })
  }

  resolvePath(url) {
    return path.join(this.runAddress, url)
  }

  renderHtml() {
    return new Promise((resolve, reject) => {
      const payload = {
        runAddress: this.runAddress,
      }
      ejs.renderFile(path.resolve(srcPath, 'templates/index.html'), payload, {}, function (err, str) {
        if (err) {
          reject(err);
        }
        resolve(str);
      });
    })
  }

  async createServer() {
    const html = await this.renderHtml();

    const server = http.createServer(async (req, res) => {
      if (req.url === '/favicon.ico') {
        const icon = await fs.readFile(path.join(srcPath, 'assets/favicon.ico'))
        res.end(icon);
        return;
      }

      const currentPath = this.resolvePath(req.url);

      const status = await fs.stat(currentPath);

      // TODO：处理本地文件
      if (status.isFile()) {

      }

      res.end(html);
    });

    server.listen(this.port);

    this.printNetwork();
    this.renderHtml();
    this.openLink();

    console.log(chalk.yellow('\nHit CTRL-C to stop the server'));
  }
}