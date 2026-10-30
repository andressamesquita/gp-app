import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';

import { LogoSplash } from '@/components/logo-splash';
import { NewsModal } from '@/components/news-modal';
import { Toast } from '@/components/ui';
import { AppStateProvider, useApp } from '@/state/app-state';
import { color } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

function ToastHost() {
  const { toast } = useApp();
  return <Toast text={toast} />;
}

export default function RootLayout() {
  const [news, setNews] = useState(true);
  const [abertura, setAbertura] = useState(true);
  const [fontsLoaded, fontError] = useFonts({ Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold });
  // Na prévia web as fontes já vêm embutidas na página; não esperamos por elas.
  const loaded = fontsLoaded || !!fontError || (Platform.OS === 'web' && typeof document !== 'undefined' && !!document.getElementById('govpi-fonts'));
  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);
  if (!loaded) return null;

  return (
    <AppStateProvider>
      <View style={{ flex: 1, backgroundColor: color.bg }}>
        <StatusBar style={abertura ? "dark" : "light"} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.bg }, animation: 'slide_from_right' }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="entrar" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="por-que" options={{ presentation: 'transparentModal', animation: 'fade', contentStyle: { backgroundColor: 'transparent' } }} />
          <Stack.Screen name="continua-no-whats" options={{ presentation: 'transparentModal', animation: 'fade', contentStyle: { backgroundColor: 'transparent' } }} />
        </Stack>
        <ToastHost />
        {/* Novidades: aparece uma vez a cada abertura do app */}
        <NewsModal visible={news && !abertura} onClose={() => setNews(false)} />
        {/* Abertura: animação da logo antes das novidades */}
        {abertura && <LogoSplash onDone={() => setAbertura(false)} />}
      </View>
    </AppStateProvider>
  );
}
