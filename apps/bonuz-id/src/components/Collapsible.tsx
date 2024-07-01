import { useState } from 'react';

interface CollapsibleProps {
  open?: boolean;
  title: string;
  subTitle: React.ReactNode;
  icon: string;
  children: React.ReactNode;
}

const Collapsible = ({ open=false,title, subTitle, icon, children }: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(open);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className='collapse collapse-arrow glass'>
        <input
          type='radio'
          checked={isOpen}
          className='collapse-open cursor-pointer w-full'
          onClick={toggleCollapse}
        />

        <div className='collapse-title text-xl font-medium'>
          <div className='flex flex-1 gap-4 max-md:flex-wrap'>
            <img src={icon} alt='icon' />
            <div className='flex flex-1 gap-1 sm:pr-20 my-auto tracking-tight text-white max-md:flex-wrap'>
              <div className='text-base leading-6 capitalize'>{title}</div>
              <div className='flex justify-center items-center px-1 w-6 h-6 text-sm leading-4 text-center whitespace-nowrap  rounded-[50px]'>
                {subTitle}
              </div>
            </div>
          </div>
        </div>
        <div className='collapse-content'>{children}</div>
      </div>
    </div>
  );
};
export default Collapsible;
