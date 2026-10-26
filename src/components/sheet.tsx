import type { ReactNode } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, radius } from '@/theme/tokens';
import { IconButton, T } from './ui';

/**
 * Folha inferior: Modal nativo no celular (fecha com o voltar do Android);
 * na prévia web, camada dentro da tela do app.
 * Deve ficar fora do ScrollView da tela.
 */
export function Sheet({
  visible,
  onClose,
  title,
  sub,
  children,
  center,
  footer,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  sub?: string;
  children: ReactNode;
  /** Título centralizado, sem X (fecha arrastando/tocando fora ou no voltar), como nos filtros do iFood. */
  center?: boolean;
  /** Ação fixa no rodapé (ex.: "Aplicar"). */
  footer?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const body = (
    <>
      <Pressable style={{ flex: 1, backgroundColor: color.scrim }} onPress={onClose} accessibilityLabel="Fechar" />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 18 }]} accessibilityViewIsModal>
        <View style={styles.grab} />
        {title && center ? (
          <T v="h2" accessibilityRole="header" style={{ textAlign: 'center', paddingVertical: 8 }}>
            {title}
          </T>
        ) : title ? (
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            <View style={{ flex: 1, gap: 2, paddingTop: 6 }}>
              <T v="h2" accessibilityRole="header">
                {title}
              </T>
              {sub ? (
                <T v="small" c={color.muted}>
                  {sub}
                </T>
              ) : null}
            </View>
            <IconButton icon="close" label="Fechar" tone="plain" onPress={onClose} />
          </View>
        ) : null}
        <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 12, paddingBottom: 4 }} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
        {footer}
      </View>
    </>
  );
  if (Platform.OS === 'web') return visible ? <View style={[StyleSheet.absoluteFill, { zIndex: 60 }]}>{body}</View> : null;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      {body}
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: { backgroundColor: color.surface, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingHorizontal: 20, paddingTop: 8, gap: 12, maxHeight: '88%' },
  grab: { width: 44, height: 5, borderRadius: 3, backgroundColor: color.line, alignSelf: 'center', marginBottom: 4 },
});
