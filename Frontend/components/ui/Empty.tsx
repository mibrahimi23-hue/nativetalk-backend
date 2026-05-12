import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, F } from '@/constants/theme';

interface EmptyProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function Empty({ icon = 'search-outline', title, subtitle, children }: EmptyProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={36} color={C.textSub} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 30 },
  iconWrap: { width: 72, height: 72, borderRadius: 36, backgroundColor: C.divider, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontFamily: F.heading, fontSize: 17, color: C.text, textAlign: 'center', marginBottom: 6 },
  sub: { fontFamily: F.body, fontSize: 13, color: C.textSub, textAlign: 'center', lineHeight: 20 },
});
