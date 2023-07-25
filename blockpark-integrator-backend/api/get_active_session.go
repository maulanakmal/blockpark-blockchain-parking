package api

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/maulanakmal/blockpark-provider-backend/chaincode"
	"github.com/maulanakmal/blockpark-provider-backend/db"
	"github.com/maulanakmal/blockpark-provider-backend/jwt"
	"github.com/maulanakmal/blockpark-provider-backend/model"
)

type GetActiveSessionResponse struct {
	Status        bool                `json:"status"`
	ActiveSession model.ActiveSession `json:"active_session"`
	ParkingSlot   ParkingSlot         `json:"parking_slot"`
	ProviderInfo  ProviderInfo        `json:"provider_info"`
}

const (
	PARKING_SLOT_STATUS_FREE uint32 = iota
	PARKING_SLOT_STATUS_OCCUPIED
)

func GetActiveSession(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
	email, err := jwt.ParseEmailFromJWT(tokenString)
	if err != nil {
		log.Printf("error when getting user info, err = %s\n", err.Error())
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	response := new(GetActiveSessionResponse)
	activeSession, err := db.GetActiveSession(email)
	log.Printf("error %s \n", err)
	if err != nil && err == sql.ErrNoRows {
		response.Status = false
		response.ActiveSession = model.ActiveSession{}
		responseJson, err := json.Marshal(response)
		if err != nil {
			log.Printf("error when marshaling response, err = %s", err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(200)
		w.Write(responseJson)
		return
	}
	if err != nil {
		log.Printf("error when getting active seesion from DB, err = %s\n", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	log.Printf("active session from db = %v\n", activeSession)

	parkingSlotString, err := chaincode.GetParkingSlotByProviderIDAndSlotNumber(activeSession.ProviderID, activeSession.SlotNumber)
	if err != nil {
		log.Printf("error when getting parking slot from blockchain, err = %s\n", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var parkingSlot ParkingSlot
	err = json.Unmarshal([]byte(parkingSlotString), &parkingSlot)
	if err != nil {
		log.Printf("error when unmarshal response from blockchain, err = %s\n", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	log.Printf("parking slot from blockchain = %v\n", activeSession)

	// measn it has been freed by provider
	if parkingSlot.Status == PARKING_SLOT_STATUS_FREE {
		err := db.DeleteActiveSession(email)
		if err != nil {
			log.Printf("error deleting active session from db, err = %s\n", err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		response.Status = false
		response.ActiveSession = model.ActiveSession{}
	} else {
		response.Status = true
		response.ActiveSession = activeSession
		response.ParkingSlot = parkingSlot
	}

	if parkingSlot.Status != PARKING_SLOT_STATUS_FREE {
		providerInfoString, err := chaincode.GetProviderInfoByProviderID(parkingSlot.ProviderID)
		if err != nil {
			log.Printf("error when getting provider, err = %s", err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		var providerInfo ProviderInfo
		err = json.Unmarshal([]byte(providerInfoString), &providerInfo)
		if err != nil {
			log.Printf("error when unmarshal response from blockchain, err = %s\n", err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		response.ProviderInfo = providerInfo
	}

	responseJson, err := json.Marshal(response)
	if err != nil {
		log.Printf("error when marshaling response, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.WriteHeader(200)
	w.Write(responseJson)
}
