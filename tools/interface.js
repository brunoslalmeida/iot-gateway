const ReadLine = require('readline');

interface = {};

_interface = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>'
});

_interface.on('close', _ => process.exit(0) );

interface.question = (message , callback) => _interface.question(message + '\r\n>', callback);

module.exports = interface;