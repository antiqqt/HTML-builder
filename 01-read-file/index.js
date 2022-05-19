const fs = require('fs');
const path = require('path');
const { stdout, exit } = process;

const readableStream = fs.createReadStream(
  path.join(__dirname, 'text.txt'),
  'utf-8'
);

readableStream.on('data', (chunk) => {
  stdout.write(chunk);
});

readableStream.on('end', exit);
