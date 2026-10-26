import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Page } from '@/components/page';
import { Button, Field, LinkText, T, inputStyle } from '@/components/ui';
import { useApp } from '@/state/app-state';
import { color, radius } from '@/theme/tokens';

export default function FaltamDados() {
  const app = useApp();
  const [addr, setAddr] = useState('');
  const [save, setSave] = useState(true);
  const [tried, setTried] = useState(false);
  const err = tried && addr.trim().length < 6;
  return (
    <Page
      title="Segunda via da CNH"
      footer={
        <>
          <Button
            label="Continuar"
            onPress={() => {
              setTried(true);
              if (addr.trim().length < 6) return;
              app.showToast('Pedido de segunda via registrado (simulação).');
              router.back();
            }}
          />
          <LinkText label="Falar com um atendente" href="/whatsapp" />
        </>
      }>
      <T v="h2">Quase pronto. Falta só uma informação.</T>
      <View style={styles.card}>
        <T v="eyebrow" c={color.muted}>
          Já temos
        </T>
        {[
          ['Nome', 'Ana Souza'],
          ['CPF', '•••.•••.•••-••'],
          ['Categoria', 'B'],
        ].map(([k, v]) => (
          <View key={k} style={styles.kv}>
            <T v="small" c={color.muted}>
              {k}
            </T>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <T v="smallStrong">{v}</T>
              <Icon name="check" size={16} color={color.good} strokeWidth={2.4} />
            </View>
          </View>
        ))}
      </View>
      <View style={[styles.card, { borderColor: color.brand, borderWidth: 1.5 }]}>
        <T v="eyebrow" c={color.brand}>
          O que falta
        </T>
        <Field label="Endereço atual" hint="Não encontramos um endereço atualizado no seu cadastro.">
          <TextInput
            value={addr}
            onChangeText={setAddr}
            placeholder="Rua, número e bairro"
            placeholderTextColor={color.muted}
            style={[inputStyle, err && { borderColor: color.danger }]}
            accessibilityLabel="Endereço atual"
            autoComplete="street-address"
          />
        </Field>
        {err && (
          <View accessibilityRole="alert" style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <Icon name="alert" size={16} color={color.danger} />
            <T v="smallStrong" c={color.danger}>
              Informe o endereço para continuar.
            </T>
          </View>
        )}
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: save }} onPress={() => setSave((s) => !s)} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', minHeight: 44 }}>
          <View style={[styles.box, save && { backgroundColor: color.brand, borderColor: color.brand }]}>{save && <Icon name="check" size={16} color={color.white} strokeWidth={3} />}</View>
          <T v="small" style={{ flex: 1 }}>
            Guardar no meu perfil para as próximas solicitações
          </T>
        </Pressable>
        <LinkText label="Por que preciso informar isso?" onPress={() => app.showToast('O DETRAN envia a CNH física para este endereço.')} />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: color.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: color.line, padding: 16, gap: 10 },
  kv: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  box: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: color.lineStrong, alignItems: 'center', justifyContent: 'center' },
});
