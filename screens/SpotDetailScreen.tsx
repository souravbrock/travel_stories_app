import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, radius, cardShadow } from '../lib/theme';
import { findSpot, SPOT_TYPE_COLORS, SPOT_TYPE_ICONS } from '../lib/data';
import { RootStackParamList } from '../lib/nav';
import { haversineKm, formatKm, formatDuration, inr } from '../lib/utils';
import { Badge, Chip, SectionHeader, EmptyState } from '../components/ui';
import { HotelCard } from '../components/cards';
import RouteMap from '../components/RouteMap';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'SpotDetail'>;

const MODES = [
  { id: 'taxi', label: 'Taxi', speed: 55, icon: 'car' },
  { id: 'car', label: 'Car', speed: 40, icon: 'car-sport' },
  { id: 'selfdrive', label: 'Self-Drive', speed: 60, icon: 'speedometer' },
  { id: 'walk', label: 'Walk', speed: 5, icon: 'walk' },
];

export default function SpotDetailScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const found = findSpot(route.params.spotId);
  const [modeId, setModeId] = useState('taxi');
  const [targetId, setTargetId] = useState<string | null>(null);

  const matrix = useMemo(() => {
    if (!found) return [];
    const mode = MODES.find((m) => m.id === modeId) ?? MODES[0];
    return found.district.spots
      .filter((s) => s.id !== found.spot.id)
      .map((s) => {
        const km = haversineKm(found.spot.lat, found.spot.lng, s.lat, s.lng);
        const minutes = (km / mode.speed) * 60;
        return { spot: s, km, minutes };
      })
      .sort((a, b) => a.km - b.km);
  }, [found, modeId]);

  if (!found) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center' }}>
        <EmptyState icon="location-outline" title="Spot not found" message="This tourist spot could not be located." theme={theme} />
      </SafeAreaView>
    );
  }

  const { spot, district, state } = found;
  const typeColor = SPOT_TYPE_COLORS[spot.type];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <FlatList
        data={matrix}
        keyExtractor={(m) => m.spot.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <>
            {/* Hero */}
            <LinearGradient colors={[typeColor, '#12211C']} style={{ padding: 20, paddingBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Pressable
                  onPress={() => navigation.goBack()}
                  style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
                </Pressable>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '800' }}>{spot.name}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 }}>
                    {district.name} · {state.name}
                  </Text>
                </View>
                <Badge label={spot.type} icon={SPOT_TYPE_ICONS[spot.type] as keyof typeof Ionicons.glyphMap} color="#FFFFFF" bg="rgba(0,0,0,0.25)" />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
                <Ionicons name="star" size={14} color="#FFE9B8" />
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 14, marginLeft: 4 }}>
                  {spot.rating.toFixed(1)}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginLeft: 8 }}>
                  {spot.bestTime}
                </Text>
              </View>
            </LinearGradient>

            {/* Info cards */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: 16 }}>
              <InfoCard icon="time-outline" label="Best Time" value={spot.bestTime} theme={theme} />
              <InfoCard icon="ticket-outline" label="Entry" value={spot.entryFee} theme={theme} />
              <InfoCard icon="hourglass-outline" label="Hours" value={spot.hours} theme={theme} />
            </View>

            <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
              <Text style={{ color: theme.text, fontSize: 14, lineHeight: 21 }}>{spot.blurb}</Text>
            </View>

            {/* Distance matrix */}
            <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
              <SectionHeader
                title="Distance to Nearby Spots"
                subtitle="Tap a row to highlight the route on the map"
                theme={theme}
              />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
                {MODES.map((m) => (
                  <Chip
                    key={m.id}
                    label={m.label}
                    icon={m.icon as keyof typeof Ionicons.glyphMap}
                    active={modeId === m.id}
                    onPress={() => setModeId(m.id)}
                    theme={theme}
                    small
                  />
                ))}
              </View>
            </View>

            {/* Route map */}
            <View style={{ paddingHorizontal: 20, marginTop: 4, marginBottom: 8 }}>
              <RouteMap
                spots={district.spots}
                currentId={spot.id}
                targetId={targetId}
                onSelectSpot={(id) => setTargetId(id === spot.id ? null : id)}
              />
            </View>

            {/* Stay nearby */}
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
              <SectionHeader title="Stay Nearby" subtitle="Hotels, resorts & homestays at this spot" theme={theme} />
            </View>
            <FlatList
              horizontal
              data={spot.hotels}
              keyExtractor={(h) => h.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}
              renderItem={({ item }) => (
                <HotelCard
                  hotel={item}
                  theme={theme}
                  onPress={() => navigation.navigate('HotelDetail', { hotelId: item.id })}
                />
              )}
            />

            <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <Pressable
                    onPress={() => navigation.navigate('TripBuilder', { stateId: state.id })}
                    style={[styles.planBtn, { backgroundColor: theme.primary }]}
                  >
                    <Ionicons name="construct" size={16} color={theme.onPrimary} />
                    <Text style={{ color: theme.onPrimary, fontWeight: '800', marginLeft: 8 }}>
                      Plan Trip from here
                    </Text>
                  </Pressable>
                </View>
              </View>
              <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 8 }}>
                Distances computed great-circle from spot coordinates · times are estimates for the selected transit mode.
              </Text>
            </View>

            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
              <SectionHeader title="Distance Matrix" subtitle={`From ${spot.name} to all other spots in ${district.name}`} theme={theme} />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setTargetId(item.spot.id === targetId ? null : item.spot.id)}
            style={[
              styles.matrixRow,
              {
                backgroundColor: theme.card,
                borderColor: targetId === item.spot.id ? theme.accent : theme.border,
                borderWidth: targetId === item.spot.id ? 2 : 1,
                ...cardShadow(theme),
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontWeight: '700', fontSize: 14 }}>{item.spot.name}</Text>
              <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>{item.spot.type}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: theme.text, fontWeight: '800', fontSize: 14 }}>
                {formatKm(item.km)}
              </Text>
              <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>
                {formatDuration(item.minutes)} by {MODES.find((m) => m.id === modeId)?.label.toLowerCase()}
              </Text>
            </View>
            <Ionicons name="navigate" size={16} color={targetId === item.spot.id ? theme.accent : theme.textMuted} style={{ marginLeft: 10 }} />
          </Pressable>
        )}
        ListEmptyComponent={<View />}
      />
    </SafeAreaView>
  );
}

function InfoCard({
  icon,
  label,
  value,
  theme,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={[styles.infoCard, { backgroundColor: theme.card, ...cardShadow(theme) }]}>
      <Ionicons name={icon} size={16} color={theme.primary} />
      <Text style={{ color: theme.textMuted, fontSize: 10, marginTop: 6, fontWeight: '700', letterSpacing: 0.5 }}>
        {label.toUpperCase()}
      </Text>
      <Text style={{ color: theme.text, fontSize: 11, fontWeight: '700', marginTop: 2 }} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoCard: { flex: 1, borderRadius: radius.md, padding: 12, marginRight: 8 },
  matrixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  planBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.pill,
  },
});
