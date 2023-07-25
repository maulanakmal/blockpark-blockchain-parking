package main

import (
	"log"
	"net/http"
	"time"

	"github.com/maulanakmal/blockpark-provider-backend/db"
	"github.com/maulanakmal/blockpark-provider-backend/gateway"
	"github.com/maulanakmal/blockpark-provider-backend/jwt"
	"github.com/maulanakmal/blockpark-provider-backend/routes"
)

func main() {
	db.InitDB()
	jwt.Init()
	// will panic if err
	grpcConnection, gw := gateway.InitConnection()
	defer grpcConnection.Close()
	defer gw.Close()

	router := routes.GetRouter()
	srv := &http.Server{
		Handler: router,
		Addr:    "0.0.0.0:8000",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
