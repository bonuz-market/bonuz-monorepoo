import React from 'react';

import clsxm from '../lib/frontend/clsxm';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  iconClassName?: string;
  showText?: boolean;
  text?: string;
  textClassName?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  iconClassName,
  showText = false,
  text = 'Loading...',
  textClassName,
  ...other
}) => (
  <div
    className={clsxm(
      'flex h-full w-full items-center justify-center',
      className,
    )}
    {...other}
  >
    <div className="mr-3 animate-spin">
      <svg
        className={clsxm('h-8 w-8 text-white', iconClassName)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="blue"
          strokeWidth="4"
        />

        <path
          className="opacity-75"
          fill="blue"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>

    {showText && (
      <div className={clsxm('text-xl font-medium text-white', textClassName)}>
        {text}
      </div>
    )}
  </div>
);

export default LoadingSpinner;
