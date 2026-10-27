import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { View } from 'react-native';

import { FlatBlock, Page } from '@/components/page';
import { Avatar, Button, LinkText, Row, Section, T, Tag } from '@/components/ui';
import { PERSON } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { color } from '@/theme/tokens';

export default function MeuPerfil() {
  const app = useApp();

  const pick = async (from: 'galeria' | 'camera') => {
    try {
      if (from === 'camera') {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) return app.showToast('Sem permissão para usar a câmera.');
      }
      const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7 };
      const res = from === 'camera' ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
      if (!res.canceled && res.assets[0]) {
        app.setPhoto(res.assets[0].uri);
        app.showToast('Foto de perfil atualizada.');
      }
    } catch {
      app.showToast('Não foi possível abrir a câmera neste aparelho.');
    }
  };

  return (
    <Page title="Meu perfil" flat>
      <View style={{ alignItems: 'center', gap: 8, paddingVertical: 24 }}>
        <Avatar initials={PERSON.initials} size={88} uri={app.photo} />
        <T v="h2">{PERSON.name}</T>
        <Tag label={`Conta ${PERSON.level}`} tone="brand" center />
      </View>
      <Section title="Foto de perfil">
        <T v="small" c={color.muted}>
          A foto aparece na Área do cidadão, no Assistente e nas conquistas que você publicar.
        </T>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button kind="secondary" icon="image" label="Galeria" small style={{ flex: 1 }} onPress={() => pick('galeria')} />
          <Button kind="secondary" icon="camera" label="Tirar foto" small style={{ flex: 1 }} onPress={() => pick('camera')} />
        </View>
        {app.photo ? (
          <LinkText
            label="Remover foto"
            c={color.danger}
            onPress={() => {
              app.setPhoto(null);
              app.showToast('Foto removida.');
            }}
          />
        ) : null}
      </Section>
      <Section title="Seus dados">
        <View>
          <Row icon="user" title="Nome" sub={PERSON.name} />
          <Row icon="idcard" title="CPF" sub="•••.•••.•••-••" />
          <Row icon="calendar" title="Data de nascimento" sub="14/03/1988" />
          <Row icon="phone" title="Celular" sub="(86) 9 •••• -4421" />
          <Row icon="chat" title="E-mail" sub="ana.s•••@email.com" />
          <Row icon="pin" title="Endereço" sub="Falta informar" right={<Tag label="Pendente" tone="warn" />} onPress={() => router.push('/faltam-dados')} last />
        </View>
        <T v="caption" c={color.muted}>
          Nome e CPF vêm da sua conta gov.br ou ID Piauí.
        </T>
      </Section>
      <Section title="Nível da conta">
        <T v="small">Sua conta é nível {PERSON.level}, o mais alto. Você pode usar todos os serviços do Gov.pi, inclusive os que pedem assinatura digital.</T>
      </Section>
      <FlatBlock>
        <Button kind="secondary" label="Atualizar meus dados" onPress={() => app.showToast('Aqui abriria a edição dos dados de contato.')} />
      </FlatBlock>
    </Page>
  );
}
