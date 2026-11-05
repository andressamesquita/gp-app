import { View } from 'react-native';

import { PAST_CHATS } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { color } from '@/theme/tokens';
import { ask } from './nav';
import { Sheet } from './sheet';
import { IconButton, Row, T } from './ui';

/** Verde da bolinha que avisa que há conversas salvas. */
export const CHAT_DOT = '#22C55E';

/** Há conversas para mostrar? Deslogado: as desta sessão. Logado: as da sessão e o histórico da conta. */
export function useHasChats() {
  const { messages, logged, sessionChats } = useApp();
  return messages.some((m) => m.from === 'user') || sessionChats.length > 0 || (logged && PAST_CHATS.length > 0);
}

/** Ícone de conversas para a faixa, com bolinha verde quando há conversas salvas. */
export function ChatHistoryButton({ onPress }: { onPress: () => void }) {
  const has = useHasChats();
  return <IconButton icon="chats" label={has ? 'Conversas, há conversas salvas' : 'Conversas'} tone="bar" badge={has} badgeColor={CHAT_DOT} onPress={onPress} />;
}

/**
 * Folha simples, como na web: "Nesta sessão" e, com login, o histórico da conta.
 * Sem login, as conversas ficam guardadas só nesta sessão (não é preciso entrar para conversar).
 */
export function ChatHistorySheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const app = useApp();
  const current = app.messages.find((m) => m.from === 'user');
  const sessao = [
    ...(current ? [{ id: 'atual', title: current.text ?? 'Conversa atual', sub: 'Agora · em andamento' }] : []),
    ...app.sessionChats.map((c) => ({ id: c.id, title: c.title, sub: 'Nesta sessão' })),
  ];
  const past = app.logged ? PAST_CHATS : [];
  const groups = [...new Set(past.map((c) => c.group))];
  const go = (fn: () => void) => {
    onClose();
    fn();
  };

  return (
    <Sheet visible={visible} onClose={onClose} title="Conversas">
      <View>
        <T v="eyebrow" c={color.muted}>
          Conversas nesta sessão
        </T>
        {sessao.length ? (
          sessao.map((c, i) => (
            <Row
              key={c.id}
              icon="chats"
              title={c.title}
              sub={c.sub}
              last={i === sessao.length - 1}
              onPress={() => go(() => (c.id === 'atual' ? ask() : (app.openSessionChat(c.id), ask())))}
            />
          ))
        ) : (
          <T v="small" c={color.muted} style={{ paddingVertical: 12 }}>
            Nenhuma conversa ainda.
          </T>
        )}
      </View>

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
    </Sheet>
  );
}
