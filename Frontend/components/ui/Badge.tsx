import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { C, F } from '@/constants/theme';

const LEVEL_COLORS: Record<string, string> = {
  A1: '#6EAF6E', A2: '#3CB371',
  B1: '#4A9BD4', B2: '#2575C4',
  C1: '#C47E20', C2: '#A85C00',
};
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:   { bg: C.warningBg,  text: C.warning  },
  confirmed: { bg: C.primaryLight, text: C.primary },
  completed: { bg: C.successBg,  text: C.success  },
  cancelled: { bg: C.errorBg,   text: C.error    },
  join:      { bg: C.primaryLight, text: C.primary },
  active:    { bg: C.successBg,  text: C.success  },
  suspended: { bg: C.errorBg,   text: C.error    },
};

export function LevelBadge({ level }: { level: string }) {
  const color = LEVEL_COLORS[level] ?? C.primary;
  return (
    <View style={[styles.base, { backgroundColor: color + '20' }]}>
      <Text style={[styles.text, { color }]}>{level}</Text>
    </View>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] ?? { bg: C.divider, text: C.textSub };
  return (
    <View style={[styles.base, { backgroundColor: s.bg }]}>
      <Text style={[styles.text, { color: s.text }]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  text: { fontFamily: F.label, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
});
