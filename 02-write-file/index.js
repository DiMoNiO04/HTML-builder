const path = require('path');
const fs = require('fs');
const process = require('process');
const { stdin, stdout } = process;

const CTRL_C = 'CTRL + C';
const EXIT = 'EXIT';


const file = fs.createWriteStream( path.join(__dirname, 'text.txt') );

const exitWrite = (key) => {
	stdout.write(`\nВвод завершен ${key}. Данные сохранены в файл`);
	process.exit();
}

const writeInFile = (chunk) => file.write(chunk, 'utf-8');
const isExit = (chunk) => chunk.toString().trim() === 'exit';


stdout.write('Введите что-нибудь:\n');

stdin.on('data', (chunk) => {
	if(isExit(chunk)) {
		exitWrite(EXIT);
	} else {
		writeInFile(chunk)
	}
});

process.on('SIGINT', () => exitWrite(CTRL_C));