import { ask } from '@/components/nav';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AskField } from '@/components/ask-field';
import { CategoryIcon } from '@/components/category-icon';
import { ServiceCard, useServiceOpen } from '@/components/blocks';
import { Icon, type IconName } from '@/components/Icon';
import { TabTop, useRolou } from '@/components/page';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sheet } from '@/components/sheet';
import { useStatusBar } from '@/components/statusbar';
import { Button, LinkText, T, tap } from '@/components/ui';
import { CATEGORIES, SERVICES, type CategoryId } from '@/data/catalog';
import { norm } from '@/state/assistant';
import { BAR_SHADOW, bar, color, font, radius } from '@/theme/tokens';

/* Atalhos rápidos, como na web: Detran, Empresas, Servidor.
   Os três são CATEGORIAS (Detran = Transporte e Veículos), então só um fica ativo por vez
   e troca a categoria escolhida no painel. Categoria + órgão podem ficar juntos. */
const QUICK: { label: string; cat?: CategoryId; org?: string }[] = [
  { label: 'Detran', cat: 'transp' },
  { label: 'Empresas', cat: 'empr' },
  { label: 'Servidor', cat: 'srv' },
];

export default function Servicos() {
  useStatusBar('light', color.brand);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<CategoryId | null>(null);
  const [orgsSel, setOrgsSel] = useState<string[]>([]);
  const [draft, setDraft] = useState<string[]>([]);
  const [orgQ, setOrgQ] = useState('');
  const [sheet, setSheet] = useState<'cat' | 'org' | null>(null);
  const [all, setAll] = useState(false);
  const open = useServiceOpen();
  const insets = useSafeAreaInsets();
  // Sombra quando o título já saiu e a busca está grudada no topo
  const [rolou, onScroll] = useRolou(56);

  const list = useMemo(() => {
    const n = norm(q.trim());
    return SERVICES.filter((s) => (!cat || s.c === cat) && (!orgsSel.length || orgsSel.includes(s.o)) && (!n || norm(`${s.t} ${s.d} ${s.o} ${s.k}`).includes(n)));
  }, [q, cat, orgsSel]);

  const filtering = !!(q.trim() || cat || orgsSel.length);
  const shown = filtering || all ? list : list.slice(0, 5);

  const counts = useMemo(() => Object.fromEntries(CATEGORIES.map((c) => [c.id, SERVICES.filter((s) => s.c === c.id).length])), []);
  const orgs = useMemo(() => [...new Set(SERVICES.map((s) => s.o))].sort((a, b) => a.localeCompare(b, 'pt-BR')), []);

  const quickCat = QUICK.some((x) => x.cat && x.cat === cat);
  const quickOrgs = QUICK.filter((x) => x.org).map((x) => x.org as string);
  const otherOrgs = orgsSel.filter((o) => !quickOrgs.includes(o));
  const catLabel = cat && !quickCat ? CATEGORIES.find((c) => c.id === cat)?.t ?? 'Categoria' : 'Categoria';
  const orgLabel = otherOrgs.length > 1 ? `${otherOrgs[0]} +${otherOrgs.length - 1}` : otherOrgs[0] ?? 'Órgão';
  const any = !!(cat || orgsSel.length);
  const orgsShown = orgs.filter((o) => !orgQ.trim() || norm(o).includes(norm(orgQ.trim())));

  return (
    <View style={{ flex: 1, backgroundColor: color.surface }}>
      {/* Espaço da barra de status: fica parado em cima de tudo */}
      <View style={{ height: insets.top, backgroundColor: bar.bg, zIndex: 6 }} />
      {/* Ao rolar, o título sobe e fica fixo a partir do campo de busca (busca + filtros) */}
      <ScrollView
        style={{ flex: 1, backgroundColor: '#F5F8FC' }}
        stickyHeaderIndices={[1]}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 44 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <TabTop title="Serviços para você" noInset />

        <View style={[{ backgroundColor: bar.bg, zIndex: 5 }, rolou && BAR_SHADOW]}>
          <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12, backgroundColor: bar.bg }}>
            <AskField value={q} onChangeText={setQ} flat search />
          </View>
          {/* Filtros em chips, como na web */}
          <View style={styles.cats}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
              <FilterChip label={catLabel} on={!!cat && !quickCat} caret onPress={() => setSheet('cat')} />
              <FilterChip
                label={orgLabel}
                on={otherOrgs.length > 0}
                caret
                onPress={() => {
                  setDraft(orgsSel);
                  setOrgQ('');
                  setSheet('org');
                }}
              />
              {QUICK.map((x) => {
                const on = x.cat ? cat === x.cat : orgsSel.includes(x.org as string);
                return (
                  <FilterChip
                    key={x.label}
                    label={x.label}
                    on={on}
                    onPress={() => {
                      if (x.cat) setCat(on ? null : x.cat);
                      // Regra: no máximo 1 categoria e 1 órgão ao mesmo tempo (atalhos trocam a escolha anterior)
                      if (x.org) setOrgsSel(on ? [] : [x.org as string]);
                    }}
                  />
                );
              })}
              {any ? (
                <FilterChip
                  label="Limpar filtros"
                  icon="close"
                  onPress={() => {
                    setCat(null);
                    setOrgsSel([]);
                  }}
                />
              ) : null}
            </ScrollView>
          </View>

        </View>

        <View style={{ padding: 16, paddingTop: 8, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <T v="h2" accessibilityRole="header">
              {q ? 'Resultados' : cat ? CATEGORIES.find((c) => c.id === cat)?.t : orgsSel.length ? orgsSel.join(', ') : 'Mais procurados'}
            </T>
            <T v="caption" c={color.muted} accessibilityLiveRegion="polite">
              {shown.length < list.length ? `${shown.length} de ${list.length} serviços` : `${list.length} ${list.length === 1 ? 'serviço' : 'serviços'}`}
            </T>
          </View>

          {shown.map((s) => (
            <ServiceCard key={s.t} s={s} onPress={() => open(s)} />
          ))}

          {/* Sem busca nem filtro, mostra só os 5 mais procurados */}
          {shown.length < list.length ? (
            <Button kind="secondary" label={`Ver todos os ${list.length} serviços`} onPress={() => setAll(true)} />
          ) : null}

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

      {/* Categoria: grade de opções em círculo, escolha única (referência: "Ordenação por" do iFood) */}
      <Sheet visible={sheet === 'cat'} onClose={() => setSheet(null)} title="Escolha a categoria do serviço">
        <View style={styles.catGrid} accessibilityRole="radiogroup">
          {[{ id: null as CategoryId | null, t: 'Todas' }, ...[...CATEGORIES].sort((a, b) => a.t.localeCompare(b.t, 'pt-BR'))].map((c) => {
            const on = cat === c.id;
            return (
              <Pressable
                key={c.t}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                accessibilityLabel={c.t}
                onPress={() => {
                  tap();
                  setCat(c.id);
                  setSheet(null);
                }}
                style={({ pressed }) => [styles.catItem, on && styles.catItemOn, pressed && !on && { backgroundColor: color.bg }]}>
                <View style={[styles.catTile, on && { backgroundColor: color.surface }]}>
                  <CategoryIcon id={c.id ?? 'todas'} size={24} color={color.brand} />
                </View>
                <T v="small" c={color.ink} numberOfLines={3} style={{ textAlign: 'center' }}>
                  {c.t}
                </T>
              </Pressable>
            );
          })}
        </View>
      </Sheet>

      {/* Órgão: busca + lista de escolha única e "Ver resultados" (referência: "Vale-refeição" do iFood) */}
      <Sheet
        visible={sheet === 'org'}
        onClose={() => setSheet(null)}
        title="Escolha o órgão"
        center
        footer={
          <Button
            label={draft.length ? `Ver resultados (${SERVICES.filter((s) => draft.includes(s.o) && (!cat || s.c === cat)).length})` : 'Ver todos os serviços'}
            onPress={() => {
              setOrgsSel(draft);
              setSheet(null);
            }}
          />
        }>
        <View style={styles.orgSearch}>
          <Icon name="search" size={18} color={color.muted} />
          <TextInput
            accessibilityLabel="Buscar órgão"
            value={orgQ}
            onChangeText={setOrgQ}
            placeholder="Buscar órgão"
            placeholderTextColor={color.muted}
            style={styles.orgInput}
          />
        </View>
        <View>
          {orgsShown.map((o, i) => {
            const on = draft.includes(o);
            const n = SERVICES.filter((s) => s.o === o).length;
            return (
              <Pressable
                key={o}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                accessibilityLabel={`${o}, ${n} ${n === 1 ? 'serviço' : 'serviços'}`}
                onPress={() => {
                  tap();
                  // Caixa de seleção: dá para marcar mais de um órgão
                  setDraft((d) => (on ? d.filter((x) => x !== o) : [...d, o]));
                }}
                style={[styles.orgRow, i < orgsShown.length - 1 && styles.orgLine]}>
                <View style={[styles.orgBadge, on && { backgroundColor: color.brandTint }]}>
                  <Icon name="badge" size={18} color={on ? color.brand : color.muted} />
                </View>
                <View style={{ flex: 1 }}>
                  <T v="h3" style={{ fontFamily: on ? font.semibold : font.medium }}>
                    {o}
                  </T>
                  <T v="caption" c={color.muted}>
                    {n} {n === 1 ? 'serviço' : 'serviços'}
                  </T>
                </View>
                <View style={[styles.check, on && styles.checkOn]}>{on ? <Icon name="check" size={16} color={color.white} strokeWidth={3} /> : null}</View>
              </Pressable>
            );
          })}
          {!orgsShown.length && (
            <T v="small" c={color.muted} style={{ paddingVertical: 16, textAlign: 'center' }}>
              Nenhum órgão encontrado.
            </T>
          )}
        </View>
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
      <T v="smallStrong" c={on ? color.white : color.ink} numberOfLines={1} style={{ maxWidth: 180 }}>
        {label}
      </T>
      {caret ? <Icon name="down" size={16} color={on ? color.white : color.ink} /> : null}
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
  input: { flex: 1, minHeight: 54, fontFamily: font.regular, fontSize: 14, color: color.ink, outlineStyle: 'none' } as object,
  searchBot: { width: 42, height: 42, borderRadius: radius.sm, backgroundColor: color.brandTint, alignItems: 'center', justifyContent: 'center' },
  cats: { backgroundColor: color.surface, paddingTop: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: color.divider },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1, borderColor: color.lineStrong, backgroundColor: color.surface },
  chipOn: { backgroundColor: color.brand, borderColor: color.brand },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8, paddingTop: 4, paddingBottom: 8 },
  // Grade de 4 colunas: quadrado azul-claro com ícone cheio azul; a escolhida ganha caixa com contorno azul
  catItem: { width: '25%', alignItems: 'center', gap: 8, paddingHorizontal: 4, paddingVertical: 10, borderRadius: radius.lg, borderWidth: 1.5, borderColor: 'transparent' },
  catItemOn: { backgroundColor: color.brandTint, borderColor: color.brand },
  catTile: { width: 52, height: 52, borderRadius: radius.lg, backgroundColor: color.brandTint, alignItems: 'center', justifyContent: 'center' },
  orgSearch: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 48, paddingHorizontal: 14, borderRadius: radius.sm, borderWidth: 1, borderColor: color.lineStrong },
  orgInput: { flex: 1, height: '100%', fontFamily: font.regular, fontSize: 14, color: color.ink, outlineStyle: 'none' } as object,
  orgRow: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 60, paddingVertical: 8 },
  orgLine: { borderBottomWidth: 1, borderBottomColor: color.line },
  orgBadge: { width: 36, height: 36, borderRadius: radius.sm, backgroundColor: color.surface2, alignItems: 'center', justifyContent: 'center' },
  check: { width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: color.lineStrong, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: color.brand, borderColor: color.brand },
  none: { backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.line, borderStyle: 'dashed', padding: 16, gap: 6 },
});
