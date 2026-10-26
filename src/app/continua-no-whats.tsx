import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, IconButton, T } from '@/components/ui';
import { PROTOCOL_CNH } from '@/data/mock';
import { color, radius } from '@/theme/tokens';

export default function ContinuaNoWhats() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <Pressable accessibilityLabel="Fechar" style={StyleSheet.absoluteFill} onPress={() => router.back()}>
        <View style={{ flex: 1, backgroundColor: color.scrim }} />
      </Pressable>
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]} accessibilityViewIsModal>
        <View style={styles.grab} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <T v="h2" style={{ flex: 1 }} accessibilityRole="header">
            Continuar no WhatsApp
          </T>
          <IconButton icon="close" label="Fechar" tone="plain" onPress={() => router.back()} />
        </View>
        <T v="body" c={color.muted}>
          Vamos abrir a conversa com o número oficial, já com a sua solicitação. Você não precisa explicar tudo de novo.
        </T>
        <View style={styles.box}>
          <T v="caption" c={color.muted}>
            Mensagem que vamos enviar por você
          </T>
          <T v="bodyStrong">Olá, quero continuar a solicitação {PROTOCOL_CNH}.</T>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <T v="small" c={color.muted}>
            Número oficial
          </T>
          <T v="smallStrong">(86) 98878-8533</T>
        </View>
        <Button
          kind="whats"
          icon="whats"
          label="Abrir WhatsApp"
          onPress={() => {
            router.back();
            router.push('/whatsapp');
          }}
        />
        <Button kind="secondary" label="Agora não" onPress={() => router.back()} />
        <T v="caption" c={color.muted}>
          A solicitação continua a mesma nos dois lugares. Você pode voltar ao app quando quiser.
        </T>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { backgroundColor: color.surface, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingHorizontal: 20, paddingTop: 8, gap: 12 },
  grab: { width: 44, height: 5, borderRadius: 3, backgroundColor: color.line, alignSelf: 'center', marginBottom: 4 },
  box: { backgroundColor: color.whatsBg, borderRadius: radius.md, padding: 14, gap: 4 },
});
