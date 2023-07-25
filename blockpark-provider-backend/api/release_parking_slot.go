package api

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/maulanakmal/blockpark-provider-backend/chaincode"
)

type ReleaseParkingSlotRequest struct {
	SlotNumber string `json:"slot_number"`
}

func ReleaseParkingSlot(w http.ResponseWriter, r *http.Request) {
	request := new(ReleaseParkingSlotRequest)
	err := json.NewDecoder(r.Body).Decode(request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Printf("got request %v", request)

	err = chaincode.ReleaseParkingSlot(request.SlotNumber)
	if err != nil {
		log.Printf("error when release parking slot in blockchain, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(200)

}
