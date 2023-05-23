
const PrimaryLicenseContract = artifacts.require('./PrimaryLicenseContract.sol');

module.exports = function(deployer) {
  deployer.deploy(PrimaryLicenseContract);
};

