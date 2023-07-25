import axios from "axios";
import { ENDPOINT_GET_ALL_AVAILABLE_PARKING_SLOT_BY_PROVIDER_ID } from "./endpoint";

export const get_available_parking_slot_by_provider_id = async (
  providerID,
  token
) => {
  try {
    const response = await axios.get(
      ENDPOINT_GET_ALL_AVAILABLE_PARKING_SLOT_BY_PROVIDER_ID + "/" + providerID,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Handle successful response
    console.log(response.data);
    return response.data.parking_slots;
  } catch (error) {
    throw error;
  }
};
