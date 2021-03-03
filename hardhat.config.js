require("@nomiclabs/hardhat-waffle");
require('@ensdomains/ens');
require('@ensdomains/resolver');
require("@nomiclabs/hardhat-etherscan");

const { mnemonic, infuraId, etherscanKey } = require('./.secrets.json');
const CONTRACTS = {
  'ropsten': '0xCfc4DEA077C09aF8A41389466c63A382F7D335F6'
}

task("names", "query reverse records")
  .addParam("addresses", "List of accounts, comma delimited")
  .setAction(async (taskArgs, hre) => {
    const addresses = taskArgs.addresses.split(',')
    const reverseRecords = await hre.ethers.getContractAt('ReverseRecords', CONTRACTS[hre.network.name])
    console.log(await reverseRecords.getNames(addresses))
  });

module.exports = {
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${infuraId}`,
      chainId: 3,
      gasPrice: 20000000000,
      accounts: {mnemonic: mnemonic}
    },
    // rinkeby: {
    // },
    // goerli: {
    // },
    // mainnet: {
    // }
  },
  etherscan: {
    apiKey: etherscanKey
  },
  solidity: {
    compilers: [
      {
        version: "0.7.4"
      }
    ]
  }
}