import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { FlatBlock, Page } from '@/components/page';
import { Avatar, Empty, T } from '@/components/ui';
import { PERSON } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { color } from '@/theme/tokens';

export default function Feed() {
  const app = useApp();
  return (
    <Page title="Publicações" flat>
      {app.posts.length ? (
        app.posts.map((p, i) => (
          <FlatBlock key={p.id} first={i === 0} style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Avatar initials={PERSON.initials} size={36} uri={app.photo} />
              <View style={{ flex: 1 }}>
                <T v="smallStrong">{app.prefs.nomeConquistas ? PERSON.name : 'Cidadã do Piauí'}</T>
                <T v="caption" c={color.muted}>
                  {p.when} · publicado no {p.net}
                </T>
              </View>
              <Icon name={p.net === 'WhatsApp' ? 'whats' : 'image'} size={20} color={p.net === 'WhatsApp' ? color.whats : '#A12A78'} />
            </View>
            <T v="body">{p.text}</T>
          </FlatBlock>
        ))
      ) : (
        <View style={{ paddingTop: 16 }}>
        <Empty
          icon="image"
          title="Você ainda não publicou conquistas"
          text="Quando concluir um serviço, você pode compartilhar uma imagem sem dados pessoais. Ela aparece aqui."
        />
        </View>
      )}
    </Page>
  );
}
