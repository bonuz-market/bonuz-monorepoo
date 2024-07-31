import React, { useState } from 'react';

import clsxm from '../lib/frontend/clsxm';
import { useCopyToClipboard } from '../lib/frontend/usehooks';

interface CopyToClipboardComponentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon: string;
  text: string;
  copyText: string;
}

const CopyToClipboard: React.FC<CopyToClipboardComponentProps> = ({
  icon,
  text,
  copyText,
  className,
}) => {
  const [value, copy] = useCopyToClipboard();
  const [copyButtonText, setCopyButtonText] = useState('Copy');

  const handleClick = () => {
    copy(copyText);
    setCopyButtonText('Copied!');

    setTimeout(() => {
      setCopyButtonText('Copy');
    }, 2000);
  };

  return (
    <div
      className={clsxm(
        'flex w-full items-center justify-between rounded-md bg-primary-main px-3 py-1.5',
        className,
      )}
    >
      <div>
        <img src={icon} width={16} height={16} alt="icon" />
      </div>

      <p className="text-sm ml-2">{text}</p>

      <button
        type="button"
        className="w-[80px] rounded-md border border-none px-2 py-1 text-[#5C6294] outline-none focus:ring-0"
        onClick={handleClick}
      >
        {copyButtonText}
      </button>
    </div>
  );
};

export default CopyToClipboard;
