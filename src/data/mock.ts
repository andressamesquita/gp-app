/* Dados simulados do protótipo (pessoa: Ana Souza). Nada aqui vem de sistemas reais. */
import type { IconName } from '@/components/Icon';

export type Scenario = 'padrao' | 'novo' | 'concluida';

export const PERSON = {
  name: 'Ana Souza',
  first: 'Ana',
  initials: 'AS',
  city: 'Teresina · PI',
  level: 'Opala',
};

export const PROTOCOL_CNH = '2026.0412.883';
export const PROTOCOL_NOTA = '2026.0409.117';
export const PROTOCOL_CERT = '2026.0331.042';

/* ---------- Carteira ---------- */
export type WalletDoc = {
  id: string;
  kicker: string;
  title: string;
  sub: string;
  org: string;
  tone: 'blue' | 'green' | 'orange' | 'yellow' | 'deep';
  status?: string;
  number: string;
  fields: [string, string][];
};

export const WALLET_TONES: Record<WalletDoc['tone'], { bg: string; ink: string }> = {
  blue: { bg: '#004CA0', ink: '#FFFFFF' },
  green: { bg: '#007830', ink: '#FFFFFF' },
  orange: { bg: '#C8361B', ink: '#FFFFFF' },
  yellow: { bg: '#FCB810', ink: '#2B1F00' },
  deep: { bg: '#003A7A', ink: '#FFFFFF' },
};

export function walletDocs(s: Scenario): WalletDoc[] {
  if (s === 'novo') return [];
  const base: WalletDoc[] = [
    { id: 'hemopi', kicker: 'Hemopi', title: 'Carteira do Hemopi', sub: 'Doador de sangue', org: 'Hemopi', tone: 'blue', number: '1207', fields: [['Nome', PERSON.name], ['Tipo sanguíneo', 'O+'], ['Última doação', '12/08/2026']] },
    { id: 'fibro', kicker: 'Saúde', title: 'Carteira de fibromialgia', sub: 'Atendimento prioritário', org: 'Saúde', tone: 'green', number: '3381', fields: [['Nome', PERSON.name], ['Validade', '05/2028']] },
    { id: 'cin', kicker: 'Identidade', title: 'Carteira CIN', sub: 'Carteira de Identidade Nacional', org: 'Identidade', tone: 'orange', number: '0915', fields: [['Nome', PERSON.name], ['CPF', '•••.•••.•••-••'], ['Emissão', '03/2025']] },
    { id: 'estudante', kicker: 'Educação', title: 'Carteira do Estudante', sub: 'Meia-entrada', org: 'Educação', tone: 'yellow', number: '5520', fields: [['Nome', PERSON.name], ['Instituição', 'UFPI'], ['Validade', '03/2027']] },
    { id: 'idoso', kicker: 'Transporte', title: 'Carteira do Idoso', sub: 'Gratuidade no transporte', org: 'Transporte', tone: 'deep', number: '7744', fields: [['Beneficiária', 'Maria Souza (mãe)'], ['Validade', '12/2027']] },
    { id: 'residencia', kicker: 'Residência', title: 'Comprovante de residência', sub: 'Conta de energia · Equatorial Piauí', org: 'Residência', tone: 'deep', number: '8826', fields: [['Titular', PERSON.name], ['Endereço', 'Rua Areolino de Abreu, 1200 · Centro · Teresina'], ['Referência', 'Setembro/2026'], ['Emissão', '05/10/2026']] },
  ];
  if (s === 'concluida')
    return [
      { id: 'cnh', kicker: 'Habilitação', title: 'CNH Digital', sub: 'Carteira Nacional de Habilitação', org: 'DETRAN', tone: 'blue', status: 'Renovada', number: '4410', fields: [['Nome', PERSON.name], ['Categoria', 'B'], ['Validade', '10/2036']] },
      ...base,
    ];
  return base;
}

/* ---------- Solicitações (Acompanhamento / Atividade) ---------- */
export type StepState = 'done' | 'current' | 'todo';
export type Request = {
  id: string;
  title: string;
  status: 'Em andamento' | 'Processando' | 'Aguardando pagamento' | 'Concluída' | 'Concluído';
  protocol: string;
  /** Linha de resumo: "Etapa 3 de 4 · Exame médico" */
  summary: string;
  steps: { t: string; d?: string; s: StepState; via?: string }[];
  fields?: [string, string][];
  action?: { label: string; q?: string; toast?: string };
};

export function requests(s: Scenario, cnhStarted: boolean): Request[] {
  if (s === 'novo' && !cnhStarted) return [];
  const cnhAndamento: Request = {
    id: 'cnh',
    title: 'Renovação da CNH',
    status: 'Em andamento',
    protocol: PROTOCOL_CNH,
    summary: 'Etapa 3 de 4 · Exame médico',
    steps: [
      { t: 'Solicitação', s: 'done' },
      { t: 'Documentos', s: 'done' },
      { t: 'Exame médico', s: 'current' },
      { t: 'Emissão', s: 'todo' },
    ],
    fields: [
      ['Pendente', 'Exame médico'],
      ['Data', '21/10'],
      ['Horário', '09:20'],
      ['Endereço', 'Rua dos Ipês, 1044, bairro Novo · Clínica Centro'],
    ],
    action: { label: 'Reagendar exame', q: 'Quero mudar o horário do exame' },
  };
  const cnhConcluida: Request = {
    id: 'cnh',
    title: 'Renovação da CNH',
    status: 'Concluída',
    protocol: PROTOCOL_CNH,
    summary: 'Concluída em 6 dias',
    steps: [
      { t: 'Solicitação', s: 'done' },
      { t: 'Documentos', s: 'done' },
      { t: 'Exame médico', s: 'done' },
      { t: 'Emissão', s: 'done' },
    ],
    fields: [
      ['Nova validade', '10/2036'],
      ['Onde está', 'Na sua Carteira'],
    ],
  };
  const crlv: Request = {
    id: 'crlv',
    title: '2ª via do CRLV',
    status: 'Aguardando pagamento',
    protocol: '2026.0415.204',
    summary: 'Etapa 2 de 4 · Taxa',
    steps: [
      { t: 'Solicitação', s: 'done' },
      { t: 'Taxa', s: 'current' },
      { t: 'Análise', s: 'todo' },
      { t: 'Emissão', s: 'todo' },
    ],
    fields: [
      ['Pendente', 'Pagamento da taxa'],
      ['Valor', 'R$ 98,91'],
      ['Vencimento', '30/10'],
    ],
    action: { label: 'Pagar com Pix', toast: 'Código Pix copiado (simulação).' },
  };
  const nota: Request = {
    id: 'nota',
    title: 'Resgate Nota Piauiense',
    status: 'Processando',
    protocol: PROTOCOL_NOTA,
    summary: 'Etapa 2 de 4 · Validação',
    steps: [
      { t: 'Solicitação', s: 'done' },
      { t: 'Validação', s: 'current' },
      { t: 'Pagamento', s: 'todo' },
      { t: 'Concluído', s: 'todo' },
    ],
    fields: [
      ['Valor', 'R$ 38,40'],
      ['Destino', 'Pix · CPF'],
      ['Previsão', '2 dias úteis'],
    ],
  };
  const cert: Request = {
    id: 'cert',
    title: 'Certidão de nascimento',
    status: 'Concluído',
    protocol: PROTOCOL_CERT,
    summary: 'Disponível na versão digital',
    steps: [
      { t: 'Pedido', s: 'done' },
      { t: 'Emissão', s: 'done' },
    ],
    fields: [['Onde está', 'Na sua Carteira']],
  };
  if (s === 'novo') return [cnhAndamento];
  if (s === 'concluida') return [crlv, nota, cnhConcluida, cert];
  return cnhStarted ? [cnhAndamento, crlv, nota, cert] : [crlv, nota, cert];
}

/* ---------- Para mim ---------- */
export type ForMe = { id: string; title: string; text: string; cta: string; bar: string; urgent?: boolean; q?: string; to?: string; sheet?: 'saldo' };
export function forMe(s: Scenario, cnhStarted: boolean): ForMe[] {
  if (s === 'novo' && !cnhStarted) return [];
  const list: ForMe[] = [];
  if (s === 'concluida') list.push({ id: 'pronta', title: 'Sua nova CNH está pronta', text: 'Já está na sua Carteira.', cta: 'Ver carteira', bar: '#007830', to: '/carteira' });
  else if (cnhStarted) list.push({ id: 'exame', title: 'Exame médico marcado', text: '21/10, 9h20 · Clínica Centro. Leve um documento com foto.', cta: 'Ver detalhes', bar: '#004CA0', to: '/atividade' });
  else list.push({ id: 'vence', title: 'CNH vence em 27 dias', text: 'Renove agora, sem multas pendentes.', cta: 'Renovar', bar: '#FCB810', urgent: true, q: 'Quero renovar minha CNH' });
  list.push(
    { id: 'perfil', title: 'Complete seu perfil', text: 'Falta seu endereço atual. Leva 1 minuto.', cta: 'Completar', bar: '#EC4020', to: '/meu-perfil' },
    { id: 'nota', title: 'Nota Piauiense', text: 'Você tem R$ 38,40 disponíveis para resgate.', cta: 'Ver saldo', bar: '#007830', sheet: 'saldo' },
  );
  return list;
}

export const SALDO = { valor: 'R$ 38,40', minimo: 'R$ 25,00' };

/* ---------- Conquistas ---------- */
export type Medal = { id: string; t: string; how: string; shape: 'c' | 'q' | 'h'; k: 0 | 1 | 2 | 3; icon: IconName };
export const MEDALS: Medal[] = [
  { id: 'primeira', t: 'Primeira solicitação', how: 'Conclua uma solicitação pelo Gov.pi.', shape: 'c', k: 0, icon: 'check' },
  { id: 'doc', t: 'Documento na carteira', how: 'Tenha um documento digital emitido.', shape: 'q', k: 1, icon: 'wallet' },
  { id: 'perfil', t: 'Perfil completo', how: 'Preencha seus dados e canais de contato.', shape: 'h', k: 3, icon: 'user' },
  { id: 'cnh', t: 'CNH em dia', how: 'Conclua a renovação da CNH.', shape: 'c', k: 0, icon: 'car' },
  { id: 'credito', t: 'Crédito resgatado', how: 'Resgate créditos da Nota Piauiense.', shape: 'q', k: 3, icon: 'coins' },
  { id: 'doador', t: 'Doador', how: 'Tenha a carteira do doador emitida.', shape: 'h', k: 2, icon: 'heart' },
  { id: 'zap', t: 'Zap ativado', how: 'Receba seus avisos pelo Zap do Cidadão.', shape: 'c', k: 1, icon: 'whats' },
  { id: 'publicou', t: 'Primeira publicação', how: 'Compartilhe uma conquista no seu Feed.', shape: 'q', k: 0, icon: 'share' },
];

export function earnedMedals(s: Scenario): string[] {
  if (s === 'novo') return [];
  if (s === 'concluida') return ['primeira', 'doc', 'perfil', 'cnh', 'doador'];
  return ['primeira', 'doc', 'perfil', 'doador'];
}

/* ---------- Jornada ---------- */
export type MomentService = { t: string; d: string; status: 'Em andamento' | 'Concluído' | 'Disponível' | 'Não se aplica'; q?: string };
export type Moment = { id: string; t: string; icon: IconName; applies: boolean; services: MomentService[] };

export function moments(s: Scenario, cnhStarted = false): Moment[] {
  const cnh: MomentService =
    s === 'concluida'
      ? { t: 'Renovação da CNH', d: 'Nova CNH emitida e já na Carteira.', status: 'Concluído' }
      : !cnhStarted
        ? { t: 'Renovação da CNH', d: 'Sua CNH vence em 27 dias. Renove sem sair de casa.', status: 'Disponível', q: 'Quero renovar minha CNH' }
        : { t: 'Renovação da CNH', d: 'Exame médico marcado · 21/10, 9h20.', status: 'Em andamento' };
  return [
    {
      id: 'condutora',
      t: 'Condutora',
      icon: 'car',
      applies: true,
      services: [
        cnh,
        s === 'novo'
          ? { t: 'Emissão do CRLV Digital', d: 'Tenha o documento do veículo no celular.', status: 'Disponível', q: 'Quero emitir o CRLV digital do meu veículo' }
          : { t: 'Emissão do CRLV Digital', d: 'Documento do veículo disponível na Carteira.', status: 'Concluído' },
        { t: 'Consulta de pontuação da CNH', d: 'Veja sua situação como condutora quando quiser.', status: 'Disponível', q: 'Quero consultar a minha CNH' },
        { t: 'Primeira habilitação', d: 'Você já tem habilitação.', status: 'Não se aplica' },
      ],
    },
    {
      id: 'cidada',
      t: 'Cidadã',
      icon: 'idcard',
      applies: true,
      services: [
        { t: 'Certidão de nascimento', d: 'Disponível na versão digital.', status: s === 'novo' ? 'Disponível' : 'Concluído' },
        { t: 'Resgate Nota Piauiense', d: 'R$ 38,40 disponíveis.', status: s === 'novo' ? 'Disponível' : 'Em andamento', q: 'Quero resgatar meus créditos da Nota Piauiense' },
        { t: 'Segunda via de documentos', d: 'Perdeu algum documento? Veja o caminho.', status: 'Disponível', q: 'Perdi minha CNH' },
      ],
    },
    {
      id: 'doador',
      t: 'Doadora de sangue',
      icon: 'heart',
      applies: true,
      services: [
        { t: 'Agendar doação de sangue', d: 'Escolha o hemocentro e o horário.', status: 'Disponível', q: 'Quero agendar uma doação de sangue' },
        { t: 'Carteira do doador', d: s === 'novo' ? 'Emitida após a primeira doação.' : 'Já está na sua Carteira.', status: s === 'novo' ? 'Disponível' : 'Concluído' },
      ],
    },
    { id: 'estudante', t: 'Estudante', icon: 'school', applies: false, services: [] },
    { id: 'gestante', t: 'Gestante', icon: 'people', applies: false, services: [] },
  ];
}

/* ---------- Avisos ---------- */
export type Aviso = {
  id: string;
  group: 'Hoje' | 'Esta semana';
  tags: string[];
  title: string;
  body: string;
  cat: 'pendente' | 'andamento' | 'info';
  action?: { label: string; to: string; q?: string };
  why?: boolean;
};

export function avisos(s: Scenario, cnhStarted = false): Aviso[] {
  if (s === 'novo' && !cnhStarted) return [];
  const list: Aviso[] = [];
  if (s === 'concluida') {
    list.push({ id: 'pronta', group: 'Hoje', tags: ['Nova'], title: 'Sua nova CNH está pronta', body: 'Já está na sua Carteira.', cat: 'info', action: { label: 'Ver carteira', to: '/carteira' } });
  } else if (cnhStarted) {
    list.push({ id: 'exame', group: 'Hoje', tags: ['Nova'], title: 'Exame médico marcado', body: `21/10, 9h20 · Clínica Centro · Protocolo ${PROTOCOL_CNH}`, cat: 'andamento', action: { label: 'Ver solicitação', to: '/atividade' } });
    if (s === 'novo') return list;
  } else {
    list.push(
      { id: 'vence', group: 'Hoje', tags: ['Nova', 'Precisa de você'], title: 'Sua CNH vence em 27 dias', body: 'Já podemos preencher a renovação com os dados que o Estado tem.', cat: 'pendente', action: { label: 'Renovar', to: '/', q: 'Quero renovar minha CNH' }, why: true },
    );
  }
  list.push(
    { id: 'credito', group: 'Esta semana', tags: [], title: 'Você tem R$ 38,40 para resgatar', body: 'Nota Piauiense · valor disponível.', cat: 'pendente', action: { label: 'Resgatar', to: '/', q: 'Quero resgatar meus créditos da Nota Piauiense' } },
    { id: 'resgate', group: 'Esta semana', tags: [], title: 'Seu resgate está sendo processado', body: `Protocolo ${PROTOCOL_NOTA} · Avisamos quando for concluído.`, cat: 'andamento' },
    { id: 'cert', group: 'Esta semana', tags: [], title: 'Certidão de nascimento disponível', body: `Protocolo ${PROTOCOL_CERT} · Já está na sua carteira.`, cat: 'info', action: { label: 'Abrir na carteira', to: '/carteira' } },
  );
  return list;
}

/* ---------- Conversas anteriores ---------- */
export const PAST_CHATS = [
  { group: 'Últimos 7 dias', t: 'Renovação da CNH', p: PROTOCOL_CNH, q: 'Quero renovar minha CNH' },
  { group: 'Últimos 7 dias', t: 'Resgate da Nota Piauiense', p: PROTOCOL_NOTA, q: 'Quero resgatar meus créditos da Nota Piauiense' },
  { group: 'Mais antigas', t: 'Certidão de nascimento', p: PROTOCOL_CERT, q: 'Quero ver minha certidão de nascimento' },
];

/** Exemplos que alternam no campo de conversa (linguagem natural, não palavra-chave). */
export const PROMPT_EXAMPLES = [
  'Ex.: perdi minha CNH',
  'Ex.: meu remédio acabou',
  'Ex.: quero renovar minha habilitação',
  'Ex.: tenho crédito da Nota Piauiense?',
];

/* ---------- Últimos acessos (Área do cidadão > Seus serviços > Recentes) ---------- */
export type Recente = { t: string; quando: string };
export function recentes(s: Scenario): Recente[] {
  if (s === 'novo') return [];
  return [
    { t: 'Renovar CNH', quando: s === 'concluida' ? 'Há 2 dias' : 'Hoje' },
    { t: 'Resgatar créditos da Nota Piauiense', quando: 'Ontem' },
    { t: 'Consultar a minha CNH', quando: 'Há 3 dias' },
    { t: 'Emitir CRLV digital do veículo', quando: 'Há 5 dias' },
    { t: 'Marcar uma consulta', quando: 'Há 1 semana' },
    { t: 'Agendar doação de sangue', quando: 'Há 2 semanas' },
    { t: 'Consultar contracheque', quando: 'Há 3 semanas' },
    { t: 'Boletim escolar', quando: 'Há 1 mês' },
    { t: 'Segunda via da conta de água', quando: 'Há 1 mês' },
  ];
}

/* ---------- Recomendados (Área do cidadão > Seus serviços > Recomendados) ----------
   Escolhidos pelo perfil da pessoa logada: condutora, doadora de sangue, servidora estadual, mãe de estudante. */
export const PERFIL_RESUMO = 'condutora, doadora de sangue e servidora estadual';
export function recomendados(s: Scenario): string[] {
  const cnh = s === 'concluida' ? 'Consultar a minha CNH' : 'Renovar CNH';
  return [cnh, 'Agendar doação de sangue', 'Consultar contracheque', 'Realizar prova de vida', 'Boletim escolar', 'Resgatar créditos da Nota Piauiense'];
}
