package main

import (
	"log"
	"net/http"
	"time"

	"github.com/maulanakmal/blockpark-provider-backend/gateway"
	"github.com/maulanakmal/blockpark-provider-backend/routes"
)

func main() {
	// will panic if err
	grpcConnection, gw := gateway.InitConnection()
	defer grpcConnection.Close()
	defer gw.Close()

	handler := routes.GetRouter()
	srv := &http.Server{
		Handler: handler,
		Addr:    "0.0.0.0:8000",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
