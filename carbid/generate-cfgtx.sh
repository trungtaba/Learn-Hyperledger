#!/bin/sh

CHANNEL_NAME="default"
PROJPATH=$(pwd)
CLIPATH=$PROJPATH/cli/peers
SCIPRPATH=$PROJPATH/crypto-script

echo
echo "##########################################################"
echo "#########  Generating Orderer Genesis block ##############"
echo "##########################################################"
$SCIPRPATH/configtxgen -profile TwoOrgsGenesis -outputBlock $CLIPATH/genesis.block

echo
echo "#################################################################"
echo "### Generating channel configuration transaction 'channel.tx' ###"
echo "#################################################################"
$SCIPRPATH/configtxgen -profile TwoOrgsChannel -outputCreateChannelTx $CLIPATH/channel.tx -channelID $CHANNEL_NAME
cp $CLIPATH/channel.tx $PROJPATH/web
echo
echo "#################################################################"
echo "####### Generating anchor peer update for AuctioneerOrg ##########"
echo "#################################################################"
$SCIPRPATH/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate $CLIPATH/AuctioneerOrgMSPAnchors.tx -channelID $CHANNEL_NAME -asOrg AuctioneerOrgMSP

echo
echo "#################################################################"
echo "#######    Generating anchor peer update for MemberOrg   ##########"
echo "#################################################################"
$SCIPRPATH/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate $CLIPATH/MemberOrgMSPAnchors.tx -channelID $CHANNEL_NAME -asOrg MemberOrgMSP