const os = require('os');

function showEOL() {
    console.log(JSON.stringify(os.EOL));
}

function showCpusInfo() {
    const cpus = os.cpus();
    console.log(`amount = ${cpus.length}`);
    console.table(
        os.cpus().map((el, index) => ({
            index: index + 1,
            model: el.model,
            clockRate: el.speed / 1000
        })));
}

function showHomedir() {
    console.log(os.homedir());
}

function showUsername() {
    console.log(os.userInfo().username);
}

function showArchitecture() {
    console.log(os.arch());
}
module.exports = {
    showEOL,
    showArchitecture,
    showCpusInfo,
    showHomedir,
    showUsername
}