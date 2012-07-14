/*
 * pass code to be uglified in this pattern:
 * 	code to be compressed: 
 *  --compress file1.js
 *  code to keep:
 *  --keep file2.js
 *  
 * e.g. node main.js --compress file1.js --keep file2.js --keep file3.js --compress file4.js
 * 
 */


var uglify = require("./uglify-js");
var fs = require('fs');
var compress_code = '';
var keep_code = '';
var final_code = '';

for(var i = 2; i < process.argv.length; i += 2) {
	orig_code = fs.readFileSync(process.argv[i+1]);
	if(process.argv[i] === '--keep') {
		keep_code += ';'+orig_code;
	} else if(process.argv[i] === '--compress') {
		compress_code += orig_code;
	}
}

process.stdout.write(uglify(compress_code) + keep_code);
