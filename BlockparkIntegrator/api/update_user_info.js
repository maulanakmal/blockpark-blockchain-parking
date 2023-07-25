import axios from "axios";
import { ENDPOINT_UPDATE_USER_INFO } from "./endpoint";
import { useContext } from "react";
import { AuthContext } from "../src/auth/AuthProvider";

export const updateUserInfo = async (token, name, phoneNumber) => {
  try {
    await axios.post(
      ENDPOINT_UPDATE_USER_INFO,
      {
        name: name,
        phone_number: phoneNumber,
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
