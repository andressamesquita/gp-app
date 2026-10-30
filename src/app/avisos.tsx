import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ask } from '@/components/nav';
import { FlatBlock, Page } from '@/components/page';
import { Button, Chip, Empty, LinkText, T, Tag } from '@/components/ui';
import { avisos, avisosRecomendados } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { color } from '@/theme/tokens';

type F = 'todos' | 'pendente' | 'recomendado';

/**
 * Para mim: o que precisa da pessoa e o que é indicado para ela.
 * O que está em andamento fica em Acompanhamento (Área do cidadão), não aqui.
 * Padrão sem cards: blocos separados por divisórias.
 */
export default function ParaMim() {
  const { scenario, cnhStarted } = useApp();
  const all = [...avisos(scenario, cnhStarted).filter((a) => a.cat !== 'andamento'), ...avisosRecomendados(scenario)];
  const [f, setF] = useState<F>('todos');
  const list = all.filter((a) => f === 'todos' || a.cat === f);
  const groups = [...new Set(list.map((a) => a.group))];

  return (
    <Page title="Para mim" flat>
      {all.length === 0 ? (
        <View style={{ paddingTop: 16 }}>
          <Empty icon="bell" title="Nada por aqui ainda" text="Avisamos aqui quando houver um prazo, uma novidade ou um serviço indicado para você." action={{ label: 'Escolher quais avisos receber', href: '/configuracoes' }} />
        </View>
      ) : (
        <>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', paddingVertical: 16 }} accessibilityRole="tablist">
            <Chip label="Todos" on={f === 'todos'} onPress={() => setF('todos')} />
            <Chip label="Pendentes" on={f === 'pendente'} onPress={() => setF('pendente')} />
            <Chip label="Recomendados" on={f === 'recomendado'} onPress={() => setF('recomendado')} />
          </View>
          {groups.map((g) => (
            <FlatBlock key={g} style={{ gap: 0, paddingBottom: 4 }}>
              <T v="eyebrow" c={color.muted} style={{ marginBottom: 4 }}>
                {g}
              </T>
              {list
                .filter((a) => a.group === g)
                .map((a, i, arr) => (
                  <View key={a.id} style={[styles.item, i < arr.length - 1 && styles.itemLine]}>
                    {a.tags.length > 0 && (
                      <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                        {a.tags.map((t) => (
                          <Tag key={t} label={t} tone={t === 'Nova' ? 'dark' : t === 'Pelo WhatsApp' ? 'good' : a.cat === 'recomendado' ? 'brand' : 'warn'} />
                        ))}
                      </View>
                    )}
                    <T v="bodyStrong">{a.title}</T>
                    <T v="small" c={color.muted}>
                      {a.body}
                    </T>
                    {a.action || a.why ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
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
                    ) : null}
                  </View>
                ))}
            </FlatBlock>
          ))}
          <FlatBlock>
            <LinkText label="Escolher quais avisos receber e por onde" href="/configuracoes" icon="right" />
          </FlatBlock>
        </>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  item: { gap: 6, paddingVertical: 16 },
  itemLine: { borderBottomWidth: 1, borderBottomColor: color.divider },
});
