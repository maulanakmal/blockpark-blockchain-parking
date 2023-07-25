package api

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/maulanakmal/blockpark-provider-backend/db"
	"github.com/maulanakmal/blockpark-provider-backend/jwt"
)

type UpdateUserInfoRequest struct {
	Name        string `json:"name"`
	PhoneNumber string `json:"phone_number"`
}

func UpdateUserInfo(w http.ResponseWriter, r *http.Request) {
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

	var req UpdateUserInfoRequest
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	userInfo, err := db.GetUserByEmail(email)
	if err != nil {
		log.Printf("error when getting user info, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if req.Name == "" && req.PhoneNumber == "" {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.Name != "" {
		userInfo.Name = req.Name
	}

	if req.PhoneNumber != "" {
		userInfo.PhoneNumber = req.PhoneNumber
	}

	err = db.UpdateUserInfo(email, userInfo.PhoneNumber, userInfo.Name)
	if err != nil {
		log.Printf("error when updating user info, err = %s", err.Error())
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	w.WriteHeader(200)

}
