import { ask } from '@/components/nav';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Page } from '@/components/page';
import { IconButton, Row, Section, T } from '@/components/ui';
import { PAST_CHATS } from '@/data/mock';
import { norm } from '@/state/assistant';
import { useApp } from '@/state/app-state';
import { color, font, radius } from '@/theme/tokens';

export default function Conversas() {
  const app = useApp();
  const [q, setQ] = useState('');
  const list = PAST_CHATS.filter((c) => !q || norm(c.t).includes(norm(q)));
  const groups = [...new Set(list.map((c) => c.group))];
  const current = app.messages.find((m) => m.from === 'user');

  return (
    <Page
      title="Conversas"
      right={
        <IconButton
          icon="edit"
          label="Nova conversa"
          onPress={() => {
            app.newChat();
            ask();
          }}
        />
      }>
      <View style={styles.search}>
        <Icon name="search" size={20} color={color.muted} />
        <TextInput accessibilityLabel="Buscar conversa" value={q} onChangeText={setQ} placeholder="Buscar conversa" placeholderTextColor={color.muted} style={styles.input} />
      </View>
      {current && (
        <Section title="Agora">
          <Row icon="chat" title={current.text ?? 'Conversa atual'} sub="Em andamento" onPress={() => ask()} last />
        </Section>
      )}
      {groups.map((g) => (
        <Section key={g} title={g}>
          <View>
            {list
              .filter((c) => c.group === g)
              .map((c, i, arr) => (
                <Row
                  key={c.p}
                  icon="chats"
                  title={c.t}
                  sub={`Protocolo ${c.p}`}
                  last={i === arr.length - 1}
                  onPress={() => {
                    app.newChat();
                    ask(c.q);
                  }}
                />
              ))}
          </View>
        </Section>
      ))}
      {!list.length && (
        <T v="small" c={color.muted}>
          Nenhuma conversa encontrada.
        </T>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, backgroundColor: color.surface, borderRadius: radius.sm, borderWidth: 1.5, borderColor: color.line, paddingHorizontal: 14 },
  input: { flex: 1, height: '100%', fontFamily: font.regular, fontSize: 14, color: color.ink, outlineStyle: 'none' } as object,
});
