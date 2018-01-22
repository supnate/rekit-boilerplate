'use strict';

/* eslint "no-use-before-define": 0 */

// This script is executed after a project is created with this boilerplate.
// After execution, the script will be deleted.

const path = require('path');
const fs = require('fs');

const prjPath = __dirname;
const pkgJsonPath = path.join(prjPath, 'package.json');

function postCreate(args) {
  handleCleanArgument(args);
  handleSassArgument(args);

  // Empty readme
  fs.writeFileSync(path.join(prjPath, 'README.md'), '# README\n');

  // Remove unnecessary files
  [
    '.travis.yml',
    'yarn.lock',
    'LICENSE',
  ].forEach(file => fs.unlinkSync(path.join(prjPath, file)));

  // Clean package.json
  const pkgJson = require(pkgJsonPath); // eslint-disable-line
  delete pkgJson.devDependencies['codecov']; // eslint-disable-line
  delete pkgJson.scripts['codecov']; // eslint-disable-line
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, '  '));
}

function handleCleanArgument(args) {
  const cleanFiles = [];
  [
    'src/features/home',
    'src/features/home/redux',
    'src/features/common',
    'src/features/common/redux',
    'src/styles',
    'tests/features/home',
    'tests/features/home/redux',
    'tests/features/common',
  ].forEach((folder) => {
    const fullFolderPath = path.join(prjPath, folder);
    fs.readdirSync(fullFolderPath).forEach((file) => {
      if (/\.clean\./.test(file)) {
        const fullFilePath = path.join(fullFolderPath, file);
        cleanFiles.push(fullFilePath);
      }
    });
  });
  if (args.clean) {
    [
      'src/features/common/PageNotFound.js',
      'src/features/common/PageNotFound.less',
      'src/features/common/SimpleNav.js',
      'src/features/common/SimpleNav.less',
      'src/features/home/RedditList.js',
      'src/features/home/RedditList.less',
      'src/features/home/TestPage.js',
      'src/features/home/TestPage.less',
      'src/features/home/redux/counterMinusOne.js',
      'src/features/home/redux/counterPlusOne.js',
      'src/features/home/redux/resetCounter.js',
      'src/features/home/redux/fetchRedditReactjsList.js',
      'tests/features/common/PageNotFound.test.js',
      'tests/features/common/SimpleNav.test.js',
      'tests/features/home/RedditList.test.js',
      'tests/features/home/TestPage.test.js',
      'tests/features/home/redux/counterMinusOne.test.js',
      'tests/features/home/redux/counterPlusOne.test.js',
      'tests/features/home/redux/fetchRedditReactjsList.test.js',
      'tests/features/home/redux/resetCounter.test.js',
    ].forEach(file => fs.unlinkSync(path.join(prjPath, file)));

    cleanFiles.forEach((file) => {
      const targetFile = file.replace('.clean.', '.');
      fs.unlinkSync(targetFile);
      fs.renameSync(file, targetFile);
    });
  } else {
    cleanFiles.forEach(fs.unlinkSync);
  }
}

function handleSassArgument(args) {
  const pkgJson = require(pkgJsonPath); // eslint-disable-line
  // Handle --sass argument
  if (args.sass) {
    // Use webpack sass-loader
    const configPath = path.join(prjPath, 'webpack-config.js');
    let text = fs.readFileSync(configPath).toString();
    text = text.replace(/\.less/g, '.scss').replace(/less-loader/g, 'sass-loader');
    fs.writeFileSync(configPath, text);

    // Update package.json dependencies
    delete pkgJson.devDependencies['less']; // eslint-disable-line
    delete pkgJson.devDependencies['less-loader'];

    pkgJson.rekit.css = 'scss';

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
