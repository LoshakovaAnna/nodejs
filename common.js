const path = require('path');

function getAbsolutePath(currentPath, userPath) {
    return path.isAbsolute(userPath) ? path.join(userPath) : path.join(currentPath, userPath);
}
const invalidParamsMes = 'No correct params';

module.exports = {
    invalidParamsMes,
    getAbsolutePath
};