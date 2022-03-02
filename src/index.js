import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
const pkg = JSON.parse(fs.readFileSync(path.resolve(process.argv[1], '../../package.json'), 'utf-8'));

export default class HttpServer {
  constructor(options) {
    this.version = options.version;
    this.port = options.port;
  }
  createServer() {
    if (this.version) {
      console.log(pkg.version);
      return;
    }
    console.log(process.cwd());
    console.log(chalk.yellow('Hit CTRL-C to stop the server'));
  }
}