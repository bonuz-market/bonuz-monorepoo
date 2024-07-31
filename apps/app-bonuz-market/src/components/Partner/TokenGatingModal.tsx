import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef
} from 'react';

import { Dialog, Transition } from '@headlessui/react';
import Button from '../Button';



interface User {
  handle?: string;
  walletAddress?: string;
}

export const TokenGatingModal = ({
  user,
  open,
  setOpen,
}: {
  user: User;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => (
  <Transition.Root show={open} as={Fragment}>
    <Dialog
      as="div"
      className="relative z-999999"
      // initialFocus={cancelButtonRef}
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
                    Token Gating
                  </Dialog.Title>
                  {/* A course certificate is a document that certifies that a
                    specific person completed a course will be minted for user
                    with the following details: */}

                  <div className="mt-2">

                    {user?.handle ? (
                      <>
                        <h2 className='text-2xl font-semibold leading-6 text-success mb-2'>User have the Membership token</h2>

                        <h5>Handle:</h5>

                        <p className="text-sm text-[#ffffff80]">
                          {user?.handle}
                        </p>
                        <h5>Wallet Address:</h5>

                        <p className="text-sm text-[#ffffff80]">
                          {user?.walletAddress}
                        </p>
                      </>
                    ) :
                      <>
                        <h2 className='text-2xl font-semibold leading-6 text-meta-1'>User does not have Membership token</h2>
                      </>
                    }


                  </div>

                  <div className="mt-4 flex justify-end gap-4">
                    <Button
                      variant="outlined"
                      className="h-[50px] w-[150px]"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      Close
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
