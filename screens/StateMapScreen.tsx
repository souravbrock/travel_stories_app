import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, radius, cardShadow } from '../lib/theme';
import { STATES } from '../lib/data';
import { RootStackParamList } from '../lib/nav';
import { DistrictTile, SpotCard } from '../components/cards';
import { Badge, EmptyState } from '../components/ui';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'StateMap'>;

export default function StateMapScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { stateId } = route.params;
  const state = STATES.find((s) => s.id === stateId);
  const [selectedDistrict, setSelectedDistrict] = useState(state?.districts[0].id ?? null);

  const district = state?.districts.find((d) => d.id === selectedDistrict) ?? null;

  if (!state) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center' }}>
        <EmptyState icon="map-outline" title="State not found" message="This state is not yet on our map." theme={theme} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      {/* Header */}
      <LinearGradient colors={[state.color, '#12211C']} style={{ padding: 20, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
          </Pressable>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '800' }}>{state.name}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 }}>{state.tagline}</Text>
          </View>
          <Badge label={`Best: ${state.bestSeason}`} icon="sunny" color="#FFE9B8" bg="rgba(0,0,0,0.25)" />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 14 }}>
          {state.highlights.map((h) => (
            <View key={h} style={{ backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, marginRight: 8 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>{h}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <FlatList
        data={district ? district.spots : []}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        ListHeaderComponent={
          <>
            {/* District grid */}
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800', marginBottom: 4 }}>
              Districts of {state.name}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 12, marginBottom: 14 }}>
              Tap a district to reveal its famous tourist spots
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 }}>
              {state.districts.map((d) => (
                <View key={d.id} style={{ width: '33.33%', padding: 4 }}>
                  <DistrictTile
                    district={d}
                    selected={selectedDistrict === d.id}
                    onPress={() => setSelectedDistrict(d.id)}
                  />
                </View>
              ))}
            </View>

            {/* Spots header */}
            {district ? (
              <View style={{ marginTop: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                      {district.name}
                    </Text>
                    <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                      {district.blurb}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: theme.primarySoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 }}>
                    <Text style={{ color: theme.primary, fontSize: 11, fontWeight: '800' }}>
                      {district.spots.length} spots
                    </Text>
                  </View>
                </View>
                <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 12, marginBottom: 4 }}>
                  Famous tourist spots — tap one for details, distances & stays
                </Text>
              </View>
            ) : null}
          </>
        }
        renderItem={({ item }) => (
          <SpotCard
            spot={item}
            theme={theme}
            onPress={() => navigation.navigate('SpotDetail', { spotId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: theme.textMuted }}>No spots in this district yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
