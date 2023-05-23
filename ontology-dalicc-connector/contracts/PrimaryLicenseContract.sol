pragma solidity >=0.5.0 <0.7.0;

contract Owned {
  address owner;
 
  constructor() public {
    owner = msg.sender;
  }
 
  modifier onlyOwner {
    require(msg.sender == owner, "Only Owner can do this operation");
    _;
  }
 
}

 contract License is Owned {

  mapping(uint => address) private licensors;
  string public uri;

  constructor(address _owner, string memory _uri) public {
       owner = _owner;
       uri = _uri;
  }

  function checkValidity(uint hash) public view  returns(address) {
     return licensors[hash];
  }

  function addHash(uint hash, address licensor) onlyOwner public {
       require(licensors[hash] == address(0) || licensors[hash] == licensor,
                "Only the licensor can update his license");
      licensors[hash] = licensor;
  }
 
  function deleteHash(uint hash, address licensor) onlyOwner public {
        require(licensors[hash] == licensor,
       "Only the licensor can delete his license");
        licensors[hash] = address(0);
     }

}

contract LicenseManager is License {

     mapping(string => address) private licenseUris;
     constructor (address _owner) License (_owner, uri) public {
         owner = _owner;
     }

    function getLicenseContract(string memory uri) public view returns(address) {
        return licenseUris[uri];
    }
 

   function getOrCreateLicenseForUri(string memory uri)  onlyOwner public returns(address) {

     address addressOfLicense = licenseUris[uri];
     if(addressOfLicense == address(0)) {
           addressOfLicense = address(new License(owner, uri));
           licenseUris[uri] = addressOfLicense;
         }
      return addressOfLicense;
    }
}


contract PrimaryLicenseContract {

  event modifiedLicense(uint indexed hash, string uri);
  mapping(uint => address) private hashes;
  LicenseManager licenseManager = new LicenseManager(address(this));

 function licenseData(uint hash, string memory uri) public {

     address addressOfLicense = hashes[hash];
     if(addressOfLicense != address(0)) {
          
          License retreivedLicense = License(addressOfLicense);
          require(retreivedLicense.checkValidity(hash) == msg.sender, "Only the licensor can update his license");
          retreivedLicense.deleteHash(hash, msg.sender);

        }
   
         addressOfLicense = licenseManager.getOrCreateLicenseForUri(uri);
         License retreivedLicense = License(addressOfLicense);
         retreivedLicense.addHash(hash, msg.sender);
         hashes[hash] = addressOfLicense;
         emit modifiedLicense(hash, uri); 
  }

  function getLicenseInfo(uint hash) public view returns(bool, string memory, address) {
      address addressOfLicense = hashes[hash];
      if(addressOfLicense == address(0)) {
                     return (false, "", address(0));
          
            }
            
          License retreivedLicense = License(addressOfLicense);
          return (true, retreivedLicense.uri(), retreivedLicense.checkValidity(hash));
          
     }
 }
