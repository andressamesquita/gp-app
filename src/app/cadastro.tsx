import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { AuthShell } from '@/components/auth-shell';
import { Button, Field, LinkText, T, inputStyle } from '@/components/ui';
import { useApp } from '@/state/app-state';
import { color } from '@/theme/tokens';
import { PasswordInput, maskCpf } from '@/components/form';

function Check({ on, onPress, children }: { on: boolean; onPress: () => void; children: React.ReactNode }) {
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: on }} onPress={onPress} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', minHeight: 44 }}>
      <View style={{ width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: on ? color.brand : color.lineStrong, backgroundColor: on ? color.brand : color.surface, alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
        {on && <Icon name="check" size={16} color={color.white} strokeWidth={3} />}
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </Pressable>
  );
}

export default function Cadastro() {
  const app = useApp();
  const [f, setF] = useState({ nome: '', mae: '', cpf: '', tel: '', nasc: '', email: '', pw: '', pw2: '' });
  const [t1, setT1] = useState(false);
  const [t2, setT2] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: k === 'cpf' ? maskCpf(v) : v }));
  const rules = [
    { t: 'No mínimo 8 caracteres', ok: f.pw.length >= 8 },
    { t: 'Use letras e números', ok: /[a-z]/i.test(f.pw) && /\d/.test(f.pw) },
    { t: 'Um caractere especial (@ ! # $ ...)', ok: /[^a-z0-9]/i.test(f.pw) },
  ];
  return (
    <AuthShell title="Criar conta">
      <T v="h2">Informe os dados abaixo para criar sua conta</T>
      <Field label="Nome completo">
        <TextInput value={f.nome} onChangeText={set('nome')} placeholder="Digite seu nome completo" placeholderTextColor={color.muted} style={inputStyle} autoComplete="name" />
      </Field>
      <Field label="Nome da mãe">
        <TextInput value={f.mae} onChangeText={set('mae')} placeholder="Digite o nome completo da sua mãe" placeholderTextColor={color.muted} style={inputStyle} />
      </Field>
      <Field label="CPF">
        <TextInput value={f.cpf} onChangeText={set('cpf')} keyboardType="number-pad" placeholder="000.000.000-00" placeholderTextColor={color.muted} style={inputStyle} />
      </Field>
      <Field label="Telefone celular">
        <TextInput value={f.tel} onChangeText={set('tel')} keyboardType="phone-pad" placeholder="(86) 9 0000-0000" placeholderTextColor={color.muted} style={inputStyle} autoComplete="tel" />
      </Field>
      <Field label="Data de nascimento">
        <TextInput value={f.nasc} onChangeText={set('nasc')} keyboardType="number-pad" placeholder="dd/mm/aaaa" placeholderTextColor={color.muted} style={inputStyle} />
      </Field>
      <Field label="E-mail">
        <TextInput value={f.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" placeholder="email@exemplo.com" placeholderTextColor={color.muted} style={inputStyle} autoComplete="email" />
      </Field>
      <Field label="Senha">
        <PasswordInput placeholder="Crie uma senha" value={f.pw} onChangeText={set('pw')} />
      </Field>
      <Field label="Confirme a senha">
        <PasswordInput placeholder="Repita a senha" value={f.pw2} onChangeText={set('pw2')} />
      </Field>
      <View style={{ gap: 6 }}>
        {rules.map((r) => (
          <View key={r.t} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Icon name={r.ok ? 'check' : 'dot'} size={16} color={r.ok ? color.good : color.lineStrong} strokeWidth={2.6} />
            <T v="small" c={r.ok ? color.good : color.muted}>
              {r.t}
            </T>
          </View>
        ))}
      </View>
      <Check on={t1} onPress={() => setT1((v) => !v)}>
        <T v="small">
          Li e aceito os <T v="smallStrong" c={color.brand}>Termos de Uso e a Política de Privacidade</T>
        </T>
      </Check>
      <Check on={t2} onPress={() => setT2((v) => !v)}>
        <T v="small">
          Li e aceito o <T v="smallStrong" c={color.brand}>Termo de Consentimento para Tratamento de Dados Pessoais</T>
        </T>
      </Check>
      <Button
        label="Criar conta"
        disabled={!t1 || !t2}
        onPress={() => {
          app.setScenario('novo');
          app.setLogged(true);
          if (router.canDismiss()) router.dismissAll();
          router.navigate('/');
          app.showToast('Conta criada. Boas-vindas ao Gov.pi!');
        }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
        <T v="small" c={color.muted}>
          Já tem conta?
        </T>
        <LinkText label="Entrar" href="/entrar" />
      </View>
    </AuthShell>
  );
}
