import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, radius, cardShadow } from '../lib/theme';
import { STATES, SOON_STATES } from '../lib/data';
import { RootStackParamList } from '../lib/nav';
import { StateTile } from '../components/cards';
import { Badge, PrimaryButton } from '../components/ui';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Tile = (typeof STATES)[number] | (typeof SOON_STATES)[number];

const COLS = 7;
const ROWS = 8;
const GAP = 6;

export default function IndiaMapScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const { width } = useWindowDimensions();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>('rajasthan');

  const tileW = (width - 40 - GAP * (COLS - 1)) / COLS;

  const grid = useMemo(() => {
    const g: (Tile | null)[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: (Tile | null)[] = [];
      for (let c = 0; c < COLS; c++) {
        const st = STATES.find((s) => s.grid.r === r && s.grid.c === c);
        if (st) {
          row.push(st);
        } else {
          row.push(SOON_STATES.find((s) => s.grid.r === r && s.grid.c === c) ?? null);
        }
      }
      g.push(row);
    }
    return g;
  }, []);

  const selectedState = selectedId ? STATES.find((s) => s.id === selectedId) : undefined;
  const selectedSoon = selectedId ? SOON_STATES.find((s) => s.name === selectedId) : undefined;
  const hoveredState = hoveredId ? STATES.find((s) => s.id === hoveredId) : undefined;
  const hoveredSoon = hoveredId ? SOON_STATES.find((s) => s.name === hoveredId) : undefined;
  const preview: Tile | null = selectedState ?? selectedSoon ?? hoveredState ?? hoveredSoon ?? null;

  const isAvailable = preview ? 'districts' in preview : false;
  const topSpots = isAvailable && selectedState ? selectedState.districts[0].spots.slice(0, 3) : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Header */}
        <Text style={{ color: theme.text, fontSize: 24, fontWeight: '800' }}>India — Interactive Map</Text>
        <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 4 }}>
          Hover or tap a state to preview · tap again to drill into districts
        </Text>

        {/* Map grid */}
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.card, borderRadius: radius.xl, padding: 14, ...cardShadow(theme) }}>
            {grid.map((row, ri) => (
              <View key={ri} style={{ flexDirection: 'row', marginBottom: ri === ROWS - 1 ? 0 : GAP }}>
                {row.map((tile, ci) => {
                  if (!tile) return <View key={ci} style={{ width: tileW, height: tileW * 1.28, marginRight: GAP }} />;
                  const id = 'available' in tile ? tile.id : tile.name;
                  const selected = selectedId === id;
                  const hovered = hoveredId === id;
                  return (
                    <View key={id} style={{ width: tileW, height: tileW * 1.28, marginRight: GAP }}>
                      <StateTile
                        state={tile}
                        hovered={hovered}
                        selected={selected}
                        onHover={(v) => setHoveredId(v ? id : null)}
                        onPress={() => setSelectedId(selected ? null : id)}
                        theme={theme}
                      />
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        {/* Preview card */}
        {preview ? (
          <View style={{ marginTop: 20 }}>
            <LinearGradient
              colors={isAvailable ? [(preview as (typeof STATES)[number]).color, '#12211C'] : ['#8A8578', '#5A564E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: radius.xl, padding: 18, overflow: 'hidden' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '800' }}>
                    {(preview as (typeof STATES)[number]).name}
                  </Text>
                  {'tagline' in preview ? (
                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4 }}>
                      {(preview as (typeof STATES)[number]).tagline}
                    </Text>
                  ) : (
                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4 }}>
                      Districts & spots coming soon
                    </Text>
                  )}
                </View>
                {'available' in preview && preview.available !== false ? (
                  <Badge label={`Best: ${(preview as (typeof STATES)[number]).bestSeason}`} icon="sunny" color="#FFE9B8" bg="rgba(0,0,0,0.25)" />
                ) : null}
              </View>

              {isAvailable ? (
                <>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 14 }}>
                    {(preview as (typeof STATES)[number]).highlights.map((h) => (
                      <View key={h} style={{ backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, marginRight: 8, marginBottom: 8 }}>
                        <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>{h}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={{ marginTop: 8 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 }}>
                      PROMINENT DESTINATIONS
                    </Text>
                    {topSpots.map((s) => (
                      <View key={s.id} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                        <Ionicons name="location" size={13} color="#FFE9B8" />
                        <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600', marginLeft: 6 }}>
                          {s.name}
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginLeft: 8 }}>
                          {s.type} · {s.rating.toFixed(1)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
                    <Ionicons name="calendar" size={13} color="#FFE9B8" />
                    <Text style={{ color: '#FFFFFF', fontSize: 12, marginLeft: 6 }}>
                      Best time: <Text style={{ fontWeight: '800' }}>{(preview as (typeof STATES)[number]).bestSeason}</Text>
                      {'  '}·{'  '}Peak: {(preview as (typeof STATES)[number]).peakSeason}
                    </Text>
                  </View>

                  <PrimaryButton
                    label="Explore Districts"
                    icon="map-outline"
                    theme={theme}
                    onPress={() => navigation.navigate('StateMap', { stateId: (preview as (typeof STATES)[number]).id })}
                  />
                </>
              ) : (
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 12 }}>
                  Our travel partners are curating experiences here. Check back soon!
                </Text>
              )}
            </LinearGradient>
          </View>
        ) : null}

        {/* Legend */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, justifyContent: 'center' }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.gold, marginRight: 6 }} />
          <Text style={{ color: theme.textMuted, fontSize: 11 }}>
            Season dot = best time to visit · {STATES.length} states live
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
