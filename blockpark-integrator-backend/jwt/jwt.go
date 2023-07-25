// jwt.go

package jwt

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var signingKey []byte

func Init() {
	signingKey = []byte(os.Getenv("SIGNING_KEY"))
	if len(signingKey) == 0 {
		panic("signing key not provided")
	}
}

func GenerateJWTToken(email string) (string, error) {
	// Create a new JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(), // Token expiration time
	})

	// Sign the token with the signing key
	tokenString, err := token.SignedString(signingKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func RefreshToken(expiredToken string) (string, error) {
	// Verify the expired token and extract the claims
	token, err := jwt.Parse(expiredToken, func(token *jwt.Token) (interface{}, error) {
		return signingKey, nil
	})
	if err != nil {
		return "", fmt.Errorf("failed to parse token: %v", err)
	}

	// Check if the token is valid and not expired
	if !token.Valid {
		return "", fmt.Errorf("invalid token")
	}

	// Extract the email claim from the token
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", fmt.Errorf("invalid token claims")
	}

	email, ok := claims["email"].(string)
	if !ok {
		return "", fmt.Errorf("invalid email claim")
	}

	// Generate a new token with a refreshed expiration time
	newToken, err := GenerateJWTToken(email)
	if err != nil {
		return "", fmt.Errorf("failed to generate new token: %v", err)
	}

	return newToken, nil
}

func JWTMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return signingKey, nil
		})

		log.Printf("err %v", err)
		log.Printf("token %v", token)
		if err != nil || !token.Valid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func ParseEmailFromJWT(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Verifikasi metode signing token.
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return signingKey, nil
	})

	if err != nil {
		return "", err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Token valid, lakukan operasi yang diperlukan dengan claims.
		email := claims["email"].(string)
		fmt.Println("email:", email)
		return email, nil
	} else {
		return "", fmt.Errorf("invalid token")
	}
}
