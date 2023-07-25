package chaincode

import (
	"fmt"

	"github.com/maulanakmal/blockpark-provider-backend/gateway"
)

// Submit a transaction synchronously, blocking until it has been committed to the ledger.
func AssignParkingSlot(providerID string, slotNumber string, occupierID string) (err error) {
	fmt.Printf("\n--> Submit Transaction: AssignParkingSlot\n")

	contract := gateway.GetContract()
	if contract == nil {
		return fmt.Errorf("failed to get contract")
	}
	_, err = contract.SubmitTransaction("AssignParkingSlot", providerID, slotNumber, occupierID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	fmt.Printf("*** Transaction committed successfully\n")
	return nil
}
