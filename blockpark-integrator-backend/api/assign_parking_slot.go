package api

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/maulanakmal/blockpark-provider-backend/chaincode"
	"github.com/maulanakmal/blockpark-provider-backend/db"
)

type AssignParkingSlotRequest struct {
	ProviderID string `json:"provider_id"`
	SlotNumber string `json:"slot_number"`
	OccupierID string `json:"occupier_id"`
}

func AssignParkingSlot(w http.ResponseWriter, r *http.Request) {
	request := new(AssignParkingSlotRequest)
	err := json.NewDecoder(r.Body).Decode(request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	_, err = db.GetActiveSession(request.OccupierID)
	if err == nil || (err != nil && err != sql.ErrNoRows) {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = chaincode.AssignParkingSlot(request.ProviderID, request.SlotNumber, request.OccupierID)
	if err != nil {
		log.Printf("error when assigning parking slot in blockchain, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = db.AddActiveSession(request.OccupierID, request.ProviderID, request.SlotNumber)
	if err != nil {
		log.Printf("error when adding active session to db, err = %s\n", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.WriteHeader(200)
}
