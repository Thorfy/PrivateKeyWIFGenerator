const fs = require('fs');

let rawdata = fs.readFile('sample3.txt','utf8',(err, data) => {
  if (err) throw err;
  var parsedRow = data.split('\n');
  console.log(parsedRow);
  var bigArray = [];
  parsedRow.map(row => {
  	var rowArray = row.split(' - ');
  	bigArray.push({
  		"private":rowArray[0],
  		"wif":rowArray[1],
  		"public":rowArray[2],
  	});
  })
  console.log(bigArray);
});