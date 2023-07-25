package routes

import (
	"fmt"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/maulanakmal/blockpark-provider-backend/api"
)

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		for k, v := range r.Header {
			fmt.Printf("Header %s : %s\n", k, v)
		}
		next.ServeHTTP(w, r)
	})
}

func middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

func GetRouter() http.Handler {
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),            // Set the allowed origins
		handlers.AllowedMethods([]string{"GET", "POST"}),  // Set the allowed methods
		handlers.AllowedHeaders([]string{"content-type"}), // Set the allowed methods
	)
	router := mux.NewRouter()
	router.Use(loggingMiddleware)
	router.Use(middleware)

	// debugs
	router.HandleFunc("/get_all_parking_slots", api.GetAllParkingSlots).Methods("GET")

	// provider
	router.HandleFunc("/get_my_info", api.GetMyInfo).Methods("GET")
	router.HandleFunc("/add_parking_slot", api.AddParkingSlot).Methods("POST")
	router.HandleFunc("/release_parking_slot", api.ReleaseParkingSlot).Methods("POST")
	router.HandleFunc("/get_my_parking_slots", api.GetMyParkingSlots).Methods("GET")
	router.HandleFunc("/update_provider_info", api.UpdateProviderInfo).Methods("POST")

	return corsHandler(router)
}
