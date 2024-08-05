import { useState } from 'react'

import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

import clsxm from '../../lib/frontend/clsxm'
import { uploadFile } from '../../lib/services'
import { useSessionStore } from '../../store/sessionStore'
import { getImgUrl } from '../../utils/getImgUrl'
import { useParams, useRouter } from 'next/navigation'
import {
  CREATE_APP_NEW_MUTATION,
  GET_APPS_QUERY,
  UPDATE_APP_NEW_MUTATION,
} from '@/lib/graphql-queries'
import UploadFile from '../UploadFile'
import Button from '../Button'
import { App } from '@/types'

const isValidEthereumAddress = (address: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

interface CreateAppFormValues {
  name: string
  image: {
    doc: {
      id: string
    }
  }
  banner: {
    doc: {
      id: string
    }
  }
  link: string
  type: string
  tokenGating: string
  contractAddress: string
  tokenGatingAmount: string
  network: string
}

interface CreateAppProps {
  isEditing?: boolean
  app?: App
}

const CreateApp = ({ isEditing, app }: CreateAppProps) => {
  const router = useRouter()
  const { partnerId } = useParams()


  const { token } = useSessionStore.getState()

  const [createAppMutation, { loading, error }] = useMutation(
    CREATE_APP_NEW_MUTATION,
    {
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      refetchQueries: [{ query: GET_APPS_QUERY }],
    }
  )
  const [
    updateAppMutation,
    { data, loading: updateAppLoading, error: updateError },
  ] = useMutation(UPDATE_APP_NEW_MUTATION, {
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
    // refetchQueries: [{ query: GET_PARTNERS_QUERY }],
  })

  const isLoading = loading || updateAppLoading

  const createAppSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    image: Yup.mixed().required('Image is required'),
    link: Yup.string()
      .required('Link is required')
      .url('Link must be a valid URL'),
    type: Yup.string().required('Type is required'),
    tokenGating: Yup.string().required('Token gating option is required'),
    network: Yup.string().required('Network option is required'),
  })

  const defaultValues = {
    name: isEditing ? app?.name : '',
    image: isEditing ? app?.image?.id : '',
    banner: isEditing ? app?.banner?.id : '',
    link: isEditing ? app?.link : '',
    type: isEditing ? app?.type : 'DAPP',
    tokenGating: isEditing ? app?.tokenGating : 'NO',
    contractAddress: isEditing ? app?.contractAddress : '',
    tokenGatingAmount: isEditing ? app?.tokenGatingAmount : '',
    network: isEditing ? app?.network : '_137',
  }

  const methods = useForm<CreateAppFormValues>({
    // @ts-ignore
    resolver: yupResolver(createAppSchema),
    // @ts-ignore
    defaultValues,
  })

  const {
    register,
    reset,
    watch,
    setError,
    clearErrors,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods
  const handleOnDrop = async (
    files: File[],
    key?: keyof CreateAppFormValues
  ) => {
    const formData = new FormData()
    formData.append('file', files[0])

    const uploadImage = await uploadFile(formData)
    if (key) setValue(key, uploadImage)

    return uploadImage
  }

  const tokenGating = watch('tokenGating')

  const [customErrors, setCustomErrors] = useState({
    contractAddress: '',
    tokenGatingAmount: '',
  })

  const validateTokenGating = () => {
    const contractAddress = watch('contractAddress')
    const tokenGatingAmount = watch('tokenGatingAmount')
    let newErrors = { ...customErrors }

    if (tokenGating === 'AT_LEAST_X') {
      if (!contractAddress || !isValidEthereumAddress(contractAddress)) {
        newErrors.contractAddress =
          'Please enter a valid Ethereum contract address'
      } else {
        newErrors.contractAddress = ''
      }

      if (!tokenGatingAmount || Number(tokenGatingAmount) <= 0) {
        newErrors.tokenGatingAmount = 'Amount must be greater than 0'
      } else {
        newErrors.tokenGatingAmount = ''
      }
    } else if (tokenGating === 'AT_LEAST_X_NATIVE') {
      if (!tokenGatingAmount || Number(tokenGatingAmount) <= 0) {
        newErrors.tokenGatingAmount = 'Amount must be greater than 0'
      } else {
        newErrors.tokenGatingAmount = ''
      }
    } else {
      newErrors = { contractAddress: '', tokenGatingAmount: '' }
    }

    setCustomErrors(newErrors)
    return newErrors
  }

  const onSubmit = async (data: CreateAppFormValues) => {
    const errors = validateTokenGating()
    const hasErrors = Object.values(errors).some((error) => error)

    if (hasErrors) {
      return
    }

    const newImageId = data?.image?.doc?.id?.toString()
    const newBannerId = data?.banner?.doc?.id?.toString()

    const variables = {
      name: data.name,
      image: newImageId || data.image,
      banner: newBannerId || data.banner,
      link: data.link,
      // type: data.type,
      tokenGating: data.tokenGating,
      contractAddress: data.contractAddress,
      tokenGatingAmount: Number(data.tokenGatingAmount),
      network: data.network,
      ...(isEditing && {
        id: app?.id,
      }),
    }

    if (isEditing) {
      await updateAppMutation({
        variables,
      })
    } else {
      await createAppMutation({
        variables,
      })
    }
    router.push( `/partners/${partnerId}/apps-games`)

  }
  return (
    <>
      <div className='mx-auto'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-9'>
            {/* <!-- Input Fields --> */}
            <div className='rounded-sm glass p-4'>
              <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                <h3 className='font-medium text-black dark:text-white'>
                  Submit for review
                </h3>
              </div>
              <div className='flex flex-col gap-5.5 p-6.5'>
                <div>
                  <label className='mb-3 block text-black dark:text-white'>
                    Name
                  </label>
                  <input
                    {...register('name')}
                    type='text'
                    className={clsxm(
                      'w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    )}
                  />
                  {errors?.name?.message && (
                    <p className='text-meta-1 text-14 mt-2'>
                      {errors?.name?.message}
                    </p>
                  )}
                </div>

                <div>
                  <UploadFile
                    showPreview
                    imagePreview={
                      app?.image?.url ? getImgUrl(app?.image?.url) : undefined
                    }
                    label='Image'
                    error={errors?.image?.message}
                    onDrop={(files: File[]) => {
                      handleOnDrop(files, 'image')
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
                    imagePreview={
                      app?.banner?.url ? getImgUrl(app?.banner?.url) : undefined
                    }
                    label='Banner'
                    error={errors?.banner?.message}
                    onDrop={(files: File[]) => {
                      handleOnDrop(files, 'banner')
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
                  <label className='mb-3 block text-black dark:text-white'>
                    Link
                  </label>
                  <input
                    {...register('link')}
                    type='text'
                    // placeholder="Default Input"
                    className='w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                  />
                  {errors?.link?.message && (
                    <p className='text-meta-1 text-14 mt-2'>
                      {errors?.link?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className='mb-3 block text-black dark:text-white'>
                    Type
                  </label>
                  <div className='relative z-20 dark:bg-form-input'>
                    <span className='absolute top-1/2 left-4 z-30 -translate-y-1/2'>
                      <svg
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                        <g opacity='0.8'>
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M10.0007 2.50065C5.85852 2.50065 2.50065 5.85852 2.50065 10.0007C2.50065 14.1428 5.85852 17.5007 10.0007 17.5007C14.1428 17.5007 17.5007 14.1428 17.5007 10.0007C17.5007 5.85852 14.1428 2.50065 10.0007 2.50065ZM0.833984 10.0007C0.833984 4.93804 4.93804 0.833984 10.0007 0.833984C15.0633 0.833984 19.1673 4.93804 19.1673 10.0007C19.1673 15.0633 15.0633 19.1673 10.0007 19.1673C4.93804 19.1673 0.833984 15.0633 0.833984 10.0007Z'
                            fill='#637381'
                          />
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M0.833984 9.99935C0.833984 9.53911 1.20708 9.16602 1.66732 9.16602H18.334C18.7942 9.16602 19.1673 9.53911 19.1673 9.99935C19.1673 10.4596 18.7942 10.8327 18.334 10.8327H1.66732C1.20708 10.8327 0.833984 10.4596 0.833984 9.99935Z'
                            fill='#637381'
                          />
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M7.50084 10.0008C7.55796 12.5632 8.4392 15.0301 10.0006 17.0418C11.5621 15.0301 12.4433 12.5632 12.5005 10.0008C12.4433 7.43845 11.5621 4.97153 10.0007 2.95982C8.4392 4.97153 7.55796 7.43845 7.50084 10.0008ZM10.0007 1.66749L9.38536 1.10547C7.16473 3.53658 5.90275 6.69153 5.83417 9.98346C5.83392 9.99503 5.83392 10.0066 5.83417 10.0182C5.90275 13.3101 7.16473 16.4651 9.38536 18.8962C9.54325 19.069 9.76655 19.1675 10.0007 19.1675C10.2348 19.1675 10.4581 19.069 10.6159 18.8962C12.8366 16.4651 14.0986 13.3101 14.1671 10.0182C14.1674 10.0066 14.1674 9.99503 14.1671 9.98346C14.0986 6.69153 12.8366 3.53658 10.6159 1.10547L10.0007 1.66749Z'
                            fill='#637381'
                          />
                        </g>
                      </svg>
                    </span>
                    <select
                      className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input'
                      {...register('type')}>
                      <option value='DAPP' className='text-black'>
                        DAPP
                      </option>
                      <option value='APP' className='text-black'>
                        APP
                      </option>
                      <option value='WEB' className='text-black'>
                        WEB
                      </option>
                    </select>
                    <span className='absolute top-1/2 right-4 z-10 -translate-y-1/2'>
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                        <g opacity='0.8'>
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z'
                            fill='#637381'
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div>
                  <label className='mb-3 block text-black dark:text-white'>
                    Token Gating
                  </label>
                  <select
                    {...register('tokenGating')}
                    className='w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'>
                    <option value='NO' className='text-black'>
                      None
                    </option>
                    <option value='AT_LEAST_X' className='text-black'>
                      Based on Token Quantity
                    </option>
                    <option value='AT_LEAST_X_NATIVE' className='text-black'>
                      Based on Balance
                    </option>
                  </select>
                </div>

                {tokenGating === 'AT_LEAST_X' && (
                  <>
                    <div>
                      <label className='mb-3 block text-black dark:text-white'>
                        Smart contract address
                      </label>
                      <input
                        {...register('contractAddress')}
                        type='text'
                        className='w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                      />
                      {customErrors.contractAddress && (
                        <p className='text-meta-1 text-14 mt-2'>
                          {customErrors.contractAddress}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className='mb-3 block text-black dark:text-white'>
                        Token Gating Amount
                      </label>
                      <input
                        {...register('tokenGatingAmount')}
                        type='number'
                        className='w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                      />
                      {customErrors.tokenGatingAmount && (
                        <p className='text-meta-1 text-14 mt-2'>
                          {customErrors.tokenGatingAmount}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className='mb-3 block text-black dark:text-white'>
                        Network
                      </label>
                      <select
                        className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input'
                        {...register('network')}>
                        <option value='_137' className='text-black'>Polygon</option>
                        <option value='_1' className='text-black'>Ethereum</option>
                        <option value='_97' className='text-black'>BNB</option>
                      </select>
                    </div>
                  </>
                )}

                {tokenGating === 'AT_LEAST_X_NATIVE' && (
                  <>
                    <div>
                      <label className='mb-3 block text-black dark:text-white'>
                        Token Gating Amount
                      </label>
                      <input
                        {...register('tokenGatingAmount')}
                        type='number'
                        className='w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                      />
                      {customErrors.tokenGatingAmount && (
                        <p className='text-meta-1 text-14 mt-2'>
                          {customErrors.tokenGatingAmount}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className='mb-3 block text-black dark:text-white'>
                        Token
                      </label>
                      <select
                        className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input'
                        {...register('network')}>
                      <option value='_137' className='text-black'>Polygon</option>
                        <option value='_1' className='text-black'>Ethereum</option>
                        <option value='_97' className='text-black'>BNB</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              <div className='flex justify-end gap-4.5 p-6.5'>
                <Button
                  variant='outlined'
                  onClick={() => {
                    reset()
                    router.push( `/partners/${partnerId}/apps-games`)
                  }}>
                  Cancel
                </Button>

                <Button isLoading={isLoading} type='submit'>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default CreateApp
