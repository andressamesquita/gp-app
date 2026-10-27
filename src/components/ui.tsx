import * as Haptics from 'expo-haptics';
import { router, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/state/app-state';
import { color, font, radius, shadow, touch } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';

export const tap = () => {
  if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
};

/* ---------------- Texto ---------------- */
/**
 * Escala tipográfica compacta do app (base definida pelo design):
 *   títulos 16 semi-negrito · corpo e subtítulos 12 normal · rótulo de botão 12.
 * A hierarquia parte desses tamanhos:
 *   display 24 (pergunta do Assistente) · h1 20 (título de tela, nas faixas azuis)
 *   h2 16 (título de seção) · title 16 (título de card de destaque) · h3 14 (título de card e de linha)
 *   body/small 12 (texto e subtítulo) · label 12 (botões) · caption 11 (metadados) · eyebrow 10 (etiquetas)
 */
type Variant = 'display' | 'h1' | 'h2' | 'title' | 'h3' | 'body' | 'bodyStrong' | 'small' | 'smallStrong' | 'caption' | 'eyebrow' | 'label';
const V: Record<Variant, TextStyle> = {
  display: { fontFamily: font.semibold, fontSize: 24, lineHeight: 30, letterSpacing: -0.2 },
  h1: { fontFamily: font.semibold, fontSize: 20, lineHeight: 26, letterSpacing: -0.1 },
  h2: { fontFamily: font.semibold, fontSize: 16, lineHeight: 22 },
  title: { fontFamily: font.semibold, fontSize: 16, lineHeight: 22 },
  h3: { fontFamily: font.semibold, fontSize: 14, lineHeight: 20 },
  body: { fontFamily: font.regular, fontSize: 12, lineHeight: 18 },
  bodyStrong: { fontFamily: font.medium, fontSize: 14, lineHeight: 20 },
  small: { fontFamily: font.regular, fontSize: 12, lineHeight: 18 },
  smallStrong: { fontFamily: font.medium, fontSize: 12, lineHeight: 18 },
  caption: { fontFamily: font.regular, fontSize: 11, lineHeight: 14 },
  eyebrow: { fontFamily: font.semibold, fontSize: 10, lineHeight: 14, letterSpacing: 0.8, textTransform: 'uppercase' },
  label: { fontFamily: font.semibold, fontSize: 12, lineHeight: 16 },
};

export function T({ v = 'body', c = color.ink, style, ...p }: TextProps & { v?: Variant; c?: string }) {
  const { textScale, prefs } = useApp();
  const base = StyleSheet.flatten([V[v], style]) as TextStyle;
  const k = textScale;
  const sized = k === 1 ? null : { fontSize: (base.fontSize ?? 15) * k, lineHeight: base.lineHeight ? base.lineHeight * k : undefined };
  const col = prefs.contraste && c === color.muted ? color.ink : c;
  return <Text maxFontSizeMultiplier={1.6} {...p} style={[V[v], { color: col }, style, sized]} />;
}

/* ---------------- Logo ---------------- */
export function Logo({ light = true, size = 17 }: { light?: boolean; size?: number }) {
  const c = light ? color.white : color.navy;
  return (
    <View accessible accessibilityRole="header" accessibilityLabel="Gov.pi Cidadão">
      <Text style={{ fontFamily: font.regular, fontSize: size, lineHeight: size * 1.05, color: c }}>
        Gov.<Text style={{ fontFamily: font.bold, color: light ? color.white : color.brand }}>pi</Text>
      </Text>
      <Text style={{ fontFamily: font.bold, fontSize: size, lineHeight: size * 1.05, color: c }}>Cidadão</Text>
    </View>
  );
}

/* ---------------- Botões ---------------- */
type BtnKind = 'primary' | 'secondary' | 'ghost' | 'onBrand' | 'whats' | 'danger' | 'onWhats';
export function Button({
  label,
  kind = 'primary',
  icon,
  iconRight,
  onPress,
  href,
  style,
  small,
  disabled,
  a11y,
}: {
  label: string;
  kind?: BtnKind;
  icon?: IconName;
  iconRight?: IconName;
  onPress?: () => void;
  href?: Href;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
  disabled?: boolean;
  a11y?: string;
}) {
  const s = BTN[kind];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y ?? label}
      disabled={disabled}
      android_ripple={{ color: 'rgba(255,255,255,0.18)', borderless: false }}
      onPress={() => {
        tap();
        if (onPress) onPress();
        else if (href) router.push(href);
      }}
      style={({ pressed }) => [
        styles.btn,
        small && { minHeight: 40, paddingHorizontal: 14 },
        { backgroundColor: s.bg, borderColor: s.border },
        pressed && { opacity: 0.85, transform: [{ scale: 0.985 }] },
        disabled && { opacity: 0.45 },
        style,
      ]}>
      {icon && <Icon name={icon} size={18} color={s.fg} />}
      <T v="label" c={s.fg} numberOfLines={2}>
        {label}
      </T>
      {iconRight && <Icon name={iconRight} size={18} color={s.fg} />}
    </Pressable>
  );
}
const BTN: Record<BtnKind, { bg: string; fg: string; border: string }> = {
  primary: { bg: color.brand, fg: color.white, border: color.brand },
  secondary: { bg: 'transparent', fg: color.brand, border: color.brand },
  ghost: { bg: color.surface2, fg: color.brand, border: color.surface2 },
  onBrand: { bg: color.white, fg: color.brand, border: color.white },
  onWhats: { bg: color.white, fg: color.whats, border: color.white },
  whats: { bg: color.whats, fg: color.white, border: color.whats },
  danger: { bg: 'transparent', fg: color.danger, border: color.line },
};

export function LinkText({ label, onPress, href, c = color.brand, icon }: { label: string; onPress?: () => void; href?: Href; c?: string; icon?: IconName }) {
  return (
    <Pressable
      accessibilityRole="link"
      hitSlop={10}
      onPress={() => (onPress ? onPress() : href && router.push(href))}
      style={({ pressed }) => [{ minHeight: 40, flexDirection: 'row', alignItems: 'center', gap: 4 }, pressed && { opacity: 0.6 }]}>
      <T v="label" c={c}>
        {label}
      </T>
      {icon && <Icon name={icon} size={16} color={c} />}
    </Pressable>
  );
}

export function IconButton({
  icon,
  label,
  onPress,
  tone = 'onBrand',
  badge,
  badgeColor,
  size = touch,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  tone?: 'onBrand' | 'plain' | 'soft';
  badge?: boolean;
  /** Cor da bolinha (padrão: vermelho de aviso). Verde = há conversas salvas. */
  badgeColor?: string;
  size?: number;
}) {
  const fg = tone === 'onBrand' ? color.white : color.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        tap();
        onPress();
      }}
      android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true, radius: size / 2 }}
      style={({ pressed }) => [
        { width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' },
        tone === 'soft' && { backgroundColor: color.surface2 },
        pressed && { backgroundColor: tone === 'onBrand' ? 'rgba(255,255,255,0.16)' : color.surface2 },
      ]}>
      <Icon name={icon} size={22} color={fg} />
      {badge && <View style={[styles.badge, { borderColor: tone === 'onBrand' ? color.brand : color.white }, badgeColor ? { backgroundColor: badgeColor } : null]} />}
    </Pressable>
  );
}

/* ---------------- Chips e tags ---------------- */
export function Chip({
  label,
  icon,
  onPress,
  on,
  glass,
  count,
}: {
  label: string;
  icon?: IconName;
  onPress?: () => void;
  on?: boolean;
  glass?: boolean;
  /** Número exibido depois do nome; quando presente, o chip não mostra o ✓ de selecionado. */
  count?: number;
}) {
  const fg = glass ? color.white : on ? color.white : color.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!on }}
      accessibilityLabel={count !== undefined ? `${label}, ${count}` : undefined}
      onPress={() => {
        tap();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.chip,
        glass
          ? { backgroundColor: 'rgba(255,255,255,0.14)', borderColor: 'rgba(255,255,255,0.45)' }
          : on
            ? { backgroundColor: color.brand, borderColor: color.brand }
            : { backgroundColor: color.surface, borderColor: color.lineStrong },
        pressed && { opacity: 0.75 },
      ]}>
      {on && !glass && count === undefined && <Icon name="check" size={16} color={fg} strokeWidth={2.4} />}
      {icon && <Icon name={icon} size={17} color={glass ? color.white : on ? color.white : color.brand} />}
      <T v="smallStrong" c={fg} numberOfLines={1}>
        {label}
      </T>
      {count !== undefined && (
        <View style={[styles.chipCount, { backgroundColor: on ? 'rgba(255,255,255,0.22)' : color.surface2 }]}>
          <T v="caption" c={fg} style={{ fontFamily: font.semibold }}>
            {count}
          </T>
        </View>
      )}
    </Pressable>
  );
}

export function Tag({ label, tone = 'brand', center }: { label: string; tone?: 'brand' | 'good' | 'warn' | 'muted' | 'danger' | 'dark'; center?: boolean }) {
  const m = {
    brand: [color.brandTint, color.brand],
    good: [color.goodBg, color.good],
    warn: [color.warnBg, color.warnInk],
    muted: [color.surface2, color.muted],
    danger: [color.dangerBg, '#A8290F'],
    dark: [color.navy, color.white],
  }[tone];
  return (
    <View style={{ backgroundColor: m[0], borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3, alignSelf: center ? 'center' : 'flex-start' }}>
      <T v="caption" c={m[1]} style={{ fontFamily: font.semibold }}>
        {label}
      </T>
    </View>
  );
}

export function statusTone(s: string): 'brand' | 'good' | 'warn' | 'muted' {
  if (/conclu|renovada|pronta/i.test(s)) return 'good';
  if (/process|vence|precisa/i.test(s)) return 'warn';
  if (/não se aplica/i.test(s)) return 'muted';
  return 'brand';
}

/* ---------------- Blocos ---------------- */
export function Card({ children, style, onPress, a11y }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; a11y?: string }) {
  if (onPress)
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={a11y}
        onPress={() => {
          tap();
          onPress();
        }}
        style={({ pressed }) => [styles.card, style, pressed && { borderColor: color.brand, transform: [{ scale: 0.99 }] }]}>
        {children}
      </Pressable>
    );
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Section({
  title,
  action,
  children,
  style,
  flat,
}: {
  title: string;
  action?: { label: string; href?: Href; onPress?: () => void };
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Sem card: fundo branco da tela e divisória clara em cima (seções da Área do cidadão). */
  flat?: boolean;
}) {
  return (
    <View style={[styles.section, flat && styles.sectionFlat, style]}>
      <View style={styles.sectionHead}>
        <T v="h2" accessibilityRole="header" style={{ flex: 1 }}>
          {title}
        </T>
        {action && <LinkText label={action.label} href={action.href} onPress={action.onPress} />}
      </View>
      {children}
    </View>
  );
}

export function Empty({ icon, title, text, action }: { icon: IconName; title: string; text: string; action?: { label: string; href?: Href; onPress?: () => void } }) {
  return (
    <View style={{ alignItems: 'flex-start', gap: 8, paddingVertical: 6 }}>
      <View style={styles.emptyIco}>
        <Icon name={icon} size={22} color={color.brand} />
      </View>
      <T v="bodyStrong">{title}</T>
      <T v="small" c={color.muted}>
        {text}
      </T>
      {action && <Button small kind="secondary" label={action.label} href={action.href} onPress={action.onPress} style={{ marginTop: 4 }} />}
    </View>
  );
}

export function Row({
  icon,
  title,
  sub,
  right,
  onPress,
  last,
  tone,
}: {
  icon?: IconName;
  title: string;
  sub?: string;
  right?: ReactNode;
  onPress?: () => void;
  last?: boolean;
  tone?: { bg: string; fg: string };
}) {
  return (
    <Pressable
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={() => {
        tap();
        onPress?.();
      }}
      android_ripple={{ color: color.surface2 }}
      style={({ pressed }) => [styles.row, !last && styles.rowLine, pressed && { backgroundColor: color.bg }]}>
      {icon && (
        <View style={[styles.rowIco, tone && { backgroundColor: tone.bg }]}>
          <Icon name={icon} size={20} color={tone?.fg ?? color.brand} />
        </View>
      )}
      <View style={{ flex: 1, gap: 2 }}>
        <T v="bodyStrong">
          {title}
        </T>
        {sub ? (
          <T v="small" c={color.muted}>
            {sub}
          </T>
        ) : null}
      </View>
      {right ?? (onPress ? <Icon name="right" size={18} color={color.muted} /> : null)}
    </Pressable>
  );
}

export function SwitchRow({ title, sub, value, onChange, last }: { title: string; sub: string; value: boolean; onChange: (v: boolean) => void; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowLine]}>
      <View style={{ flex: 1, gap: 2 }}>
        <T v="bodyStrong">
          {title}
        </T>
        <T v="small" c={color.muted}>
          {sub}
        </T>
      </View>
      <Switch
        accessibilityLabel={title}
        value={value}
        onValueChange={(v) => {
          tap();
          onChange(v);
        }}
        trackColor={{ false: color.lineStrong, true: color.brand }}
        thumbColor={color.white}
        {...(Platform.OS === 'web' ? ({ activeThumbColor: color.white } as object) : {})}
      />
    </View>
  );
}

export function Avatar({ initials, size = 40, light, uri }: { initials: string; size?: number; light?: boolean; uri?: string | null }) {
  if (uri) return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2, borderWidth: light ? 2 : 0, borderColor: color.white }} accessibilityLabel="Foto de perfil" />;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: light ? color.white : color.navy,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <T v="smallStrong" c={light ? color.brand : color.white} style={{ fontFamily: font.bold, fontSize: size * 0.36 }}>
        {initials}
      </T>
    </View>
  );
}

/* ---------------- Cabeçalho azul das telas internas ---------------- */
export function ScreenHeader({
  title,
  sub,
  onBack,
  right,
  close,
}: {
  title: string;
  sub?: string;
  onBack?: () => void;
  right?: ReactNode;
  close?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
      <IconButton
        icon={close ? 'close' : 'back'}
        label={close ? 'Fechar' : 'Voltar'}
        onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
      />
      <View style={{ flex: 1 }}>
        <T v="h2" c={color.white} accessibilityRole="header" numberOfLines={1}>
          {title}
        </T>
        {sub ? (
          <T v="caption" c="rgba(255,255,255,0.85)" numberOfLines={1}>
            {sub}
          </T>
        ) : null}
      </View>
      {right}
    </View>
  );
}

/* ---------------- Toast (snackbar) ---------------- */
export function Toast({ text }: { text: string | null }) {
  const insets = useSafeAreaInsets();
  if (!text) return null;
  return (
    <View pointerEvents="none" accessibilityLiveRegion="polite" style={[styles.toast, { bottom: insets.bottom + 96 }]}>
      <T v="smallStrong" c={color.white} style={{ textAlign: 'center' }}>
        {text}
      </T>
    </View>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <View style={{ gap: 6 }}>
      <T v="smallStrong">{label}</T>
      {children}
      {hint ? (
        <T v="caption" c={color.muted}>
          {hint}
        </T>
      ) : null}
    </View>
  );
}

export const inputStyle: TextStyle = {
  minHeight: 52,
  borderWidth: 1.5,
  borderColor: color.lineStrong,
  borderRadius: radius.sm,
  paddingHorizontal: 14,
  fontFamily: font.medium,
  fontSize: 14,
  color: color.ink,
  backgroundColor: color.surface,
};

export function PressableScale(p: PressableProps & { style?: StyleProp<ViewStyle> }) {
  return <Pressable {...p} style={({ pressed }) => [p.style, pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }]} />;
}

const styles = StyleSheet.create({
  btn: {
    minHeight: touch,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  badge: { position: 'absolute', top: 11, right: 12, width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF5A4D', borderWidth: 2 },
  chipCount: { minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center' },
  chip: {
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.line,
    padding: 16,
  },
  section: {
    backgroundColor: color.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: color.line,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    gap: 10,
  },
  sectionFlat: { backgroundColor: 'transparent', borderWidth: 0, borderTopWidth: 1, borderTopColor: color.divider, borderRadius: 0, marginHorizontal: -16, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', minHeight: 44, gap: 8 },
  emptyIco: { width: 44, height: 44, borderRadius: 12, backgroundColor: color.brandTint, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60, paddingVertical: 10 },
  rowLine: { borderBottomWidth: 1, borderBottomColor: color.line },
  rowIco: { width: 40, height: 40, borderRadius: 10, backgroundColor: color.brandTint, alignItems: 'center', justifyContent: 'center' },
  header: {
    backgroundColor: color.brand,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingBottom: 10,
  },
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: color.ink,
    borderRadius: radius.md,
    paddingHorizontal: 18,
    paddingVertical: 14,
    zIndex: 100,
    ...shadow.float,
  },
});
