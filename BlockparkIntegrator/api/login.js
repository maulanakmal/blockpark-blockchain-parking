import axios from "axios";
import { ENDPOINT_LOGIN } from "./endpoint";

export const login = async (email, password) => {
  try {
    const response = await axios.post(ENDPOINT_LOGIN, {
      email: email,
      password: password,
    });

    if (response.status === 200) {
      // Login successful
      const token = response.data.token;
      // Store the token or perform any other actions
      return token;
    } else {
      throw new Error("Login failed, status", response.status);
    }
  } catch (error) {
    throw error;
  }
};
