const sha256 = require('js-sha256');
const ripemd160 = require('ripemd160');
const base58 = require('bs58');
const request = require('request');
const fs = require('fs');

const ec = require("elliptic").ec;
const ecdsa = new ec('secp256k1');
const maxMax = Buffer.from("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140", 'hex');  

let publicKeyArray = [];
let pairKeyArray = [];

var value = "1";
var valueString = "1";
var maxrange = 64;
var finalArray = [];

while(value != "f"){

	while(valueString.length !== 64){
		var nCount = 0;
		var backCount = maxrange - nCount - valueString.length;
		var endString = "";

		while (backCount !== 0){
			backCount = maxrange - nCount - valueString.length;
			endString = addStringToHave64lengthString(valueString, nCount, backCount, value);
			console.log(valueString);
			privateKey = Buffer.from(endString, 'hex');   
    		WIFKey = createPrivateKeyWIF(privateKey);
    		publicHash = createPublicHash(privateKey);
    		publicKey = createPublicAddress(publicHash);
    		publicKeyArray.push(publicKey)
    		pairKeyArray[publicKey] = WIFKey;

			nCount++;
		}
		valueString = valueString + value;
	}
	var valueHex = parseInt(value, 16) + 1;
	value = valueHex.toString(16);
	valueString = value;

}

let uriCounter = 0;
console.log(publicKeyArray.length);
var i,j,temparray,chunk = 60;
for (i=0,j=publicKeyArray.length; i<j; i+=chunk) {
    temparray = publicKeyArray.slice(i,i+chunk);
    // do whatever
	uri = "https://blockchain.info/balance?cors=true&active=" + temparray.join("|");
	request(uri, { json: true }, (err, res, body) => {
		if (err) { return console.log(err); }
		for (let [publicKey, data] of Object.entries(body)) {
			if(data.n_tx){
				console.log(`${pairKeyArray[publicKey]}:  ${data.n_tx} ${data.total_received} ${data.final_balance}`);
				fs.appendFileSync('sample.txt',`${publicKey} - ${pairKeyArray[publicKey]}: ${data.n_tx}  ${data.total_received} ${data.final_balance} \n`, 'utf8');
			} 
		}
	});
	console.log(i);
	uriCounter++;
}
console.log(uriCounter)


function addStringToHave64lengthString(valueString, frontCount, backCount, value){
		
		while(frontCount > 0){
			valueString = "0" + valueString;
			frontCount--;
		}

		while(backCount > 0){
			valueString = valueString + "0";
			backCount--;
		}
		return valueString;
	}


function createPublicHash(privateKey){

	let keys = ecdsa.keyFromPrivate(privateKey);  
	let publicKey = keys.getPublic('hex');  

	let hash = sha256(Buffer.from(publicKey, 'hex'));
	let publicKeyHash = new ripemd160().update(Buffer.from(hash, 'hex')).digest();
	//console.log('> Public hash created: ', publicKeyHash.toString("hex"));

return publicKeyHash.toString("hex");

}
function createPublicAddress(publicKeyHash) {
 	const step1 = Buffer.from("00" + publicKeyHash, 'hex');
  	const step2 = sha256(step1);
  	const step3 = sha256(Buffer.from(step2, 'hex'));
  	const checksum = step3.substring(0, 8);
  	const step4 = step1.toString('hex') + checksum;
  	const address = base58.encode(Buffer.from(step4, 'hex'));

  	//console.log('> Public key created: ',address)
  	return address;
}

function createPrivateKeyWIF(privateKey) {
    
    const step1 = Buffer.from("80" + privateKey.toString('hex'), 'hex');
    const step2 = sha256(step1);
    const step3 = sha256(Buffer.from(step2, 'hex'));
    const checksum = step3.substring(0, 8);
  	const step4 = step1.toString('hex') + checksum;
    const privateKeyWIF = base58.encode(Buffer.from(step4,"hex"));

  
  	//console.log('> Private key: '+ privateKey.toString('hex'));
    //console.log('> privateKeyWIF: '+ privateKeyWIF);
    
    return privateKeyWIF;
} 