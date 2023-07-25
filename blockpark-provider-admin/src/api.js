import axios from "axios";
import config from "./config";

const BACKEND_HOST = config.API_BASE_URL;
console.log(BACKEND_HOST);
const ENDPOINT_PARKING_SLOT = "/get_my_parking_slots";
const ENDPOINT_ADD_PARKING_SLOT = "/add_parking_slot";
const ENDPOINT_RELEASE_PARKING_SLOT = "/release_parking_slot";
const ENDPOINT_INFO = "/get_my_info";
const ENDPOINT_UPDATE_INFO = "/update_provider_info";

const API = axios.create({
  baseURL: BACKEND_HOST,
});

export const get_my_parking_slots = async () => {
  try {
    const response = await API.get(ENDPOINT_PARKING_SLOT);
    return response.data.parking_slots;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const release_parking_slot = async (slotNumber) => {
  try {
    await API.post(ENDPOINT_RELEASE_PARKING_SLOT, {
      slot_number: slotNumber,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const add_parking_slot = async (slotNumber) => {
  try {
    await API.post(ENDPOINT_ADD_PARKING_SLOT, {
      slot_number: slotNumber,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const get_my_info = async () => {
  try {
    const response = await API.get(ENDPOINT_INFO);
    return response.data.provider_info;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const update_provider_info = async (providerName, address) => {
  try {
    await API.post(ENDPOINT_UPDATE_INFO, {
      provider_name: providerName,
      provider_address: address,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Add more methods as needed (e.g., PUT, DELETE, etc.)

export default API;
