import { useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';
import Select, { ActionMeta, components, MultiValue, MultiValueRemoveProps, StylesConfig } from 'react-select';
import * as Yup from 'yup';

import UploadFile from '../../components/UploadFile';
import {
  UPDATE_EVENT_MUTATION,
  GET_NEW_PARTNERS_QUERY,
  GET_PARTNERS_EVENTS_QUERY,
  GET_PARTNERS_EVENTS_CHALLENGES_QUERY,
  CREATE_PARTNERS_EVENTS_CHALLENGES_MUTATION,
  UPDATE_EVENT_WITH_NEW_CHALLENGES_MUTATION,
  UPDATE_PARTNERS_EVENTS_CHALLENGES_MUTATION,
  GET_DEFAULT_CHALLENGES_QUERY,
} from '@/lib/graphql-queries'
import { uploadFile } from '../../lib/services';
import { useSessionStore } from '../../store/sessionStore';
import { getImgUrl } from '../../utils/getImgUrl';
import MarkdownInput from '../MarkdownInput';
import { AddNewChallengesList } from './AddNewChallengesList';
import Button from '../Button';


interface I_AddNewChallenge {
  challengeId: number;
  name: string;
  description: string;
  image: string;
  imageId: string;
  link: string;
  btnLabel: string
}

interface UpdatePartnerEventFormValues {
  title: string;
  shortDescription: string;
  agenda: string;
  description: string;
  image: {
    doc: {
      id: string;
    };
  };
  banner:{
    doc: {
      id: string 
    }
  }
  link: string;
  sourceEventLink: string;
  startDate: string;
  endDate: string;
  challenges: I_AddNewChallenge[];
}
interface Challenge {
  id: number;
  name: string;
  description: string;
  image: {
    id: string;
    url: string;
  };

  link: string;
  btnLabel: string
}

interface ChallengesData {
  docs: Challenge[];
}

interface UpdatePartnerEventProps {
  setIsEditing: (isEditing: boolean) => void;
  partner: any;
  event: any;
  handleRefresh: () => void;
}

interface DefaultChallenge {
  id: number;
  name: string;
  description: string;
  image: {
    id: string;
    url: string;
  };
}

interface DefaultChallenges {
  docs: DefaultChallenge[];
}


// Assuming Challenge type is defined as before
interface ChallengeOption {
  challengeId: number;
  value: number | string;
  label: string;
  name: string;
  description: string;
  image: string;
  imageId: string;
  isRemovable: boolean;
  link: string;
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
};
// Custom components for react-select
const { Option, SingleValue } = components;
// Custom Option component to display challenge details
const CustomOption = (props: any) => (
  <Option {...props}>
    <div className="flex flex-col p-4 gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <img
            src={props?.data?.image}
            alt="Preview"
            style={{ maxHeight: '70px', minHeight: '70px' }}
          />

          <div className="flex flex-row gap-4">
            <div>
              <label className="block mb-1 font-bold text-gray-700">
                Name:
              </label>
              <p>{props?.data?.label}</p>
            </div>

            <div>
              <label className="block mb-1 font-bold text-gray-700">
                Description:
              </label>
              <p>{props?.data?.description}</p>
            </div>
          </div>
        </div>
      </div>

      <hr className="text-bodydark2" />
    </div>
  </Option>
);

// Custom SingleValue component to display selected challenge
const CustomSingleValue = ({ data }: any) => {
  console.log('data ', data);
  return (
    <div>
      <img
        src={data.image.url}
        alt={data.label}
        style={{ width: 30, height: 30 }}
      />
      <span>{data.label}</span>
    </div>
  );
};

const CustomMultiValueRemove = (props: MultiValueRemoveProps<ChallengeOption>) => {
  if (!props.data.isRemovable) {
    return null; // Do not render the remove icon for this option
  }

  return <components.MultiValueRemove {...props} />;
};

function getValidationErrors(challenge: Partial<I_AddNewChallenge> | null) {
  const errors = {
    name: '',
    description: '',
    image: '',
    link: '',
    btnLabel:'',
  };

  if (!challenge) {
    // Assume all fields are required if challenge itself is missing
    return {
      name: 'Name is required',
      description: 'Description is required',
      image: 'Image is required',
      link:'',
    btnLabel:'',
  };
  }

  if (!challenge.name) {
    errors.name = 'Name is required';
  }
  if (!challenge.description) {
    errors.description = 'Description is required';
  }
  if (!challenge.image) {
    errors.image = 'Image is required';
  }
  if (!challenge.link) {
    errors.link = '';
  }
  if (!challenge.btnLabel) {
    errors.btnLabel = '';
  }

  return errors;
}


const EditPartnerEvent = ({
  setIsEditing,
  partner,
  event,
  handleRefresh,
}: UpdatePartnerEventProps) => {
  const { token } = useSessionStore.getState();
  const [isAddingNewChallenge, setIsAddingNewChallenge] = useState(false);
  const [isAddingCustomChallenge, setIsAddingCustomChallenge] = useState(false);
  const [addingNewChallengeError, setAddingNewChallengeError] = useState({
    name: '',
    description: '',
    image: '',
    link: '',
    btnLabel:'',
  });

  const [newChallenge, setNewChallenge] =
    useState<Partial<I_AddNewChallenge> | null>(null);

    const {
      data: defaultChallenges,
      error: defaultChallengesError, 
      loading: defaultChallengesLoading
    } = useQuery<{
      DefaultChallenges: DefaultChallenges;
    }>(GET_DEFAULT_CHALLENGES_QUERY, {
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      notifyOnNetworkStatusChange: true,
    });


  const {
    data: challengesData,
    loading: queryLoading,
    refetch: refetchChallenges,
  } = useQuery<{
    Challenges: ChallengesData;
  }>(GET_PARTNERS_EVENTS_CHALLENGES_QUERY, {
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const [selectedChallenges, setSelectedChallenges] = useState<
    ChallengeOption[]
  >([]);

  const existingChallenges = event?.challenges_new.map((challenge: any) => ({
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
      btnLabel:'',
    })) ?? [];

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
    btnLabel:'',
  });

  // Handle selection change

  const handleSelectChange = (selectedOption: MultiValue<ChallengeOption>,
    actionMeta: ActionMeta<ChallengeOption>) => {
    // Check if the action is 'clear' which indicates all options were cleared
    if (actionMeta.action === 'clear') {
      setSelectedChallenges([]);
      return
    }

    const lastElement = selectedOption[selectedOption.length - 1];
    if (lastElement?.label === 'Create Custom Challenge') {
      setIsAddingCustomChallenge(true);
      setNewChallenge({
        name: '',
        description: '',
        image: '',
        imageId: '',
        link: '',
        btnLabel:'',
      });
    } else {
      // setIsAddingCustomChallenge(false);
      // setSelectedChallenges(selectedOption as ChallengeOption[]);
      // append(lastElement);
      setIsAddingCustomChallenge(true);
      setNewChallenge({
        name: selectedOption[0].name,
        description: selectedOption[0].description,
        image: selectedOption[0].image,
        imageId: selectedOption[0].imageId,
        link: selectedOption[0].link,
        btnLabel: selectedOption[0].btnLabel,
      });
    }
  };

  const [createChallengeMutation] = useMutation(
    CREATE_PARTNERS_EVENTS_CHALLENGES_MUTATION,
    {
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      refetchQueries: [{ query: GET_PARTNERS_EVENTS_CHALLENGES_QUERY }],
    },
  );

  const [updateChallengeMutation] = useMutation(
    UPDATE_PARTNERS_EVENTS_CHALLENGES_MUTATION,
    {
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      refetchQueries: [{ query: GET_PARTNERS_EVENTS_CHALLENGES_QUERY }],
    },
  );


  const [updateEventMutation, { data: eventData, loading, error }] =
    useMutation(UPDATE_EVENT_WITH_NEW_CHALLENGES_MUTATION, {
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      refetchQueries: [{ query: GET_PARTNERS_EVENTS_QUERY }],
    });

  const schema = Yup.object().shape({
    title: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    agenda: Yup.string().required('Agenda is required'),
    image: Yup.mixed().required('Image is required'),
    banner: Yup.mixed().required('Banner is required'),
    link: Yup.string()
      .required('Link is required')
      .url('Link must be a valid URL'),
    sourceEventLink: Yup.string(),
    // .required('Source Event Link is required')
    // .url('Source Event Link must be a valid URL'),
    startDate: Yup.date().required('Start Date is required'),
    endDate: Yup.date().required('End Date is required'),
  });

  const startDate = new Date(event?.start_date);
  const formattedStartDate = startDate.toISOString().split('T')[0];

  const endDate = new Date(event?.end_date);
  const formattedEndDate = endDate.toISOString().split('T')[0];


  const defaultValues = {
    title: event?.title,
    shortDescription: event?.shortDescription,
    description: event?.description,
    agenda: event?.agenda,
    link: event?.link,
    sourceEventLink: event?.sourceEventLink || '',
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    image: event?.image.id,
    challenges: [
      ...existingChallenges,
      // {
      //   id: 1,
      //   description: 'test',
      //   image:
      //     'https://bonuz-admin-wts46rwpca-ey.a.run.app//media/download-21.jpeg',
      //   name: 'test',
      // },
    ],
  };

  const methods = useForm<UpdatePartnerEventFormValues>({
    // @ts-ignore
    resolver: yupResolver(schema),
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

  const { fields, append, update, remove } = useFieldArray({
    control,
    name: 'challenges',
  });


  const handleOnDrop = async (
    files: File[],
    key?: keyof UpdatePartnerEventFormValues,
  ) => {
    const formData = new FormData();
    formData.append('file', files[0]);

    const uploadImage = await uploadFile(formData);
    if (key) setValue(key, uploadImage);

    return uploadImage;
  };

  const handleDelete = (index: number) => {
    const removingChallenge = fields[index]
    // const newChallengeOptions = challengeOptions.filter((challenge) => challenge.trackable !== removingChallenge.trackable && challenge.trackable !== 0);
    // setSelectedChallenges(newChallengeOptions);
    remove(index);
  };

  const handleEdit = async (index: number, updatedChallenge: I_AddNewChallenge) => {

    const response = await updateChallengeMutation({
      variables: {
        id: updatedChallenge.challengeId,
        name: updatedChallenge.name,
        description: updatedChallenge.description,
        image: updatedChallenge.imageId,
        trackable: 0,
        link: updatedChallenge.link ?? '',
        label: updatedChallenge.btnLabel ?? '',
      },
    });

    update(index, updatedChallenge);

  };

  const handleAddSave = async (data: I_AddNewChallenge) => {

    const response = await createChallengeMutation({
      variables: {
        name: data.name,
        description: data.description,
        image: data.imageId,
        trackable: 0,
        link: data.link,
        label: data.btnLabel,
      },
    });

    append({
      challengeId: response.data.createChallenge.id,
      name: data.name,
      description: data.description,
      image: data.image,
      imageId: data.imageId,
      link: data.link,
      btnLabel: data.btnLabel,
    });
    refetchChallenges();
  };

  // const watchCategory = watch('category', '');
  // console.log('watchCategory ', watchCategory);

  const onSubmit = async (data: UpdatePartnerEventFormValues) => {
    const newImageId = data?.image?.doc?.id?.toString();
    const newBannerId = data?.banner?.doc?.id?.toString();

    if (!partner?.id) {
      console.log('partner id not found');

      return;
    }

    const variables = {
      id: event.id,
      title: data.title,
      partner: Number(partner?.id),
      // partner: 5,
      shortDescription: data.shortDescription,
      description: data.description,
      agenda: data.agenda,
      image: newImageId || data.image,
      banner: newBannerId || data.banner,
      link: data.link,
      sourceEventLink: data.sourceEventLink,
      start_date: data.startDate,
      end_date: data.endDate,
      location: 'Dubai',
      // challenges: data.challenges.map((challenge) => ({
      //   title: challenge.name,
      //   description: challenge.description,
      //   image: challenge.imageId,
      // })),
      // challenges_new: data.challenges.map((challenge) => ({
      //   id: challenge.id,
      // })),
      challenges_new: data.challenges.map((challenge) => (challenge.challengeId)),
    };

    await updateEventMutation({
      variables,
    });

    handleRefresh();
    setIsEditing(false);
  };



  // const [challenges, setChallenges] = useState([
  //   {
  //     id: 1,
  //     name: 'Challenge 1',
  //     description: 'Description 1',
  //     image: 'Image 1',
  //   },
  //   {
  //     id: 2,
  //     name: 'Challenge 2',
  //     description: 'Description 2',
  //     image: 'Image 2',
  //   },
  //   // Add more challenges as needed
  // ]);

  // const handleDelete = (id: number) => {
  //   setChallenges((prevChallenges) =>
  //     prevChallenges.filter((challenge) => challenge.id !== id),
  //   );
  // };

  // const handleEdit = (id: number, updatedChallenge: Challenge) => {
  //   setChallenges((prevChallenges) =>
  //     prevChallenges.map((challenge) =>
  //       challenge.id === id ? { ...challenge, ...updatedChallenge } : challenge,
  //     ),
  //   );
  // };

  // const handleAddSave = () => { };

  return (
    <>

      <div className="mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="rounded-sm glass p-4">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                {/* <h3 className="font-medium text-black dark:text-white">
                  Please fill the form to create a event
                </h3> */}
              </div>
              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Title
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    className="w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  {errors?.title?.message && (
                    <p className="text-meta-1 text-14 mt-2">
                      {errors?.title?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Short Description
                  </label>
                  <input
                    {...register('shortDescription')}
                    type="text"
                    className="w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  {errors?.shortDescription?.message && (
                    <p className="text-meta-1 text-14 mt-2">
                      {errors?.shortDescription?.message}
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
                    value={event?.description}
                  />
                </div>

                <div>
                  <MarkdownInput
                    label="Agenda"
                    error={errors?.agenda?.message}
                    onChange={(value: string | undefined) => {
                      if (value) setValue('agenda', value);
                    }}
                    value={event?.agenda}
                  />
                </div>

                <div>
                  <UploadFile
                    showPreview
                    imagePreview={
                      event?.image?.url
                        ? getImgUrl(event?.image?.url)
                        : undefined
                    }
                    label="Image"
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
                    imagePreview={
                      event?.banner?.url
                        ? getImgUrl(event?.banner?.url)
                        : undefined
                    }
                    label="Banner"
                    error={errors?.banner?.message}
                    onDrop={(files: File[]) => {
                      handleOnDrop(files, 'banner');
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
                    Link
                  </label>
                  <input
                    {...register('link')}
                    type="text"
                    className="w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  {errors?.link?.message && (
                    <p className="text-meta-1 text-14 mt-2">
                      {errors?.link?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Source Event Link
                  </label>
                  <input
                    {...register('sourceEventLink')}
                    type="text"
                    className="w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  {errors?.sourceEventLink?.message && (
                    <p className="text-meta-1 text-14 mt-2">
                      {errors?.sourceEventLink?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      {...register('startDate')}
                      type="date"
                      className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      {...register('endDate')}
                      type="date"
                      className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="container mx-auto p-4">
                  <h1 className="text-2xl font-bold mb-4">Challenges</h1>
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
                      <div className="flex items-end justify-end mt-5">
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setIsAddingNewChallenge(false)
                            setIsAddingCustomChallenge(false)
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                          Cancel Challenges
                        </Button>
                        <Button
                          onClick={() => {
                            setIsAddingNewChallenge(false);
                            // handleAddSave({
                            //   id: fields.length,
                            //   name: newChallenge?.name ?? '',
                            //   description: newChallenge?.description ?? '',
                            //   image: newChallenge?.image ?? '',
                            //   imageId: newChallenge?.imageId ?? '',
                            // });
                          }}
                        >
                          Save Challenges
                        </Button>
                      </div>
                    </>

                  )}
                  {!isAddingNewChallenge && (
                    <div className="flex items-end justify-end mt-4">
                      <Button
                        onClick={() => setIsAddingNewChallenge(true)}
                        className="w-50 "
                      >
                        Add New Challenge
                      </Button>
                    </div>
                  )}
                  {isAddingCustomChallenge && (
                    <>
                      <div className="flex flex-col gap-5.5 p-6.5">
                        <div>
                          <label className="mb-3 block text-black dark:text-white">
                            Name
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            value={newChallenge?.name}
                            onChange={(e) => {
                              setNewChallenge({
                                ...newChallenge,
                                name: e.target.value,
                              });
                            }}
                          />
                          {addingNewChallengeError?.name && (
                            <p className="text-meta-1 text-14 mt-2">
                              {addingNewChallengeError?.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor={`challenges[${fields.length}].description`}
                            className="mb-3 block text-black dark:text-white"
                          >
                            Description
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            value={newChallenge?.description}
                            onChange={(e) => {
                              setNewChallenge({
                                ...newChallenge,
                                description: e.target.value,
                              });
                            }}
                          />
                          {addingNewChallengeError?.description && (
                            <p className="text-meta-1 text-14 mt-2">
                              {addingNewChallengeError?.description}
                            </p>
                          )}
                        </div>

                        <div>
                          <UploadFile
                            showPreview
                            imagePreview={newChallenge?.image || undefined}
                            label="Image"
                            error={addingNewChallengeError?.image}
                            onDrop={async (files: File[]) => {
                              const image = await handleOnDrop(files);

                              setNewChallenge({
                                ...newChallenge,
                                image: getImgUrl(image.doc.url),
                                imageId: image.doc.id.toString(),
                              });
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
                            className="mb-3 block text-black dark:text-white"
                          >
                            Link
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            value={newChallenge?.link}
                            onChange={(e) => {
                              setNewChallenge({
                                ...newChallenge,
                                link: e.target.value,
                              });
                            }}
                          />
                          {addingNewChallengeError?.link && (
                            <p className="text-meta-1 text-14 mt-2">
                              {addingNewChallengeError?.link}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor={`challenges[${fields.length}].btnLabel`}
                            className="mb-3 block text-black dark:text-white"
                          >
                            Button Label
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            value={newChallenge?.btnLabel}
                            onChange={(e) => {
                              setNewChallenge({
                                ...newChallenge,
                                btnLabel: e.target.value,
                              });
                            }}
                          />
                          {addingNewChallengeError?.btnLabel && (
                            <p className="text-meta-1 text-14 mt-2">
                              {addingNewChallengeError?.btnLabel}
                            </p>
                          )}
                        </div>

                        <div className="flex items-end justify-end">
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setAddingNewChallengeError({
                                name: '',
                                description: '',
                                image: '',
                                link: '',
                                btnLabel:'',
                              })
                              setIsAddingCustomChallenge(false)
                            }
                            }
                            className="px-4 py-2 bg-red-500 text-white rounded"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              const errors = getValidationErrors(newChallenge);

                              if (Object.values(errors).some(value => value !== '')) {
                                setAddingNewChallengeError(errors);
                                return;
                              }



                              setIsAddingCustomChallenge(false);
                              handleAddSave({
                                challengeId: fields.length,
                                name: newChallenge?.name ?? '',
                                description: newChallenge?.description ?? '',
                                image: newChallenge?.image ?? '',
                                imageId: newChallenge?.imageId ?? '',
                                link: newChallenge?.link ?? '',
                                btnLabel: newChallenge?.btnLabel ?? '',
                              });
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4.5 p-6.5">
            <Button
              variant="outlined"
              onClick={() => {
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>

            <Button isLoading={loading} type="submit">
              Save
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditPartnerEvent;
