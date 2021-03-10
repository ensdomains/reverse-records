# Reverse records


## How to setup

```
git clone https://github.com/ensdomains/reverse-records
cd reverse-records
cp env.example .env // Add your mnemonic, infura project id, and etherscan key
yarn
```

## CLI

```
yarn query:ropsten 0x123...,0x234...
```

## Smart contract API

### getNames([address])

Returns an array of string. If the given address does not have a reverse record or forward record setup, it returns an empty string.

## Usage note

Make sure to compare that the returned names match with the normalised names to prevent from [homograph attack](https://en.wikipedia.org/wiki/IDN_homograph_attack)

Example

```js
const namehash = require('eth-ens-namehash');
const allnames = await ReverseRecords.getNames(['0x123','0x124'])
const validNames = allnames.filter((n) => namehash.normalize(n) === n )
```


## Deployed contract address

- Ropsten: [0x72c33B247e62d0f1927E8d325d0358b8f9971C68](https://ropsten.etherscan.io/address/0x72c33B247e62d0f1927E8d325d0358b8f9971C68)
- Rinkeby: [0x196eC7109e127A353B709a20da25052617295F6f](https://rinkeby.etherscan.io/address/0x196eC7109e127A353B709a20da25052617295F6f)
- Goerli: [0x333Fc8f550043f239a2CF79aEd5e9cF4A20Eb41e](https://goerli.etherscan.io/address/0x333Fc8f550043f239a2CF79aEd5e9cF4A20Eb41e)
- Mainnet: [0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C](https://etherscan.io/address/0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C)
