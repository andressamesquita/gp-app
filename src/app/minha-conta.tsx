import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Page } from '@/components/page';
import { Avatar, Button, LinkText, Row, Section, T, tap } from '@/components/ui';
import { MEDALS, PERSON, earnedMedals } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { color, radius } from '@/theme/tokens';

/**
 * Minha conta: aberta pelo avatar (AS) da Área do cidadão.
 * Foto, nome e nível; resumo das conquistas com a próxima meta; itens da conta; sair.
 */
export default function MinhaConta() {
  const app = useApp();
  const earned = useMemo(() => {
    const e = earnedMedals(app.scenario);
    if (app.prefs.zapAvisos) e.push('zap');
    if (app.posts.length) e.push('publicou');
    return e;
  }, [app.scenario, app.prefs.zapAvisos, app.posts.length]);
  const next = MEDALS.find((m) => !earned.includes(m.id));
  const pct = earned.length / MEDALS.length;

  return (
    // Padrão da Área do cidadão: fundo branco, conteúdo fora de cards e divisórias claras entre as partes
    <Page title="Minha conta" contentStyle={styles.page}>
      {/* ---------- Identificação ---------- */}
      <View style={styles.head}>
        <Avatar initials={PERSON.initials} size={56} uri={app.photo} />
        <View style={{ flex: 1, gap: 2 }}>
          <T v="h2">{PERSON.name}</T>
          <T v="small" c={color.muted}>
            Conta {PERSON.level}
          </T>
        </View>
        <LinkText label="Editar" onPress={() => router.push('/meu-perfil')} />
      </View>

      {/* ---------- Conquistas: progresso + próxima meta ---------- */}
      <Section flat title="Minhas conquistas" action={{ label: 'Ver todas', href: '/conquistas' }}>
        <View style={{ gap: 8 }}>
          <T v="small" c={color.muted}>
            {earned.length} de {MEDALS.length} conquistadas
          </T>
          <View style={styles.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: MEDALS.length, now: earned.length }}>
            <View style={[styles.fill, { width: `${Math.max(pct * 100, 2)}%` }]} />
          </View>
        </View>
        {next ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Próxima conquista: ${next.t}. ${next.how}`}
            onPress={() => {
              tap();
              router.push('/conquistas');
            }}
            style={({ pressed }) => [styles.next, pressed && { opacity: 0.7 }]}>
            <View style={styles.trophy}>
              <Icon name="trophy" size={20} color={color.brand} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <T v="caption" c={color.muted}>
                Próxima conquista
              </T>
              <T v="bodyStrong">{next.t}</T>
              <T v="small" c={color.muted}>
                {next.how}
              </T>
            </View>
            <Icon name="right" size={18} color={color.muted} />
          </Pressable>
        ) : null}
      </Section>

      {/* ---------- Conta ---------- */}
      <Section flat title="Conta">
        <View>
          <Row icon="user" title="Meu perfil" sub="Dados pessoais, contato e endereço" onPress={() => router.push('/meu-perfil')} />
          <Row icon="sliders" title="Configurações" sub="Privacidade, avisos e acessibilidade" onPress={() => router.push('/configuracoes')} />
          <Row icon="help" title="Ajuda" sub="Dúvidas frequentes e atendimento" onPress={() => router.push('/ajuda')} last />
        </View>
      </Section>

      {/* ---------- Sair ---------- */}
      <View style={styles.out}>
        <Button
          kind="danger"
          icon="logout"
          label="Sair"
          onPress={() => {
            app.setLogged(false);
            app.newChat();
            if (router.canDismiss()) router.dismissAll();
            router.navigate('/');
          }}
        />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, backgroundColor: color.surface, gap: 0, paddingTop: 0 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 20, paddingHorizontal: 4 },
  track: { height: 8, borderRadius: 4, backgroundColor: color.surface2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4, backgroundColor: color.waveYellow },
  next: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 4 },
  trophy: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: color.brandTint, alignItems: 'center', justifyContent: 'center' },
  out: { marginHorizontal: -16, paddingHorizontal: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: color.divider },
});
