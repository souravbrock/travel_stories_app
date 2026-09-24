import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { District, Hotel, IndianState, Spot, TourPackage, Vehicle } from '../lib/types';
import { Theme, radius, cardShadow, useTheme } from '../lib/theme';
import { inr } from '../lib/utils';
import { Badge, Stars } from './ui';
import { SPOT_TYPE_ICONS } from '../lib/data';

/* ---------------- StateTile (national map) ---------------- */
export function StateTile({
  state,
  hovered,
  selected,
  onHover,
  onPress,
  theme,
}: {
  state: IndianState | { name: string; color: string; available?: boolean };
  hovered: boolean;
  selected: boolean;
  onHover: (v: boolean) => void;
  onPress: () => void;
  theme: Theme;
}) {
  const available = (state as IndianState).available !== false;
  return (
    <Pressable
      onHoverIn={() => onHover(true)}
      onHoverOut={() => onHover(false)}
      onPress={onPress}
      style={[
        styles.stateTile,
        {
          backgroundColor: available ? (state as IndianState).color : theme.border,
          transform: [{ scale: selected ? 1.08 : hovered ? 1.04 : 1 }],
          borderColor: selected ? theme.accent : 'transparent',
          borderWidth: selected ? 2.5 : 0,
          shadowOpacity: selected || hovered ? 0.35 : 0.12,
          elevation: selected || hovered ? 8 : 3,
        },
      ]}
    >
      <Text
        numberOfLines={2}
        style={[styles.stateTileText, !available && { color: '#7A756C' }]}
      >
        {(state as IndianState).name}
      </Text>
      {available ? (
        <View style={styles.stateTileFooter}>
          <View style={styles.seasonDot} />
          <Text style={styles.stateTileSeason}>{(state as IndianState).seasonLabel}</Text>
        </View>
      ) : (
        <Text style={styles.soonText}>Soon</Text>
      )}
    </Pressable>
  );
}

/* ---------------- DistrictTile ---------------- */
export function DistrictTile({
  district,
  selected,
  onPress,
}: {
  district: District;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.districtTile,
        {
          backgroundColor: district.color,
          borderColor: selected ? theme.accent : 'transparent',
          borderWidth: selected ? 2.5 : 0,
          transform: [{ scale: selected ? 1.03 : 1 }],
        },
      ]}
    >
      <Text style={styles.districtName} numberOfLines={1}>{district.name}</Text>
      <Text style={styles.districtCount}>{district.spots.length} spots</Text>
    </Pressable>
  );
}

/* ---------------- SpotCard ---------------- */
export function SpotCard({
  spot,
  onPress,
  theme,
}: {
  spot: Spot;
  onPress: () => void;
  theme: Theme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.spotCard, { backgroundColor: theme.card, ...cardShadow(theme) }]}
    >
      <LinearGradient
        colors={[spot.hotels[0]?.color ?? '#2D6A4F', '#12211C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.spotIconWrap}
      >
        <Ionicons name="location" size={22} color="#FFFFFF" />
      </LinearGradient>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.spotName, { color: theme.text }]} numberOfLines={1}>{spot.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Ionicons name="time-outline" size={12} color={theme.textMuted} />
          <Text style={{ color: theme.textMuted, fontSize: 11, marginLeft: 4 }}>{spot.bestTime}</Text>
        </View>
        <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4 }} numberOfLines={2}>
          {spot.blurb}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="star" size={12} color={theme.gold} />
          <Text style={{ color: theme.text, fontWeight: '700', fontSize: 12, marginLeft: 3 }}>
            {spot.rating.toFixed(1)}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
      </View>
    </Pressable>
  );
}

/* ---------------- HotelCard ---------------- */
export function HotelCard({
  hotel,
  onPress,
  theme,
}: {
  hotel: Hotel;
  onPress: () => void;
  theme: Theme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.hotelCard, { backgroundColor: theme.card, ...cardShadow(theme) }]}
    >
      <LinearGradient
        colors={[hotel.color, '#12211C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hotelImage}
      >
        <Ionicons name={hotel.kind === 'Homestay' ? 'home' : hotel.kind === 'Resort' ? 'leaf' : 'bed'} size={26} color="#FFFFFF" />
        <View style={{ position: 'absolute', top: 8, right: 8 }}>
          <Badge label={hotel.tier} color="#FFFFFF" bg="rgba(0,0,0,0.35)" />
        </View>
      </LinearGradient>
      <View style={{ padding: 12 }}>
        <Text style={{ color: theme.text, fontWeight: '800', fontSize: 14 }} numberOfLines={1}>
          {hotel.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <Ionicons name="star" size={11} color={theme.gold} />
          <Text style={{ color: theme.text, fontWeight: '700', fontSize: 12, marginLeft: 3 }}>
            {hotel.rating.toFixed(1)}
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 11, marginLeft: 5 }}>({hotel.reviews} reviews)</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Ionicons name="pricetag-outline" size={11} color={theme.textMuted} />
          <Text style={{ color: theme.textMuted, fontSize: 11, marginLeft: 4 }}>
            {hotel.kind} · {inr(hotel.price)}/night
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

/* ---------------- PackageCard ---------------- */
export function PackageCard({
  pkg,
  agentName,
  onPress,
  theme,
  fullWidth,
}: {
  pkg: TourPackage;
  agentName: string;
  onPress: () => void;
  theme: Theme;
  fullWidth?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.packageCard,
        fullWidth && { width: '100%', marginRight: 0 },
        { backgroundColor: theme.card, ...cardShadow(theme) },
      ]}
    >
      <LinearGradient
        colors={pkg.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.packageHeader}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }} numberOfLines={2}>
            {pkg.title}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 4 }}>
            {pkg.stateNames.join(' · ')}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 15 }}>{inr(pkg.price)}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10 }}>per person</Text>
        </View>
      </LinearGradient>
      <View style={{ padding: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Ionicons name="calendar-outline" size={12} color={theme.textMuted} />
          <Text style={{ color: theme.textMuted, fontSize: 11, marginLeft: 4 }}>
            {pkg.days}D / {pkg.nights}N
          </Text>
          <Ionicons name="star" size={11} color={theme.gold} style={{ marginLeft: 12 }} />
          <Text style={{ color: theme.text, fontWeight: '700', fontSize: 11, marginLeft: 3 }}>
            {pkg.rating.toFixed(1)}
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 11, marginLeft: 4 }}>({pkg.reviews})</Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {pkg.tags.slice(0, 3).map((t) => (
            <View key={t} style={[styles.tagPill, { backgroundColor: theme.primarySoft }]}>
              <Text style={{ color: theme.primary, fontSize: 10, fontWeight: '700' }}>{t}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <Ionicons name="person-circle-outline" size={14} color={theme.textMuted} />
          <Text style={{ color: theme.textMuted, fontSize: 11, marginLeft: 4 }}>{agentName}</Text>
          <View style={{ flex: 1 }} />
          <Text style={{ color: theme.primary, fontSize: 12, fontWeight: '700' }}>View Package</Text>
          <Ionicons name="arrow-forward" size={12} color={theme.primary} style={{ marginLeft: 4 }} />
        </View>
      </View>
    </Pressable>
  );
}

/* ---------------- VehicleCard ---------------- */
export function VehicleCard({
  vehicle,
  selected,
  onPress,
  theme,
}: {
  vehicle: Vehicle;
  selected: boolean;
  onPress: () => void;
  theme: Theme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.vehicleCard,
        {
          backgroundColor: theme.card,
          borderColor: selected ? theme.primary : theme.border,
          borderWidth: selected ? 2 : 1,
        },
      ]}
    >
      <View style={[styles.vehicleIcon, { backgroundColor: selected ? theme.primary : theme.primarySoft }]}>
        <Ionicons
          name={vehicle.icon as keyof typeof Ionicons.glyphMap}
          size={22}
          color={selected ? theme.onPrimary : theme.primary}
        />
      </View>
      <Text style={{ color: theme.text, fontWeight: '700', fontSize: 13, marginTop: 8 }} numberOfLines={1}>
        {vehicle.name}
      </Text>
      <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>
        {vehicle.seats} seats · {vehicle.category}
      </Text>
      <Text style={{ color: theme.primary, fontWeight: '800', fontSize: 13, marginTop: 6 }}>
        {inr(vehicle.pricePerDay)}/day
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stateTile: {
    borderRadius: radius.md,
    padding: 8,
    minHeight: 74,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  stateTileText: { color: '#FFFFFF', fontWeight: '800', fontSize: 10.5, lineHeight: 13 },
  stateTileFooter: { flexDirection: 'row', alignItems: 'center' },
  seasonDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFE9B8', marginRight: 4 },
  stateTileSeason: { color: 'rgba(255,255,255,0.92)', fontSize: 8.5, fontWeight: '700' },
  soonText: { color: 'rgba(255,255,255,0.75)', fontSize: 9, fontWeight: '700' },
  districtTile: {
    borderRadius: radius.md,
    padding: 12,
    minHeight: 64,
    justifyContent: 'center',
  },
  districtName: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  districtCount: { color: 'rgba(255,255,255,0.85)', fontSize: 10, marginTop: 2 },
  spotCard: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  spotIconWrap: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotName: { fontSize: 14, fontWeight: '800' },
  hotelCard: { width: 150, borderRadius: radius.lg, overflow: 'hidden', marginRight: 10 },
  hotelImage: { height: 84, alignItems: 'center', justifyContent: 'center' },
  packageCard: { width: 250, borderRadius: radius.lg, overflow: 'hidden', marginRight: 12 },
  packageHeader: { padding: 14, flexDirection: 'row', alignItems: 'flex-start' },
  tagPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, marginRight: 6 },
  vehicleCard: { borderRadius: radius.lg, padding: 12, alignItems: 'flex-start' },
  vehicleIcon: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
