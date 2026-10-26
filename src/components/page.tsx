import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font } from '@/theme/tokens';
import { BlueBackdrop } from './hero';
import { useStatusBar } from './statusbar';
import { ScreenHeader, T } from './ui';

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
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  close?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  onBack?: () => void;
}) {
  const insets = useSafeAreaInsets();
  useStatusBar('light', color.brand);
  return (
    <View style={{ flex: 1, backgroundColor: color.bg }}>
      <ScreenHeader title={title} sub={sub} right={right} close={close} onBack={onBack} />
      <ScrollView contentContainerStyle={[{ padding: 16, gap: 16, paddingBottom: footer ? 16 : insets.bottom + 32 }, contentStyle]} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
      {footer ? <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>{footer}</View> : null}
    </View>
  );
}

/** Topo das abas: faixa azul com ondas, título grande e um apoio opcional (busca, filtros). */
export function TabTop({ title, sub, children, right, overlap }: { title: string; sub?: string; children?: ReactNode; right?: ReactNode; overlap?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + 14, paddingHorizontal: 20, paddingBottom: overlap ? 46 : 22, gap: 10, overflow: 'hidden' }}>
      <BlueBackdrop />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
  footer: { paddingHorizontal: 16, paddingTop: 12, backgroundColor: color.surface, borderTopWidth: 1, borderTopColor: color.line, gap: 8 },
});
