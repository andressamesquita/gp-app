import { LinearGradient } from 'expo-linear-gradient';
import { BlueBackdrop } from '@/components/hero';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type ScrollViewInstance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CardView } from '@/components/chat-cards';
import { Icon } from '@/components/Icon';
import { Robot } from '@/components/Robot';
import { useStatusBar } from '@/components/statusbar';
import { Avatar, Button, IconButton, LinkText, Logo, T, tap } from '@/components/ui';
import { PERSON } from '@/data/mock';
import type { Action, Msg } from '@/state/assistant';
import { useApp } from '@/state/app-state';
import { color, font, radius, shadow } from '@/theme/tokens';

const CHIPS_OUT = ['Renovar minha CNH', 'Meu remédio acabou', 'Perdi minha CNH', 'Ver todos os serviços'];
const CHIPS_IN = ['Renovar minha CNH', 'Resgatar meus créditos da Nota Piauiense', 'Ver minha carteira', 'Perdi minha CNH'];
const CHIP_Q: Record<string, string> = {
  'Renovar minha CNH': 'Quero renovar minha CNH',
  'Resgatar meus créditos da Nota Piauiense': 'Quero resgatar meus créditos da Nota Piauiense',
  'Ver minha carteira': 'Ver minha carteira de documentos',
  'Ver todos os serviços': 'Ver todos os serviços',
};

/**
 * Assistente Gov.pi: a tela de entrada do app.
 * Vazia, mostra o robô e a pergunta; com mensagens, vira a conversa.
 */
export default function Assistente() {
  const app = useApp();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ q?: string; voice?: string; t?: string }>();
  const scroll = useRef<ScrollViewInstance>(null);
  const lastT = useRef<string | undefined>(undefined);
  const [listening, setListening] = useState(false);
  useStatusBar('light', color.brand);

  const listen = (then: () => void) => {
    setListening(true);
    setTimeout(() => {
      setListening(false);
      then();
    }, 1700);
  };

  // Pedidos vindos de outras telas (chips, "Renovar", serviços...)
  useEffect(() => {
    if (!params.t || params.t === lastT.current) return;
    lastT.current = params.t;
    if (params.q) app.send(String(params.q));
    if (params.voice) listen(() => app.send('Quero renovar minha CNH'));
  }, [params.t]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Rola a conversa até a última mensagem (no navegador, pelo elemento da página). */
  const toEnd = () => {
    const go = (animated: boolean) => {
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const el = document.getElementById('chat-scroll');
        if (el) el.scrollTop = el.scrollHeight;
      } else scroll.current?.scrollToEnd({ animated });
    };
    requestAnimationFrame(() => go(true));
    setTimeout(() => go(false), 500);
  };
  useEffect(toEnd, [app.messages.length, app.thinking]); // eslint-disable-line react-hooks/exhaustive-deps

  const runAction = (a: Action) => {
    tap();
    if (a.toast) app.showToast(a.toast);
    if (a.q) app.send(a.q);
    if (a.to) router.push(a.to as Href);
  };

  const empty = app.messages.length === 0 && !listening && !app.busy;
  const chips = app.logged ? CHIPS_IN : CHIPS_OUT;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: color.white }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* ---------- Barra superior ---------- */}
      {empty ? (
        <View style={[styles.appbar, { paddingTop: insets.top + 8 }]}>
          <BlueBackdrop />
          <Logo size={17} />
          <View style={{ flex: 1 }} />
          {app.logged ? (
            <>
              <IconButton icon="history" label="Conversas anteriores" onPress={() => router.push('/conversas')} />
              <Pressable accessibilityRole="button" accessibilityLabel={`Seu perfil, ${PERSON.name}`} onPress={() => router.navigate('/perfil')} hitSlop={6} style={{ marginLeft: 4 }}>
                <Avatar initials={PERSON.initials} size={38} light uri={app.photo} />
              </Pressable>
            </>
          ) : (
            <Button small kind="onBrand" icon="user" label="Entrar" href="/entrar" />
          )}
        </View>
      ) : (
        <View style={[styles.chatbar, { paddingTop: insets.top + 6 }]}>
          <BlueBackdrop />
          <View style={[styles.side, { flexDirection: 'row' }]}>
            <IconButton icon="back" label="Voltar" onPress={() => (router.canGoBack() ? router.back() : router.navigate('/inicio'))} />
            {app.logged && <IconButton icon="history" label="Conversas anteriores" onPress={() => router.push('/conversas')} />}
          </View>
          <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
            <View style={styles.robotHalo}>
              <Robot size={40} blink />
            </View>
            <View style={styles.namePill}>
              <T v="caption" c={color.white} style={{ fontFamily: font.semibold }}>
                Assistente Gov.pi
              </T>
            </View>
          </View>
          <View style={[styles.side, { alignItems: 'flex-end' }]}>
            <IconButton icon="close" label="Finalizar conversa" onPress={app.newChat} />
          </View>
        </View>
      )}
      {!empty && <Progress />}

      {/* ---------- Conteúdo ---------- */}
      {empty ? (
        <ScrollView contentContainerStyle={styles.hero} keyboardShouldPersistTaps="handled">
          <Robot size={80} blink />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 18 }}>
            <Icon name="spark" size={16} color={color.muted} />
            <T v="small" c={color.muted}>
              {app.logged ? `Olá, ${PERSON.first}!` : 'Assistente Gov.pi'}
            </T>
          </View>
          <T v="h1" accessibilityRole="header" style={styles.question}>
            O que você precisa resolver hoje?
          </T>
          <T v="small" c={color.muted} style={{ textAlign: 'center', maxWidth: 320 }}>
            Todos os serviços do Governo do Piauí em um só lugar. Converse com o assistente para chegar ao serviço certo.
          </T>
        </ScrollView>
      ) : (
        <ScrollView ref={scroll} nativeID="chat-scroll" style={{ flex: 1, minHeight: 0 }} onContentSizeChange={toEnd} contentContainerStyle={{ padding: 16, gap: 14 }} keyboardShouldPersistTaps="handled">
          {app.messages.map((m) => (
            <Bubble key={m.id} m={m} onAction={runAction} />
          ))}
          {listening && <Listening />}
          {app.thinking && <Thinking text={app.thinking} />}
        </ScrollView>
      )}

      {/* ---------- Campo de conversa ---------- */}
      <View style={{ paddingBottom: 10 }}>
        {empty && <LinearGradient pointerEvents="none" colors={['rgba(227,238,249,0)', '#E1ECFA', '#D3E3F7']} locations={[0, 0.55, 1]} style={styles.glow} />}
        {empty && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 16, paddingBottom: 12 }} keyboardShouldPersistTaps="handled">
            {chips.map((c) => (
              <Pressable
                key={c}
                accessibilityRole="button"
                onPress={() => {
                  tap();
                  if (c === 'Ver todos os serviços') router.navigate('/servicos');
                  else app.send(CHIP_Q[c] ?? c);
                }}
                style={({ pressed }) => [styles.chip, pressed && { borderColor: color.brand }]}>
                <T v="smallStrong">
                  {c}
                </T>
              </Pressable>
            ))}
          </ScrollView>
        )}
        <View style={{ paddingHorizontal: 16 }}>
          <AssistantComposer
            disabled={app.busy || listening}
            onSubmit={app.send}
            onTalk={() => listen(() => app.send('Quero renovar minha CNH'))}
            onAttach={() => app.showToast('Aqui você escolheria uma foto ou um arquivo.')}
          />
        </View>
        {empty ? (
          <T v="caption" c={color.muted} style={{ textAlign: 'center', marginTop: 10, marginBottom: 22 }}>
            Conheça nossa <T v="caption" c={color.ink} style={{ fontFamily: font.semibold, textDecorationLine: 'underline' }}>Política de Privacidade</T>.
          </T>
        ) : (
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18 }}>
            <LinkText label="Falar com um atendente" href="/whatsapp" c={color.muted} />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

/* ---------- Mensagens ---------- */
function Bubble({ m, onAction }: { m: Msg; onAction: (a: Action) => void }) {
  if (m.from === 'user')
    return (
      <View style={styles.user} accessibilityLabel={`Você: ${m.text}`}>
        <T v="body">
          {m.text}
        </T>
      </View>
    );
  return (
    <View style={{ gap: 10, alignItems: 'flex-start' }}>
      {m.text ? (
        <View style={styles.bot} accessibilityLabel={`Assistente: ${m.text}`}>
          <T v="body">
            {m.text}
          </T>
        </View>
      ) : null}
      {m.card && (
        <View style={{ alignSelf: 'stretch' }}>
          <CardView card={m.card} msg={m} onAction={onAction} />
        </View>
      )}
      {m.actions && (
        <View style={{ gap: 8 }}>
          {m.actions.map((a) => (
            <Button key={a.label} small kind={a.primary ? 'primary' : 'secondary'} label={a.label} onPress={() => onAction(a)} style={{ alignSelf: 'flex-start' }} />
          ))}
        </View>
      )}
    </View>
  );
}

/** Linha de status do carregamento: o texto novo sobe e substitui o anterior. */
function Thinking({ text }: { text: string }) {
  const [shown, setShown] = useState(text);
  const [prev, setPrev] = useState<string | null>(null);
  const a = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (text === shown) return;
    setPrev(shown);
    setShown(text);
    a.setValue(0);
    Animated.timing(a, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(() => setPrev(null));
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <View style={styles.thinking} accessibilityLiveRegion="polite" accessibilityLabel={shown}>
      <Robot size={26} />
      <View style={{ flex: 1, height: 24, overflow: 'hidden' }}>
        {prev && (
          <Animated.View style={{ position: 'absolute', left: 0, right: 0, opacity: a.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }), transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [0, -18] }) }] }}>
            <T v="body" c={color.muted} numberOfLines={1}>
              {prev}
            </T>
          </Animated.View>
        )}
        <Animated.View style={{ opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }] }}>
          <T v="body" c={color.muted} numberOfLines={1}>
            {shown}
          </T>
        </Animated.View>
      </View>
    </View>
  );
}

/** Barra de progresso abaixo do topo, avançando a cada etapa do carregamento. */
function Progress() {
  const { thinkStep, thinkTotal, busy } = useApp();
  const w = useRef(new Animated.Value(0)).current;
  const o = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (busy && thinkTotal) {
      Animated.timing(o, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      Animated.timing(w, { toValue: thinkStep / (thinkTotal + 0.4), duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    } else {
      Animated.sequence([
        Animated.timing(w, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(o, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => w.setValue(0));
    }
  }, [busy, thinkStep, thinkTotal, w, o]);
  return (
    <View style={{ height: 4, overflow: 'hidden' }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)} accessibilityElementsHidden>
      <Animated.View
        style={{
          width,
          height: 4,
          opacity: o,
          borderTopRightRadius: 2,
          borderBottomRightRadius: 2,
          overflow: 'hidden',
          transform: [{ translateX: w.interpolate({ inputRange: [0, 1], outputRange: [-width, 0] }) }],
        }}>
        <LinearGradient colors={['#6EBEFF', '#0B5CBD', '#034EA2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      </Animated.View>
    </View>
  );
}

function Listening() {
  return (
    <View style={{ alignItems: 'center', gap: 10, paddingVertical: 28 }} accessibilityLiveRegion="polite">
      <View style={styles.mic}>
        <Icon name="wave" size={30} color={color.white} strokeWidth={2.4} />
      </View>
      <T v="h2">Ouvindo…</T>
      <T v="small" c={color.muted}>
        Fale o que você precisa. Ex.: “quero renovar minha CNH”.
      </T>
    </View>
  );
}

/* ---------- Campo de conversa no estilo assistente ---------- */
function AssistantComposer({
  onSubmit,
  onTalk,
  onAttach,
  disabled,
}: {
  onSubmit: (t: string) => void;
  onTalk: () => void;
  onAttach: () => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState('');
  const has = text.trim().length > 0;
  const submit = () => {
    if (!has || disabled) return;
    tap();
    onSubmit(text.trim());
    setText('');
  };
  return (
    <View style={[styles.composer, disabled && { opacity: 0.55 }]}>
      <TextInput
        accessibilityLabel="Pergunte ao Assistente Gov.pi"
        value={text}
        onChangeText={setText}
        editable={!disabled}
        placeholder="Pergunte ao Assistente Gov.pi"
        placeholderTextColor={color.muted}
        onSubmitEditing={submit}
        returnKeyType="send"
        submitBehavior="submit"
        multiline
        style={styles.input}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Anexar foto ou arquivo" disabled={disabled} onPress={onAttach} style={styles.attach}>
          <Icon name="plus" size={18} color={color.ink} />
          <T v="smallStrong">
            Anexar
          </T>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ditar com o microfone"
          disabled={disabled}
          onPress={() => setText('Quero renovar minha CNH')}
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="mic" size={22} color={color.ink} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={has ? 'Enviar' : 'Falar com o assistente'} disabled={disabled} onPress={has ? submit : onTalk} style={({ pressed }) => [styles.talk, pressed && { opacity: 0.85 }]}>
          <LinearGradient colors={['#2F7FE6', '#034EA2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <View style={{ zIndex: 1 }}>
            <Icon name={has ? 'send' : 'wave'} size={20} color={color.white} strokeWidth={2.4} />
          </View>
          <T v="bodyStrong" c={color.white}>
            {has ? 'Enviar' : 'Fale'}
          </T>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appbar: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16, paddingBottom: 10, backgroundColor: color.brand, overflow: 'hidden' },
  chatbar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 10, backgroundColor: color.brand, overflow: 'hidden' },
  robotHalo: { width: 54, height: 54, borderRadius: 27, backgroundColor: color.white, alignItems: 'center', justifyContent: 'center' },
  side: { width: 96 },
  namePill: { flex: 0, alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 3, borderRadius: radius.pill, borderWidth: 1, borderColor: 'rgba(255,255,255,0.45)', backgroundColor: 'rgba(255,255,255,0.14)' },
  hero: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 24, gap: 6 },
  question: { textAlign: 'center', fontFamily: font.semibold, fontSize: 20, lineHeight: 26, marginTop: 4, maxWidth: 300 },
  glow: { position: 'absolute', left: 0, right: 0, bottom: -40, height: 300 },
  chip: { minHeight: 36, paddingHorizontal: 14, borderRadius: radius.pill, backgroundColor: color.white, borderWidth: 1, borderColor: color.lineStrong, justifyContent: 'center' },
  composer: { backgroundColor: color.white, borderRadius: radius.lg, borderWidth: 1, borderColor: color.line, paddingHorizontal: 14, paddingTop: 6, paddingBottom: 12, gap: 6, ...shadow.card },
  input: { minHeight: 50, maxHeight: 120, paddingHorizontal: 6, paddingTop: 12, fontFamily: font.regular, fontSize: 14, color: color.ink, outlineStyle: 'none' } as object,
  attach: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 42, paddingHorizontal: 14, borderRadius: radius.pill, backgroundColor: color.surface2 },
  talk: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, paddingHorizontal: 20, borderRadius: radius.pill, overflow: 'hidden' },
  user: { alignSelf: 'flex-end', maxWidth: '84%', backgroundColor: color.brandTint, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 16, borderBottomRightRadius: 4 },
  bot: { alignSelf: 'flex-start', maxWidth: '88%', backgroundColor: '#EEF1F5', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 16, borderBottomLeftRadius: 4 },
  thinking: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  mic: { width: 72, height: 72, borderRadius: 36, backgroundColor: color.brand, alignItems: 'center', justifyContent: 'center', borderWidth: 8, borderColor: color.brandTint },
});
