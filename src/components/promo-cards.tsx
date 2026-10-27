import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { color, font, radius } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { T, tap } from './ui';

/**
 * Cards de divulgação na horizontal (inspiração: banners do iFood "hits").
 * Título grande à esquerda, ilustração à direita e um botão em pílula.
 */
function PromoCard({
  colors,
  kicker,
  kickerIcon,
  title,
  cta,
  ctaIcon,
  ctaInk,
  onPress,
  a11y,
  art,
}: {
  colors: [string, string, string];
  kicker: string;
  kickerIcon: IconName;
  title: string;
  cta: string;
  ctaIcon: IconName;
  ctaInk: string;
  onPress: () => void;
  a11y: string;
  art: React.ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.99 }] }]}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      {/* brilho e círculos decorativos */}
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} viewBox="0 0 360 180" preserveAspectRatio="xMidYMid slice">
        <Circle cx="330" cy="20" r="90" fill="#fff" opacity={0.08} />
        <Circle cx="290" cy="190" r="70" fill="#fff" opacity={0.06} />
        <Path d="M-10 150 C80 110 160 190 260 140" stroke="#fff" strokeOpacity={0.12} strokeWidth={1.5} fill="none" />
      </Svg>

      <View style={styles.left}>
        <View style={styles.kicker}>
          <Icon name={kickerIcon} size={13} color={color.white} />
          <T v="caption" c={color.white} style={{ fontFamily: font.semibold }}>
            {kicker}
          </T>
        </View>
        <T c={color.white} style={styles.title}>
          {title}
        </T>
        <View style={styles.cta}>
          <T v="label" c={ctaInk}>
            {cta}
          </T>
          <Icon name={ctaIcon} size={14} color={ctaInk} />
        </View>
      </View>

      <View style={styles.art} pointerEvents="none">
        {art}
      </View>
    </Pressable>
  );
}

/** Ilustração do WhatsApp: mini conversa do Zap do Cidadão. */
function ZapArt() {
  return (
    <View style={{ gap: 6, width: 132 }}>
      <View style={[styles.bubble, styles.me]}>
        <T v="caption" c="#0E3B22" style={{ fontFamily: font.semibold }}>
          Oi!
        </T>
      </View>
      <View style={[styles.bubble, styles.bot]}>
        <T v="caption" c={color.ink} style={{ fontSize: 10.5, lineHeight: 14 }}>
          Olá! Sou o Zap do Cidadão. Como posso ajudar?
        </T>
      </View>
      <View style={styles.quick}>
        <T v="caption" c="#0E7A3B" style={{ fontFamily: font.semibold, fontSize: 10 }}>
          Consultar serviço
        </T>
      </View>
    </View>
  );
}

/** Ilustração do Prisma Lab: Ideia → Teste → No ar. */
function PrismaArt() {
  const steps: { i: IconName; t: string; on?: boolean }[] = [
    { i: 'spark', t: 'Ideia' },
    { i: 'sliders', t: 'Teste' },
    { i: 'check', t: 'No ar', on: true },
  ];
  return (
    <View style={styles.flow}>
      <T v="caption" c={color.ink} style={{ fontFamily: font.semibold, fontSize: 10.5 }}>
        Sua opinião vira melhoria
      </T>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        {steps.map((s) => (
          <View key={s.t} style={{ alignItems: 'center', gap: 3 }}>
            <View style={[styles.flowDot, s.on && { backgroundColor: color.brand }]}>
              <Icon name={s.i} size={14} color={s.on ? color.white : color.brand} strokeWidth={2.2} />
            </View>
            <T v="caption" c={color.ink} style={{ fontSize: 9.5, lineHeight: 12 }}>
              {s.t}
            </T>
          </View>
        ))}
      </View>
    </View>
  );
}

export function ZapPromo({ onPress }: { onPress: () => void }) {
  return (
    <PromoCard
      colors={['#25B864', '#0E8A43', '#065C2B']}
      kicker="Zap do Cidadão"
      kickerIcon="whats"
      title={'Resolva pelo\nWhatsApp'}
      cta="Iniciar conversa"
      ctaIcon="ext"
      ctaInk="#0E7A3B"
      a11y="Zap do Cidadão. Resolva pelo WhatsApp, sem sair de casa. Iniciar conversa"
      onPress={onPress}
      art={<ZapArt />}
    />
  );
}

export function PrismaPromo({ onPress }: { onPress: () => void }) {
  return (
    <PromoCard
      colors={['#2F7BE0', '#034EA2', '#012F66']}
      kicker="Prisma Lab"
      kickerIcon="prism"
      title={'Contribua com\no Gov.pi'}
      cta="Quero participar"
      ctaIcon="right"
      ctaInk={color.brand}
      a11y="Prisma Lab. Contribua com o Gov.pi: teste novidades e diga o que pode melhorar. Quero participar"
      onPress={onPress}
      art={<PrismaArt />}
    />
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', minHeight: 168, borderRadius: radius.lg, overflow: 'hidden', paddingVertical: 18, paddingLeft: 18, paddingRight: 12, gap: 8 },
  left: { flex: 1, gap: 10, zIndex: 1 },
  kicker: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 3 },
  title: { fontFamily: font.semibold, fontSize: 22, lineHeight: 27, letterSpacing: -0.2 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: color.white, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8 },
  art: { zIndex: 1, transform: [{ rotate: '-3deg' }] },
  bubble: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 6 },
  me: { alignSelf: 'flex-end', backgroundColor: '#D7F5DF', borderTopRightRadius: 2 },
  bot: { alignSelf: 'flex-start', backgroundColor: color.white, borderTopLeftRadius: 2 },
  quick: { alignSelf: 'flex-start', backgroundColor: color.white, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: '#0E7A3B' },
  flow: { backgroundColor: color.white, borderRadius: 12, padding: 10, gap: 8, alignItems: 'center', width: 136 },
  flowDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: color.brandTint, alignItems: 'center', justifyContent: 'center' },
});
