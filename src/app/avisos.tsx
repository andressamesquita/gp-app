import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ask } from '@/components/nav';
import { Page } from '@/components/page';
import { Button, Chip, Empty, IconButton, LinkText, T, Tag } from '@/components/ui';
import { avisos } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { color, radius } from '@/theme/tokens';

type F = 'todos' | 'pendente' | 'andamento';

export default function Avisos() {
  const { scenario, cnhStarted } = useApp();
  const all = avisos(scenario, cnhStarted);
  const [f, setF] = useState<F>('todos');
  const list = all.filter((a) => f === 'todos' || a.cat === f);
  const groups = [...new Set(list.map((a) => a.group))];

  return (
    <Page title="Avisos" right={<IconButton tone="bar" icon="sliders" label="Escolher quais avisos receber" onPress={() => router.push('/perfil')} />}>
      {all.length === 0 ? (
        <Empty icon="bell" title="Nenhum aviso por enquanto" text="Avisamos aqui quando houver um prazo, uma novidade ou uma etapa da sua solicitação." action={{ label: 'Escolher quais avisos receber', href: '/perfil' }} />
      ) : (
        <>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <Chip label="Todos" on={f === 'todos'} onPress={() => setF('todos')} />
            <Chip label="Pendentes" on={f === 'pendente'} onPress={() => setF('pendente')} />
            <Chip label="Em andamento" on={f === 'andamento'} onPress={() => setF('andamento')} />
          </View>
          {groups.map((g) => (
            <View key={g} style={{ gap: 10 }}>
              <T v="eyebrow" c={color.muted}>
                {g}
              </T>
              {list
                .filter((a) => a.group === g)
                .map((a) => (
                  <View key={a.id} style={[styles.card, a.tags.includes('Precisa de você') && { borderColor: color.waveYellow, borderWidth: 1.5 }]}>
                    {a.tags.length > 0 && (
                      <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                        {a.tags.map((t) => (
                          <Tag key={t} label={t} tone={t === 'Nova' ? 'dark' : t === 'Pelo WhatsApp' ? 'good' : 'warn'} />
                        ))}
                      </View>
                    )}
                    <T v="bodyStrong">{a.title}</T>
                    <T v="small" c={color.muted}>
                      {a.body}
                    </T>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 2 }}>
                      {a.action && (
                        <Button
                          small
                          kind={a.cat === 'pendente' ? 'primary' : 'secondary'}
                          label={a.action.label}
                          onPress={() => (a.action!.q ? ask(a.action!.q) : router.push(a.action!.to as Href))}
                        />
                      )}
                      {a.why && <LinkText label="Por que recebi isso?" href="/por-que" />}
                    </View>
                  </View>
                ))}
            </View>
          ))}
          <LinkText label="Escolher quais avisos receber e por onde" href="/perfil" icon="right" />
        </>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.line, padding: 16, gap: 6 },
});
