const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const writableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Input text (type exit to quit application):\n');
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') process.exit();
  writableStream.write(data);
});

process.on('exit', () => stdout.write('thanks, have a nice day!'));
process.on('SIGINT', () => process.exit());