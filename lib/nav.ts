import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Explore: undefined;
  Map: undefined;
  Packages: undefined;
  Trips: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  StateMap: { stateId: string };
  SpotDetail: { spotId: string };
  HotelDetail: { hotelId: string };
  PackageDetail: { packageId: string };
  AgentChat: { agentId: string };
  TripBuilder: { stateId?: string; hotelId?: string } | undefined;
};
