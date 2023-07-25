import axios from "axios";
import { ENDPOINT_GET_ALL_PROVIDERS } from "./endpoint";
import { useContext } from "react";
import { AuthContext } from "../src/auth/AuthProvider";

export const get_all_providers = async (token) => {
  try {
    const response = await axios.get(ENDPOINT_GET_ALL_PROVIDERS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Handle successful response
    console.log("returning " + response.data.provider_infos);
    return response.data.provider_infos;
  } catch (error) {
    throw error;
  }
  // Handle error
  console.error(error);
};
