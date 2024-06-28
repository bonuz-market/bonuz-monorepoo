import { SignClientTypes } from '@walletconnect/types';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSnapshot } from 'valtio';

import { Chains } from '../components/Modal/Chains';
import { Message } from '../components/Modal/Message';
import { Methods } from '../components/Modal/Methods';
import { getChainData } from '../data/chainsUtil';
import ModalStore from '../store/ModalStore';
import { approveEIP155Request, rejectEIP155Request } from '../utils/EIP155RequestHandlerUtil';
import { handleDeepLinkRedirect } from '../utils/LinkingUtils';
import { web3wallet } from '../utils/WalletConnectUtil';
import { RequestModal } from './RequestModal';

export default function SessionSendTransactionModal() {
  const { data } = useSnapshot(ModalStore.state);
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);

  // Get request and wallet data from store
  const requestEvent = data?.requestEvent;
  const requestSession = data?.requestSession;

  const topic = requestEvent?.topic;
  const params = requestEvent?.params;
  const chainId = params?.chainId;
  const chain = getChainData(chainId);
  const request = params?.request;
  const transaction = request?.params[0];
  const method = requestEvent?.params?.request?.method;

  const requestMetadata = requestSession?.peer?.metadata as SignClientTypes.Metadata;

  // Handle approve action
  const onApprove = useCallback(async () => {
    if (requestEvent && topic) {
      setIsLoadingApprove(true);
      try {
        const response = await approveEIP155Request(requestEvent);
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
    if (requestEvent && topic) {
      setIsLoadingReject(true);
      const response = rejectEIP155Request(requestEvent);
      try {
        await web3wallet.respondSessionRequest({
          topic,
          response,
        });
      } catch (error) {
        console.log((error as Error).message, 'error');
        return;
      }
      setIsLoadingReject(false);
      ModalStore.close();
    }
  }, [requestEvent, topic]);

  return (
    <RequestModal
      intention="sign a transaction"
      metadata={requestMetadata}
      onApprove={onApprove}
      onReject={onReject}
      approveLoader={isLoadingApprove}
      rejectLoader={isLoadingReject}>
      <View style={styles.container}>
        <Chains chains={chain ? [chain] : undefined} />
        <Methods methods={method ? [method] : undefined} />
        <Message message={JSON.stringify(transaction, null, 2)} />
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
