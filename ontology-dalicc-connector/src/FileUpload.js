import React, { Fragment, useState, useEffect} from 'react';
import axios from 'axios';
import getWeb3 from "./getWeb3";
import DaliccConnectorContract from './contracts/PrimaryLicenseContract.json';
import axioss from './http';
import Handlebars from "handlebars";
import transactionTmp from './semantic_mapping/transactions.tmp';
import DataTable  from 'react-data-table-component';


const FileUpload = (SmartContract)  => {
 
  const initialValue = [{id:0, value: " --- Select a State ---" }];
 // const [postOut, setPostOut] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState(null);
 // const [initialized, setInitialized] = useState(false);
  const [licenseOutput, setLicenseOutput] = useState();
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [selectOptions, setSelectedOption] = useState(initialValue);
  const [title, setTitle] = useState('');
  const [uri, setUri] = useState('');
  const [fileContent, setFileContent] = useState({});
  const [alreadyLicense, setAlreadyLicense] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState('');
  const [isLicensed, setIsLicensed] = useState('');
  const [blockNumber, setBlockNumber] = useState('');
 // const [tx, setTx] = useState([]);
  const [_to, setTo] = useState('');
  const [_from, setFrom] = useState('');
 // const [_receipts, setReceipt] = useState([]);
  const [receipt, getReceipt] = useState();
  const [txValue, setTxValue] = useState('');
  const [tx_nonce, setTxNonce] = useState('');
  const [tx_hash, setTxHash] = useState('');
  const [tx_to, setTxTo] = useState('');
  const [tx_from, setTxFrom] = useState('');
  const [gas, settxGas] = useState('');
  const [gasPrice, setTxGasPrice] = useState('');
  const [block_number, setNumber] = useState('');
  const [block_hash, setBlocktHash] = useState('');
  const [parentHash, setParentHash] = useState('');
  const [block_nonce, setBlockNonce] = useState('');         
  const [sha3Uncles, setSha3Uncles] = useState('');         
  const [logsBloom, setLogsaBloom] = useState('');         
  const [transactionRoot, setTransactionRoot] = useState('');         
  const [stateRoot, setStateRoot] = useState('');         
  const [miner, setMiner] = useState('');         
  const [difficulty, setDifficulty] = useState('');         
  const [extraData, setExtraData] = useState('');         
  const [size, setSize] = useState('');         
  const [gasLimit, setGasLimit] = useState('');         
  const [gasUsed, setGasUsed] = useState('');         
  const [timestamp, setTimestamp] = useState('');  
  const [totalDifficulty, setTotal] = useState(''); 
  const [source, setSource] = useState(''); 
  const [combined, setCombined] = useState([]); 
//  const [ethResult, setEthResul] = useState([]);
//  const [triple, setTriple] = useState('');
 // const [receiptsArray, setReceiptsArray] = useState([]);
  const columns = [

    { name: 'BlockNumber', selector: (row) => row.number }, 
    { name: 'BlockHash', selector: (row) => row.blockHash }, 
    { name: 'BlockNonce', selecttor: (row) => row.blockNonce }, 
    { name: 'BlockSize', selector: (row) => row.blockSize },
    { name: 'blockGasUsed', selector: (row) => row.blockGasUsed },
    { name: 'blockGasLimit', selector: (row) => row.blockGasLimit },
    { name: 'blockExtraData', selector: (row) => row.blockExtraData },
    { name: 'blockDifficulty', selector: (row) => row.blockDifficulty },
    { name: 'tx', selector: (row) => row.tx },
    { name: 'txGasPrice', selector: (row) => row.txGasPrice },
    { name: 'txGasUsed', selector: (row) => row.txGasUsed },
    { name: 'txHash', selector: (row) => row.txHash },
    { name: 'txIndex', selector: (row) => row.txIndex },
    { name: 'txNonce', selector: (row) => row.txNonce },
    { name: 'blockCreationTime', selector: (row) => row.blockCreationTime },
    { name: 'logsBloom', selector: (row) => row.logsBloom },
    { name: 'stateRoot', selector: (row) => row.stateRoot },
    { name: 'sha3Uncles', selector: (row) => row.sha3Uncles }
];
    

  let selectedOptions = [];
  let tx = [];
  let data = null; 
  let _fileContent = null;
  let _licenseOutput = null;
  let userIsOwner = false;
  var config = {
  
    headers: {
       'X-RapidAPI-Key': 'your-rapidapi-key',
       'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
       'Content-Type': 'application/json',
     },
};

  
const init = async() => {

   try {

     const _web3 = await getWeb3();
     const _accounts = await _web3.eth.getAccounts();
     const _networkId = await _web3.eth.net.getId();
     const _blockNumber =  await _web3.eth.getBlockNumber();
     //console.log('BN:'+_blockNumber);
     const _deployedNetwork = DaliccConnectorContract.networks[_networkId];
     const _contract = new _web3.eth.Contract(
                       DaliccConnectorContract.abi,
                       _deployedNetwork && _deployedNetwork.address
                  );
     
     setWeb3(_web3);
     setAccounts(_accounts[0]);
    // console.log('_accounts:::' + _accounts)
     setContract(_contract);
    // setInitialized(true);
     setBlockNumber(_blockNumber);
   
    } catch (error){
       alert('Failed to connect to Web3');    
    }
};

const setContents = () => {
 
   let fileReader = new FileReader();
    fileReader.onload = (e) => {
          
          _fileContent = e.target.result
           setFileContent(_fileContent); 

       };

    fileReader.readAsText(document.getElementById('customFile').files[0]);
    let newFile = document.getElementById('customFile').files[0].name;
    setFilename(newFile);
};


const onChangeInfo = (e) => {

   e.preventDefault();
   data = fileContent;
   SmartContract.getLicenseInformation(data, accounts, (err, result) => {
     if(!err) {
           console.log(result);

      if (!result[0]) {
         
          setMessage('No license detected: Please License Your Data');
          setAlreadyLicense(false);

          } else {

            const tu = getLicenseInfoByUrl(result[1]); 
            setMessage('License detected...');
         
        if (typeof accounts.toLowerCase() === 'string') {

               userIsOwner = result[2].toLowerCase() === accounts.toLowerCase();
                  
               let _isLicensed = 'Licensor: ' + JSON.stringify(result[2]) + '<br />License: <a target="_blank" href="' + JSON.stringify(result[1]) + '">' + JSON.stringify(tu['label']) + '</a>';
               setIsLicensed(_isLicensed);
               setAlreadyLicense(true);
      
           } else {
         
            userIsOwner = false;
        }
        setAlreadyLicense(true);
      }
   
     } else {
     message = 'there is something wrong';
    }
  })
};

const getLicenseInfoByUrl = (url) => {
 
  for (var i = 0; i < selectOptions.length; i += 1) {
    
     if (selectOptions[i].uri === url) {
          return selectOptions[i];
        }
      }
  
  };

const nextOpt = (parentDOM) => {
  
    var i = parentDOM.selectedIndex; 
    const _uri = parentDOM.options[++i%parentDOM.options.length].value;
     setUri(_uri);
  
 };
 
const handleChange = () => {   
   
   const parentDOM = document.getElementById('list');

     if (parentDOM.value.charAt(0) === parentDOM.value.charAt(0).toUpperCase()) { 
          nextOpt(parentDOM);   
          setTitle(parentDOM.value);
    }      
};

 
const  waitForReceipt = (e) => {

  e.preventDefault();
  let receipts = []
  let counter = 0;
  let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  var _receipt = null;
  
  while ((_receipt = web3.eth.getTransactionReceipt(licenseOutput)) === null) {
      if (counter++ > 120) {
          break;
        }
     
     sleep.sleep(10);
  }
 
 getReceipt(_receipt);
 fetch(transactionTmp).then(response => {
       const promise = Promise.resolve(response.text());
       promise.then(value => {
            let _source = value;
            setSource(_source);
        })
   })

  _receipt.then(receipt => {
 
  // const _blockHash = receipt.blockHash;
   const _blockNumber = receipt.blockNumber;
   const _to = receipt.to;
   const _from = receipt.from;
   const _gasUsed = receipt.gasUsed;
   const _transactionHash = receipt.transactionHash;
   const _transactionIndex = receipt.transactionIndex;
   const _logs = receipt.logs
   const _status = receipt.status;
   const _cumulativeGasUsed = receipt.cumulativeGasUsed;
   const template = Handlebars.compile(source);

   receipts.push({
        'transactionHash': _transactionHash,
        'transactionIndex': _transactionIndex,
        'cumulativeGasUsed' : _cumulativeGasUsed,
        'block_gasUsed': _gasUsed,
        'status': _status,
        'tx_hash': tx_hash,
        'tx_nonce': tx_nonce,
        'block_number': block_number,
        'block_nonce': block_nonce,
        'from': tx_from,
        'to': tx_to,
        'gas': gas,
        'gasPrice': gasPrice,
        'value': txValue,
        'number' : _blockNumber,
        'block_hash': block_hash,
        'parentHash': parentHash,
        'sha3Uncles': sha3Uncles,
        'logsBloom': logsBloom,
        'transactionRoot': transactionRoot,
        'stateRoot': stateRoot,
        'difficulty': difficulty,
        'totalDiffculty': totalDifficulty,
        'gasLimit': gasLimit,
        'gasUsed': gasUsed,
        'timestamp': timestamp,
        'miner': miner,
        'extraData': extraData,
        'size': size,
    })
  
   //setReceipt(receipts); 
     setFrom(_from);
     setTo(_to); 

   //console.log(triple)
   
   // setReceiptsArray(receipts);
      tripleize(receipts, template); 
   })

   //console.log(receiptsArray)
   

};


const tripleize = async (data, template) => {

  let properties = {

    number: data[0].number,
    block_nonce: data[0].tx_nonce,
    block_hash: data[0].block_hash,
    parentHash: data[0].parentHash,
    sha3Uncles: data[0].sha3Uncles,
    logsBloom: data[0].logsBloom, 
    transactionRoot: data[0].transactionRoot,  
    stateRoot: data[0].stateRoot,   
    miner: data[0].miner,    
    difficulty: data[0].difficulty,
    totalDifficulty: data[0].totalDifficulty,  
    gasLimit: data[0].gasLimit,  
    gasUsed: data[0].gasUsed,  
    cumulativeGasUsed: data[0].cumulativeGasUsed,
    timestamp: data[0].timestamp,  
    tx_hash: data[0].transactionHash,    
    tx_nonce: data[0].tx_nonce,   
    blockNumber: data[0].number,   
    value: data[0].value,        
    gas: data[0].gas,         
    gasPrice: data[0].gasPrice,          
    status: data[0].status,       
    transactionIndex: data[0].transactionIndex,   
    from: data[0].from,              
    to: data[0].to, 
    miner: data[0].miner,
    size: data[0].size,
    extraData: data[0].extraData,                         
  };

  
   let _triple = template(properties);           
   //setTriple(_triple);
   //console.log(_triple)
    axioss.post('http://localhost:5000', JSON.stringify(_triple.split(' . ')), config)
   
 };


const getYourReceipt = async (e) => {
    e.preventDefault();
    axioss.get ('http://localhost:5000')
          .then (response => {
         setCombined(response.data);
     })
    
};

const onLicensing = async (e) => {
     e.preventDefault();
     if (alreadyLicense === false) {
     
     data = fileContent;
     SmartContract.licenseData(data, uri, accounts, (err, result) => {
    
      if(!err) {
        
        _licenseOutput = result;
        web3.eth.getTransaction(result).then(res => {

               setTxValue(res.value)
               setTxNonce(res.nonce)
               setTxTo(res.to)
               setTxFrom(res.from)
               settxGas(res.gas)
               setTxGasPrice(res.gasPrice)
               setTxHash(res.hash)
          })

        web3.eth.getBlock(blockNumber).then(block => {
           
             setNumber(block.number);
             setBlocktHash(block.hash);
             setParentHash(block.parentHash);
             setBlockNonce(block.nonce);
             setSha3Uncles(block.sha3Uncles);
             setLogsaBloom(block.logsBloom);
             setTransactionRoot(block.transactionsRoot);
             setStateRoot(block.stateRoot);
             setDifficulty(block.difficulty);
             setTotal(block.totalDifficulty);
             setExtraData(block.extraData);
             setSize(block.size);
             setGasLimit(block.gasLimit);
             setGasUsed(block.gasUsed);
             setTimestamp(block.timestamp);
             setMiner(block.miner);

       });
      
      setLicenseOutput(_licenseOutput);
    
        } else {
            _licenseOutput = "Something wrong in license data!!!"
             setLicenseOutput(_licenseOutput);
          }   
       })
    } 
   
    else {
         setVerifiedUser(isLicensed);
    }
     
 }

axios.get('sparql.json', {
  
      headers: {
          'Content-Type': 'application/json'
         }
     }).then(res => {

      const licenses = res.data.results.bindings;   
      selectedOptions = licenses.map(license => ({
              
              "label" : license.title.value,
              "uri" : license.uri.value,
        })) 
      
      setSelectedOption(selectOptions => [selectOptions, ...selectedOptions])
  }); 

  useEffect(() => { 
    init();
  }, [web3, accounts, contract]);



    return (
      <Fragment>
      <form  > 
        <div className="content" >
        <div>
         <select className='custom-select' id="list" onChange={handleChange} defaultValue={'Default'}>
         <option style={{display : 'none'}} disabled> -- select an option -- </option>
            {selectOptions.map((option) =>         
                 ([
                    <option id="labelSelector" value={option.value}>{option.label}</option>,
                    <option style={{display : 'none'}} id="uriSelector" value={option.value}>{option.uri}</option>   
                 ])
            )}         
         </select> 
         <p>You have selected: {title}</p>
        </div>
        <div className='custom-file mb-4'>
           <input type='file' className='custom-file-input' id='customFile' onChange={setContents} />
           <label className='custom-file-label' htmlFor='customFile'> {filename} </label>
       </div> 

        <input type='submit' value='Check Your Data' onClick={(e) => onChangeInfo(e)} className='btn btn-primary btn-block mt-4'/> 
        <input type='submit' value='License Data/Retrieved Licened Data' onClick={(e) => onLicensing(e)} className='btn btn-primary btn-block mt-4'/> 
        <input type='submit' value='Send Your Receipt' onClick={(e) => waitForReceipt(e)} className='btn btn-primary btn-block mt-4'/> 
        <input type='submit' value='Get Your Receipt' onClick={(e) => getYourReceipt(e)} className='btn btn-primary btn-block mt-4'/> 
      </div>
 
      </form>
      {uploadedFile ? (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
          </div>
        </div>
      ) : null}

      
      <div>LicenseOutput: {licenseOutput}</div>
      <div>Msg: {message}</div>
      <div>VerifiedUser: {verifiedUser}</div>
      <DataTable
        title="Data"
        columns={columns}
        data={combined}
      />
     
    </Fragment>
        
   )
        
  
}


export default FileUpload;
