#!/bin/sh
set -e

echo
echo "#################################################################"
echo "#######        Generating cryptographic material       ##########"
echo "#################################################################"

PROJPATH=$(pwd)
SCRIPTPATH=$PROJPATH/crypto-script
CLIPATH=$PROJPATH/cli/peers
ORDERERS=$CLIPATH/ordererOrganizations
PEERS=$CLIPATH/peerOrganizations

rm -rf $CLIPATH
#create genesis block and put it to $CLIPATH
$SCRIPTPATH/cryptogen generate --config=$PROJPATH/crypto-config.yaml --output=$CLIPATH

./generate-cfgtx.sh

rm -rf $PROJPATH/{orderer,auctioneerPeer,memberPeer}/crypto
# mkdir  $PROJPATH/{orderer,auctioneerPeer,memberPeer}
mkdir  $PROJPATH/{orderer,auctioneerPeer,memberPeer}/crypto

cp -r $ORDERERS/orderer-org/orderers/orderer0/{msp,tls} $PROJPATH/orderer/crypto
cp -r $PEERS/auctioneer-org/peers/auctioneer-peer/{msp,tls} $PROJPATH/auctioneerPeer/crypto
cp -r $PEERS/member-org/peers/member-peer/{msp,tls} $PROJPATH/memberPeer/crypto
cp $CLIPATH/genesis.block $PROJPATH/orderer/crypto/

AUCTIONEERCAPATH=$PROJPATH/CA/auctioneerCA
MEMBERCAPATH=$PROJPATH/CA/memberCA

rm -rf {$AUCTIONEERCAPATH,$MEMBERCAPATH}/{ca,tls}
mkdir -p {$AUCTIONEERCAPATH,$MEMBERCAPATH}/{ca,tls}

cp $PEERS/auctioneer-org/ca/* $AUCTIONEERCAPATH/ca
cp $PEERS/auctioneer-org/tlsca/* $AUCTIONEERCAPATH/tls
mv $AUCTIONEERCAPATH/ca/*_sk $AUCTIONEERCAPATH/ca/key.pem
mv $AUCTIONEERCAPATH/ca/*-cert.pem $AUCTIONEERCAPATH/ca/cert.pem
mv $AUCTIONEERCAPATH/tls/*_sk $AUCTIONEERCAPATH/tls/key.pem
mv $AUCTIONEERCAPATH/tls/*-cert.pem $AUCTIONEERCAPATH/tls/cert.pem

cp $PEERS/member-org/ca/* $MEMBERCAPATH/ca
cp $PEERS/member-org/tlsca/* $MEMBERCAPATH/tls
mv $MEMBERCAPATH/ca/*_sk $MEMBERCAPATH/ca/key.pem
mv $MEMBERCAPATH/ca/*-cert.pem $MEMBERCAPATH/ca/cert.pem
mv $MEMBERCAPATH/tls/*_sk $MEMBERCAPATH/tls/key.pem
mv $MEMBERCAPATH/tls/*-cert.pem $MEMBERCAPATH/tls/cert.pem

WEBCERTS=$PROJPATH/web/certs
rm -rf $WEBCERTS
mkdir -p $WEBCERTS
cp $PROJPATH/orderer/crypto/tls/ca.crt $WEBCERTS/ordererOrg.pem
cp $PROJPATH/auctioneerPeer/crypto/tls/ca.crt $WEBCERTS/auctioneerOrg.pem
cp $PROJPATH/memberPeer/crypto/tls/ca.crt $WEBCERTS/memberOrg.pem

cp $PEERS/auctioneer-org/users/Admin@auctioneer-org/msp/keystore/* $WEBCERTS/Admin@auctioneer-org-key.pem
cp $PEERS/auctioneer-org/users/Admin@auctioneer-org/msp/signcerts/* $WEBCERTS/
cp $PEERS/member-org/users/Admin@member-org/msp/keystore/* $WEBCERTS/Admin@member-org-key.pem
cp $PEERS/member-org/users/Admin@member-org/msp/signcerts/* $WEBCERTS/



