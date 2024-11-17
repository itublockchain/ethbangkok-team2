import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '../store'
import { Provider } from 'react-redux'

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    'HelveticaNeue-Black': require('../assets/helvetica-neue/HelveticaNeueBlack.otf'),
    'HelveticaNeue-BlackItalic': require('../assets/helvetica-neue/HelveticaNeueBlackItalic.otf'),
    'HelveticaNeue-Bold': require('../assets/helvetica-neue/HelveticaNeueBold.otf'),
    'HelveticaNeue-BoldItalic': require('../assets/helvetica-neue/HelveticaNeueBoldItalic.otf'),
    'HelveticaNeue-Heavy': require('../assets/helvetica-neue/HelveticaNeueHeavy.otf'),
    'HelveticaNeue-HeavyItalic': require('../assets/helvetica-neue/HelveticaNeueHeavyItalic.otf'),
    'HelveticaNeue-Italic': require('../assets/helvetica-neue/HelveticaNeueItalic.ttf'),
    'HelveticaNeue-Light': require('../assets/helvetica-neue/HelveticaNeueLight.otf'),
    'HelveticaNeue-LightItalic': require('../assets/helvetica-neue/HelveticaNeueLightItalic.otf'),
    'HelveticaNeue-Medium': require('../assets/helvetica-neue/HelveticaNeueMedium.otf'),
    'HelveticaNeue-MediumItalic': require('../assets/helvetica-neue/HelveticaNeueMediumItalic.otf'),
    'HelveticaNeue-Roman': require('../assets/helvetica-neue/HelveticaNeueRoman.otf'),
    'HelveticaNeue-Thin': require('../assets/helvetica-neue/HelveticaNeueThin.otf'),
    'HelveticaNeue-ThinItalic': require('../assets/helvetica-neue/HelveticaNeueThinItalic.otf'),
    'HelveticaNeue-UltraLight': require('../assets/helvetica-neue/HelveticaNeueUltraLight.otf'),
    'HelveticaNeue-UltraLightItalic': require('../assets/helvetica-neue/HelveticaNeueUltraLightItalic.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <Provider store={store}>
      <QueryClientProvider client={new QueryClient()}>
        <ThemeProvider value={DefaultTheme}>
          <Stack screenOptions={{
            headerShown: false,
          }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="detail" />
          </Stack>
          <StatusBar style="dark" />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
