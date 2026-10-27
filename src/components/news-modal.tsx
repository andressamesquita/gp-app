import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { color, font, radius } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { ask } from './nav';
import { T, tap } from './ui';

const ORANGE = '#E8792B';
const NAVY = '#14306B';

/**
 * Novidades ao abrir o app (inspiração: modal "hits" do iFood),
 * no mesmo estilo dos cards de divulgação, em vertical.
 * Novidade atual: Óia o Risco, serviço da Defesa Civil.
 */
export function NewsModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const go = () => {
    tap();
    onClose();
    ask('Quero registrar uma ocorrência no Óia o Risco');
  };
  const card = (
    <View style={styles.wrap} pointerEvents="box-none">
      <View style={styles.card} accessibilityViewIsModal accessibilityLabel="Novidade no Gov.pi: Óia o Risco">
        <LinearGradient colors={['#FFB04D', ORANGE, '#C9531A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <Svg width="100%" height="100%" viewBox="0 0 320 520" preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFill}>
          <Circle cx="300" cy="40" r="120" fill="#fff" opacity={0.09} />
          <Circle cx="10" cy="470" r="110" fill="#fff" opacity={0.07} />
          <Path d="M-20 300 C80 250 200 360 340 290" stroke="#fff" strokeOpacity={0.14} strokeWidth={2} fill="none" />
        </Svg>

        <Pressable accessibilityRole="button" accessibilityLabel="Fechar novidades" hitSlop={8} onPress={onClose} style={styles.close}>
          <Icon name="close" size={22} color={ORANGE} strokeWidth={2.6} />
        </Pressable>

        <View style={styles.kicker}>
          <Icon name="spark" size={13} color={color.white} />
          <T v="caption" c={color.white} style={{ fontFamily: font.semibold }}>
            Novo serviço no Gov.pi
          </T>
        </View>

        <T c={color.white} style={styles.title}>
          Óia o Risco!
        </T>
        <T v="small" c="rgba(255,255,255,0.95)" style={{ textAlign: 'center', maxWidth: 260 }}>
          Registre e acompanhe situações de risco no Piauí com a Defesa Civil.
        </T>

        <Art />

        <View style={{ gap: 6, alignSelf: 'stretch' }}>
          {['Registre eventos climáticos e ocorrências', 'Envie fotos e vídeos como evidência', 'Consulte os registros no mapa'].map((t) => (
            <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={styles.tick}>
                <Icon name="check" size={12} color={ORANGE} strokeWidth={3} />
              </View>
              <T v="small" c={color.white} style={{ flex: 1 }}>
                {t}
              </T>
            </View>
          ))}
        </View>

        <Pressable accessibilityRole="button" onPress={go} style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}>
          <T v="label" c={ORANGE} style={{ fontSize: 14 }}>
            Acesse agora
          </T>
        </Pressable>
      </View>
    </View>
  );

  const scrim = <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10,20,40,0.55)' }]} onPress={onClose} accessibilityLabel="Fechar" />;
  if (Platform.OS === 'web')
    return visible ? (
      <View style={[StyleSheet.absoluteFill, { zIndex: 80 }]}>
        {scrim}
        {card}
      </View>
    ) : null;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      {scrim}
      {card}
    </Modal>
  );
}

/** "Logo" do serviço montado em código, com os ícones de risco embaixo. */
function Art() {
  const icons: IconName[] = ['phone', 'people', 'pin', 'drop', 'alert'];
  return (
    <View style={styles.art}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
        <T style={{ fontFamily: font.bold, fontSize: 34, lineHeight: 36, color: NAVY, letterSpacing: -1 }}>Óia</T>
        <View style={styles.bang}>
          <T style={{ fontFamily: font.bold, fontSize: 20, lineHeight: 24, color: ORANGE }}>!</T>
        </View>
      </View>
      <T style={{ fontFamily: font.bold, fontSize: 30, lineHeight: 32, color: ORANGE, letterSpacing: -1, marginTop: -2 }}>
        <T style={{ fontFamily: font.bold, fontSize: 18, color: ORANGE }}>o </T>Risco
      </T>
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
        {icons.map((i, n) => (
          <View key={i} style={[styles.iconDot, { borderColor: n % 2 ? NAVY : ORANGE }]}>
            <Icon name={i} size={14} color={n % 2 ? NAVY : ORANGE} strokeWidth={2.2} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 360, borderRadius: radius.lg, overflow: 'hidden', alignItems: 'center', paddingHorizontal: 22, paddingTop: 28, paddingBottom: 22, gap: 14 },
  close: { position: 'absolute', top: 12, right: 12, width: 40, height: 40, borderRadius: 20, backgroundColor: color.white, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  kicker: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  title: { fontFamily: font.semibold, fontSize: 30, lineHeight: 36, textAlign: 'center', letterSpacing: -0.4 },
  art: { backgroundColor: color.white, borderRadius: radius.lg, paddingVertical: 16, paddingHorizontal: 22, alignItems: 'center', transform: [{ rotate: '-3deg' }], marginVertical: 4 },
  bang: { width: 30, height: 30, borderRadius: 15, borderWidth: 2.5, borderColor: ORANGE, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  iconDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  tick: { width: 18, height: 18, borderRadius: 5, backgroundColor: color.white, alignItems: 'center', justifyContent: 'center' },
  cta: { alignSelf: 'stretch', minHeight: 48, borderRadius: radius.md, backgroundColor: color.white, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
});
