import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, F } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  secure?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function Input({ label, error, secure, icon, style, ...rest }: InputProps) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.box, focused && styles.boxFocused, error ? styles.boxError : null]}>
        {icon ? <Ionicons name={icon} size={18} color={C.textSub} style={{ marginRight: 8 }} /> : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={C.textPlaceholder}
          secureTextEntry={secure && !show}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {secure ? (
          <TouchableOpacity onPress={() => setShow(v => !v)} hitSlop={8}>
            <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.textSub} />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontFamily: F.label, fontSize: 13, color: C.textSub, marginBottom: 6, fontWeight: '600' },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 0,
    minHeight: 52,
  },
  boxFocused: { borderColor: C.primary },
  boxError: { borderColor: C.error },
  input: { flex: 1, fontFamily: F.body, fontSize: 15, color: C.text, paddingVertical: 12 },
  error: { fontFamily: F.label, fontSize: 12, color: C.error, marginTop: 4 },
});
