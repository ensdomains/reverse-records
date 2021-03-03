# Reverse records


## How to setup

```
git clone https://github.com/ensdomains/reverse-records
cd reverse-records
yarn
```

## CLI

```
yarn query:ropsten 0x123...,0x234...
```

## Smart contract API

### getNames([address])

Returns an array of string. If the given address does not have reverse record or forward record setup, it returns empty string