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
    // console.log(e)
  }
  return address === forwardAddress
}

describe("ReverseRecords contract", function() {
    let node, ens, resolver, registrar, ethNode
    before(async () => {
      const [owner] = await ethers.getSigners();
      ethNode = namehash.hash('eth')
      node = namehash.hash(owner.address.slice(2).toLowerCase() + ".addr.reverse");
      const ENSRegistry = await ethers.getContractFactory("ENSRegistry");
      const PublicResolver = await ethers.getContractFactory("PublicResolver");
      const ReverseRegistrar = await ethers.getContractFactory("ReverseRegistrar");
      ens = await ENSRegistry.deploy();
      resolver = await PublicResolver.deploy(ens.address);
      registrar = await ReverseRegistrar.deploy(ens.address, resolver.address);
      await ens.setSubnodeOwner(namehash.hash(''), sha3('eth'), owner.address);
      await ens.setSubnodeOwner(namehash.hash(''), sha3('reverse'), owner.address);
    　await ens.setSubnodeOwner(namehash.hash('reverse'), sha3('addr'), registrar.address);
    })
        
    it("Reverse record", async function() {
      // aAddr: correct
      // bAddr: no reverse record set
      // cAddr: not the owner of c.eth
      // dAddr: ower of d.eth but no resolver set
      // eAddr: ower of e.eth and resolver set but no forward address set
      // fAddr: set empty string to reverse record
      // gAddr: correct
      // hAddr: set resolver as an EOA
      // iAddr: set resolver with a wrong interface
      const [owner, aAddr, bAddr, cAddr, dAddr, eAddr, fAddr, gAddr, hAddr, iAddr] = await ethers.getSigners();
      const PublicResolver = await ethers.getContractFactory("PublicResolver");
      const resolverArtifact = await hre.artifacts.readArtifact("PublicResolver")
      await ens.setSubnodeOwner(namehash.hash('eth'), sha3('a'), aAddr.address);
      await ens.setSubnodeOwner(namehash.hash('eth'), sha3('b'), bAddr.address);
      // No c
      await ens.setSubnodeOwner(namehash.hash('eth'), sha3('d'), dAddr.address);
      await ens.setSubnodeOwner(namehash.hash('eth'), sha3('e'), eAddr.address);
      await ens.setSubnodeOwner(namehash.hash('eth'), sha3('f'), fAddr.address);
      await ens.setSubnodeOwner(namehash.hash('eth'), sha3('g'), gAddr.address);
      await ens.setSubnodeOwner(namehash.hash('eth'), sha3('h'), hAddr.address);
      await ens.setSubnodeOwner(namehash.hash('eth'), sha3('i'), iAddr.address);

      await ens.connect(aAddr).setResolver(namehash.hash('a.eth'), resolver.address)
      await ens.connect(bAddr).setResolver(namehash.hash('b.eth'), resolver.address)
      // No c
      // No d
      await ens.connect(eAddr).setResolver(namehash.hash('e.eth'), resolver.address)
      await ens.connect(fAddr).setResolver(namehash.hash('f.eth'), resolver.address)
      await ens.connect(gAddr).setResolver(namehash.hash('g.eth'), resolver.address)
      // Set the resolver to a non contract address
      await ens.connect(hAddr).setResolver(namehash.hash('h.eth'), hAddr.address)

      await ens.connect(iAddr).setResolver(namehash.hash('i.eth'), resolver.address)

      // Setting forward records
      await await resolver.connect(aAddr)['setAddr(bytes32,address)'](namehash.hash('a.eth'), aAddr.address);
      await await resolver.connect(bAddr)['setAddr(bytes32,address)'](namehash.hash('b.eth'), bAddr.address);
      // No c
      // No d
      // No e
      await await resolver.connect(fAddr)['setAddr(bytes32,address)'](namehash.hash('f.eth'), fAddr.address);
      await await resolver.connect(gAddr)['setAddr(bytes32,address)'](namehash.hash('g.eth'), gAddr.address);

      await await resolver.connect(iAddr)['setAddr(bytes32,address)'](namehash.hash('i.eth'), iAddr.address);

      // Setting reverse record
      await registrar.connect(aAddr).setName('a.eth')
      // No reverse record set on b
      await registrar.connect(cAddr).setName('c.eth')
      await registrar.connect(dAddr).setName('d.eth')
      await registrar.connect(eAddr).setName('e.eth')
      await registrar.connect(fAddr).setName('')
      await registrar.connect(gAddr).setName('g.eth')
      await registrar.connect(hAddr).setName('h.eth')
      await registrar.connect(iAddr).setName('i.eth')

      const ReverseRecords = await ethers.getContractFactory("ReverseRecords");
      const reverseRecords = await ReverseRecords.deploy(ens.address);

      // Set a good resolver to a contract that doesn't support the function
      await ens.connect(iAddr).setResolver(namehash.hash('i.eth'), reverseRecords.address)

      const results = await reverseRecords.getNames([
        aAddr.address,
        bAddr.address,
        cAddr.address,
        dAddr.address,
        eAddr.address,
        fAddr.address,
        gAddr.address,
        hAddr.address,
        iAddr.address
      ]);

      expect(await assertReverseRecord(ens, aAddr.address)).to.be.true
      expect(results[0]).to.equal('a.eth');
      expect(await assertReverseRecord(ens, bAddr.address)).to.be.false
      expect(results[1]).to.equal('');
      expect(await assertReverseRecord(ens, cAddr.address)).to.be.false
      expect(results[2]).to.equal('');
      expect(await assertReverseRecord(ens, dAddr.address)).to.be.false
      expect(results[3]).to.equal('');
      expect(await assertReverseRecord(ens, eAddr.address)).to.be.false
      expect(results[4]).to.equal('');
      expect(await assertReverseRecord(ens, fAddr.address)).to.be.false
      expect(results[5]).to.equal('');
      expect(await assertReverseRecord(ens, gAddr.address)).to.be.true
      expect(results[6]).to.equal('g.eth');
      expect(await assertReverseRecord(ens, hAddr.address)).to.be.false
      expect(results[7]).to.equal('');
      expect(await assertReverseRecord(ens, iAddr.address)).to.be.false
      expect(results[8]).to.equal('');
    });
});