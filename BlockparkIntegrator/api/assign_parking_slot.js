import axios from "axios";
import { ENDPOINT_ASSIGN, ENDPOINT_UPDATE_USER_INFO } from "./endpoint";
import { useContext } from "react";
import { AuthContext } from "../src/auth/AuthProvider";

export const assign_parking_slot = async (
  token,
  providerID,
  slotNumber,
  occupierID
) => {
  try {
    await axios.post(
      ENDPOINT_ASSIGN,
      {
        provider_id: providerID,
        slot_number: slotNumber,
        occupier_id: occupierID,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};
