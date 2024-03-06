const path = require('path');
const rl = require('readline');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');
const zlib = require('zlib');

const argv = process.argv;
const username = argv.find(el => el.includes('--username='))?.split('--username=')[1] || '';

console.log(`Welcome to the File Manager, ${username}!`);

process.on('exit', () => {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
})


let currentPath = os.homedir();
showCurrentPath(currentPath);

function showCurrentPath(currentPath) {
    console.log(`You are currently in ${currentPath}`);
}

const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const invalidParamsMes = 'No correct params';

readline.on('line', (input) => {
    const {command, param1, param2} = parseLine(input);
    try {
        switch (command) {
            case 'up': {
                currentPath = upNavigation(currentPath);
                break;
            }
            case 'cd': {
                currentPath = moveToFolder(currentPath, param1);
                break;
            }
            case 'ls': {
                showFolderContentList(currentPath);
                break;
            }
            case 'cat': {
                readFileAndPrint(currentPath, param1);
                break;
            }
            case 'add': {
                createFile(currentPath, param1);
                break;
            }
            case 'rn': {
                renameFile(currentPath, param1, param2);
                break;
            }
            case 'cp': {
                copyFile(currentPath, param1, param2);
                break;
            }
            case 'mv': {
                moveFile(currentPath, param1, param2);
                break;
            }
            case 'rm': {
                deleteFile(currentPath, param1);
                break;
            }
            case 'os': {
                switch (param1) {
                    case '--EOL' : {
                        console.log(JSON.stringify(os.EOL));
                        break;
                    }
                    case '--cpus' : {
                        const cpus = os.cpus();
                        console.log(`amount = ${cpus.length}`);
                        console.table(
                            os.cpus().map((el, index) => ({
                                index: index + 1,
                                model: el.model,
                                clockRate: el.speed / 1000
                            }))
                        );
                        break;
                    }
                    case '--homedir' : {
                        console.log(os.homedir());
                        break;
                    }
                    case '--username' : {
                        console.log(os.userInfo().username);
                        break;
                    }
                    case '--architecture' : {
                        console.log(os.arch());
                        break;
                    }
                    default: {
                        console.log('Invalid input');
                    }
                }
                break;
            }
            case 'hash' : {
                hashFile(currentPath, param1);
                break;
            }
            case 'compress' : {
                compressFile(currentPath, param1, param2);
                break;
            }
            case 'decompress' : {
                decompressFile(currentPath, param1, param2);
                break;
            }
            case '.exit': {
                readline.close();
                // process.exit();
                break;
            }
            default: {
                console.log('Invalid input');
            }
        }

    } catch (e) {
        if (e.message === invalidParamsMes) {
            console.log('Invalid input');
        } else {
            console.log('Operation failed');
        }
    }
    showCurrentPath(currentPath);
});

function parseLine(input) {
    const params = input?.trim().split(' ').map(el => el.trim()).filter(el => !!el);
    return {
        command: params[0],
        param1: params[1],
        param2: params[2]
    };
}

function getAbsolutePath(currentPath, userPath) {
    return path.isAbsolute(userPath) ? path.join(userPath) : path.join(currentPath, userPath)
}

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

function compressFile(currentPath, path_to_file, path_to_destination) {
    if (!path_to_file) {
        throw new Error(invalidParamsMes);
    }
    if (!path_to_destination) {
        path_to_destination = path_to_file + '.br';
    }
    const readStream = fs.createReadStream(path_to_file);
    const writeStream = fs.createWriteStream(path_to_destination);

    const brotli = zlib.createBrotliCompress();

   readStream
       .pipe(brotli)
       .pipe(writeStream)
       .on('finish', () => {
        console.log('Done compressing');
    });
}

function decompressFile(currentPath, path_to_file, path_to_destination) {
    if (!path_to_file || !path_to_destination) {
        console.log('no parameters')
        return;
    }

// Create read and write streams
    const readStream = fs.createReadStream(path_to_file);
    const writeStream = fs.createWriteStream(path_to_destination);

// Create brotli decompress object
    const brotli = zlib.createBrotliDecompress();

// Pipe the read and write operations with brotli decompression
    const stream = readStream.pipe(brotli).pipe(writeStream);

    stream.on('finish', () => {
        console.log('Done decompressing');
    });
}
