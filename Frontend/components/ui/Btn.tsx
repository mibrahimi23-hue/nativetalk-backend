import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { C, F } from '@/constants/theme';

interface BtnProps extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Btn({ label, loading, variant = 'primary', size = 'lg', style, disabled, ...rest }: BtnProps) {
  const bg = variant === 'primary' ? C.primary
    : variant === 'secondary' ? C.card
    : variant === 'danger' ? C.error
    : 'transparent';
  const tc = variant === 'primary' ? C.textLight
    : variant === 'danger' ? C.textLight
    : C.primary;
  const brd = variant === 'secondary' ? { borderWidth: 1.5, borderColor: C.border } : {};
  const py = size === 'sm' ? 10 : size === 'md' ? 13 : 16;

  return (
    <TouchableOpacity
      style={[styles.base, { backgroundColor: bg, paddingVertical: py, opacity: disabled || loading ? 0.6 : 1 }, brd, style]}
      disabled={disabled || loading}
      activeOpacity={0.82}
      {...rest}
    >
      {loading
        ? <ActivityIndicator color={tc} size="small" />
        : <Text style={[styles.label, { color: tc, fontSize: size === 'sm' ? 13 : 16 }]}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 14, alignItems: 'center', justifyContent: 'center', width: '100%' },
  label: { fontFamily: F.body, fontWeight: '700', letterSpacing: 0.2 },
});
