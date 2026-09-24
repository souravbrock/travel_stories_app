import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

import { StoreProvider } from './lib/store';
import { lightTheme, darkTheme } from './lib/theme';
import { RootStackParamList, MainTabParamList } from './lib/nav';

import HomeScreen from './screens/HomeScreen';
import IndiaMapScreen from './screens/IndiaMapScreen';
import StateMapScreen from './screens/StateMapScreen';
import SpotDetailScreen from './screens/SpotDetailScreen';
import HotelDetailScreen from './screens/HotelDetailScreen';
import PackagesScreen from './screens/PackagesScreen';
import PackageDetailScreen from './screens/PackageDetailScreen';
import AgentChatScreen from './screens/AgentChatScreen';
import TripBuilderScreen from './screens/TripBuilderScreen';
import MyTripsScreen from './screens/MyTripsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
  Explore: ['compass', 'compass-outline'],
  Map: ['map', 'map-outline'],
  Packages: ['briefcase', 'briefcase-outline'],
  Trips: ['bookmark', 'bookmark-outline'],
};

function MainTabs() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ focused, color, size }) => {
          const [active, inactive] = TAB_ICONS[route.name as keyof MainTabParamList];
          return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Explore" component={HomeScreen} />
      <Tab.Screen name="Map" component={IndiaMapScreen} />
      <Tab.Screen name="Packages" component={PackagesScreen} />
      <Tab.Screen name="Trips" component={MyTripsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded) return null;

  const navTheme = {
    ...(scheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(scheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.bg,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      primary: theme.primary,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StoreProvider>
          <NavigationContainer theme={navTheme}>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Main" component={MainTabs} />
              <Stack.Screen name="StateMap" component={StateMapScreen} />
              <Stack.Screen name="SpotDetail" component={SpotDetailScreen} />
              <Stack.Screen name="HotelDetail" component={HotelDetailScreen} />
              <Stack.Screen name="PackageDetail" component={PackageDetailScreen} />
              <Stack.Screen name="AgentChat" component={AgentChatScreen} />
              <Stack.Screen
                name="TripBuilder"
                component={TripBuilderScreen}
                options={{ presentation: 'modal' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
