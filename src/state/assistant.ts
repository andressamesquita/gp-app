/**
 * Assistente simulado. Responde por roteiro (sem IA de verdade), só para o protótipo.
 * Cada resposta é uma lista de mensagens do assistente; a tela as exibe uma a uma,
 * com o indicador "digitando" entre elas.
 */
import { SERVICES, type Service } from '@/data/catalog';
import { PERSON, PROTOCOL_CNH, PROTOCOL_NOTA, type Scenario } from '@/data/mock';

export type Action = { label: string; to?: string; q?: string; confirm?: string; primary?: boolean; toast?: string };

export type Card =
  | { type: 'summary'; title: string; rows: [string, string][]; steps: string[]; confirm: string }
  | { type: 'done'; title: string; protocol: string; detail: string }
  | { type: 'steps'; title: string; steps: string[]; note?: string }
  | { type: 'services'; items: Service[] }
  | { type: 'login' };

export type Msg = {
  id: string;
  from: 'user' | 'bot';
  text?: string;
  card?: Card;
  actions?: Action[];
  /** Resposta já confirmada: os botões do cartão somem. */
  used?: boolean;
};

export type Ctx = { logged: boolean; scenario: Scenario; cnhStarted: boolean; notaResgatada: boolean };

let seq = 0;
export const mid = () => `m${Date.now().toString(36)}${(seq++).toString(36)}`;

export const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const bot = (text?: string, extra: Partial<Msg> = {}): Msg => ({ id: mid(), from: 'bot', text, ...extra });

export function searchServices(q: string, max = 3): Service[] {
  const words = norm(q).split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w));
  if (!words.length) return [];
  const scored = SERVICES.map((s) => {
    const hay = norm(`${s.t} ${s.d} ${s.k} ${s.o} ${s.q}`);
    const score = words.reduce((n, w) => n + (hay.includes(w) ? (norm(s.t).includes(w) ? 3 : 1) : 0), 0);
    return { s, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, max).map((x) => x.s);
}

const STOP = new Set(['quero', 'minha', 'meu', 'meus', 'minhas', 'para', 'como', 'fazer', 'preciso', 'uma', 'por', 'que', 'com', 'dos', 'das', 'tenho', 'ver', 'qual']);

const loginGate = (text = 'Para ver os seus dados e resolver por aqui, é só entrar na sua conta Gov.pi. Preenchemos o que o Estado já tem sobre você.'): Msg =>
  bot(text, { card: { type: 'login' } });

export function respond(text: string, ctx: Ctx): Msg[] {
  const t = norm(text);
  const has = (...w: string[]) => w.some((x) => t.includes(x));
  const cnh = has('cnh', 'habilita', 'carteira de motorista');

  // Segunda via / perda
  if (has('perdi', 'roub', 'extravi', 'segunda via', 'furtad') && (cnh || has('documento', 'rg', 'identidade'))) {
    const out: Msg[] = [
      bot('Sinto muito. Você pode pedir a segunda via. Veja o caminho:', {
        card: {
          type: 'steps',
          title: 'Segunda via da CNH',
          steps: [
            'Registrar a ocorrência de perda',
            'Reunir os documentos necessários',
            'Pagar a taxa do DETRAN',
            'Receber a nova CNH no prazo informado',
          ],
          note: 'Valores e prazos são informados pelo DETRAN-PI.',
        },
      }),
    ];
    if (!ctx.logged) return [...out, loginGate()];
    return [
      ...out,
      bot('Posso começar agora e preencher o que já temos. Quer seguir?', {
        actions: [
          { label: 'Começar a segunda via', to: '/faltam-dados', primary: true },
          { label: 'Registrar a ocorrência', q: 'Quero registrar uma ocorrência' },
        ],
      }),
    ];
  }

  // Renovação da CNH
  if (cnh && has('renov', 'venc', 'vence', 'validade')) {
    if (!ctx.logged)
      return [loginGate('A renovação exige exame médico e CNH dentro do prazo. Posso verificar a sua situação e já agendar; para isso, é só entrar na sua conta Gov.pi.')];
    if (ctx.scenario === 'concluida')
      return [bot(`Sua CNH já foi renovada, ${PERSON.first}. A nova versão está na sua Carteira.`, { actions: [{ label: 'Ver CNH na carteira', to: '/carteira', primary: true }] })];
    if (ctx.cnhStarted)
      return [
        bot(`Você já tem uma renovação em andamento (protocolo ${PROTOCOL_CNH}). O exame médico está marcado para 21/10, às 9h20, na Clínica Centro.`, {
          actions: [
            { label: 'Acompanhar', to: '/atividade', primary: true },
            { label: 'Mudar o horário do exame', q: 'Quero mudar o horário do exame' },
          ],
        }),
      ];
    return [
      bot(`Encontrei sua habilitação, ${PERSON.first}. Vence em 27 dias e não há multas pendentes.`),
      bot('Posso abrir a renovação e já reservar seu exame médico. Confirma?', {
        card: {
          type: 'summary',
          title: 'Renovação da CNH',
          rows: [
            ['Habilitação', 'Categoria B'],
            ['Vencimento', 'Em 27 dias'],
            ['Multas', 'Nenhuma pendente'],
          ],
          steps: ['Abrir a renovação da sua CNH', 'Reservar seu exame médico'],
          confirm: 'cnh',
        },
      }),
    ];
  }

  if (cnh && has('consult', 'pontu', 'situa', 'ponto'))
    return ctx.logged
      ? [
          bot('Sua CNH está regular: categoria B, sem pontos na carteira e sem multas pendentes.', {
            actions: [
              { label: 'Ver CNH na carteira', to: '/carteira', primary: true },
              { label: 'Renovar minha CNH', q: 'Quero renovar minha CNH' },
            ],
          }),
        ]
      : [loginGate()];

  if (has('exame', 'horario', 'remarc'))
    return [
      bot('Encontrei estes horários na Clínica Centro. Qual fica melhor?', {
        actions: [
          { label: 'Qui, 22/10 · 14h', toast: 'Exame remarcado para 22/10, 14h (simulação).' },
          { label: 'Sex, 23/10 · 8h40', toast: 'Exame remarcado para 23/10, 8h40 (simulação).' },
          { label: 'Manter 21/10 · 9h20' },
        ],
      }),
    ];

  // Nota Piauiense
  if (has('nota piauiense', 'credito', 'resgat', 'cashback')) {
    if (!ctx.logged)
      return [loginGate('A Nota Piauiense devolve parte do imposto das suas compras. Para ver quanto você tem e resgatar, é só entrar na sua conta Gov.pi.')];
    if (ctx.notaResgatada || ctx.scenario !== 'novo')
      return [
        bot(`Seu resgate de R$ 38,40 já está sendo processado (protocolo ${PROTOCOL_NOTA}). A previsão é de 2 dias úteis.`, {
          actions: [{ label: 'Acompanhar', to: '/atividade', primary: true }],
        }),
      ];
    return [
      bot('Você tem R$ 38,40 para resgatar na Nota Piauiense.'),
      bot('Posso enviar para a sua chave Pix cadastrada (CPF). Confirma?', {
        card: {
          type: 'summary',
          title: 'Resgate Nota Piauiense',
          rows: [
            ['Valor', 'R$ 38,40'],
            ['Destino', 'Pix · CPF'],
            ['Prazo', 'Até 2 dias úteis'],
          ],
          steps: ['Solicitar o resgate', 'Avisar quando o valor cair'],
          confirm: 'nota',
        },
      }),
    ];
  }

  if (has('remedio', 'medicament', 'farmacia'))
    return [
      bot('Entendi. Pela Farmácia do Povo você vê se o medicamento está disponível e reserva a retirada.', {
        card: { type: 'services', items: SERVICES.filter((s) => s.k.includes('remedio')) },
      }),
      ...(ctx.logged ? [] : [loginGate('Para reservar o medicamento, é só entrar na sua conta Gov.pi.')]),
    ];

  if (has('carteira', 'documentos'))
    return [
      bot(
        ctx.scenario === 'novo'
          ? 'Sua carteira ainda está vazia. Documentos como a CNH Digital e a carteira do doador aparecem lá assim que forem emitidos.'
          : 'Você tem 5 documentos na Carteira: CIN, carteira do Hemopi, de fibromialgia, do Estudante e do Idoso.',
        { actions: [{ label: 'Abrir a Carteira', to: '/carteira', primary: true }] },
      ),
    ];

  if (has('atendente', 'pessoa', 'humano', 'falar com'))
    return [
      bot('Posso passar para um atendente. Ele já recebe o que conversamos, você não precisa explicar de novo. Atendimento em dias úteis, das 7h30 às 19h.', {
        actions: [{ label: 'Falar com um atendente', to: '/whatsapp', primary: true }],
      }),
    ];

  if (has('todos os servicos', 'ver servicos'))
    return [bot('O catálogo completo está em Serviços. Você também pode continuar me contando o que precisa.', { actions: [{ label: 'Abrir Serviços', to: '/servicos', primary: true }] })];

  const found = searchServices(text);
  if (found.length)
    return [bot(found.length === 1 ? 'Encontrei este serviço. É isso?' : 'Encontrei estes serviços. Qual deles é o seu caso?', { card: { type: 'services', items: found } })];

  return [
    bot('Ainda não sei resolver isso por aqui. Pode me contar de outro jeito? Por exemplo: "perdi minha CNH" ou "quero marcar uma consulta".', {
      actions: [
        { label: 'Ver todos os serviços', to: '/servicos' },
        { label: 'Falar com um atendente', to: '/whatsapp' },
      ],
    }),
  ];
}

export function confirmReply(id: string): Msg[] {
  if (id === 'cnh')
    return [
      bot('Exame marcado para quarta-feira, 21/10, às 9h20, na Clínica Centro. Avisaremos você a cada etapa por aqui.', {
        card: { type: 'done', title: 'Solicitação registrada', protocol: PROTOCOL_CNH, detail: 'Renovação da CNH' },
      }),
    ];
  return [
    bot('Pronto. Avisamos quando o valor cair na sua conta.', {
      card: { type: 'done', title: 'Resgate solicitado', protocol: PROTOCOL_NOTA, detail: 'Resgate Nota Piauiense' },
    }),
  ];
}

/** Textos que aparecem durante o carregamento, um a cada etapa. */
export function thinkingFor(text: string, ctx: Ctx): string[] {
  const t = norm(text);
  const first = 'Entendendo o seu pedido...';
  if (/cnh|habilita/.test(t)) return ctx.logged ? [first, 'Consultando o DETRAN-PI...', 'Organizando tudo certinho...'] : [first, 'Buscando nos serviços do Governo...', 'Organizando tudo certinho...'];
  if (/nota piauiense|credito|resgat/.test(t)) return [first, ctx.logged ? 'Consultando seus créditos na SEFAZ...' : 'Buscando nos serviços do Governo...', 'Organizando tudo certinho...'];
  if (/remedio|medicament|farmacia/.test(t)) return [first, 'Verificando a Farmácia do Povo...', 'Organizando tudo certinho...'];
  return [first, 'Buscando nos serviços do Governo...', 'Organizando tudo certinho...'];
}

export const THINK_CONFIRM: Record<string, string[]> = {
  cnh: ['Abrindo a sua renovação...', 'Reservando o exame médico...', 'Gerando o protocolo...'],
  nota: ['Solicitando o resgate...', 'Gerando o protocolo...'],
};
export const THINK_LOGIN = ['Confirmando a sua identidade...', 'Retomando de onde paramos...'];

export const hasLogin = (msgs: Msg[]) => msgs.some((m) => m.card?.type === 'login');
