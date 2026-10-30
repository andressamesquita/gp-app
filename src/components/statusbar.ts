import { useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useCallback } from 'react';
import { Platform } from 'react-native';

import { FAIXA_BRANCA, bar, color } from '@/theme/tokens';

/**
 * Ajusta a barra de status do Android/iOS à tela em foco
 * (ícones escuros sobre branco, claros sobre o azul).
 * Na prévia web, avisa a moldura de celular para pintar a barra simulada.
 */
export function useStatusBar(styleIn: 'light' | 'dark', backgroundIn: string, fixo?: boolean) {
  // Faixa branca: a barra de status acompanha (ícones escuros sobre branco), salvo telas de fundo azul inteiro (fixo)
  const branca = FAIXA_BRANCA && !fixo && backgroundIn === color.brand;
  const style = branca ? 'dark' : styleIn;
  const background = branca ? bar.bg : backgroundIn;
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'web') {
        const w = globalThis as unknown as { __govpiStatus?: (bg: string, s: string) => void };
        w.__govpiStatus?.(background, style);
      } else setStatusBarStyle(style, true);
    }, [style, background]),
  );
}
