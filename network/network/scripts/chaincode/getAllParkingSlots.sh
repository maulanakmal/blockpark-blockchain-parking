. ./scripts/envVar.sh

export FABRIC_CFG_PATH=$PWD/../config/

setGlobals 2
../bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.orderer.com \
    --tls --cafile "${ORDERER_CA}" \
    -C parking -n parking \
    --peerAddresses localhost:17051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/parkingprovider1.com/peers/peer0.parkingprovider1.com/tls/ca.crt" \
    --peerAddresses localhost:27051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/parkingprovider2.com/peers/peer0.parkingprovider2.com/tls/ca.crt" \
    --peerAddresses localhost:37051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/parkingintegrator.com/peers/peer0.parkingintegrator.com/tls/ca.crt" \
    -c '{"function":"GetAllParkingSlots","Args":[]}'
