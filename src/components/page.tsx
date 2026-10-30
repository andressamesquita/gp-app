import { useCallback, useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BAR_SHADOW, bar, color, font } from '@/theme/tokens';
import { BlueBackdrop } from './hero';
import { useStatusBar } from './statusbar';
import { FlatSections, ScreenHeader, T } from './ui';

/** Tela interna: cabeçalho azul com voltar + conteúdo rolável. */
export function Page({
  title,
  sub,
  right,
  children,
  footer,
  close,
  contentStyle,
  onBack,
  flat,
  topo,
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  close?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  onBack?: () => void;
  /** Padrão "sem cards, com divisórias": fundo branco e Section flat. Use FlatBlock para o que não for Section. */
  flat?: boolean;
  /** Parte fixa logo abaixo do cabeçalho (ex.: chips de filtro); não rola com o conteúdo */
  topo?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  useStatusBar('light', color.brand);
  const [rolou, onScroll] = useRolou();
  return (
    <View style={{ flex: 1, backgroundColor: flat ? color.surface : color.bg }}>
      {/* Sombra padrão quando o conteúdo rola por baixo: no cabeçalho, ou na parte fixa se houver */}
      <View style={[{ zIndex: 5 }, rolou && !topo && BAR_SHADOW]}>
        <ScreenHeader title={title} sub={sub} right={right} close={close} onBack={onBack} />
      </View>
      {topo ? <View style={[{ zIndex: 5, backgroundColor: color.surface }, rolou && BAR_SHADOW]}>{topo}</View> : null}
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[{ padding: 16, gap: 16, paddingBottom: footer ? 16 : insets.bottom + 32 }, flat && { paddingTop: 0, gap: 0 }, contentStyle]}
        keyboardShouldPersistTaps="handled">
        <FlatSections.Provider value={!!flat}>{children}</FlatSections.Provider>
      </ScrollView>
      {footer ? <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>{footer}</View> : null}
    </View>
  );
}

/** Parte de uma tela flat que não é Section (botões, avisos, cabeçalho): mesma margem e divisória em cima. */
export function FlatBlock({ children, style, first }: { children: ReactNode; style?: StyleProp<ViewStyle>; first?: boolean }) {
  return <View style={[styles.flatBlock, first && { borderTopWidth: 0 }, style]}>{children}</View>;
}

/** Topo das abas: faixa azul compacta (mesma altura da Área do cidadão), título e um apoio opcional (ex.: campo do Assistente). */
export function TabTop({ title, sub, children, right, left, elevated, noInset }: { title: string; sub?: string; children?: ReactNode; right?: ReactNode; /** antes do título (ex.: voltar) */ left?: ReactNode; /** sombra: o conteúdo está rolando por baixo */ elevated?: boolean; /** sem o espaço da barra de status (quando a tela já reserva esse espaço) */ noInset?: boolean }) {
  const semLinha = noInset; // título que rola junto com a busca: sem a linha embaixo
  const insets = useSafeAreaInsets();
  return (
    <View style={[{ paddingTop: (noInset ? 0 : insets.top) + 8, paddingHorizontal: 16, paddingBottom: children ? 12 : noInset ? 0 : 10, gap: 8, zIndex: 5 }, elevated && BAR_SHADOW]}>
      <BlueBackdrop bar style={semLinha ? { borderBottomWidth: 0 } : undefined} />
      <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 48, gap: left ? 4 : 0 }}>
        {left}
        <T v="h1" c={bar.title} accessibilityRole="header" style={{ flex: 1, fontFamily: font.semibold }}>
          {title}
        </T>
        {right}
      </View>
      {sub ? (
        <T v="small" c={bar.sub}>
          {sub}
        </T>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flatBlock: { marginHorizontal: -16, paddingHorizontal: 20, paddingVertical: 20, gap: 12, borderTopWidth: 1, borderTopColor: color.divider },
  footer: { paddingHorizontal: 16, paddingTop: 12, backgroundColor: color.surface, borderTopWidth: 1, borderTopColor: color.line, gap: 8 },
});

/** Diz se o conteúdo já rolou (para mostrar a sombra da faixa fixa). Use: const [rolou, onScroll] = useRolou(); <ScrollView onScroll={onScroll} scrollEventThrottle={16}> */
export function useRolou(limite = 2): [boolean, (e: { nativeEvent: { contentOffset: { y: number } } }) => void] {
  const [rolou, setRolou] = useState(false);
  const onScroll = useCallback((e: { nativeEvent: { contentOffset: { y: number } } }) => {
    const r = e.nativeEvent.contentOffset.y > limite;
    setRolou((x) => (x === r ? x : r));
  }, [limite]);
  return [rolou, onScroll];
}
