package api

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/maulanakmal/blockpark-provider-backend/chaincode"
)

type GetMyParkingSlotResponse struct {
	ParkingSlots []ParkingSlot `json:"parking_slots"`
}

func GetMyParkingSlots(w http.ResponseWriter, r *http.Request) {
	result, err := chaincode.GetMyParkingSlots()
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

	response := new(GetMyParkingSlotResponse)
	response.ParkingSlots = parkingSlots

	responseJSON, err := json.Marshal(response)
	if err != nil {
		log.Printf("error when marshalling response, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Write(responseJSON)
}
