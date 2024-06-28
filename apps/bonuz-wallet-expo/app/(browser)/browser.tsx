import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { formatJsonRpcResult } from '@walletconnect/jsonrpc-utils';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { WebView, WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import tw from 'twrnc';
import { fromHex, isHex, toHex } from 'viem';
import { arbitrum, arbitrumNova, base, bsc, coreDao, mainnet, polygon } from 'viem/chains';

import { NETWORKS } from '@/constants/networks';
import { Wallet } from '@/entities';
import { SendTransactionModalDynamic, SignModalDynamic } from '@/features/wallet/components';
import { getSignParamsMessage } from '@/features/wallet/utils/HelperUtils';
import { useUserStore } from '@/store';
import { useBrowserStore } from '@/store/browser';
import { smartAccountSdkByChainId } from '@/store/smartAccounts';

const URL_REGEX = new RegExp(
  [
    String.raw`(http(s)?):\/\/`,
    String.raw`(www\.)?`,
    String.raw`[a-zA-Z0-9@:%._\+~#=]{2,256}`,
    String.raw`\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)`,
  ].join(''),
);

const WalletInAppBrowser = () => {
  const { url } = useLocalSearchParams();
  const webViewRef = useRef<WebView | null>(null);
  const [urlInput, setUrlInput] = useState<string | undefined>(url as string);
  const [browserState, setBrowserState] = useState<WebViewNavigation>();
  const [injectedJavaScript, setInjectedJavaScript] = useState<string>();

  const [modals, setModals] = useState({
    signModal: {
      visible: false,
      message: '',
      id: -1,
    },
    signTypedDataModal: {
      visible: false,
      message: '',
      id: -1,
    },
    transactionModal: {
      visible: false,
      txData: {} as any,
      id: -1,
      gasEstimate: '',
    },
  });

  const { address } = useUserStore((store) => store.wallet as Wallet);
  const { chainId, setChainId } = useBrowserStore((store) => store);

  console.log('chainId', chainId);

  // const provider = useWallet(activeWalletId, chainId);
  const [currentUrl, setCurrentUrl] = useState<string | null>(() => {
    if (url) return url as string;

    switch (chainId) {
      case NETWORKS.ETHEREUM: {
        return `${mainnet.blockExplorers.default.url}/address/${address}`;
      }
      case NETWORKS.POLYGON: {
        return `${polygon.blockExplorers.default.url}/address/${address}`;
      }
      case NETWORKS.BSC: {
        return `${bsc.blockExplorers.default.url}/address/${address}`;
      }
      case NETWORKS.ARBITRUM: {
        return `${arbitrum.blockExplorers.default.url}/address/${address}`;
      }
      case NETWORKS.ARBITRUM_NOVA: {
        return `${arbitrumNova.blockExplorers.default.url}/address/${address}`;
      }
      case NETWORKS.BASE: {
        return `${base.blockExplorers.default.url}/address/${address}`;
      }
      case NETWORKS.CORE: {
        return `${coreDao.blockExplorers.default.url}/address/${address}`;
      }
      default: {
        return 'https://www.google.com/';
      }
    }
  });

  const handleMessage = async (event: WebViewMessageEvent) => {
    const { method, params, id } = JSON.parse(event.nativeEvent.data);

    try {
      let result;
      switch (method) {
        case 'eth_accounts':
        case 'eth_requestAccounts': {
          result = [await smartAccountSdkByChainId[chainId].getAccountAddress()];
          break;
        }

        case 'eth_chainId': {
          result = toHex(chainId);
          break;
        }

        case 'eth_blockNumber': {
          const res = await smartAccountSdkByChainId[chainId].rpcProvider.getBlockNumber();
          result = toHex(res);
          break;
        }

        case 'eth_signTypedData_v4': {
          console.log('inside eth_signTypedData_v4', params);

          setModals({
            ...modals,
            signTypedDataModal: { visible: true, message: params[1], id },
          });
          break;
        }

        case 'personal_sign': {
          console.log('result', result, method, params);

          const message = getSignParamsMessage(params);
          setModals({
            ...modals,
            signModal: { visible: true, message, id },
          });
          return;
        }
        case 'eth_sendTransaction': {
          setModals({
            ...modals,
            transactionModal: { ...modals.transactionModal, visible: true, txData: params[0], id },
          });
          return;
        }
        case 'wallet_switchEthereumChain': {
          const chainId = fromHex(params[0].chainId, 'number');

          setChainId(chainId);
          result = 'null';
          break;
        }

        case 'eth_estimateGas': {
          console.log('inside eth_estimateGas', params);

          const gasEstimate = await smartAccountSdkByChainId[chainId].getGasEstimate([params[0]]);
          console.log('gasEstimate', gasEstimate.toString());

          result = toHex(gasEstimate);
          setModals({
            ...modals,
            transactionModal: { ...modals.transactionModal, gasEstimate: result },
          });
          break;
        }
        case 'eth_call': {
          const res = await smartAccountSdkByChainId[chainId].rpcProvider.call({
            ...params[0],
            account: address,
          });

          console.log('res', res);

          result = res.data;
          break;
        }

        default: {
          console.log('inside default');

          const res = await smartAccountSdkByChainId[chainId].rpcProvider.request({
            // @ts-ignore
            method: method,
            params: params,
          });
          result = res;
        }
        // console.log('result', result, method, params);
      }

      console.log('result', result, method, params);

      webViewRef.current?.postMessage(JSON.stringify({ id, result }));
    } catch (error) {
      console.log('error', 'method', method, 'params', params, JSON.stringify(error));

      webViewRef.current?.postMessage(JSON.stringify({ id, error: error.message }));
    }
  };

  const handleNavigationStateChange = (event: WebViewNavigation) => {
    setBrowserState(event);
    setUrlInput(event.url);
  };

  const handleUrlSubmit = () => {
    if (
      urlInput?.startsWith('http://') ||
      urlInput?.startsWith('https://') ||
      urlInput?.match(URL_REGEX)
    ) {
      setCurrentUrl(urlInput);
    } else {
      setCurrentUrl(`https://www.google.com/search?q=${urlInput}`);
    }
  };

  const onSignAccept = async () => {
    const signature = await smartAccountSdkByChainId[chainId].signMessage(modals.signModal.message);
    setModals({ ...modals, signModal: { visible: false, message: '', id: -1 } });
    console.log('modals.signModal.id', modals.signModal.id, signature, modals.signModal.message);
    webViewRef.current?.postMessage(
      JSON.stringify(formatJsonRpcResult(Number(modals.signModal.id), signature)),
    );
  };

  const onSignCancel = () => {
    webViewRef.current?.postMessage(
      JSON.stringify({ id: modals.signModal.id, error: 'User rejected the request' }),
    );
    setModals({ ...modals, signModal: { visible: false, message: '', id: -1 } });
  };

  const onSignTypedDataAccept = async () => {
    const signature = await smartAccountSdkByChainId[chainId].getSigner().signTypedData({
      account: address,
      ...JSON.parse(modals.signTypedDataModal.message),
    });
    setModals({ ...modals, signTypedDataModal: { visible: false, message: '', id: -1 } });
    webViewRef.current?.postMessage(
      JSON.stringify(formatJsonRpcResult(Number(modals.signTypedDataModal.id), signature)),
    );
  };

  const onSignTypedDataCancel = () => {
    webViewRef.current?.postMessage(
      JSON.stringify({ id: modals.signTypedDataModal.id, error: 'User rejected the request' }),
    );
    setModals({ ...modals, signTypedDataModal: { visible: false, message: '', id: -1 } });
  };

  const onTransactionAccept = async () => {
    const response = await smartAccountSdkByChainId[chainId].sendTransaction(
      modals.transactionModal.txData,
    );
    const { transactionHash } = await response.waitForTxHash();
    setModals({
      ...modals,
      transactionModal: { visible: false, txData: {}, id: -1, gasEstimate: '' },
    });
    webViewRef.current?.postMessage(
      JSON.stringify(formatJsonRpcResult(Number(modals.transactionModal.id), transactionHash)),
    );
  };

  const onTransactionCancel = () => {
    webViewRef.current?.postMessage(
      JSON.stringify({ id: modals.transactionModal.id, error: 'User rejected the request' }),
    );
    setModals({
      ...modals,
      transactionModal: { visible: false, txData: {}, id: -1, gasEstimate: '' },
    });
  };

  useEffect(() => {
    const injectedScript = `
            window.ethereum = {
                request: async function({method, params}) {
                    return new Promise((resolve, reject) => {
                      const messageId = Date.now() * Math.pow(10, 3) +  Math.floor(Math.random() * Math.pow(10, 3));
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                          id: messageId,
                          method: method,
                          params: params
                      }));

                      window.addEventListener("message", function(event) {
                          const data = JSON.parse(event.data);
                          if (data.id && data.id === messageId) {
                            if (data.error) {
                              reject(data.error);
                            } else {
                              resolve(data.result);
                            }
                          }
                      });
                      document.addEventListener("message", function(event) {
                          const data = JSON.parse(event.data);
                          if (data.id && data.id === messageId) {
                            if (data.error) {
                              reject(data.error);
                            } else {
                              resolve(data.result);
                            }
                          }
                      });
                    });
                },
                isMetaMask: true,
                isConnected: () => true,
            };
            window.web3 = { currentProvider: window.ethereum };
            true;  // ensure the injected script doesn't return a value
        `;

    setInjectedJavaScript(injectedScript);
  }, []);

  const headerHeight = useHeaderHeight();

  return (
    <LinearGradient
      colors={['#4B2EA2', '#0E2875']}
      style={[tw`flex-1`, { paddingTop: headerHeight }]}>
      <View style={tw`flex-row items-center bg-transparent p-1 gap-[5px]`}>
        <Pressable
          disabled={!browserState?.canGoBack}
          onPress={() => {
            webViewRef.current?.goBack();
          }}>
          <BlurView style={[tw`p-1.5 rounded-full overflow-hidden`]} intensity={50} tint="light">
            <Iconify icon="ion:chevron-back-outline" color="white" size={24} />
          </BlurView>
        </Pressable>

        <Pressable
          disabled={!browserState?.canGoForward}
          onPress={() => {
            webViewRef.current?.goForward();
          }}
          hitSlop={30}>
          <BlurView style={[tw`p-1.5 rounded-full overflow-hidden`]} intensity={50} tint="light">
            <Iconify icon="ion:chevron-forward-outline" color="white" size={24} />
          </BlurView>
        </Pressable>

        <Pressable
          onPress={() => {
            webViewRef.current?.reload();
          }}
          hitSlop={30}>
          <BlurView style={[tw`p-1.5 rounded-full overflow-hidden`]} intensity={50} tint="light">
            <Iconify icon="ion:reload-outline" color="white" size={24} />
          </BlurView>
        </Pressable>
        <Pressable
          onPress={() => {
            webViewRef.current?.reload();
          }}
          hitSlop={30}>
          <BlurView style={[tw`p-1.5 rounded-full overflow-hidden`]} intensity={50} tint="light">
            <Iconify icon="ion:heart-outline" color="white" size={24} />
          </BlurView>
        </Pressable>

        <BlurView
          style={[tw`flex-1 p-2.5 rounded-[30px] overflow-hidden`]}
          intensity={50}
          tint="light">
          <TextInput
            placeholder="Enter URL"
            onChangeText={(text) => {
              setUrlInput(text);
            }}
            value={urlInput ?? ''}
            style={tw`flex-1 text-white text-opacity-60 rounded-[30px]`}
            selectTextOnFocus
            onSubmitEditing={handleUrlSubmit}
          />
        </BlurView>

        {/* <NavigationButton
            Icon={<Ionicons name="arrow-forward-circle-outline" size={12} color="white" />}
            onPress={handleUrlSubmit}
          /> */}
      </View>
      <View style={tw`flex-1`}>
        <WebView
          ref={webViewRef}
          source={{ uri: currentUrl ?? 'https://www.opensea.io/' }}
          startInLoadingState
          javaScriptEnabled
          onMessage={handleMessage}
          injectedJavaScript={injectedJavaScript ?? undefined}
          onNavigationStateChange={handleNavigationStateChange}
        />
        {modals.signModal.message && (
          <SignModalDynamic
            visible={modals.signModal.visible}
            onAccept={onSignAccept}
            onCancel={onSignCancel}
            chainId={chainId}
            message={modals.signModal.message}
            requestURL={currentUrl ?? url ?? ''}
            requestName={browserState?.title ?? ''}
          />
        )}
        {modals.signTypedDataModal.message && (
          <SignModalDynamic
            visible={modals.signTypedDataModal.visible}
            onAccept={onSignTypedDataAccept}
            onCancel={onSignTypedDataCancel}
            chainId={chainId}
            message={modals.signTypedDataModal.message}
            requestURL={currentUrl ?? url ?? ''}
            requestName={browserState?.title ?? ''}
          />
        )}
        {modals.transactionModal.txData && (
          <SendTransactionModalDynamic
            visible={modals.transactionModal.visible}
            onAccept={onTransactionAccept}
            onCancel={onTransactionCancel}
            chainId={chainId}
            txData={modals.transactionModal.txData}
            requestURL={currentUrl ?? url ?? ''}
            requestName={browserState?.title ?? ''}
            gasEstimate={modals.transactionModal.gasEstimate}
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default WalletInAppBrowser;
