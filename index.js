const rl = require('readline');
const os = require('os');

const {invalidParamsMes} = require('./common');
const {
    upNavigation,
    showFolderContentList,
    moveToFolder
} = require('./navigation');
const {
    readFileAndPrint,
    createFile,
    deleteFile,
    renameFile,
    copyFile,
    moveFile
} = require('./files');
const {hashFile} = require('./hash');
const {compressFile, decompressFile} = require('./zip');
const {
    showEOL,
    showArchitecture,
    showCpusInfo,
    showHomedir,
    showUsername
} = require('./os');

const argv = process.argv;
const username = argv.find(el => el.includes('--username='))?.split('--username=')[1] || '';

console.log(`Welcome to the File Manager, ${username}!`);

process.on('exit', () => {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
})


const mainObj = {
    currentPath: os.homedir(),
    cliRun: function () {
        showCurrentPath(this.currentPath);
        const readline = rl.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        readline.on('line', (input) => {
            const {command, param1, param2} = parseLine(input);
            try {
                const f = getCommandF(command);
                if (f) {
                    const res = f(this.currentPath, param1, param2);
                    if (typeof res === 'string') {
                        this.currentPath = res;
                    }
                } else {
                    console.log('Invalid input');
                }
            } catch (e) {
                console.log(e)
                if (e.message === invalidParamsMes) {
                    console.log('Invalid input');
                } else {
                    console.log('Operation failed');
                }
            }
            showCurrentPath(this.currentPath);
        });
    }
}

mainObj.cliRun();

function showCurrentPath(currentPath) {
    console.log(`You are currently in ${currentPath}`);
}

function parseLine(input) {
    const params = input?.trim().split(' ').map(el => el.trim()).filter(el => !!el);
    return {
        command: params[0],
        param1: params[1],
        param2: params[2]
    };
}

function getCommandF(command) {
    const map = new Map();
    map.set('up', upNavigation);
    map.set('cd', moveToFolder);
    map.set('ls', showFolderContentList);
    map.set('cat', readFileAndPrint);
    map.set('add', createFile);
    map.set('rn', renameFile);
    map.set('cp', copyFile);
    map.set('mv', moveFile);
    map.set('rm', deleteFile);
    map.set('os', getOsF);
    map.set('hash', hashFile);
    map.set('compress', compressFile);
    map.set('decompress', decompressFile);
    map.set('.exit', function () {
        //readline.close();
        process.exit();
    });

    return map.get(command);
}

function getOsF(...params) {
    if (!params || !params[1]) {
        throw new Error(invalidParamsMes);
    }
    const map = new Map();
    map.set('--EOL', showEOL);
    map.set('--cpus', showCpusInfo);
    map.set('--homedir', showHomedir);
    map.set('--username', showUsername);
    map.set('--architecture', showArchitecture);
    const f = map.get(params[1]);
    f ? f() : console.log('Invalid input');
}
