package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/maulanakmal/blockpark-provider-backend/model"
	"golang.org/x/crypto/bcrypt"

	_ "github.com/go-sql-driver/mysql"
)

var signingKey []byte

var db *sql.DB

func InitDB() {
	// Retrieve MySQL connection details from environment variables
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")

	// Check if any required environment variable is not set
	missingVars := false
	var missingVarNames []string

	if dbUser == "" {
		missingVars = true
		missingVarNames = append(missingVarNames, "DB_USER")
	}

	if dbPass == "" {
		missingVars = true
		missingVarNames = append(missingVarNames, "DB_PASSWORD")
	}

	if dbName == "" {
		missingVars = true
		missingVarNames = append(missingVarNames, "DB_NAME")
	}

	if dbHost == "" {
		missingVars = true
		missingVarNames = append(missingVarNames, "DB_HOST")
	}

	if dbPort == "" {
		missingVars = true
		missingVarNames = append(missingVarNames, "DB_PORT")
	}

	// Print missing environment variables, if any
	if missingVars {
		fmt.Printf("The following environment variables are missing:\n")
		for _, varName := range missingVarNames {
			fmt.Printf("- %s\n", varName)
		}
		panic("missing environment variables")
	}

	// Create MySQL connection string
	dataSourceName := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", dbUser, dbPass, dbHost, dbPort, dbName)

	// Connect to MySQL database
	var err error
	db, err = sql.Open("mysql", dataSourceName)
	if err != nil {
		panic(err)
	}

	// Verify the database connection
	err = db.Ping()
	if err != nil {
		panic(err)
	}

	// Retrieve signing key from environment variable
	signingKey = []byte(os.Getenv("SIGNING_KEY"))
	if len(signingKey) == 0 {
		panic("signing key not provided")
	}
}

func RegisterUser(user model.User) error {
	if db == nil {
		panic("database connection is not initialized")
	}

	// Hash the password
	hashedPassword, err := hashPassword(user.Password)
	if err != nil {
		return err
	}

	// Insert the user into the user_table
	insertQuery := "INSERT INTO users (email, name, phone_number, password) VALUES (?, ?, ?, ?)"
	_, err = db.Exec(insertQuery, user.Email, user.Name, user.PhoneNumber, hashedPassword)
	if err != nil {
		return err
	}

	return nil
}

func AuthenticateUser(email, password string) error {
	var storedPassword string

	// Retrieve the stored password from the database based on the email
	query := "SELECT password FROM users WHERE email = ?"
	err := db.QueryRow(query, email).Scan(&storedPassword)
	if err != nil {
		return err
	}

	// Compare the stored password with the provided password
	err = bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(password))
	if err != nil {
		return err
	}

	return nil
}

func hashPassword(password string) (string, error) {
	// Generate a hashed version of the password
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	// Convert the hashed password to a string
	hashedPassword := string(hashedBytes)
	return hashedPassword, nil
}

func GetUserByEmail(email string) (model.UserInfo, error) {
	var user model.UserInfo

	query := "SELECT email, name, phone_number FROM users WHERE email = ?"
	err := db.QueryRow(query, email).Scan(&user.Email, &user.Name, &user.PhoneNumber)
	if err != nil {
		if err == sql.ErrNoRows {
			return model.UserInfo{}, fmt.Errorf("user not found")
		}
		return model.UserInfo{}, fmt.Errorf("failed to get user: %v", err)
	}

	return user, nil
}

func UpdateUserInfo(email string, phone, name string) error {
	// Update the user information in the database
	log.Printf("updating to db, email = %s, phone =%s, name = %s", email, phone, name)
	_, err := db.Exec("UPDATE users SET name = ?, phone_number = ? WHERE email = ?", name, phone, email)
	if err != nil {
		return err
	}

	return nil
}

// Fungsi untuk mendapatkan data ActiveSession berdasarkan email
func GetActiveSession(email string) (model.ActiveSession, error) {
	query := "SELECT email, provider_id, slot_number FROM active_sessions WHERE email = ?"
	row := db.QueryRow(query, email)

	var activeSession model.ActiveSession
	err := row.Scan(&activeSession.Email, &activeSession.ProviderID, &activeSession.SlotNumber)
	if err != nil {
		if err == sql.ErrNoRows {
			return model.ActiveSession{}, err // Data tidak ditemukan
		}
		return model.ActiveSession{}, err
	}

	return activeSession, nil
}

// Fungsi untuk menambahkan data ActiveSession baru
func AddActiveSession(email, providerID, slotNumber string) error {
	query := "INSERT INTO active_sessions (email, provider_id, slot_number) VALUES (?, ?, ?)"
	_, err := db.Exec(query, email, providerID, slotNumber)
	if err != nil {
		return err
	}

	return nil
}

// Fungsi untuk menghapus data ActiveSession berdasarkan email
func DeleteActiveSession(email string) error {
	query := "DELETE FROM active_sessions WHERE email = ?"
	_, err := db.Exec(query, email)
	if err != nil {
		return err
	}

	return nil
}
