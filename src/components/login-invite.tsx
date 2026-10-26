import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from './Icon';
import { ask } from './nav';
import { TabTop } from './page';
import { Button, LinkText, T } from './ui';
import { color, radius } from '@/theme/tokens';

const COPY: Record<string, { title: string; icon: IconName; text: string; perks: string[] }> = {
  inicio: {
    title: 'Início',
    icon: 'home',
    text: 'Entre para ver o que precisa da sua atenção, acompanhar solicitações e ter seus documentos no celular.',
    perks: ['Avisos antes dos prazos, como a CNH perto de vencer', 'Andamento de cada solicitação', 'Carteira de documentos digitais'],
  },
  jornada: {
    title: 'Minha jornada',
    icon: 'route',
    text: 'Entre para ver os serviços do Governo ligados aos seus momentos de vida.',
    perks: ['Condutora, estudante, gestante e outros momentos', 'O que já foi feito e o que falta', 'Conquistas a cada serviço concluído'],
  },
  carteira: {
    title: 'Carteira',
    icon: 'wallet',
    text: 'Entre para ter seus documentos digitais no celular e mostrá-los com QR Code quando precisar.',
    perks: ['CNH Digital, CIN e carteiras do Hemopi, do Estudante e do Idoso', 'Validação por QR Code, mesmo sem internet', 'Compartilhamento seguro com confirmação de identidade'],
  },
  perfil: {
    title: 'Área do cidadão',
    icon: 'user',
    text: 'Use sua conta gov.br ou ID Piauí. Preenchemos os formulários com o que o Estado já tem sobre você.',
    perks: ['Login com biometria depois do primeiro acesso', 'Você escolhe por onde receber avisos', 'Controle de quais dados são usados'],
  },
};

/** Abas que dependem de conta, quando o cidadão ainda não entrou. */
export function LoginInvite({ kind }: { kind: keyof typeof COPY }) {
  const c = COPY[kind];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: color.bg }} contentContainerStyle={{ paddingBottom: 32 }}>
      <TabTop title={c.title} />
      <View style={{ padding: 16, marginTop: -12 }}>
        <View style={styles.card}>
          <View style={styles.ico}>
            <Icon name={c.icon} size={26} color={color.brand} />
          </View>
          <T v="h2">Entre na sua conta Gov.pi</T>
          <T v="body" c={color.muted}>
            {c.text}
          </T>
          <View style={{ gap: 8 }}>
            {c.perks.map((p) => (
              <View key={p} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                <Icon name="check" size={18} color={color.good} strokeWidth={2.4} />
                <T v="small" style={{ flex: 1 }}>
                  {p}
                </T>
              </View>
            ))}
          </View>
          <Button label="Entrar" icon="lock" onPress={() => router.push('/entrar')} />
          <Button kind="secondary" label="Criar conta" onPress={() => router.push('/cadastro')} />
        </View>
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <T v="small" c={color.muted}>
            Só quer tirar uma dúvida?
          </T>
          <LinkText label="Perguntar ao Assistente Gov.pi" icon="right" onPress={() => ask()} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: color.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: color.line, padding: 20, gap: 14 },
  ico: { width: 52, height: 52, borderRadius: radius.lg, backgroundColor: color.brandTint, alignItems: 'center', justifyContent: 'center' },
});
