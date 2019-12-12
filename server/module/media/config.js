const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

const photoDir = 'public/photos/';
const videoDir = 'public/videos/';
const fileDir = 'public/files/';
const fullVideoPath = path.resolve(videoDir);
const fullPhotoPath = path.resolve(photoDir);
const fullFilePath = path.resolve(fileDir);

if (!fs.existsSync(fullPhotoPath)) {
  mkdirp.sync(fullPhotoPath);
}

if (!fs.existsSync(fullFilePath)) {
  mkdirp.sync(fullFilePath);
}

if (!fs.existsSync(fullVideoPath)) {
  mkdirp.sync(fullVideoPath);
}
module.exports = {
  photoDir,
  videoDir,
  fileDir
};
