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

type GetMyInfoResponse struct {
	ProviderInfo ProviderInfo `json:"provider_info"`
}

func GetMyInfo(w http.ResponseWriter, r *http.Request) {
	result, err := chaincode.GetMyInfo()
	if err != nil {
		log.Printf("error when getting info, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var providerInfo ProviderInfo
	err = json.Unmarshal([]byte(result), &providerInfo)
	if err != nil {
		log.Printf("error when unmarshal response from blockchain, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := new(GetMyInfoResponse)
	response.ProviderInfo = providerInfo

	responseJSON, err := json.Marshal(response)
	if err != nil {
		log.Printf("error when marshalling response, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Write(responseJSON)
}
