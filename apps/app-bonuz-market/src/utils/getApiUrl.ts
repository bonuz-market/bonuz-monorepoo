/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { backendUrl, baseUrl } from 'config';

export const apiUrl = backendUrl! + baseUrl!;
// export const getApiUrl = (_url: string) => backendUrl + _url;
export const getApiUrl = (_url: string) => apiUrl + _url;
