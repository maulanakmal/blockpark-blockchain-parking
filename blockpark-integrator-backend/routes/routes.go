package routes

import (
	"bytes"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/maulanakmal/blockpark-provider-backend/api"
)

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now()

		// Read the request body
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			log.Println("Error reading request body:", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// Restore the request body
		r.Body = ioutil.NopCloser(bytes.NewBuffer(body))

		// Call the next handler
		next.ServeHTTP(w, r)

		// Log the request details
		log.Printf("%s %s %s\nRequest Body: %s", r.Method, r.RequestURI, time.Since(startTime), body)
	})
}

func middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

func GetRouter() *mux.Router {
	router := mux.NewRouter()
	router.Use(loggingMiddleware)
	router.Use(middleware)

	protectedRouter := router.PathPrefix("/protected").Subrouter()
	// protectedRouter.Use(jwt.JWTMiddleware)

	// debugs
	router.HandleFunc("/get_all_parking_slots", api.GetAllParkingSlots).Methods("GET")

	// public
	router.HandleFunc("/register", api.RegisterUserHandler).Methods("POST")
	router.HandleFunc("/login", api.LoginHandler).Methods("POST")
	router.HandleFunc("/refresh_token", api.RefreshTokenHandler).Methods("POST")

	// integrator
	protectedRouter.HandleFunc("/get_all_providers", api.GetAllProviders).Methods("GET")
	protectedRouter.HandleFunc("/get_available_parking_slot_by_provider_id/{providerID}", api.GetAvailableParkingSlotByProviderID).Methods("GET")
	protectedRouter.HandleFunc("/assign_parking_slot", api.AssignParkingSlot).Methods("POST")

	protectedRouter.HandleFunc("/active_session", api.GetActiveSession).Methods("GET")

	protectedRouter.HandleFunc("/get_user_info", api.GetUserInfo).Methods("GET")
	protectedRouter.HandleFunc("/update_user_info", api.UpdateUserInfo).Methods("POST")
	return router
}
