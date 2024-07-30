import React from 'react';

import { Icon, IconProps } from '@iconify/react';

import clsxm from '../lib/frontend/clsxm';

interface StyledIconProps extends IconProps {
  pointer?: boolean;
  // className?: string;
}

const StyledIcon: React.FC<StyledIconProps> = ({
  pointer = true,
  icon,
  className,
  ...other
}) => (
  <Icon
    icon={icon}
    className={clsxm('h-6 w-6', pointer && 'cursor-pointer', className)}
    {...other}
  />
);

export default StyledIcon;
