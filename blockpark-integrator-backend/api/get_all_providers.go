package api

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/maulanakmal/blockpark-provider-backend/chaincode"
)

type ProviderInfo struct {
	ProviderID   string `json:"provider_id"`
	ProviderName string `json:"provider_name"`
	Address      string `json:"address"`
}
type GetAllProvidersResponse struct {
	ProviderInfos []ProviderInfo `json:"provider_infos"`
}

func GetAllProviders(w http.ResponseWriter, r *http.Request) {
	result, err := chaincode.GetAllProviders()
	if err != nil {
		log.Printf("error when getting all assets, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var providerInfos []ProviderInfo
	err = json.Unmarshal([]byte(result), &providerInfos)
	if err != nil {
		log.Printf("error when unmarshal response from blockchain, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := new(GetAllProvidersResponse)
	response.ProviderInfos = providerInfos

	responseJSON, err := json.Marshal(response)
	if err != nil {
		log.Printf("error when marshalling response, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Write(responseJSON)
}
