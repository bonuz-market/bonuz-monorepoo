import { useEffect, useState } from 'react';

import { Icon } from '@iconify/react/dist/iconify.js';

import { getImgUrl } from '@/utils/getImgUrl';
import UploadFile from '../UploadFile';
import Button from '../Button';

export interface I_AddNewChallenge {
  challengeId: number;
  name: string;
  description: string;
  image: string;
  imageId: string;
  link: string;
  btnLabel: string;
}

interface ChallengeProps {
  index: number;
  challenge: I_AddNewChallenge;
  onDelete: (id: number) => void;
  onEdit: (id: number, updatedChallenge: I_AddNewChallenge) => void;
  handleOnDrop: (files: File[]) => void;
}

export const AddNewChallenge: React.FC<ChallengeProps> = ({
  index,
  challenge,
  onDelete,
  onEdit,
  handleOnDrop,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedChallenge, setEditedChallenge] = useState(challenge);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(index, editedChallenge);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedChallenge(challenge);
    setIsEditing(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditedChallenge({ ...editedChallenge, [name]: value });
  };

  if (isEditing)
    return (
      <div className="flex flex-col gap-5.5 p-6.5">
        <div>
          <label className="mb-3 block">Name</label>
          <input
            type="text"
            name="name"
            className="w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={editedChallenge.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            // htmlFor={`challenges[${fields.length}].description`}
            className="mb-3 block"
          >
            Description
          </label>
          <input
            type="text"
            name="description"
            className="w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={editedChallenge.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <UploadFile
            showPreview
            label="Image"
            imagePreview={editedChallenge.image}
            error={undefined}
            onDrop={async (files: File[]) => {
              const image: any = await handleOnDrop(files);

              setEditedChallenge({
                ...editedChallenge,
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
            // htmlFor={`challenges[${fields.length}].link`}
            className="mb-3 block"
          >
            Link
          </label>
          <input
            type="text"
            name="link"
            className="w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={editedChallenge.link}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            // htmlFor={`challenges[${fields.length}].link`}
            className="mb-3 block"
          >
            Button Label
          </label>
          <input
            type="text"
            name="btnLabel"
            className="w-full rounded-lg border-[1.5008px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={editedChallenge.btnLabel}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-end justify-end gap-2">
          <Button
            variant="outlined"
            onClick={() => handleCancel()}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSave();
              // setIsAddingNewChallenge(false);
              // handleAddSave({
              //   id: fields.length,
              //   name: newChallenge?.name ?? '',
              //   description: newChallenge?.description ?? '',
              //   image: newChallenge?.image ?? '',
              //   imageId: newChallenge?.imageId ?? '',
              // });
            }}
          >
            Save
          </Button>
        </div>

        <hr className="text-bodydark2" />
      </div>
    );

  return (
    <div className="flex flex-col p-4 gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <img
            src={challenge.image}
            alt="Preview"
            style={{ maxHeight: '200px', minHeight: '200px' }}
          />

          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-1 font-bold ">
                Name:
              </label>
              <p>{challenge.name}</p>
            </div>

            <div>
              <label className="block mb-1 font-bold ">
                Description:
              </label>
              <p>{challenge.description}</p>
            </div>

            <div>
              <label className="block mb-1 font-bold ">Link:</label>
              <p>{challenge.link}</p>
            </div>

            <div>
              <label className="block mb-1 font-bold ">
                Button Label:
              </label>
              <p>{challenge.btnLabel}</p>

          </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Icon
            icon="uil:trash"
            onClick={() => onDelete(index)}
            className="h-6 w-6 cursor-pointer"
          />
            <Icon
              icon="material-symbols:edit"
              onClick={handleEdit}
              className="h-6 w-6 cursor-pointer"
            />
        </div>
      </div>

      <hr className="text-bodydark2" />
    </div>
  );
};
