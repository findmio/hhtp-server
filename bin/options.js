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
    usage: 'http-server --version'
  },
}
