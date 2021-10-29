const express = require('express');
const fs = require('fs');
const path = require('path');

function getFileType(filename) {
    const fileType = path.extname(filename).split('.');
    return fileType[fileType.length - 1];
}

const router = express.Router();

fs.readdirSync(__dirname).forEach(function (file) {
    if (file === path.basename(__filename)) return;  //don't treat index.js
    const typeOfFile = (getFileType(file));
    if (typeOfFile!== "js") return;

    const fileName = path.basename(file, ".js");
    console.log(`Loading Controller: ${fileName}`);
    router.use(require(`${__dirname}/${file}`));
});

module.exports = router;