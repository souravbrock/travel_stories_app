import React, { useEffect, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Spot } from '../lib/types';
import { useTheme, radius } from '../lib/theme';

/**
 * Stylised mini-map of a district's spots. Normalises lat/lng into a
 * padded box, renders labelled markers and an animated route line
 * between two selected spots.
 */
export default function RouteMap({
  spots,
  currentId,
  targetId,
  onSelectSpot,
}: {
  spots: Spot[];
  currentId: string;
  targetId: string | null;
  onSelectSpot: (id: string) => void;
}) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const W = Math.min(width - 64, 420);
  const H = W * 0.72;
  const PAD = 34;

  const lats = spots.map((s) => s.lat);
  const lngs = spots.map((s) => s.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latPad = Math.max((maxLat - minLat) * 0.25, 0.01);
  const lngPad = Math.max((maxLng - minLng) * 0.25, 0.01);

  const x = (lng: number) =>
    PAD + ((lng - (minLng - lngPad)) / (maxLng - minLng + 2 * lngPad)) * (W - PAD * 2);
  const y = (lat: number) =>
    H - PAD - ((lat - (minLat - latPad)) / (maxLat - minLat + 2 * latPad)) * (H - PAD * 2);

  const target = targetId ? spots.find((s) => s.id === targetId) : null;
  const current = spots.find((s) => s.id === currentId);

  let lineStyle: { width: number; left: number; top: number; transform: { rotate: string }[] } | null = null;
  if (target && current) {
    const x1 = x(current.lng);
    const y1 = y(current.lat);
    const x2 = x(target.lng);
    const y2 = y(target.lat);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    lineStyle = {
      width: len,
      left: (x1 + x2) / 2 - len / 2,
      top: (y1 + y2) / 2 - 1.5,
      transform: [{ rotate: `${angle}deg` }],
    };
  }

  return (
    <View
      style={{
        width: W,
        height: H,
        borderRadius: radius.lg,
        backgroundColor: theme.primarySoft,
        borderWidth: 1,
        borderColor: theme.border,
        overflow: 'hidden',
        alignSelf: 'center',
      }}
    >
      {/* grid lines */}
      {[0.25, 0.5, 0.75].map((f) => (
        <React.Fragment key={f}>
          <View style={{ position: 'absolute', left: 0, right: 0, top: H * f, height: 1, backgroundColor: theme.border }} />
          <View style={{ position: 'absolute', top: 0, bottom: 0, left: W * f, width: 1, backgroundColor: theme.border }} />
        </React.Fragment>
      ))}

      {/* route line */}
      {lineStyle ? <AnimatedRouteLine style={lineStyle} color={theme.accent} /> : null}

      {/* markers */}
      {spots.map((s) => {
        const isCurrent = s.id === currentId;
        const isTarget = s.id === targetId;
        const active = isCurrent || isTarget;
        return (
          <Pressable
            key={s.id}
            onPress={() => onSelectSpot(s.id)}
            style={{
              position: 'absolute',
              left: x(s.lng) - 14,
              top: y(s.lat) - 14,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: active ? theme.accent : theme.primary,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#FFFFFF',
              zIndex: active ? 10 : 1,
            }}
          >
            <Pulse color={active ? theme.accent : theme.primary} />
            <Ionicons name="location" size={13} color="#FFFFFF" />
          </Pressable>
        );
      })}

      {/* labels */}
      {spots.map((s) => {
        const isCurrent = s.id === currentId;
        const isTarget = s.id === targetId;
        if (!isCurrent && !isTarget) return null;
        return (
          <View
            key={`lbl-${s.id}`}
            style={{
              position: 'absolute',
              left: x(s.lng) + 16,
              top: y(s.lat) - 10,
              backgroundColor: theme.card,
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: theme.border,
              zIndex: 20,
              maxWidth: 150,
            }}
          >
            <Text numberOfLines={1} style={{ color: theme.text, fontSize: 10.5, fontWeight: '700' }}>
              {s.name}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 9 }}>
              {isCurrent ? 'You are here' : 'Destination'}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function Pulse({ color }: { color: string }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(2.2, { duration: 1200, easing: Easing.out(Easing.ease) }), withTiming(1, { duration: 0 })),
      -1
    );
    opacity.value = withRepeat(
      withSequence(withTiming(0, { duration: 1200, easing: Easing.out(Easing.ease) }), withTiming(0.6, { duration: 0 })),
      -1
    );
  }, []);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: opacity.value }));
  return (
    <Animated.View
      style={[
        { position: 'absolute', width: 28, height: 28, borderRadius: 14, backgroundColor: color },
        animated,
      ]}
    />
  );
}

function AnimatedRouteLine({
  style,
  color,
}: {
  style: { width: number; left: number; top: number; transform: { rotate: string }[] };
  color: string;
}) {
  const dash = useSharedValue(0);
  useEffect(() => {
    dash.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.linear }), -1, false);
  }, []);
  const animated = useAnimatedStyle(() => ({
    opacity: 0.65 + 0.35 * Math.sin(dash.value * Math.PI * 4),
  }));
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          height: 3,
          borderRadius: 2,
          backgroundColor: color,
          zIndex: 5,
        },
        style,
        animated,
      ]}
    />
  );
}
