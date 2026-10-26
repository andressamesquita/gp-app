import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Page } from '@/components/page';
import { Button, LinkText, Section, SwitchRow, T, tap } from '@/components/ui';
import { useApp } from '@/state/app-state';
import { color, font, radius } from '@/theme/tokens';

const SIZES = [
  { t: 'Padrão', v: 1 },
  { t: 'Grande', v: 1.15 },
  { t: 'Muito grande', v: 1.3 },
];

export default function Configuracoes() {
  const app = useApp();
  const { prefs, setPref } = app;

  return (
    <Page title="Configurações" sub="Como o Gov.pi usa seus dados e como você prefere navegar">
      <Section title="Privacidade">
        <View>
          <SwitchRow title="Mostrar meu nome nas conquistas" sub="Seu nome aparece nas publicações que você compartilha." value={prefs.nomeConquistas} onChange={(v) => setPref('nomeConquistas', v)} />
          <SwitchRow title="Receber avisos pelo Zap do Cidadão" sub="Prazos, solicitações e benefícios no seu WhatsApp." value={prefs.zapAvisos} onChange={(v) => setPref('zapAvisos', v)} />
          <SwitchRow title="Usar meu histórico para sugerir serviços" sub="Sugestões em “Para mim” com base no que você já fez." value={prefs.historico} onChange={(v) => setPref('historico', v)} />
          <SwitchRow title="Preencher com dados do Estado" sub="Usar dados que o Governo já tem para encurtar formulários." value={prefs.dadosEstado} onChange={(v) => setPref('dadosEstado', v)} />
          <SwitchRow title="Entrar com biometria" sub="Use digital ou rosto no lugar da senha neste celular." value={prefs.biometria} onChange={(v) => setPref('biometria', v)} last />
        </View>
        <LinkText label="Ler a Política de Privacidade" icon="right" onPress={() => app.showToast('Abriria a Política de Privacidade.')} />
      </Section>

      <Section title="Acessibilidade">
        <View style={{ gap: 8 }}>
          <T v="bodyStrong" style={{ fontSize: 14.5 }}>
            Tamanho do texto
          </T>
          <T v="small" c={color.muted}>
            Aumenta os textos em todo o app, além do ajuste do celular.
          </T>
          <View style={styles.seg} accessibilityRole="radiogroup">
            {SIZES.map((s) => {
              const on = app.textScale === s.v;
              return (
                <Pressable
                  key={s.t}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  onPress={() => {
                    tap();
                    app.setTextScale(s.v);
                  }}
                  style={[styles.segBtn, on && styles.segOn]}>
                  <T v="smallStrong" c={on ? color.white : color.ink} style={{ fontFamily: font.semibold, fontSize: 13 }}>
                    {s.t}
                  </T>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View>
          <SwitchRow title="Alto contraste" sub="Textos secundários mais escuros, para leitura mais fácil." value={prefs.contraste} onChange={(v) => setPref('contraste', v)} />
          <SwitchRow title="Reduzir animações" sub="Remove movimentos e transições da tela." value={prefs.reduzirAnim} onChange={(v) => setPref('reduzirAnim', v)} />
          <SwitchRow title="Atendimento em Libras" sub="Mostra a opção de videochamada com intérprete." value={prefs.libras} onChange={(v) => setPref('libras', v)} last />
        </View>
      </Section>

      <Section title="Notificações">
        <View>
          <SwitchRow title="Avisos antes dos prazos" sub="Lembretes de vencimentos e novidades." value={prefs.prazos} onChange={(v) => setPref('prazos', v)} />
          <SwitchRow title="Notificações no celular" sub="Etapas das suas solicitações." value={prefs.notifApp} onChange={(v) => setPref('notifApp', v)} />
          <SwitchRow title="Resumo por e-mail" sub="Um resumo de cada etapa." value={prefs.notifEmail} onChange={(v) => setPref('notifEmail', v)} last />
        </View>
      </Section>

      <Button label="Concluir" icon="check" onPress={() => (router.canGoBack() ? router.back() : router.navigate('/perfil'))} />
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <Icon name="info" size={16} color={color.muted} />
        <T v="caption" c={color.muted} style={{ flex: 1 }}>
          As mudanças valem na hora e ficam guardadas neste celular.
        </T>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  seg: { flexDirection: 'row', gap: 6 },
  segBtn: { flex: 1, minHeight: 44, borderRadius: radius.sm, borderWidth: 1, borderColor: color.line, alignItems: 'center', justifyContent: 'center', backgroundColor: color.surface, paddingHorizontal: 6 },
  segOn: { backgroundColor: color.brand, borderColor: color.brand },
});
