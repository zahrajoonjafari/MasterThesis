import Web3 from "web3";
const HDWalletProvider = require('@truffle/hdwallet-provider');
const PrivateKeyProvider = require("truffle-privatekey-provider");


const getWeb3 = () =>
  new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);        
        try {
          await window.ethereum.enable();
          resolve(web3);
        } catch (error) {
          reject(error);
        }

        
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        const web3 = new Web3(window.web3.currentProvider);
            window.ethereum = {
                enable: async () => {
                    return true;
                }
            };
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const privateKey = '01cbf768ea7fcb7654cf1933269f1c0f5d6e245f6b8750048e08241acc613f37';
        const provider = new HDWalletProvider(privateKey, "https://sepolia.infura.io/v3/0a556544fcc3479d8cc8f01d68b0f289");

       const web3 = new Web3(provider);
        try {
            await window.ethereum.enable();
              resolve(web3);
          } catch (error) {
               reject(error);
          }
      }
    });
  });

export default getWeb3;
