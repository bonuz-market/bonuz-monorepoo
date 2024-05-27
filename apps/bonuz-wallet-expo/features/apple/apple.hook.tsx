import Web3Auth, { LOGIN_PROVIDER, OPENLOGIN_NETWORK } from '@web3auth/react-native-sdk';
import Constants, { AppOwnership } from 'expo-constants';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';

import { authenticate, getUserInfo, getVerificationMessage } from '@/services/backend';
import { useUserStore } from '@/store';
import { setSmartAccountSdk } from '@/store/smartAccounts';
import { fromPrivateKeyToWallet } from '@/utils/wallet';

const resolvedRedirectUrl =
  Constants.appOwnership === AppOwnership.Expo
    ? Linking.createURL('web3auth', {})
    : Linking.createURL('web3auth', { scheme: 'bonuzapp' });

const web3authConfigVars = Constants.expoConfig?.extra?.web3auth;
const { clientId } = web3authConfigVars;

const web3auth = new Web3Auth(WebBrowser, SecureStore, {
  clientId,
  network: OPENLOGIN_NETWORK.SAPPHIRE_MAINNET,
  redirectUrl: resolvedRedirectUrl,
});

const getWalletAddress = (privateKey: string) => fromPrivateKeyToWallet(privateKey).address;

export const useAppleLogin = () => {
  const { setUser, setAuth, setWallet } = useUserStore((store) => ({
    setUser: store.setUser,
    setAuth: store.setAuth,
    setWallet: store.setWallet,
  }));
  const login = async () => {
    await web3auth.init();
    await web3auth.login({
      redirectUrl: resolvedRedirectUrl,
      mfaLevel: 'none',
      loginProvider: LOGIN_PROVIDER.APPLE,
    });
    const walletAddress = getWalletAddress(web3auth.privKey);

    const { message: messageToSign } = await getVerificationMessage(walletAddress);

    const sdk = await setSmartAccountSdk(web3auth.privKey, { withCache: false });

    const signature = await sdk.getSigner().signMessage(messageToSign);
    const smartAccountAddress = await sdk.getAccountAddress();

    try {
      const accessToken = await authenticate({
        walletAddress,
        smartAccountAddress,
        signature,
      });

      setWallet({
        address: smartAccountAddress,
        privateKey: web3auth.privKey,
        eoaAddress: walletAddress,
      });

      setAuth({ accessToken });
      try {
        const userInfo = await getUserInfo(accessToken);

        setUser({
          id: userInfo.id,
          handle: userInfo.handle,
          createdAt: userInfo.createdAt,
          walletAddress,
          smartAccountAddress,
          email: web3auth.userInfo()?.email,
          // loginType: LOGIN_TYPES.APPLE,
          // isOnboarding: false,
          // isGuest: false,
        });
      } catch (error) {
        console.log(error);
        setUser({
          // isOnboarding: true,
          name: web3auth.userInfo()?.name,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { login };
};
