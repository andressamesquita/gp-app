import { ask } from '@/components/nav';
import { useState } from 'react';
import { View } from 'react-native';

import { RequestCard } from '@/components/blocks';
import { Page } from '@/components/page';
import { Chip, Empty, T } from '@/components/ui';
import { requests } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { color } from '@/theme/tokens';

type F = 'andamento' | 'concluidas' | 'todas';

export default function Atividade() {
  const { scenario, cnhStarted } = useApp();
  const all = requests(scenario, cnhStarted);
  const [f, setF] = useState<F>(scenario === 'concluida' ? 'concluidas' : 'andamento');
  const list = all.filter((r) => (f === 'todas' ? true : f === 'concluidas' ? /conclu/i.test(r.status) : !/conclu/i.test(r.status)));

  return (
    <Page title="Atividade" sub="Suas solicitações e cada etapa">
      {all.length === 0 ? (
        <Empty icon="clock" title="Você ainda não tem solicitações" text="Quando você pedir algo, acompanha cada etapa por aqui." action={{ label: 'Solicitar agora', onPress: () => ask() }} />
      ) : (
        <>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }} accessibilityRole="tablist">
            <Chip label="Em andamento" on={f === 'andamento'} onPress={() => setF('andamento')} />
            <Chip label="Concluídas" on={f === 'concluidas'} onPress={() => setF('concluidas')} />
            <Chip label="Todas" on={f === 'todas'} onPress={() => setF('todas')} />
          </View>
          {list.length ? (
            list.map((r, i) => <RequestCard key={r.id + f} r={r} open={i === 0} />)
          ) : (
            <T v="small" c={color.muted}>
              Nada por aqui neste filtro.
            </T>
          )}
        </>
      )}
    </Page>
  );
}
