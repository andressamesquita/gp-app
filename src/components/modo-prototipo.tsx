import { Pressable, StyleSheet, View } from 'react-native';

import type { Scenario } from '@/data/mock';
import { useApp } from '@/state/app-state';
import { color, radius } from '@/theme/tokens';
import { Button, T, tap } from './ui';

const SCENARIOS: { id: Scenario; t: string; d: string }[] = [
  { id: 'padrao', t: 'Com histórico', d: 'Solicitações em andamento e carteiras' },
  { id: 'novo', t: 'Conta nova', d: 'Tudo vazio: veja os estados sem conteúdo' },
  { id: 'concluida', t: 'Após concluir', d: 'CNH renovada e conquista para compartilhar' },
];

/** Só para o protótipo: troca o estado da conta e abre telas de exceção. Fica em Minha conta (menu do AS). */
export function ModoPrototipo() {
  const app = useApp();
  return (
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
              app.showToast(`Estado: ${s.t}`);
            }}
            style={[styles.opt, on && { borderColor: color.brand, backgroundColor: color.brandTint }]}>
            <View style={[styles.radio, on && { borderColor: color.brand }]}>{on && <View style={styles.radioIn} />}</View>
            <View style={{ flex: 1 }}>
              <T v="bodyStrong">{s.t}</T>
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
  );
}

const styles = StyleSheet.create({
  proto: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: color.lineStrong, borderRadius: radius.lg, padding: 16, gap: 10 },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, padding: 12, borderRadius: radius.md, borderWidth: 1.5, borderColor: color.line, backgroundColor: color.surface },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: color.lineStrong, alignItems: 'center', justifyContent: 'center' },
  radioIn: { width: 10, height: 10, borderRadius: 5, backgroundColor: color.brand },
});
