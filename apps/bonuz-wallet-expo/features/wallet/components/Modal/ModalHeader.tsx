import { SignClientTypes } from '@walletconnect/types';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

interface ModalHeaderProps {
  metadata?: SignClientTypes.Metadata;
  intention?: string;
}

export function ModalHeader({ metadata, intention }: ModalHeaderProps) {
  const Theme = useTheme();
  const color = Theme['fg-100'];
  // TODO: add domain verif
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: metadata?.icons[0] ?? '' }}
        style={[styles.logo, { borderColor: Theme['gray-glass-010'] }]}
      />

      <Text style={[styles.title, { color }]}>{metadata?.name || 'Unknown'}</Text>
      {intention && <Text style={[styles.desc, { color }]}>{intention}</Text>}
      <Text style={[styles.url, { color: Theme['fg-200'] }]}>
        {metadata?.url || 'unknown domain'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  desc: {
    fontSize: 16,
    fontWeight: '600',
  },
  url: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
  },
});
