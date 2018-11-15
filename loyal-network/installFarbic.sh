function setVersion(){
   # export FABRIC_VERSION=hlfv12
    rm -fr $HOME/.composer
}

function stopFarbic(){
    cd $HYPERLEDGER/library/fabric-dev-servers
    ./stopFabric.sh
}

function startFabric(){
    cd $HYPERLEDGER/library/fabric-dev-servers
    ./downloadFabric.sh
    ./startFabric.sh
    ./createPeerAdminCard.sh
}
export FABRIC_VERSION=hlfv12

setVersion

stopFarbic

startFabric
