const credentials = require('./credentials.js');
const path = require("path");
const prompt = require('prompt-sync')();
const got = require('got');
const DomainChecker = require('./src/DomainChecker.js');
const DomainGenerator = require('./src/DomainGenerator.js');
const FileWriter = require('./src/FileWriter.js');

const generator = new DomainGenerator();
const exporter = new FileWriter();

generator.optMaxLength = prompt(`Enter Max Length limit (8) :`, 8);
generator.optFirstPartLength = prompt(`Enter first part Length  (flexible) :`);
generator.optDomainZone = prompt(`Enter Domain Zone (.com) :`, '.com');
generator.optTwoways = prompt(`Try reverse concatination? y/n (n) :`, 'n');


let rawArr = generator.init();
let checkFlag = prompt(`Check domains on GoDaddy? y/n (n) :`, 'n');
let rusultFilePath;

(async() => {
    if (checkFlag == "n") {
        console.log(`Checking cancelled.`);
        rusultFilePath = await exporter.writeArray(rawArr, "unchecked");
        exit();
        return;
    }
    const checker = new DomainChecker(credentials.secret, credentials.key);
    let checkedArr = await checker.groupCheck(rawArr);
    let fields = ['domain', 'available', 'price'];
    rusultFilePath = await exporter.writeArray(checkedArr, 'checked', fields);
    exit();

})();

function exit() {
    console.log('Press any key to exit');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
}