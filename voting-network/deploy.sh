set -ev

NETWORK_NAME=${PWD##*/}
EXTEND_FILE='@.bna'
NETWORK_FILE=$NETWORK_NAME$EXTEND_FILE

composer archive create -t dir -n .
composer network install --card PeerAdmin@hlfv1 --archiveFile voting-network@0.0.1.bna
composer network start --networkName voting-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
composer card import --file networkadmin.card
composer network ping --card admin@voting-network