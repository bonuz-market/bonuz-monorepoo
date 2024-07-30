import { useState } from 'react';

import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import UploadFile from '../../components/UploadFile';
import { uploadFile } from '../../lib/services';
import { useSessionStore } from '../../store/sessionStore';
import { getImgUrl } from '../../utils/getImgUrl';
import { useRouter } from 'next/navigation';
import { ADD_NEW_PARTNER_MUTATION, UPDATE_PARTNER_MUTATION } from '@/lib/graphql-queries';
import MarkdownInput from '../MarkdownInput';
import Button from '../Button';
interface CreatePartnerFormValues {
  name: string;
  description: string;
  image: {
    doc: {
      id: string;
    };
  };
  logo: {
    doc: {
      id: string;
    };
  };
  partnerLink: string;
  // externalNftCollection: string;
}

interface CreatePartnerProps {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void
  partner: any;
}

const CreatePartner = ({ isEditing, setIsEditing, partner }: CreatePartnerProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { token } = useSessionStore.getState();

  const [createPartnerMutation, { loading }] = useMutation(
    ADD_NEW_PARTNER_MUTATION,
    {
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      // refetchQueries: [{ query: GET_PARTNERS_QUERY }],
    },
  );


  const [updatePartnerMutation, { data, loading: updatePartnerLoading, error }] = useMutation(
    UPDATE_PARTNER_MUTATION,
    {
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      // refetchQueries: [{ query: GET_PARTNERS_QUERY }],
    },
  );

  const isLoading = loading || updatePartnerLoading

  const createAppSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    image: Yup.mixed().required('Image is required'),
    logo: Yup.mixed().required('Logo is required'),
    partnerLink: Yup.string()
      .required('Field is required')
      .url('Must be a valid URL'),
    // externalNftCollection: Yup.string()
    //   .required('Field is required')
    //   .url('Must be a valid URL'),
  });

  const defaultValues = {
    name: isEditing ? partner?.name : '',
    description: isEditing ? partner?.description : '',
    image: isEditing ? partner?.image?.id : '',
    logo: isEditing ? partner?.logo?.id : '',
    partnerLink: isEditing ? partner?.link : '',
    // externalNftCollection: isEditing ? partner?.externalNftCollection : ''
  };

  const methods = useForm<CreatePartnerFormValues>({
    // @ts-ignore
    resolver: yupResolver(createAppSchema),
    defaultValues,
  });

  const {
    control,
    register,
    reset,
    watch,
    setError,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const handleOnDrop = async (
    files: File[],
    key?: keyof CreatePartnerFormValues,
  ) => {
    const formData = new FormData();
    formData.append('file', files[0]);

    const uploadImage = await uploadFile(formData);
    if (key) setValue(key, uploadImage);

    return uploadImage;
  };

  // const watchCategory = watch('category', '');
  // console.log('watchCategory ', watchCategory);

  const onSubmit = async (data: CreatePartnerFormValues) => {

    const newImageId = data?.image?.doc?.id?.toString()
    const newLogoId = data?.logo?.doc?.id?.toString()

    const variables = {
      name: data.name,
      description: data.description,
      image: newImageId || data.image,
      logo: newLogoId || data.logo,
      link: data.partnerLink,
      // externalNftCollection: data.externalNftCollection,
      externalNftCollection: '',
      ...(isEditing && {
        id: partner?.id
      })
    };

    if (isEditing) {
      await updatePartnerMutation({
        variables,
      });
    }
    else {
      await createPartnerMutation({
        variables,
      });
    }


    const queryKey = ['getUserPartnersNew'];
    queryClient.invalidateQueries({
      queryKey,
    });
    setIsEditing(false)
  };


  return (
    <>
      <div className="mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="rounded-sm glass p-4">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Submit for review
                </h3>
              </div>
              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                 Your Company / Brand / Organization 
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className="w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  {errors?.name?.message && (
                    <p className="text-meta-1 text-14 mt-2">
                      {errors?.name?.message}
                    </p>
                  )}
                </div>

                <div>
                  <MarkdownInput
                    label="Description"
                    error={errors?.description?.message}
                    onChange={(value: string | undefined) => {
                      if (value) setValue('description', value);
                    }}
                    value={partner?.description}
                  />
                </div>

                <div>
                  <UploadFile
                    showPreview
                    imagePreview={partner?.image?.url ? getImgUrl(partner?.image?.url) : undefined}
                    label="Your Logo (Please use a square image. Recommended size: 600 x 600px) "
                    error={errors?.image?.message}
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
                  />
                </div>
                <div>
                  <UploadFile
                    showPreview
                    imagePreview={partner?.logo?.url ? getImgUrl(partner?.logo?.url) : undefined}
                    label="Your Banner"
                    error={errors?.logo?.message}
                    onDrop={(files: File[]) => {
                      handleOnDrop(files, 'logo');
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
                  />
                </div>
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Your Website
                  </label>
                  <input
                    {...register('partnerLink')}
                    type="text"
                    className="w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  {errors?.partnerLink?.message && (
                    <p className="text-meta-1 text-14 mt-2">
                      {errors?.partnerLink?.message}
                    </p>
                  )}
                </div>

                {/* <div> */}
                {/*   <label className="mb-3 block text-black dark:text-white"> */}
                {/*     External NFT Collection Link */}
                {/*   </label> */}
                {/*   <input */}
                {/*     {...register('externalNftCollection')} */}
                {/*     type="text" */}
                {/*     className="w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" */}
                {/*   /> */}
                {/*   {errors?.externalNftCollection?.message && ( */}
                {/*     <p className="text-meta-1 text-14 mt-2"> */}
                {/*       {errors?.externalNftCollection?.message} */}
                {/*     </p> */}
                {/*   )} */}
                {/* </div> */}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4.5 p-6.5">
            <Button
              variant="outlined"
              type='button'
              onClick={() => {
                setIsEditing(false)
                reset();
                router.push('/');
              }}
            >
              Cancel
            </Button>

            <Button isLoading={isLoading} type="submit">
              Save
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreatePartner;
