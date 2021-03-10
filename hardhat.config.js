require("@nomiclabs/hardhat-waffle");
require('@ensdomains/ens');
require('@ensdomains/resolver');
require("@nomiclabs/hardhat-etherscan");
const dotenv = require("dotenv")
dotenv.config()

const CONTRACTS = {
  'ropsten': '0x5bBFe410e18DCcaebbf5fD7A00844d4255615258',
  'rinkeby': '0x196eC7109e127A353B709a20da25052617295F6f',
  'goerli': '0x333Fc8f550043f239a2CF79aEd5e9cF4A20Eb41e',
  'mainnet': '0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C'
}

const {
  MNEMONIC = '',
  INFURA_ID = '',
  ETHERSCANKEY = ''
} = process.env

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
      gasPrice: 20000000000, // 20 gwei
      accounts: {mnemonic: MNEMONIC}
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
      chainId: 4,
      gasPrice: 20000000000, // 20 gwei
      accounts: {mnemonic: MNEMONIC}
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_ID}`,
      chainId: 5,
      gasPrice: 20000000000, // 20 gwei
      accounts: {mnemonic: MNEMONIC}
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_ID}`,
      chainId: 1,
      gasPrice: 120000000000, // 120 gwei
      accounts: {mnemonic: MNEMONIC}
    }
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