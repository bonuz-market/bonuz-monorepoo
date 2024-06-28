import '@walletconnect/react-native-compat';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

// @ts-ignore
process.browser = true;
