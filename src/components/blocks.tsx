import { ask } from '@/components/nav';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';

import { CATEGORIES, type Service } from '@/data/catalog';
import { WALLET_TONES, type Medal, type Request, type WalletDoc } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { color, font, kind, radius } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { Button, T, Tag, statusTone, tap } from './ui';

/* =========================================================
   Carteira em pilha (mesmo comportamento da web: toque no
   cartão de trás para trazê-lo à frente; toque na frente abre)
   ========================================================= */
const CARD_H = 158;
const STEP = 34;

export function WalletStack({ docs, onOpen, front, onFront }: { docs: WalletDoc[]; onOpen: (d: WalletDoc) => void; front?: string; onFront?: (id: string) => void }) {
  const [order, setOrder] = useState(docs.map((d) => d.id));
  const anims = useRef(new Map<string, Animated.Value>()).current;
  docs.forEach((d) => {
    if (!anims.has(d.id)) anims.set(d.id, new Animated.Value(Math.min(Math.max(order.indexOf(d.id), 0), 3)));
  });

  const idsKey = docs.map((d) => d.id).join(',');
  useEffect(() => {
    setOrder(idsKey ? idsKey.split(',') : []);
  }, [idsKey]);

  useEffect(() => {
    if (front && order[0] !== front && order.includes(front)) setOrder((o) => [front, ...o.filter((x) => x !== front)]);
  }, [front]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (order[0]) onFront?.(order[0]);
  }, [order]); // eslint-disable-line react-hooks/exhaustive-deps

  // Anima só as carteiras que mudaram de posição. Sem native driver: com várias
  // carteiras (ex.: modo "Após concluir"), o driver nativo entrava em laço de
  // atualização no Android ("Maximum update depth exceeded").
  const lastDepth = useRef(new Map<string, number>()).current;
  useEffect(() => {
    order.forEach((id, depth) => {
      const v = anims.get(id);
      if (!v || lastDepth.get(id) === depth) return;
      lastDepth.set(id, depth);
      Animated.spring(v, { toValue: Math.min(depth, 3), useNativeDriver: false, damping: 18, stiffness: 160 }).start();
    });
  }, [order, anims, lastDepth]);

  const visible = Math.min(docs.length, 3);
  const height = CARD_H + STEP * (visible - 1);

  // Interpolações criadas uma vez por carteira (estáveis entre renderizações)
  const interp = useRef(new Map<string, { translateY: Animated.AnimatedInterpolation<number>; scale: Animated.AnimatedInterpolation<number>; opacity: Animated.AnimatedInterpolation<number>; visible: number }>()).current;
  const getInterp = (id: string) => {
    const cached = interp.get(id);
    if (cached && cached.visible === visible) return cached;
    const a = anims.get(id)!;
    const next = {
      visible,
      translateY: a.interpolate({ inputRange: [0, 1, 2, 3], outputRange: [STEP * (visible - 1), STEP * (visible - 2), STEP * (visible - 3), STEP * (visible - 3)], extrapolate: 'clamp' }),
      scale: a.interpolate({ inputRange: [0, 1, 2, 3], outputRange: [1, 0.95, 0.9, 0.86], extrapolate: 'clamp' }),
      opacity: a.interpolate({ inputRange: [0, 2, 3], outputRange: [1, 1, 0], extrapolate: 'clamp' }),
    };
    interp.set(id, next);
    return next;
  };

  return (
    <View style={{ height }} accessibilityLabel={`Carteira com ${docs.length} documentos`}>
      {[...order].reverse().map((id) => {
        const d = docs.find((x) => x.id === id);
        if (!d) return null;
        const depth = order.indexOf(id);
        const { translateY, scale, opacity } = getInterp(id);
        return (
          <Animated.View
            key={id}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, transform: [{ translateY }, { scale }], opacity, zIndex: 10 - depth }}
            pointerEvents={depth > 2 ? 'none' : 'auto'}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={depth === 0 ? `Abrir ${d.title}` : `Trazer ${d.title} para a frente`}
              onPress={() => {
                tap();
                if (depth === 0) onOpen(d);
                else setOrder((o) => [id, ...o.filter((x) => x !== id)]);
              }}>
              <WalletCard doc={d} compact />
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
}

export function WalletCard({ doc, compact }: { doc: WalletDoc; compact?: boolean }) {
  const tone = WALLET_TONES[doc.tone];
  return (
    <View style={[styles.wcard, { backgroundColor: tone.bg, height: compact ? CARD_H : undefined, minHeight: compact ? undefined : 210 }]}>
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
        <Path d="M-10 150C60 110 120 190 200 140S300 90 340 120" stroke="#fff" strokeOpacity={0.14} strokeWidth={1.4} fill="none" />
        <Path d="M-10 175C60 135 120 215 200 165S300 115 340 145" stroke="#fff" strokeOpacity={0.1} strokeWidth={1.4} fill="none" />
        <Circle cx={300} cy={-10} r={90} fill="#fff" fillOpacity={0.07} />
      </Svg>
      <View style={styles.wtop}>
        <T v="eyebrow" c={tone.ink} style={{ opacity: 0.9 }}>
          {doc.kicker}
        </T>
        {doc.status ? (
          <View style={styles.wstatus}>
            <T v="caption" c={tone.ink} style={{ fontFamily: font.semibold }}>
              {doc.status}
            </T>
          </View>
        ) : null}
      </View>
      <T v={compact ? 'h2' : 'h1'} c={tone.ink} style={{ marginTop: 2 }}>
        {doc.title}
      </T>
      <T v="small" c={tone.ink} style={{ opacity: 0.9 }}>
        {doc.sub}
      </T>
      <View style={{ flex: 1 }} />
      {compact ? (
        <View>
          <T v="small" c={tone.ink} style={{ opacity: 0.9 }}>
            Ana Souza
          </T>
          <T v="bodyStrong" c={tone.ink} style={{ letterSpacing: 1.2 }}>
            •••• {doc.number}
          </T>
        </View>
      ) : (
        <View style={{ gap: 8, marginTop: 16 }}>
          {doc.fields.map(([k, v]) => (
            <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              <T v="small" c={tone.ink} style={{ opacity: 0.85 }}>
                {k}
              </T>
              <T v="smallStrong" c={tone.ink}>
                {v}
              </T>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

/* =========================================================
   Medalhas (círculo, quadrado e hexágono, como na web)
   ========================================================= */
export function MedalBadge({ m, earned, size = 58 }: { m: Medal; earned: boolean; size?: number }) {
  const k = kind[m.k];
  const fill = earned ? k.bg : color.surface2;
  const stroke = earned ? k.ring : color.lineStrong;
  const dash = earned ? undefined : '4 4';
  const s = size;
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={s} height={s} style={StyleSheet.absoluteFill}>
        {m.shape === 'c' && <Circle cx={s / 2} cy={s / 2} r={s / 2 - 2} fill={fill} stroke={stroke} strokeWidth={2} strokeDasharray={dash} />}
        {m.shape === 'q' && <Rect x={2} y={2} width={s - 4} height={s - 4} rx={16} fill={fill} stroke={stroke} strokeWidth={2} strokeDasharray={dash} />}
        {m.shape === 'h' && (
          <Polygon
            points={`${s * 0.25},${s * 0.05} ${s * 0.75},${s * 0.05} ${s * 0.98},${s / 2} ${s * 0.75},${s * 0.95} ${s * 0.25},${s * 0.95} ${s * 0.02},${s / 2}`}
            fill={fill}
            stroke={stroke}
            strokeWidth={2}
            strokeDasharray={dash}
            strokeLinejoin="round"
          />
        )}
      </Svg>
      <View style={{ zIndex: 1 }}>
        <Icon name={earned ? m.icon : 'lock'} size={s * 0.4} color={earned ? k.fg : color.muted} />
      </View>
    </View>
  );
}

export function MedalGrid({ medals, earned, onPress }: { medals: Medal[]; earned: string[]; onPress?: (m: Medal) => void }) {
  return (
    <View style={styles.medals}>
      {medals.map((m) => {
        const on = earned.includes(m.id);
        return (
          <Pressable
            key={m.id}
            accessibilityRole="button"
            accessibilityLabel={`${m.t}. ${on ? 'Conquistada' : `Como ganhar: ${m.how}`}`}
            onPress={() => onPress?.(m)}
            style={styles.medal}>
            <MedalBadge m={m} earned={on} />
            <T v="smallStrong" c={on ? color.ink : color.muted} style={{ textAlign: 'center' }}>
              {m.t}
            </T>
            <T v="caption" c={on ? color.good : color.muted} style={{ textAlign: 'center' }}>
              {on ? 'Conquistada' : 'A conquistar'}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

/* =========================================================
   Solicitação com etapas (acordeão)
   ========================================================= */
export function RequestCard({ r, open: openInit = false, showActions = true }: { r: Request; open?: boolean; showActions?: boolean }) {
  const [open, setOpen] = useState(openInit);
  const { showToast: toast } = useApp();
  const fin = /conclu/i.test(r.status);
  return (
    <View style={[styles.rq, open && { borderColor: fin ? color.good : color.brand, borderWidth: 1.5 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${r.title}, ${r.status}. ${r.summary}`}
        onPress={() => {
          tap();
          setOpen((o) => !o);
        }}
        style={styles.rqHead}>
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <T v="h3">
              {r.title}
            </T>
            <Tag label={r.status} tone={statusTone(r.status)} />
          </View>
          <T v="small" c={open ? color.brand : color.muted} style={open ? { fontFamily: font.semibold } : undefined}>
            {r.summary}
          </T>
        </View>
        <View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
          <Icon name="down" size={20} color={color.muted} />
        </View>
      </Pressable>
      {open && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}>
          <T v="caption" c={color.muted}>
            Protocolo {r.protocol}
          </T>
          {r.fields && (
            <View>
              {r.fields.map(([k, v]) => (
                <View key={k} style={styles.kv}>
                  <T v="smallStrong">{k}:</T>
                  <T v="small" c={color.muted} style={{ flex: 1, textAlign: 'right' }}>
                    {v}
                  </T>
                </View>
              ))}
            </View>
          )}
          {showActions && (
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {fin && r.id === 'cnh' ? (
                <>
                  <Button small label="Ver CNH na carteira" href="/carteira" />
                  <Button small kind="secondary" label="Compartilhar conquista" href="/compartilhar" />
                </>
              ) : fin ? (
                <Button small kind="secondary" label="Ver na carteira" href="/carteira" />
              ) : (
                <>
                  {r.action && <Button small label={r.action.label} onPress={() => (r.action!.q ? ask(r.action!.q) : r.action!.toast && toast(r.action!.toast))} />}
                  <Button small kind={r.action ? 'secondary' : 'primary'} label="Falar sobre esta solicitação" onPress={() => ask(`Como está a ${r.title.toLowerCase()}?`)} />
                </>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

/** Barra de etapas com o nome de cada uma embaixo (como na área do cidadão web). */
export function StepBar({ steps, fin }: { steps: Request['steps']; fin?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }} accessibilityLabel={steps.map((s) => `${s.t}: ${s.s === 'done' ? 'feito' : s.s === 'current' ? 'agora' : 'a fazer'}`).join(', ')}>
      {steps.map((s, i) => (
        <View key={i} style={{ flex: 1, gap: 6 }}>
          <View style={{ height: 6, borderRadius: 3, backgroundColor: s.s === 'done' ? (fin ? color.good : color.brand) : s.s === 'current' ? color.waveYellow : color.line }} />
          <T v="caption" c={s.s === 'current' ? color.ink : color.muted} style={{ fontFamily: s.s === 'current' ? font.semibold : font.regular }}>
            {s.t}
          </T>
        </View>
      ))}
    </View>
  );
}

export function Timeline({ steps, fin }: { steps: Request['steps']; fin?: boolean }) {
  return (
    <View>
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        const dotBg = s.s === 'done' ? (fin ? color.good : color.brand) : s.s === 'current' ? color.warnBg : color.surface;
        const dotBorder = s.s === 'done' ? dotBg : s.s === 'current' ? color.waveYellow : color.lineStrong;
        return (
          <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ alignItems: 'center', width: 24 }}>
              <View style={[styles.dot, { backgroundColor: dotBg, borderColor: dotBorder }]}>
                {s.s === 'done' && <Icon name="check" size={14} color={color.white} strokeWidth={2.6} />}
                {s.s === 'current' && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#8A5A00' }} />}
              </View>
              {!last && <View style={{ flex: 1, width: 2, backgroundColor: color.line, marginVertical: 2 }} />}
            </View>
            <View style={{ flex: 1, paddingBottom: last ? 0 : 14, gap: 2 }}>
              <T v="smallStrong" c={s.s === 'todo' ? color.muted : color.ink}>
                {s.t}
              </T>
              {s.d ? (
                <T v="small" c={color.muted}>
                  {s.d}
                </T>
              ) : null}
              {s.via ? <Tag label={s.via} tone="good" /> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

/* =========================================================
   Cartão de serviço (catálogo)
   ========================================================= */
export function ServiceCard({ s, onPress }: { s: Service; onPress: () => void }) {
  const { favorites, toggleFavorite, showToast, logged } = useApp();
  const ci = Math.max(0, CATEGORIES.findIndex((c) => c.id === s.c));
  const cat = CATEGORIES[ci];
  const k = kind[ci % 4];
  const fav = favorites.includes(s.t);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${s.t}. ${s.d}. ${s.o}`}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.svc, pressed && { borderColor: color.brand, transform: [{ scale: 0.99 }] }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={[styles.svcIco, { backgroundColor: k.bg }]}>
          <Icon name={(cat?.icon ?? 'grid') as IconName} size={18} color={k.fg} />
        </View>
        <T v="caption" c={color.muted} style={{ flex: 1 }} numberOfLines={1}>
          {cat?.t}
        </T>
        {/* Favoritar só com login */}
        {logged && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={fav ? `Remover dos favoritos: ${s.t}` : `Favoritar: ${s.t}`}
            hitSlop={10}
            onPress={() => {
              tap();
              toggleFavorite(s.t);
              showToast(fav ? 'Removido dos favoritos.' : 'Adicionado aos favoritos.');
            }}
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: -8 }}>
            <Icon name={fav ? 'starFill' : 'star'} size={20} color={fav ? color.waveYellow : color.muted} />
          </Pressable>
        )}
      </View>
      <T v="h3">
        {s.t}
      </T>
      <T v="small" c={color.muted} numberOfLines={2}>
        {s.d}
      </T>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
        <View style={styles.org}>
          <T v="caption" style={{ fontFamily: font.medium }}>
            {s.o}
          </T>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <T v="label" c={color.brand}>
            {s.v}
          </T>
          <Icon name="right" size={16} color={color.brand} />
        </View>
      </View>
    </Pressable>
  );
}

/**
 * Cartão de serviço compacto (carrossel "Mais acessados").
 * Hierarquia: 1) nome do serviço, 2) o que resolve, 3) órgão e ação.
 */
export function ServiceCardCompact({ s, onPress }: { s: Service; onPress: () => void }) {
  const { favorites, toggleFavorite, showToast, logged } = useApp();
  const ci = Math.max(0, CATEGORIES.findIndex((c) => c.id === s.c));
  const cat = CATEGORIES[ci];
  const k = kind[ci % 4];
  const fav = favorites.includes(s.t);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${s.t}. ${s.d}. ${s.o}. ${s.v}`}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.svcC, pressed && { borderColor: color.brand, transform: [{ scale: 0.98 }] }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={[styles.svcIcoC, { backgroundColor: k.bg }]}>
          <Icon name={(cat?.icon ?? 'grid') as IconName} size={18} color={k.fg} />
        </View>
        {/* Favoritar só com login */}
        {logged && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={fav ? `Remover dos favoritos: ${s.t}` : `Favoritar: ${s.t}`}
            hitSlop={8}
            onPress={() => {
              tap();
              toggleFavorite(s.t);
              showToast(fav ? 'Removido dos favoritos.' : 'Adicionado aos favoritos.');
            }}
            style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: -8 }}>
            <Icon name={fav ? 'starFill' : 'star'} size={18} color={fav ? color.waveYellow : color.muted} />
          </Pressable>
        )}
      </View>
      <T v="bodyStrong" numberOfLines={2} style={{ minHeight: 40 }}>
        {s.t}
      </T>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, gap: 6 }}>
        <View style={[styles.org, { flexShrink: 1 }]}>
          <T v="caption" numberOfLines={1} style={{ fontFamily: font.medium, fontSize: 10, letterSpacing: 0.3 }}>
            {s.o}
          </T>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <T v="label" c={color.brand}>
            {s.v}
          </T>
          <Icon name="right" size={14} color={color.brand} />
        </View>
      </View>
    </Pressable>
  );
}

/**
 * Convite do Prisma Lab (Início e Ajuda).
 * Hierarquia: etiqueta → título do cartão → apoio → passos → ação.
 */
export function PrismaCard({ onPress, compact }: { onPress: () => void; compact?: boolean }) {
  return (
    <View style={styles.prisma}>
      <View style={styles.prismaTag}>
        <Svg width={13} height={13} viewBox="0 0 24 24">
          <Path d="M12 4 21 20H3z" fill="none" stroke={color.brand} strokeWidth={2.4} strokeLinejoin="round" />
        </Svg>
        <T v="label" c={color.brand} style={{ fontSize: 11 }}>
          Prisma Lab
        </T>
      </View>
      <View style={{ gap: 4 }}>
        <T v="title" accessibilityRole="header">
          Ajude a desenhar o futuro do Piauí
        </T>
        <T v="small" c={color.muted}>
          Teste novidades antes de todo mundo e diga o que pode melhorar.
        </T>
      </View>
      {/* Versão compacta (Início): só etiqueta, título, uma linha e o botão. Os passos ficam na Ajuda. */}
      {!compact && (
        <View style={{ gap: 10, marginTop: 2 }}>
          {['Cadastre-se como colaborador', 'Teste serviços novos e dê sua opinião', 'Acompanhe sua sugestão virar melhoria'].map((t, i) => (
            <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={styles.prismaNum}>
                <T v="label" c={color.white}>
                  {i + 1}
                </T>
              </View>
              <T v="small" style={{ flex: 1 }}>
                {t}
              </T>
            </View>
          ))}
        </View>
      )}
      <Button label={compact ? 'Conhecer o Prisma Lab' : 'Quero participar'} iconRight="arrowRight" onPress={onPress} style={{ marginTop: compact ? 2 : 6 }} />
    </View>
  );
}

/** Cartão compacto de "Para mim" (rolagem horizontal). */
export function ForMeCard({
  title,
  text,
  cta,
  onPress,
  urgent,
  bar,
}: {
  title: string;
  text: string;
  cta: string;
  onPress: () => void;
  urgent?: boolean;
  bar: string;
}) {
  return (
    // Mesmo contorno dos outros cards; o destaque fica só na etiqueta amarela "Precisa de você"
    <View style={styles.mine}>
      {urgent && (
        <View style={styles.utag}>
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: color.waveOrange }} />
          <T v="eyebrow" c={color.warnInk}>
            PRECISA DE VOCÊ
          </T>
        </View>
      )}
      <T v="h3">
        {title}
      </T>
      <T v="small" c={color.muted} style={{ flex: 1 }}>
        {text}
      </T>
      {/* Ação no mesmo padrão dos cards de serviço: texto azul + seta, à direita */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${cta}: ${title}`}
        hitSlop={8}
        onPress={() => {
          tap();
          onPress();
        }}
        style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 2, alignSelf: 'flex-end', minHeight: 32, marginTop: 4 }, pressed && { opacity: 0.6 }]}>
        <T v="label" c={color.brand}>
          {cta}
        </T>
        <Icon name="right" size={14} color={color.brand} />
      </Pressable>
    </View>
  );
}

/** Barra de progresso da Jornada. */
export function ProgressBar({ done, total, on }: { done: number; total: number; on?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i < done ? (on ? color.waveYellow : color.good) : on ? 'rgba(255,255,255,0.28)' : color.line }} />
      ))}
    </View>
  );
}

export function useServiceOpen() {
  return useMemo(
    () => (s: Service) => ask(s.q),
    [],
  );
}

const styles = StyleSheet.create({
  wcard: { borderRadius: radius.sm, padding: 16, overflow: 'hidden' },
  wtop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  wstatus: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  medals: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 16 },
  medal: { width: '33.33%', alignItems: 'center', gap: 6, paddingHorizontal: 4 },
  kv: { flexDirection: 'row', gap: 12, paddingVertical: 9, borderTopWidth: 1, borderTopColor: color.line },
  rq: { backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.line },
  rqHead: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, minHeight: 64 },
  progress: { flexDirection: 'row', gap: 4, marginTop: 6 },
  pbar: { flex: 1, height: 5, borderRadius: 3 },
  dot: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  svc: { backgroundColor: color.surface, borderRadius: radius.sm, borderWidth: 1, borderColor: color.line, padding: 14, gap: 6 },
  svcIco: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  svcC: { width: 224, backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.line, padding: 14, paddingTop: 12, gap: 6 },
  svcIcoC: { width: 34, height: 34, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  prisma: { backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.line, padding: 18, gap: 12 },
  prismaTag: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: color.brandTint, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  prismaNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: color.brand, alignItems: 'center', justifyContent: 'center' },
  org: { backgroundColor: color.surface2, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  mine: {
    width: 220,
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.line,
    padding: 14,
    gap: 6,
    overflow: 'hidden',
  },
  utag: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: color.warnBg, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 3 },
});
