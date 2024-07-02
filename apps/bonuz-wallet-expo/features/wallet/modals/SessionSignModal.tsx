import { SignClientTypes } from '@walletconnect/types';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSnapshot } from 'valtio';

import { Chains } from '../components/Modal/Chains';
import { Message } from '../components/Modal/Message';
import { Methods } from '../components/Modal/Methods';
import Text from '../components/Text';
import ModalStore from '../store/ModalStore';
import { approveEIP155Request, rejectEIP155Request } from '../utils/EIP155RequestHandlerUtil';
import { getSignParamsMessage } from '../utils/HelperUtils';
import { handleDeepLinkRedirect } from '../utils/LinkingUtils';
import { PresetsUtil } from '../utils/PresetsUtil';
import { web3wallet } from '../utils/WalletConnectUtil';
import { RequestModal } from './RequestModal';

export default function SessionSignModal() {
  // Get request and wallet data from store
  const { data } = useSnapshot(ModalStore.state);
  const requestEvent = data?.requestEvent;
  const requestSession = data?.requestSession;
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);

  // Get required request data
  const { topic, params } = requestEvent!;
  const { request, chainId } = params;
  const chain = PresetsUtil.getChainData(chainId);
  const requestMetadata = requestSession?.peer?.metadata as SignClientTypes.Metadata;

  // Get message, convert it to UTF8 string if it is valid hex
  const message = getSignParamsMessage(request.params);

  // Handle approve action (logic varies based on request method)
  const onApprove = useCallback(async () => {
    if (requestEvent) {
      setIsLoadingApprove(true);
      const response = await approveEIP155Request(requestEvent);
      try {
        await web3wallet.respondSessionRequest({
          topic,
          response,
        });
        handleDeepLinkRedirect(requestMetadata?.redirect);
      } catch (error) {
        console.log((error as Error).message, 'error');
        return;
      }
      setIsLoadingApprove(false);
      ModalStore.close();
    }
  }, [requestEvent, requestMetadata, topic]);

  // Handle reject action
  const onReject = useCallback(async () => {
    if (requestEvent) {
      setIsLoadingReject(true);
      const response = rejectEIP155Request(requestEvent);
      try {
        await web3wallet.respondSessionRequest({
          topic,
          response,
        });
      } catch (error) {
        setIsLoadingReject(false);
        console.log((error as Error).message, 'error');
        return;
      }
      setIsLoadingReject(false);
      ModalStore.close();
    }
  }, [requestEvent, topic]);

  const method = requestEvent?.params?.request?.method;

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <Text>Missing request data</Text>;
  }

  return (
    <RequestModal
      intention="wants to request a signature"
      metadata={requestMetadata}
      onApprove={onApprove}
      onReject={onReject}
      approveLoader={isLoadingApprove}
      rejectLoader={isLoadingReject}>
      <View style={styles.container}>
        <Chains chains={chain ? [chain] : undefined} />
        <Methods methods={method ? [method] : undefined} />
        <Message message={message} />
      </View>
    </RequestModal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 8,
  },
});
