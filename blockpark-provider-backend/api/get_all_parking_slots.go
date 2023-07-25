package api

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/maulanakmal/blockpark-provider-backend/chaincode"
)

type ParkingSlot struct {
	SlotID       string `json:"slot_id"`
	SlotNumber   string `json:"slot_number"`
	ProviderID   string `json:"provider_id"`
	IntegratorID string `json:"integrator_id"`
	OccupierID   string `json:"occupier_id"`
	Status       uint32 `json:"status"`
}

type GetAllParkingSlotResponse struct {
	ParkingSlots []ParkingSlot `json:"parking_slots"`
}

func GetAllParkingSlots(w http.ResponseWriter, r *http.Request) {
	result, err := chaincode.GetAllParkingSlots()
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
