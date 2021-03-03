# Reverse records


## How to setup

```
git clone https://github.com/ensdomains/reverse-records
cd reverse-records
cp secrets.json.example .secrets.json // Add your mnemonic, infura project id, and etherscan key
yarn
```

## CLI

```
yarn query:ropsten 0x123...,0x234...
```

## Smart contract API

### getNames([address])

Returns an array of string. If the given address does not have reverse record or forward record setup, it returns empty string


## Deployed contract address

- Ropsten: [0xCfc4DEA077C09aF8A41389466c63A382F7D335F6](https://ropsten.etherscan.io/address/0xCfc4DEA077C09aF8A41389466c63A382F7D335F6)