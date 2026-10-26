import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Page } from '@/components/page';
import { PasswordInput, maskCpf } from '@/components/form';
import { Button, Field, LinkText, T, inputStyle } from '@/components/ui';
import { useApp } from '@/state/app-state';
import { color, font, radius } from '@/theme/tokens';

export default function Entrar() {
  const app = useApp();
  const [cpf, setCpf] = useState('');
  const [pw, setPw] = useState('');
  const [keep, setKeep] = useState(true);
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
    <Page title="Entrar">
      <T v="h1">Acesse sua conta</T>
      <Field label="CPF">
        <TextInput value={cpf} onChangeText={(v) => setCpf(maskCpf(v))} keyboardType="number-pad" placeholder="000.000.000-00" placeholderTextColor={color.muted} style={inputStyle} accessibilityLabel="CPF" />
      </Field>
      <Field label="Senha">
        <PasswordInput placeholder="Digite sua senha" value={pw} onChangeText={setPw} />
      </Field>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Switch value={keep} onValueChange={setKeep} trackColor={{ false: color.lineStrong, true: color.brand }} thumbColor={color.white} accessibilityLabel="Manter-me conectado" />
          <T v="small">Manter-me conectado</T>
        </View>
        <LinkText label="Esqueci a senha" href="/recuperar-senha" />
      </View>
      <Button label="Entrar" onPress={enter} />
      <View style={styles.or}>
        <View style={styles.line} />
        <T v="caption" c={color.muted}>
          ou entre com
        </T>
        <View style={styles.line} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable accessibilityRole="button" onPress={enter} style={[styles.idp, { borderColor: '#1351B4' }]}>
          <T v="bodyStrong" c="#1351B4" style={{ fontFamily: font.bold }}>
            gov.br
          </T>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={enter} style={[styles.idp, { borderColor: color.brand }]}>
          <T v="bodyStrong" c={color.brand} style={{ fontFamily: font.bold }}>
            ID Piauí
          </T>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
        <T v="small" c={color.muted}>
          Não possui uma conta?
        </T>
        <LinkText label="Cadastre-se" href="/cadastro" />
      </View>
      <View style={{ alignItems: 'center' }}>
        <LinkText label="Não tenho CPF" c={color.muted} onPress={() => app.showToast('Aqui mostraríamos como ser atendido sem CPF.')} />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  eye: { position: 'absolute', right: 4, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  or: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  line: { flex: 1, height: 1, backgroundColor: color.line },
  idp: { flex: 1, minHeight: 52, borderWidth: 1.5, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: color.surface },
});
