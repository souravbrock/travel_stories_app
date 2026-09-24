import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, radius } from '../lib/theme';
import { findAgent, PACKAGES } from '../lib/data';
import { RootStackParamList } from '../lib/nav';
import { uid } from '../lib/utils';
import { useStore } from '../lib/store';
import { EmptyState } from '../components/ui';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'AgentChat'>;

const REPLIES = [
  'Thanks for reaching out! Happy to help you plan this trip.',
  'Great choice — this is one of our most-loved itineraries.',
  'I can customise the stay tiers (Budget / Deluxe / Luxury) for you.',
  'We can arrange pickup from your city by flight or train — just share your preference.',
  'Meal plans (breakfast, lunch, snacks, dinner) can be added trip-wide or day by day.',
  'For groups we usually recommend a Tempo Traveller or Tata Winger — very comfortable.',
  'Shall I send you a detailed day-wise itinerary with pricing?',
];

function replyFor(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('price') || t.includes('cost') || t.includes('budget')) {
    return 'For a group of 2–4 the per-person price starts at the listed rate; I can share a detailed quote with hotel options once you confirm your dates.';
  }
  if (t.includes('book') || t.includes('confirm')) {
    return 'Wonderful! I will hold the itinerary and send a confirmation link with payment options shortly.';
  }
  if (t.includes('hotel') || t.includes('stay') || t.includes('room')) {
    return 'We partner with verified hotels, resorts and homestays at every stop — Budget, Deluxe and Luxury tiers available.';
  }
  if (t.includes('food') || t.includes('meal') || t.includes('veg') || t.includes('vegan')) {
    return 'Meal plans cover breakfast, lunch, evening snacks and dinner — vegetarian, vegan and Jain options available on request.';
  }
  if (t.includes('flight') || t.includes('train') || t.includes('ticket')) {
    return 'We can assist with inter-city flight and train ticketing — just share your departure city and preferred mode.';
  }
  return REPLIES[Math.floor(Math.random() * REPLIES.length)];
}

export default function AgentChatScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { agentId } = route.params;
  const agent = findAgent(agentId);
  const { chats, sendMessage } = useStore();
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  const messages = chats[agentId] ?? [];

  useEffect(() => {
    if (messages.length === 0) {
      const welcome = {
        id: uid(),
        from: 'agent' as const,
        text: `Namaste! I'm ${agent.name} from ${agent.agency}. Ask me anything about our tours, pricing or stays — or tell me your travel dates and I'll draft a plan.`,
        dateISO: new Date().toISOString(),
      };
      const t = setTimeout(() => sendMessage(agentId, welcome), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    sendMessage(agentId, { id: uid(), from: 'me', text, dateISO: new Date().toISOString() });
    setInput('');
    setTimeout(() => {
      sendMessage(agentId, { id: uid(), from: 'agent', text: replyFor(text), dateISO: new Date().toISOString() });
    }, 1200);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.border, backgroundColor: theme.card }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={20} color={theme.text} />
        </Pressable>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: agent.color, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 14 }}>
            {agent.name.split(' ').map((w) => w[0]).join('')}
          </Text>
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ color: theme.text, fontWeight: '800', fontSize: 15 }}>{agent.agency}</Text>
          <Text style={{ color: theme.textMuted, fontSize: 11 }}>
            {agent.name} · {agent.responseTime} response
          </Text>
        </View>
        {agent.verified ? <Ionicons name="checkmark-circle" size={16} color={theme.success} /> : null}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={listRef}
          inverted
          data={[...messages].reverse()}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => {
            const mine = item.from === 'me';
            return (
              <View
                style={{
                  alignSelf: mine ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  backgroundColor: mine ? theme.primary : theme.card,
                  borderRadius: radius.lg,
                  borderBottomRightRadius: mine ? 4 : radius.lg,
                  borderBottomLeftRadius: mine ? radius.lg : 4,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  marginBottom: 8,
                  borderWidth: mine ? 0 : 1,
                  borderColor: theme.border,
                }}
              >
                <Text style={{ color: mine ? theme.onPrimary : theme.text, fontSize: 14, lineHeight: 20 }}>
                  {item.text}
                </Text>
              </View>
            );
          }}
          ListEmptyComponent={
            <EmptyState icon="chatbubbles-outline" title="Start the conversation" message="Ask about pricing, stays or itinerary tweaks." theme={theme} />
          }
        />

        {/* Input */}
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderTopColor: theme.border, backgroundColor: theme.card }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your message…"
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, backgroundColor: theme.cardAlt, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 10, color: theme.text, fontSize: 14, borderWidth: 1, borderColor: theme.border }}
            returnKeyType="send"
            onSubmitEditing={send}
          />
          <Pressable
            onPress={send}
            style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}
          >
            <Ionicons name="send" size={18} color={theme.onPrimary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
