require("@nomiclabs/hardhat-waffle");
require('@ensdomains/ens');
require('@ensdomains/resolver');
require("@nomiclabs/hardhat-etherscan");
const dotenv = require("dotenv")
dotenv.config()

const CONTRACTS = {
  'ropsten': '0x72c33B247e62d0f1927E8d325d0358b8f9971C68'
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
      url: `https://ropsten.infura.io/v3/${INFURA_ID}`,
      chainId: 3,
      gasPrice: 20000000000,
      accounts: {mnemonic: MNEMONIC}
    },
    // rinkeby: {
    // },
    // goerli: {
    // },
    // mainnet: {
    // }
  },
  etherscan: {
    apiKey: ETHERSCANKEY
  },
  solidity: {
    compilers: [
      {
        version: "0.7.4"
      }
    ]
  }
}