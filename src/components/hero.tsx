import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { PROMPT_EXAMPLES } from '@/data/mock';
import { color, font, radius, shadow } from '@/theme/tokens';
import { Icon } from './Icon';
import { T, tap } from './ui';

/**
 * Fundo azul da primeira dobra: degradê #0B5CBD → #034EA2 → #023C7E,
 * dois brilhos radiais e o padrão de ondas da Proposta web.
 */
export function BlueBackdrop({ style }: { style?: StyleProp<ViewStyle> }) {
  const waves = [300, 270, 240, 210, 180, 150, 120, 90];
  return (
    <View style={[StyleSheet.absoluteFill, style]} pointerEvents="none">
      <LinearGradient colors={['#0B5CBD', '#034EA2', '#023C7E']} locations={[0, 0.55, 1]} style={StyleSheet.absoluteFill} />
      <Svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 520" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="g1" cx="10%" cy="0%" r="60%">
            <Stop offset="0" stopColor="#6EBEFF" stopOpacity={0.4} />
            <Stop offset="1" stopColor="#6EBEFF" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="g2" cx="95%" cy="100%" r="70%">
            <Stop offset="0" stopColor="#00AAE6" stopOpacity={0.32} />
            <Stop offset="1" stopColor="#00AAE6" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="400" height="520" fill="url(#g1)" />
        <Rect width="400" height="520" fill="url(#g2)" />
        {waves.map((y) => (
          <Path
            key={y}
            d={`M-20 ${y + 150}C80 ${y + 90} 150 ${y + 180} 250 ${y + 120}S400 ${y + 40} 540 ${y + 100}`}
            stroke="#fff"
            strokeOpacity={0.1}
            strokeWidth={1.2}
            fill="none"
          />
        ))}
      </Svg>
    </View>
  );
}

/** Texto de exemplo que alterna no campo vazio, em linguagem natural. */
function useRotatingExample(active: boolean) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setI((n) => (n + 1) % PROMPT_EXAMPLES.length), 3200);
    return () => clearInterval(id);
  }, [active]);
  return PROMPT_EXAMPLES[i];
}

/**
 * Campo de conversa. No "hero" é o cartão branco grande sobre o azul;
 * na barra de baixo da conversa é a versão compacta.
 * Não tem lupa nem "Buscar": é um convite a conversar.
 */
export function Composer({
  onSubmit,
  onMic,
  onCamera,
  onAttach,
  variant = 'hero',
  autoFocus,
  initial = '',
}: {
  onSubmit: (text: string) => void;
  onMic?: () => void;
  onCamera?: () => void;
  onAttach?: () => void;
  variant?: 'hero' | 'bar';
  autoFocus?: boolean;
  initial?: string;
}) {
  const [text, setText] = useState(initial);
  const [focused, setFocused] = useState(false);
  const example = useRotatingExample(!text && !focused);
  const hero = variant === 'hero';
  const has = text.trim().length > 0;
  const submit = () => {
    if (!has) return;
    tap();
    onSubmit(text.trim());
    setText('');
  };

  return (
    <View style={[hero ? styles.hero : styles.bar, focused && (hero ? styles.heroFocus : styles.barFocus)]}>
      {hero && (
        <View style={styles.heroTop}>
          <View style={styles.assist}>
            <Icon name="spark" size={16} color={color.white} />
          </View>
          <T v="caption" c={color.muted} style={{ flex: 1 }}>
            Assistente do Gov.pi · entende o que você escreve ou fala
          </T>
        </View>
      )}
      <View style={styles.inputRow}>
        {onAttach && (
          <Pressable accessibilityRole="button" accessibilityLabel="Adicionar anexo" onPress={onAttach} style={styles.side} hitSlop={6}>
            <Icon name="plus" size={22} color={color.muted} />
          </Pressable>
        )}
        <TextInput
          accessibilityLabel="Escreva o que você precisa"
          value={text}
          onChangeText={setText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={submit}
          placeholder={hero ? example : 'Escreva sua mensagem'}
          placeholderTextColor={color.muted}
          autoFocus={autoFocus}
          returnKeyType="send"
          multiline={hero}
          submitBehavior={hero ? 'submit' : undefined}
          style={[styles.input, hero && styles.inputHero]}
        />
        {onCamera && !has && (
          <Pressable accessibilityRole="button" accessibilityLabel="Enviar uma foto" onPress={onCamera} style={styles.side} hitSlop={6}>
            <Icon name="camera" size={22} color={color.muted} />
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={has ? 'Enviar' : 'Falar em vez de escrever'}
          onPress={has ? submit : onMic}
          style={({ pressed }) => [styles.send, pressed && { opacity: 0.85 }]}>
          <Icon name={has ? 'send' : 'mic'} size={22} color={color.white} strokeWidth={2.2} />
        </Pressable>
      </View>
    </View>
  );
}

/** Três pontinhos de "digitando". */
export function TypingDots() {
  const a = [useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current];
  useEffect(() => {
    const loops = a.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(v, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(v, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.delay(300 - i * 150),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <View style={{ flexDirection: 'row', gap: 5, paddingVertical: 6 }} accessibilityLabel="O assistente está escrevendo">
      {a.map((v, i) => (
        <Animated.View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color.muted, opacity: v }} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: color.surface,
    borderRadius: radius.md,
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 12,
    gap: 4,
    ...shadow.float,
  },
  heroFocus: { borderWidth: 0, shadowOpacity: 0.4 },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4 },
  assist: { width: 24, height: 24, borderRadius: 12, backgroundColor: color.brand, alignItems: 'center', justifyContent: 'center' },
  bar: {
    backgroundColor: color.surface,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: color.lineStrong,
    paddingLeft: 6,
    paddingRight: 5,
    paddingVertical: 4,
  },
  barFocus: { borderColor: color.brand },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  input: {
    flex: 1,
    minHeight: 46,
    paddingHorizontal: 8,
    paddingVertical: 12,
    fontFamily: font.medium,
    fontSize: 15,
    color: color.ink,
    outlineStyle: 'none',
  } as object,
  inputHero: { minHeight: 64, fontSize: 16, textAlignVertical: 'top', paddingTop: 12 },
  side: { width: 44, height: 46, alignItems: 'center', justifyContent: 'center' },
  send: { width: 46, height: 46, borderRadius: 23, backgroundColor: color.brand, alignItems: 'center', justifyContent: 'center' },
});
