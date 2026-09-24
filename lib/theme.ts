import { useColorScheme } from 'react-native';

export interface Theme {
  dark: boolean;
  bg: string;
  bgAlt: string;
  card: string;
  cardAlt: string;
  text: string;
  textMuted: string;
  primary: string;
  primarySoft: string;
  onPrimary: string;
  accent: string;
  accentSoft: string;
  gold: string;
  border: string;
  success: string;
  danger: string;
  shadow: string;
  tabBar: string;
  overlay: string;
}

export const lightTheme: Theme = {
  dark: false,
  bg: '#F6F1E7',
  bgAlt: '#EFE8D8',
  card: '#FFFFFF',
  cardAlt: '#FBF7EE',
  text: '#1E2B27',
  textMuted: '#6E7F79',
  primary: '#0E5F52',
  primarySoft: '#E2EFEB',
  onPrimary: '#FFFFFF',
  accent: '#E8734A',
  accentSoft: '#FCEAE2',
  gold: '#C99B3F',
  border: '#E7DFCE',
  success: '#2E7D52',
  danger: '#C0392B',
  shadow: '#3A2E1E',
  tabBar: '#FFFFFF',
  overlay: 'rgba(20, 30, 27, 0.5)',
};

export const darkTheme: Theme = {
  dark: true,
  bg: '#0F1A18',
  bgAlt: '#14211F',
  card: '#1A2825',
  cardAlt: '#21302C',
  text: '#EDF3F1',
  textMuted: '#8FA39E',
  primary: '#3AA88F',
  primarySoft: '#17332E',
  onPrimary: '#0B1512',
  accent: '#F08A5D',
  accentSoft: '#3A241B',
  gold: '#D9B25F',
  border: '#2A3B37',
  success: '#4CAF7D',
  danger: '#E06A5B',
  shadow: '#000000',
  tabBar: '#14211F',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
}

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
};

export const cardShadow = (t: Theme) => ({
  shadowColor: t.shadow,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: t.dark ? 0.35 : 0.1,
  shadowRadius: 12,
  elevation: 4,
});
