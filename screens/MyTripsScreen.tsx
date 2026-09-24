import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, radius, cardShadow } from '../lib/theme';
import { useStore } from '../lib/store';
import { RootStackParamList } from '../lib/nav';
import { inr, formatDate } from '../lib/utils';
import { EmptyState } from '../components/ui';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Tab = 'trips' | 'bookings' | 'inquiries';

export default function MyTripsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const { trips, bookings, inquiries, removeTrip, removeBooking, removeInquiry } = useStore();
  const [tab, setTab] = useState<Tab>('trips');

  const tabs: { id: Tab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'trips', label: 'My Trips', icon: 'map' },
    { id: 'bookings', label: 'Bookings', icon: 'ticket' },
    { id: 'inquiries', label: 'Inquiries', icon: 'chatbubbles' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <Text style={{ color: theme.text, fontSize: 24, fontWeight: '800' }}>My Trips</Text>
        <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 4 }}>
          Your custom itineraries, bookings and agent inquiries
        </Text>

        {/* Segmented control */}
        <View style={{ flexDirection: 'row', backgroundColor: theme.cardAlt, borderRadius: radius.pill, padding: 4, marginTop: 16, borderWidth: 1, borderColor: theme.border }}>
          {tabs.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 9,
                borderRadius: radius.pill,
                backgroundColor: tab === t.id ? theme.primary : 'transparent',
              }}
            >
              <Ionicons name={t.icon} size={13} color={tab === t.id ? theme.onPrimary : theme.textMuted} />
              <Text
                style={{
                  color: tab === t.id ? theme.onPrimary : theme.textMuted,
                  fontWeight: '700',
                  fontSize: 12,
                  marginLeft: 5,
                }}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {tab === 'trips' ? (
        <FlatList
          data={trips}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: theme.card, ...cardShadow(theme) }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 42, height: 42, borderRadius: radius.md, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="map" size={20} color={theme.onPrimary} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: theme.text, fontWeight: '800', fontSize: 15 }}>{item.name}</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>
                    {item.origin} → {item.stateName} · {item.days}D / {item.nights}N
                  </Text>
                </View>
                <Pressable onPress={() => removeTrip(item.id)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={18} color={theme.danger} />
                </Pressable>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
                <DetailPill icon="car" text={item.vehicleName} theme={theme} />
                <DetailPill icon="bed" text={`${item.hotelIds.length} stays`} theme={theme} />
                <DetailPill icon="restaurant" text={item.meals.mode === 'tripwide' ? 'Trip-wide meals' : 'Day-by-day meals'} theme={theme} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.border }}>
                <Text style={{ color: theme.textMuted, fontSize: 11 }}>
                  Est. budget <Text style={{ color: theme.primary, fontWeight: '800' }}>{inr(item.budget)}</Text>
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 11 }}>{formatDate(item.createdAt)}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <EmptyState
              icon="map-outline"
              title="No custom trips yet"
              message="Build your own itinerary with the Custom Trip Builder."
              theme={theme}
              actionLabel="Build a Trip"
              onAction={() => navigation.navigate('TripBuilder', {})}
            />
          }
        />
      ) : tab === 'bookings' ? (
        <FlatList
          data={bookings}
          keyExtractor={(b) => b.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: theme.card, ...cardShadow(theme) }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 42, height: 42, borderRadius: radius.md, backgroundColor: item.kind === 'hotel' ? theme.primary : theme.accent, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={item.kind === 'hotel' ? 'bed' : 'briefcase'} size={20} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: theme.text, fontWeight: '800', fontSize: 15 }}>{item.title}</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }} numberOfLines={2}>
                    {item.subtitle}
                  </Text>
                </View>
                <Pressable onPress={() => removeBooking(item.id)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={18} color={theme.danger} />
                </Pressable>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.border }}>
                <View style={{ backgroundColor: theme.primarySoft, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ color: theme.primary, fontSize: 11, fontWeight: '800' }}>{item.status}</Text>
                </View>
                <Text style={{ color: theme.text, fontWeight: '800', fontSize: 14 }}>{inr(item.total)}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <EmptyState
              icon="ticket-outline"
              title="No bookings yet"
              message="Book hotels or agent packages and they'll appear here."
              theme={theme}
            />
          }
        />
      ) : (
        <FlatList
          data={inquiries}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: theme.card, ...cardShadow(theme) }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 42, height: 42, borderRadius: radius.md, backgroundColor: theme.gold, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="chatbubbles" size={20} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: theme.text, fontWeight: '800', fontSize: 15 }}>{item.agentName}</Text>
                  {item.packageTitle ? (
                    <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }} numberOfLines={1}>
                      {item.packageTitle}
                    </Text>
                  ) : null}
                </View>
                <Pressable onPress={() => removeInquiry(item.id)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={18} color={theme.danger} />
                </Pressable>
              </View>
              <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 10, lineHeight: 18 }} numberOfLines={2}>
                {item.message}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.border }}>
                <View style={{ backgroundColor: theme.accentSoft, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ color: theme.accent, fontSize: 11, fontWeight: '800' }}>{item.status}</Text>
                </View>
                <Text style={{ color: theme.textMuted, fontSize: 11 }}>{formatDate(item.dateISO)}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <EmptyState
              icon="chatbubbles-outline"
              title="No inquiries yet"
              message="Message an agent from any package and the conversation will be tracked here."
              theme={theme}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

function DetailPill({ icon, text, theme }: { icon: keyof typeof Ionicons.glyphMap; text: string; theme: ReturnType<typeof useTheme> }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.cardAlt, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, marginRight: 8, marginBottom: 6, borderWidth: 1, borderColor: theme.border }}>
      <Ionicons name={icon} size={11} color={theme.primary} />
      <Text style={{ color: theme.text, fontSize: 11, fontWeight: '600', marginLeft: 5 }} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 14, marginBottom: 12 },
});
