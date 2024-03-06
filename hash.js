const fs = require('fs');
const crypto = require('crypto');

const  {invalidParamsMes, getAbsolutePath} = require('./common');

function hashFile(currentPath, userPath) {
    if (!userPath) {
        throw new Error(invalidParamsMes);
    }
    const filePath = getAbsolutePath(currentPath, userPath);

    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);

    const hex = hashSum.digest('hex');

    console.log(hex);
}

module.exports = {
    hashFile
}