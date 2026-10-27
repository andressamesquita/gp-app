import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font } from '@/theme/tokens';
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
}) {
  const insets = useSafeAreaInsets();
  useStatusBar('light', color.brand);
  return (
    <View style={{ flex: 1, backgroundColor: flat ? color.surface : color.bg }}>
      <ScreenHeader title={title} sub={sub} right={right} close={close} onBack={onBack} />
      <ScrollView
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
export function TabTop({ title, sub, children, right }: { title: string; sub?: string; children?: ReactNode; right?: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: children ? 12 : 10, gap: 8, overflow: 'hidden' }}>
      <BlueBackdrop />
      <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 48 }}>
        <T v="h1" c={color.white} accessibilityRole="header" style={{ flex: 1, fontFamily: font.semibold }}>
          {title}
        </T>
        {right}
      </View>
      {sub ? (
        <T v="small" c="rgba(255,255,255,0.9)">
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
