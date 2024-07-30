import { useCallback, useState } from 'react';

import { Icon } from '@iconify/react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import CanvasTicketVoucher from './CanvasTicketVoucher';

interface UploadFileProps {
  showPreview?: boolean;
  imagePreview?: string | undefined
  label?: string;
  onDrop: (files: File[]) => void;
  error: string | undefined;
  dropzoneOptions?: DropzoneOptions;
  setImgDimensions: ({ width, height }: { width: number, height: number }) => void;
}

const UploadFileVoucher = ({
  label,
  imagePreview: imagePreviewProp,
  onDrop,
  showPreview = false,
  error,
  dropzoneOptions,
  setImgDimensions
}: UploadFileProps) => {

  const [imagePreview, setImagePreview] = useState<string | undefined>(imagePreviewProp);

  const {
    getRootProps: getRootPropsImage,
    getInputProps: getInputPropsImage,
    isDragActive: isDragActiveImage,
  } = useDropzone({
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
          const img = new Image();
          img.onload = () => {
            const { width, height } = img;
            setImgDimensions({ width, height });
          };
          img.src = reader.result as string;

        };
        reader.readAsDataURL(file);

        onDrop(acceptedFiles);
      },
      [onDrop, setImgDimensions],
    ),
    ...dropzoneOptions,
  });

  return (
    <div className='h-100'>
      {label && (
        <label className="mb-3 block text-black dark:text-white">{label}</label>
      )}
      <div
        {...getRootPropsImage()}
        className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[.5008px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white cursor-pointer h-100"
      >
        <input
          {...getInputPropsImage()}
          type="file"
          className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[.5008px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
        />

        {showPreview && imagePreview ? (
          <div className="flex items-center justify-between h-full">
            <img src={imagePreview} className="w-90 mb-2" alt='img' />
            {/* <CanvasTicketVoucher
                width={950}
                height={950}
                // backgroundColor={backgroundColor}
                // overlayImage="/assets/membership.png"
                // title={title}
                // name={imageData.title}
                // logoUrl={imageData.logo ?? ''}
                // stageRef={stageRef}
              /> */}
            <div className="flex items-center cursor-pointer">
              <Icon
                icon="uil:trash"
                onClick={(event) => {
                  event.stopPropagation();
                  setImagePreview(undefined);
                  // setValue('image1', null);
                }}
                className="h-6 w-6"
              />
            </div>
          </div>
        ) : isDragActiveImage ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Icon
              icon="material-symbols:file-upload"
              className="h-8 w-8 text-gray-500 mb-2"
            />
            <p>Drop the file here ...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Icon
              icon="material-symbols:file-upload"
              className="h-8 w-8 text-gray-500 mb-2"
            />

            <p>Drag n`&apos;` drop file here, or click to select file</p>
          </div>
        )}

        {error && <p className="text-meta-1 text-14 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default UploadFileVoucher;
