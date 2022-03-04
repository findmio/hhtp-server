#!/usr/bin/env node

import { Command } from 'commander';
import options from './options.js';
import HttpServer from '../src/index.js'

const program = new Command();

function displayUsage() {
  console.log('usage: pm2 [options] <command>')
  console.log('');
  console.log('pm2 -h, --help             all available commands and options');
  console.log('pm2 examples               display pm2 usage examples');
  console.log('pm2 <command> -h           help on a specific command');
  console.log('');
  console.log('Access pm2 files in ~/.pm2');
}

program
  .name("http-server")
  .usage("[path] [options]")


for (const key in options) {
  const option = options[key];
  program.option(option.option, option.description, option.default)
}

program.parse(process.argv)

program.on('--help', displayUsage)

new HttpServer(program.opts()).start();