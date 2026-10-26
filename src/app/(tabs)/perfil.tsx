import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ForMeCard, MedalGrid, RequestCard, WalletStack } from '@/components/blocks';
import { BlueBackdrop } from '@/components/hero';
import { FakeQR, Icon, type IconName } from '@/components/Icon';
import { LoginInvite } from '@/components/login-invite';
import { ask } from '@/components/nav';
import { Sheet } from '@/components/sheet';
import { useStatusBar } from '@/components/statusbar';
import { Avatar, Button, Chip, Empty, IconButton, Row, Section, T, tap } from '@/components/ui';
import { SERVICES } from '@/data/catalog';
import { MEDALS, PERSON, SALDO, earnedMedals, forMe, requests, walletDocs, type Scenario, type WalletDoc } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { color, font, kind, radius, shadow } from '@/theme/tokens';

const SCENARIOS: { id: Scenario; t: string; d: string }[] = [
  { id: 'padrao', t: 'Com histórico', d: 'Solicitações em andamento e carteiras' },
  { id: 'novo', t: 'Conta nova', d: 'Tudo vazio: veja os estados sem conteúdo' },
  { id: 'concluida', t: 'Após concluir', d: 'CNH renovada e conquista para compartilhar' },
];

type SheetName = null | 'saldo' | 'zap' | 'conquistas' | 'carteiras' | 'auth' | 'qr' | 'publicar';
type F = 'andamento' | 'concluidas' | 'todas';

/** Área do cidadão (logado): painel com os blocos da versão mobile da web. */
function AreaLogada() {
  const insets = useSafeAreaInsets();
  const app = useApp();
  const { scenario, cnhStarted } = app;
  const [sheet, setSheet] = useState<SheetName>(null);
  const [after, setAfter] = useState<'qr' | 'share'>('qr');
  const [net, setNet] = useState<'WhatsApp' | 'Instagram'>('WhatsApp');
  const [filter, setFilter] = useState<F>('andamento');
  const docs = useMemo(() => walletDocs(scenario), [scenario]);
  const [front, setFront] = useState<string | undefined>(undefined);
  const frontDoc: WalletDoc | undefined = docs.find((d) => d.id === front) ?? docs[0];
  const earned = useMemo(() => {
    const e = earnedMedals(scenario);
    if (app.prefs.zapAvisos) e.push('zap');
    if (app.posts.length) e.push('publicou');
    return e;
  }, [scenario, app.prefs.zapAvisos, app.posts.length]);
  const all = requests(scenario, cnhStarted);
  const andamento = all.filter((r) => !/conclu/i.test(r.status));
  const list = all.filter((r) => (filter === 'todas' ? true : filter === 'concluidas' ? /conclu/i.test(r.status) : !/conclu/i.test(r.status)));
  const cards = forMe(scenario, cnhStarted);
  const favs = SERVICES.filter((s) => app.favorites.includes(s.t));
  const pct = earned.length / MEDALS.length;
  const shareText = 'Renovei minha CNH com o Gov.pi Cidadão! Sem fila e sem sair de casa.';
  const alreadyPublished = app.posts.length > 0;

  const SHORTCUTS: { label: string; icon: IconName; k: number; badge?: string; onPress: () => void }[] = [
    { label: 'Meu perfil', icon: 'user', k: 0, onPress: () => router.push('/meu-perfil') },
    { label: 'Minha jornada', icon: 'route', k: 1, onPress: () => router.navigate('/jornada') },
    { label: 'Nota Piauiense', icon: 'coins', k: 3, badge: 'R$ 38', onPress: () => setSheet('saldo') },
    { label: 'Conversas', icon: 'chats', k: 0, badge: '2', onPress: () => router.push('/conversas') },
    { label: 'Feed', icon: 'image', k: 2, badge: app.posts.length ? String(app.posts.length) : undefined, onPress: () => router.push('/feed') },
    { label: 'Zap do Cidadão', icon: 'whats', k: 1, badge: app.prefs.zapAvisos ? undefined : 'NOVO', onPress: () => setSheet('zap') },
    { label: 'Configurações', icon: 'sliders', k: 0, onPress: () => router.push('/configuracoes') },
    { label: 'Ajuda', icon: 'help', k: 2, onPress: () => router.push('/ajuda') },
  ];

  const openWalletAction = (a: 'qr' | 'share') => {
    setAfter(a);
    setSheet('auth');
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, backgroundColor: color.bg }} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* ---------- Topo: a pessoa ---------- */}
        <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 18, paddingBottom: 40, gap: 16 }}>
          <BlueBackdrop />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <T v="h1" c={color.white} accessibilityRole="header" style={{ flex: 1, fontFamily: font.semibold }}>
              Área do cidadão
            </T>
            <Pressable accessibilityRole="button" accessibilityLabel={`Saldo da Nota Piauiense: ${SALDO.valor}`} onPress={() => setSheet('saldo')} style={styles.saldo}>
              <Icon name="coins" size={16} color={color.white} />
              <T v="smallStrong" c={color.white}>
                {SALDO.valor}
              </T>
            </Pressable>
            <IconButton icon="bell" label="Avisos, há avisos não lidos" badge onPress={() => router.push('/avisos')} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Pressable accessibilityRole="button" accessibilityLabel="Alterar foto de perfil" onPress={() => router.push('/meu-perfil')}>
              <Avatar initials={PERSON.initials} light size={60} uri={app.photo} />
              <View style={styles.camBadge}>
                <Icon name="camera" size={13} color={color.brand} />
              </View>
            </Pressable>
            <View style={{ flex: 1, gap: 4 }}>
              <T v="h2" c={color.white}>
                {PERSON.name}
              </T>
              <View style={styles.level}>
                <Icon name="shield" size={13} color={color.white} />
                <T v="caption" c={color.white} style={{ fontFamily: font.semibold }}>
                  Conta {PERSON.level}
                </T>
              </View>
            </View>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={`Conquistas: ${earned.length} de ${MEDALS.length}. Ver conquistas`} onPress={() => setSheet('conquistas')} style={styles.conq}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T v="small" c="rgba(255,255,255,0.9)">
                Conquistas
              </T>
              <T v="smallStrong" c={color.white}>
                {earned.length} de {MEDALS.length}
              </T>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${Math.max(pct * 100, 2)}%` }]} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <T v="smallStrong" c={color.white}>
                Ver conquistas
              </T>
              <Icon name="right" size={15} color={color.white} />
            </View>
          </Pressable>
        </View>

        <View style={styles.sheetBody}>
          {/* ---------- Atalhos em grade ---------- */}
          <View style={styles.grid} accessibilityLabel="Atalhos da área do cidadão">
            {SHORTCUTS.map((s) => {
              const k = kind[0]; // todos os atalhos no mesmo azul-claro
              return (
                <Pressable
                  key={s.label}
                  accessibilityRole="button"
                  accessibilityLabel={s.badge ? `${s.label}, ${s.badge}` : s.label}
                  onPress={() => {
                    tap();
                    s.onPress();
                  }}
                  style={({ pressed }) => [styles.tile, pressed && { transform: [{ scale: 0.95 }] }]}>
                  <View style={[styles.tileIco, { backgroundColor: k.bg }]}>
                    <Icon name={s.icon} size={26} color={k.fg} strokeWidth={2} />
                    {s.badge ? (
                      <View style={[styles.badge, s.badge === 'NOVO' && { backgroundColor: color.waveOrange }]}>
                        <T v="caption" c={color.white} style={{ fontFamily: font.bold, fontSize: 10, lineHeight: 13 }}>
                          {s.badge}
                        </T>
                      </View>
                    ) : null}
                  </View>
                  <T v="smallStrong" numberOfLines={2} style={{ textAlign: 'center', lineHeight: 16, marginHorizontal: -4, alignSelf: 'stretch' }}>
                    {s.label}
                  </T>
                </Pressable>
              );
            })}
          </View>

          {/* ---------- Bem-vinda + campo de conversa ---------- */}
          <View style={styles.welcome}>
            <T v="bodyStrong" c={color.brand}>
              Bem-vinda, {PERSON.name}!
            </T>
            <Pressable accessibilityRole="button" accessibilityLabel="O que você precisa resolver? Abrir o Assistente Gov.pi" onPress={() => ask()} style={styles.fakeInput}>
              <T v="bodyStrong" c={color.ink} style={{ flex: 1, fontFamily: font.semibold }}>
                O que você precisa resolver?
              </T>
              <View style={styles.fakeSend}>
                <Icon name="send" size={20} color={color.white} strokeWidth={2.2} />
              </View>
            </Pressable>
          </View>

          {/* ---------- Compartilhe suas conquistas (após concluir) ---------- */}
          {scenario === 'concluida' && (
            <Section title="Compartilhe suas conquistas">
              <View style={styles.post}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Avatar initials={PERSON.initials} size={36} uri={app.photo} />
                  <View style={{ flex: 1 }}>
                    <T v="smallStrong">{app.prefs.nomeConquistas ? PERSON.name : 'Cidadã do Piauí'}</T>
                    <T v="caption" c={color.muted}>
                      Conquista gerada pelo Gov.pi Cidadão
                    </T>
                  </View>
                </View>
                <T v="small">{shareText}</T>
                <View style={styles.postArt}>
                  <Icon name="car" size={30} color={color.white} />
                  <View style={{ flex: 1 }}>
                    <T v="bodyStrong" c={color.white}>
                      CNH em dia, sem sair de casa
                    </T>
                    <T v="caption" c="rgba(255,255,255,0.88)">
                      Renovação da CNH · DETRAN
                    </T>
                  </View>
                </View>
              </View>
              {alreadyPublished ? (
                <View style={styles.thanks} accessibilityLiveRegion="polite">
                  <Icon name="check" size={18} color={color.good} strokeWidth={2.4} />
                  <T v="small" style={{ flex: 1 }}>
                    Você está levando o Gov.pi a mais pessoas, obrigado por colaborar!
                  </T>
                </View>
              ) : (
                <>
                  <T v="smallStrong">Publicar em</T>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Button
                      kind="whats"
                      icon="whats"
                      label="WhatsApp"
                      small
                      style={{ flex: 1 }}
                      onPress={() => {
                        setNet('WhatsApp');
                        setSheet('publicar');
                      }}
                    />
                    <Button
                      kind="secondary"
                      icon="image"
                      label="Instagram"
                      small
                      style={{ flex: 1 }}
                      onPress={() => {
                        setNet('Instagram');
                        setSheet('publicar');
                      }}
                    />
                  </View>
                </>
              )}
            </Section>
          )}

          {/* ---------- Zap do Cidadão ---------- */}
          <View style={styles.zap}>
            <BlueBackdrop />
            <T v="eyebrow" c="rgba(255,255,255,0.85)">
              Zap do Cidadão
            </T>
            <T v="h2" c={color.white}>
              Seus avisos no WhatsApp
            </T>
            <T v="small" c="rgba(255,255,255,0.92)">
              Prazos, solicitações e benefícios chegam direto no seu WhatsApp.
            </T>
            {app.prefs.zapAvisos ? (
              <View style={styles.zapOn}>
                <Icon name="check" size={16} color={color.brand} strokeWidth={2.6} />
                <T v="smallStrong" c={color.brand}>
                  Avisos ativos no Zap
                </T>
              </View>
            ) : (
              <Button kind="onBrand" label="Receber avisos no Zap" onPress={() => setSheet('zap')} style={{ alignSelf: 'flex-start', marginTop: 4 }} />
            )}
          </View>

          {/* ---------- Para mim ---------- */}
          <Section title="Para mim" action={cards.length ? { label: `Ver todos (${cards.length})`, href: '/avisos' } : undefined}>
            {cards.length ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 8 }}>
                {cards.map((c) => (
                  <ForMeCard
                    key={c.id}
                    urgent={c.urgent}
                    bar={c.bar}
                    title={c.title}
                    text={c.text}
                    cta={c.cta}
                    onPress={() => (c.q ? ask(c.q) : c.sheet ? setSheet(c.sheet) : router.push(c.to as Href))}
                  />
                ))}
              </ScrollView>
            ) : (
              <Empty icon="bell" title="Nada pendente por enquanto" text="Avisos que precisam de você, como um documento perto de vencer, aparecem aqui." />
            )}
          </Section>

          {/* ---------- Acompanhamento ---------- */}
          <Section title="Acompanhamento de solicitações" action={andamento.length ? { label: `${andamento.length} em andamento`, href: '/atividade' } : undefined}>
            {all.length ? (
              <>
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                  <Chip label="Em andamento" on={filter === 'andamento'} onPress={() => setFilter('andamento')} />
                  <Chip label="Concluídas" on={filter === 'concluidas'} onPress={() => setFilter('concluidas')} />
                  <Chip label="Todas" on={filter === 'todas'} onPress={() => setFilter('todas')} />
                </View>
                <View style={{ gap: 10 }}>
                  {list.map((r, i) => (
                    <RequestCard key={r.id + filter} r={r} open={i === 0} />
                  ))}
                  {!list.length && (
                    <T v="small" c={color.muted}>
                      Nada por aqui neste filtro.
                    </T>
                  )}
                </View>
              </>
            ) : (
              <Empty icon="clock" title="Nenhuma solicitação ainda" text="Quando você pedir um serviço, cada etapa aparece aqui." action={{ label: 'Falar com o Assistente', onPress: () => ask() }} />
            )}
          </Section>

          {/* ---------- Carteiras ---------- */}
          <Section title="Carteiras" action={docs.length ? { label: `Ver todas (${docs.length})`, onPress: () => setSheet('carteiras') } : undefined}>
            {docs.length ? (
              <>
                <WalletStack docs={docs} front={front} onFront={setFront} onOpen={(d) => router.push({ pathname: '/carteira', params: { doc: d.id } })} />
                <T v="caption" c={color.muted}>
                  Toque numa carteira de trás para torná-la a principal.
                </T>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button kind="secondary" icon="qr" label="Mostrar QR" onPress={() => openWalletAction('qr')} style={{ flex: 1 }} />
                  <Button kind="secondary" icon="share" label="Compartilhar" onPress={() => openWalletAction('share')} style={{ flex: 1 }} />
                </View>
              </>
            ) : (
              <Empty icon="wallet" title="Sua carteira ainda está vazia" text="Carteiras emitidas pelo Gov.pi, como a do Hemopi e a CIN, aparecem aqui." />
            )}
          </Section>

          {/* ---------- Serviços favoritos ---------- */}
          <Section title="Serviços favoritos" action={{ label: 'Ver serviços', onPress: () => router.navigate('/servicos') }}>
            {favs.length ? (
              <View>
                {favs.map((s, i) => (
                  <Row key={s.t} icon="star" title={s.t} sub={s.o} last={i === favs.length - 1} onPress={() => ask(s.q)} />
                ))}
              </View>
            ) : (
              <Empty icon="star" title="Você ainda não tem favoritos" text="Toque na estrela de um serviço para ele aparecer aqui." />
            )}
          </Section>

          {/* ---------- Só para o protótipo ---------- */}
          <View style={styles.proto}>
            <T v="eyebrow" c={color.muted}>
              Modo protótipo
            </T>
            <T v="small" c={color.muted}>
              Escolha o estado da conta para ver as telas em cada situação.
            </T>
            {SCENARIOS.map((s) => {
              const on = app.scenario === s.id;
              return (
                <Pressable
                  key={s.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  onPress={() => {
                    tap();
                    app.setScenario(s.id);
                    setFront(undefined);
                    app.showToast(`Estado: ${s.t}`);
                  }}
                  style={[styles.opt, on && { borderColor: color.brand, backgroundColor: color.brandTint }]}>
                  <View style={[styles.radio, on && { borderColor: color.brand }]}>{on && <View style={styles.radioIn} />}</View>
                  <View style={{ flex: 1 }}>
                    <T v="bodyStrong">
                      {s.t}
                    </T>
                    <T v="caption" c={color.muted}>
                      {s.d}
                    </T>
                  </View>
                </Pressable>
              );
            })}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <Button small kind="ghost" label="WhatsApp" href="/whatsapp" />
              <Button small kind="ghost" label="Faltam dados" href="/faltam-dados" />
              <Button small kind="ghost" label="Erro do serviço" href="/erro" />
            </View>
          </View>

          <Button
            kind="danger"
            icon="logout"
            label="Sair"
            onPress={() => {
              app.setLogged(false);
              app.newChat();
              router.navigate('/');
            }}
          />
        </View>
      </ScrollView>

      {/* ---------- Folhas inferiores ---------- */}
      <Sheet visible={sheet === 'saldo'} onClose={() => setSheet(null)} title="Nota Piauiense" sub="Créditos das suas compras com CPF na nota.">
        <View style={styles.saldoBox}>
          <T v="small" c={color.muted}>
            Saldo disponível
          </T>
          <T v="display" c={color.good}>
            {SALDO.valor}
          </T>
          <T v="caption" c={color.muted}>
            Valor mínimo para saque: {SALDO.minimo}
          </T>
        </View>
        <Button
          label="Resgatar agora"
          icon="download"
          onPress={() => {
            setSheet(null);
            ask('Quero resgatar meus créditos da Nota Piauiense');
          }}
        />
      </Sheet>

      <Sheet visible={sheet === 'zap'} onClose={() => setSheet(null)} title="Receber avisos no Zap do Cidadão?">
        <T v="body">Vamos abrir o WhatsApp no seu celular, na conversa com o número oficial do Gov.pi: (86) 98878-8533.</T>
        {['Prazos, solicitações e benefícios chegam por lá.', 'Seu acesso aqui no app continua aberto.', 'Você pode parar de receber avisos quando quiser.'].map((t) => (
          <View key={t} style={{ flexDirection: 'row', gap: 10 }}>
            <Icon name="check" size={18} color={color.good} strokeWidth={2.4} />
            <T v="small" style={{ flex: 1 }}>
              {t}
            </T>
          </View>
        ))}
        <Button
          kind="whats"
          icon="whats"
          label="Permitir e abrir WhatsApp"
          onPress={() => {
            setSheet(null);
            app.setPref('zapAvisos', true);
            router.push('/whatsapp');
          }}
        />
        <Button kind="secondary" label="Agora não" onPress={() => setSheet(null)} />
      </Sheet>

      <Sheet visible={sheet === 'conquistas'} onClose={() => setSheet(null)} title="Minhas conquistas" sub={`${earned.length} de ${MEDALS.length} conquistadas. Complete serviços para ganhar mais.`}>
        <MedalGrid medals={MEDALS} earned={earned} onPress={(m) => app.showToast(earned.includes(m.id) ? `${m.t}: conquistada!` : `Como ganhar: ${m.how}`)} />
      </Sheet>

      <Sheet visible={sheet === 'carteiras'} onClose={() => setSheet(null)} title="Minhas carteiras" sub="Escolha uma carteira para torná-la a principal.">
        {docs.map((d) => {
          const on = d.id === frontDoc?.id;
          return (
            <Pressable
              key={d.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              onPress={() => {
                tap();
                setFront(d.id);
                setSheet(null);
              }}
              style={[styles.opt, on && { borderColor: color.brand, backgroundColor: color.brandTint }]}>
              <View style={[styles.radio, on && { borderColor: color.brand }]}>{on && <View style={styles.radioIn} />}</View>
              <View style={{ flex: 1 }}>
                <T v="bodyStrong">
                  {d.title}
                </T>
                <T v="caption" c={color.muted}>
                  {d.kicker} · •••• {d.number}
                </T>
              </View>
            </Pressable>
          );
        })}
      </Sheet>

      <Sheet visible={sheet === 'auth'} onClose={() => setSheet(null)}>
        <View style={{ alignItems: 'center', gap: 12 }}>
          <View style={styles.finger}>
            <Icon name="finger" size={40} color={color.brand} />
          </View>
          <T v="h2">Confirme que é você</T>
          <T v="small" c={color.muted} style={{ textAlign: 'center' }}>
            Use sua digital ou o reconhecimento de rosto do celular.
          </T>
        </View>
        <Button
          label="Usar biometria"
          icon="finger"
          onPress={() => {
            if (after === 'qr') setSheet('qr');
            else {
              setSheet(null);
              app.showToast(`${frontDoc?.title} pronta para compartilhar (simulação).`);
            }
          }}
        />
        <Button kind="secondary" label="Usar senha" onPress={() => setSheet(after === 'qr' ? 'qr' : null)} />
      </Sheet>

      <Sheet visible={sheet === 'qr'} onClose={() => setSheet(null)} title={frontDoc?.title ?? 'Carteira'} sub="Apresente este QR code para validar sua carteira.">
        <View style={{ alignItems: 'center', gap: 10 }}>
          <View style={styles.qr}>
            <FakeQR size={210} />
          </View>
          <T v="caption" c={color.muted}>
            QR ilustrativo do protótipo. Ele muda a cada 60 segundos.
          </T>
        </View>
        <Button label="Fechar" onPress={() => setSheet(null)} />
      </Sheet>

      <Sheet visible={sheet === 'publicar'} onClose={() => setSheet(null)} title={`Publicar no ${net}?`} sub="Confira o que será publicado antes de confirmar.">
        <View style={styles.post}>
          <T v="smallStrong">{app.prefs.nomeConquistas ? PERSON.name : 'Cidadã do Piauí'}</T>
          <T v="small">{shareText}</T>
        </View>
        <T v="caption" c={color.muted}>
          {app.prefs.nomeConquistas ? 'A publicação aparecerá com o seu nome. Você pode mudar isso em Configurações.' : 'A publicação não mostra o seu nome.'}
        </T>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button kind="secondary" label="Cancelar" onPress={() => setSheet(null)} style={{ flex: 1 }} />
          <Button
            label="Publicar"
            onPress={() => {
              setSheet(null);
              app.publish({ text: shareText, net });
              app.showToast(`Publicado no ${net} (simulação).`);
            }}
            style={{ flex: 1 }}
          />
        </View>
      </Sheet>
    </View>
  );
}

export default function AreaDoCidadao() {
  const { logged } = useApp();
  useStatusBar('light', color.brand);
  return logged ? <AreaLogada /> : <LoginInvite kind="perfil" />;
}

const styles = StyleSheet.create({
  saldo: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: 12, borderRadius: radius.pill, borderWidth: 1, borderColor: 'rgba(255,255,255,0.45)', backgroundColor: 'rgba(255,255,255,0.12)' },
  camBadge: { position: 'absolute', right: -2, bottom: -2, width: 24, height: 24, borderRadius: 12, backgroundColor: color.white, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: color.brand },
  level: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: 'rgba(255,255,255,0.45)' },
  conq: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: radius.md, padding: 14, gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  track: { height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4, backgroundColor: color.waveYellow },
  sheetBody: { marginTop: -24, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, backgroundColor: color.bg, padding: 16, paddingTop: 20, gap: 16 },
  // Atalhos soltos no fundo (sem card): são navegação, não conteúdo. O respiro abaixo separa do próximo bloco.
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 20, marginHorizontal: -8, paddingTop: 4, marginBottom: 8 },
  tile: { width: '25%', alignItems: 'center', gap: 8, paddingHorizontal: 2 },
  tileIco: { width: 62, height: 62, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', bottom: -8, alignSelf: 'center', minWidth: 22, paddingHorizontal: 7, paddingVertical: 1, borderRadius: radius.pill, backgroundColor: color.brand, alignItems: 'center', borderWidth: 2, borderColor: color.surface },
  welcome: { backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.line, padding: 16, gap: 10 },
  fakeInput: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 56, paddingLeft: 16, paddingRight: 6, borderWidth: 1.5, borderColor: color.lineStrong, borderRadius: radius.sm },
  fakeSend: { width: 44, height: 44, borderRadius: radius.sm, backgroundColor: color.brand, alignItems: 'center', justifyContent: 'center' },
  post: { backgroundColor: color.bg, borderRadius: radius.md, padding: 14, gap: 10 },
  postArt: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: color.brand, borderRadius: radius.md, padding: 14 },
  thanks: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: color.goodBg, borderRadius: radius.md, padding: 12 },
  zap: { borderRadius: radius.xl, padding: 20, gap: 8, overflow: 'hidden', ...shadow.card },
  zapOn: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', backgroundColor: color.white, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8, marginTop: 4 },
  saldoBox: { backgroundColor: color.goodBg, borderRadius: radius.lg, padding: 18, gap: 4 },
  finger: { width: 80, height: 80, borderRadius: 40, backgroundColor: color.brandTint, alignItems: 'center', justifyContent: 'center' },
  qr: { padding: 12, backgroundColor: color.white, borderRadius: radius.md, borderWidth: 1, borderColor: color.line },
  proto: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: color.lineStrong, borderRadius: radius.lg, padding: 16, gap: 10 },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, padding: 12, borderRadius: radius.md, borderWidth: 1.5, borderColor: color.line, backgroundColor: color.surface },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: color.lineStrong, alignItems: 'center', justifyContent: 'center' },
  radioIn: { width: 10, height: 10, borderRadius: 5, backgroundColor: color.brand },
});
