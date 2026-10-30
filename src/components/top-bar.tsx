import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { PERSON } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { FAIXA_BRANCA } from '@/theme/tokens';
import { ChatHistoryButton, ChatHistorySheet } from './chat-history';
import { Avatar, Button, IconButton, Logo } from './ui';

/**
 * Linha da faixa superior da Início, reaproveitada no Assistente Gov.pi:
 * logo, histórico de conversas e, logado, avisos + avatar; deslogado, "Entrar".
 */
export function TopBarRow() {
  const app = useApp();
  const [history, setHistory] = useState(false);
  return (
    <>
      <View style={styles.row}>
        <Logo size={17} light={!FAIXA_BRANCA} />
        <View style={{ flex: 1 }} />
        <ChatHistoryButton onPress={() => setHistory(true)} />
        {app.logged ? (
          <>
            <IconButton icon="bell" label="Avisos" tone="bar" badge onPress={() => router.push('/avisos')} />
            <Pressable accessibilityRole="button" accessibilityLabel="Abrir Área do cidadão" onPress={() => router.navigate('/perfil')}>
              <Avatar initials={PERSON.initials} size={38} light={!FAIXA_BRANCA} uri={app.photo} />
            </Pressable>
          </>
        ) : (
          <Button small kind={FAIXA_BRANCA ? 'primary' : 'onBrand'} icon="user" label="Entrar" href="/entrar" style={{ marginLeft: 4 }} />
        )}
      </View>
      <ChatHistorySheet visible={history} onClose={() => setHistory(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 },
});
