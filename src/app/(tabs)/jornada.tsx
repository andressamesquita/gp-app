import { ask } from '@/components/nav';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { MedalGrid, ProgressBar } from '@/components/blocks';
import { Icon } from '@/components/Icon';
import { TabTop } from '@/components/page';
import { Section, T, Tag, statusTone, tap } from '@/components/ui';
import { MEDALS, earnedMedals, moments } from '@/data/mock';
import { LoginInvite } from '@/components/login-invite';
import { useStatusBar } from '@/components/statusbar';
import { useApp } from '@/state/app-state';
import { color, radius } from '@/theme/tokens';

function JornadaLogged() {
  const { scenario, cnhStarted, showToast } = useApp();
  const list = moments(scenario, cnhStarted);
  const [sel, setSel] = useState('condutora');
  const m = list.find((x) => x.id === sel) ?? list[0];
  const earned = earnedMedals(scenario);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: color.surface }} contentContainerStyle={{ paddingBottom: 44 }}>
      <TabTop title="Minha jornada" sub="Seus momentos de vida e os serviços do Governo ligados a cada um." />

      <View style={{ padding: 16, gap: 16 }}>
        <View style={styles.news}>
          <Tag label="Novidade" tone="warn" />
          <T v="bodyStrong">Inscrições do SISU abertas até 30/10</T>
          <T v="small" c={color.muted}>
            Educação · veja datas e documentos.
          </T>
          <Pressable accessibilityRole="link" onPress={() => ask('Como faço a inscrição no SISU?')} style={{ minHeight: 36, justifyContent: 'center' }}>
            <T v="smallStrong" c={color.brand}>
              Perguntar ao assistente
            </T>
          </Pressable>
        </View>

        <T v="h2">Seus momentos</T>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }} style={{ marginHorizontal: -16 }} contentInset={{ left: 16 }}>
          <View style={{ width: 6 }} />
          {list.map((x) => {
            const on = x.id === m.id;
            const done = x.services.filter((s) => s.status === 'Concluído').length;
            const total = x.services.filter((s) => s.status !== 'Não se aplica').length;
            return (
              <Pressable
                key={x.id}
                accessibilityRole="button"
                accessibilityState={{ selected: on, disabled: !x.applies }}
                disabled={!x.applies}
                onPress={() => {
                  tap();
                  setSel(x.id);
                }}
                style={[styles.mo, on && styles.moOn, !x.applies && styles.moOff]}>
                <Icon name={x.icon} size={24} color={on ? color.white : x.applies ? color.brand : color.muted} />
                <T v="bodyStrong" c={on ? color.white : x.applies ? color.ink : color.muted}>
                  {x.t}
                </T>
                {x.applies ? (
                  <>
                    <T v="caption" c={on ? 'rgba(255,255,255,0.88)' : color.muted}>
                      {done} de {total} concluídos
                    </T>
                    <ProgressBar done={done} total={total} on={on} />
                  </>
                ) : (
                  <T v="caption" c={color.muted}>
                    Não se aplica agora
                  </T>
                )}
              </Pressable>
            );
          })}
          <View style={{ width: 6 }} />
        </ScrollView>

        <Section flat title={m.t}>
          {m.services.map((s) => {
            const actionable = !!s.q;
            return (
              <Pressable
                key={s.t}
                disabled={!actionable && s.status !== 'Em andamento'}
                accessibilityRole="button"
                onPress={() => {
                  tap();
                  if (s.q) ask(s.q);
                  else router.push('/atividade');
                }}
                style={({ pressed }) => [styles.srv, pressed && { borderColor: color.brand }, s.status === 'Não se aplica' && { opacity: 0.7, borderStyle: 'dashed' }]}>
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <T v="bodyStrong">
                      {s.t}
                    </T>
                    <Tag label={s.status} tone={statusTone(s.status)} />
                  </View>
                  <T v="small" c={color.muted}>
                    {s.d}
                  </T>
                </View>
                {(actionable || s.status === 'Em andamento') && <Icon name="right" size={18} color={color.brand} />}
              </Pressable>
            );
          })}
        </Section>

        <Section flat title="Conquistas">
          <MedalGrid medals={MEDALS} earned={earned} onPress={(md) => showToast(earned.includes(md.id) ? `${md.t}: conquistada!` : `Como ganhar: ${md.how}`)} />
        </Section>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  news: { backgroundColor: color.brandTint, borderWidth: 1, borderColor: '#B9CFE8', borderRadius: radius.lg, padding: 16, gap: 6 },
  mo: { width: 168, minHeight: 132, padding: 14, gap: 8, borderRadius: radius.lg, borderWidth: 1, borderColor: color.line, backgroundColor: color.surface },
  moOn: { backgroundColor: color.navy, borderColor: color.navy },
  moOff: { backgroundColor: color.surface2, borderStyle: 'dashed' },
  srv: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.md, borderWidth: 1, borderColor: color.line, backgroundColor: color.surface },
});

export default function Jornada() {
  const { logged } = useApp();
  useStatusBar('light', color.brand);
  return logged ? <JornadaLogged /> : <LoginInvite kind="jornada" />;
}
