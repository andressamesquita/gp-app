import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/state/app-state';
import { color, font } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { Robot } from './Robot';
import { T, tap } from './ui';


/**
 * Barra de abas com rótulos sempre visíveis.
 * Ordem: Início, Carteira, Assistente Gov.pi (centro), Serviços, Área do cidadão (rota "index"), a tela de entrada do app.
 */
export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { logged } = useApp();
  const current = state.routes[state.index]?.name;

  const TABS: { name: string; label: string; icon: IconName }[] = [
    { name: 'inicio', label: 'Início', icon: 'home' },
    { name: 'carteira', label: 'Carteiras', icon: 'wallet' },
    { name: 'index', label: 'Assistente\nGov.pi', icon: 'chat' },
    { name: 'servicos', label: 'Serviços', icon: 'grid' },
    { name: 'perfil', label: 'Área do\ncidadão', icon: 'user' },
  ];

  const go = (name: string, focused: boolean) => {
    tap();
    const route = state.routes.find((r) => r.name === name);
    if (!focused && route) navigateToTab(route.key);
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map((t) => {
        const focused = current === t.name;
        if (t.name === 'index')
          return (
            <Pressable
              key={t.name}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel="Assistente Gov.pi"
              android_ripple={{ color: color.surface2, borderless: true }}
              onPress={() => go(t.name, focused)}
              style={styles.item}>
              {/* Botão elevado: o Assistente é o caminho principal do app (referência: botão "Chat" do Gov.pi atual) */}
              <View style={[styles.fab, focused && styles.fabOn]}>
                <Robot size={34} mono />
              </View>
              <T v="caption" c={color.brand} numberOfLines={2} style={styles.label(true)}>
                {t.label}
              </T>
            </Pressable>
          );
        return (
          <Pressable
            key={t.name}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={t.label.replace('\n', ' ')}
            android_ripple={{ color: color.surface2, borderless: true }}
            onPress={() => go(t.name, focused)}
            style={styles.item}>
            <View style={[styles.pill, focused && { backgroundColor: color.brandTint }]}>
              <Icon name={t.icon} size={22} color={focused ? color.brand : color.muted} strokeWidth={focused ? 2.2 : 1.9} />
            </View>
            <T v="caption" c={focused ? color.brand : color.muted} numberOfLines={2} style={styles.label(focused)}>
              {t.label}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = {
  label: (focused: boolean) => ({ fontFamily: focused ? font.semibold : font.medium, fontSize: 11, lineHeight: 14, textAlign: 'center' as const }),
  ...StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: color.surface, borderTopWidth: 1, borderTopColor: color.line, paddingTop: 6, paddingHorizontal: 2 },
  item: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', gap: 3, minHeight: 62 },
  pill: { width: 52, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  fab: {
    width: 60,
    height: 60,
    marginTop: -26,
    marginBottom: -2,
    borderRadius: 30,
    backgroundColor: color.brand,
    borderWidth: 4,
    borderColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#001946',
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  fabOn: { borderColor: color.brandTint },
}),
};
