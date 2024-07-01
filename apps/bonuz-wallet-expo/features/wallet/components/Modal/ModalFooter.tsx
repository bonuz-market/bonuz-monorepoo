import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '../ActionButton';

export interface ModalFooterProps {
  onApprove: () => Promise<void | string>;
  onReject: () => void;
  approveLoader?: boolean;
  rejectLoader?: boolean;
}

export function ModalFooter({
  onApprove,
  onReject,
  approveLoader,
  rejectLoader,
}: ModalFooterProps) {
  return (
    <View style={styles.container}>
      <ActionButton
        loading={rejectLoader}
        disabled={approveLoader || rejectLoader}
        onPress={onReject}
        secondary>
        Reject
      </ActionButton>
      <ActionButton
        loading={approveLoader}
        disabled={approveLoader || rejectLoader}
        onPress={async () => onApprove()}>
        Approve
      </ActionButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
