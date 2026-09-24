import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme, radius, useTheme } from '../lib/theme';

/* ---------------- Chip ---------------- */
export function Chip({
  label,
  icon,
  active,
  onPress,
  theme,
  small,
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  active?: boolean;
  onPress?: () => void;
  theme: Theme;
  small?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        small && { paddingVertical: 5, paddingHorizontal: 10 },
        {
          backgroundColor: active ? theme.primary : theme.cardAlt,
          borderColor: active ? theme.primary : theme.border,
        },
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={small ? 12 : 14}
          color={active ? theme.onPrimary : theme.primary}
          style={{ marginRight: 5 }}
        />
      ) : null}
      <Text
        style={[
          styles.chipText,
          small && { fontSize: 11 },
          { color: active ? theme.onPrimary : theme.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* ---------------- SectionHeader ---------------- */
export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  theme,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  theme: Theme;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>{subtitle}</Text>
        ) : null}
      </View>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 13 }}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/* ---------------- Stars ---------------- */
export function Stars({ rating, size = 13, theme }: { rating: number; size?: number; theme: Theme }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={rating >= i - 0.25 ? 'star' : rating >= i - 0.75 ? 'star-half' : 'star-outline'}
          size={size}
          color={theme.gold}
        />
      ))}
    </View>
  );
}

/* ---------------- Badge ---------------- */
export function Badge({
  label,
  icon,
  color,
  bg,
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
}) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      {icon ? <Ionicons name={icon} size={11} color={color} style={{ marginRight: 4 }} /> : null}
      <Text style={{ color, fontSize: 11, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}

/* ---------------- EmptyState ---------------- */
export function EmptyState({
  icon,
  title,
  message,
  theme,
  actionLabel,
  onAction,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  theme: Theme;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.empty}>
      <View style={[styles.emptyIcon, { backgroundColor: theme.primarySoft }]}>
        <Ionicons name={icon} size={30} color={theme.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.emptyMsg, { color: theme.textMuted }]}>{message}</Text>
      {actionLabel ? (
        <Pressable onPress={onAction} style={[styles.emptyBtn, { backgroundColor: theme.primary }]}>
          <Text style={{ color: theme.onPrimary, fontWeight: '700' }}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/* ---------------- Stepper ---------------- */
export function Stepper({
  value,
  onChange,
  min = 1,
  max = 30,
  theme,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  theme: Theme;
  label?: string;
}) {
  return (
    <View style={styles.stepper}>
      {label ? <Text style={{ color: theme.text, fontWeight: '600', flex: 1 }}>{label}</Text> : null}
      <Pressable
        onPress={() => onChange(Math.max(min, value - 1))}
        style={[styles.stepBtn, { borderColor: theme.border, backgroundColor: theme.cardAlt }]}
      >
        <Ionicons name="remove" size={16} color={theme.text} />
      </Pressable>
      <Text style={{ color: theme.text, fontWeight: '700', minWidth: 36, textAlign: 'center' }}>{value}</Text>
      <Pressable
        onPress={() => onChange(Math.min(max, value + 1))}
        style={[styles.stepBtn, { borderColor: theme.border, backgroundColor: theme.cardAlt }]}
      >
        <Ionicons name="add" size={16} color={theme.text} />
      </Pressable>
    </View>
  );
}

/* ---------------- PrimaryButton ---------------- */
export function PrimaryButton({
  label,
  onPress,
  theme,
  icon,
  disabled,
  outline,
}: {
  label: string;
  onPress: () => void;
  theme: Theme;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  outline?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.primaryBtn,
        outline
          ? { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: theme.primary }
          : { backgroundColor: disabled ? theme.border : theme.primary },
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={16}
          color={outline ? theme.primary : theme.onPrimary}
          style={{ marginRight: 8 }}
        />
      ) : null}
      <Text
        style={{
          color: outline ? theme.primary : theme.onPrimary,
          fontWeight: '700',
          fontSize: 15,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  sectionSubtitle: { fontSize: 12, marginTop: 2 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  empty: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 17, fontWeight: '800', marginBottom: 6 },
  emptyMsg: { fontSize: 13, textAlign: 'center', lineHeight: 19 },
  emptyBtn: {
    marginTop: 18,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: radius.pill,
  },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.pill,
  },
});
