const fs = require('fs');
const path = require('path');

const copyFiles = (file) => {
	fs.copyFile( 
		path.join(__dirname, 'files', file.name),
		path.join(__dirname, 'files-copy', file.name),
		(err) => {
			if(err) {
				throw err;
			}
		}
		)
}

const readdir = () => {
	fs.readdir( path.join(__dirname, 'files'), { withFileTypes: true }, ( err, files ) => {
		if(err) {
			throw err;
		}
		files.forEach(file => copyFiles(file))
	})
}

const copyDir = () => {
	fs.mkdir( path.join( __dirname, 'files-copy' ), { recursive: true }, (err) => {
		if(err) {
			throw err;
		}
		readdir();
	} )
}


fs.rm( path.join(__dirname,'files-copy'), { recursive: true, force: true }, (err) => { 
  if(err) {
		console.error(err); 
	}
	copyDir();
});
