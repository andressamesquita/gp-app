import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

import type { Scenario } from '@/data/mock';
import { PERSON } from '@/data/mock';
import { THINK_CONFIRM, THINK_LOGIN, confirmReply, hasLogin, mid, respond, thinkingFor, type Msg } from './assistant';

type Prefs = {
  prazos: boolean; dadosEstado: boolean; canais: boolean; compartilhar: boolean; notifApp: boolean; notifWhats: boolean; notifEmail: boolean;
  nomeConquistas: boolean; zapAvisos: boolean; historico: boolean; biometria: boolean; contraste: boolean; reduzirAnim: boolean; libras: boolean;
};
/** Publicação de uma conquista: publicada numa rede ou guardada sem publicar (tirada da Área do cidadão pela lixeira). */
export type Post = { id: string; text: string; net?: 'WhatsApp' | 'Instagram'; when: string; status: 'publicada' | 'nao_publicada'; conquista?: string };

type AppState = {
  logged: boolean;
  setLogged: (v: boolean) => void;
  scenario: Scenario;
  setScenario: (s: Scenario) => void;
  cnhStarted: boolean;
  notaResgatada: boolean;
  favorites: string[];
  toggleFavorite: (title: string) => void;
  prefs: Prefs;
  setPref: (k: keyof Prefs, v: boolean) => void;
  /** Foto de perfil escolhida pela pessoa (uri local). */
  photo: string | null;
  setPhoto: (uri: string | null) => void;
  /** Tamanho do texto: 1 (padrão), 1.15 (grande), 1.3 (muito grande). */
  textScale: number;
  setTextScale: (n: number) => void;
  posts: Post[];
  publish: (p: Omit<Post, 'id' | 'when' | 'status'>) => void;
  /** Tira a conquista da Área do cidadão e guarda em Publicações como não publicada */
  guardarSemPublicar: (p: { text: string; conquista: string }) => void;
  /* Conversa */
  messages: Msg[];
  /** Texto de status do carregamento atual (null quando o assistente não está pensando). */
  thinking: string | null;
  /** Etapa atual e total do carregamento, para a barra de progresso. */
  thinkStep: number;
  thinkTotal: number;
  busy: boolean;
  /** Chamado depois do login feito a partir da conversa. */
  resumeAfterLogin: () => void;
  send: (text: string) => void;
  confirm: (msgId: string, id: string) => void;
  newChat: () => void;
  /* Toast */
  toast: string | null;
  showToast: (t: string) => void;
};

const Ctx = createContext<AppState | null>(null);

const DEFAULT_FAVS = ['Emitir CRLV digital do veículo', 'Consultar a minha CNH', 'Resgatar créditos da Nota Piauiense'];

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [logged, setLogged] = useState(false);
  const [scenario, setScenarioRaw] = useState<Scenario>('padrao');
  const [cnhStarted, setCnhStarted] = useState(false);
  const [notaResgatada, setNotaResgatada] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(DEFAULT_FAVS);
  const [prefs, setPrefs] = useState<Prefs>({
    prazos: true, dadosEstado: true, canais: false, compartilhar: false, notifApp: true, notifWhats: true, notifEmail: false,
    nomeConquistas: true, zapAvisos: false, historico: true, biometria: true, contraste: false, reduzirAnim: false, libras: false,
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [textScale, setTextScale] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [thinking, setThinking] = useState<string | null>(null);
  const [thinkStep, setThinkStep] = useState(0);
  const [thinkTotal, setThinkTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const pending = useRef<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ctxRef = useRef({ logged, scenario, cnhStarted, notaResgatada });
  ctxRef.current = { logged, scenario, cnhStarted, notaResgatada };

  const showToast = useCallback((t: string) => {
    setToast(t);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  /**
   * Carregamento em etapas: um texto de status por etapa (com barra de progresso)
   * e depois as respostas, uma a uma.
   */
  const play = useCallback((replies: Msg[], steps: string[]) => {
    const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));
    setBusy(true);
    setThinkTotal(steps.length);
    const STEP = 1050;
    steps.forEach((txt, i) =>
      later(() => {
        setThinking(txt);
        setThinkStep(i + 1);
      }, i * STEP),
    );
    const end = steps.length * STEP;
    replies.forEach((m, i) =>
      later(() => {
        if (i === 0) setThinking(null);
        setMessages((prev) => [...prev, m]);
        if (i === replies.length - 1) {
          setBusy(false);
          setThinkStep(0);
        }
      }, end + i * 550),
    );
  }, []);

  const send = useCallback(
    (text: string) => {
      const t = text.trim();
      if (!t) return;
      setMessages((prev) => [...prev, { id: mid(), from: 'user', text: t }]);
      const replies = respond(t, ctxRef.current);
      if (hasLogin(replies)) pending.current = t;
      play(replies, thinkingFor(t, ctxRef.current));
    },
    [play],
  );

  const confirm = useCallback(
    (msgId: string, id: string) => {
      setMessages((prev) => [...prev.map((m) => (m.id === msgId ? { ...m, used: true } : m)), { id: mid(), from: 'user', text: 'Confirmo' }]);
      if (id === 'cnh') setCnhStarted(true);
      if (id === 'nota') setNotaResgatada(true);
      play(confirmReply(id), THINK_CONFIRM[id] ?? THINK_CONFIRM.nota);
    },
    [play],
  );

  const resumeAfterLogin = useCallback(() => {
    setLogged(true);
    ctxRef.current = { ...ctxRef.current, logged: true };
    const intro: Msg[] = [
      { id: mid(), from: 'bot', text: 'Autenticação realizada com sucesso!' },
      { id: mid(), from: 'bot', text: `Pronto, ${PERSON.first}. Sigo de onde paramos.` },
    ];
    const rest = pending.current ? respond(pending.current, ctxRef.current) : [];
    pending.current = null;
    setMessages((prev) => prev.map((m) => (m.card?.type === 'login' ? { ...m, used: true } : m)));
    play([...intro, ...rest], THINK_LOGIN);
  }, [play]);

  const setScenario = useCallback((s: Scenario) => {
    setScenarioRaw(s);
    setCnhStarted(s === 'concluida');
    setNotaResgatada(false);
    setFavorites(s === 'novo' ? [] : DEFAULT_FAVS);
    setMessages([]);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      logged,
      setLogged,
      scenario,
      setScenario,
      cnhStarted,
      notaResgatada,
      favorites,
      toggleFavorite: (title) => setFavorites((f) => (f.includes(title) ? f.filter((x) => x !== title) : [...f, title])),
      prefs,
      setPref: (k, v) => setPrefs((p) => ({ ...p, [k]: v })),
      photo,
      setPhoto,
      textScale,
      setTextScale,
      posts,
      publish: (p) =>
        setPosts((list) => [{ ...p, id: mid(), when: 'Agora', status: 'publicada' as const }, ...list.filter((x) => !(p.conquista && x.conquista === p.conquista && x.status === 'nao_publicada'))]),
      guardarSemPublicar: (p) => setPosts((list) => [{ ...p, id: mid(), when: 'Agora', status: 'nao_publicada' as const }, ...list]),
      messages,
      thinking,
      thinkStep,
      thinkTotal,
      busy,
      resumeAfterLogin,
      send,
      confirm,
      newChat: () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        setMessages([]);
        setThinking(null);
        setBusy(false);
        setThinkStep(0);
      },
      toast,
      showToast,
    }),
    [logged, photo, textScale, posts, scenario, setScenario, cnhStarted, notaResgatada, favorites, prefs, messages, thinking, thinkStep, thinkTotal, busy, resumeAfterLogin, send, confirm, toast, showToast],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp fora do AppStateProvider');
  return v;
}
