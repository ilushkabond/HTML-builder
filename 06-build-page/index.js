const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, 'project-dist');
const cssDir = path.resolve(__dirname, 'styles');
const htmlDir = path.resolve(__dirname, 'components');

const validateHTML = html => {
  if (!html.includes('{{')) {
    let component = '';
    
    const startPosition = html.indexOf('{{');
    const endPosition = html.indexOf('}}');
    const readStream = fs.createReadStream(path.resolve(htmlDir, `${html.slice(startPosition + 2, endPosition)}.html`), 'utf-8');

    readStream.on('data', data => component += data);
    readStream.on('end', () => {
      html = html.replace(html.replace(startPosition - 4, endPosition + 2), component);
      validateHTML(html);
    });
  } else {
    fs.createWriteStream(path.resolve(distDir, 'index.html'), 'utf-8').write(html);
  }
};

const bundleHTML = () => {
  let html = '';
  const readStream = fs.createReadStream(path.resolve(__dirname, 'template.html'), 'utf-8');

  readStream.on('data', data => html += data);
  readStream.on('end', () => validateHTML(html));
};

const copyAssets = async (fromDir, toDir) => {
  try {
    await fs.promises.mkdir(toDir, { recursive: true });
    const files = await fs.promises.readdir(fromDir, { withFileTypes: true });
    files.forEach(file => {
      if (file.isFile()) {
        fs.copyFile(path.join(fromDir, file.name), path.join(toDir, file.name), copyError => {
          if (copyError) {
            console.log(copyError);
          }
        });
      } else {
        copyAssets(path.join(fromDir, file.name), path.join(toDir, file.name));
      }
    });
  } catch (copyAssetsError) {
    console.log(copyAssetsError);
  }
};

const bundleCSS = async () => {
  try {
    const writeStream = fs.createWriteStream(path.resolve(distDir, 'style.css'));
    const cssFiles = await fs.promises.readdir(cssDir, { withFileTypes: true });
    const reversedFiles = cssFiles.reverse();

    reversedFiles.forEach(file => {
      if (file.isFile()) {
        const stylePath = path.resolve(cssDir, file.name);
        if (path.extname(stylePath) === '.css') {
          const readStream = fs.createReadStream(stylePath);
          readStream.pipe(writeStream, { end: false });
        }
      }
    })
  } catch (bundleCSSError) {
    console.log(bundleCSSError);
  }
}

const assembleProject = () => {
  bundleHTML();
  copyAssets(path.resolve(__dirname, 'assets'), path.resolve(distDir, 'assets'));
  bundleCSS();
}

fs.access(distDir, async accessError => {
  if (accessError) {
    await fs.promises.mkdir(distDir);
    assembleProject();
  } else {
    await fs.promises.rm(distDir, { recursive: true });
    await fs.promises.mkdir(distDir, { recursive: true });
    assembleProject();
  }
});