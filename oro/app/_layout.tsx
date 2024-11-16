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
    PlayfairDisplay_400Regular: require('../node_modules/@expo-google-fonts/playfair-display/PlayfairDisplay_400Regular.ttf'),
    PlayfairDisplay_400Regular_Italic: require('../node_modules/@expo-google-fonts/playfair-display/PlayfairDisplay_400Regular_Italic.ttf'),
    PlayfairDisplay_500Medium: require('../node_modules/@expo-google-fonts/playfair-display/PlayfairDisplay_500Medium.ttf'),
    PlayfairDisplay_500Medium_Italic: require('../node_modules/@expo-google-fonts/playfair-display/PlayfairDisplay_500Medium_Italic.ttf'),
    PlayfairDisplay_600SemiBold: require('../node_modules/@expo-google-fonts/playfair-display/PlayfairDisplay_600SemiBold.ttf'),
    PlayfairDisplay_600SemiBold_Italic: require('../node_modules/@expo-google-fonts/playfair-display/PlayfairDisplay_600SemiBold_Italic.ttf'),
    PlayfairDisplay_700Bold: require('../node_modules/@expo-google-fonts/playfair-display/PlayfairDisplay_700Bold.ttf'),
    PlayfairDisplay_700Bold_Italic: require('../node_modules/@expo-google-fonts/playfair-display/PlayfairDisplay_700Bold_Italic.ttf'),
    PlayfairDisplay_800ExtraBold: require('../node_modules/@expo-google-fonts/playfair-display/PlayfairDisplay_800ExtraBold.ttf'),
    PlayfairDisplay_800ExtraBold_Italic: require('../node_modules/@expo-google-fonts/playfair-display/PlayfairDisplay_800ExtraBold_Italic.ttf'),
    PlayfairDisplay_900Black: require('../node_modules/@expo-google-fonts/playfair-display/PlayfairDisplay_900Black.ttf'),
    PlayfairDisplay_900Black_Italic: require('../node_modules/@expo-google-fonts/playfair-display/PlayfairDisplay_900Black_Italic.ttf'),
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
