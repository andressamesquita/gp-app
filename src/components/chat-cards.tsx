import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { CATEGORIES } from '@/data/catalog';
import type { Action, Card, Msg } from '@/state/assistant';
import { useApp } from '@/state/app-state';
import { color, font, kind, radius } from '@/theme/tokens';
import { Icon } from './Icon';
import { Button, Logo, T } from './ui';

/** Cartões que o assistente mostra dentro da conversa. */
export function CardView({ card, msg, onAction }: { card: Card; msg: Msg; onAction: (a: Action) => void }) {
  const app = useApp();
  if (card.type === 'login')
    return (
      <View style={styles.login}>
        <Logo light={false} size={20} />
        {msg.used ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="check" size={16} color={color.good} strokeWidth={2.4} />
            <T v="smallStrong" c={color.good}>
              Você entrou na sua conta
            </T>
          </View>
        ) : (
          <>
            <T v="small" c={color.muted}>
              Toque no botão para entrar na sua conta. Você pode usar gov.br ou ID Piauí.
            </T>
            <Button label="Entrar" icon="lock" onPress={() => router.push({ pathname: '/entrar', params: { from: 'chat' } })} />
          </>
        )}
      </View>
    );
  if (card.type === 'summary')
    return (
      <View style={styles.summary}>
        <T v="h3">
          {card.title}
        </T>
        <View>
          {card.rows.map(([k, v], i) => (
            <View key={k} style={[styles.kv, i === card.rows.length - 1 && { borderBottomWidth: 0 }]}>
              <T v="small" c={color.muted}>
                {k}
              </T>
              <T v="smallStrong">{v}</T>
            </View>
          ))}
        </View>
        <View style={styles.stepsBox}>
          <T v="smallStrong">O que vai acontecer</T>
          {card.steps.map((s, i) => (
            <T key={s} v="small">
              {i + 1}. {s}
            </T>
          ))}
        </View>
        {msg.used ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="check" size={16} color={color.good} strokeWidth={2.4} />
            <T v="smallStrong" c={color.good}>
              Confirmado
            </T>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button label="Confirmar" onPress={() => app.confirm(msg.id, card.confirm)} style={{ flex: 1 }} />
            <Button label="Alterar" kind="secondary" onPress={() =>
                onAction(
                  card.confirm === 'cnh'
                    ? { label: 'Alterar', q: 'Quero mudar o horário do exame' }
                    : { label: 'Alterar', toast: 'Aqui você escolheria outra chave Pix.' },
                )
              } style={{ flex: 1 }} />
          </View>
        )}
      </View>
    );
  if (card.type === 'done')
    return (
      <View style={styles.done}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={styles.tick}>
            <Icon name="check" size={20} color={color.white} strokeWidth={2.6} />
          </View>
          <View style={{ flex: 1 }}>
            <T v="h3">
              {card.title}
            </T>
            <T v="small" c={color.muted}>
              {card.detail} · Protocolo {card.protocol}
            </T>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Button small label="Acompanhar" href="/atividade" />
          <Button small kind="secondary" label="Finalizar conversa" icon="check" onPress={() => app.newChat()} />
        </View>
      </View>
    );
  if (card.type === 'steps')
    return (
      <View style={styles.summary}>
        <T v="h3">
          {card.title}
        </T>
        {card.steps.map((s, i) => (
          <View key={s} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
            <View style={styles.num}>
              <T v="caption" c={color.white} style={{ fontFamily: font.bold }}>
                {i + 1}
              </T>
            </View>
            <T v="small" style={{ flex: 1, paddingTop: 2 }}>
              {s}
            </T>
          </View>
        ))}
        {card.note ? (
          <T v="caption" c={color.muted}>
            {card.note}
          </T>
        ) : null}
      </View>
    );
  return (
    <View style={{ gap: 8 }}>
      {card.items.map((s) => {
        const ci = Math.max(0, CATEGORIES.findIndex((c) => c.id === s.c));
        const k = kind[ci % 4];
        return (
          <Pressable
            key={s.t}
            accessibilityRole="button"
            onPress={() => onAction({ label: s.t, q: s.q })}
            style={({ pressed }) => [styles.svcRow, pressed && { borderColor: color.brand }]}>
            <View style={[styles.svcIco, { backgroundColor: k.bg }]}>
              <Icon name={(CATEGORIES[ci]?.icon ?? 'grid') as never} size={18} color={k.fg} />
            </View>
            <View style={{ flex: 1 }}>
              <T v="smallStrong">
                {s.t}
              </T>
              <T v="caption" c={color.muted}>
                {s.o} · {s.v}
              </T>
            </View>
            <Icon name="right" size={18} color={color.brand} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  login: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line, borderRadius: radius.lg, padding: 16, gap: 12, maxWidth: 300 },
  summary: { backgroundColor: color.surface, borderWidth: 1.5, borderColor: color.brand, borderRadius: radius.lg, padding: 16, gap: 12 },
  kv: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: color.line },
  stepsBox: { backgroundColor: color.bg, borderRadius: radius.md, padding: 12, gap: 4 },
  done: { backgroundColor: color.goodBg, borderRadius: radius.lg, padding: 16, gap: 12 },
  tick: { width: 40, height: 40, borderRadius: 20, backgroundColor: color.good, alignItems: 'center', justifyContent: 'center' },
  num: { width: 22, height: 22, borderRadius: 11, backgroundColor: color.brand, alignItems: 'center', justifyContent: 'center' },
  svcRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60, padding: 12, backgroundColor: color.surface, borderWidth: 1, borderColor: color.line, borderRadius: radius.md },
  svcIco: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});
