import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, IconButton, LinkText, T } from '@/components/ui';
import { useApp } from '@/state/app-state';
import { color, radius } from '@/theme/tokens';

/** Folha inferior: "Por que estou vendo isso?" */
export default function PorQue() {
  const insets = useSafeAreaInsets();
  const { showToast } = useApp();
  const done = (t: string) => {
    showToast(t);
    router.back();
  };
  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <Pressable accessibilityLabel="Fechar" style={StyleSheet.absoluteFill} onPress={() => router.back()}>
        <View style={{ flex: 1, backgroundColor: color.scrim }} />
      </Pressable>
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]} accessibilityViewIsModal>
        <View style={styles.grab} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <T v="h2" style={{ flex: 1 }} accessibilityRole="header">
            Por que estou vendo isso?
          </T>
          <IconButton icon="close" label="Fechar" tone="plain" onPress={() => router.back()} />
        </View>
        <View style={styles.box}>
          <T v="smallStrong">Motivo</T>
          <T v="small">A validade da sua CNH termina em 27 dias. Avisamos antes para você não ficar sem o documento.</T>
        </View>
        <View style={styles.box}>
          <T v="smallStrong">Dados usados</T>
          <T v="small">Data de validade da CNH, registrada no Detran-PI.</T>
        </View>
        <T v="h3">Você decide</T>
        <View style={{ gap: 8 }}>
          <Button kind="secondary" label="Receber menos avisos deste tipo" onPress={() => done('Combinado. Você vai receber menos avisos assim.')} />
          <Button kind="secondary" label="Ver só avisos importantes" onPress={() => done('Agora só avisos importantes.')} />
          <Button kind="danger" label="Não mostrar mais isso" onPress={() => done('Este tipo de aviso foi desligado.')} />
        </View>
        <LinkText label="Gerenciar meus avisos" onPress={() => { router.back(); router.push('/perfil'); }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { backgroundColor: color.surface, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingHorizontal: 20, paddingTop: 8, gap: 12 },
  grab: { width: 44, height: 5, borderRadius: 3, backgroundColor: color.line, alignSelf: 'center', marginBottom: 4 },
  box: { backgroundColor: color.bg, borderRadius: radius.md, padding: 14, gap: 4 },
});
