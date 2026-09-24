import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, radius, cardShadow } from '../lib/theme';
import { PACKAGES, findAgent } from '../lib/data';
import { RootStackParamList } from '../lib/nav';
import { inr, uid } from '../lib/utils';
import { useStore } from '../lib/store';
import { Badge, EmptyState, PrimaryButton, Stars, Stepper } from '../components/ui';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'PackageDetail'>;

export default function PackageDetailScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { addBooking, addInquiry } = useStore();
  const pkg = PACKAGES.find((p) => p.id === route.params.packageId);
  const [travelers, setTravelers] = useState(2);
  const [booking, setBooking] = useState(false);
  const [done, setDone] = useState(false);

  if (!pkg) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center' }}>
        <EmptyState icon="briefcase-outline" title="Package not found" message="This tour package could not be located." theme={theme} />
      </SafeAreaView>
    );
  }

  const agent = findAgent(pkg.agentId);
  const total = pkg.price * travelers;

  const messageAgent = () => {
    addInquiry({
      id: uid(),
      agentId: agent.id,
      agentName: agent.agency,
      packageId: pkg.id,
      packageTitle: pkg.title,
      message: `Hi ${agent.name}, I'm interested in "${pkg.title}". Could you share more details and availability?`,
      dateISO: new Date().toISOString(),
      status: 'Sent',
    });
    navigation.navigate('AgentChat', { agentId: agent.id });
  };

  const confirm = () => {
    addBooking({
      id: uid(),
      kind: 'package',
      title: pkg.title,
      subtitle: `${pkg.days}D / ${pkg.nights}N · ${travelers} traveler${travelers > 1 ? 's' : ''} · by ${agent.agency}`,
      dateISO: new Date().toISOString(),
      guests: travelers,
      total,
      status: 'Confirmed',
    });
    addInquiry({
      id: uid(),
      agentId: agent.id,
      agentName: agent.agency,
      packageId: pkg.id,
      packageTitle: pkg.title,
      message: `Booking confirmed for "${pkg.title}" — ${travelers} traveler(s), ${inr(total)}.`,
      dateISO: new Date().toISOString(),
      status: 'Booked',
    });
    setBooking(false);
    setDone(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <FlatList
        data={pkg.itinerary}
        keyExtractor={(d) => String(d.d)}
        contentContainerStyle={{ paddingBottom: 140 }}
        ListHeaderComponent={
          <>
            {/* Hero */}
            <LinearGradient colors={pkg.gradient} style={{ padding: 20, paddingBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Pressable
                  onPress={() => navigation.goBack()}
                  style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
                </Pressable>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '800' }}>{pkg.title}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 }}>
                    {pkg.stateNames.join(' · ')}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 14 }}>
                <Badge label={`${pkg.days}D / ${pkg.nights}N`} icon="calendar" color="#FFFFFF" bg="rgba(255,255,255,0.2)" />
                <View style={{ width: 8 }} />
                <Badge label={pkg.groupSize} icon="people" color="#FFFFFF" bg="rgba(255,255,255,0.2)" />
                <View style={{ width: 8 }} />
                <Badge label={`${inr(pkg.price)} / person`} icon="pricetag" color="#FFE9B8" bg="rgba(0,0,0,0.25)" />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
                <Stars rating={pkg.rating} theme={theme} />
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 14, marginLeft: 8 }}>
                  {pkg.rating.toFixed(1)}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginLeft: 6 }}>
                  ({pkg.reviews} reviews)
                </Text>
              </View>
            </LinearGradient>

            {/* Agent card */}
            <Pressable
              onPress={() => navigation.navigate('AgentChat', { agentId: agent.id })}
              style={[styles.agentCard, { backgroundColor: theme.card, ...cardShadow(theme) }]}
            >
              <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: agent.color, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>
                  {agent.name.split(' ').map((w) => w[0]).join('')}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: theme.text, fontWeight: '800', fontSize: 14 }}>{agent.agency}</Text>
                  {agent.verified ? (
                    <Ionicons name="checkmark-circle" size={14} color={theme.success} style={{ marginLeft: 6 }} />
                  ) : null}
                </View>
                <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>
                  {agent.name} · {agent.responseTime} response · {agent.trips} trips
                </Text>
              </View>
              <View style={{ backgroundColor: theme.primarySoft, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7 }}>
                <Text style={{ color: theme.primary, fontSize: 11, fontWeight: '800' }}>Message</Text>
              </View>
            </Pressable>

            {/* Includes */}
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800', marginBottom: 10 }}>
                Package Includes
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {pkg.includes.map((inc) => (
                  <View key={inc} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.cardAlt, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: theme.border }}>
                    <Ionicons name="checkmark-circle" size={13} color={theme.success} style={{ marginRight: 6 }} />
                    <Text style={{ color: theme.text, fontSize: 12, fontWeight: '600' }}>{inc}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Itinerary header */}
            <View style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 4 }}>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                Day-by-Day Itinerary
              </Text>
            </View>
          </>
        }
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16 }}>
            <View style={{ alignItems: 'center', width: 36 }}>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: theme.onPrimary, fontWeight: '800', fontSize: 12 }}>{item.d}</Text>
              </View>
              {index < pkg.itinerary.length - 1 ? (
                <View style={{ width: 2, flex: 1, backgroundColor: theme.border, marginTop: 4 }} />
              ) : null}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: theme.text, fontWeight: '800', fontSize: 14 }}>{item.title}</Text>
              <Text style={{ color: theme.textMuted, fontSize: 12, lineHeight: 18, marginTop: 4 }}>
                {item.desc}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontWeight: '800', fontSize: 18 }}>{inr(pkg.price)}</Text>
          <Text style={{ color: theme.textMuted, fontSize: 11 }}>per person · {pkg.days}D / {pkg.nights}N</Text>
        </View>
        <Pressable onPress={messageAgent} style={[styles.msgBtn, { borderColor: theme.primary }]}>
          <Ionicons name="chatbubble-ellipses" size={16} color={theme.primary} />
        </Pressable>
        <Pressable onPress={() => setBooking(true)} style={[styles.bookBtn, { backgroundColor: theme.primary }]}>
          <Text style={{ color: theme.onPrimary, fontWeight: '800', fontSize: 15 }}>Book Now</Text>
        </Pressable>
      </View>

      {/* Booking modal */}
      <Modal visible={booking} transparent animationType="slide" onRequestClose={() => setBooking(false)}>
        <View style={{ flex: 1, backgroundColor: theme.overlay, justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: theme.card, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: 24, paddingBottom: 40 }}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>Book {pkg.title}</Text>
            <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4 }}>
              {pkg.days} days · {pkg.nights} nights · {inr(pkg.price)} per person
            </Text>
            <View style={{ marginTop: 20 }}>
              <Stepper label="Travelers" value={travelers} onChange={setTravelers} min={1} max={16} theme={theme} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.border }}>
              <Text style={{ color: theme.textMuted, fontSize: 13 }}>
                {inr(pkg.price)} × {travelers} traveler{travelers > 1 ? 's' : ''}
              </Text>
              <Text style={{ color: theme.text, fontWeight: '800', fontSize: 18 }}>{inr(total)}</Text>
            </View>
            <Pressable onPress={confirm} style={[styles.bookBtn, { backgroundColor: theme.primary, marginTop: 20, alignSelf: 'stretch' }]}>
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
              {pkg.title}{'\n'}{travelers} traveler{travelers > 1 ? 's' : ''} · {inr(total)}{'\n'}{agent.agency} will reach out shortly.
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
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    padding: 14,
    marginHorizontal: 20,
    marginTop: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  msgBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bookBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
