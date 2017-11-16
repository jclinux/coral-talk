/**
 * Alley system for adding custom styles to Coral's CSS imports
 */
const path = require('path');
const fs = require('fs-extra');
const watch = require('glob-watcher');
const md5Hex = require('md5-hex');
const webpack = require('webpack');


function appendTmpCssOverride(oldPath, newPath, tmpPath) {
  // Copy old CSS to temp dir
  // @todo Account for duplicate file basenames
  fs.copySync(oldPath, tmpPath, { overwrite: true });

  // Append new file to old file
  const newStylesStr = "\n\n" + fs.readFileSync(newPath, { encoding: 'utf8' });
  fs.appendFileSync(tmpPath, newStylesStr);
}

function doCssOverrides() {
  const plugins = [];
  const cssOverrides = fs.readJsonSync(path.resolve(__dirname, 'css-overrides.json'), { throws: false });
  if (cssOverrides && cssOverrides.length) {

    // Set up temp css overrides dir
    const tmpCssDirPath = path.resolve(__dirname, 'tmp-css-overrides');
    fs.ensureDirSync(tmpCssDirPath);
    const newPathsMap = {};

    cssOverrides.forEach(({ oldPath, newPath }) => {
      // Must both be CSS files
      if (oldPath.endsWith('.css') && newPath.endsWith('.css')) {
        console.log(`
          Appending ${newPath} to ${oldPath}
        `);
        const regExpStr = oldPath
          .split('/')
          .join('\\/')
          .replace('.css', '\\.css$');

        const oldPathHash = md5Hex(oldPath).slice(0,5);
        const tmpPath = path.join(tmpCssDirPath, `${oldPathHash}_${path.basename(oldPath)}`);
        appendTmpCssOverride(oldPath, newPath, tmpPath);

        plugins.push(new webpack.NormalModuleReplacementPlugin(
          new RegExp(regExpStr),
          path.resolve(__dirname, tmpPath)
        ));

        newPathsMap[path.resolve(__dirname, newPath)] = { newPath, oldPath, tmpPath };
      }
    });

    const watcher = watch(Object.keys(newPathsMap));
    watcher.on('change', (path) => {
      if (newPathsMap.hasOwnProperty(path)) {
        const { newPath, oldPath, tmpPath } = newPathsMap[path];
        appendTmpCssOverride(oldPath, newPath, tmpPath);
      }
    });
  }

  return plugins;
}

module.exports = doCssOverrides;
