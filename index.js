const path = require('path');
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


let currentPath = os.homedir(); // current =  __dirname;
showCurrentPath(currentPath);

function showCurrentPath(currentPath) {
    console.log(`You are currently in ${currentPath}`);
}

const readline = require('node:readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

readline.on('line', (input) => {
    let cdCase = '';
    try {
        if (/^cd /.test(input)) {
            cdCase = input;
            currentPath = moveToFolder(currentPath, input);
        }
        if (/^cat /.test(input)) {
            readFileAndPrint(currentPath, input);
        }
        if (/^add /.test(input)) {
            crateFile(currentPath, input);
        }
        if (/^rn /.test(input)) {
            renameFile(currentPath, input);
        }

        if (/^rm /.test(input)) {
            deleteFile(currentPath, input)
        }
        if (/^cp /.test(input)) {
            copyFile(currentPath, input)
        }
        if (/^mv /.test(input)) {
            moveFile(currentPath, input)
        }
        if (/^hash /.test(input)) {
            hashFile(currentPath, input)
        }
        if (/^compress /.test(input)) {
            compressFile(currentPath, input)
        }
        if (/^decompress /.test(input)) {
            decompressFile(currentPath, input)
        }

        switch (input) {
            case 'up': {
                currentPath = upNavigation(currentPath);
                break;
            }
            case 'ls': {
                showFolderContentList(currentPath);
                break;
            }
            case 'os --EOL' : {
                console.log(JSON.stringify(os.EOL));
                break;
            }
            case 'os --cpus' : {
                const cpus = os.cpus();
                console.log(`amount = ${cpus.length}`);
                console.table(
                    os.cpus().map((el, index) => ({index: index + 1, model: el.model, clockRate: el.speed / 1000}))
                );
                break;
            }
            case 'os --homedir' : {
                console.log(os.homedir());
                break;
            }
            case 'os --username' : {
                console.log(os.userInfo().username);
                break;
            }
            case 'os --architecture' : {
                console.log(os.arch());
                break;
            }
            case cdCase:
                break;
            case '.exit': {
                readline.close();
                // process.exit();
                break;
            }
            default: {
                console.log('Invalid input'); //fix
            }
        }

    } catch (e) {
        console.log('Operation failed') //, e)
    }
    showCurrentPath(currentPath);
});


function upNavigation(currentPath) {
    return path.join(currentPath, '../');
    // console.log(currentPath, fs.existsSync(currentPath))
    // fs.access() fs.existsSync(folderName) -  to check if the folder exists and Node.js can access it with its permissions.
    // fs.mkdir() or fs.mkdirSync() or fsPromises.mkdir() to create a new folder.


}

function showFolderContentList(currentPath) {
    // fs.readdir(currentPath,(er, s)=>{
    //     console.log('LS DOESN\'T WORK', er)
    //     console.log(s)
    // })
    let list = fs.readdirSync(currentPath, {withFileTypes: true});// []Dirent
    // console.log(list[0])
    list = list.map(el => {
        return {name: el.name, type: el.isDirectory() ? 'directory' : 'file'}
        //     try {
        //         fs.stat(path.join(currentPath, el),(e,p)=>{
        //            if (p) console.log(p.isDirectory())
        //         }).isDirectory());
        //     }catch (e) {
        //         console.log(el)
        //     }
    }).sort((el1, el2) => {
        if (el1.type !== el2.type) {
            return el1.type === 'directory' ? -1 : 1;
        }
        return el1.name > el2.name ? 1 : -1
    });
    console.table(list)
    // console.log(fs.readdirSync(currentPath));
    //fs.readdir()-asycn or fs.readdirSync()-sycn or fsPromises.readdir()
    // //to read the contents of a directory.
}

function moveToFolder(currentPath, cdCommand) {
    const userPath = cdCommand.split('cd ')[1].trim();
    if (!!userPath) {
        // console.log('rel:', path.join(currentPath, userPath),
        //     fs.existsSync(path.join(currentPath, userPath)));
        if (fs.existsSync(path.join(currentPath, userPath))) {
            return path.join(currentPath, userPath);
        }
        // console.log('abs:', path.join(userPath), fs.existsSync(path.join(userPath)));
        if (fs.existsSync(path.join(userPath))) {
            return path.join(userPath);
        }

    }
    console.log('Wrong path!')
    return currentPath;
}

function readFileAndPrint(currentPath, input) {
    //fs.readFile(), fs.readFileSync() and fsPromises.readFile()
    // const readStream = fs.createReadStream('./docs/text.txt');
// readStream.on('data', (chunk) => {
//   console.log('---------');
//   console.log(i);
//   i++;
//   writeStream.write('\n ---CHUNK START--- \n');
//   writeStream.write(chunk);
//   writeStream.write('\n ---CHUNK END--- \n');
// });
//     const readStream = fs.readFileSync();

    const userPath = input.trim().split('cat ')[1].trim();
    if (!userPath) {
        console.log('Wrong path!')
        return;
    }
    const filePath = fs.existsSync(path.join(currentPath, userPath))
        ? path.join(currentPath, userPath)
        : fs.existsSync(path.join(userPath)) ? path.join(userPath) : '';
    if (!filePath) {
        console.log('Wrong path!')
        return;
    }

    let data = fs.readFileSync(filePath, {encoding: 'utf8', flag: 'r'});
    console.log(data)
    // console.log("\n\nThe content of the file is \n\n"+data);
    // console.log("Completed reading file1");

}

function crateFile(currentPath, input) {
    const fileName = input.trim().split('add ')[1].trim();
    if (!fileName) {
        console.log('wrong value')
        return
    }
    const filePath = path.join(currentPath, fileName);
    // fs.existsSync(path.join(currentPath, fileName))
    //     ? path.join(currentPath, fileName)
    //     : fs.existsSync(path.join(fileName)) ? path.join(fileName) : '';
    // if (!filePath) {
    // fs.openSync(fileName)

    // try {
    //The fs.open method opens a file asynchronously.
    fs.closeSync(fs.openSync(filePath, 'w'));

    console.log(`File ${filePath} was created!`)
    // } catch (err) {
    //     // 👇️ EEXIST: file already exists, open './my-file.txt'
    //     console.log(err.message);
    // }
}

function renameFile(currentPath, input) {
    const paths = input.trim().split('rn ')[1].trim();
    const [oldName, newName] = paths.split(' ');
    console.log(oldName, newName)
    // fs.rename(p1, p2, callbackify)
    fs.renameSync(
        oldName,
        newName,
        // () => {
        //     console.log("\nFile Renamed!\n");
        //     // List all the filenames after renaming
        //     // getCurrentFilenames();
        // }
    );
    console.log(`\nFile Renamed!\n new name: ${newName}`);
}

function deleteFile(currentPath, input) {
    //fs.unlink or fs.unlinkSync
    const userPath = input.trim().split('rm ')[1].trim();
    if (!userPath) {
        console.log('Wrong path!')
        return;
    }
    const filePath = fs.existsSync(path.join(currentPath, userPath))
        ? path.join(currentPath, userPath)
        : fs.existsSync(path.join(userPath)) ? path.join(userPath) : '';
    if (!filePath) {
        console.log('Wrong path!')
        return;
    }
    fs.unlinkSync(filePath);
    console.log(`File ${filePath} deleted`)

}

function copyFile(currentPath, input) {
    //cp path_to_file path_to_new_directory

    const paths = input.trim().split('cp ')[1].trim();
    const [initFilePath, copyPath] = paths.split(' ');
    if (!initFilePath || !copyPath) {
        console.log('no correct params')
        return;
    }
    const filePath = fs.existsSync(path.join(currentPath, initFilePath))
        ? path.join(currentPath, initFilePath)
        : fs.existsSync(path.join(initFilePath)) ? path.join(initFilePath) : '';
    if (!filePath) {
        console.log('Wrong path!')
        return;
    }

    let data = fs.readFileSync(filePath, {encoding: 'utf8', flag: 'r'});
    fs.closeSync(fs.openSync(copyPath, 'w'));
    fs.writeFileSync(copyPath, data);
}

// mv path_to_file path_to_new_directory
function moveFile(currentPath, input) {
    //cp path_to_file path_to_new_directory

    const paths = input.trim().split('mv ')[1].trim();
    const [initFilePath, copyPath] = paths.split(' ');
    if (!initFilePath || !copyPath) {
        console.log('no correct params')
        return;
    }
    const filePath = fs.existsSync(path.join(currentPath, initFilePath))
        ? path.join(currentPath, initFilePath)
        : fs.existsSync(path.join(initFilePath)) ? path.join(initFilePath) : '';
    if (!filePath) {
        console.log('Wrong path!')
        return;
    }

    let data = fs.readFileSync(filePath, {encoding: 'utf8', flag: 'r'});
    fs.closeSync(fs.openSync(copyPath, 'w'));
    fs.writeFileSync(copyPath, data);
    fs.unlinkSync(filePath);
}

function hashFile(currentPath, input) {
    const userPath = input.trim().split('hash ')[1].trim();
    if (!userPath) {
        console.log('Wrong path!')
        return;
    }
    const filePath = fs.existsSync(path.join(currentPath, userPath))
        ? path.join(currentPath, userPath)
        : fs.existsSync(path.join(userPath)) ? path.join(userPath) : '';
    if (!filePath) {
        console.log('Wrong path!')
        return;
    }
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);

    const hex = hashSum.digest('hex');

    console.log(hex);
}

function compressFile(currentPath, input) {
    //compress path_to_file path_to_destination
    const userPath = input.trim().split('compress ')[1].trim();
    let [path_to_file, path_to_destination] = userPath.split(' ');
    if (!path_to_file) {
        console.log('no parameters')
        return;
    }
    if (!path_to_destination) {
        path_to_destination = path_to_file + '.br';
    }
    // Create read and write streams
    const readStream = fs.createReadStream(path_to_file);
    const writeStream = fs.createWriteStream(path_to_destination);

// Create brotli compress object
    const brotli = zlib.createBrotliCompress();

// Pipe the read and write operations with brotli compression
    const stream = readStream.pipe(brotli).pipe(writeStream);

    stream.on('finish', () => {
        console.log('Done compressing 😎');
    });
}

function decompressFile(currentPath, input) {
//decompress path_to_file path_to_destination
    const userPath = input.trim().split('decompress ')[1].trim();
    let [path_to_file, path_to_destination] = userPath.split(' ');
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
        console.log('Done decompressing 😎');
    });
}

// // readline.
// readline.question(``, (v) => {
//     console.log(v)
//     // console.log(`Hi ${name}!`);
//     // readline.close();
// });
// process.stdin.
// const repl = require('node:repl');
// const local = repl.start('$ ');
// local.on('exit', () => {
//     console.log('exiting repl');
//     process.exit();
// });