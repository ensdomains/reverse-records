// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.7.4;pragma experimental ABIEncoderV2;
import "hardhat/console.sol";
import "./Namehash.sol";
import '@ensdomains/ens/contracts/ENS.sol';
import '@ensdomains/ens/contracts/ReverseRegistrar.sol';
import '@ensdomains/resolver/contracts/Resolver.sol';

// This is the main building block for smart contracts.
contract ReverseRecords {

    ENS ens;
    ReverseRegistrar registrar;
    bytes32 public constant ADDR_REVERSE_NODE = 0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2;

    /**
     * Contract initialization.
     *
     * The `constructor` is executed only once when the contract is created.
     */
    constructor(ENS _ens) {
        ens = _ens;
        registrar = ReverseRegistrar(ens.owner(ADDR_REVERSE_NODE));
    }

    /**
     * Read only function to return ens name only if both forward and reverse resolution are set
     *
     * The `view` modifier indicates that it doesn't modify the contract's
     * state, which allows us to call it without executing a transaction.
     */
    function getNames(address[] calldata addresses) external view returns (string[] memory r) {
        console.log("hello world");
        r = new string[](addresses.length);
        for(uint i = 0; i < addresses.length; i++) {
            bytes32 node = node(addresses[i]);
            console.logBytes32(node);
            address resolverAddress = ens.resolver(node);
            if(resolverAddress != address(0x0)){
                Resolver resolver = Resolver(resolverAddress);
                console.log("3");
                string memory name = resolver.name(node);
                console.log("4. name %s", name);
                bytes32 namehash = Namehash.namehash(name);
                console.logBytes32(namehash);
                address forwardResolverAddress = ens.resolver(namehash);
                if(forwardResolverAddress != address(0x0)){
                    Resolver forwardResolver = Resolver(forwardResolverAddress);
                    address forwardAddress = forwardResolver.addr(namehash);
                    if(forwardAddress == addresses[i]){
                        r[i] = name;
                    }
                }
            }
        }
        return r;
    }



    function node(address addr) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(ADDR_REVERSE_NODE, sha3HexAddress(addr)));
    }

    function sha3HexAddress(address addr) public pure returns (bytes32 ret) {
        addr;
        ret; // Stop warning us about unused variables
        assembly {
            let lookup := 0x3031323334353637383961626364656600000000000000000000000000000000

            for { let i := 40 } gt(i, 0) { } {
                i := sub(i, 1)
                mstore8(i, byte(and(addr, 0xf), lookup))
                addr := div(addr, 0x10)
                i := sub(i, 1)
                mstore8(i, byte(and(addr, 0xf), lookup))
                addr := div(addr, 0x10)
            }

            ret := keccak256(0, 40)
        }
    }
}