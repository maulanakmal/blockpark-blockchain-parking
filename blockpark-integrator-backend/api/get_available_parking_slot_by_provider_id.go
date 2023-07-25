package api

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/maulanakmal/blockpark-provider-backend/chaincode"
)

type GetAvailableParkingSlotByProviderIDResponse struct {
	ParkingSlots []ParkingSlot `json:"parking_slots"`
}

func GetAvailableParkingSlotByProviderID(w http.ResponseWriter, r *http.Request) {
	providerID, ok := mux.Vars(r)["providerID"]
	if !ok {
		http.Error(w, "provider id is not provided", http.StatusBadRequest)
		return
	}

	result, err := chaincode.GetAvailableParkingSlotByProviderID(providerID)
	if err != nil {
		log.Printf("error when getting all assets, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var parkingSlots []ParkingSlot
	err = json.Unmarshal([]byte(result), &parkingSlots)
	if err != nil {
		log.Printf("error when unmarshal response from blockchain, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := new(GetAllParkingSlotResponse)
	response.ParkingSlots = parkingSlots

	responseJSON, err := json.Marshal(response)
	if err != nil {
		log.Printf("error when marshalling response, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Write(responseJSON)
}
