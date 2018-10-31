set -ev

composer archive create -t dir -n .
composer network install --card PeerAdmin@hlfv1 --archiveFile loyal-network@0.0.1.bna
composer network start --networkName loyal-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
composer card import --file networkadmin.card
composer network ping --card admin@loyal-network