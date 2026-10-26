import { ask } from '@/components/nav';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ServiceCard, useServiceOpen } from '@/components/blocks';
import { Icon, type IconName } from '@/components/Icon';
import { TabTop } from '@/components/page';
import { Robot } from '@/components/Robot';
import { Sheet } from '@/components/sheet';
import { useStatusBar } from '@/components/statusbar';
import { LinkText, T, tap } from '@/components/ui';
import { CATEGORIES, SERVICES, type CategoryId } from '@/data/catalog';
import { norm } from '@/state/assistant';
import { color, font, radius } from '@/theme/tokens';

/* Atalhos rápidos, como na web: Detran, Empresas, Servidor */
const QUICK: { label: string; cat?: CategoryId; org?: string }[] = [
  { label: 'Detran', org: 'DETRAN' },
  { label: 'Empresas', cat: 'empr' },
  { label: 'Servidor', cat: 'srv' },
];

export default function Servicos() {
  useStatusBar('light', color.brand);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<CategoryId | null>(null);
  const [org, setOrg] = useState<string | null>(null);
  const [sheet, setSheet] = useState<'cat' | 'org' | null>(null);
  const open = useServiceOpen();

  const list = useMemo(() => {
    const n = norm(q.trim());
    return SERVICES.filter((s) => (!cat || s.c === cat) && (!org || s.o === org) && (!n || norm(`${s.t} ${s.d} ${s.o} ${s.k}`).includes(n)));
  }, [q, cat, org]);

  const counts = useMemo(() => Object.fromEntries(CATEGORIES.map((c) => [c.id, SERVICES.filter((s) => s.c === c.id).length])), []);
  const orgs = useMemo(() => [...new Set(SERVICES.map((s) => s.o))].sort((a, b) => a.localeCompare(b, 'pt-BR')), []);

  const quickCat = QUICK.some((x) => x.cat && x.cat === cat);
  const quickOrg = QUICK.some((x) => x.org && x.org === org);
  const catLabel = cat && !quickCat ? CATEGORIES.find((c) => c.id === cat)?.t ?? 'Categoria' : 'Categoria';
  const orgLabel = org && !quickOrg ? org : 'Órgão';
  const any = !!(cat || org);

  return (
    <View style={{ flex: 1, backgroundColor: color.bg }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }} keyboardShouldPersistTaps="handled" stickyHeaderIndices={[2]} showsVerticalScrollIndicator={false}>
        <TabTop title="Serviços para você" sub="525 serviços online do Governo do Piauí." overlap />

        {/* Busca: mesmo campo do Início */}
        <View style={styles.search}>
          <Icon name="search" size={22} color={color.ink} />
          <TextInput
            accessibilityLabel="Buscar um serviço"
            value={q}
            onChangeText={setQ}
            placeholder="Buscar um serviço"
            placeholderTextColor={color.muted}
            style={styles.input}
            returnKeyType="search"
          />
          {q ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Limpar busca" onPress={() => setQ('')} hitSlop={8} style={{ padding: 4 }}>
              <Icon name="close" size={18} color={color.muted} />
            </Pressable>
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Perguntar ao Assistente Gov.pi"
            onPress={() => {
              tap();
              ask(q || undefined);
            }}
            style={({ pressed }) => [styles.searchBot, pressed && { opacity: 0.85 }]}>
            <Robot size={26} />
          </Pressable>
        </View>

        {/* Filtros em chips, como na web */}
        <View style={styles.cats}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
            <FilterChip label={catLabel} on={!!cat && !quickCat} caret onPress={() => setSheet('cat')} />
            {QUICK.map((x) => {
              const on = x.cat ? cat === x.cat : org === x.org;
              return (
                <FilterChip
                  key={x.label}
                  label={x.label}
                  on={on}
                  onPress={() => {
                    if (x.cat) setCat(on ? null : x.cat);
                    if (x.org) setOrg(on ? null : x.org);
                  }}
                />
              );
            })}
            <FilterChip label={orgLabel} on={!!org && !quickOrg} caret onPress={() => setSheet('org')} />
            {any ? (
              <FilterChip
                label="Limpar filtros"
                icon="close"
                onPress={() => {
                  setCat(null);
                  setOrg(null);
                }}
              />
            ) : null}
          </ScrollView>
        </View>

        <View style={{ padding: 16, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <T style={{ fontFamily: font.semibold, fontSize: 20, lineHeight: 26 }} accessibilityRole="header">
              {q ? 'Resultados' : cat ? CATEGORIES.find((c) => c.id === cat)?.t : org ? (QUICK.find((x) => x.org === org)?.label ?? org) : 'Mais procurados'}
            </T>
            <T v="caption" c={color.muted} accessibilityLiveRegion="polite">
              {list.length} {list.length === 1 ? 'serviço' : 'serviços'}
            </T>
          </View>

          {list.map((s) => (
            <ServiceCard key={s.t} s={s} onPress={() => open(s)} />
          ))}

          {!list.length && (
            <View style={styles.none}>
              <T v="bodyStrong">Não encontramos{q ? ` “${q}”` : ' serviços com esses filtros'}.</T>
              <T v="small" c={color.muted}>
                Tente descrever o que você precisa. O assistente entende frases como “perdi meu documento”.
              </T>
              <LinkText label="Descrever para o assistente" icon="right" onPress={() => ask(q || undefined)} />
            </View>
          )}
        </View>
      </ScrollView>

      <Sheet visible={sheet === 'cat'} onClose={() => setSheet(null)} title="Categoria">
        {CATEGORIES.filter((c) => counts[c.id]).map((c) => (
          <Option
            key={c.id}
            icon={c.icon as IconName}
            label={c.t}
            count={counts[c.id]}
            on={cat === c.id}
            onPress={() => {
              setCat(cat === c.id ? null : c.id);
              setSheet(null);
            }}
          />
        ))}
      </Sheet>

      <Sheet visible={sheet === 'org'} onClose={() => setSheet(null)} title="Órgão">
        {orgs.map((o) => (
          <Option
            key={o}
            icon="badge"
            label={o}
            count={SERVICES.filter((s) => s.o === o).length}
            on={org === o}
            onPress={() => {
              setOrg(org === o ? null : o);
              setSheet(null);
            }}
          />
        ))}
      </Sheet>
    </View>
  );
}

function FilterChip({ label, on, caret, icon, onPress }: { label: string; on?: boolean; caret?: boolean; icon?: IconName; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!on }}
      accessibilityLabel={caret ? `${label}, abrir opções` : label}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.chip, on && styles.chipOn, pressed && { opacity: 0.85 }]}>
      {icon ? <Icon name={icon} size={14} color={on ? color.white : color.ink} /> : null}
      <T c={on ? color.white : color.ink} numberOfLines={1} style={{ fontFamily: font.medium, fontSize: 14, lineHeight: 18, maxWidth: 180 }}>
        {label}
      </T>
      {caret ? <Icon name="down" size={16} color={on ? color.white : color.ink} /> : null}
    </Pressable>
  );
}

function Option({ icon, label, count, on, onPress }: { icon: IconName; label: string; count: number; on: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: on }}
      onPress={() => {
        tap();
        onPress();
      }}
      style={[styles.opt, on && { borderColor: color.brand, backgroundColor: color.brandTint }]}>
      <Icon name={icon} size={20} color={on ? color.brand : color.muted} />
      <T style={{ flex: 1, fontFamily: on ? font.semibold : font.medium, fontSize: 15 }}>{label}</T>
      <T v="caption" c={color.muted}>
        {count}
      </T>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  search: {
    marginTop: -28,
    marginHorizontal: 16,
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 16,
    paddingRight: 8,
    backgroundColor: color.surface,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: color.line,
    shadowColor: '#0A1428',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: { flex: 1, minHeight: 54, fontFamily: font.regular, fontSize: 16, color: color.ink, outlineStyle: 'none' } as object,
  searchBot: { width: 42, height: 42, borderRadius: radius.sm, backgroundColor: color.brandTint, alignItems: 'center', justifyContent: 'center' },
  cats: { backgroundColor: color.bg, paddingTop: 14, paddingBottom: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 42, paddingHorizontal: 18, borderRadius: radius.pill, borderWidth: 1, borderColor: color.lineStrong, backgroundColor: color.surface },
  chipOn: { backgroundColor: color.brand, borderColor: color.brand },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingHorizontal: 14, borderRadius: radius.sm, borderWidth: 1, borderColor: color.line },
  none: { backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.line, borderStyle: 'dashed', padding: 16, gap: 6 },
});
