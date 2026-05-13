import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { C, F } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  noBorder?: boolean;
}

export function ScreenHeader({ title, subtitle, onBack, right, noBorder }: ScreenHeaderProps) {
  return (
    <View style={[styles.header, noBorder && { borderBottomWidth: 0 }]}>
      <TouchableOpacity style={styles.back} onPress={onBack ?? (() => router.back())} hitSlop={8}>
        <Ionicons name="chevron-back" size={24} color={C.text} />
      </TouchableOpacity>
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      </View>
      <View style={styles.right}>{right ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
    backgroundColor: C.bg,
  },
  back: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center' },
  title: { fontFamily: F.heading, fontSize: 17, color: C.text },
  sub: { fontFamily: F.label, fontSize: 11, color: C.textSub, marginTop: 1 },
  right: { width: 40, alignItems: 'flex-end' },
});
