package api

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/maulanakmal/blockpark-provider-backend/jwt"
)

func RefreshTokenHandler(w http.ResponseWriter, r *http.Request) {
	// Extract the expired token from the request, e.g., from the request headers or body
	authHeader := r.Header.Get("Authorization")

	// Check if the Authorization header starts with "Bearer" and extract the token
	tokenString := ""
	if strings.HasPrefix(authHeader, "Bearer ") {
		tokenString = authHeader[7:]
	} else {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	newToken, err := jwt.RefreshToken(tokenString)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the new token in the response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"token": newToken,
	})
}
