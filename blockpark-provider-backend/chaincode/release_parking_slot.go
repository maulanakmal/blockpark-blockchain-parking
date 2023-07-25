package chaincode

import (
	"fmt"

	"github.com/maulanakmal/blockpark-provider-backend/gateway"
)

// Submit a transaction synchronously, blocking until it has been committed to the ledger.
func ReleaseParkingSlot(slotNumber string) (err error) {
	fmt.Printf("\n--> Submit Transaction: ReleaseParkingSlot\n")

	contract := gateway.GetContract()
	if contract == nil {
		return fmt.Errorf("failed to get contract")
	}
	_, err = contract.SubmitTransaction("ReleaseParkingSlot", slotNumber)
	if err != nil {

		return
	}

	fmt.Printf("*** Transaction committed successfully\n")
	return nil
}
