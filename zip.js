const fs = require('fs')
const zlib = require('zlib');

const  {invalidParamsMes, getAbsolutePath} = require('./common');


function compressFile(currentPath, path_to_file, path_to_destination) {
    if (!path_to_file) {
        throw new Error(invalidParamsMes);
    }
    if (!path_to_destination) {
        path_to_destination = path_to_file + '.br';
    }
    const readStream = fs.createReadStream(getAbsolutePath(currentPath, path_to_file));
    const writeStream = fs.createWriteStream(getAbsolutePath(currentPath, path_to_destination));

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
    const readStream = fs.createReadStream(getAbsolutePath(currentPath, path_to_file));
    const writeStream = fs.createWriteStream(getAbsolutePath(currentPath, path_to_destination));

// Create brotli decompress object
    const brotli = zlib.createBrotliDecompress();

// Pipe the read and write operations with brotli decompression
    const stream = readStream.pipe(brotli).pipe(writeStream);

    stream.on('finish', () => {
        console.log('Done decompressing');
    });
}
module.exports = {
    compressFile,
    decompressFile
}
