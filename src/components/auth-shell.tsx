import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, radius } from '@/theme/tokens';
import { BlueBackdrop } from './hero';
import { Icon } from './Icon';
import { useStatusBar } from './statusbar';
import { Logo, T, tap } from './ui';

/**
 * Moldura das telas de acesso (entrar, criar conta, recuperar senha):
 * fundo azul da marca, "‹ Voltar" no topo e um cartão branco com o logo à direita.
 */
export function AuthShell({ title, children }: { title?: string; children: ReactNode }) {
  const insets = useSafeAreaInsets();
  useStatusBar('light', color.brand, true);
  return (
    <View style={{ flex: 1, backgroundColor: color.brand }}>
      <BlueBackdrop full />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24, paddingHorizontal: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={10}
            onPress={() => {
              tap();
              if (router.canGoBack()) router.back();
              else router.navigate('/');
            }}
            style={({ pressed }) => [styles.back, pressed && { opacity: 0.7 }]}>
            <Icon name="back" size={22} color={color.white} />
            <T v="h3" c={color.white}>
              Voltar
            </T>
          </Pressable>

          <View style={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 24 }}>
            <View style={styles.card}>
              <View style={styles.head}>
                {title ? (
                  <T v="h2" accessibilityRole="header" style={{ flex: 1 }}>
                    {title}
                  </T>
                ) : (
                  <View style={{ flex: 1 }} />
                )}
                <Logo light={false} size={18} />
              </View>
              <View style={styles.divider} />
              {children}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/** Divisória clara usada dentro do cartão de acesso. */
export function AuthDivider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', minHeight: 44 },
  card: { backgroundColor: color.surface, borderRadius: radius.lg, paddingHorizontal: 20, paddingVertical: 24, gap: 16 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { height: 1, backgroundColor: color.divider, marginHorizontal: -20 },
});
