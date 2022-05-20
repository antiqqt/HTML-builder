const { readdir, stat } = require('fs').promises;
const path = require('path');

(async () => {
  try {
    const dirEntries = await readdir(path.join(__dirname, 'secret-folder'), {
      withFileTypes: true,
    });

    for (const dirent of dirEntries) {
      if (!dirent.isFile()) continue;

      const pathToFile = path.join(__dirname, 'secret-folder', dirent.name);
      const { name: fileName, ext: extName } = path.parse(pathToFile);
      const { size: fileSize } = await stat(pathToFile);

      console.log(`${fileName} - ${extName.slice(1)} - ${fileSize}b`);
    }
  } catch (err) {
    console.log(err);
  }
})();
