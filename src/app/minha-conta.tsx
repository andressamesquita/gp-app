import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Page } from '@/components/page';
import { Avatar, Button, LinkText, Row, T, tap } from '@/components/ui';
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
    <Page title="Minha conta">
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
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Minhas conquistas: ${earned.length} de ${MEDALS.length}.${next ? ` Próxima: ${next.t}.` : ''} Ver todas`}
        onPress={() => {
          tap();
          router.push('/conquistas');
        }}
        style={({ pressed }) => [styles.card, pressed && { borderColor: color.brand }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={styles.trophy}>
            <Icon name="trophy" size={20} color={color.brand} />
          </View>
          <View style={{ flex: 1 }}>
            <T v="h3">Minhas conquistas</T>
            <T v="small" c={color.muted}>
              {earned.length} de {MEDALS.length} conquistadas
            </T>
          </View>
          <Icon name="right" size={18} color={color.muted} />
        </View>
        <View style={styles.track} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <View style={[styles.fill, { width: `${Math.max(pct * 100, 2)}%` }]} />
        </View>
        {next ? (
          <View style={styles.next}>
            <T v="caption" c={color.muted}>
              Próxima conquista
            </T>
            <T v="smallStrong">{next.t}</T>
            <T v="small" c={color.muted}>
              {next.how}
            </T>
          </View>
        ) : null}
      </Pressable>

      {/* ---------- Conta ---------- */}
      <View style={styles.list}>
        <Row icon="user" title="Meu perfil" sub="Dados pessoais, contato e endereço" onPress={() => router.push('/meu-perfil')} />
        <Row icon="sliders" title="Configurações" sub="Privacidade, avisos e acessibilidade" onPress={() => router.push('/configuracoes')} />
        <Row icon="help" title="Ajuda" sub="Dúvidas frequentes e atendimento" onPress={() => router.push('/ajuda')} last />
      </View>

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
    </Page>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.line },
  card: { padding: 16, gap: 12, backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.line },
  trophy: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: color.brandTint, alignItems: 'center', justifyContent: 'center' },
  track: { height: 8, borderRadius: 4, backgroundColor: color.surface2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4, backgroundColor: color.waveYellow },
  next: { gap: 2, paddingTop: 12, borderTopWidth: 1, borderTopColor: color.divider },
  list: { backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.line, paddingHorizontal: 16, overflow: 'hidden' },
});
