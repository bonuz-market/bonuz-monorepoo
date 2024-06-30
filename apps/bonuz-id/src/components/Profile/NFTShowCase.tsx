import { Link } from 'react-router-dom';

import { Tabs } from '../../components';
import { NFT } from '../../types/backend';

const NFTShowCase = ({ nfts }: { nfts: NFT[] }) => {
  const attributeToTabMap: Record<string, string> = {
    VOUCHER: 'Voucher',
    LOYALTY: 'Loyalty Program',
    POA: 'POAs',
    MEMBERSHIP: 'Memberships',
    CERTIFICATE: 'Certificates',
  };

  const tabs = ['All', ...Object.keys(attributeToTabMap)].map((value) => {
    const content =
      value === 'All'
        ? nfts
        : nfts.filter(
          (nft) =>
            nft.attributes?.some((attribute) => attribute.value === value),
        );

    return {
      name: value === 'All' ? value : attributeToTabMap[value],
      content: (
        <div className="flex flex-col">
          {content.map((nft: NFT) => (
            <NFTCard
              key={nft.contract_address + nft.token_id}
              name={nft.name}
              description={nft.description}
              image={nft.content?.preview?.url ?? '/assets/nft-placeholder.svg'}
              external_url={nft.external_url}
            />
          ))}
        </div>
      ),
    };
  });

  return <Tabs tabs={tabs} />;
};

const NFTCard = ({
  name,
  description,
  image,
  external_url,
}: Pick<NFT, 'name' | 'description' | 'external_url'> & {
  image: string;
}) => (
  <Link
    className="flex flex-col gap-4  rounded-lg bg-primary-main p-4 md:flex-row"
    to={external_url ?? ''}
    target="_blank"
  >
    {/* 
  the image's source domain is not uniform, so we can't use next/image here
  unless we add the domains to the next.config.js file
*/}
    <img
      src={image || '/assets/nft-placeholder.svg'}
      alt={name}
      className="w-1/4 rounded-lg"
    />

    <div className=" flex-col justify-center gap-2">
      <p className="text-2xl font-medium text-white">{name || 'Untitled'}</p>

      <div className="flex flex-col justify-between gap-2 text-white text-opacity-60 md:flex-row">
        {!!description && (
          <p className="text-base">
            {description.length > 100
              ? `${description.slice(0, 100)}...`
              : description}
          </p>
        )}

        <p className="text-right text-base">
          {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  </Link>
);

export default NFTShowCase;
