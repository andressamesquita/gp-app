import { router } from 'expo-router';
import { View } from 'react-native';

import { PAST_CHATS } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { color } from '@/theme/tokens';
import { ask } from './nav';
import { Sheet } from './sheet';
import { Button, Empty, IconButton, LinkText, Row, T } from './ui';

/** Verde da bolinha que avisa que há conversas salvas. */
export const CHAT_DOT = '#22C55E';

/** Há conversas para mostrar? Deslogado: só a da sessão. Logado: a da sessão e o histórico da conta. */
export function useHasChats() {
  const { messages, logged } = useApp();
  return messages.some((m) => m.from === 'user') || (logged && PAST_CHATS.length > 0);
}

/** Ícone de conversas para a faixa azul, com bolinha verde quando há conversas salvas. */
export function ChatHistoryButton({ onPress }: { onPress: () => void }) {
  const has = useHasChats();
  return <IconButton icon="chats" label={has ? 'Conversas, há conversas salvas' : 'Conversas'} tone="onBrand" badge={has} badgeColor={CHAT_DOT} onPress={onPress} />;
}

/** Folha com o histórico de conversas: da sessão (sem login) ou da sessão + conta (com login). */
export function ChatHistorySheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const app = useApp();
  const current = app.messages.find((m) => m.from === 'user');
  const past = app.logged ? PAST_CHATS : [];
  const groups = [...new Set(past.map((c) => c.group))];
  const go = (fn: () => void) => {
    onClose();
    fn();
  };

  return (
    <Sheet visible={visible} onClose={onClose} title="Conversas" sub={app.logged ? 'Desta sessão e da sua conta Gov.pi.' : 'Desta sessão. Entre na conta para guardar o histórico.'}>
      {current ? (
        <View>
          <T v="eyebrow" c={color.muted}>
            Nesta sessão
          </T>
          <Row icon="chat" title={current.text ?? 'Conversa atual'} sub="Em andamento · toque para continuar" onPress={() => go(() => ask())} last />
        </View>
      ) : null}

      {groups.map((g) => (
        <View key={g}>
          <T v="eyebrow" c={color.muted}>
            {g}
          </T>
          {past
            .filter((c) => c.group === g)
            .map((c, i, arr) => (
              <Row
                key={c.p}
                icon="chats"
                title={c.t}
                sub={`Protocolo ${c.p}`}
                last={i === arr.length - 1}
                onPress={() =>
                  go(() => {
                    app.newChat();
                    ask(c.q);
                  })
                }
              />
            ))}
        </View>
      ))}

      {!current && !past.length ? (
        <Empty icon="chats" title="Nenhuma conversa ainda" text="Quando você falar com o Assistente Gov.pi, a conversa aparece aqui." />
      ) : null}

      <Button
        icon="edit"
        label="Nova conversa"
        kind={current || past.length ? 'secondary' : 'primary'}
        onPress={() =>
          go(() => {
            app.newChat();
            ask();
          })
        }
      />
      {!app.logged ? (
        <View style={{ alignItems: 'center' }}>
          <LinkText label="Entrar para ver o histórico da conta" icon="right" onPress={() => go(() => router.push('/entrar'))} />
        </View>
      ) : null}
    </Sheet>
  );
}
