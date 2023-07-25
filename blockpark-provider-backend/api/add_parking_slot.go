package api

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/maulanakmal/blockpark-provider-backend/chaincode"
)

type AddParkingSlotRequest struct {
	SlotNumber string `json:"slot_number"`
}

func AddParkingSlot(w http.ResponseWriter, r *http.Request) {
	request := new(AddParkingSlotRequest)
	err := json.NewDecoder(r.Body).Decode(request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Printf("got request %v", request)

	err = chaincode.AddParkingSlot(request.SlotNumber)
	if err != nil {
		log.Printf("error when adding parking slots to blockchain, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(200)

}
