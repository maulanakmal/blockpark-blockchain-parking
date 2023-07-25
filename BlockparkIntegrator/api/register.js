import axios from "axios";
import { ENDPOINT_REGISTER } from "./endpoint";

export const registerUser = async (userData) => {
  const response = await axios.post(ENDPOINT_REGISTER, userData);
  console.log("Status" + response.status);
  try {
    if (response.status === 201) {
    } else {
      console.error("error Status" + response.status);
      throw new Error(
        "Error registering user, HTTP STATUS CODE: " + response.status
      ); // Throw a general error with detailed message
    }
  } catch (error) {
    // Handle any network or other errors
    console.error("error Status" + response.status);
    console.error("error msg" + error.message);
    throw new Error("Error registering user: " + error.message); // Throw a general error with detailed message
  }
};
