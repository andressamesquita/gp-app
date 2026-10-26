import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Share, StyleSheet, View } from 'react-native';

import { MedalBadge } from '@/components/blocks';
import { Icon } from '@/components/Icon';
import { Page } from '@/components/page';
import { Button, LinkText, Logo, T } from '@/components/ui';
import { MEDALS } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { color, radius } from '@/theme/tokens';

export default function Compartilhar() {
  const app = useApp();
  const share = () => Share.share({ message: 'Renovei minha CNH pelo Gov.pi. Concluído em 6 dias.' }).catch(() => {});
  return (
    <Page title="Compartilhar conquista">
      <View accessible accessibilityRole="image" accessibilityLabel="Imagem de conquista: Renovei minha CNH pelo Gov.pi. Concluído em 6 dias." style={styles.preview}>
        <LinearGradient colors={['#0B5CBD', '#034EA2', '#023C7E']} style={StyleSheet.absoluteFill} />
        <Logo size={14} />
        <View style={{ alignItems: 'center', gap: 12, paddingVertical: 18 }}>
          <MedalBadge m={MEDALS[3]} earned size={84} />
          <T v="eyebrow" c="rgba(255,255,255,0.85)">
            Conquista
          </T>
          <T v="h1" c={color.white} style={{ textAlign: 'center' }}>
            Renovei minha CNH pelo Gov.pi
          </T>
          <T v="bodyStrong" c="rgba(255,255,255,0.9)">
            Concluído em 6 dias
          </T>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Icon name="shield" size={18} color={color.good} />
        <T v="small" c={color.muted} style={{ flex: 1 }}>
          Esta é a imagem que será compartilhada. Ela não mostra nome, CPF, número da CNH, protocolo, endereço nem data do exame.
        </T>
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button kind="whats" icon="whats" label="WhatsApp" onPress={share} style={{ flex: 1 }} />
        <Button kind="secondary" icon="image" label="Instagram" onPress={share} style={{ flex: 1 }} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button kind="ghost" icon="share" label="Mais opções" onPress={share} style={{ flex: 1 }} />
        <Button kind="ghost" icon="download" label="Salvar imagem" onPress={() => app.showToast('Imagem salva na galeria (simulação).')} style={{ flex: 1 }} />
      </View>
      <T v="caption" c={color.muted}>
        Nada é publicado por nós. Você escolhe onde compartilhar e confirma lá.
      </T>
      <LinkText label="Agora não" onPress={() => router.back()} />
      <T v="caption" c={color.muted}>
        A sugestão de compartilhar fica desligada por padrão. Você pode ligar em Perfil, Privacidade.
      </T>
    </Page>
  );
}

const styles = StyleSheet.create({
  preview: { borderRadius: radius.xl, overflow: 'hidden', padding: 18, minHeight: 300 },
});
