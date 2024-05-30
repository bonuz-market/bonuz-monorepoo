import Constants from 'expo-constants';
import { ImagePickerAsset } from 'expo-image-picker';
import ky from 'ky';
import mime from 'mime';

type PinStatus = 'queued' | 'pinning' | 'pinned' | 'failed';

interface Pin {
  cid: string;
  name: string;
  meta: Record<string, unknown>;
  status: PinStatus;
  created: string;
  size: number;
}

interface File {
  name: string;
  type: string;
}

interface Deal {
  batchRootCid: string;
  lastChange: string;
  miner: string;
  network: 'mainnet' | 'testnet';
  pieceCid: string;
  status: string;
  statusText: string;
  chainDealID: number;
  dealActivation: string;
  dealExpiration: string;
}

interface NFT {
  cid: string;
  size: number;
  created: string;
  type: string;
  scope: string;
  pin: Pin;
  name: string;
  files?: File[];
  deals?: Deal[];
}

const fetchImageFromUri = async (uri: string) => {
  const response = await fetch(uri);
  return response.blob();
};

export const uploadImageToIPFS = async (imageFile: ImagePickerAsset) => {
  try {
    const blob = await fetchImageFromUri(imageFile.uri);

    const res = await ky
      .post('https://api.nft.storage/upload', {
        body: blob,
        headers: {
          Authorization: `Bearer ${Constants.expoConfig?.extra?.nftStorageToken ?? ''}`,
          'Content-Type': imageFile.type ? mime.getType(imageFile.type) ?? 'image/*' : 'image/*',
        },
      })
      .json<{
        ok: boolean;
        value: NFT;
      }>();

    console.log(res);

    return `https://ipfs.particle.network/${res.value.cid}`;
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2));
  }
};
