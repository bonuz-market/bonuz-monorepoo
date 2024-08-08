import { useState } from 'react'

import { useMutation, useQuery } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useFieldArray, useForm } from 'react-hook-form'
import * as Yup from 'yup'

import {
  CREATE_APP_NEW_MUTATION,
  CREATE_CHALLENGE_MUTATION,
  GET_APPS_NEW_QUERY,
  GET_CHALLENGES_QUERY,
  GET_DEFAULT_CHALLENGES_QUERY,
  UPDATE_APP_NEW_MUTATION,
  UPDATE_CHALLENGE_MUTATION
} from '@/lib/graphql-queries'
import { App } from '@/types'
import { useParams, useRouter } from 'next/navigation'
import Select, {
  ActionMeta,
  components,
  MultiValue,
  MultiValueRemoveProps,
  StylesConfig,
} from 'react-select'
import clsxm from '../../lib/frontend/clsxm'
import { uploadFile } from '../../lib/services'
import { useSessionStore } from '../../store/sessionStore'
import { getImgUrl } from '../../utils/getImgUrl'
import Button from '../Button'
import { AddNewChallengesList } from '../Partner/AddNewChallengesList'
import UploadFile from '../UploadFile'

const isValidEthereumAddress = (address: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

interface I_AddNewChallenge {
  challengeId: number
  name: string
  description: string
  image: string
  imageId: string
  link: string
  btnLabel: string
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
  tokenGating: string
  contractAddress: string
  tokenGatingAmount: string
  network: string
  challenges: I_AddNewChallenge[]
}


interface Challenge {
  id: number
  name: string
  description: string
  image: {
    id: string
    url: string
  }
  link: string
  btnLabel: string
}

interface ChallengesData {
  docs: Challenge[]
}

interface DefaultChallenge {
  id: number
  name: string
  description: string
  image: {
    id: string
    url: string
  }
}

interface DefaultChallenges {
  docs: DefaultChallenge[]
}

// Assuming Challenge type is defined as before
interface ChallengeOption {
  challengeId: number
  value: number | string
  label: string
  name: string
  description: string
  image: string
  imageId: string
  isRemovable: boolean
  link: string
  btnLabel: string
}

// Dark theme styles
const darkThemeStyles: StylesConfig<ChallengeOption, true> = {
  control: (base) => ({
    ...base,
    backgroundColor: '#333',
    borderColor: '#555',
    color: 'white',
    '&:hover': {
      borderColor: '#777',
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#555' : 'transparent',
    color: 'white',
    ':active': {
      ...base[':active'],
      backgroundColor: '#666',
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#333',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'white',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#555',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'white',
  }),
  multiValueRemove: (base) => ({
    ...base,
    ':hover': {
      backgroundColor: '#777',
      color: 'white',
    },
  }),
}
// Custom components for react-select
const { Option, SingleValue } = components
// Custom Option component to display challenge details
const CustomOption = (props: any) => (
  <Option {...props}>
    <div className='flex flex-col p-4 gap-4'>
      <div className='flex items-center justify-between'>
        <div className='flex gap-4'>
          <img
            src={props?.data?.image}
            alt='Preview'
            style={{ maxHeight: '70px', minHeight: '70px' }}
          />

          <div className='flex flex-row gap-4'>
            <div>
              <label className='block mb-1 font-bold '>
                Name:
              </label>
              <p>{props?.data?.label}</p>
            </div>

            <div>
              <label className='block mb-1 font-bold '>
                Description:
              </label>
              <p>{props?.data?.description}</p>
            </div>
          </div>
        </div>
      </div>

      <hr className='text-bodydark2' />
    </div>
  </Option>
)

// Custom SingleValue component to display selected challenge
const CustomSingleValue = ({ data }: any) => {
  console.log('data ', data)
  return (
    <div>
      <img
        src={data.image.url}
        alt={data.label}
        style={{ width: 30, height: 30 }}
      />
      <span>{data.label}</span>
    </div>
  )
}

const CustomMultiValueRemove = (
  props: MultiValueRemoveProps<ChallengeOption>
) => {
  if (!props.data.isRemovable) {
    return null // Do not render the remove icon for this option
  }

  return <components.MultiValueRemove {...props} />
}

function getValidationErrors(challenge: Partial<I_AddNewChallenge> | null) {
  const errors = {
    name: '',
    description: '',
    image: '',
    link: '',
    btnLabel: '',
  }

  if (!challenge) {
    // Assume all fields are required if challenge itself is missing
    return {
      name: 'Name is required',
      description: 'Description is required',
      image: 'Image is required',
      link: '',
      btnLabel: '',
    }
  }

  if (!challenge.name) {
    errors.name = 'Name is required'
  }
  if (!challenge.description) {
    errors.description = 'Description is required'
  }
  if (!challenge.image) {
    errors.image = 'Image is required'
  }

  if (!challenge.link) {
    errors.link = ''
  }

  if (!challenge.btnLabel) {
    errors.btnLabel = ''
  }

  return errors
}

interface CreateAppProps {
  isEditing?: boolean
  app?: App
}

const CreateApp = ({ isEditing, app }: CreateAppProps) => {
  const router = useRouter()
  const { partnerId } = useParams()


  const { token } = useSessionStore.getState()

  const [isAddingNewChallenge, setIsAddingNewChallenge] = useState(false)
  const [isAddingCustomChallenge, setIsAddingCustomChallenge] = useState(false)
  const [addingNewChallengeError, setAddingNewChallengeError] = useState({
    name: '',
    description: '',
    image: '',
    link: '',
    btnLabel: '',
  })

  const [newChallenge, setNewChallenge] =
    useState<Partial<I_AddNewChallenge> | null>(null)


  const {
    data: defaultChallenges,
    error: defaultChallengesError,
    loading: defaultChallengesLoading,
  } = useQuery<{
    DefaultChallenges: DefaultChallenges
  }>(GET_DEFAULT_CHALLENGES_QUERY, {
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
    notifyOnNetworkStatusChange: true,
  })

  const {
    data: challengesData,
    loading: queryLoading,
    refetch: refetchChallenges,
  } = useQuery<{
    Challenges: ChallengesData
  }>(GET_CHALLENGES_QUERY, {
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
    notifyOnNetworkStatusChange: true,
  })

  const [selectedChallenges, setSelectedChallenges] = useState<
    ChallengeOption[]
  >([])

  const existingChallenges = app?.quests.map((challenge: any) => ({
    challengeId: challenge?.id,
    name: challenge?.name,
    description: challenge?.description,
    image: getImgUrl(challenge?.image?.url),
    imageId: challenge?.image?.id,
    link: challenge?.link,
    btnLabel: challenge?.label,
  }));

  // Convert challenges data to format expected by react-select
  const challengeOptions =
    defaultChallenges?.DefaultChallenges?.docs?.map((challenge) => ({
      challengeId: challenge?.id,
      value: challenge?.id,
      label: challenge?.name,
      name: challenge?.name,
      description: challenge?.description,
      image: getImgUrl(challenge?.image?.url),
      imageId: challenge?.image?.id,
      isRemovable: false,
      link: '',
      btnLabel: '',
    })) ?? []

  // Include an option to add a new challenge
  challengeOptions.push({
    challengeId: challengeOptions.length + 1,
    value: challengeOptions.length + 1,
    name: '',
    label: 'Create Custom Challenge',
    description: 'You can create new custom challenge',
    image:
      'https://static.vecteezy.com/system/resources/thumbnails/000/363/962/small/1_-_1_-_Plus.jpg',
    imageId: '',
    isRemovable: false,
    link: '',
    btnLabel: '',
  })

  // Handle selection change

  const handleSelectChange = (
    selectedOption: MultiValue<ChallengeOption>,
    actionMeta: ActionMeta<ChallengeOption>
  ) => {
    // Check if the action is 'clear' which indicates all options were cleared
    if (actionMeta.action === 'clear') {
      setSelectedChallenges([])
      return
    }

    const lastElement = selectedOption[selectedOption.length - 1]
    if (lastElement?.label === 'Create Custom Challenge') {
      setIsAddingCustomChallenge(true)
      setNewChallenge({
        name: '',
        description: '',
        image: '',
        imageId: '',
        link: '',
        btnLabel: '',
      })
    } else {
      // setIsAddingCustomChallenge(false);
      // setSelectedChallenges(selectedOption as ChallengeOption[]);
      // append(lastElement);
      setIsAddingCustomChallenge(true)
      setNewChallenge({
        name: selectedOption[0].name,
        description: selectedOption[0].description,
        image: selectedOption[0].image,
        imageId: selectedOption[0].imageId,
        link: selectedOption[0].link,
        btnLabel: selectedOption[0].btnLabel,
      })
    }
  }
  const [createChallengeMutation] = useMutation(
    CREATE_CHALLENGE_MUTATION,
    {
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      refetchQueries: [{ query: GET_CHALLENGES_QUERY }],
    }
  )

  const [updateChallengeMutation] = useMutation(
    UPDATE_CHALLENGE_MUTATION,
    {
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      refetchQueries: [{ query: GET_CHALLENGES_QUERY }],
    }
  )

  const [createAppMutation, { loading, error }] = useMutation(
    CREATE_APP_NEW_MUTATION,
    {
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      refetchQueries: [{ query: GET_APPS_NEW_QUERY }],
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
    tokenGating: Yup.string().required('Token gating option is required'),
    network: Yup.string().required('Network option is required'),
  })

  const defaultValues = {
    name: isEditing ? app?.name : '',
    image: isEditing ? app?.image?.id : '',
    banner: isEditing ? app?.banner?.id : '',
    link: isEditing ? app?.link : '',
    tokenGating: isEditing ? app?.tokenGating : 'NO',
    contractAddress: isEditing ? app?.contractAddress : '',
    tokenGatingAmount: isEditing ? app?.tokenGatingAmount : '',
    network: isEditing ? app?.network : '_137',
    // challenges: [ 
    //   // {
    //   //   id: 1,
    //   //   description: 'test',
    //   //   image:
    //   //     'https://bonuz-admin-wts46rwpca-ey.a.run.app//media/download-21.jpeg',
    //   //   name: 'test',
    //   // },
    // ],
    challenges: isEditing? existingChallenges : [],
  }

  const methods = useForm<CreateAppFormValues>({
    // @ts-ignore
    resolver: yupResolver(createAppSchema),
    // @ts-ignore
    defaultValues,
  })

  const {
    register,
    control,
    reset,
    watch,
    setError,
    clearErrors,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods

  const { fields, append, update, remove } = useFieldArray({
    control,
    name: 'challenges',
  })


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

  const handleDelete = (index: number) => {
    const removingChallenge = fields[index]
    // const newChallengeOptions = challengeOptions.filter(
    //   (challenge) =>
    //     challenge.trackable !== removingChallenge.trackable &&
    //     challenge.trackable !== 0,
    // );
    // setSelectedChallenges(newChallengeOptions);
    remove(index)
  }

  const handleEdit = async (
    index: number,
    updatedChallenge: I_AddNewChallenge
  ) => {
    const response = await updateChallengeMutation({
      variables: {
        id: updatedChallenge.challengeId,
        name: updatedChallenge.name,
        description: updatedChallenge.description,
        image: updatedChallenge.imageId,
        link: updatedChallenge.link,
        label: updatedChallenge.btnLabel,
        trackable: 0,
      },
    })

    update(index, updatedChallenge)
  }

  const handleAddSave = async (data: I_AddNewChallenge) => {
    const response = await createChallengeMutation({
      variables: {
        name: data.name,
        description: data.description,
        image: data.imageId,
        link: data.link,
        label: data.btnLabel,
        trackable: 0,
      },
    })

    append({
      challengeId: response.data.createChallenge.id,
      name: data.name,
      description: data.description,
      image: data.image,
      imageId: data.imageId,
      link: data.link,
      btnLabel: data.btnLabel,
    })
    refetchChallenges()
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
      partner: Number(partnerId),
      name: data.name,
      image: newImageId || data.image,
      banner: newBannerId || data.banner,
      link: data.link,
      tokenGating: data.tokenGating,
      contractAddress: data.contractAddress,
      tokenGatingAmount: Number(data.tokenGatingAmount),
      network: data.network,
      quests: data.challenges.map((challenge) => challenge.challengeId),
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
                    label='Image Banner'
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
                    label='Ad Banner'
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

              <div className='container mx-auto p-4'>
                  <h1 className='text-2xl font-bold mb-4'>Challenges</h1>
                  <AddNewChallengesList
                    challenges={fields}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    handleOnDrop={handleOnDrop}
                  />
                  {isAddingNewChallenge && (
                    <>
                      <Select
                        options={challengeOptions}
                        components={{
                          Option: CustomOption,
                          SingleValue: CustomSingleValue,
                          MultiValueRemove: CustomMultiValueRemove,
                        }}
                        onChange={handleSelectChange}
                        isMulti
                        isLoading={loading}
                        value={selectedChallenges}
                        styles={darkThemeStyles}
                      />
                      <div className='flex items-end justify-end mt-5 gap-2'>
                        <Button
                          onClick={() => {
                            setIsAddingNewChallenge(false)
                            setIsAddingCustomChallenge(false)
                          }}
                          className='min-w-max'
                          >
                          Cancel Challenges
                        </Button>
                        <Button
                          className='min-w-max'
                          onClick={() => {
                            setIsAddingNewChallenge(false)
                            // handleAddSave({
                            //   id: fields.length,
                            //   name: newChallenge?.name ?? '',
                            //   description: newChallenge?.description ?? '',
                            //   image: newChallenge?.image ?? '',
                            //   imageId: newChallenge?.imageId ?? '',
                            // });
                          }}>
                          Save Challenges
                        </Button>
                      </div>
                    </>
                  )}
                  {!isAddingNewChallenge && (
                    <div className='flex items-end justify-end mt-4'>
                      <Button
                        onClick={() => setIsAddingNewChallenge(true)}
                        className='w-50 '>
                        Add New Challenge
                      </Button>
                    </div>
                  )}
                  {isAddingCustomChallenge && (
                    <>
                      <div className='flex flex-col gap-5.5 p-6.5'>
                        <div>
                          <label className='mb-3 block'>
                            Name
                          </label>
                          <input
                            type='text'
                            className='w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            value={newChallenge?.name}
                            onChange={(e) => {
                              setNewChallenge({
                                ...newChallenge,
                                name: e.target.value,
                              })
                            }}
                          />
                          {addingNewChallengeError?.name && (
                            <p className='text-meta-1 text-14 mt-2'>
                              {addingNewChallengeError?.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor={`challenges[${fields.length}].description`}
                            className='mb-3 block'>
                            Description
                          </label>
                          <input
                            type='text'
                            className='w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            value={newChallenge?.description}
                            onChange={(e) => {
                              setNewChallenge({
                                ...newChallenge,
                                description: e.target.value,
                              })
                            }}
                          />
                          {addingNewChallengeError?.description && (
                            <p className='text-meta-1 text-14 mt-2'>
                              {addingNewChallengeError?.description}
                            </p>
                          )}
                        </div>

                        <div>
                          <UploadFile
                            showPreview
                            imagePreview={newChallenge?.image || undefined}
                            label='Image'
                            error={addingNewChallengeError?.image}
                            onDrop={async (files: File[]) => {
                              const image = await handleOnDrop(files)

                              setNewChallenge({
                                ...newChallenge,
                                image: getImgUrl(image.doc.url),
                                imageId: image.doc.id.toString(),
                              })
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
                          <label
                            htmlFor={`challenges[${fields.length}].link`}
                            className='mb-3 block'>
                            Link
                          </label>
                          <input
                            type='text'
                            className='w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            value={newChallenge?.link}
                            onChange={(e) => {
                              setNewChallenge({
                                ...newChallenge,
                                link: e.target.value,
                              })
                            }}
                          />
                          {addingNewChallengeError?.link && (
                            <p className='text-meta-1 text-14 mt-2'>
                              {addingNewChallengeError?.link}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor={`challenges[${fields.length}].btnLabel`}
                            className='mb-3 block'>
                            Button Label
                          </label>
                          <input
                            type='text'
                            className='w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            value={newChallenge?.btnLabel}
                            onChange={(e) => {
                              setNewChallenge({
                                ...newChallenge,
                                btnLabel: e.target.value,
                              })
                            }}
                          />
                          {addingNewChallengeError?.btnLabel && (
                            <p className='text-meta-1 text-14 mt-2'>
                              {addingNewChallengeError?.btnLabel}
                            </p>
                          )}
                        </div>

                        <div className='flex items-end justify-end gap-2'>
                          <Button
                            variant='outlined'
                            onClick={() => {
                              setAddingNewChallengeError({
                                name: '',
                                description: '',
                                image: '',
                                link: '',
                                btnLabel: '',
                              })
                              setIsAddingCustomChallenge(false)
                            }}
                            >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              const errors = getValidationErrors(newChallenge)
                              if (
                                Object.values(errors).some(
                                  (value) => value !== ''
                                )
                              ) {
                                setAddingNewChallengeError(errors)
                                return
                              }

                              setIsAddingCustomChallenge(false)
                              handleAddSave({
                                challengeId: fields.length,
                                name: newChallenge?.name ?? '',
                                description: newChallenge?.description ?? '',
                                image: newChallenge?.image ?? '',
                                imageId: newChallenge?.imageId ?? '',
                                link: newChallenge?.link ?? '',
                                btnLabel: newChallenge?.btnLabel ?? '',
                              })
                            }}>
                            Save
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

              <div className='flex justify-end gap-4.5 p-6.5'>
                <Button
                  variant='outlined'
                  onClick={() => {
                    reset()
                    router.push( `/partners/${partnerId}/apps-games/${app?.id}`)
                    // setIsEditing(false)
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
