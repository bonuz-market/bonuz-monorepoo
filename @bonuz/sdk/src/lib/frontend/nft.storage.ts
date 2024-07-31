import { Buffer } from "buffer";

// import '@/lib/env'
import { BACKEND_ENDPOINT } from "../services";
import axios from "axios";

export const uploadImageToIPFS = async (image: any) => {
	console.log("image ", image);
	try {
		// // Upload the image to IPFS
		// const result1 = await client.store({
		//   name: image.name,
		//   description: image.description ?? `This is ${image.name} image`,
		//   image,
		// });

		// const metadataUrl = result1.url.replace('ipfs://', 'https://ipfs.io/ipfs/');
		// const metadataResponse = await fetch(metadataUrl);
		// const metadata = await metadataResponse.json();

		// return metadata.image.replace('ipfs://', 'https://ipfs.particle.network/');
		const formData = new FormData();
		formData.append("image", image);

		const res = await axios.post(`${BACKEND_ENDPOINT}/upload-file`, formData);

		return res?.data?.url;
	} catch (e) {
		console.log(e);
		throw new Error("Error uploading image to IPFS");
	}
};
