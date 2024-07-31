'use client'
import { useCallback, useEffect, useState } from 'react';

import { useQuery } from '@apollo/client';
import { ethers } from 'ethers';
import ReactMarkdown from 'react-markdown';
import QRCode from 'react-qr-code';
import { useParams, useRouter } from 'next/navigation';
import { useSessionStore } from '@/store/sessionStore';
import { useQueryPartners } from '@/hooks/queries';
import { CheckIns, PartnerStatus, TokenType } from '@/types';
import { useMediaQuery } from 'usehooks-ts';
import { GET_EVENT_BY_ID } from '@/lib/graphql-queries';
import { useBiconomyShallowStore } from '@/hooks/useBiconomyShallowStore';
import LoadingSpinner from '@/components/LoadingSpinner';
import { categoryToTokenTypeMapping, useMutationMintNft, useQueriesGetPublicUsersProfilesAndSocialLinks } from '@/hooks/useBonuzContracts';
import StyledIcon from '@/components/StyledIcon';
import Button from '@/components/Button';
import { getImgUrl } from '@/utils/getImgUrl';
import { MintModalPOP } from '@/components/Partner/MintModalPOP';
import EditPartnerEvent from '@/components/Partner/EditPartnerEvent';
import DashboardLayout from '@/components/DashboardLayout';


interface PartnerChallenges {
  id: string;
  name: string;
  description: string;
  image: {
    url: string;
  };
  link: string;
}

interface Event {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  image: {
    url: string;
  };
  logo: {
    url: string;
  };
  link: string;
  category: string;
  agenda: string;
  start_date: string;
  end_date: string;
  challenges_new: PartnerChallenges[];
  status: PartnerStatus;
  location: string;
  organizer: string;
  check_ins: CheckIns[];
}

const PartnerEventDetails = () => {
  const router = useRouter();
  const { token } = useSessionStore.getState();
  const { data: partners } = useQueryPartners();
  const { partnerId } = useParams();
  const { eventId } = useParams();
  // const qrCode = `https://bonuz-admin-wts46rwpca-ey.a.run.app/events/${eventId}`
  const qrCode = `https://app.bonuz.xyz/events/${eventId}`;

  const [usersPagination, setUsersPagination] = useState(1);

  const {
    data,
    loading: queryLoading,
    refetch,
  } = useQuery<{
    Event: Event;
  }>(GET_EVENT_BY_ID, {
    variables: {
      id: Number(eventId),
    },
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
    notifyOnNetworkStatusChange: true,
  });
  const partner = partners?.find(
    (partner: any) => partner.id === Number(partnerId),
  );

  // const tokenType = categoryToTokenTypeMapping[data?.Partner?.category ?? '']
  const tokenType = categoryToTokenTypeMapping.event;

  const { smartAccount } = useBiconomyShallowStore();
  const [openCheckInModal, setOpenCheckInModal] = useState(false);
  const [openMintModal, setOpenMintModal] = useState(false);
  const [mintData, setMintData] = useState<{
    date: string;
    title: string;
    logo?: string;
  }>();

  const [mintUserData, setMintUserData] = useState<{
    id?: string;
    handle?: string;
    walletAddress: string;
  }>();

  const [isBackendLoading, setIsBackendLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const handelOnSuccess = async (data: any) => {
    // TODO: set isMinted in the db
    setIsBackendLoading(false);
    setOpenMintModal(false);
  };

  const handleOnError = (error: any) => {
    setIsBackendLoading(false);
  };

  const { mutate: mintNft } = useMutationMintNft(
    handelOnSuccess,
    handleOnError,
  );

  const handleOpenMintModal = () => {
    setOpenMintModal(true);
  };

  const handleMint = useCallback(
    async (base64Image: string, expiryDate: number) => {
      setIsBackendLoading(true);
      const issuer = await smartAccount?.getAccountAddress();

      // const imageURL = await uploadBase64FileToIPFS(base64Image);
      const imageURL = "https://ipfs.io/ipfs/bafybeihzeulkinenvc3gc26b7nnlvturqv3c67z6k7vxgqxcbknvtglcae"

      const recipient = mintUserData?.walletAddress;
      // const recipient = '0x5259b360C93A2a89cc9cf9042eab61BAC65cF8A6' 
      const name = data?.Event?.title ?? '';
      const desc = data?.Event?.shortDescription ?? '';
      let isSoulBound = false;
      if (tokenType === TokenType.CERTIFICATE || tokenType === TokenType.POP) {
        isSoulBound = true;
      }
      // const expiryDate = data?.Event?.end_date ? Math.floor(new Date(data?.Event?.end_date).getTime() / 1000) : 0
      const points = 0;

      if (!recipient) {
        console.log('No recipient address');
        setIsBackendLoading(false);

        return;
      }

      if (!issuer) {
        console.log('No issuer address');
        setIsBackendLoading(false);

        return;
      }

      mintNft({
        recipient,
        tokenType,
        name,
        desc,
        isSoulBound,
        expiryDate,
        points,
        imageURL,
        //
        issuer,
        partner: eventId as string ?? '',
        user: mintUserData.id ?? '',
      });
    },
    [
      smartAccount,
      mintUserData?.id,
      mintUserData?.walletAddress,
      data?.Event?.title,
      data?.Event?.shortDescription,
      tokenType,
      mintNft,
      eventId,
    ],
  );

  const goBack = () => {
    router.push('/');
  };

  const handleRefresh = () => {
    refetch();
  };

  if (queryLoading || !data?.Event) {
    return <LoadingSpinner className="h-screen" />;
  }

  let templateImage = '';

  if (tokenType === TokenType.CERTIFICATE) {
    templateImage = '/assets/course-template.jpeg';
  } else if (tokenType === TokenType.POP) {
    templateImage = '/assets/poa-template.jpeg';
  } else if (tokenType === TokenType.LOYALTY) {
    templateImage = '/assets/poa-template.jpeg';
  } else if (tokenType === TokenType.MEMBERSHIP) {
    templateImage = '/assets/poa-template.jpeg';
  } else if (tokenType === TokenType.VOUCHER) {
    templateImage = '/assets/poa-template.jpeg';
  }

  // if (
  //   data.partner.issuerWallet !== address ||
  //   data.partner.category !== 'Events'
  // ) {
  //   router.push('/dashboard')

  //   // to prevent the page from rendering before the redirect
  //   return <LoadingSpinner className='h-screen' />
  // }

  // const totalCheckedInUsersPages = checkedInUsersQuery.data?.pageCount ?? 1

  // const goBack = () => {
  //   router.back()
  // }

  // const checkIns = [
  //   {
  //     "id": 28,
  //     "walletAddress": "0xF0A8391b201D66388D3389E2FF721f5e1c1E5709",
  //     "smartAccountAddress": "0xF0A8391b201D66388D3389E2FF721f5e1c1E5709",
  //     "handle": "Muzz",
  //     "connections": [

  //     ],
  //     "updatedAt": "2023-11-27T12:11:21.067Z",
  //     "createdAt": "2023-11-27T12:11:21.067Z"
  //   }
  // ]

  const handleDownloadQR = () => {
    const qr = document.getElementById('QRCode');
    if (!qr) return;
    const svgData = new XMLSerializer().serializeToString(qr);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = 4; // Increase this value to increase the download size of the QR code

    const img = new Image();
    img.onload = function () {
      // Adjust canvas size to account for scaling
      canvas.width = (img.width + 40) * scale;
      canvas.height = (img.height + 40) * scale;

      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw the image scaled
      ctx.drawImage(
        img,
        20 * scale,
        20 * scale,
        img.width * scale,
        img.height * scale,
      );

      const pngFile = canvas.toDataURL('image/png', 1.0);

      const downloadLink = document.createElement('a');
      downloadLink.download = 'QRCode';
      downloadLink.href = `${pngFile}`;
      downloadLink.target = '_blank';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      downloadLink.remove();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  const checkIns = data.Event?.check_ins ?? [];
  if (isEditing)
    return (
      <EditPartnerEvent
        setIsEditing={setIsEditing}
        partner={partner}
        event={data?.Event}
        handleRefresh={handleRefresh}
      />
    );

  return (
    <>
      <div className="flex justify-between items-center">
        <StyledIcon icon="mdi:arrow-left" onClick={goBack} />
        <h2 className="text-lg">Event Details</h2>
        <div className="flex items-center gap-4">
          <StyledIcon icon="mdi:refresh" onClick={handleRefresh} />

          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        </div>
      </div>
      {!partner && (
        <>
          <div className="flex items-center justify-center min-h-[50vh]">
            <h1 className="font-bold text-20">
              You are not owner of this event
            </h1>
          </div>
        </>
      )}
      {partner && (
        <>
          <div className="grid grid-col-1 sm:grid-cols-[500px_1fr_1fr] mt-10 gap-4">
            {/* the image's source domain is not uniform, so we can't use next/image here 
          unless we add the domains to the next.config.js file */}
            <img
              src={getImgUrl(data.Event.image?.url)}
              alt={data.Event.title}
              className="h-[320px] rounded-lg"
            />
            {/* Name + details + QR code */}
            <div className="flex flex-col gap-2 px-4 text-white">
              <div className="flex flex-col gap-2 ">
                <p className="text-lg font-bold">Name:</p>
                <h2> {data.Event?.title}</h2>
              </div>
              <div className="mt-2 rounded-t-lg bg-primary-light text-sm">
                <p className="text-lg font-bold">Details:</p>
              </div>
              <div className="rounded-b-lg bg-primary-main">
                {data.Event.description && (
                  <ReactMarkdown>{data.Event.description}</ReactMarkdown>
                )}
              </div>
            </div>
            <div className="rounded-t-lg bg-primary-light text-sm">
              <p className="text-lg mb-4 font-bold">
                Scan this QR code to Check-in
              </p>

              <div className="flex items-center justify-between gap-4">
                <QRCode id="QRCode" value={qrCode} size={256} />

                <Button onClick={handleDownloadQR}>Download QR</Button>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Challenges */}
            <ChallengesTable challenges={data.Event.challenges_new} />
            <CheckInsTable
              checkIns={checkIns}
              onClick={(checkIn: CheckIns) => {
                setMintData({
                  title: data.Event?.title,
                  date: formatDateString(checkIn?.createdAt),
                  logo: getImgUrl(data.Event.image?.url),
                });
                setMintUserData({
                  id: checkIn?.user?.id,
                  handle: checkIn?.user?.handle,
                  walletAddress: checkIn?.user?.smartAccountAddress,
                });
                setOpenMintModal(true);
                // setOpenCheckInModal(true);
              }}
            />
          </div>
        </>
      )}

      {mintData && mintUserData && (
        <MintModalPOP
          open={openMintModal}
          setOpen={setOpenMintModal}
          title="Proof of Participation"
          imageData={mintData}
          user={mintUserData}
          handleMint={handleMint}
          isLoading={isBackendLoading}
          setIsLoading={setIsBackendLoading}
        />
      )}

      {/* {mintData && mintUserData && (
        <CheckInsModalPOP
          open={openCheckInModal}
          setOpen={setOpenCheckInModal}
          title="User Information"
          imageData={mintData}
          user={mintUserData}
          handleOpenMintModal={handleOpenMintModal}
          isLoading={isBackendLoading}
          setIsLoading={setIsBackendLoading}
        />
      )} */}
    </>
  );
};


const formatDateString = (date: Date | string) =>
  new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });

const ChallengesTable = ({
  challenges,
}: {
  challenges: PartnerChallenges[];
}) => (
  <div className="rounded-sm px-5 pt-6 pb-2.5 sm:px-7.5 xl:pb-1 glass">
    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
      Challenges
    </h4>

    <div className="flex flex-col">
      <div className="grid grid-cols-[100px_1fr_1fr_1fr] rounded-sm bg-gray-2 dark:bg-meta-4">
        <div className="p-2.5 xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">Image</h5>
        </div>
        <div className="p-2.5 text-center xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">Name</h5>
        </div>
        <div className="p-2.5 text-center xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">
            Description
          </h5>
        </div>
        <div className="p-2.5 text-center xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">
            Link
          </h5>
        </div>
      </div>


      {challenges.map((challenge) => (
        <div key={challenge.id}>
          <div className="grid grid-cols-[100px_1fr_1fr_1fr]  border-b border-stroke dark:border-strokedark">
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">
                <img
                  src={getImgUrl(challenge.image?.url)}
                  alt="Brand"
                  className="w-20 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-start p-2.5 xl:p-5 w-full overflow-x-auto whitespace-nowrap md:w-full md:overflow-x-visible md:whitespace-normal">
              <p className="text-black dark:text-white">{challenge.name}</p>
            </div>

            <div className="flex items-center justify-start p-2.5 xl:p-5 w-full overflow-x-auto whitespace-nowrap md:w-full md:overflow-x-visible md:whitespace-normal">
              <p className="text-black dark:text-white">
                {challenge.description}
              </p>
            </div>

            <div className="flex items-center justify-start p-2.5 xl:p-5 w-full overflow-x-auto whitespace-nowrap md:w-full md:overflow-x-visible md:whitespace-normal">
              <a
                className="cursor-pointer underline"
                href={challenge.link}
                target="_blank"
                rel="noreferrer"
              >
                {challenge.link}
              </a>
          </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CheckInsTable = ({
  checkIns,
  onClick,
}: {
  checkIns: CheckIns[];
  onClick: (checkIn: CheckIns) => void;
}) => {
  const formatHandle = (handle: string) => {
    if (ethers.utils.isAddress(handle)) {
      return `${handle.slice(0, 6)}...${handle.slice(-4)}`;
    }

    return handle;
  };

  const usersProfiles =
    useQueriesGetPublicUsersProfilesAndSocialLinks(checkIns);

  return (
    <div className="rounded-sm px-5 pt-6 pb-2.5 sm:px-7.5 xl:pb-1 glass">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Check-Ins
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-[100px_1fr_1fr] rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Date
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Action
            </h5>
          </div>
        </div>

        {usersProfiles.map((user: any) => {
          const handle = user?.user?.handle ?? user?.user?.smartAccountAddress;

          const formattedHandle = formatHandle(handle);

          return (
            <div key={user.id}>
              <div className="grid grid-cols-[100px_1fr_1fr]  border-b border-stroke dark:border-strokedark">
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                    {ethers.utils.isAddress(handle) ? (
                      <p>{formattedHandle}</p>
                    ) : (
                      <a
                        className="cursor-pointer underline"
                        href={`https://bonuz.id/${handle}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {formattedHandle}
                      </a>
                    )}
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {Object.entries(user?.links?.socialMedias).map(
                        ([key, value]) => {
                          const { baseUrl, link, isPublic, icon, imgSrc } =
                            value as {
                              baseUrl: string;
                              link: string;
                              isPublic: boolean;
                              icon: any;
                              imgSrc: any;
                            };
                          if (!link || !isPublic) return null;
                          return (
                            <div key={key}>
                              <a
                                href={`https://${baseUrl}${link}`}
                                className="cursor-pointer no-underline"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  src={imgSrc}
                                  alt="icon"
                                  className="h-4 w-4"
                                />
                              </a>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  {formatDateString(user?.createdAt)}
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <Button
                    onClick={() => {
                      onClick(user);
                    }}
                  >
                    Mint
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};



export default function PartnerEventDetailsPage() {
  return (
    <DashboardLayout >
      <PartnerEventDetails />
    </DashboardLayout>
  )
}
