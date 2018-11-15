set -ev

rm -rf loyal-network@*

composer archive create -t dir -n .
composer network install --card PeerAdmin@hlfv1 --archiveFile loyal-network@0.0.1.bna
composer network start --networkName loyal-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
composer card import --file networkadmin.card
composer network ping --card admin@loyal-network

#composer-rest-server -c admin@loyal-network   -n never -u true -d y -w true