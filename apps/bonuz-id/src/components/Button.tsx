import React from 'react';

import { Oval } from 'react-loader-spinner';

import clsxm from '../lib/frontend/clsxm';

export interface ButtonProps extends React.ComponentPropsWithRef<'button'> {
  isLoading?: boolean;
  transition?: boolean;
  iconClassName?: string;
  variant?: 'contained' | 'outlined';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      iconClassName,
      disabled: buttonDisabled,
      transition,
      isLoading,
      variant = 'contained',
      ...other
    },
    ref,
  ) => (
    <button
      ref={ref}
      type="button"
      className={clsxm(
        'btn flex flex-row items-center justify-center',
        // variant === 'outlined'
        //   ? 'rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white'
        //   : 'rounded bg-black-2 font-medium text-gray hover:bg-opacity-70 py-2 px-6',
        'text-base font-semibold tracking-tight leading-6 text-white backdrop-blur-[20px] bg-[linear-gradient(123deg,#E79413_-19.89%,#EA3E5B_48.73%,#FA0AF0_119.63%)] rounded-[30px] cursor-pointer w-[135px] h-[40px] flex  flex-col items-center justify-center',
        'border-0 outline-none',
        // transition && 'transition duration-700 ease-in-out hover:scale-105',
        transition && 'transition-all duration-1000 ease-in-out',
        className,
      )}
      disabled={isLoading ?? buttonDisabled}
      {...other}
    >
      {isLoading ? (
        <Oval
          height={20}
          width={20}
          color="#fff"
          wrapperStyle={{}}
          wrapperClass=""
          visible
          ariaLabel="oval-loading"
          secondaryColor="#fff"
          strokeWidth={4}
          strokeWidthSecondary={4}
        />
      ) : (
        children
      )}
    </button>
  ),
);
export default Button;
