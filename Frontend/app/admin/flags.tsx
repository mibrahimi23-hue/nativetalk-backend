import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminNav } from './_layout';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Empty } from '@/components/ui/Empty';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface FlaggedReview {
  id: string;
  review_id: string;
  rating?: number;
  comment?: string;
  reviewer_name?: string;
  teacher_name?: string;
  flag_reason?: string;
  flagged_at?: string;
}

export default function AdminFlags() {
  const [flags, setFlags] = useState<FlaggedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api.admin.flags() as FlaggedReview[];
      setFlags(Array.isArray(data) ? data : []);
    } catch {}
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const handleResolve = (flagId: string, action: 'remove' | 'dismiss') => {
    Alert.alert(
      action === 'remove' ? 'Remove Review' : 'Dismiss Flag',
      action === 'remove' ? 'Permanently remove this review?' : 'Dismiss this flag and keep the review?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', style: action === 'remove' ? 'destructive' : 'default', onPress: async () => {
          setBusy(flagId);
          try { await api.admin.resolveFlag(flagId, action); await load(); }
          catch (e) { Alert.alert('Error', (e as Error).message); }
          finally { setBusy(null); }
        }},
      ]
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Flagged Reviews" />
      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={C.primary} />}
      >
        {loading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
        ) : flags.length === 0 ? (
          <Empty icon="flag-outline" title="No flagged reviews" subtitle="All reviews are clean." />
        ) : (
          flags.map(flag => (
            <View key={flag.id} style={s.card}>
              <View style={s.cardHeader}>
                <View style={s.flagBadge}><Text style={s.flagTxt}>Flagged</Text></View>
                {flag.flagged_at && <Text style={s.date}>{new Date(flag.flagged_at).toLocaleDateString()}</Text>}
              </View>
              <View style={s.reviewInfo}>
                <Text style={s.reviewer}>{flag.reviewer_name ?? 'Unknown'} → {flag.teacher_name ?? 'Unknown'}</Text>
                {flag.rating != null && (
                  <Text style={s.stars}>{'★'.repeat(flag.rating)}{'☆'.repeat(5 - flag.rating)} ({flag.rating}/5)</Text>
                )}
                {flag.comment ? <Text style={s.comment} numberOfLines={3}>{flag.comment}</Text> : null}
              </View>
              {flag.flag_reason && (
                <View style={s.reasonBox}>
                  <Text style={s.reasonLabel}>Flag reason:</Text>
                  <Text style={s.reasonTxt}>{flag.flag_reason}</Text>
                </View>
              )}
              <View style={s.actions}>
                <TouchableOpacity style={s.removeBtn} onPress={() => handleResolve(flag.id, 'remove')} disabled={busy === flag.id}>
                  <Text style={s.removeTxt}>{busy === flag.id ? '…' : 'Remove Review'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.dismissBtn} onPress={() => handleResolve(flag.id, 'dismiss')} disabled={busy === flag.id}>
                  <Text style={s.dismissTxt}>{busy === flag.id ? '…' : 'Dismiss Flag'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 110 }} />
      </ScrollView>
      <AdminNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 12, gap: 12 },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 16, gap: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  flagBadge: { backgroundColor: '#FEE2E2', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  flagTxt: { fontFamily: F.label, fontSize: 11, color: C.danger, fontWeight: '700' },
  date: { fontFamily: F.label, fontSize: 11, color: C.textSub },
  reviewInfo: { gap: 6 },
  reviewer: { fontFamily: F.body, fontSize: 14, color: C.text, fontWeight: '600' },
  stars: { fontFamily: F.label, fontSize: 13, color: C.primary },
  comment: { fontFamily: F.body, fontSize: 13, color: C.textSub, lineHeight: 20 },
  reasonBox: { backgroundColor: '#FFF7ED', borderRadius: 10, padding: 10, borderLeftWidth: 3, borderLeftColor: C.warning },
  reasonLabel: { fontFamily: F.label, fontSize: 11, color: C.warning, fontWeight: '700' },
  reasonTxt: { fontFamily: F.body, fontSize: 13, color: C.text, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 10 },
  removeBtn: { flex: 1, backgroundColor: '#FEE2E2', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  removeTxt: { fontFamily: F.label, fontSize: 13, color: C.danger, fontWeight: '700' },
  dismissBtn: { flex: 1, backgroundColor: C.bg, borderRadius: 10, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  dismissTxt: { fontFamily: F.label, fontSize: 13, color: C.textSub, fontWeight: '700' },
});
