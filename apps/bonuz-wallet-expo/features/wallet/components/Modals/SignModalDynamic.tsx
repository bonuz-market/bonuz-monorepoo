import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';

import { NETWORK_NAMES } from '@/constants/networks';

import { useTheme } from '../../hooks/useTheme';
import { Message } from '../Modal/Message';
import { Methods } from '../Modal/Methods';
import { ModalFooter } from '../Modal/ModalFooter';
import { ModalHeader } from '../Modal/ModalHeader';
import { Tag } from '../Tag';

interface SignModalProps {
  visible: boolean;
  onCancel: () => void;
  onAccept: () => Promise<void | string>;
  chainId: number;
  message: string;
  requestURL: string;
  requestName: string;
}

export function SignModalDynamic({
  visible,
  onAccept,
  onCancel,
  chainId,
  message,
  requestURL,
  requestName,
}: SignModalProps) {
  const chainID = NETWORK_NAMES[chainId as keyof typeof NETWORK_NAMES];
  const method = 'Personal Sign';

  const Theme = useTheme();

  return (
    <Modal backdropOpacity={0.6} isVisible={visible}>
      <View style={[styles.container, { backgroundColor: Theme['bg-125'] }]}>
        <ModalHeader
          intention={requestName}
          metadata={{ url: requestURL, icons: [], name: '', description: '' }}
        />

        <View style={styles.divider} />

        <View style={styles.chainContainer}>
          <View style={styles.flexRowWrapped}>
            <Tag value={chainID} grey />
          </View>
          <Methods methods={[method]} />
          <Message message={message} />
        </View>

        <ModalFooter onApprove={onAccept} onReject={onCancel} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  chainContainer: {
    width: '90%',
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(80, 80, 89, 0.1)',
  },
  container: {
    alignItems: 'center',
    borderRadius: 34,
    width: '100%',
    padding: 16,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  flexRowWrapped: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 34,
    paddingTop: 30,
    backgroundColor: 'rgba(242, 242, 247, 0.9)',
    width: '100%',
    position: 'absolute',
    bottom: 44,
  },
  rejectButton: {
    color: 'red',
  },
  dappTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  imageContainer: {
    width: 48,
    height: 48,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(60, 60, 67, 0.36)',
    marginVertical: 16,
  },
});
