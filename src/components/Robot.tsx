import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

/**
 * Mascote do Assistente Gov.pi: um robô azul de rosto arredondado.
 * `mono` desenha só o rosto em branco, para usar sobre o azul (aba central).
 */
export function Robot({ size = 112, mono = false, blink = false }: { size?: number; mono?: boolean; blink?: boolean }) {
  const eye = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!blink) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(2600),
        Animated.timing(eye, { toValue: 0.15, duration: 90, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(eye, { toValue: 1, duration: 120, easing: Easing.linear, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [blink, eye]);

  const w = size;
  const h = size * 0.86;
  if (mono)
    return (
      <Svg width={w} height={h} viewBox="0 0 100 86" accessibilityElementsHidden importantForAccessibility="no">
        <Path d={BODY} fill="#FFFFFF" />
        <Rect x={19} y={22} width={62} height={42} rx={19} fill="#034EA2" />
        <Rect x={33} y={36} width={11} height={13} rx={5.5} fill="#FFFFFF" />
        <Rect x={56} y={36} width={11} height={13} rx={5.5} fill="#FFFFFF" />
      </Svg>
    );

  return (
    <Animated.View style={{ width: w, height: h }} accessibilityElementsHidden importantForAccessibility="no">
      <Svg width={w} height={h} viewBox="0 0 100 86">
        <Defs>
          <LinearGradient id="rb" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#3D8BFF" />
            <Stop offset="0.55" stopColor="#0B5CBD" />
            <Stop offset="1" stopColor="#034EA2" />
          </LinearGradient>
          <LinearGradient id="rv" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#023C7E" />
            <Stop offset="1" stopColor="#012A5C" />
          </LinearGradient>
        </Defs>
        <Path d={BODY} fill="url(#rb)" />
        <Path d="M22 14c8-5 22-7 30-6" stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={3.2} strokeLinecap="round" fill="none" />
        <Rect x={19} y={22} width={62} height={42} rx={19} fill="url(#rv)" />
      </Svg>
      {/* olhos separados para poderem piscar */}
      <Animated.View
        style={{
          position: 'absolute',
          left: (w * 33) / 100,
          top: (h * 36) / 86,
          width: (w * 34) / 100,
          height: (h * 13) / 86,
          flexDirection: 'row',
          justifyContent: 'space-between',
          transform: [{ scaleY: eye }],
        }}>
        <Animated.View style={{ width: (w * 11) / 100, height: '100%', borderRadius: w, backgroundColor: '#FFFFFF' }} />
        <Animated.View style={{ width: (w * 11) / 100, height: '100%', borderRadius: w, backgroundColor: '#FFFFFF' }} />
      </Animated.View>
    </Animated.View>
  );
}

const BODY =
  'M50 2C77 2 96 14 98 38c2 26-17 46-48 46C19 84 0 64 2 38 4 14 23 2 50 2z';
