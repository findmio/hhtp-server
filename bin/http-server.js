#!/usr/bin/env node

import { Command } from 'commander';
import options from './options.js';
import HttpServer from '../src/index.js'

const program = new Command();

program
  .name("http-server")
  .usage("[path] [options]")


for (const key in options) {
  const option = options[key];
  program.option(option.option, option.description, option.default)
}

program.parse(process.argv)

new HttpServer(program.opts()).start();