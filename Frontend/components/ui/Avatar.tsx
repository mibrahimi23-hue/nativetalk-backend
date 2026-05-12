import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { C, F } from '@/constants/theme';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
  style?: object;
}

export function Avatar({ uri, name = '', size = 44, style }: AvatarProps) {
  const initials = name.trim().split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  const r = size / 2;

  if (uri) {
    return <Image source={{ uri }} style={[{ width: size, height: size, borderRadius: r }, style]} />;
  }
  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: r }, style]}>
      <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  initials: { fontFamily: F.heading, color: C.textLight, fontWeight: '700' },
});
