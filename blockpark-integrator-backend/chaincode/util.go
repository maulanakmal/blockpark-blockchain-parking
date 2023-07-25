package chaincode

import (
	"bytes"
	"encoding/json"
	"fmt"
)

func formatJSON(data []byte) string {
	fmt.Printf("json data, %s", data)
	var prettyJSON bytes.Buffer
	if err := json.Indent(&prettyJSON, data, "", "  "); err != nil {
		panic(fmt.Errorf("failed to parse JSON: %w", err))
	}
	return prettyJSON.String()
}
