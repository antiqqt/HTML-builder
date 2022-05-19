const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('\nHello.\nPlease, insert your text below:\n\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') exit();
});

stdin.pipe(output);

process.on('exit', () => stdout.write('\nSee you soon!\n'));
process.on('SIGINT', exit);
