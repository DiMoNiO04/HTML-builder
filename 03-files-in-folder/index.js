const fs = require('fs');
const path = require('path');


fs.readdir( path.join(__dirname, 'secret-folder'), { withFileTypes: true }, ( err, files ) => {
	if(err) {
		throw err;
	} else {
		console.log('\nФайлы директории:\n');
		files.forEach( file => {
			if(file.isFile()) {
				let fileName = file.name.split('.')[0];
				let fileExtend = file.name.split('.')[1];

				fs.stat( path.join(__dirname, 'secret-folder', file.name), (err, file) => {
					if(err) {
						throw err;
					}
					let fileSize = file.size / 1024;
					console.log(`${fileName} - ${fileExtend} - ${fileSize}KB `)
				});
			}
		})
	}
})