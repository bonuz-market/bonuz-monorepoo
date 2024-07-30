import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Dialog, Transition } from '@headlessui/react';

import { Button } from '../../../components';
import Checkbox from '../../../components/Checkbox';
import CanvasTicketMembership from './CanvasTicketMembership';
import UploadFile from '../../../components/UploadFile';
import { uploadFile } from '../../../lib/services';
import UploadFileVoucher from './UploadFileVoucher';
import CanvasTicketVoucher from './CanvasTicketVoucher';
import { Icon } from '@iconify/react/dist/iconify.js';

interface ImageData {
  title: string;
  logo?: string;
}

interface User {
  handle?: string;
  walletAddress: string;
}

export const MintModalVoucher = ({
  title,
  open,
  setOpen,
  templateImage,
  imageData,
  user,
  handleMint: handleMintCallback,
  isLoading,
  setIsLoading,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  templateImage?: string;
  title: string;
  imageData: ImageData;
  user: User;
  handleMint: (
    base64Image: string,
    isSoulBound: boolean,
    expiryDate: number,
  ) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}) => {
  const cancelButtonRef = useRef(null);
  const stageRef = useRef(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('lightblue');
  const [overlayColor, setOverlayColor] = useState('darkblue');
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

  // const [overlayOrientation, setOverlayOrientation] = useState('vertical'); // 'horizontal' or 'vertical'

  const handleMint = useCallback(async () => {
    const uri = (stageRef.current as unknown as HTMLCanvasElement)?.toDataURL();

    if (!uri) {
      return;
    }

    try {
      let expiryDateMs = 0;
      if (expiryDate) {
        // Create a date object from the input string
        const date = new Date(expiryDate);
        // Get the Unix timestamp (in seconds)
        expiryDateMs = Math.floor(date.getTime() / 1000);
      }

      await handleMintCallback(uri, isChecked, expiryDateMs);
      setOpen(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setOpen(false);
    }
  }, [expiryDate, handleMintCallback, isChecked, setIsLoading, setOpen]);

  const handleOnDrop = async (files: File[], key?: string) => {
    const formData = new FormData();
    formData.append('file', files[0]);

    const file = files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // The result contains the Base64 encoded image data
        const base64Data = reader.result;
        setBase64Image(base64Data as string);
      };

      reader.readAsDataURL(file);
    }

    // const uploadImage = await uploadFile(formData);
    // if (key) setValue(key, uploadImage);

    // return uploadImage;
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-999999"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full w-full items-end justify-center p-4 text-center sm:items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full transform overflow-hidden rounded-2xl bg-[#3d4d60] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl">
                <div className="bg-[#3d4d60] px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="mt-3 flex w-full flex-col gap-4 text-center sm:mt-0 sm:text-left lg:p-4">
                    <Dialog.Title
                      as="h3"
                      className="border-b-1 border-[#ffffff0f] pb-2 text-4xl font-semibold leading-6 text-white"
                    >
                      {title}
                    </Dialog.Title>
                    {/* A course certificate is a document that certifies that a
                    specific person completed a course will be minted for user
                    with the following details: */}

                    <div className="mt-2">
                      {user.handle && (
                        <>
                          <h5>Handle:</h5>

                          <p className="text-sm text-[#ffffff80]">
                            {user.handle}
                          </p>
                        </>
                      )}

                      <h5>Wallet Address:</h5>

                      <p className="text-sm text-[#ffffff80]">
                        {user.walletAddress}
                      </p>
                    </div>
                    <div>
                      <div className="ml-0">
                        <div className="">
                          {base64Image ? (
                            <div className='relative border border-red-500'>
                              <CanvasTicketVoucher
                                backgroundColor={backgroundColor}
                                overlayImage={base64Image}
                                title={title}
                                name={imageData.title}
                                logoUrl={imageData.logo ?? ''}
                                stageRef={stageRef}
                              />

                              <div className="flex items-center cursor-pointer absolute top-50 right-5">
                                <Icon
                                  icon="uil:trash"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setBase64Image(null);
                                  }}
                                  className="h-6 w-6"
                                />
                              </div>
                            </div>
                          ) : (
                            <UploadFileVoucher
                              showPreview
                              // imagePreview={
                              //   event?.image?.url
                              //     ? getImgUrl(event?.image?.url)
                              //     : undefined
                              // }
                              label="Image"
                              error={undefined}
                              onDrop={(files: File[]) => {
                                handleOnDrop(files, 'image');
                              }}
                              dropzoneOptions={{
                                accept: {
                                  'image/jpeg': [],
                                  'image/png': [],
                                  'image/webp': [],
                                  'image/heic': [],
                                  'image/jfif': [],
                                },
                                multiple: false,
                              }}
                              setImgDimensions={setImgDimensions}
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-center mt-10 gap-10">
                        {/* <div>
                          <label className="text-black dark:text-white">
                            Background Color:
                          </label>
                          <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="mx-5"
                          />
                        </div> */}
                        {/* <Checkbox
                          isChecked={isChecked}
                          setIsChecked={setIsChecked}
                        /> */}
                        <div className="flex items-center justify-center gap-4">
                          <label className="text-black dark:text-white">
                            Expiry Date
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              onChange={(e) => setExpiryDate(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <ImageEditor
                      // templateImage='/assets/course-template.jpeg'
                      templateImage={templateImage}
                      text={{
                        courseTitle: imageData.title,
                        user: user.walletAddress,
                      }}
                      logo={{
                        src: imageData.logo,
                        width: 100,
                        height: 100,
                      }}
                      setBase64Image={setBase64Image}
                    /> */}
                    <div className="mt-4 flex justify-end gap-4">
                      <Button
                        variant="outlined"
                        className="h-[50px] w-[150px]"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        isLoading={isLoading}
                        className="h-[50px] w-[150px]"
                        onClick={handleMint}
                      >
                        Mint
                      </Button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

interface ImageEditorProps {
  templateImage: string;
  logo: {
    src?: string;
    width: number;
    height: number;
  };
  text: {
    courseTitle: string;
    user: string;
  };
  setBase64Image: (base64Image: string) => void;
}
const ImageEditor = memo<ImageEditorProps>(
  ({ templateImage, logo, text, setBase64Image }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleDraw = useCallback(() => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';

        // ctx.fillText(text.user, canvas.width / 2, canvas.height / 2 + 150);

        ctx.fillText(
          text.courseTitle,
          canvas.width / 2,
          canvas.height / 2 - 150,
        );

        if (logo.src) {
          const logoImg = new Image();
          logoImg.setAttribute('crossOrigin', 'anonymous');

          logoImg.onload = () => {
            const logoWidth = logo.width;
            const logoHeight = logo.height;
            const logoX = canvas.width / 2 - logoWidth / 2;
            const logoY = canvas.height - logoHeight - 800;

            ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);

            /**
             * * we are setting the image here because the logo is the last thing to be drawn
             */
            const base64Image = canvas.toDataURL('image/png');
            setBase64Image(base64Image);
          };

          logoImg.src = logo.src;
        } else {
          const base64Image = canvas.toDataURL('image/png');
          setBase64Image(base64Image);
        }
      };

      img.src = templateImage;
    }, [
      templateImage,
      text.courseTitle,
      logo.src,
      logo.width,
      logo.height,
      setBase64Image,
    ]);

    useEffect(() => {
      handleDraw();
    }, [handleDraw]);

    return (
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          objectFit: 'contain',
        }}
      />
    );
  },
);
