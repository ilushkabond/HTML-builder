const fs = require('fs');
const path = require('path');

let content = '';
const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'));

readStream.on('data', chunk => {
  content += chunk;
});

readStream.on('end', () => {
  console.log(content);
});