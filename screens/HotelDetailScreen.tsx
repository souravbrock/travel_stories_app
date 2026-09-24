import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, radius, cardShadow } from '../lib/theme';
import { findHotel } from '../lib/data';
import { RootStackParamList } from '../lib/nav';
import { inr, uid } from '../lib/utils';
import { useStore } from '../lib/store';
import { Badge, Chip, EmptyState, PrimaryButton, Stars, Stepper } from '../components/ui';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'HotelDetail'>;

export default function HotelDetailScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { addBooking, favorites, toggleFavorite } = useStore();
  const found = findHotel(route.params.hotelId);

  const [roomIdx, setRoomIdx] = useState(0);
  const [nights, setNights] = useState(2);
  const [guests, setGuests] = useState(2);
  const [booking, setBooking] = useState(false);
  const [done, setDone] = useState(false);

  if (!found) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center' }}>
        <EmptyState icon="bed-outline" title="Property not found" message="This stay could not be located." theme={theme} />
      </SafeAreaView>
    );
  }

  const { hotel, spot, district, state } = found;
  const fav = favorites.includes(hotel.id);
  const room = hotel.rooms[roomIdx];
  const total = room.price * nights;

  const confirm = () => {
    addBooking({
      id: uid(),
      kind: 'hotel',
      title: hotel.name,
      subtitle: `${room.name} · ${spot.name}, ${district.name} · ${nights} night${nights > 1 ? 's' : ''} · ${guests} guest${guests > 1 ? 's' : ''}`,
      dateISO: new Date().toISOString(),
      nights,
      guests,
      total,
      status: 'Confirmed',
    });
    setBooking(false);
    setDone(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <FlatList
        data={hotel.reviewsList}
        keyExtractor={(r, i) => `${r.name}-${i}`}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={
          <>
            {/* Hero */}
            <LinearGradient colors={[hotel.color, '#12211C']} style={{ padding: 20, paddingBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Pressable
                  onPress={() => navigation.goBack()}
                  style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
                </Pressable>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '800' }}>{hotel.name}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 }}>
                    {spot.name} · {district.name}, {state.name}
                  </Text>
                </View>
                <Pressable
                  onPress={() => toggleFavorite(hotel.id)}
                  style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Ionicons name={fav ? 'heart' : 'heart-outline'} size={18} color={fav ? '#FF6B6B' : '#FFFFFF'} />
                </Pressable>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 14 }}>
                <Badge label={hotel.tier} color="#FFE9B8" bg="rgba(0,0,0,0.25)" />
                <View style={{ width: 8 }} />
                <Badge label={hotel.kind} icon={hotel.kind === 'Homestay' ? 'home' : hotel.kind === 'Resort' ? 'leaf' : 'bed'} color="#FFFFFF" bg="rgba(255,255,255,0.18)" />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
                <Stars rating={hotel.rating} theme={theme} />
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 14, marginLeft: 8 }}>
                  {hotel.rating.toFixed(1)}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginLeft: 6 }}>
                  ({hotel.reviews} reviews)
                </Text>
              </View>
            </LinearGradient>

            {/* Amenities */}
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800', marginBottom: 10 }}>
                Amenities
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {hotel.amenities.map((a) => (
                  <View key={a} style={{ backgroundColor: theme.cardAlt, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: theme.border }}>
                    <Text style={{ color: theme.text, fontSize: 12, fontWeight: '600' }}>{a}</Text>
                  </View>
                ))}
              </View>
              <Text style={{ color: theme.textMuted, fontSize: 13, lineHeight: 20, marginTop: 8 }}>
                {hotel.blurb}
              </Text>
            </View>

            {/* Rooms */}
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800', marginBottom: 10 }}>
                Rooms & Pricing
              </Text>
              {hotel.rooms.map((r, i) => (
                <Pressable
                  key={r.name}
                  onPress={() => setRoomIdx(i)}
                  style={[
                    styles.roomCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: roomIdx === i ? theme.primary : theme.border,
                      borderWidth: roomIdx === i ? 2 : 1,
                      ...cardShadow(theme),
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontWeight: '800', fontSize: 14 }}>{r.name}</Text>
                    <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 3 }}>
                      Sleeps {r.sleeps} · {r.perks.join(' · ')}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: theme.primary, fontWeight: '800', fontSize: 15 }}>{inr(r.price)}</Text>
                    <Text style={{ color: theme.textMuted, fontSize: 10 }}>per night</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Reviews header */}
            <View style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 4 }}>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                Guest Reviews
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={[styles.reviewCard, { backgroundColor: theme.card, ...cardShadow(theme) }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: theme.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: theme.primary, fontWeight: '800', fontSize: 13 }}>
                  {item.name.split(' ').map((w) => w[0]).join('')}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ color: theme.text, fontWeight: '700', fontSize: 13 }}>{item.name}</Text>
                <Text style={{ color: theme.textMuted, fontSize: 10 }}>{item.date}</Text>
              </View>
              <Stars rating={item.rating} size={11} theme={theme} />
            </View>
            <Text style={{ color: theme.text, fontSize: 13, lineHeight: 19, marginTop: 10 }}>
              {item.text}
            </Text>
          </View>
        )}
      />

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontWeight: '800', fontSize: 18 }}>{inr(hotel.price)}</Text>
          <Text style={{ color: theme.textMuted, fontSize: 11 }}>per night · {hotel.kind}</Text>
        </View>
        <Pressable
          onPress={() => setBooking(true)}
          style={[styles.bookBtn, { backgroundColor: theme.primary }]}
        >
          <Text style={{ color: theme.onPrimary, fontWeight: '800', fontSize: 15 }}>Book Now</Text>
        </Pressable>
      </View>

      {/* Booking modal */}
      <Modal visible={booking} transparent animationType="slide" onRequestClose={() => setBooking(false)}>
        <View style={{ flex: 1, backgroundColor: theme.overlay, justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: theme.card, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: 24, paddingBottom: 40 }}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>Book {hotel.name}</Text>
            <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4 }}>{room.name} · Sleeps {room.sleeps}</Text>

            <View style={{ marginTop: 20 }}>
              <Stepper label="Nights" value={nights} onChange={setNights} min={1} max={14} theme={theme} />
              <View style={{ height: 14 }} />
              <Stepper label="Guests" value={guests} onChange={setGuests} min={1} max={room.sleeps} theme={theme} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.border }}>
              <Text style={{ color: theme.textMuted, fontSize: 13 }}>
                {inr(room.price)} × {nights} night{nights > 1 ? 's' : ''}
              </Text>
              <Text style={{ color: theme.text, fontWeight: '800', fontSize: 18 }}>{inr(total)}</Text>
            </View>

            <Pressable onPress={confirm} style={[styles.bookBtn, { backgroundColor: theme.primary, marginTop: 20 }]}>
              <Text style={{ color: theme.onPrimary, fontWeight: '800', fontSize: 15 }}>Confirm Booking</Text>
            </Pressable>
            <Pressable onPress={() => setBooking(false)} style={{ alignItems: 'center', marginTop: 14 }}>
              <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: '600' }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Success modal */}
      <Modal visible={done} transparent animationType="fade" onRequestClose={() => { setDone(false); navigation.goBack(); }}>
        <View style={{ flex: 1, backgroundColor: theme.overlay, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <View style={{ backgroundColor: theme.card, borderRadius: radius.xl, padding: 28, alignItems: 'center', width: '100%' }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: theme.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="checkmark" size={32} color={theme.primary} />
            </View>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', marginTop: 16 }}>Booking Confirmed!</Text>
            <Text style={{ color: theme.textMuted, fontSize: 13, textAlign: 'center', marginTop: 8 }}>
              {hotel.name} · {room.name}{'\n'}{nights} night{nights > 1 ? 's' : ''} · {guests} guest{guests > 1 ? 's' : ''} · {inr(total)}
            </Text>
            <Pressable
              onPress={() => { setDone(false); navigation.goBack(); }}
              style={[styles.bookBtn, { backgroundColor: theme.primary, marginTop: 24, alignSelf: 'stretch' }]}
            >
              <Text style={{ color: theme.onPrimary, fontWeight: '800', fontSize: 15 }}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  roomCard: { borderRadius: radius.md, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  reviewCard: { borderRadius: radius.md, padding: 14, marginHorizontal: 20, marginBottom: 10 },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  bookBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
