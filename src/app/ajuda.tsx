import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { PrismaCard } from '@/components/blocks';
import { Icon } from '@/components/Icon';
import { ask } from '@/components/nav';
import { Page } from '@/components/page';
import { Button, Row, Section, T } from '@/components/ui';
import { useApp } from '@/state/app-state';
import { color, font, radius } from '@/theme/tokens';

export default function Ajuda() {
  const app = useApp();
  return (
    <Page title="Ajuda">
      <Section title="Como podemos ajudar?">
        <View>
          <Row icon="spark" title="Perguntar ao Assistente Gov.pi" sub="Responde na hora, a qualquer momento" onPress={() => ask()} />
          <Row icon="whats" title="Falar com um atendente" sub="Dias úteis, das 7h30 às 19h" onPress={() => router.push('/whatsapp')} />
          <Row icon="help" title="Perguntas frequentes" sub="Conta, login, documentos e pagamentos" onPress={() => app.showToast('Aqui abriria a central de ajuda.')} />
          <Row icon="eye" title="Acessibilidade e Libras" sub="Tamanho do texto, contraste e intérprete" onPress={() => router.push('/configuracoes')} last />
        </View>
      </Section>

      {/* Prisma Lab como atalho dentro da Ajuda */}
      <PrismaCard onPress={() => app.showToast('Aqui abriria o cadastro no Prisma Lab.')} />

      <Section title="Suporte Gov.pi">
        <View style={{ gap: 6 }}>
          <T v="small" c={color.muted}>
            WhatsApp do suporte
          </T>
          <T v="bodyStrong" selectable>
            (86) 98878-8533
          </T>
          <T v="small" c={color.muted} style={{ marginTop: 6 }}>
            E-mail
          </T>
          <T v="bodyStrong" selectable>
            suporte.govpi@etipi.pi.gov.br
          </T>
          <T v="small" c={color.muted} style={{ marginTop: 6 }}>
            Ouvidoria
          </T>
          <T v="bodyStrong" selectable>
            (86) 3326-2001 · 162
          </T>
        </View>
      </Section>
    </Page>
  );
}

const styles = StyleSheet.create({
  prisma: { backgroundColor: '#E4EDFA', borderRadius: radius.xl, padding: 18, gap: 10, borderWidth: 1, borderColor: '#C9D9F2' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: color.white, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 4 },
  num: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#0047A8', alignItems: 'center', justifyContent: 'center' },
});
