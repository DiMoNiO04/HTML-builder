const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');


//Создадим переменные путей
const pathDist = path.join( __dirname, 'project-dist' );
const pathAssets = path.join(__dirname, 'assets');
const pathStyles = path.join(__dirname, 'styles');
const pathAssetsNew = path.join(__dirname, 'project-dist', 'assets');
const pathComponents = path.join( __dirname, 'components' );
const pathTemplete = path.join( __dirname, 'template.html' );
const pathIndex = path.join(__dirname, 'project-dist', 'index.html');


//Создаем папку 'project-dist'
fs.mkdir( pathDist, { recursive: true, force: true }, err => {
	if(err) {
		throw err;
	}
})


//Cчитываем компоненты 
const pattern = /{{(.*?)}}/g;
const read = fs.createReadStream(pathTemplete);
const write = fs.createWriteStream(pathIndex);

//Прочтение и сохранение в переменной файла-шаблона
async function readdirComponents() {
  const files = await fsPromises.readdir(pathComponents);
  const components = {};
  for (const file of files) {
    const key = file.split('.')[0];
    const code = await fsPromises.readFile(path.join(pathComponents, `${key}.html`));
    components[key] = code.toString();
  }
  return components;
}

//Замена шаблонных тегов содержимым файлов-компонентов
read.on('data', async (chunk) => {
	const components = await readdirComponents();
	let chunks = chunk.toString();
	let match;
	while((match = pattern.exec(chunk)) !== null) {
		chunks = chunks.replace(`{{${match[1]}}}`, components[match[1]]);
	}
	// Запись изменённого шаблона в файл index.html в папке project-dist
	write.write(chunks);
})


//Копируем папку assets
function copyDirectory(pathOld, pathNew) {
	fs.mkdir( pathNew, { recursive: true, force: true }, err => {
		if(err) {
			throw err;
		}
	})
	fs.readdir( pathOld, { withFileTypes: true }, ( err, files ) => {
		if(err) {
			throw err;
		}
		files.forEach(file => {
			if(file.isFile()) {
				fs.copyFile( path.join( pathOld, file.name ), path.join( pathNew, file.name ), (err) => {
					if(err) {
						throw err;
					}
				})
			}	else {
				copyDirectory( path.join( pathOld, file.name ), path.join( pathNew, file.name ) );
			}
		})
	})
}

copyDirectory( pathAssets, pathAssetsNew );


//Собираем банд стилей из задания 05-merge-styles
const writeStream = fs.createWriteStream( path.join(__dirname, 'project-dist', 'style.css') );

fs.readdir( pathStyles, { withFileTypes: true }, ( err, files ) => {
	if(err) {
		throw err;
	}
	files.forEach(file => {
		if( file.isFile() && path.extname(file.name) === '.css') {
			readStream = fs.createReadStream( path.join( pathStyles, file.name ) );
			readStream.pipe(writeStream);
		}
	})
} )
