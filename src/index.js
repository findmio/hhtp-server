import chalk from 'chalk';
import path from 'path';
import http from 'http';
import os from 'os';
import open from 'open';
import ejs from 'ejs';
import fs from 'fs/promises';
import mime from 'mime';
import { createReadStream } from 'fs';

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


  renderHtml(payload) {
    return new Promise((resolve, reject) => {
      ejs.renderFile(path.resolve(srcPath, 'templates/index.html'), payload, {}, function (err, str) {
        if (err) {
          reject(err);
        }
        resolve(str);
      });
    })
  }

  async isFile(path) {
    return (await fs.stat(path)).isFile();
  }

  async renderDir(req, res, currentPath) {
    const dirs = await fs.readdir(currentPath);
    const paths = { files: [], dirs: [] };

    for (const dir of dirs) {
      const isFile = await this.isFile(path.join(this.runAddress, req.url, dir))
      if (isFile) {
        paths.files.push(dir)
      } else {
        paths.dirs.push(dir);
      }
    }

    const payload = {
      runAddress: this.runAddress,
      srcPath,
      paths
    }

    const html = await this.renderHtml(payload);

    res.end(html);
  }

  renderFile(req, res, currentPath) {
    res.setHeader('Content-Type', mime.getType(currentPath) + ';charset=utf-8');
    createReadStream(currentPath).pipe(res);
  }

  async createServer() {

    const server = http.createServer(async (req, res) => {
      if (req.url === '/favicon.ico') {
        const icon = await fs.readFile(path.join(srcPath, 'assets/favicon.ico'))
        res.end(icon);
        return;
      }

      const currentPath = path.join(this.runAddress, decodeURIComponent(req.url));

      if (await this.isFile(currentPath)) {
        this.renderFile(req, res, currentPath);
      } else {
        this.renderDir(req, res, currentPath);
      }
    });

    server.listen(this.port);

    this.printNetwork();
    this.openLink();

    console.log(chalk.yellow('\nHit CTRL-C to stop the server'));
  }
}