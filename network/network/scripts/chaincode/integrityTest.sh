. ./scripts/envVar.sh

export FABRIC_CFG_PATH=$PWD/../config/

# # Mengeksekusi chaincode sebagai Integrator untuk mendapatkan informasi parkir awal
# setGlobals 3
# ../bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.orderer.com \
#     --tls --cafile "${ORDERER_CA}" \
#     -C parking -n parking \
#     --peerAddresses localhost:17051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/parkingprovider1.com/peers/peer0.parkingprovider1.com/tls/ca.crt" \
#     --peerAddresses localhost:27051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/parkingprovider2.com/peers/peer0.parkingprovider2.com/tls/ca.crt" \
#     --peerAddresses localhost:37051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/parkingintegrator.com/peers/peer0.parkingintegrator.com/tls/ca.crt" \
#     -c '{"function":"GetAvailableParkingSlotByProviderID","Args":["ParkingProvider1MSP"]}' | cut -d\: -f2


# exit

# # Mengeksekusi chaincode sebagai Integrator untuk mengakhiri sesi parkir pengguna
# # yang sedang parkir pada fasilitas parkir Parking Provider 1 
# setGlobals 3
# ../bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.orderer.com \
#     --tls --cafile "${ORDERER_CA}" \
#     -C parking -n parking \
#     --peerAddresses localhost:17051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/parkingprovider1.com/peers/peer0.parkingprovider1.com/tls/ca.crt" \
#     --peerAddresses localhost:27051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/parkingprovider2.com/peers/peer0.parkingprovider2.com/tls/ca.crt" \
#     --peerAddresses localhost:37051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/parkingintegrator.com/peers/peer0.parkingintegrator.com/tls/ca.crt" \
#     -c '{"function":"ReleaseParkingSlot","Args":["1"]}'

# # Mengeksekusi chaincode sebagai Parking Provider 1 untuk mendapatkan data dari provider 2
# setGlobals 
# ../bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.orderer.com \
#     --tls --cafile "${ORDERER_CA}" \
#     -C parking -n parking \
#     --peerAddresses localhost:17051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/parkingprovider1.com/peers/peer0.parkingprovider1.com/tls/ca.crt" \
#     --peerAddresses localhost:27051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/parkingprovider2.com/peers/peer0.parkingprovider2.com/tls/ca.crt" \
#     --peerAddresses localhost:37051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/parkingintegrator.com/peers/peer0.parkingintegrator.com/tls/ca.crt" \
#     -c '{"function":"GetAvailableParkingSlotByProviderID","Args":["ParkingProvider2MSP"]}'

setGlobals 3
../bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.orderer.com \
    --tls --cafile "${ORDERER_CA}" \
    -C parking -n parking \
    --peerAddresses localhost:17051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/parkingprovider1.com/peers/peer0.parkingprovider1.com/tls/ca.crt" \
    --peerAddresses localhost:27051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/parkingprovider2.com/peers/peer0.parkingprovider2.com/tls/ca.crt" \
    --peerAddresses localhost:37051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/parkingintegrator.com/peers/peer0.parkingintegrator.com/tls/ca.crt" \
    -c '{"function":"AssignParkingSlot","Args":["ParkingProvider1MSP", "1", "doni@itb.com"]}'