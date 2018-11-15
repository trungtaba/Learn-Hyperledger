function setVersion(){
   # export FABRIC_VERSION=hlfv12
    rm -fr $HOME/.composer
}

function stopFarbic(){
    ./stopFabric.sh
}

function startFabric(){
    cd $HYPERLEDGER/fabric-dev-servers/fabric-dev-servers
    ./downloadFabric.sh
    ./startFabric.sh
    ./createPeerAdminCard.sh
}
export FABRIC_VERSION=hlfv12

setVersion

stopFabric

startFabric
