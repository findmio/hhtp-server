import fs from 'fs';
import path from 'path';
const pkg = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf-8'));

export default {
  'port': {
    option: '-p,--port <number>',
    description: 'Port to use.',
    default: 8080,
    usage: 'http-server --port <number>'
  },
  'version': {
    option: '-v --version',
    description: 'Print the version and exit.',
    default: pkg.version,
    usage: 'http-server --version'
  },
}
