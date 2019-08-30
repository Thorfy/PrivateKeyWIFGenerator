const sha256 = require('js-sha256');
const base58 = require('bs58');

const max = Buffer.from("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140", 'hex');  
let isInvalid = true;  
let privateKey; 
privateKey= Buffer.from("00FFFFFF00000000000000000000000000000000000000000000000000000000", 'hex');   
//privateKey = secureRandom.randomBuffer(32);
  

createPrivateKeyWIF(privateKey);

function createPrivateKeyWIF(privateKey) {
  	
  	const step1 = Buffer.from("80" + privateKey.toString('hex'), 'hex');
  	const step2 = sha256(step1);
  	const step3 = sha256(Buffer.from(step2, 'hex'));
  	const checksum = step3.substring(0, 8);
	const step4 = step1.toString('hex') + checksum;
  	const privateKeyWIF = base58.encode(Buffer.from(step4,"hex"));

	
	console.log('> Private key: '+ privateKey.toString('hex'));
	console.log('> step1: '+ step1.toString('hex'));
  	console.log('> step2: '+ step2);
  	console.log('> step3: '+ step3);
  	console.log('> checksum: '+ checksum);
  	console.log('> step4: '+ step4);
  	console.log('> privateKeyWIF: '+ privateKeyWIF);
  	
  	return privateKeyWIF;
}