const path = require("path");
const privateKey = "01cbf768ea7fcb7654cf1933269f1c0f5d6e245f6b8750048e08241acc613f37";
const mnemonic = "split axis exist miracle have input kite stock laugh govern property call"; 
const HDWalletProvider = require("@truffle/hdwallet-provider");
const PrivateKeyProvider = require("truffle-privatekey-provider");
const pp = '01cbf768ea7fcb7654cf1933269f1c0f5d6e245f6b8750048e08241acc613f37';


module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*"
    }
  }

};



module.exports = {
    
  networks: {
     sepolia: {  
      provider: () => 
      new HDWalletProvider(
        privateKey,
          'https://sepolia.infura.io/v3/0a556544fcc3479d8cc8f01d68b0f289'
       ),
         network_id: 11155111, 
         confirmations: 1, 
         timeoutBlocks: 200, 
         skipDryRun: true, 
    }
      
  }
};




