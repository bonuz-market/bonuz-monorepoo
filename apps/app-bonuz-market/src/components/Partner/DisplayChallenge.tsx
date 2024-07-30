import React from 'react';

interface Props {
  imgSrc: string;
  name: string;
  description: string;
}

const DisplayChallenge = ({ imgSrc, name, description }: Props) => (
  <div className="flex flex-col py-4 gap-4">
    <div className="flex items-center justify-between">
      <div className="flex gap-4">
        <img
          src={imgSrc}
          alt="Preview"
          style={{ maxHeight: '200px', minHeight: '200px' }}
        />

        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-bold text-gray-700">Name:</label>
            <p>{name}</p>
          </div>

          <div>
            <label className="block mb-1 font-bold text-gray-700">
              Description:
            </label>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>

    <hr className="text-bodydark2" />
  </div>
);

export default DisplayChallenge;
