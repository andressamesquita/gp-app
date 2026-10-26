import { useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useCallback } from 'react';
import { Platform } from 'react-native';

/**
 * Ajusta a barra de status do Android/iOS à tela em foco
 * (ícones escuros sobre branco, claros sobre o azul).
 * Na prévia web, avisa a moldura de celular para pintar a barra simulada.
 */
export function useStatusBar(style: 'light' | 'dark', background: string) {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'web') {
        const w = globalThis as unknown as { __govpiStatus?: (bg: string, s: string) => void };
        w.__govpiStatus?.(background, style);
      } else setStatusBarStyle(style, true);
    }, [style, background]),
  );
}
