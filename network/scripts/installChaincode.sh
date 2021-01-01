#!/bin/bash

echo
echo " ____    _____      _      ____    _____ "
echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
echo "\___ \    | |     / _ \   | |_) |   | |  "
echo " ___) |   | |    / ___ \  |  _ <    | |  "
echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
echo
echo "Deploying Chaincode PHARMANET On Pharma Network"
echo
CHANNEL_NAME="$1"
DELAY="$2"
LANGUAGE="$3"
VERSION="$4"
TYPE="$5"
: ${CHANNEL_NAME:="pharmachannel"}
: ${DELAY:="5"}
: ${LANGUAGE:="node"}
: ${VERSION:=1.1}
: ${TYPE="basic"}

LANGUAGE=`echo "$LANGUAGE" | tr [:upper:] [:lower:]`
ORGS="sunpharma vgpharma upgrad fedex pioneeratlantic"
TIMEOUT=15

if [ "$TYPE" = "basic" ]; then
  CC_SRC_PATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/"
else
  CC_SRC_PATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode-advanced/"
fi

echo "Channel name : "$CHANNEL_NAME

# import utils
. scripts/utils.sh

## Install new version of chaincode on peer0 of all 3 orgs making them endorsers
echo "Installing chaincode on peer0.sunpharma.pharma-network.com ..."
installChaincode 0 'sunpharma' $VERSION
echo "Installing chaincode on peer0.vgpharma.pharma-network.com ..."
installChaincode 0 'vgpharma' $VERSION
echo "Installing chaincode on peer0.upgrad.pharma-network.com ..."
installChaincode 0 'upgrad' $VERSION
echo "Installing chaincode on peer0.fedex.pharma-network.com ..."
installChaincode 0 'fedex' $VERSION
echo "Installing chaincode on peer0.pioneeratlantic.pharma-network.com ..."
installChaincode 0 'pioneeratlantic' $VERSION



# Instantiate chaincode on the channel using peer0.sunpharma
echo "Instantiating chaincode on channel using peer0.sunpharma.pharma-network.com ..."
instantiateChaincode 0 'sunpharma' $VERSION

echo
echo "========= All GOOD, Chaincode PHARMANET Is Now Installed & Instantiated On Pharma Network =========== "
echo

echo
echo " _____   _   _   ____   "
echo "| ____| | \ | | |  _ \  "
echo "|  _|   |  \| | | | | | "
echo "| |___  | |\  | | |_| | "
echo "|_____| |_| \_| |____/  "
echo

exit 0
