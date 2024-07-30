import { useCallback, useEffect, useState } from 'react';

import { Icon } from '@iconify/react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';

interface UploadFileProps {
  showPreview?: boolean;
  imagePreview?: string | undefined
  label?: string;
  onDrop: (files: File[]) => void;
  error: string | undefined;
  dropzoneOptions?: DropzoneOptions;
}

const UploadFile = ({
  label,
  imagePreview: imagePreviewProp,
  onDrop,
  showPreview=false,
  error,
  dropzoneOptions,
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
        };
        reader.readAsDataURL(file);

        onDrop(acceptedFiles);
      },
      [onDrop],
    ),
    ...dropzoneOptions,
  });

  useEffect(() => {
    setImagePreview(imagePreviewProp);
  }
  , [imagePreviewProp]);

  return (
    <div>
      {label && (
        <label className="mb-3 block text-black dark:text-white">{label}</label>
      )}
      <div
        {...getRootPropsImage()}
        className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[.5008px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white cursor-pointer"
      >
        <input
          {...getInputPropsImage()}
          type="file"
          className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[.5008px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
        />

        {showPreview && imagePreview ? (
          <div className="flex items-center justify-between">
            <img src={imagePreview} className="h-[120px] rounded-[20px]  w-[300px] object-cover" alt='img' />
            {/* <div className="" style={{
              backgroundImage: `url(${imagePreview})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '300px',
              height: '120px',
              borderRadius: '20px',
            }}></div> */}

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
          <div className="flex flex-col items-center">
            <Icon
              icon="material-symbols:file-upload"
              className="h-8 w-8 text-gray-500 mb-2"
            />
            <p>Drop the file here ...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
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

export default UploadFile;
