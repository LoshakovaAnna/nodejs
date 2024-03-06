const path = require('path');
const fs = require('fs');

const  {invalidParamsMes, getAbsolutePath} = require('./common');

function upNavigation(currentPath) {
    return path.join(currentPath, '../');
}

function showFolderContentList(currentPath) {
    let list = fs.readdirSync(currentPath, {withFileTypes: true});// []Dirent
    list = list
        .map(el => {
            return {name: el.name, type: el.isDirectory() ? 'directory' : 'file'}
        })
        .sort((el1, el2) => {
            if (el1.type !== el2.type) {
                return el1.type === 'directory' ? -1 : 1;
            }
            return el1.name > el2.name ? 1 : -1;
        });
    console.table(list);
}

function moveToFolder(currentPath, userPath) {
    if (!userPath) {
        throw new Error(invalidParamsMes);
    }
    const correctPath = getAbsolutePath(currentPath, userPath);
    if (fs.existsSync(correctPath)) {
        return correctPath;
    }
    console.log('Wrong path!');
    return currentPath;
}

module.exports= {
    upNavigation,
    showFolderContentList,
    moveToFolder
}