const sha256 = require('js-sha256');
const ripemd160 = require('ripemd160');
const base58 = require('bs58');
const request = require('request');

const ec = require("elliptic").ec;
const ecdsa = new ec('secp256k1');
const max = Buffer.from("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140", 'hex');  


Number.prototype.prefixWith2String = function(s,n) {
    var num = this.toString(16);
    while(num.length < n) {
        num = s + num;
    }
    return num;
};


let privateKeyString = "0000000000000000000000000000000000000000000000000000000000000001"; 

NbRep = 0;

let publicKeyArray = [];

while (NbRep < 128) {
  privateKeyString = nextKey(privateKeyString);
  privateKey = Buffer.from(privateKeyString, 'hex');   
  WIFKey = createPrivateKeyWIF(privateKey);
  publicHash = createPublicHash(privateKey);
  publicKey = createPublicAddress(publicHash);
  publicKeyArray.push(publicKey)
  NbRep++;
}

uri = "https://blockchain.info/balance?cors=true&active=" + encodeURIComponent(publicKeyArray.join("|"));
console.log('> Blockchain info: ',uri);


function createPublicHash(privateKey){

	let keys = ecdsa.keyFromPrivate(privateKey);  
	let publicKey = keys.getPublic('hex');  

	let hash = sha256(Buffer.from(publicKey, 'hex'));
	let publicKeyHash = new ripemd160().update(Buffer.from(hash, 'hex')).digest();
	console.log('> Public hash created: ', publicKeyHash.toString("hex"));

return publicKeyHash.toString("hex");

}
function createPublicAddress(publicKeyHash) {
 	const step1 = Buffer.from("00" + publicKeyHash, 'hex');
  	const step2 = sha256(step1);
  	const step3 = sha256(Buffer.from(step2, 'hex'));
  	const checksum = step3.substring(0, 8);
  	const step4 = step1.toString('hex') + checksum;
  	const address = base58.encode(Buffer.from(step4, 'hex'));

  	console.log('> Public key created: ',address)
  	return address;
}

function createPrivateKeyWIF(privateKey) {
    
    const step1 = Buffer.from("80" + privateKey.toString('hex'), 'hex');
    const step2 = sha256(step1);
    const step3 = sha256(Buffer.from(step2, 'hex'));
    const checksum = step3.substring(0, 8);
  	const step4 = step1.toString('hex') + checksum;
    const privateKeyWIF = base58.encode(Buffer.from(step4,"hex"));

  
  	console.log('> Private key: '+ privateKey.toString('hex'));
    console.log('> privateKeyWIF: '+ privateKeyWIF);
    
    return privateKeyWIF;
} 
 function nextKey(key){
  key = parseInt(key, 16);
  key++;
  console.log(key);
  key = key.prefixWith2String('0', 64);
  console.log(key);
  return key 
 } 

