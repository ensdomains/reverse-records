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

- Ropsten: [0x72c33B247e62d0f1927E8d325d0358b8f9971C68](https://ropsten.etherscan.io/address/0x72c33B247e62d0f1927E8d325d0358b8f9971C68)