import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { ask } from '@/components/nav';
import { Page } from '@/components/page';
import { Chip, Empty, LinkText, T, Tag, tap } from '@/components/ui';
import { avisos, avisosRecomendados } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { color, radius } from '@/theme/tokens';

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
    <Page title="Para mim" flat contentStyle={{ backgroundColor: '#F5F8FC', flexGrow: 1 }}>
      {all.length === 0 ? (
        <View style={{ paddingTop: 16 }}>
          <Empty icon="bell" title="Nada por aqui ainda" text="Avisamos aqui quando houver um prazo, uma novidade ou um serviço indicado para você." action={{ label: 'Escolher quais avisos receber', href: '/configuracoes' }} />
        </View>
      ) : (
        <>
          {/* Filtros em faixa branca, como em Serviços */}
          <View style={styles.chips} accessibilityRole="tablist">
            <Chip label="Todos" on={f === 'todos'} onPress={() => setF('todos')} />
            <Chip label="Pendentes" on={f === 'pendente'} onPress={() => setF('pendente')} />
            <Chip label="Recomendados" on={f === 'recomendado'} onPress={() => setF('recomendado')} />
          </View>
          {/* Lista em cards sobre o azul bem claro, no mesmo layout dos cards de Serviços */}
          <View style={{ gap: 20, paddingTop: 16 }}>
            {groups.map((g) => {
              const itens = list.filter((a) => a.group === g);
              return (
                <View key={g} style={{ gap: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <T v="h2" accessibilityRole="header">
                      {g}
                    </T>
                    <T v="caption" c={color.muted}>
                      {itens.length} {itens.length === 1 ? 'item' : 'itens'}
                    </T>
                  </View>
                  {itens.map((a) => {
                    const k = KIND[a.cat];
                    const urgente = a.tags.includes('Precisa de você');
                    const chip = a.tags.find((t) => t !== 'Nova' && t !== KIND[a.cat].label);
                    const run = () => (a.action ? (a.action.q ? ask(a.action.q) : router.push(a.action.to as Href)) : undefined);
                    return (
                      <Pressable
                        key={a.id}
                        accessibilityRole="button"
                        accessibilityLabel={`${a.title}. ${a.body}${a.action ? `. ${a.action.label}` : ''}`}
                        onPress={() => {
                          tap();
                          run();
                        }}
                        style={({ pressed }) => [styles.card, urgente && styles.cardUrgente, pressed && { borderColor: color.brand }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <View style={[styles.ico, { backgroundColor: k.bg }]}>
                            <Icon name={k.icon} size={18} color={k.fg} />
                          </View>
                          <T v="caption" c={color.muted} style={{ flex: 1 }} numberOfLines={1}>
                            {k.label}
                          </T>
                          {a.tags.includes('Nova') ? <Tag label="Nova" tone="dark" /> : null}
                        </View>
                        <T v="h3">{a.title}</T>
                        <T v="small" c={color.muted} numberOfLines={2}>
                          {a.body}
                        </T>
                        {a.why ? <LinkText label="Por que recebi isso?" href="/por-que" /> : null}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, gap: 8 }}>
                          {chip ? <Tag label={chip} tone={urgente ? 'warn' : a.cat === 'recomendado' ? 'brand' : 'muted'} /> : <View />}
                          {a.action ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <T v="label" c={color.brand}>
                                {a.action.label}
                              </T>
                              <Icon name="right" size={16} color={color.brand} />
                            </View>
                          ) : null}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              );
            })}
            <LinkText label="Escolher quais avisos receber e por onde" href="/configuracoes" icon="right" />
          </View>
        </>
      )}
    </Page>
  );
}

/* Ícone e rótulo de cada tipo, no lugar da categoria dos cards de Serviços */
const KIND: Record<'pendente' | 'andamento' | 'info' | 'recomendado', { icon: IconName; label: string; bg: string; fg: string }> = {
  pendente: { icon: 'alert', label: 'Precisa de você', bg: color.warnBg, fg: color.warnInk },
  andamento: { icon: 'clock', label: 'Em andamento', bg: color.brandTint, fg: color.brand },
  info: { icon: 'info', label: 'Aviso', bg: color.brandTint, fg: color.brand },
  recomendado: { icon: 'spark', label: 'Indicado para você', bg: color.goodBg, fg: color.good },
};

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginHorizontal: -16, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: color.surface, borderBottomWidth: 1, borderBottomColor: color.divider },
  card: { backgroundColor: color.surface, borderRadius: radius.sm, borderWidth: 1, borderColor: color.line, padding: 14, gap: 6 },
  cardUrgente: { borderColor: color.waveYellow, borderWidth: 1.5 },
  ico: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});
