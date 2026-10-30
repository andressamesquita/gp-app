import { router } from 'expo-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Image, Pressable, ScrollView, StyleSheet, View, type ImageSourcePropType, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ServiceCardCompact } from '@/components/blocks';
import { AskField } from '@/components/ask-field';
import { PrismaPromo, ZapPromo } from '@/components/promo-cards';
import { TopBarRow } from '@/components/top-bar';
import { BlueBackdrop, LightBackdrop } from '@/components/hero';
import { Icon } from '@/components/Icon';
import { ask } from '@/components/nav';
import { useStatusBar } from '@/components/statusbar';
import { LinkText, T, tap } from '@/components/ui';
import { SERVICES } from '@/data/catalog';
import { PERSON } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { color, font, radius, FAIXA_BRANCA, bar, ESTILO_FAIXA } from '@/theme/tokens';

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

/** Opção 1 (e 2) da faixa: primeira dobra azul-clara abaixo da faixa branca */
const DOBRA_CLARA = ESTILO_FAIXA === 1 || ESTILO_FAIXA === 2;

export default function Inicio() {
  const app = useApp();
  const insets = useSafeAreaInsets();
  useStatusBar('light', color.brand);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [searchY, setSearchY] = useState(400);
  const [stuck, setStuck] = useState(false);
  const [heroY, setHeroY] = useState(0);
  // Com a dobra clara, o campo fica dentro dela (sem margem negativa)
  const stickAt = DOBRA_CLARA ? Math.max(1, heroY + searchY - insets.top - 8) : Math.max(1, searchY - 28 - insets.top - 8); // 28 = margem negativa do campo sobre o topo azul

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
    <View style={{ flex: 1, backgroundColor: color.surface }}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 44 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
          listener: (e: { nativeEvent: { contentOffset: { y: number } } }) => setStuck(e.nativeEvent.contentOffset.y > stickAt),
        })}>
        {/* ---------- Topo azul ---------- */}
        <View style={[styles.head, DOBRA_CLARA && styles.headCompact, { paddingTop: insets.top + (DOBRA_CLARA ? 8 : 14) }]}>
          <BlueBackdrop bar />
          <TopBarRow />
          {app.logged && !DOBRA_CLARA ? (
            <T v="h1" c={bar.title} style={{ marginTop: 14 }} accessibilityRole="header">
              Olá, {PERSON.first}!
            </T>
          ) : null}
        </View>

        {DOBRA_CLARA ? (
          // Opção 1: primeira dobra azul-clara (como o --hero da web) com saudação, campo e sugestões
          <View style={styles.hero} onLayout={(e) => setHeroY(e.nativeEvent.layout.y)}>
            <LightBackdrop />
            {app.logged ? (
              <T v="h1" c={color.ink} accessibilityRole="header" style={{ paddingHorizontal: 16 }}>
                Olá, {PERSON.first}!
              </T>
            ) : null}
            <View onLayout={(e) => setSearchY(e.nativeEvent.layout.y)} style={{ paddingHorizontal: 16 }}>
              <AskField />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingTop: 0 }}>
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
          </View>
        ) : (
          <>
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

          </>
        )}

        {/* ---------- Destaques (carrossel de banners) ---------- */}
        <SectionHead title="Destaques" />
        <Carousel items={banners} />

        {/* ---------- Entrar (só para quem ainda não entrou) ---------- */}
        {!app.logged ? (
          <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Entre com sua conta Gov.pi"
              onPress={() => router.push({ pathname: '/entrar', params: { from: 'inicio' } })}
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
        {/* Cards de divulgação, um após o outro */}
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          <ZapPromo onPress={() => router.push('/whatsapp')} />
          <PrismaPromo onPress={() => router.push('/ajuda')} />
        </View>
      </Animated.ScrollView>

      {/* Barra fixa: aparece quando o campo de busca chega ao topo */}
      <Animated.View
        pointerEvents={stuck ? 'auto' : 'none'}
        accessibilityElementsHidden={!stuck}
        importantForAccessibility={stuck ? 'auto' : 'no-hide-descendants'}
        style={[styles.stickyBar, { paddingTop: insets.top + 8, opacity: scrollY.interpolate({ inputRange: [stickAt - 1, stickAt], outputRange: [0, 1], extrapolate: 'clamp' }) }]}>
        <View style={{ marginHorizontal: 16 }}>
          <SearchField flat />
        </View>
      </Animated.View>

    </View>
  );
}

/* ---------------- Campo que leva ao Assistente (fica fixo ao rolar) ---------------- */
function SearchField({ flat }: { flat?: boolean }) {
  return <AskField flat={flat} style={flat ? undefined : styles.searchPos} />;
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
  head: { backgroundColor: bar.bg, paddingHorizontal: 20, paddingBottom: 46, overflow: 'hidden' },
  headCompact: { paddingHorizontal: 16, paddingBottom: 10 },
  hero: { paddingTop: 20, paddingBottom: 18, gap: 14, overflow: 'hidden' },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 },
  searchPos: { marginTop: -28, marginHorizontal: 16 },
  // Barra fixa ao rolar: sombra como o cabeçalho da web (0 8px 24px -16px rgba(3,40,110,.4)) para destacar do conteúdo branco
  stickyBar: {
    position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: bar.bg, borderBottomWidth: 1, borderBottomColor: FAIXA_BRANCA ? '#D6DEE9' : bar.line, paddingBottom: 10, zIndex: 10,
    ...(FAIXA_BRANCA ? { boxShadow: '0 6px 18px -4px rgba(3,40,110,0.28)' } : null),
  } as object,
  suggest: { minHeight: 36, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1, borderColor: color.lineStrong, backgroundColor: color.surface, justifyContent: 'center' },
  banner: { aspectRatio: 2.23, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: color.surface2, borderWidth: 1, borderColor: color.line },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: color.lineStrong },
  dotOn: { width: 22, backgroundColor: color.brand },
  login: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 56, paddingHorizontal: 20, backgroundColor: color.brand, borderRadius: radius.sm },
  // Cada seção começa com uma divisória clara de ponta a ponta (estilo Méliuz)
  secHead: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, marginTop: 24, paddingTop: 20, marginBottom: 14, borderTopWidth: 1, borderTopColor: color.divider },
});
