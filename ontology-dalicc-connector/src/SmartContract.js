import React, { useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import DaliccConnectorContract from './contracts/PrimaryLicenseContract.json'
import getWeb3 from "./getWeb3";


 const SmartContract = () => {

  const crypto = require("crypto");
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [blockNumber, setBlockNumber] = useState('');
  let hash = null;
  let data = null;
  let f = null;
  let uri = null;
  let address = null;
  const init = async() => {
    try {
     
    const _web3 = await getWeb3();
    const _accounts = await _web3.eth.getAccounts();
    const _networkId = await _web3.eth.net.getId();
    const _blockNumber = await _web3.eth.getBlockNumber();
    const _deployedNetwork = DaliccConnectorContract.networks[_networkId];
    
    const _contract = new _web3.eth.Contract(
      DaliccConnectorContract.abi,
      _deployedNetwork && _deployedNetwork.address
      );


    setWeb3(_web3);
    setAccounts(_accounts);
    setContract(_contract);
    setBlockNumber(_blockNumber); 
    setInitialized(true);
   
    } catch (error){ 
       alert('Failed to connect to Web3 in smart contract');    
    }
};

   const licenseData = async (data, uri, address, f) => {
     if (initialized) {
       hash = crypto.createHash('sha256'); 
       
        await contract.methods.licenseData('0x' + hash.update(data).digest('hex').toString(), uri).send({from: address}, f);  
           
        } 
      };  
     
  const getLicenseInformation = async (data, address, f) => {     
     if (initialized) {    
         hash = crypto.createHash('sha256'); 
        
          await contract.methods.getLicenseInfo('0x' + hash.update(data).digest('hex').toString()).call({from: address}, f);   
        // setLicenseInfo(_licenseInfo); 
       
        } 
      };
   
      
       
        useEffect(() => { 
          init();
        }, [web3, accounts, contract]);
      
        useEffect(() => {
          return () => getLicenseInformation(data, address, f);
        }, [web3, accounts, contract] );
        
        useEffect(() => {
          return () => licenseData(data, uri, address, f);
        }, [web3, accounts, contract]);
        
       

   return (
     <div>
       
      <FileUpload
        
         web3={web3}
         contract={contract}
         accounts={accounts}
         getLicenseInformation={getLicenseInformation}
         licenseData={licenseData}

       />
  
     </div>
      
    );
 
}


export default SmartContract;
