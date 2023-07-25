package model

type User struct {
	Email       string `json:"email"`
	Name        string `json:"name"`
	PhoneNumber string `json:"phone_number"`
	Password    string `json:"password"`
}

type UserInfo struct {
	Email       string `json:"email"`
	Name        string `json:"name"`
	PhoneNumber string `json:"phone_number"`
}

type ActiveSession struct {
	Email      string `json:"email"`
	ProviderID string `json:"provider_id"`
	SlotNumber string `json:"slot_number"`
}
