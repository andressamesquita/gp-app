import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { MedalGrid } from '@/components/blocks';
import { FlatBlock, Page } from '@/components/page';
import { Avatar, Button, Section, T } from '@/components/ui';
import { MEDALS, PERSON, earnedMedals } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { color } from '@/theme/tokens';

/** Minhas conquistas: abre ao tocar na foto (AS) da Área do cidadão. */
export default function Conquistas() {
  const app = useApp();
  const earned = useMemo(() => {
    const e = earnedMedals(app.scenario);
    if (app.prefs.zapAvisos) e.push('zap');
    if (app.posts.some((x) => x.status === 'publicada')) e.push('publicou');
    return e;
  }, [app.scenario, app.prefs.zapAvisos, app.posts]);
  const pct = earned.length / MEDALS.length;

  return (
    <Page title="Minhas conquistas" flat>
      <View style={styles.head}>
        <Avatar initials={PERSON.initials} size={56} uri={app.photo} />
        <View style={{ flex: 1, gap: 6 }}>
          <T v="h2">{PERSON.name}</T>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <T v="small" c={color.muted}>
              Conta {PERSON.level}
            </T>
            <T v="smallStrong">
              {earned.length} de {MEDALS.length} conquistas
            </T>
          </View>
          <View style={styles.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: MEDALS.length, now: earned.length }}>
            <View style={[styles.fill, { width: `${Math.max(pct * 100, 2)}%` }]} />
          </View>
        </View>
      </View>

      <Section title="Medalhas">
        <MedalGrid medals={MEDALS} earned={earned} onPress={(m) => app.showToast(earned.includes(m.id) ? `${m.t}: conquistada!` : `Como ganhar: ${m.how}`)} />
        <T v="small" c={color.muted}>
          Toque numa medalha para ver como ganhar. Complete serviços pelo Gov.pi para conquistar mais.
        </T>
      </Section>

      <FlatBlock>
        <Button kind="secondary" label="Compartilhar uma conquista" onPress={() => router.push('/compartilhar')} />
      </FlatBlock>
    </Page>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 20, paddingHorizontal: 4 },
  track: { height: 8, borderRadius: 4, backgroundColor: color.surface2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4, backgroundColor: color.waveYellow },
});
