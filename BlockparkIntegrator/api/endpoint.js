const HOST = "http://10.0.2.2:8000";

export const ENDPOINT_REGISTER = HOST + "/register";
export const ENDPOINT_LOGIN = HOST + "/login";
export const ENDPOINT_USER_INFO = HOST + "/protected/get_user_info";
export const ENDPOINT_ACTIVE_SESSION = HOST + "/protected/active_session";
export const ENDPOINT_UPDATE_USER_INFO = HOST + "/protected/update_user_info";
export const ENDPOINT_REFRESH_TOKEN = HOST + "/refresh_token";
export const ENDPOINT_GET_ALL_PROVIDERS = HOST + "/protected/get_all_providers";
export const ENDPOINT_GET_ALL_AVAILABLE_PARKING_SLOT_BY_PROVIDER_ID =
  HOST + "/protected/get_available_parking_slot_by_provider_id/";
export const ENDPOINT_ASSIGN = HOST + "/protected/assign_parking_slot";
