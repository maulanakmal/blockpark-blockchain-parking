package chaincode

import (
	"fmt"

	"github.com/maulanakmal/blockpark-provider-backend/gateway"
)

// Submit a transaction synchronously, blocking until it has been committed to the ledger.
func GetAvailableParkingSlotByProviderID(providerID string) (string, error) {
	contract := gateway.GetContract()
	if contract == nil {
		return "", fmt.Errorf("failed to get contract")
	}
	evaluationResult, err := contract.EvaluateTransaction("GetAvailableParkingSlotByProviderID", providerID)
	if err != nil {
		return "", err
	}

	result := formatJSON(evaluationResult)
	fmt.Printf("*** Result:%s\n", result)

	return result, nil
}
