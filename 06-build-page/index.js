const {
  readFile,
  writeFile,
  copyFile,
  readdir,
  mkdir,
  rm,
} = require('fs/promises');
const { createWriteStream, createReadStream } = require('fs');
const path = require('path');

async function buildHtml() {
  try {
    let indexFileString = await readFile(
      path.join(__dirname, 'template.html'),
      'utf-8'
    );

    const componentsEntries = await readdir(
      path.join(__dirname, 'components'),
      {
        withFileTypes: true,
      }
    );

    for (const dirent of componentsEntries) {
      const isHtmlFile = dirent.isFile() && dirent.name.endsWith('.html');
      if (!isHtmlFile) continue;

      const componentPath = path.join(__dirname, 'components', dirent.name);
      const { name: componentName } = path.parse(componentPath);
      const componentFileString = await readFile(componentPath, 'utf-8');

      const regEx = new RegExp(`{{${componentName}}}`, 'gi');

      indexFileString = indexFileString.replace(regEx, componentFileString);
    }

    await writeFile(
      path.join(__dirname, 'project-dist', 'index.html'),
      indexFileString
    );
  } catch (err) {
    console.error();
  }
}

async function bundleStyles() {
  try {
    const bundleWriteStream = createWriteStream(
      path.join(__dirname, 'project-dist', 'style.css')
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

async function copyFolder(
  pathToSrcFolder,
  pathToDestFolder,
  options = { deepCopy: false, destFolderCleared: false }
) {
  try {
    if (!options.destFolderCleared) {
      await rm(pathToDestFolder, { recursive: true, force: true });
    }

    await mkdir(pathToDestFolder);

    const dirEntries = await readdir(pathToSrcFolder, {
      withFileTypes: true,
    });

    for (const dirent of dirEntries) {
      if (dirent.isFile()) {
        const pathToSrcFile = path.join(pathToSrcFolder, dirent.name);
        const pathToDestFile = path.join(pathToDestFolder, dirent.name);

        copyFile(pathToSrcFile, pathToDestFile);
      }

      if (dirent.isDirectory() && options.deepCopy) {
        copyFolder(
          path.join(pathToSrcFolder, dirent.name),
          path.join(pathToDestFolder, dirent.name),
          { deepCopy: true, destFolderCleared: true }
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
}

(async () => {
  try {
    // Clear old folder
    await rm(path.join(__dirname, 'project-dist'), {
      recursive: true,
      force: true,
    }).catch(console.error);

    // Create updated folder
    await mkdir(path.join(__dirname, 'project-dist'), {
      recursive: true,
    }).catch(console.error);

    buildHtml();
    bundleStyles();
    copyFolder(
      path.join(__dirname, 'assets'),
      path.join(__dirname, 'project-dist', 'assets'),
      { deepCopy: true }
    );
  } catch (err) {
    console.error;
  }
})();
