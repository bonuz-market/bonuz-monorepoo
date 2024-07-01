import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

interface IMessageProps {
  message: string;
}

export function Message({ message }: IMessageProps) {
  const Theme = useTheme();
  return (
    <ScrollView
      bounces={false}
      style={[styles.container, { backgroundColor: Theme['bg-150'] }]}
      contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: Theme['fg-150'] }]}>Message</Text>
      <Text style={[styles.message, { color: Theme['fg-175'] }]}>{message}</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    borderRadius: 20,
    marginBottom: 8,
    maxHeight: 120,
    width: '100%',
  },
  content: {
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 12,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
