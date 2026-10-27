import { ask } from '@/components/nav';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WalletCard, WalletStack } from '@/components/blocks';
import { FakeQR, Icon } from '@/components/Icon';
import { LoginInvite } from '@/components/login-invite';
import { TabTop } from '@/components/page';
import { Sheet as BottomSheet } from '@/components/sheet';
import { useStatusBar } from '@/components/statusbar';
import { Button, Empty, LinkText, Row, T, tap } from '@/components/ui';
import { WALLET_TONES, walletDocs, type WalletDoc } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { color, radius } from '@/theme/tokens';

type Pending = null | { action: 'qr' | 'share' | 'pdf'; step: 'auth' | 'qr' };

export default function CarteiraTab() {
  const { logged } = useApp();
  useStatusBar('light', color.brand);
  return logged ? <Carteira /> : <LoginInvite kind="carteira" />;
}

/** Carteira de documentos: carteiras em pilha (toque numa de trás para trazê-la à frente; toque na da frente para ver os dados). */
function Carteira() {
  const { doc: docParam } = useLocalSearchParams<{ doc?: string }>();
  const { scenario, cnhStarted, showToast } = useApp();
  const insets = useSafeAreaInsets();
  const docs = useMemo(() => walletDocs(scenario), [scenario]);
  const [sel, setSel] = useState(docParam ?? docs[0]?.id);
  const [pending, setPending] = useState<Pending>(null);
  const [detail, setDetail] = useState(false);

  const current = docs.find((d) => d.id === sel) ?? docs[0];

  const afterAuth = (p: NonNullable<Pending>) => {
    if (p.action === 'qr') return setPending({ ...p, step: 'qr' });
    setPending(null);
    if (p.action === 'share') Share.share({ message: `${current?.title} de Ana Souza · validação pelo app Gov.pi Cidadão` }).catch(() => {});
    else showToast('PDF salvo em Downloads (simulação).');
  };

  if (!docs.length)
    return (
      <ScrollView style={{ flex: 1, backgroundColor: color.surface }}>
        <TabTop title="Carteira" />
        <View style={{ padding: 16 }}>
          <Empty icon="wallet" title="Sua carteira ainda está vazia" text="Documentos emitidos pelo Gov.pi, como a CNH Digital e a carteira do doador, aparecem aqui." action={{ label: 'Pedir um documento', onPress: () => ask() }} />
        </View>
      </ScrollView>
    );

  return (
    <View style={{ flex: 1, backgroundColor: color.surface }}>
    <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 44 }} showsVerticalScrollIndicator={false}>
      <TabTop title="Carteira" sub={`${docs.length} documentos digitais`} />
      <View style={{ padding: 16, gap: 16 }}>
      {current && (
        <View style={{ gap: 12 }}>
          <WalletStack docs={docs} front={current.id} onFront={setSel} onOpen={() => setDetail(true)} />
          <T v="caption" c={color.muted}>
            Toque numa carteira de trás para trazê-la à frente. Toque na da frente para ver os dados.
          </T>
          <View style={styles.actions}>
            <Action icon="qr" label="Mostrar QR Code" onPress={() => setPending({ action: 'qr', step: 'auth' })} />
            <Action icon="share" label="Compartilhar" onPress={() => setPending({ action: 'share', step: 'auth' })} />
            <Action icon="download" label="Baixar PDF" onPress={() => setPending({ action: 'pdf', step: 'auth' })} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Icon name="lock" size={16} color={color.muted} />
            <T v="caption" c={color.muted} style={{ flex: 1 }}>
              Para mostrar ou compartilhar, confirmamos que é você, com digital ou senha.
            </T>
          </View>
        </View>
      )}

      {current?.id === 'cnh' && scenario !== 'concluida' && cnhStarted && (
        <Pressable accessibilityRole="button" onPress={() => router.push('/atividade')} style={styles.pending}>
          <Icon name="clock" size={20} color={color.warnInk} />
          <View style={{ flex: 1 }}>
            <T v="smallStrong" c={color.warnInk}>
              Renovação da CNH em andamento
            </T>
            <T v="caption" c={color.warnInk}>
              Exame médico · 21/10, 9h20
            </T>
          </View>
          <Icon name="right" size={18} color={color.warnInk} />
        </Pressable>
      )}

      {/* divisória clara de ponta a ponta antes da seção */}
      <View style={{ marginHorizontal: -16, marginTop: 8, borderTopWidth: 1, borderTopColor: color.divider }} />
      <T v="h2">Todos os documentos</T>
      {/* Lista no mesmo padrão de "Você no centro do Gov.pi": ícone, título, apoio e seta, separados por traço fino */}
      <View>
        {docs.map((d, i) => {
          const t = WALLET_TONES[d.tone];
          const on = d.id === current?.id;
          return (
            <Row
              key={d.id}
              icon="idcard"
              tone={{ bg: `${t.bg}1F`, fg: d.tone === 'yellow' ? '#8A5A00' : t.bg }}
              title={d.title}
              sub={`${d.org}${d.status ? ` · ${d.status}` : ''}${on ? ' · Na frente da pilha' : ''}`}
              right={on ? <Icon name="check" size={18} color={color.brand} strokeWidth={2.4} /> : undefined}
              onPress={() => setSel(d.id)}
              last={i === docs.length - 1}
            />
          );
        })}
      </View>

      <LinkText label="Não achou um documento? Descreva o que precisa." icon="right" onPress={() => ask('Não encontrei um documento na carteira')} />
      </View>
    </ScrollView>

      {/* Dados da carteira da frente (visualização grande) */}
      <BottomSheet visible={detail} onClose={() => setDetail(false)} title={current?.title} sub={current?.org}>
        {current ? <WalletCard doc={current} /> : null}
        <Button
          icon="qr"
          label="Mostrar QR Code"
          onPress={() => {
            setDetail(false);
            setPending({ action: 'qr', step: 'auth' });
          }}
        />
      </BottomSheet>
      {/* Confirmação de identidade e QR Code */}
      <Sheet visible={!!pending} onClose={() => setPending(null)}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.grab} />
          {pending?.step === 'auth' ? (
            <View style={{ alignItems: 'center', gap: 12 }}>
              <View style={styles.finger}>
                <Icon name="finger" size={40} color={color.brand} />
              </View>
              <T v="h2">Confirme que é você</T>
              <T v="small" c={color.muted} style={{ textAlign: 'center' }}>
                Use sua digital ou o reconhecimento de rosto do celular.
              </T>
              <Button label="Usar biometria" icon="finger" onPress={() => afterAuth(pending)} style={{ alignSelf: 'stretch' }} />
              <Button kind="secondary" label="Usar senha" onPress={() => afterAuth(pending)} style={{ alignSelf: 'stretch' }} />
            </View>
          ) : (
            <View style={{ alignItems: 'center', gap: 12 }}>
              <T v="h2">{current?.title}</T>
              <View style={styles.qr}>
                <FakeQR size={220} />
              </View>
              <T v="small" c={color.muted} style={{ textAlign: 'center' }}>
                Mostre este código para validar o documento. Ele muda a cada 60 segundos.
              </T>
              <Button label="Fechar" onPress={() => setPending(null)} style={{ alignSelf: 'stretch' }} />
            </View>
          )}
        </View>
      </Sheet>
    </View>
  );
}

/** Folha inferior: Modal nativo no celular; camada dentro da tela na prévia web. */
function Sheet({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: React.ReactNode }) {
  const scrim = <Pressable style={{ flex: 1, backgroundColor: color.scrim }} onPress={onClose} accessibilityLabel="Fechar" />;
  if (Platform.OS === 'web')
    return visible ? (
      <View style={[StyleSheet.absoluteFill, { zIndex: 50 }]}>
        {scrim}
        {children}
      </View>
    ) : null;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      {scrim}
      {children}
    </Modal>
  );
}

function Action({ icon, label, onPress }: { icon: 'qr' | 'share' | 'download'; label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.action, pressed && { borderColor: color.brand }]}>
      <Icon name={icon} size={22} color={color.brand} />
      <T v="caption" style={{ textAlign: 'center' }}>
        {label}
      </T>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 8 },
  action: { flex: 1, minHeight: 72, alignItems: 'center', justifyContent: 'center', gap: 6, padding: 8, backgroundColor: color.surface, borderRadius: radius.md, borderWidth: 1, borderColor: color.line },
  pending: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.md, backgroundColor: color.warnBg },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: color.line, backgroundColor: color.surface },
  docThumb: { width: 44, height: 30, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  sheet: { backgroundColor: color.surface, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingHorizontal: 20, paddingTop: 8, gap: 12 },
  grab: { width: 44, height: 5, borderRadius: 3, backgroundColor: color.line, alignSelf: 'center', marginBottom: 8 },
  finger: { width: 80, height: 80, borderRadius: 40, backgroundColor: color.brandTint, alignItems: 'center', justifyContent: 'center' },
  qr: { padding: 12, backgroundColor: color.white, borderRadius: radius.md, borderWidth: 1, borderColor: color.line },
});
