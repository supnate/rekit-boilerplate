'use strict';

// This script is executed after a project is created with this boilerplate.
// After execution, the script will be deleted.

const path = require('path');
const fs = require('fs');

const prjPath = __dirname;
const pkgJsonPath = path.join(prjPath, 'package.json');

function postCreate(args) {
  console.log('post create', args);

  const pkgJson = require(pkgJsonPath); // eslint-disable-line  
  if (args.sass) {
    // Use webpack sass-loader
    const configPath = path.join(prjPath, 'webpack-config.js');
    let text = fs.readFileSync(configPath).toString();
    text = text.replace(/\.less/g, '.scss').replace(/less-loader/g, 'sass-loader');
    fs.writeFileSync(configPath, text);

    // Update package.json dependencies
    delete pkgJson.devDependencies['less']; // eslint-disable-line
    delete pkgJson.devDependencies['less-loader'];

    // Rename files extension to 'scss'
    ['src/features/home', 'src/features/common', 'src/styles'].forEach((folder) => {
      const fullFolderPath = path.join(prjPath, folder);
      fs.readdirSync(fullFolderPath).forEach((file) => {
        if (/\.less$/.test(file)) {
          const fullFilePath = path.join(fullFolderPath, file);
          fs.renameSync(fullFilePath, fullFilePath.replace(/less$/, 'scss'));
        }
      });
    });
  } else {
    delete pkgJson.devDependencies['node-sass'];
    delete pkgJson.devDependencies['sass-loader'];
  }

  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, '  '));
}

module.exports = postCreate;
