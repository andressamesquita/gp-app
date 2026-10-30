import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

/*
 * Abertura do app: a logo do Gov.pi Cidadão se monta em ~2 s antes do modal de novidades.
 * 1) "Gov." entra deslizando  2) "pi" aparece com um pulo  3) as 4 ondas se desenham da esquerda
 *    para a direita (azul, amarelo, vermelho, verde)  4) "Cidadão" sobe  5) tudo some suavemente.
 * Camadas recortadas da logo oficial em assets/brand/splash (640 × 299).
 * Com "reduzir movimento" ligado, mostra a logo pronta e some. Tocar pula a animação.
 */
const L = {
  gov: require('../../assets/brand/splash/gov.png'),
  pi: require('../../assets/brand/splash/pi.png'),
  cidadao: require('../../assets/brand/splash/cidadao.png'),
  azul: require('../../assets/brand/splash/azul.png'),
  amarelo: require('../../assets/brand/splash/amarelo.png'),
  vermelho: require('../../assets/brand/splash/vermelho.png'),
  verde: require('../../assets/brand/splash/verde.png'),
};
const BASE_W = 640;
const BASE_H = 299;
/** Onde cada onda começa e termina (em px da imagem base), para revelar só o traço */
const ONDAS = [
  { k: 'azul', from: 487, to: 602 },
  { k: 'amarelo', from: 487, to: 640 },
  { k: 'vermelho', from: 487, to: 640 },
  { k: 'verde', from: 535, to: 640 },
] as const;

export function LogoSplash({ onDone }: { onDone: () => void }) {
  const { width } = useWindowDimensions();
  const w = Math.min(300, width * 0.72);
  const h = (w * BASE_H) / BASE_W;
  const s = w / BASE_W;

  const gov = useRef(new Animated.Value(0)).current;
  const pi = useRef(new Animated.Value(0)).current;
  const ondas = useRef(ONDAS.map(() => new Animated.Value(0))).current;
  const cid = useRef(new Animated.Value(0)).current;
  const tela = useRef(new Animated.Value(1)).current;
  const [fim, setFim] = useState(false);

  const sair = () => {
    if (fim) return;
    setFim(true);
    Animated.timing(tela, { toValue: 0, duration: 320, easing: Easing.out(Easing.quad), useNativeDriver: false }).start(() => onDone());
  };

  useEffect(() => {
    let vivo = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduzir) => {
        if (!vivo) return;
        if (reduzir) {
          [gov, pi, cid, ...ondas].forEach((v) => v.setValue(1));
          setTimeout(sair, 900);
          return;
        }
        const ease = Easing.out(Easing.cubic);
        Animated.sequence([
          Animated.delay(150),
          Animated.parallel([
            Animated.timing(gov, { toValue: 1, duration: 380, easing: ease, useNativeDriver: false }),
            Animated.sequence([Animated.delay(220), Animated.spring(pi, { toValue: 1, friction: 5, tension: 120, useNativeDriver: false })]),
            Animated.sequence([
              Animated.delay(480),
              Animated.stagger(
                130,
                ondas.map((v) => Animated.timing(v, { toValue: 1, duration: 420, easing: Easing.inOut(Easing.quad), useNativeDriver: false })),
              ),
            ]),
            Animated.sequence([Animated.delay(1050), Animated.timing(cid, { toValue: 1, duration: 420, easing: ease, useNativeDriver: false })]),
          ]),
          Animated.delay(550),
        ]).start(({ finished }) => finished && sair());
      });
    return () => {
      vivo = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const img = (src: number) => <Image source={src} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h }} resizeMode="stretch" />;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.tela, { opacity: tela }]} accessible accessibilityRole="image" accessibilityLabel="Gov.pi Cidadão">
      <Pressable style={StyleSheet.absoluteFill} onPress={sair} accessibilityLabel="Pular abertura" />
      <View style={{ width: w, height: h }} pointerEvents="none">
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: gov, transform: [{ translateX: gov.interpolate({ inputRange: [0, 1], outputRange: [-14, 0] }) }] }]}>{img(L.gov)}</Animated.View>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { opacity: pi.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1, 1] }), transform: [{ scale: pi.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] },
          ]}>
          {img(L.pi)}
        </Animated.View>
        {/* Ondas: a área visível cresce da esquerda para a direita, como se fossem desenhadas */}
        {ONDAS.map((o, i) => (
          <Animated.View
            key={o.k}
            style={{ position: 'absolute', left: 0, top: 0, height: h, overflow: 'hidden', width: ondas[i].interpolate({ inputRange: [0, 1], outputRange: [o.from * s, o.to * s + 1] }) }}>
            {img(L[o.k])}
          </Animated.View>
        ))}
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: cid, transform: [{ translateY: cid.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>{img(L.cidadao)}</Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tela: { backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
});
