import axios from "axios";
import { ENDPOINT_USER_INFO } from "./endpoint";
import { useContext } from "react";
import { AuthContext } from "../src/auth/AuthProvider";

export const get_user_info = async (token) => {
  try {
    const response = await axios.get(ENDPOINT_USER_INFO, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Handle successful response
    console.log(
      "returning user info " + JSON.stringify(response.data.user_info)
    );
    return response.data.user_info;
  } catch (error) {
    throw error;
  }
};
