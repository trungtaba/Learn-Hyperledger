'use strict';

import config from './config';
import { OrganizationClient } from './utils';
import http from 'http';
import url from 'url';

let status = 'down';
let statusChangedCallbacks = [];

// Setup clients per organization
const auctioneerClient = new OrganizationClient(
    config.channelName,
    config.orderer0,
    config.auctioneerOrg.peer,
    config.auctioneerOrg.ca,
    config.auctioneerOrg.admin
);
const memberClient = new OrganizationClient(
    config.channelName,
    config.orderer0,
    config.memberOrg.peer,
    config.memberOrg.ca,
    config.memberOrg.admin
);

function setStatus(s) {
    status = s;

    setTimeout(() => {
        statusChangedCallbacks
            .filter(f => typeof f === 'function')
            .forEach(f => f(s));
    }, 1000);
};

function getAdminOrgs() {
    return Promise.all([
        auctioneerClient.getOrgAdmin(),
        memberClient.getOrgAdmin(),
    ]);
}

(async () => {
    //login
    try {
        auctioneerClient.login();
        memberClient.login();
    } catch (e) {
        console.log('Fatal error logging into blockchain organization clients!');
        console.log(e);
        process.exit(-1);
    }

    // Setup event hubs
    auctioneerClient.initEventHubs();
    memberClient.initEventHubs();

    // Bootstrap blockchain network
    try {
        await getAdminOrgs();
        if (!(await auctioneerClient.checkChannelMembership())) {
            console.log('Default channel not found, attempting creation...');
            const createChannelResponse =
                await auctioneerClient.createChannel(config.channelConfig);
            if (createChannelResponse.status === 'SUCCESS') {
                console.log('Successfully created a new default channel.');
                console.log('Joining peers to the default channel.');
                await Promise.all([
                    auctioneerClient.joinChannel(),
                    memberClient.joinChannel()
                ]);
                // Wait for 10s for the peers to join the newly created channel
                await new Promise(resolve => {
                    setTimeout(resolve, 10000);
                });
            }
        }
    } catch (e) {
        console.log('Fatal error bootstrapping the blockchain network!');
        console.log(e);
        process.exit(-1);
    }

    // Initialize network
    try {
        await Promise.all([
            auctioneerClient.initialize(),
            memberClient.initialize()
        ]);
    } catch (e) {
        console.log('Fatal error initializing blockchain organization clients!');
        console.log(e);
        process.exit(-1);
    }

    // Install chaincode on all peers
    let installedOnAuctioneerOrg, installedOnMemberOrg;
    try {
        await getAdminOrgs();
        installedOnAuctioneerOrg = await auctioneerClient.checkInstalled(
            config.chaincodeId, config.chaincodeVersion, config.chaincodePath);
        installedOnMemberOrg = await memberClient.checkInstalled(
            config.chaincodeId, config.chaincodeVersion, config.chaincodePath);
    } catch (e) {
        console.log('Fatal error getting installation status of the chaincode!');
        console.log(e);
        process.exit(-1);
    }

    if (!(installedOnAuctioneerOrg && installedOnMemberOrg)) {
        console.log('Chaincode is not installed, attempting installation...');
        // Install chaincode
        const installationPromises = [
            auctioneerClient.install(
                config.chaincodeId, config.chaincodeVersion, config.chaincodePath),
            memberClient.install(
                config.chaincodeId, config.chaincodeVersion, config.chaincodePath),
        ];

        try {
            await Promise.all(installationPromises);
            await new Promise(resolve => { setTimeout(resolve, 10000); });
            console.log('Successfully installed chaincode on the default channel.');
        } catch (e) {
            console.log('Fatal error installing chaincode on the default channel!');
            console.log(e);
            process.exit(-1);
        }
        // Instantiate chaincode on all peers
        // Instantiating the chaincode on a single peer should be enough (for now)
        try {
            // Initial contract types
            await auctioneerClient.instantiate(config.chaincodeId,
                config.chaincodeVersion, null);
            console.log('Successfully instantiated chaincode on all peers.');
            setStatus('ready');
        } catch (e) {
            console.log('Fatal error instantiating chaincode on some(all) peers!');
            console.log(e);
            process.exit(-1);
        }
    } else {
        console.log('Chaincode already installed on the blockchain network.');
        setStatus('ready');
    }
}) ();

// Export organization clients
export {
    auctioneerClient,
    memberClient
};