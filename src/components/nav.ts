import { router } from 'expo-router';

/** Abre o Assistente Gov.pi (rota "/"), opcionalmente já enviando uma frase. */
export function ask(q?: string) {
  router.navigate(q ? { pathname: '/', params: { q, t: String(Date.now()) } } : '/');
}

/** Abre o Assistente já ouvindo (microfone). */
export function askVoice() {
  router.navigate({ pathname: '/', params: { voice: '1', t: String(Date.now()) } });
}
