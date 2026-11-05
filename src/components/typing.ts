import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** Exemplos que o campo do Assistente "digita" depois da frase principal. */
export const EXEMPLOS_ASSISTENTE = ['Quero renovar minha CNH', 'Meu remédio acabou', 'Segunda via da conta de água', 'Como resgato a Nota Piauiense?'];

/**
 * Texto que se escreve letra a letra, espera, apaga e passa para a próxima frase (em loop).
 * Com "reduzir movimento" ligado, ou com active = false, mostra só a primeira frase, parada.
 */
export function useTypingText(frases: string[], active = true) {
  const [txt, setTxt] = useState(frases[0]);
  const [reduzir, setReduzir] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduzir)
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (!active || reduzir) {
      setTxt(frases[0]);
      return;
    }
    let i = 0;
    let n = 0;
    let fase: 'escreve' | 'espera' | 'apaga' = 'escreve';
    let t: ReturnType<typeof setTimeout>;
    setTxt('');
    const passo = () => {
      const f = frases[i];
      if (fase === 'escreve') {
        n += 1;
        setTxt(f.slice(0, n));
        if (n >= f.length) {
          fase = 'espera';
          t = setTimeout(passo, i === 0 ? 2600 : 1600);
          return;
        }
        t = setTimeout(passo, 55);
      } else if (fase === 'espera') {
        fase = 'apaga';
        t = setTimeout(passo, 30);
      } else {
        n -= 1;
        setTxt(f.slice(0, Math.max(0, n)));
        if (n <= 0) {
          i = (i + 1) % frases.length;
          fase = 'escreve';
          t = setTimeout(passo, 300);
          return;
        }
        t = setTimeout(passo, 25);
      }
    };
    t = setTimeout(passo, 400);
    return () => clearTimeout(t);
  }, [active, reduzir, frases]);
  return txt;
}
