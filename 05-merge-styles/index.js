const fs = require('fs');
const path = require('path');

const writeStream = fs.createWriteStream( path.join(__dirname, 'project-dist', 'bundle.css') );

fs.readdir( path.join(__dirname, 'styles'), { withFileTypes: true }, ( err, files ) => {
	if(err) {
		throw err;
	}
	files.forEach(file => {
		if(file.isFile() && path.extname(file.name)==='.css') {
			readStream = fs.createReadStream( path.join( path.join(__dirname, 'styles'), file.name ) );
			readStream.pipe(writeStream);
		}
	})
} )