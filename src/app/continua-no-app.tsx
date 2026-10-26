import { ask } from '@/components/nav';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Timeline } from '@/components/blocks';
import { Icon } from '@/components/Icon';
import { Page } from '@/components/page';
import { Button, Section, SwitchRow, T, Tag } from '@/components/ui';
import { PROTOCOL_CNH } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { color, radius } from '@/theme/tokens';

export default function ContinuaNoApp() {
  const { prefs, setPref } = useApp();
  return (
    <Page title="Sua solicitação" onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))}>
      <View style={styles.from}>
        <Icon name="whats" size={22} color={color.whats} />
        <View style={{ flex: 1 }}>
          <T v="bodyStrong">Você começou no WhatsApp</T>
          <T v="small" c={color.muted}>
            A solicitação segue do mesmo ponto. Nada precisa ser refeito.
          </T>
        </View>
      </View>
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <T v="h3">
            Renovação da CNH
          </T>
          <Tag label="Em andamento" />
        </View>
        <T v="caption" c={color.muted}>
          Protocolo {PROTOCOL_CNH}
        </T>
        <Timeline
          steps={[
            { t: 'Solicitação aberta', s: 'done', via: 'Pelo WhatsApp' },
            { t: 'Exame médico marcado', d: '21/10, 9h20 · Clínica Centro', s: 'done', via: 'Pelo WhatsApp' },
            { t: 'Fazer o exame', d: 'Você está aqui. Leve um documento com foto.', s: 'current' },
            { t: 'Nova CNH', d: 'Avisamos quando estiver pronta.', s: 'todo' },
          ]}
        />
        <Button label="Falar sobre esta solicitação" onPress={() => ask('Quero renovar minha CNH')} />
        <Button kind="whats" icon="whats" label="Continuar no WhatsApp" href="/continua-no-whats" />
      </View>
      <Section title="Onde avisar você">
        <View>
          <SwitchRow title="Neste app" sub="Notificação no celular" value={prefs.notifApp} onChange={(v) => setPref('notifApp', v)} />
          <SwitchRow title="WhatsApp" sub="Mensagem do número oficial" value={prefs.notifWhats} onChange={(v) => setPref('notifWhats', v)} />
          <SwitchRow title="E-mail" sub="Resumo de cada etapa" value={prefs.notifEmail} onChange={(v) => setPref('notifEmail', v)} last />
        </View>
        <T v="caption" c={color.muted}>
          Você escolhe por onde receber avisos e pode mudar quando quiser. Um aviso não repete no outro canal.
        </T>
      </Section>
    </Page>
  );
}

const styles = StyleSheet.create({
  from: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 14, borderRadius: radius.md, backgroundColor: color.whatsBg },
  card: { backgroundColor: color.surface, borderWidth: 1.5, borderColor: color.brand, borderRadius: radius.xl, padding: 18, gap: 12 },
});
