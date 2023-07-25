package api

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/maulanakmal/blockpark-provider-backend/chaincode"
)

type UpdateProviderInfoRequest struct {
	ProviderName    string `json:"provider_name"`
	ProviderAddress string `json:"provider_address"`
}

func UpdateProviderInfo(w http.ResponseWriter, r *http.Request) {
	request := new(UpdateProviderInfoRequest)
	err := json.NewDecoder(r.Body).Decode(request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Printf("got request %v", request)

	err = chaincode.UpdateProviderInfo(request.ProviderName, request.ProviderAddress)
	if err != nil {
		log.Printf("error when adding parking slots to blockchain, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(200)

}
