import { Buffer } from 'buffer';

// import '@/lib/env'
import { NFTStorage } from 'nft.storage';

const token = process.env.NEXT_PUBLIC_NFTSTORAGE_API_KEY ?? '';

if (!token) {
  throw new Error('Missing env variable NEXT_PUBLIC_NFTSTORAGE_API_KEY');
}

const client = new NFTStorage({
  token
});

export const uploadBase64FileToIPFS = async (base64Image: string) => {
  const cid = await client.storeBlob(base64ToFile(base64Image));

  return `ipfs/${cid}`;
};

const base64ToFile = (base64: string, type = 'image/png'): Blob => {
  const data = base64.split(',')[1];

  const binary = Buffer.from(data, 'base64').toString('binary');
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    array[i] = binary.charCodeAt(i);
  }

  const imgBlob = new Blob([array]);

  return new File([imgBlob], 'image.png', {
    type,
  });
};

export const uploadImageToIPFS = async (image: any) => {
  try {
    // Upload the image to IPFS
    const result1 = await client.store({
      name: image.name,
      description: image.description ?? `This is ${image.name} image`,
      image,
    });

    const metadataUrl = result1.url.replace('ipfs://', 'https://ipfs.io/ipfs/');
    const metadataResponse = await fetch(metadataUrl);
    const metadata = await metadataResponse.json();

    return metadata.image.replace('ipfs://', 'https://ipfs.particle.network/');
  } catch (e) {
    console.log(e);
    throw new Error('Error uploading image to IPFS');
  }
};
