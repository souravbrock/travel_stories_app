import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, radius, cardShadow } from '../lib/theme';
import { STATES, VEHICLES, MEAL_SLOTS, ORIGIN_CITIES, TRANSIT_MODES, hotelsInState, findHotel } from '../lib/data';
import { RootStackParamList } from '../lib/nav';
import { inr, uid } from '../lib/utils';
import { useStore } from '../lib/store';
import { Chip, EmptyState, PrimaryButton, Stepper } from '../components/ui';
import { VehicleCard } from '../components/cards';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'TripBuilder'>;

const STEP_TITLES = ['Transit & Origin', 'Local Fleet', 'Accommodation', 'Meals', 'Summary'];

export default function TripBuilderScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { addTrip } = useStore();

  const [step, setStep] = useState(0);
  const [origin, setOrigin] = useState('');
  const [stateId, setStateId] = useState(route.params?.stateId ?? '');
  const [transitMode, setTransitMode] = useState('flight');
  const [bookingPref, setBookingPref] = useState('self');
  const [lead, setLead] = useState({ name: '', phone: '', email: '' });
  const [days, setDays] = useState(5);
  const [vehicleId, setVehicleId] = useState('');
  const [tier, setTier] = useState<'All' | 'Budget' | 'Deluxe' | 'Luxury'>('All');
  const [kind, setKind] = useState<'All' | 'Hotel' | 'Resort' | 'Homestay'>('All');
  const [nights, setNights] = useState(3);
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]);
  const [mealsMode, setMealsMode] = useState<'tripwide' | 'daily'>('tripwide');
  const [tripWideMeals, setTripWideMeals] = useState<Record<string, boolean>>({
    breakfast: true,
    lunch: true,
    snacks: false,
    dinner: true,
  });
  const [dailyMeals, setDailyMeals] = useState<Record<string, Record<string, boolean>>>({});
  const [saved, setSaved] = useState(false);

  const state = STATES.find((s) => s.id === stateId);
  const vehicle = VEHICLES.find((v) => v.id === vehicleId);

  const stateHotels = useMemo(
    () => (stateId ? hotelsInState(stateId) : []),
    [stateId]
  );

  const filteredHotels = useMemo(
    () =>
      stateHotels.filter(({ hotel }) => {
        if (tier !== 'All' && hotel.tier !== tier) return false;
        if (kind !== 'All' && hotel.kind !== kind) return false;
        return true;
      }),
    [stateHotels, tier, kind]
  );

  const toggleHotel = (id: string) => {
    setSelectedHotels((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= nights) return prev;
      return [...prev, id];
    });
  };

  const toggleTripWideMeal = (id: string) =>
    setTripWideMeals((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleDailyMeal = (day: number, id: string) =>
    setDailyMeals((prev) => ({
      ...prev,
      [String(day)]: { ...(prev[String(day)] ?? {}), [id]: !(prev[String(day)] ?? {})[id] },
    }));

  /* ---------- validation ---------- */
  const stepValid = (s: number): boolean => {
    switch (s) {
      case 0:
        if (!origin.trim() || !stateId) return false;
        if (bookingPref === 'platform' && (!lead.name.trim() || !lead.phone.trim())) return false;
        return true;
      case 1:
        return !!vehicleId;
      case 2:
        return selectedHotels.length > 0;
      case 3: {
        if (mealsMode === 'tripwide') return Object.values(tripWideMeals).some(Boolean);
        return Object.values(dailyMeals).some((d) => Object.values(d).some(Boolean));
      }
      default:
        return true;
    }
  };

  /* ---------- pricing ---------- */
  const pricing = useMemo(() => {
    const fleet = vehicle ? vehicle.pricePerDay * days : 0;
    const nightsPerHotel = selectedHotels.length > 0 ? Math.ceil(nights / selectedHotels.length) : 0;
    const hotels = selectedHotels.reduce((sum, id) => {
      const found = findHotel(id);
      return sum + (found ? found.hotel.price * nightsPerHotel : 0);
    }, 0);
    const enabledSlots =
      mealsMode === 'tripwide'
        ? MEAL_SLOTS.filter((m) => tripWideMeals[m.id])
        : MEAL_SLOTS.filter((m) =>
            Object.values(dailyMeals).some((d) => d[m.id])
          );
    const meals =
      mealsMode === 'tripwide'
        ? enabledSlots.reduce((s, m) => s + m.price, 0) * days
        : enabledSlots.reduce((s, m) => s + m.price, 0) * days;
    const transit =
      transitMode === 'flight' ? 4500 : transitMode === 'train' ? 1800 : 3000;
    return { fleet, hotels, meals, transit, total: fleet + hotels + meals + transit };
  }, [vehicle, days, selectedHotels, nights, mealsMode, tripWideMeals, dailyMeals, transitMode]);

  const save = () => {
    addTrip({
      id: uid(),
      name: `${state?.name ?? 'Custom'} Escape`,
      createdAt: new Date().toISOString(),
      origin: origin.trim(),
      stateId,
      stateName: state?.name ?? '',
      transitMode,
      bookingPref,
      lead: bookingPref === 'platform' ? lead : undefined,
      vehicleId,
      vehicleName: vehicle?.name ?? '',
      hotelIds: selectedHotels,
      hotelNames: selectedHotels.map((id) => findHotel(id)?.hotel.name ?? ''),
      days,
      nights,
      meals: {
        mode: mealsMode,
        tripWide: tripWideMeals,
        days: dailyMeals,
      },
      budget: pricing.total,
    });
    setSaved(true);
  };

  const next = () => {
    if (step < 4 && stepValid(step)) setStep(step + 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.label, { color: theme.text }]}>Departure City</Text>
            <TextInput
              value={origin}
              onChangeText={setOrigin}
              placeholder="e.g. Delhi, Mumbai, Bengaluru…"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
              returnKeyType="done"
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
              {ORIGIN_CITIES.map((c) => (
                <Chip key={c} label={c} active={origin === c} onPress={() => setOrigin(c)} theme={theme} small />
              ))}
            </View>

            <Text style={[styles.label, { color: theme.text, marginTop: 18 }]}>Destination State</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {STATES.map((s) => (
                <Chip key={s.id} label={s.name} active={stateId === s.id} onPress={() => setStateId(s.id)} theme={theme} small />
              ))}
            </View>

            <Text style={[styles.label, { color: theme.text, marginTop: 18 }]}>Inter-City Transit Mode</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {TRANSIT_MODES.map((m) => (
                <Chip key={m.id} label={m.label} icon={m.icon as keyof typeof Ionicons.glyphMap} active={transitMode === m.id} onPress={() => setTransitMode(m.id)} theme={theme} />
              ))}
            </View>

            <Text style={[styles.label, { color: theme.text, marginTop: 18 }]}>Trip Duration</Text>
            <Stepper label="Days" value={days} onChange={setDays} min={2} max={14} theme={theme} />

            <Text style={[styles.label, { color: theme.text, marginTop: 18 }]}>Flight / Train Ticket Booking</Text>
            <View style={{ flexDirection: 'row' }}>
              <PrefCard
                label="I'll self-book"
                desc="Handle your own inter-city tickets"
                active={bookingPref === 'self'}
                onPress={() => setBookingPref('self')}
                theme={theme}
              />
              <View style={{ width: 10 }} />
              <PrefCard
                label="Platform managed"
                desc="We book your tickets — share lead details"
                active={bookingPref === 'platform'}
                onPress={() => setBookingPref('platform')}
                theme={theme}
              />
            </View>

            {bookingPref === 'platform' ? (
              <View style={{ marginTop: 14 }}>
                <TextInput
                  value={lead.name}
                  onChangeText={(v) => setLead({ ...lead, name: v })}
                  placeholder="Full name"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                />
                <TextInput
                  value={lead.phone}
                  onChangeText={(v) => setLead({ ...lead, phone: v })}
                  placeholder="Mobile number"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="phone-pad"
                  style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border, marginTop: 10 }]}
                />
                <TextInput
                  value={lead.email}
                  onChangeText={(v) => setLead({ ...lead, email: v })}
                  placeholder="Email (optional)"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="email-address"
                  style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border, marginTop: 10 }]}
                />
              </View>
            ) : null}
          </ScrollView>
        );
      case 1:
        return (
          <FlatList
            data={VEHICLES}
            keyExtractor={(v) => v.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{ width: '48.5%', marginBottom: 12 }}>
                <VehicleCard vehicle={item} selected={vehicleId === item.id} onPress={() => setVehicleId(item.id)} theme={theme} />
              </View>
            )}
            ListHeaderComponent={
              <Text style={{ color: theme.textMuted, fontSize: 12, marginBottom: 12 }}>
                Select your local fleet for the duration of the trip. Prices are per day.
              </Text>
            }
          />
        );
      case 2:
        return (
          <FlatList
            data={filteredHotels}
            keyExtractor={(x) => x.hotel.id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View>
                <Text style={{ color: theme.textMuted, fontSize: 12, marginBottom: 12 }}>
                  Filter stays in {state?.name} and assign them across {nights} night{nights > 1 ? 's' : ''}. Select up to {nights} properties.
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {(['All', 'Budget', 'Deluxe', 'Luxury'] as const).map((t) => (
                    <Chip key={t} label={t} active={tier === t} onPress={() => setTier(t)} theme={theme} small />
                  ))}
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {(['All', 'Hotel', 'Resort', 'Homestay'] as const).map((k) => (
                    <Chip key={k} label={k} active={kind === k} onPress={() => setKind(k)} theme={theme} small />
                  ))}
                </View>
                <Stepper label="Nights" value={nights} onChange={setNights} min={1} max={14} theme={theme} />
                <View style={{ height: 14 }} />
              </View>
            }
            renderItem={({ item }) => {
              const selected = selectedHotels.includes(item.hotel.id);
              return (
                <Pressable
                  onPress={() => toggleHotel(item.hotel.id)}
                  style={[
                    styles.hotelRow,
                    {
                      backgroundColor: theme.card,
                      borderColor: selected ? theme.primary : theme.border,
                      borderWidth: selected ? 2 : 1,
                      ...cardShadow(theme),
                    },
                  ]}
                >
                  <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: item.hotel.color, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={item.hotel.kind === 'Homestay' ? 'home' : item.hotel.kind === 'Resort' ? 'leaf' : 'bed'} size={20} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ color: theme.text, fontWeight: '700', fontSize: 13 }} numberOfLines={1}>
                      {item.hotel.name}
                    </Text>
                    <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }} numberOfLines={1}>
                      {item.spot.name} · {item.hotel.tier} {item.hotel.kind}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: theme.primary, fontWeight: '800', fontSize: 13 }}>
                      {inr(item.hotel.price)}
                    </Text>
                    <Text style={{ color: theme.textMuted, fontSize: 10 }}>/night</Text>
                  </View>
                  <Ionicons
                    name={selected ? 'checkmark-circle' : 'add-circle-outline'}
                    size={22}
                    color={selected ? theme.primary : theme.textMuted}
                    style={{ marginLeft: 10 }}
                  />
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <EmptyState icon="bed-outline" title="No stays match" message="Try widening the tier or property-type filters." theme={theme} />
            }
          />
        );
      case 3:
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.label, { color: theme.text }]}>Meal Planning Mode</Text>
            <View style={{ flexDirection: 'row' }}>
              <PrefCard
                label="Trip-wide"
                desc="Same meal plan for all days"
                active={mealsMode === 'tripwide'}
                onPress={() => setMealsMode('tripwide')}
                theme={theme}
              />
              <View style={{ width: 10 }} />
              <PrefCard
                label="Day-by-day"
                desc="Granular control per day"
                active={mealsMode === 'daily'}
                onPress={() => setMealsMode('daily')}
                theme={theme}
              />
            </View>

            {mealsMode === 'tripwide' ? (
              <View style={{ marginTop: 20 }}>
                <Text style={[styles.label, { color: theme.text }]}>Include these meals every day</Text>
                {MEAL_SLOTS.map((m) => {
                  const on = tripWideMeals[m.id];
                  return (
                    <Pressable
                      key={m.id}
                      onPress={() => toggleTripWideMeal(m.id)}
                      style={[styles.mealRow, { backgroundColor: theme.card, borderColor: on ? theme.primary : theme.border, borderWidth: on ? 2 : 1 }]}
                    >
                      <Ionicons name={m.icon as keyof typeof Ionicons.glyphMap} size={18} color={on ? theme.primary : theme.textMuted} />
                      <Text style={{ color: theme.text, fontWeight: '700', fontSize: 14, marginLeft: 12, flex: 1 }}>
                        {m.label}
                      </Text>
                      <Text style={{ color: theme.textMuted, fontSize: 12 }}>{inr(m.price)}/person-day</Text>
                      <Ionicons name={on ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={on ? theme.primary : theme.textMuted} style={{ marginLeft: 10 }} />
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <View style={{ marginTop: 20 }}>
                <Text style={[styles.label, { color: theme.text }]}>Configure each day</Text>
                {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
                  <View key={d} style={{ marginBottom: 14 }}>
                    <Text style={{ color: theme.text, fontWeight: '800', fontSize: 13, marginBottom: 8 }}>
                      Day {d}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {MEAL_SLOTS.map((m) => {
                        const on = dailyMeals[String(d)]?.[m.id];
                        return (
                          <Chip
                            key={m.id}
                            label={m.label}
                            icon={m.icon as keyof typeof Ionicons.glyphMap}
                            active={!!on}
                            onPress={() => toggleDailyMeal(d, m.id)}
                            theme={theme}
                            small
                          />
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        );
      case 4:
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <SummaryRow label="Origin" value={origin} theme={theme} />
            <SummaryRow label="Destination" value={state?.name ?? ''} theme={theme} />
            <SummaryRow label="Transit" value={`${TRANSIT_MODES.find((m) => m.id === transitMode)?.label} · ${days} days`} theme={theme} />
            <SummaryRow label="Ticket booking" value={bookingPref === 'self' ? 'Self-booked' : 'Platform managed'} theme={theme} />
            {bookingPref === 'platform' ? (
              <SummaryRow label="Lead" value={`${lead.name} · ${lead.phone}`} theme={theme} />
            ) : null}
            <SummaryRow label="Fleet" value={vehicle?.name ?? ''} theme={theme} />
            <SummaryRow label="Stays" value={`${selectedHotels.length} propert${selectedHotels.length === 1 ? 'y' : 'ies'} · ${nights} nights`} theme={theme} />
            <SummaryRow
              label="Meals"
              value={
                mealsMode === 'tripwide'
                  ? MEAL_SLOTS.filter((m) => tripWideMeals[m.id]).map((m) => m.label).join(', ') || 'None'
                  : 'Day-by-day plan'
              }
              theme={theme}
            />

            <Text style={[styles.label, { color: theme.text, marginTop: 20 }]}>Estimated Budget</Text>
            <View style={{ backgroundColor: theme.card, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: theme.border }}>
              <BudgetRow label={`Fleet (${vehicle?.name ?? ''} × ${days} days)`} value={pricing.fleet} theme={theme} />
              <BudgetRow label={`Stays (${nights} nights)`} value={pricing.hotels} theme={theme} />
              <BudgetRow label="Meals" value={pricing.meals} theme={theme} />
              <BudgetRow label="Transit estimate" value={pricing.transit} theme={theme} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.border }}>
                <Text style={{ color: theme.text, fontWeight: '800', fontSize: 15 }}>Total estimate</Text>
                <Text style={{ color: theme.primary, fontWeight: '800', fontSize: 17 }}>{inr(pricing.total)}</Text>
              </View>
              <Text style={{ color: theme.textMuted, fontSize: 10, marginTop: 8 }}>
                Estimate for 1 traveller. Final pricing confirmed by your agent after inquiry.
              </Text>
            </View>
          </ScrollView>
        );
    }
  };

  if (saved) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: theme.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="checkmark" size={36} color={theme.primary} />
        </View>
        <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', marginTop: 18 }}>Trip Saved!</Text>
        <Text style={{ color: theme.textMuted, fontSize: 13, textAlign: 'center', marginTop: 8 }}>
          Your custom {state?.name} itinerary is saved in My Trips.
        </Text>
        <Pressable
          onPress={() => navigation.navigate('Main', { screen: 'Trips' })}
          style={{ backgroundColor: theme.primary, borderRadius: radius.pill, paddingVertical: 14, paddingHorizontal: 32, marginTop: 24 }}
        >
          <Text style={{ color: theme.onPrimary, fontWeight: '800' }}>View My Trips</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="close" size={24} color={theme.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>Custom Trip Builder</Text>
          <Text style={{ color: theme.textMuted, fontSize: 11 }}>Step {step + 1} of 5 · {STEP_TITLES[step]}</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: 12 }}>
        {STEP_TITLES.map((t, i) => (
          <View key={t} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= step ? theme.primary : theme.border, marginRight: i < STEP_TITLES.length - 1 ? 4 : 0 }} />
        ))}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }}>{renderStep()}</View>

        {/* Footer */}
        <View style={{ flexDirection: 'row', padding: 20, borderTopWidth: 1, borderTopColor: theme.border, backgroundColor: theme.card }}>
          {step > 0 ? (
            <Pressable onPress={() => setStep(step - 1)} style={{ paddingVertical: 14, paddingHorizontal: 20, marginRight: 12 }}>
              <Text style={{ color: theme.textMuted, fontWeight: '700' }}>Back</Text>
            </Pressable>
          ) : null}
          <View style={{ flex: 1 }}>
            {step < 4 ? (
              <PrimaryButton
                label="Continue"
                icon="arrow-forward"
                theme={theme}
                disabled={!stepValid(step)}
                onPress={next}
              />
            ) : (
              <PrimaryButton label="Save Trip" icon="checkmark" theme={theme} onPress={save} />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function PrefCard({
  label,
  desc,
  active,
  onPress,
  theme,
}: {
  label: string;
  desc: string;
  active: boolean;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        borderRadius: radius.md,
        borderWidth: active ? 2 : 1,
        borderColor: active ? theme.primary : theme.border,
        backgroundColor: active ? theme.primarySoft : theme.card,
        padding: 12,
      }}
    >
      <Text style={{ color: theme.text, fontWeight: '800', fontSize: 13 }}>{label}</Text>
      <Text style={{ color: theme.textMuted, fontSize: 10.5, marginTop: 3 }}>{desc}</Text>
    </Pressable>
  );
}

function SummaryRow({ label, value, theme }: { label: string; value: string; theme: ReturnType<typeof useTheme> }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.border }}>
      <Text style={{ color: theme.textMuted, fontSize: 13 }}>{label}</Text>
      <Text style={{ color: theme.text, fontWeight: '700', fontSize: 13, flex: 1, textAlign: 'right' }} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

function BudgetRow({ label, value, theme }: { label: string; value: number; theme: ReturnType<typeof useTheme> }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <Text style={{ color: theme.textMuted, fontSize: 13 }}>{label}</Text>
      <Text style={{ color: theme.text, fontWeight: '700', fontSize: 13 }}>{inr(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '800', marginBottom: 10, letterSpacing: 0.3 },
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  hotelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 10,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 10,
  },
});
