import { router } from 'expo-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Image, Pressable, ScrollView, StyleSheet, View, type ImageSourcePropType, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ServiceCardCompact } from '@/components/blocks';
import { ChatHistoryButton, ChatHistorySheet } from '@/components/chat-history';
import { BlueBackdrop } from '@/components/hero';
import { Icon } from '@/components/Icon';
import { ask, askVoice } from '@/components/nav';
import { Robot } from '@/components/Robot';
import { useStatusBar } from '@/components/statusbar';
import { Avatar, Button, IconButton, LinkText, Logo, Row, T, tap } from '@/components/ui';
import { SERVICES } from '@/data/catalog';
import { PERSON } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { color, font, radius } from '@/theme/tokens';

/* ---------------- Banners ---------------- */
type Banner = { id: string; img: ImageSourcePropType; label: string; onPress: () => void };

/* ---------------- Sugestões abaixo do campo ---------------- */
const SUGESTOES = ['Renovar minha CNH', 'Meu remédio acabou', 'Nota Piauiense'];

/* ---------------- Mais acessados ---------------- */
const MAIS_ACESSADOS = [
  'Renovar CNH',
  'Emitir CRLV digital do veículo',
  'Resgatar créditos da Nota Piauiense',
  'Marcar uma consulta',
  'Segunda via da conta de água',
  'Boletim escolar',
];

export default function Inicio() {
  const app = useApp();
  const insets = useSafeAreaInsets();
  useStatusBar('light', color.brand);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [searchY, setSearchY] = useState(400);
  const [stuck, setStuck] = useState(false);
  const [history, setHistory] = useState(false);
  const stickAt = Math.max(1, searchY - 28 - insets.top - 8); // 28 = margem negativa do campo sobre o topo azul

  const banners: Banner[] = [
    {
      id: 'turismo',
      img: require('../../../assets/banners/turismo.jpg'),
      label: 'Conheça o Piauí na palma da mão. Baixe o app Piauí Turismo.',
      onPress: () => app.showToast('Aqui abriria o app Piauí Turismo na loja.'),
    },
    {
      id: 'risco',
      img: require('../../../assets/banners/oia-o-risco.jpg'),
      label: 'Óia o Risco de queimadas no B-R-O Bró. Comunique focos de incêndio pela Defesa Civil do Piauí no Gov.pi Cidadão.',
      onPress: () => ask('Quero comunicar um foco de incêndio no Óia o Risco'),
    },
    {
      id: 'transporte',
      img: require('../../../assets/banners/transporte-gratuito.jpg'),
      label: 'Vai votar? O transporte é gratuito. Confira rotas, horários e como usar o benefício.',
      onPress: () => ask('Como funciona o transporte gratuito no dia da eleição?'),
    },
  ];

  const top = SERVICES.filter((s) => MAIS_ACESSADOS.includes(s.t)).sort((a, b) => MAIS_ACESSADOS.indexOf(a.t) - MAIS_ACESSADOS.indexOf(b.t));

  return (
    <View style={{ flex: 1, backgroundColor: color.bg }}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 44 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
          listener: (e: { nativeEvent: { contentOffset: { y: number } } }) => setStuck(e.nativeEvent.contentOffset.y > stickAt),
        })}>
        {/* ---------- Topo azul ---------- */}
        <View style={[styles.head, { paddingTop: insets.top + 14 }]}>
          <BlueBackdrop />
          <View style={styles.headRow}>
            <Logo size={17} />
            <View style={{ flex: 1 }} />
            <ChatHistoryButton onPress={() => setHistory(true)} />
            {app.logged ? (
              <>
                <IconButton icon="bell" label="Avisos" tone="onBrand" badge onPress={() => router.push('/avisos')} />
                <Pressable accessibilityRole="button" accessibilityLabel="Abrir Área do cidadão" onPress={() => router.navigate('/perfil')}>
                  <Avatar initials={PERSON.initials} size={38} light uri={app.photo} />
                </Pressable>
              </>
            ) : (
              <Button small kind="onBrand" icon="user" label="Entrar" href="/entrar" style={{ marginLeft: 4 }} />
            )}
          </View>
          {app.logged ? (
            <T v="h1" c={color.white} style={{ marginTop: 14 }} accessibilityRole="header">
              Olá, {PERSON.first}!
            </T>
          ) : null}
        </View>

        {/* ---------- Campo que leva ao Assistente ---------- */}
        <View onLayout={(e) => setSearchY(e.nativeEvent.layout.y)}>
          <SearchField />
        </View>
        {/* Sugestões: mostram que o campo é uma conversa (H6 reconhecer em vez de lembrar) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingTop: 12 }}>
          {SUGESTOES.map((t) => (
            <Pressable
              key={t}
              accessibilityRole="button"
              accessibilityLabel={`Perguntar ao Assistente: ${t}`}
              onPress={() => {
                tap();
                ask(t);
              }}
              style={({ pressed }) => [styles.suggest, pressed && { borderColor: color.brand, backgroundColor: color.brandTint }]}>
              <T v="smallStrong">
                {t}
              </T>
            </Pressable>
          ))}
        </ScrollView>

        {/* ---------- Destaques (carrossel de banners) ---------- */}
        <SectionHead title="Destaques" />
        <Carousel items={banners} />

        {/* ---------- Entrar (só para quem ainda não entrou) ---------- */}
        {!app.logged ? (
          <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Entre com sua conta Gov.pi"
              onPress={() => router.push('/entrar')}
              style={({ pressed }) => [styles.login, pressed && { opacity: 0.92 }]}>
              <T v="h3" c={color.white} style={{ fontFamily: font.regular }}>
                Entre com sua conta
              </T>
              <Icon name="arrowRight" size={22} color={color.white} />
              <View style={{ flex: 1 }} />
              <T style={{ fontFamily: font.regular, fontSize: 16, color: color.white }}>
                Gov.<T style={{ fontFamily: font.bold, fontSize: 16, color: color.white }}>pi</T>
              </T>
            </Pressable>
          </View>
        ) : null}

        {/* ---------- Mais acessados ---------- */}
        <SectionHead title="Mais acessados" action={<LinkText label="Ver todos" onPress={() => router.navigate('/servicos')} />} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 8 }}>
          {top.map((s) => (
            <ServiceCardCompact key={s.t} s={s} onPress={() => ask(s.q)} />
          ))}
        </ScrollView>

        {/* ---------- Você no centro do Gov.pi: canais para participar (lista com título, como "Como podemos ajudar?") ---------- */}
        <SectionHead title="Você no centro do Gov.pi" />
        <View style={styles.listCard}>
          <View>
            <Row
              icon="whats"
              tone={{ bg: color.whatsBg, fg: color.whats }}
              title="Resolva pelo WhatsApp"
              sub="Zap do Cidadão, a qualquer hora"
              right={<Icon name="ext" size={18} color={color.muted} />}
              onPress={() => router.push('/whatsapp')}
            />
            <Row icon="prism" title="Contribua com o Gov.pi" sub="Prisma Lab, teste novidades" onPress={() => router.push('/ajuda')} last />
          </View>
        </View>
      </Animated.ScrollView>

      {/* Barra fixa: aparece quando o campo de busca chega ao topo */}
      <Animated.View
        pointerEvents={stuck ? 'auto' : 'none'}
        accessibilityElementsHidden={!stuck}
        importantForAccessibility={stuck ? 'auto' : 'no-hide-descendants'}
        style={[styles.stickyBar, { paddingTop: insets.top + 8, opacity: scrollY.interpolate({ inputRange: [stickAt - 1, stickAt], outputRange: [0, 1], extrapolate: 'clamp' }) }]}>
        <SearchField flat />
      </Animated.View>

      <ChatHistorySheet visible={history} onClose={() => setHistory(false)} />
    </View>
  );
}

/* ---------------- Campo que leva ao Assistente (fica fixo ao rolar) ---------------- */
function SearchField({ flat }: { flat?: boolean }) {
  return (
    <Pressable
      accessibilityRole="search"
      accessibilityLabel="O que você precisa resolver? Pergunte ao Assistente Gov.pi"
      accessibilityHint="Abre o Assistente Gov.pi"
      onPress={() => {
        tap();
        ask();
      }}
      style={({ pressed }) => [styles.search, flat && styles.searchFlat, pressed && { borderColor: color.brand }]}>
      <Robot size={28} />
      <T v="body" c={color.muted} style={{ flex: 1, fontSize: 14, lineHeight: 20 }} numberOfLines={1}>
        O que você precisa resolver?
      </T>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Falar com o Assistente Gov.pi"
        hitSlop={6}
        onPress={() => {
          tap();
          askVoice();
        }}
        style={({ pressed }) => [styles.searchMic, pressed && { backgroundColor: color.surface2 }]}>
        <Icon name="mic" size={22} color={color.ink} />
      </Pressable>
      <View style={styles.searchSend}>
        <Icon name="send" size={20} color={color.white} strokeWidth={2.2} />
      </View>
    </Pressable>
  );
}

/* ---------------- Título de seção: nível 1 da hierarquia ---------------- */
function SectionHead({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <View style={styles.secHead}>
      <View style={{ flex: 1, gap: 2 }}>
        <T v="h2" accessibilityRole="header">
          {title}
        </T>
        {sub ? (
          <T v="small" c={color.muted}>
            {sub}
          </T>
        ) : null}
      </View>
      {action}
    </View>
  );
}

/* ---------------- Carrossel com troca automática ---------------- */
function Carousel({ items }: { items: Banner[] }) {
  const [w, setW] = useState(0);
  const [i, setI] = useState(0);
  const ref = useRef<ScrollViewInstance>(null);
  const touching = useRef(false);
  const { prefs } = useApp();
  const cardW = Math.max(0, w - 48);
  const step = cardW + 10;

  useEffect(() => {
    if (!w || prefs.reduzirAnim) return;
    const id = setInterval(() => {
      if (touching.current) return;
      setI((cur) => {
        const next = (cur + 1) % items.length;
        ref.current?.scrollTo({ x: next * step, animated: true });
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [w, step, items.length, prefs.reduzirAnim]);

  return (
    <View onLayout={(e) => setW(e.nativeEvent.layout.width)} accessibilityLabel="Destaques" accessibilityRole="adjustable">
      {w ? (
        <ScrollView
          ref={ref}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={step}
          decelerationRate="fast"
          disableIntervalMomentum
          contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}
          onScrollBeginDrag={() => (touching.current = true)}
          onScrollEndDrag={() => (touching.current = false)}
          onScroll={(e) => {
            const n = Math.round(e.nativeEvent.contentOffset.x / step);
            if (n !== i && n >= 0 && n < items.length) setI(n);
          }}
          scrollEventThrottle={32}>
          {items.map((b) => (
            <Pressable
              key={b.id}
              accessibilityRole="button"
              accessibilityLabel={b.label}
              onPress={() => {
                tap();
                b.onPress();
              }}
              style={({ pressed }) => [styles.banner, { width: cardW }, pressed && { transform: [{ scale: 0.99 }] }]}>
              <Image source={b.img} style={{ width: cardW, height: cardW / 2.23 }} resizeMode="cover" accessibilityIgnoresInvertColors />
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <View style={{ height: 150 }} />
      )}
      <View style={styles.dots} accessibilityLabel={`Destaque ${i + 1} de ${items.length}`}>
        {items.map((b, n) => (
          <Pressable
            key={b.id}
            hitSlop={8}
            accessibilityLabel={`Ir para o destaque ${n + 1}`}
            onPress={() => {
              setI(n);
              ref.current?.scrollTo({ x: n * step, animated: true });
            }}
            style={[styles.dot, n === i && styles.dotOn]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { backgroundColor: color.brand, paddingHorizontal: 20, paddingBottom: 46, overflow: 'hidden' },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 },
  search: {
    marginTop: -28,
    marginHorizontal: 16,
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 12,
    paddingRight: 8,
    backgroundColor: color.surface,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: color.line,
    shadowColor: '#0A1428',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchFlat: { marginTop: 0, borderColor: 'transparent', shadowOpacity: 0, elevation: 0 },
  stickyBar: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: color.brand, paddingBottom: 10, zIndex: 10 },
  searchMic: { width: 36, height: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  searchSend: { width: 44, height: 44, borderRadius: radius.sm, backgroundColor: color.brand, alignItems: 'center', justifyContent: 'center' },
  suggest: { minHeight: 36, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1, borderColor: color.lineStrong, backgroundColor: color.surface, justifyContent: 'center' },
  banner: { aspectRatio: 2.23, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: color.surface2, borderWidth: 1, borderColor: color.line },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: color.lineStrong },
  dotOn: { width: 22, backgroundColor: color.brand },
  login: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 56, paddingHorizontal: 20, backgroundColor: color.brand, borderRadius: radius.sm },
  listCard: { marginHorizontal: 16, paddingHorizontal: 16, paddingVertical: 2, backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.line },
  secHead: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, marginTop: 32, marginBottom: 14 },
});
