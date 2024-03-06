const fs = require('fs');

const  {invalidParamsMes, getAbsolutePath} = require('./common');


function readFileAndPrint(currentPath, userPath) {
    if (!userPath) {
        throw new Error(invalidParamsMes);
    }
    const filePath = getAbsolutePath(currentPath, userPath);
    let readStream = fs.createReadStream(filePath);
    readStream.on('data', (chunk) => {
        console.log(chunk.toString());
    });
}


function createFile(currentPath, fileName) {
    if (!fileName) {
        throw new Error(invalidParamsMes);
    }
    const filePath = getAbsolutePath(currentPath, fileName);
    fs.closeSync(fs.openSync(filePath, 'w'));
    console.log(`File ${filePath} was created!`);
}

function renameFile(currentPath, oldName, newName) {
    fs.renameSync(getAbsolutePath(currentPath, oldName), getAbsolutePath(currentPath, newName));
    console.log(`\nFile Renamed!\n new name: ${newName}`);
}

function deleteFile(currentPath, userPath) {
    if (!userPath) {
        throw new Error(invalidParamsMes);
    }
    fs.unlinkSync(getAbsolutePath(currentPath, userPath));
    console.log(`File ${userPath} deleted`);
}

function copyFile(currentPath, initUserFilePath, userCopyPath) {
    if (!initUserFilePath || !userCopyPath) {
        throw new Error(invalidParamsMes);
    }
    const filePath = getAbsolutePath(currentPath, initUserFilePath);
    const copyPath = getAbsolutePath(currentPath, userCopyPath);

    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(copyPath);
    return readStream.pipe(writeStream);
}

function moveFile(currentPath, initUserFilePath, userCopyPath) {
    copyFile(currentPath, initUserFilePath, userCopyPath)
        ?.on('close', () => (
            fs.unlinkSync(getAbsolutePath(currentPath, initUserFilePath))
        ));
}

module.exports = {
    readFileAndPrint,
    createFile,
    deleteFile,
    renameFile,
    copyFile,
    moveFile
}