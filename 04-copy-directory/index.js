const fs = require('fs');
const path = require('path');

const dirFromCopy = path.resolve(__dirname, 'files');
const dirToCopy = path.join(__dirname, 'files-copy');

const copyDir = async () => {
  fs.mkdir(dirToCopy, { recursive: true }, mkdirError => {
    if (mkdirError) {
      console.log(mkdirError);
    }
  });

  const files = await fs.promises.readdir(dirFromCopy, { withFileTypes: true });
  files.forEach(file => {
    const fileName = file.name;
    fs.copyFile(path.join(dirFromCopy, fileName), path.join(dirToCopy, fileName), copyError => {
      if (copyError) {
        console.log(copyError);
      }
    })
  });
};

(() => {
  fs.promises.rm(dirToCopy, { recursive: true, force: true }, rmError => {
    if (rmError) {
      console.log(rmError);
    }
  }).then(() => {
    copyDir();
  })
})();
