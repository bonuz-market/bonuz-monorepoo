import { backendBaseUrl } from '../../config';

// export const getImgUrl = (image: string) => `${backendBaseUrl}${image}`;
export const getImgUrl = (image: string) => `${backendBaseUrl}/${image}`;
