import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AuthDivider, AuthShell } from '@/components/auth-shell';
import { PasswordInput, maskCpf } from '@/components/form';
import { Icon } from '@/components/Icon';
import { Button, Field, LinkText, T, inputStyle, tap } from '@/components/ui';
import { useApp } from '@/state/app-state';
import { color, font, radius } from '@/theme/tokens';

/** Login no modelo do Gov.pi Cidadão atual: cartão branco sobre o azul, CPF, senha e gov.br / ID Piauí. */
export default function Entrar() {
  const app = useApp();
  const [cpf, setCpf] = useState('');
  const [pw, setPw] = useState('');
  const [keep, setKeep] = useState(false);
  const { from } = useLocalSearchParams<{ from?: string }>();
  const enter = () => {
    if (router.canDismiss()) router.dismissAll();
    else router.back();
    if (from === 'chat') {
      app.resumeAfterLogin();
      return;
    }
    app.setLogged(true);
    app.showToast('Bem-vinda de volta, Ana.');
  };
  return (
    <AuthShell>
      <Field label="CPF">
        <TextInput value={cpf} onChangeText={(v) => setCpf(maskCpf(v))} keyboardType="number-pad" placeholder="000.000.000-00" placeholderTextColor={color.muted} style={inputStyle} accessibilityLabel="CPF" />
      </Field>
      <View style={{ gap: 6 }}>
        <Field label="Senha">
          <PasswordInput placeholder="Digite sua senha" value={pw} onChangeText={setPw} />
        </Field>
        <View style={{ alignItems: 'flex-end' }}>
          <LinkText label="Esqueci minha senha" href="/recuperar-senha" />
        </View>
      </View>

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: keep }}
        onPress={() => {
          tap();
          setKeep((k) => !k);
        }}
        style={styles.keep}>
        <View style={[styles.box, keep && styles.boxOn]}>{keep ? <Icon name="check" size={15} color={color.white} strokeWidth={3} /> : null}</View>
        <T v="small" c={color.muted}>
          Manter-me conectado
        </T>
      </Pressable>

      <Button label="Entrar" onPress={enter} style={{ marginTop: 4 }} />

      <AuthDivider />

      <T v="small" c={color.muted} style={{ textAlign: 'center' }}>
        ou faça login através de um dos meios abaixo
      </T>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Entrar com gov.br" onPress={enter} style={({ pressed }) => [styles.idp, pressed && { borderColor: color.brand }]}>
          <T style={{ fontFamily: font.bold, fontSize: 18, lineHeight: 22, color: '#1351B4', letterSpacing: -0.5 }}>
            gov<T style={{ fontFamily: font.bold, fontSize: 18, color: '#FFCD07' }}>.</T>br
          </T>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Entrar com ID Piauí" onPress={enter} style={({ pressed }) => [styles.idp, pressed && { borderColor: color.brand }]}>
          <T style={{ fontFamily: font.bold, fontSize: 16, lineHeight: 22, color: '#0E7A3B', letterSpacing: -0.3 }}>ID Piauí</T>
        </Pressable>
      </View>

    </AuthShell>
  );
}

const styles = StyleSheet.create({
  keep: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 40, alignSelf: 'flex-start' },
  box: { width: 22, height: 22, borderRadius: 5, borderWidth: 1.5, borderColor: color.lineStrong, alignItems: 'center', justifyContent: 'center', backgroundColor: color.surface },
  boxOn: { backgroundColor: color.brand, borderColor: color.brand },
  idp: { flex: 1, minHeight: 48, borderWidth: 1, borderColor: color.line, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: color.surface },
});
