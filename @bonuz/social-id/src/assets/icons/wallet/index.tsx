import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function WalletIcon(props) {
  return (
    <Svg viewBox="0 0 14 13" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path d="M14 10v1.25c0 .69-.561 1.25-1.25 1.25H2c-1.103 0-2-.897-2-2V2C0 .897.897 0 2 0h9.25a.75.75 0 110 1.5H2a.5.5 0 000 1h10.75c.689 0 1.25.56 1.25 1.25V5h-2.5A2.503 2.503 0 009 7.5c0 1.379 1.121 2.5 2.5 2.5H14z" />
    </Svg>
  );
}

export default WalletIcon;
