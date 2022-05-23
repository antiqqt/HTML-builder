const { createWriteStream, createReadStream } = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');

async function bundleStyles() {
  try {
    const bundleWriteStream = createWriteStream(
      path.join(__dirname, 'project-dist', 'bundle.css')
    );

    const stylesDirEntries = await readdir(path.join(__dirname, 'styles'), {
      withFileTypes: true,
    });

    for (const dirent of stylesDirEntries) {
      if (!dirent.isFile() || !dirent.name.endsWith('.css')) continue;

      const styleReadStream = createReadStream(
        path.join(__dirname, 'styles', dirent.name)
      );

      styleReadStream.pipe(bundleWriteStream);
    }
  } catch (err) {
    console.log(err);
  }
}

bundleStyles();
