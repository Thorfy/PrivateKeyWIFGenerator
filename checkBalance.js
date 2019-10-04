const request = require('request');
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
  var count = 0;
  var countMax = 0;
  var tempArray = [];
  var publicArray = [];


  for (var i = 0; i < bigArray.length; i++) {
  	data = bigArray[i];
  	if (i > 100000) {
    	//break;
  	}

	count++;
  	countMax++;
  	console.log(countMax);
  	tempArray[data.public]= data.wif;
  	publicArray.push(data.public);
  	if(count > 123){  		
  		uri = "https://blockchain.info/balance?cors=true&active=" + publicArray.join("|");
  		
  			request(uri, { json: true }, (err, res, body) => {
				if (err) { return console.log(err); }
				if (res == "Invalid Bitcoin Address") { return console.log(err); }
				//console.log(body)
				for (let [publicKey, data] of Object.entries(body)) {
					if(data.n_tx){
						console.log(`${tempArray[publicKey]} - ${publicKey}:  ${data.n_tx} ${data.total_received} ${data.final_balance}`);
						fs.appendFileSync('sample4.txt',`${tempArray[publicKey]} - ${publicKey}:  ${data.n_tx} ${data.total_received} ${data.final_balance} \n`, 'utf8');

					} 
				}
			}); 
  		//console.log(uri);
		
		count = 0;
		publicArray = [];

  	}
  }
});
