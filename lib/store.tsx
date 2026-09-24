import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, ChatMessage, Inquiry, SavedTrip } from './types';

const STORAGE_KEY = 'travelstories.store.v1';

interface StoreShape {
  bookings: Booking[];
  trips: SavedTrip[];
  inquiries: Inquiry[];
  chats: Record<string, ChatMessage[]>;
  favorites: string[];
  hydrated: boolean;
  addBooking: (b: Booking) => void;
  removeBooking: (id: string) => void;
  addTrip: (t: SavedTrip) => void;
  removeTrip: (id: string) => void;
  addInquiry: (i: Inquiry) => void;
  removeInquiry: (id: string) => void;
  sendMessage: (agentId: string, msg: ChatMessage) => void;
  toggleFavorite: (hotelId: string) => void;
}

const StoreContext = createContext<StoreShape | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          setBookings(data.bookings ?? []);
          setTrips(data.trips ?? []);
          setInquiries(data.inquiries ?? []);
          setChats(data.chats ?? {});
          setFavorites(data.favorites ?? []);
        }
      } catch (e) {
        // ignore corrupt storage
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload = JSON.stringify({ bookings, trips, inquiries, chats, favorites });
    AsyncStorage.setItem(STORAGE_KEY, payload).catch(() => {});
  }, [bookings, trips, inquiries, chats, favorites, hydrated]);

  const value = useMemo<StoreShape>(
    () => ({
      bookings,
      trips,
      inquiries,
      chats,
      favorites,
      hydrated,
      addBooking: (b) => setBookings((prev) => [b, ...prev]),
      removeBooking: (id) => setBookings((prev) => prev.filter((x) => x.id !== id)),
      addTrip: (t) => setTrips((prev) => [t, ...prev]),
      removeTrip: (id) => setTrips((prev) => prev.filter((x) => x.id !== id)),
      addInquiry: (i) => setInquiries((prev) => [i, ...prev]),
      removeInquiry: (id) => setInquiries((prev) => prev.filter((x) => x.id !== id)),
      sendMessage: (agentId, msg) =>
        setChats((prev) => ({ ...prev, [agentId]: [...(prev[agentId] ?? []), msg] })),
      toggleFavorite: (hotelId) =>
        setFavorites((prev) =>
          prev.includes(hotelId) ? prev.filter((x) => x !== hotelId) : [...prev, hotelId]
        ),
    }),
    [bookings, trips, inquiries, chats, favorites, hydrated]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreShape {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
