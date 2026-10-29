import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { CATEGORIES, type Service } from '@/data/catalog';
import { color, kind, radius } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { T, tap } from './ui';

/**
 * Últimos acessos em páginas de 3 itens (como as listas da Play Store), rolando para o lado.
 * A próxima página aparece pela borda e os pontinhos embaixo mostram que dá para arrastar.
 */
export function RecentesPaginados({ itens, onOpen }: { itens: { s: Service; quando: string }[]; onOpen: (s: Service) => void }) {
  const { width } = useWindowDimensions();
  const GAP = 16;
  const pageW = Math.min(width, 520) - 20 - 56; // margem esquerda + pedaço da próxima página
  const pages: (typeof itens)[] = [];
  for (let i = 0; i < itens.length; i += 3) pages.push(itens.slice(i, i + 3));
  const [page, setPage] = useState(0);

  return (
    <View style={{ gap: 12 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -20 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: GAP }}
        snapToInterval={pageW + GAP}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={(e) => {
          const p = Math.round(e.nativeEvent.contentOffset.x / (pageW + GAP));
          if (p !== page) setPage(Math.max(0, Math.min(pages.length - 1, p)));
        }}>
        {pages.map((grupo, pi) => (
          <View key={pi} style={{ width: pageW, gap: 4 }} accessibilityLabel={`Página ${pi + 1} de ${pages.length}`}>
            {grupo.map(({ s, quando }) => {
              const ci = Math.max(0, CATEGORIES.findIndex((c) => c.id === s.c));
              const cat = CATEGORIES[ci];
              const k = kind[ci % 4];
              return (
                <Pressable
                  key={s.t}
                  accessibilityRole="button"
                  accessibilityLabel={`${s.t}, ${s.o}, ${cat?.t}, acessado ${quando.toLowerCase()}`}
                  onPress={() => {
                    tap();
                    onOpen(s);
                  }}
                  style={({ pressed }) => [styles.row, pressed && { backgroundColor: color.bg }]}>
                  <View style={[styles.ico, { backgroundColor: k.bg }]}>
                    <Icon name={(cat?.icon ?? 'grid') as IconName} size={26} color={k.fg} />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <T v="bodyStrong" numberOfLines={1}>
                      {s.t}
                    </T>
                    <T v="small" c={color.muted} numberOfLines={1}>
                      {s.o} • {cat?.t}
                    </T>
                    <View style={styles.when}>
                      <Icon name="clock" size={12} color={color.muted} />
                      <T v="caption" c={color.muted}>
                        {quando}
                      </T>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {/* Sinalização de rolagem lateral: um ponto por página, o atual alongado */}
      {pages.length > 1 ? (
        <View style={styles.dots} accessibilityRole="adjustable" accessibilityLabel={`Página ${page + 1} de ${pages.length}. Arraste para o lado para ver mais`}>
          {pages.map((_, i) => (
            <View key={i} style={[styles.dot, i === page && styles.dotOn]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 8, borderRadius: radius.md },
  ico: { width: 56, height: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  when: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginTop: 2 },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: color.lineStrong },
  dotOn: { width: 24, backgroundColor: color.brand },
});
