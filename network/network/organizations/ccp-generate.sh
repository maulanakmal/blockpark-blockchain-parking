#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=1
P0PORT=17051
CAPORT=7054
PEERPEM=organizations/peerOrganizations/parkingprovider1.com/tlsca/tlsca.parkingprovider1.com-cert.pem
CAPEM=organizations/peerOrganizations/parkingprovider1.com/ca/ca.parkingprovider1.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" >organizations/peerOrganizations/parkingprovider1.com/connection-org1.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" >organizations/peerOrganizations/parkingprovider1.com/connection-org1.yaml

ORG=2
P0PORT=27051
CAPORT=8054
PEERPEM=organizations/peerOrganizations/parkingprovider2.com/tlsca/tlsca.parkingprovider2.com-cert.pem
CAPEM=organizations/peerOrganizations/parkingprovider2.com/ca/ca.parkingprovider2.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" >organizations/peerOrganizations/parkingprovider2.com/connection-org2.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" >organizations/peerOrganizations/parkingprovider2.com/connection-org2.yaml

ORG=3
P0PORT=37051
CAPORT=8054
PEERPEM=organizations/peerOrganizations/parkingintegrator.com/tlsca/tlsca.parkingintegrator.com-cert.pem
CAPEM=organizations/peerOrganizations/parkingintegrator.com/ca/ca.parkingintegrator.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" >organizations/peerOrganizations/parkingintegrator.com/connection-org2.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" >organizations/peerOrganizations/parkingintegrator.com/connection-org2.yaml
