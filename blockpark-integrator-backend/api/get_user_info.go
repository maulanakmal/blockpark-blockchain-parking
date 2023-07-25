package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/maulanakmal/blockpark-provider-backend/db"
	"github.com/maulanakmal/blockpark-provider-backend/jwt"
	"github.com/maulanakmal/blockpark-provider-backend/model"
)

type GetUserInfoResponse struct {
	UserInfo model.UserInfo `json:"user_info"`
}

func GetUserInfo(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
	email, err := jwt.ParseEmailFromJWT(tokenString)
	if err != nil {
		log.Printf("error when getting user info, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	userInfo, err := db.GetUserByEmail(email)
	if err != nil {
		log.Printf("error when getting user info, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Printf("user info = %v\n", userInfo)

	response := new(GetUserInfoResponse)
	response.UserInfo = userInfo
	responseJson, err := json.Marshal(response)
	if err != nil {
		log.Printf("error when marshaling user info, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.WriteHeader(200)
	w.Write(responseJson)

}
