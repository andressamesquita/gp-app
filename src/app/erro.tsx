import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Page } from '@/components/page';
import { Button, T } from '@/components/ui';
import { useApp } from '@/state/app-state';
import { color, radius } from '@/theme/tokens';

export default function Erro() {
  const app = useApp();
  return (
    <Page title="Ajuda e atendimento">
      <View style={styles.ico}>
        <Icon name="alert" size={30} color={color.warnInk} />
      </View>
      <T v="h1">Não conseguimos concluir agora</T>
      <T v="body" c={color.muted}>
        Este serviço está instável neste momento. Salvamos o que você já tinha informado, então não precisa começar de novo.
      </T>
      <View style={styles.saved}>
        <T v="caption" c={color.muted}>
          O que você tinha começado
        </T>
        <T v="bodyStrong">Renovação da CNH</T>
        <T v="small" c={color.muted}>
          Salvo agora há pouco
        </T>
      </View>
      <Button label="Tentar de novo" icon="refresh" href="/conversa" />
      <Button kind="secondary" label="Avisar quando voltar" icon="bell" onPress={() => app.showToast('Combinado. Avisamos você assim que o serviço voltar.')} />
      <View style={styles.human}>
        <T v="h2">Prefere falar com uma pessoa?</T>
        <T v="small">O atendente já recebe o que você tinha começado. Você não precisa explicar de novo.</T>
        <Button kind="whats" icon="whats" label="Falar com um atendente" href="/whatsapp" />
        <T v="caption" c={color.muted}>
          Atendimento em dias úteis, das 7h30 às 19h.
        </T>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  ico: { width: 60, height: 60, borderRadius: 30, backgroundColor: color.warnBg, alignItems: 'center', justifyContent: 'center' },
  saved: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line, borderRadius: radius.md, padding: 14, gap: 2 },
  human: { backgroundColor: color.brandTint, borderRadius: radius.xl, padding: 18, gap: 10 },
});
