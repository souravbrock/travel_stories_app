import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, radius, cardShadow } from '../lib/theme';
import { PACKAGES, findAgent } from '../lib/data';
import { RootStackParamList } from '../lib/nav';
import { PackageCard } from '../components/cards';
import { Chip, EmptyState } from '../components/ui';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FILTERS = ['All', 'Beach', 'Heritage', 'Hills', 'Wildlife', 'Adventure', 'Budget', 'Luxury', 'Family', 'Temples'];

export default function PackagesScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const data = useMemo(() => {
    return PACKAGES.filter((p) => {
      const matchesFilter =
        filter === 'All' ||
        p.tags.some((t) => t.toLowerCase() === filter.toLowerCase()) ||
        (filter === 'Budget' && p.price < 16000) ||
        (filter === 'Luxury' && p.tags.includes('Luxury'));
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.stateNames.join(' ').toLowerCase().includes(q) ||
        findAgent(p.agentId).agency.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <FlatList
        data={data}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        ListHeaderComponent={
          <>
            <Text style={{ color: theme.text, fontSize: 24, fontWeight: '800' }}>Agent Marketplace</Text>
            <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 4 }}>
              Ready-made tour packages from verified travel agents across India
            </Text>

            {/* Search */}
            <View style={[styles.searchBar, { backgroundColor: theme.card, ...cardShadow(theme) }]}>
              <Ionicons name="search" size={18} color={theme.textMuted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search packages, states, agents…"
                placeholderTextColor={theme.textMuted}
                style={{ flex: 1, marginLeft: 10, color: theme.text, fontSize: 14, padding: 0 }}
                returnKeyType="search"
              />
              {query ? (
                <Pressable onPress={() => setQuery('')} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color={theme.textMuted} />
                </Pressable>
              ) : null}
            </View>

            {/* Filters */}
            <FlatList
              horizontal
              data={FILTERS}
              keyExtractor={(f) => f}
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 4, marginBottom: 8 }}
              renderItem={({ item }) => (
                <Chip label={item} active={filter === item} onPress={() => setFilter(item)} theme={theme} small />
              )}
            />

            <Text style={{ color: theme.textMuted, fontSize: 12, marginBottom: 12 }}>
              {data.length} package{data.length === 1 ? '' : 's'} · prices per person
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={{ marginBottom: 14 }}>
            <PackageCard
              pkg={item}
              agentName={findAgent(item.agentId).agency}
              onPress={() => navigation.navigate('PackageDetail', { packageId: item.id })}
              theme={theme}
              fullWidth
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="briefcase-outline"
            title="No packages found"
            message="Try a different search term or filter."
            theme={theme}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 12,
  },
});
