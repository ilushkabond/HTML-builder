const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (dirError, files) => {
  if (dirError) {
    console.log('Error while reading directory:', dirError.message);
  } else {
    files.forEach(file => {
      if (file.isFile()) {
        let filePath = path.join(__dirname, 'secret-folder', file.name);
        fs.stat(filePath, (fileError, stats) => {
          if (fileError) {
            console.log('Error while reading file:', fileError.message);
          } else {
            const fileName = file.name.split('.')[0];
            const fileExtension = path.extname(file.name).split('.')[1];
            const fileSize = (stats.size / 1024).toFixed(3);
            console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
          }
        });
      }
    });
  }
});
