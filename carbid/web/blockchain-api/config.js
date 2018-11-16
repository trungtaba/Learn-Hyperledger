import { readFileSync } from 'fs';
import { resolve } from 'path';

const basePath = resolve(__dirname, '../../certs');
const readCryptoFile =
  filename => readFileSync(resolve(basePath, filename)).toString();
const config = {
  channelName: 'default',
  channelConfig: readFileSync(resolve(__dirname, '../../channel.tx')),
  chaincodeId: 'auctioncar',
  chaincodeVersion: 'v1',
  chaincodePath: 'auctioncar',
  orderer0: {
    hostname: 'orderer0',
    url: 'grpcs://orderer0:7050',
    pem: readCryptoFile('ordererOrg.pem')
  },
  auctioneerOrg: {
    peer: {
      hostname: 'auctioneer-peer',
      url: 'grpcs://auctioneer-peer:7051',
      eventHubUrl: 'grpcs://auctioneer-peer:7053',
      pem: readCryptoFile('auctioneerOrg.pem')
    },
    ca: {
      hostname: 'auctioneer-ca',
      url: 'https://auctioneer-ca:7054',
      mspId: 'auctioneerOrgMSP'
    },
    admin: {
      key: readCryptoFile('Admin@auctioneer-org-key.pem'),
      cert: readCryptoFile('Admin@auctioneer-org-cert.pem')
    }
  },
  memberOrg: {
    peer: {
      hostname: 'member-peer',
      url: 'grpcs://member-peer:7051',
      eventHubUrl: 'grpcs://member-peer:7053',
      pem: readCryptoFile('memberOrg.pem')
    },
    ca: {
      hostname: 'member-ca',
      url: 'https://member-ca:7054',
      mspId: 'memberOrgMSP'
    },
    admin: {
      key: readCryptoFile('Admin@member-org-key.pem'),
      cert: readCryptoFile('Admin@member-org-cert.pem')
    }
  }
};


if (process.env.LOCALCONFIG) {
    config.orderer0.url = 'grpcs://localhost:7050';
  
    config.auctioneerOrg.peer.url = 'grpcs://localhost:7051';
    config.memberOrg.peer.url = 'grpcs://localhost:8051';
  
    config.auctioneerOrg.peer.eventHubUrl = 'grpcs://localhost:7053';
    config.memberOrg.peer.eventHubUrl = 'grpcs://localhost:8053';
  
    config.auctioneerOrg.ca.url = 'https://localhost:7054';
    config.memberOrg.ca.url = 'https://localhost:8054';
  }