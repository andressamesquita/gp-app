import { Pressable, StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { color, font, radius } from '@/theme/tokens';
import { Icon } from './Icon';
import { ask, askVoice } from './nav';
import { Robot } from './Robot';
import { T, tap } from './ui';

const PLACEHOLDER = 'O que você precisa resolver?';

/**
 * Campo do Assistente, igual em todas as abas: robô à esquerda, frase e microfone.
 * - Sem `value`: é um atalho (toque abre o Assistente).
 * - Com `value`/`onChangeText`: dá para digitar (em Serviços filtra a lista) e a seta envia ao Assistente.
 */
export function AskField({
  value,
  onChangeText,
  flat,
  style,
  search,
}: {
  value?: string;
  onChangeText?: (t: string) => void;
  /** Sem contorno nem sombra (dentro da faixa azul fixa). */
  flat?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Campo de busca (aba Serviços): lupa no lugar do robô, "Busque por um serviço", microfone e sem a seta de envio. */
  search?: boolean;
}) {
  const editable = onChangeText !== undefined;
  const send = () => {
    tap();
    ask(value?.trim() || undefined);
  };

  const mic = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Falar com o Assistente Gov.pi"
      hitSlop={6}
      onPress={() => {
        tap();
        askVoice();
      }}
      style={({ pressed }) => [styles.mic, pressed && { backgroundColor: color.surface2 }]}>
      <Icon name="mic" size={22} color={color.ink} />
    </Pressable>
  );

  if (editable && search)
    return (
      <View style={[styles.box, flat && styles.flat, { paddingLeft: 16, paddingRight: 6 }, style]} accessibilityRole="search">
        <Icon name="search" size={22} color={color.ink} />
        <TextInput
          accessibilityLabel="Busque por um serviço"
          value={value}
          onChangeText={onChangeText}
          placeholder="Busque por um serviço"
          placeholderTextColor={color.muted}
          style={[styles.input, { marginLeft: 4 }]}
          returnKeyType="search"
        />
        {value ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Limpar busca" hitSlop={8} onPress={() => onChangeText?.('')} style={styles.mic}>
            <Icon name="close" size={18} color={color.muted} />
          </Pressable>
        ) : (
          mic
        )}
      </View>
    );

  if (editable)
    return (
      <View style={[styles.box, flat && styles.flat, style]}>
        <Robot size={28} />
        <TextInput
          accessibilityLabel={PLACEHOLDER}
          value={value}
          onChangeText={onChangeText}
          placeholder={PLACEHOLDER}
          placeholderTextColor={color.muted}
          style={styles.input}
          returnKeyType="send"
          onSubmitEditing={send}
        />
        {value ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Limpar" hitSlop={8} onPress={() => onChangeText?.('')} style={{ padding: 4 }}>
            <Icon name="close" size={18} color={color.muted} />
          </Pressable>
        ) : (
          mic
        )}
        <Pressable accessibilityRole="button" accessibilityLabel="Enviar ao Assistente Gov.pi" onPress={send} style={({ pressed }) => [styles.send, pressed && { opacity: 0.85 }]}>
          <Icon name="send" size={20} color={color.white} strokeWidth={2.2} />
        </Pressable>
      </View>
    );

  return (
    <Pressable
      accessibilityRole="search"
      accessibilityLabel={`${PLACEHOLDER} Pergunte ao Assistente Gov.pi`}
      accessibilityHint="Abre o Assistente Gov.pi"
      onPress={() => {
        tap();
        ask();
      }}
      style={({ pressed }) => [styles.box, flat && styles.flat, style, pressed && { borderColor: color.brand }]}>
      <Robot size={28} />
      <T v="body" c={color.muted} style={{ flex: 1, fontSize: 14, lineHeight: 20 }} numberOfLines={1}>
        {PLACEHOLDER}
      </T>
      {/* Sem seta: o campo inteiro já abre o Assistente (a seta era só desenho) */}
      {mic}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 12,
    paddingRight: 6,
    backgroundColor: color.surface,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: color.line,
  },
  flat: { borderColor: 'transparent' },
  input: { flex: 1, minHeight: 54, fontFamily: font.regular, fontSize: 14, color: color.ink, outlineStyle: 'none' } as object,
  mic: { width: 36, height: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  send: { width: 44, height: 44, borderRadius: radius.sm, backgroundColor: color.brand, alignItems: 'center', justifyContent: 'center' },
});
