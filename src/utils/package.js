import fs from 'fs';
import path from 'path';

const pkg = JSON.parse(fs.readFileSync(path.resolve(process.argv[1], '../../package.json'), 'utf-8'));

export const getVersion = pkg.version;