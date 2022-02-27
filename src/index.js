import fs from 'fs';
import chalk from 'chalk';

export default class HttpServer {
  constructor(options) {
    console.log(options);
  }
  createServer() {
    console.log(chalk.yellow('Hit CTRL-C to stop the server'));
  }
}