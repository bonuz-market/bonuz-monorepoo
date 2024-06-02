// Polyfill TextEncode / TextDecode
import 'fast-text-encoding';
// Polyfill crypto.getRandomvalues
import 'react-native-get-random-values';
// Polyfill URL()
import 'react-native-url-polyfill/auto';

// Polyfill Buffer
if (typeof Buffer === 'undefined') {
  // eslint-disable-next-line unicorn/prefer-node-protocol
  global.Buffer = require('buffer').Buffer;
}

// @ts-ignore
global.location = {
  protocol: 'file:',
};

// @ts-ignore
global.process.version = 'v16.0.0';
if (!global.process.version) {
  // eslint-disable-next-line unicorn/prefer-node-protocol
  global.process = require('process');
  console.log({ process: global.process });
}

// @ts-ignore
process.browser = true;
