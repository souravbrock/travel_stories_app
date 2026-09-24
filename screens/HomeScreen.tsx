import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, radius, cardShadow } from '../lib/theme';
import { STATES, PACKAGES, findAgent } from '../lib/data';
import type { IndianState } from '../lib/types';
import { RootStackParamList } from '../lib/nav';
import { SectionHeader, Badge } from '../components/ui';
import { SpotCard, PackageCard } from '../components/cards';
import { inr } from '../lib/utils';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function avgRating(s: IndianState): number {
  const all = s.districts.flatMap((d) => d.spots);
  return all.reduce((a, b) => a + b.rating, 0) / all.length;
}

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const { width } = useWindowDimensions();

  const month = new Date().getMonth();
  const season =
    month <= 1 || month === 11 ? 'Winter' : month <= 4 ? 'Summer' : month <= 8 ? 'Monsoon' : 'Autumn';
  const seasonMap: Record<string, string[]> = {
    Winter: ['rajasthan', 'goa', 'kerala', 'tamilnadu'],
    Summer: ['uttarakhand', 'himachal', 'westbengal'],
    Monsoon: ['karnataka', 'kerala', 'maharashtra'],
    Autumn: ['gujarat', 'madhyapradesh', 'uttarpradesh'],
  };
  const suited = (seasonMap[season] ?? [])
    .map((id) => STATES.find((s) => s.id === id))
    .filter(Boolean) as IndianState[];

  const trending = [...STATES].sort((a, b) => avgRating(b) - avgRating(a)).slice(0, 6);
  const topSpots = STATES.flatMap((s) => s.districts.flatMap((d) => d.spots))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);
  const featured = PACKAGES.slice(0, 5);

  const goState = (stateId: string) => navigation.navigate('StateMap', { stateId });
  const goSpot = (spotId: string) => navigation.navigate('SpotDetail', { spotId });

  const header = (
    <View>
      {/* Greeting */}
      <View style={styles.greetRow}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.textMuted, fontSize: 13 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
          <Text style={{ color: theme.text, fontSize: 24, fontWeight: '800', marginTop: 2 }}>
            Namaste, Aarav
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Main', { screen: 'Trips' })}
          style={[styles.bellBtn, { backgroundColor: theme.card, ...cardShadow(theme) }]}
        >
          <Ionicons name="notifications-outline" size={20} color={theme.text} />
        </Pressable>
      </View>

      {/* Search */}
      <Pressable
        onPress={() => navigation.navigate('Main', { screen: 'Map' })}
        style={[styles.searchBar, { backgroundColor: theme.card, ...cardShadow(theme) }]}
      >
        <Ionicons name="search" size={18} color={theme.textMuted} />
        <Text style={{ color: theme.textMuted, marginLeft: 10, fontSize: 14 }}>
          Search states, spots, packages…
        </Text>
      </Pressable>

      {/* Hero */}
      <LinearGradient
        colors={['#0E5F52', '#1E7A5A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#FFE9B8', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 }}>
            INCREDIBLE INDIA
          </Text>
          <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginTop: 6, lineHeight: 30 }}>
            Discover stories across{'\n'}1.3 billion souls
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Main', { screen: 'Map' })}
            style={styles.heroBtn}
          >
            <Text style={{ color: '#0E5F52', fontWeight: '800', fontSize: 13 }}>Explore the Map</Text>
            <Ionicons name="arrow-forward" size={14} color="#0E5F52" style={{ marginLeft: 6 }} />
          </Pressable>
        </View>
        <Ionicons name="airplane" size={90} color="rgba(255,255,255,0.14)" style={{ position: 'absolute', right: -10, bottom: -14 }} />
      </LinearGradient>

      {/* Season insight */}
      <View style={[styles.seasonCard, { backgroundColor: theme.card, ...cardShadow(theme) }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.seasonIcon, { backgroundColor: theme.accentSoft }]}>
            <Ionicons name="partly-sunny" size={18} color={theme.accent} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ color: theme.text, fontWeight: '800', fontSize: 14 }}>
              {season} Season — Best Time to Travel
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>
              Peak travel window across India right now
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
          {suited.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => goState(s.id)}
              style={[styles.seasonChip, { backgroundColor: s.color }]}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>{s.name}</Text>
              <Ionicons name="arrow-forward" size={10} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </Pressable>
          ))}
        </View>
      </View>

      {/* Trending states */}
      <View style={{ marginTop: 20 }}>
        <SectionHeader title="Trending States" subtitle="Most loved by travellers this month" theme={theme} />
        <FlatList
          horizontal
          data={trending}
          keyExtractor={(s) => s.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => goState(item.id)} style={[styles.stateCard, { backgroundColor: theme.card, ...cardShadow(theme) }]}>
              <LinearGradient colors={[item.color, shade(item.color)]} style={styles.stateCardTop}>
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFE9B8', marginRight: 4 }} />
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 9, fontWeight: '700' }}>
                    Best: {item.bestSeason}
                  </Text>
                </View>
              </LinearGradient>
              <View style={{ padding: 10 }}>
                <Text style={{ color: theme.textMuted, fontSize: 10.5 }} numberOfLines={1}>
                  {item.districts.length} districts · {item.districts.reduce((a, d) => a + d.spots.length, 0)} spots
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <Ionicons name="star" size={11} color={theme.gold} />
                  <Text style={{ color: theme.text, fontWeight: '700', fontSize: 11, marginLeft: 3 }}>
                    {avgRating(item).toFixed(1)}
                  </Text>
                  <Text style={{ color: theme.textMuted, fontSize: 10, marginLeft: 4 }}>avg rating</Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>

      {/* Featured packages */}
      <View style={{ marginTop: 20 }}>
        <SectionHeader
          title="Featured Packages"
          subtitle="Curated by verified agents"
          actionLabel="See all"
          onAction={() => navigation.navigate('Main', { screen: 'Packages' })}
          theme={theme}
        />
        <FlatList
          horizontal
          data={featured}
          keyExtractor={(p) => p.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
          renderItem={({ item }) => (
            <PackageCard
              pkg={item}
              agentName={findAgent(item.agentId).agency}
              onPress={() => navigation.navigate('PackageDetail', { packageId: item.id })}
              theme={theme}
            />
          )}
        />
      </View>

      {/* Quick actions */}
      <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 4 }}>
        <QuickAction
          icon="map"
          label="Explore Map"
          theme={theme}
          onPress={() => navigation.navigate('Main', { screen: 'Map' })}
        />
        <QuickAction
          icon="construct"
          label="Build a Trip"
          theme={theme}
          onPress={() => navigation.navigate('TripBuilder', {})}
        />
        <QuickAction
          icon="briefcase"
          label="Agent Tours"
          theme={theme}
          onPress={() => navigation.navigate('Main', { screen: 'Packages' })}
        />
      </View>

      {/* Top spots */}
      <View style={{ marginTop: 16 }}>
        <SectionHeader title="Top-Rated Experiences" subtitle="India's most loved spots" theme={theme} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <FlatList
        data={topSpots}
        keyExtractor={(s) => s.id}
        ListHeaderComponent={header}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <SpotCard
            spot={item}
            theme={theme}
            onPress={() => navigation.navigate('SpotDetail', { spotId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

function QuickAction({
  icon,
  label,
  theme,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  theme: ReturnType<typeof useTheme>;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.quickAction,
        { backgroundColor: theme.card, borderColor: theme.border, ...cardShadow(theme) },
      ]}
    >
      <View style={[styles.quickIcon, { backgroundColor: theme.primarySoft }]}>
        <Ionicons name={icon} size={18} color={theme.primary} />
      </View>
      <Text style={{ color: theme.text, fontWeight: '700', fontSize: 12, marginTop: 8 }}>{label}</Text>
    </Pressable>
  );
}

function shade(hex: string): string {
  // darken by 25%
  const n = parseInt(hex.replace('#', ''), 16);
  const f = 0.75;
  const r = Math.round(((n >> 16) & 255) * f);
  const g = Math.round(((n >> 8) & 255) * f);
  const b = Math.round((n & 255) * f);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

const styles = StyleSheet.create({
  greetRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 16,
  },
  hero: {
    borderRadius: radius.xl,
    padding: 20,
    minHeight: 150,
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 16,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    marginTop: 16,
  },
  seasonCard: { borderRadius: radius.lg, padding: 16 },
  seasonIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  seasonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    marginRight: 8,
    marginBottom: 8,
  },
  stateCard: { width: 150, borderRadius: radius.lg, overflow: 'hidden', marginRight: 12 },
  stateCardTop: { padding: 12, minHeight: 64, justifyContent: 'flex-end' },
  quickAction: {
    flex: 1,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 1,
    marginRight: 10,
    alignItems: 'flex-start',
  },
  quickIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
