export interface GridPos {
  r: number;
  c: number;
}

export interface IndianState {
  id: string;
  name: string;
  grid: GridPos;
  color: string;
  tagline: string;
  bestSeason: string;
  seasonLabel: string;
  peakSeason: string;
  highlights: string[];
  available: boolean;
  districts: District[];
}

export interface District {
  id: string;
  name: string;
  grid: GridPos;
  color: string;
  blurb: string;
  spots: Spot[];
}

export type SpotType =
  | 'Heritage'
  | 'Nature'
  | 'Beach'
  | 'Hill'
  | 'Wildlife'
  | 'Spiritual'
  | 'City'
  | 'Adventure';

export interface Spot {
  id: string;
  name: string;
  type: SpotType;
  lat: number;
  lng: number;
  blurb: string;
  bestTime: string;
  rating: number;
  entryFee: string;
  hours: string;
  hotels: Hotel[];
}

export type HotelTier = 'Budget' | 'Deluxe' | 'Luxury';
export type HotelKind = 'Hotel' | 'Resort' | 'Homestay';

export interface Room {
  name: string;
  price: number;
  sleeps: number;
  perks: string[];
}

export interface Hotel {
  id: string;
  spotId: string;
  name: string;
  tier: HotelTier;
  kind: HotelKind;
  rating: number;
  reviews: number;
  reviewsList: Review[];
  price: number;
  amenities: string[];
  blurb: string;
  rooms: Room[];
  color: string;
}

export interface Review {
  name: string;
  rating: number;
  date: string;
  text: string;
}

export interface Agent {
  id: string;
  name: string;
  agency: string;
  homeState: string;
  rating: number;
  trips: number;
  responseTime: string;
  verified: boolean;
  about: string;
  phone: string;
  color: string;
}

export interface PackageDay {
  d: number;
  title: string;
  desc: string;
}

export interface TourPackage {
  id: string;
  agentId: string;
  title: string;
  stateNames: string[];
  days: number;
  nights: number;
  price: number;
  rating: number;
  reviews: number;
  groupSize: string;
  includes: string[];
  tags: string[];
  itinerary: PackageDay[];
  gradient: [string, string];
}

export interface Vehicle {
  id: string;
  name: string;
  category: 'SUV / MUV' | 'Group & Luxury';
  seats: number;
  pricePerDay: number;
  features: string[];
  icon: string;
}

export interface MealSlot {
  id: string;
  label: string;
  icon: string;
  price: number;
}

export interface Booking {
  id: string;
  kind: 'hotel' | 'package';
  title: string;
  subtitle: string;
  dateISO: string;
  nights?: number;
  guests?: number;
  total: number;
  status: string;
}

export interface SavedTrip {
  id: string;
  name: string;
  createdAt: string;
  origin: string;
  stateId: string;
  stateName: string;
  transitMode: string;
  bookingPref: string;
  lead?: { name: string; phone: string; email: string };
  vehicleId: string;
  vehicleName: string;
  hotelIds: string[];
  hotelNames: string[];
  days: number;
  nights: number;
  meals: {
    mode: string;
    tripWide: Record<string, boolean>;
    days: Record<string, Record<string, boolean>>;
  };
  budget: number;
}

export interface Inquiry {
  id: string;
  agentId: string;
  agentName: string;
  packageId?: string;
  packageTitle?: string;
  message: string;
  dateISO: string;
  status: string;
}

export interface ChatMessage {
  id: string;
  from: 'me' | 'agent';
  text: string;
  dateISO: string;
}
