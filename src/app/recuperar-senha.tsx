import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput } from 'react-native';

import { Page } from '@/components/page';
import { Button, Field, LinkText, T, inputStyle } from '@/components/ui';
import { useApp } from '@/state/app-state';
import { color } from '@/theme/tokens';
import { maskCpf } from '@/components/form';

export default function RecuperarSenha() {
  const app = useApp();
  const [cpf, setCpf] = useState('');
  return (
    <Page title="Recuperar senha">
      <T v="h1">Esqueceu sua senha?</T>
      <T v="body" c={color.muted}>
        Informe seu CPF. Enviamos as instruções para o celular ou e-mail cadastrado.
      </T>
      <Field label="CPF">
        <TextInput value={cpf} onChangeText={(v) => setCpf(maskCpf(v))} keyboardType="number-pad" placeholder="000.000.000-00" placeholderTextColor={color.muted} style={inputStyle} />
      </Field>
      <Button
        label="Recuperar senha"
        onPress={() => {
          app.showToast('Enviamos as instruções para o contato cadastrado.');
          router.back();
        }}
      />
      <LinkText label="Voltar para o login" onPress={() => router.back()} />
    </Page>
  );
}
