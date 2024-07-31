import { backendBaseUrl } from "../../config";

export const apiUrl = backendBaseUrl! 
// export const getApiUrl = (_url: string) => backendUrl + _url;
export const getApiUrl = (_url: string) => apiUrl + _url;
