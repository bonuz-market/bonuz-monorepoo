import { useState } from 'react';

import { Controller, useForm } from 'react-hook-form';

import BiconomyButton from '../Biconomy';
import Button from '../Button';

const CreateSocialId = ({
  onCreateSocialId,
  isCreatingSocialId,
  creatingSocialIdError,
}: {
  onCreateSocialId: (data: {
    handle: string;
    name: string;
    imageFile: File | null;
  },
  ) => Promise<void>;
  isCreatingSocialId: boolean
  creatingSocialIdError: string | null;

}) => {
  const { register, formState, handleSubmit, control } = useForm<{
    handle: string;
    name: string;
    profileImage: string;
  }>();

  const onSubmit = handleSubmit(async (data) => {
    await onCreateSocialId({
      ...data,
      imageFile,
    });
  });

  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  return (
    <div className="flex  flex-col items-center justify-center gap-4">


      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <div className="shape-outer hexagon absolute top-[-80px] z-10 place-self-center sm:relative sm:top-[0px]">
          <Controller
            name="profileImage"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <div
                className="shape-inner hexagon"
                style={{
                  backgroundImage: `url(${image ?? value})`,
                }}
              >
                <input
                  {...field}
                  type="file"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);

                      reader.onload = () => {
                        setImageFile(file);
                        setImage(reader.result as string);
                      };
                    }

                    onChange(e);
                  }}
                />
              </div>
            )}
          />
        </div>

        {creatingSocialIdError && (
          <p className="text-danger text-[20px]">{creatingSocialIdError}</p>
        )}


        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Handle
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter your handle"
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              {...register('handle', {
                required: true,
                // pattern: /^[a-zA-Z]+$/i,
              })}
            />

          </div>
          {formState.errors.handle?.type === 'pattern' && (
            <p className="text-danger mt-1">
              Please enter valid handle. Only letters are allowed.
            </p>
          )}
          {formState.errors.handle?.type === 'required' && (
            <p className="text-danger mt-1">Required</p>
          )}
        </div>



        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Name
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              id="handle"
              {...register('name', {
                required: true,
              })}
            />

          </div>
          {formState.errors.name &&
            formState.errors.name.type === 'required' && (
              <p className="text-danger mt-1">Required</p>
            )}
        </div>



        <Button
          transition
          className="w-[400px] h-[50px] rounded-[10px]"
          type="submit"
          isLoading={isCreatingSocialId}
        >
          Create your Decentralized Social ID
        </Button>
      </form>

      <BiconomyButton />
    </div>
  );
};

export default CreateSocialId;
