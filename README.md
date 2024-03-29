 # File Manager


File Manager using Node.js APIs.

(No external dependencies; Use 20 LTS version of Node.js)

The file manager able to do the following:

* Work using CLI
* Perform basic file operations (copy, move, delete, rename, etc.)
* Utilize Streams API
* Get information about the host machine operating system
* Perform hash calculations
* Compress and decompress files

The program is started by npm-script start with
```bash
npm run start -- --username=your_username
```

List of operations and their syntax:
- `ctrl + c` pressed or user sent `.exit` - finish program;

- Navigation & working directory (nwd):
  - `up` - go upper from current directory (no upper than the root folder);
  - `cd path_to_directory` - go to dedicated folder from current directory (`path_to_directory` can be relative or absolute)
  - `ls` - print in console list of all files and folders in current directory;

- Basic operations with files
    - `cat path_to_file` - read file and print it's content in console (done using Readable stream):
    - `add new_file_name` - create empty file in current working directory;
    - `rn path_to_file new_filename` - rename file (content remains unchanged);
    - `cp path_to_file path_to_new_directory` - copy file (done using Readable and Writable streams):
    - `mv path_to_file path_to_new_directory` - move file (same as copy but initial file is deleted, 
      copying part done using Readable and Writable streams);
    - `rm path_to_file` - delete file;

- Operating system info (prints following information in console)
    - `os --EOL` - print EOL (default system End-Of-Line);
    - `os --cpus` - print host machine CPUs info (overall amount of CPUS plus model 
      and clock rate (in GHz) for each of them);
    - `os --homedir` - print home directory;
    - `os --username` - print current *system user name* (not  the username that is set when the application starts);
    - `os --architecture` - get CPU architecture for which Node.js binary has compiled and print it to console

- Hash calculation:
    - `hash path_to_file` - calculate hash for file and print it into console;

- Compress and decompress operations
    - `compress path_to_file path_to_destination` - compress file (using Brotli algorithm,  done using Streams API)
    - `decompress path_to_file path_to_destination` - decompress file (using Brotli algorithm, done using Streams API)




After starting the program displays the following text in the console (`Username` is equal to value that was passed 
on application start in `--username` CLI argument)  
  `Welcome to the File Manager, Username!`.

After program work finished (`ctrl + c` pressed or user sent `.exit` command into console) the program 
displays the following text in the console  
  `Thank you for using File Manager, Username, goodbye!`.

At the start of the program and after each end of input/operation 
current working directory will be printed in following way:  
  `You are currently in path_to_working_directory`.

Starting working directory is current user's home directory
(for example, on Windows it's something like `system_drive/Users/Username`).

By default program will prompt user in console to print commands and wait for results.

In case of unknown operation or invalid input (missing mandatory arguments, wrong data in arguments, etc.) 
`Invalid input` message will be shown and user will be able to enter another command.

In case of error during execution of operation `Operation failed` message will be shown and 
user will be able to enter another command (e.g. attempt to perform an operation on a non-existent file 
or work on a non-existent path will result in the operation fail).

User can't go upper than root directory (e.g. on Windows it's current local drive root). 
If user tries to do so, current working directory doesn't change



## Documentation links

* Node.js [documentation](https://nodejs.org/en/docs/);
* npm [documentation](https://docs.npmjs.com/);
* [run scripts](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager)

### Process

* https://nodejs.org/api/process.html
* get arguments from script - argv https://nodejs.org/api/process.html#processargv
* https://nodejs.org/api/process.html#processenv
* https://nodejs.org/api/process.html#event-exit

### Read command line - readline
`const rl = require('readline');`

1) [Accept input from the command line in Node.js](https://nodejs.org/en/learn/command-line/accept-input-from-the-command-line-in-nodejs)
2) [readline docs](https://nodejs.org/api/readline.html)
3) [line](https://nodejs.org/api/readline.html#rlline)
4) [question](https://nodejs.org/api/readline.html#rlquestionquery-options)
5) [clear line](https://nodejs.org/api/readline.html#rlclearlinedir)
6) [close](https://nodejs.org/api/readline.html#rlclose)


### Path
`const path = require('path');`
* [Node.js File Paths](https://nodejs.org/en/learn/manipulating-files/nodejs-file-paths)
* [path docs](https://nodejs.org/api/path.html)
* [path.join()](https://nodejs.org/api/path.html#pathjoinpaths)
* [path.resolve([...paths])](https://nodejs.org/api/path.html#pathresolvepaths)

### File system
`const fs = require('fs');`

* [Working with folders in Node.js](https://nodejs.org/en/learn/manipulating-files/working-with-folders-in-nodejs)
  - `fs.access(), fsPromises.access()`  - check if the folder exists and Node.js can access it with its permissions.
  - `fs.mkdir() or fs.mkdirSync() or fsPromises.mkdir()` to create a new folder.
  - `fs.readdir() or fs.readdirSync() or fsPromises.readdir()` to read the contents of a directory.
  - `fs.rename() or fs.renameSync() or fsPromises.rename()` to rename folder
  - `fs.rmdir() or fs.rmdirSync() or fsPromises.rmdir()` to remove a folder;
   { recursive: true, force: true }  to recursively remove the contents. and makes it so that exceptions will be ignored if the folder does not exist..
  - 
  - `fs.unlink(path, callback) fs .unlinkSync(path) fsPromises.unlink(path)` - to delete File
    `fs.closeSync(fs.openSync(copyPath, 'w'));`  

* [fs docs](https://nodejs.org/api/fs.html)
* [fs.existsSync(path)](https://nodejs.org/api/fs.html#fsexistssyncpath)
* []()

* [Working with file descriptors in Node.js](https://nodejs.org/en/learn/manipulating-files/working-with-file-descriptors-in-nodejs)
``` bash
fs.open('/Users/joe/test.txt', 'r', (err, fd) => {
  // fd is our file descriptor
  r | r+ | w+ |a | a+
});
```
* [Reading files with Node.js](https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs)
 ` fs.readFile(), fs.readFileSync() and fsPromises.readFile()` read the full content of the file in memory before returning the data.
* [Writing files with Node.js](https://nodejs.org/en/learn/manipulating-files/writing-files-with-nodejs)
`fs.writeFile()  fs.writeFileSync() fsPromises.writeFile()` -replace content
* [Appending content to a file](https://nodejs.org/en/learn/manipulating-files/writing-files-with-nodejs#appending-content-to-a-file)
  `fs.appendFile()  fs.appendFileSync() fsPromises.appendFile()`
  https://nodejsdev.ru/api/stream/#_2
``` bash
  const readStream = fs.createReadStream('filePath');
  const compressStream = zlib.createGzip();
  const writeStream = fs.createWriteStream('filePath');

  let i =0;
   readStream.on('data', (chunk) => {
     console.log('---------');
     console.log(i);
     i++;
     writeStream.write('\n ---CHUNK START--- \n');
     writeStream.write(chunk);
     writeStream.write('\n ---CHUNK END--- \n');
   });
 

const handleError = ()=> {
    console.log('Error');
    readStream.destroy();
    writeStream.end('Finished with error...');
}

or
readStream
.on('error', handleError)
.pipe(compressStream)
.pipe(writeStream)
.on('error', handleError)
```

* Readable streams
https://imnotgenius.com/25-potoki-dannyh-v-node-js-fs-readstream/
* 
https://nodejs.org/api/fs.html#fscreatereadstreampath-options
https://nodejs.org/api/stream.html#readable-streams

### HASH
* https://nodejs.org/api/crypto.html
* [HOW TO GET THE HASH OF A FILE IN NODE.JS](https://ilikekillnerds.com/2020/04/how-to-get-the-hash-of-a-file-in-node-js/)

### compression

* [zlib](https://nodejs.org/api/zlib.html)
* [Streams and Brotli compression in Node.js](https://medium.com/@linoyzaga/streams-and-brotli-compression-in-node-js-fc2507d4d177)

`os.homedir(); // current =  __dirname;`





