type NFTAttribute = {
  key: string;
  value: string;
};

type NFTContentPreview = {
  url: string;
};

type NFTContent = {
  preview: NFTContentPreview;
};

export type NFT = {
  content: NFTContent;
  contract_address: string;
  name: string;
  token_id: string;
  description: string;
  attributes: NFTAttribute[];
  external_url: string;
  interfaces: string[];
  last_transferred_at: number;
};

type NFTData = {
  nfts: NFT[];
};

export type NFTResponse = {
  message: string;
  data: NFTData;
};
