import axios from "axios";
import { ENDPOINT_ACTIVE_SESSION, ENDPOINT_USER_INFO } from "./endpoint";
import { useContext } from "react";
import { AuthContext } from "../src/auth/AuthProvider";

export const get_active_session = async (token) => {
  try {
    const response = await axios.get(ENDPOINT_ACTIVE_SESSION, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("returning response " + JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    throw error;
  }
};
