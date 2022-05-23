const fs = require('fs');
const path = require('path');
const stylesDir = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

const writeStream = fs.createWriteStream(bundlePath);

fs.readdir(stylesDir, { withFileTypes: true }, (readError, files) => {
  if (readError) {
    console.log(readError);
  } else {
    files.forEach(file => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        let stylesheets = '';

        const stylePath = path.join(stylesDir, file.name);
        const readStream = fs.createReadStream(stylePath, 'utf-8');

        readStream.on('data', data => stylesheets += data);
        readStream.on('end', () => writeStream.write(`${stylesheets}\n`));
        readStream.on('error', readStreamError => console.log(readStreamError));
      }
    });
  }
});