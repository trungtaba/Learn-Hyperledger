function setVersion(){
    export FABRIC_VERSION=hlfv12
    rm -fr $HOME/.composer
}

function stopFabric(){
    cd $HYPERLEDGER/fabric-dev-servers/fabric-dev-servers
    ./stopFabric.sh
}

function startFabric(){
    cd $HYPERLEDGER/fabric-dev-servers/fabric-dev-servers
    ./downloadFabric.sh
    ./startFabric.sh
    ./createPeerAdminCard.sh
}

setVersion

stopFabric

startFabric
