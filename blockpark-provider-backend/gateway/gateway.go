/*
Copyright 2021 IBM All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

package gateway

import (
	"crypto/x509"
	"fmt"
	"os"
	"path"
	"time"

	"github.com/hyperledger/fabric-gateway/pkg/client"
	"github.com/hyperledger/fabric-gateway/pkg/identity"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

var contract *client.Contract

func GetContract() *client.Contract {
	return contract
}

var (
	mspID        string
	certPath     string
	keyPath      string
	tlsCertPath  string
	peerEndpoint string
	gatewayPeer  string
)

const (
	ENV_MSP_ID        = "MSP_ID"
	ENV_CERT_PATH     = "CERT_PATH"
	ENV_KEY_PATH      = "KEY_PATH"
	ENV_TLS_CERT_PATH = "TLS_CERT_PATH"
	ENV_PEER_ENDPOINT = "PEER_ENDPOINT"
	ENV_GATEWAY_PEER  = "GATEWAY_PEER"
)

func loadEnvironmentVariables() {
	mspID = os.Getenv(ENV_MSP_ID)
	if mspID == "" {
		panic(fmt.Sprintf("ENV VAR %s NOT SET", ENV_MSP_ID))
	}

	certPath = os.Getenv(ENV_CERT_PATH)
	if certPath == "" {
		panic(fmt.Sprintf("ENV VAR %s NOT SET", ENV_CERT_PATH))
	}

	keyPath = os.Getenv(ENV_KEY_PATH)
	if keyPath == "" {
		panic(fmt.Sprintf("ENV VAR %s NOT SET", ENV_KEY_PATH))
	}

	tlsCertPath = os.Getenv(ENV_TLS_CERT_PATH)
	if tlsCertPath == "" {
		panic(fmt.Sprintf("ENV VAR %s NOT SET", ENV_TLS_CERT_PATH))
	}

	peerEndpoint = os.Getenv(ENV_PEER_ENDPOINT)
	if peerEndpoint == "" {
		panic(fmt.Sprintf("ENV VAR %s NOT SET", ENV_PEER_ENDPOINT))
	}

	gatewayPeer = os.Getenv(ENV_GATEWAY_PEER)
	if gatewayPeer == "" {
		panic(fmt.Sprintf("ENV VAR %s NOT SET", ENV_GATEWAY_PEER))
	}

	fmt.Printf("Load configuration complete\n")
	fmt.Printf("%20s = %s\n", ENV_MSP_ID, mspID)
	fmt.Printf("%20s = %s\n", ENV_CERT_PATH, certPath)
	fmt.Printf("%20s = %s\n", ENV_KEY_PATH, keyPath)
	fmt.Printf("%20s = %s\n", ENV_TLS_CERT_PATH, tlsCertPath)
	fmt.Printf("%20s = %s\n", ENV_PEER_ENDPOINT, peerEndpoint)
	fmt.Printf("%20s = %s\n", ENV_GATEWAY_PEER, gatewayPeer)
}

const (
	ChannelName   = "parking"
	ChaincodeName = "parking"
)

func InitConnection() (*grpc.ClientConn, *client.Gateway) {
	loadEnvironmentVariables()
	// The gRPC client connection should be shared by all Gateway connections to this endpoint
	clientConnection := newGrpcConnection()

	id := newIdentity()
	sign := newSign()

	// Create a Gateway connection for a specific client identity
	gw, err := client.Connect(
		id,
		client.WithSign(sign),
		client.WithClientConnection(clientConnection),
		// Default timeouts for different gRPC calls
		client.WithEvaluateTimeout(5*time.Second),
		client.WithEndorseTimeout(15*time.Second),
		client.WithSubmitTimeout(5*time.Second),
		client.WithCommitStatusTimeout(1*time.Minute),
	)
	if err != nil {
		panic(err)
	}

	network := gw.GetNetwork(ChannelName)
	fmt.Printf("network %v\n", network)
	contract = network.GetContract(ChaincodeName)
	fmt.Printf("contract %v\n", contract)
	fmt.Println("Succesfully initing gateway connection")

	return clientConnection, gw
}

// newGrpcConnection creates a gRPC connection to the Gateway server.
func newGrpcConnection() *grpc.ClientConn {
	certificate, err := loadCertificate(tlsCertPath)
	if err != nil {
		panic(err)
	}

	certPool := x509.NewCertPool()
	certPool.AddCert(certificate)
	transportCredentials := credentials.NewClientTLSFromCert(certPool, gatewayPeer)

	connection, err := grpc.Dial(peerEndpoint, grpc.WithTransportCredentials(transportCredentials))
	if err != nil {
		panic(fmt.Errorf("failed to create gRPC connection: %w", err))
	}

	return connection
}

// newIdentity creates a client identity for this Gateway connection using an X.509 certificate.
func newIdentity() *identity.X509Identity {
	certificate, err := loadCertificate(certPath)
	if err != nil {
		panic(err)
	}

	id, err := identity.NewX509Identity(mspID, certificate)
	if err != nil {
		panic(err)
	}

	return id
}

func loadCertificate(filename string) (*x509.Certificate, error) {
	certificatePEM, err := os.ReadFile(filename)
	if err != nil {
		return nil, fmt.Errorf("failed to read certificate file: %w", err)
	}
	return identity.CertificateFromPEM(certificatePEM)
}

// newSign creates a function that generates a digital signature from a message digest using a private key.
func newSign() identity.Sign {
	files, err := os.ReadDir(keyPath)
	if err != nil {
		panic(fmt.Errorf("failed to read private key directory: %w", err))
	}
	privateKeyPEM, err := os.ReadFile(path.Join(keyPath, files[0].Name()))

	if err != nil {
		panic(fmt.Errorf("failed to read private key file: %w", err))
	}

	privateKey, err := identity.PrivateKeyFromPEM(privateKeyPEM)
	if err != nil {
		panic(err)
	}

	sign, err := identity.NewPrivateKeySign(privateKey)
	if err != nil {
		panic(err)
	}

	return sign
}
