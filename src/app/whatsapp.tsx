import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { IconButton, T } from '@/components/ui';
import { PROTOCOL_CNH } from '@/data/mock';
import { color, font } from '@/theme/tokens';

/** Simulação do canal oficial no WhatsApp (mostra a continuidade entre canais). */
export default function WhatsApp() {
  const insets = useSafeAreaInsets();
  const [confirmed, setConfirmed] = useState(false);
  const In = ({ children, time = '09:41' }: { children: React.ReactNode; time?: string }) => (
    <View style={[styles.b, styles.in]}>
      {children}
      <T v="caption" c={color.muted} style={styles.time}>
        {time}
      </T>
    </View>
  );
  const Out = ({ text, time = '09:41' }: { text: string; time?: string }) => (
    <View style={[styles.b, styles.out]}>
      <T v="body" style={{ fontSize: 14.5 }}>
        {text}
      </T>
      <T v="caption" c={color.muted} style={styles.time}>
        {time} ✓✓
      </T>
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: '#E4EAF2' }}>
      <View style={[styles.head, { paddingTop: insets.top + 6 }]}>
        <IconButton icon="back" label="Voltar" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
        <View style={styles.av}>
          <T v="smallStrong" c={color.whats} style={{ fontFamily: font.bold }}>
            GP
          </T>
        </View>
        <View style={{ flex: 1 }}>
          <T v="bodyStrong" c={color.white}>
            Gov.PI Cidadão
          </T>
          <T v="caption" c="rgba(255,255,255,0.9)">
            Conta oficial · (86) 98878-8533
          </T>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 12, gap: 8 }}>
        <View style={styles.day}>
          <T v="caption" c={color.muted}>
            Hoje
          </T>
        </View>
        <Out text="Quero renovar minha CNH" />
        <In>
          <T v="body" style={{ fontSize: 14.5 }}>
            Olá, Ana. Encontrei sua habilitação. Vence em 27 dias e não há multas pendentes.
          </T>
        </In>
        <In time="09:42">
          <T v="body" style={{ fontSize: 14.5 }}>
            Posso abrir a renovação e reservar seu exame médico. Confirma?
          </T>
          {!confirmed && (
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
              <Pressable accessibilityRole="button" onPress={() => setConfirmed(true)} style={styles.qr}>
                <T v="smallStrong" c={color.whats}>
                  Confirmar
                </T>
              </Pressable>
              <Pressable accessibilityRole="button" style={styles.qr}>
                <T v="smallStrong" c={color.whats}>
                  Alterar
                </T>
              </Pressable>
            </View>
          )}
        </In>
        {confirmed && (
          <>
            <Out text="Confirmar" time="09:42" />
            <In time="09:42">
              <T v="body" style={{ fontSize: 14.5 }}>
                Solicitação registrada. Exame marcado para quarta-feira, 21/10, às 9h20, na Clínica Centro. Seu protocolo é {PROTOCOL_CNH}.
              </T>
            </In>
            <In time="09:42">
              <T v="body" style={{ fontSize: 14.5 }}>
                Sua solicitação também está no app. Acompanhe cada etapa onde preferir.
              </T>
              <Pressable accessibilityRole="link" onPress={() => router.push('/continua-no-app')} style={styles.link}>
                <Icon name="ext" size={16} color={color.whats} />
                <T v="smallStrong" c={color.whats}>
                  Abrir no Gov.pi Cidadão
                </T>
              </Pressable>
              <Pressable accessibilityRole="button" style={styles.link}>
                <T v="smallStrong" c={color.whats}>
                  Continuar por aqui
                </T>
              </Pressable>
            </In>
          </>
        )}
        <T v="caption" c={color.muted} style={{ textAlign: 'center', marginTop: 8 }}>
          Prefere falar com um atendente? Atendimento em dias úteis, das 7h30 às 19h.
        </T>
      </ScrollView>
      <View style={[styles.foot, { paddingBottom: insets.bottom + 8 }]}>
        <View style={styles.inputWrap}>
          <Icon name="plus" size={22} color={color.muted} />
          <TextInput placeholder="Mensagem" placeholderTextColor={color.muted} style={styles.input} accessibilityLabel="Mensagem" />
        </View>
        <View style={styles.mic}>
          <Icon name="mic" size={22} color={color.white} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { backgroundColor: color.whats, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 6, paddingBottom: 10 },
  av: { width: 38, height: 38, borderRadius: 19, backgroundColor: color.white, alignItems: 'center', justifyContent: 'center' },
  day: { alignSelf: 'center', backgroundColor: color.white, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  b: { maxWidth: '84%', paddingHorizontal: 12, paddingTop: 8, paddingBottom: 18, borderRadius: 12, minWidth: 90 },
  in: { alignSelf: 'flex-start', backgroundColor: color.white, borderTopLeftRadius: 2 },
  out: { alignSelf: 'flex-end', backgroundColor: '#D6F0DC', borderTopRightRadius: 2 },
  time: { position: 'absolute', right: 8, bottom: 3, fontSize: 10.5 },
  qr: { flex: 1, minHeight: 40, borderRadius: 8, borderWidth: 1, borderColor: color.whats, alignItems: 'center', justifyContent: 'center' },
  link: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 44, borderTopWidth: 1, borderTopColor: color.line, marginTop: 8 },
  foot: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, paddingTop: 8 },
  inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: color.white, borderRadius: 24, paddingHorizontal: 12, height: 48 },
  input: { flex: 1, fontFamily: font.medium, fontSize: 15, color: color.ink, outlineStyle: 'none' } as object,
  mic: { width: 48, height: 48, borderRadius: 24, backgroundColor: color.whats, alignItems: 'center', justifyContent: 'center' },
});
