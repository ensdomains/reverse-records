const { expect } = require("chai");
const namehash = require('eth-ens-namehash');

function sha3(name){
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name))
}

async function assertReverseRecord(ens, address){
  const reverseNode = `${address.slice(2)}.addr.reverse`
  let reverseResolverAddress, reverseResolver, reverseRecord, forwardResolverAddress, forwardResolver, forwardAddress
  try{
    reverseResolverAddress = await ens.resolver(namehash.hash(reverseNode))
    reverseResolver = await ethers.getContractAt('PublicResolver', reverseResolverAddress)
    reverseRecord = await reverseResolver.name(namehash.hash(reverseNode))
    forwardResolverAddress = await ens.resolver(namehash.hash(reverseRecord))  
    forwardResolver = await ethers.getContractAt('PublicResolver', forwardResolverAddress)
    forwardAddress = await forwardResolver['addr(bytes32)'](namehash.hash(reverseRecord))  
  }catch(e){
    console.log(e)
  }
  return address === forwardAddress
}

describe("ReverseRecords contract", function() {
    let node, ens, resolver, registrar, ethNode
    before(async () => {
      const [owner, fooAddr, barAddr, bazAddr] = await ethers.getSigners();
      ethNode = namehash.hash('eth')
      node = namehash.hash(owner.address.slice(2).toLowerCase() + ".addr.reverse");
      const ENSRegistry = await ethers.getContractFactory("ENSRegistry");
      const PublicResolver = await ethers.getContractFactory("PublicResolver");
      const ReverseRegistrar = await ethers.getContractFactory("ReverseRegistrar");
      ens = await ENSRegistry.deploy();
      resolver = await PublicResolver.deploy(ens.address);
      registrar = await ReverseRegistrar.deploy(ens.address, resolver.address);
      console.log(1, fooAddr.address, barAddr.address, bazAddr.address)
      await ens.setSubnodeOwner(namehash.hash(''), sha3('eth'), owner.address);
      await ens.setSubnodeOwner(namehash.hash(''), sha3('reverse'), owner.address);
    　await ens.setSubnodeOwner(namehash.hash('reverse'), sha3('addr'), registrar.address);
      console.log(1.2)
    })
        
    it("Reverse record", async function() {
      const [owner, fooAddr, barAddr, bazAddr] = await ethers.getSigners();
      const PublicResolver = await ethers.getContractFactory("PublicResolver");
      const resolverArtifact = await hre.artifacts.readArtifact("PublicResolver")
      await ens.setSubnodeOwner(namehash.hash('eth'), sha3('foo'), fooAddr.address);
      await ens.setSubnodeOwner(namehash.hash('eth'), sha3('bar'), barAddr.address);
      await ens.setSubnodeOwner(namehash.hash('eth'), sha3('baz'), bazAddr.address);
      await ens.connect(fooAddr).setResolver(namehash.hash('foo.eth'), resolver.address)
      await ens.connect(barAddr).setResolver(namehash.hash('bar.eth'), resolver.address)
      await ens.connect(bazAddr).setResolver(namehash.hash('baz.eth'), resolver.address)
      await await resolver.connect(fooAddr)['setAddr(bytes32,address)'](namehash.hash('foo.eth'), fooAddr.address);
      await await resolver.connect(barAddr)['setAddr(bytes32,address)'](namehash.hash('bar.eth'), barAddr.address);
      await registrar.connect(fooAddr).setName('foo.eth')
      await registrar.connect(bazAddr).setName('baz.eth')

      expect(await assertReverseRecord(ens, fooAddr.address)).to.be.true
      // no reverse record set
      expect(await assertReverseRecord(ens, barAddr.address)).to.be.false
      // no forward record set
      expect(await assertReverseRecord(ens, bazAddr.address)).to.be.false
      
      const ReverseRecords = await ethers.getContractFactory("ReverseRecords");

      const reverseRecords = await ReverseRecords.deploy(ens.address);
      const results = await reverseRecords.getNames([fooAddr.address, barAddr.address, bazAddr.address]);
      expect(results[0]).to.equal('foo.eth');
      expect(results[1]).to.equal('');
      expect(results[2]).to.equal('');
  });
});