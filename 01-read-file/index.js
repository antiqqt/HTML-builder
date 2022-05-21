const { createReadStream } = require('fs');
const path = require('path');
const { stdout } = process;

createReadStream(path.join(__dirname, 'text.txt'), 'utf-8').pipe(stdout);
