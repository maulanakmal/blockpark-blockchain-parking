package api

import (
	"encoding/json"
	"net/http"

	"github.com/maulanakmal/blockpark-provider-backend/db"
	"github.com/maulanakmal/blockpark-provider-backend/model"
)

func RegisterUserHandler(w http.ResponseWriter, r *http.Request) {
	var user model.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err = db.RegisterUser(user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
