/* Catálogo de serviços (mesmos dados da Proposta web, com alguns acréscimos do protótipo). */

export type Service = { t: string; d: string; c: CategoryId; o: string; v: string; k: string; q: string };

export type CategoryId =
  | "agua"
  | "amb"
  | "assist"
  | "cult"
  | "edu"
  | "emp"
  | "empr"
  | "fin"
  | "hab"
  | "saude"
  | "seg"
  | "serv"
  | "srv"
  | "transp";

export const CATEGORIES: { id: CategoryId; t: string; icon: string }[] = [
  { id: 'transp', t: 'Transporte e Veículos', icon: 'car' },
  { id: 'saude', t: 'Saúde e Bem-Estar', icon: 'heart' },
  { id: 'fin', t: 'Finanças e Pagamentos', icon: 'coins' },
  { id: 'edu', t: 'Educação e Escola', icon: 'school' },
  { id: 'seg', t: 'Segurança e Proteção', icon: 'shield' },
  { id: 'assist', t: 'Assistência Social e Cidadania', icon: 'people' },
  { id: 'agua', t: 'Água e Luz', icon: 'drop' },
  { id: 'empr', t: 'Empresas', icon: 'briefcase' },
  { id: 'srv', t: 'Servidor Público', icon: 'badge' },
  { id: 'emp', t: 'Emprego e Renda', icon: 'chart' },
  { id: 'hab', t: 'Habitação', icon: 'home' },
  { id: 'cult', t: 'Cultura e Lazer', icon: 'music' },
  { id: 'amb', t: 'Ambiente e Natureza', icon: 'leaf' },
  { id: 'serv', t: 'Serviços ao Cidadão', icon: 'grid' },
];

export const SERVICES: Service[] = [
  {
    t: "Emitir CRLV digital do veículo",
    d: "Baixe o documento do veículo em versão digital.",
    c: "transp",
    o: "DETRAN",
    v: "Emitir",
    k: "",
    q: "Quero emitir o CRLV digital do meu veículo"
  },
  {
    t: "Atualizar endereço de veículo",
    d: "Informe o novo endereço do proprietário do veículo.",
    c: "transp",
    o: "DETRAN",
    v: "Atualizar",
    k: "",
    q: "Quero atualizar o endereço do meu veículo"
  },
  {
    t: "Consultar meus veículos",
    d: "Veja os veículos em seu nome e a situação de cada um.",
    c: "transp",
    o: "DETRAN",
    v: "Consultar",
    k: "",
    q: "Quero consultar meus veículos"
  },
  {
    t: "Consultar a minha CNH",
    d: "Categoria, validade e pontuação da sua habilitação.",
    c: "transp",
    o: "DETRAN",
    v: "Consultar",
    k: "",
    q: "Quero consultar a minha CNH"
  },
  {
    t: "Emitir CRV eletrônico do veículo",
    d: "Emita o certificado de registro do veículo.",
    c: "transp",
    o: "DETRAN",
    v: "Emitir",
    k: "",
    q: "Quero emitir o CRV eletrônico do veículo"
  },
  {
    t: "Renovar CNH",
    d: "Abra a renovação e reserve o exame médico.",
    c: "transp",
    o: "DETRAN",
    v: "Renovar",
    k: "",
    q: "Quero renovar minha CNH"
  },
  {
    t: "Segunda via da CNH",
    d: "Para quem perdeu, teve roubo ou dano da habilitação.",
    c: "transp",
    o: "DETRAN",
    v: "Solicitar",
    k: "perdi roubei roubo extravio",
    q: "Perdi minha CNH"
  },
  {
    t: "Medicamentos Especializados · Farmácia do Povo",
    d: "Veja a disponibilidade e reserve seu medicamento.",
    c: "saude",
    o: "SESAPI",
    v: "Solicitar",
    k: "remedio farmacia",
    q: "Meu remédio acabou"
  },
  {
    t: "Agendar doação de sangue",
    d: "Agende a sua doação no hemocentro e receba a carteira do doador.",
    c: "saude",
    o: "HEMOPI",
    v: "Agendar",
    k: "doar sangue hemocentro",
    q: "Quero agendar uma doação de sangue"
  },
  {
    t: "Marcar uma consulta",
    d: "Agende atendimento na rede de saúde do Estado.",
    c: "saude",
    o: "SESAPI",
    v: "Agendar",
    k: "",
    q: "Quero marcar uma consulta"
  },
  {
    t: "Resgatar créditos da Nota Piauiense",
    d: "Veja o valor disponível e solicite o resgate.",
    c: "fin",
    o: "SEFAZ",
    v: "Resgatar",
    k: "",
    q: "Quero resgatar meus créditos da Nota Piauiense"
  },
  {
    t: "Abrir uma empresa",
    d: "Orientação para abertura e registro de empresas.",
    c: "empr",
    o: "JUCEPI",
    v: "Iniciar",
    k: "",
    q: "Quero abrir uma empresa"
  },
  {
    t: "Consultar minhas férias",
    d: "Você consulta suas férias registradas, pelo Perfil do Servidor.",
    c: "srv",
    o: "SEAD",
    v: "Consultar",
    k: "",
    q: "Quero consultar minhas férias"
  },
  {
    t: "Avaliar competências da SEFAZ",
    d: "Você realiza a avaliação de competências da SEFAZ e acompanha o resultado.",
    c: "srv",
    o: "SEFAZ",
    v: "Avaliar",
    k: "",
    q: "Quero avaliar as competências da SEFAZ"
  },
  {
    t: "Atualizar cadastro do servidor",
    d: "Atualize os dados pessoais dos servidores públicos do Estado do Piauí e mantenha o cadastro em dia.",
    c: "srv",
    o: "SEAD",
    v: "Atualizar",
    k: "",
    q: "Quero atualizar meu cadastro de servidor"
  },
  {
    t: "Avaliar competências da SEAD",
    d: "Avaliação de competências dos servidores da Secretaria de Administração do Piauí.",
    c: "srv",
    o: "SEAD",
    v: "Avaliar",
    k: "",
    q: "Quero avaliar as competências da SEAD"
  },
  {
    t: "Realizar prova de vida",
    d: "Atualização de dados de funcionários públicos aposentados, pensionistas e especiais.",
    c: "srv",
    o: "SEAD",
    v: "Realizar",
    k: "",
    q: "Quero fazer a prova de vida de servidor público"
  },
  {
    t: "Consultar contracheque",
    d: "Você consulta os detalhes do seu contracheque, com valores e descontos registrados.",
    c: "srv",
    o: "SEAD",
    v: "Consultar",
    k: "",
    q: "Quero consultar meu contracheque"
  },
  {
    t: "Consultar pagamentos",
    d: "Você consulta os pagamentos e os valores recebidos.",
    c: "srv",
    o: "SEAD",
    v: "Consultar",
    k: "",
    q: "Quero consultar meus pagamentos de servidor"
  },
  {
    t: "Consultar ficha funcional",
    d: "Você acessa a ficha funcional e os dados funcionais registrados.",
    c: "srv",
    o: "SEAD",
    v: "Consultar",
    k: "",
    q: "Quero consultar minha ficha funcional"
  },
  {
    t: "Registrar pássaro no plantel",
    d: "Registre o pássaro no plantel e inclua aves em criação amadora, com o registro no cadastro.",
    c: "empr",
    o: "SEMARH",
    v: "Registrar",
    k: "",
    q: "Quero registrar um pássaro no plantel"
  },
  {
    t: "Solicitar renovação de outorga",
    d: "Renovação de outorga de uso da água e manutenção do direito de uso.",
    c: "empr",
    o: "SEMARH",
    v: "Solicitar",
    k: "",
    q: "Quero solicitar a renovação de outorga"
  },
  {
    t: "Solicitar renovação de licença de transporte",
    d: "Renovação de licença de transporte e manutenção da autorização para transportar produtos.",
    c: "empr",
    o: "SEMARH",
    v: "Solicitar",
    k: "",
    q: "Quero solicitar a renovação de licença de transporte"
  },
  {
    t: "Solicitar renovação de licença",
    d: "Renovação de Licença de Operação e manutenção da regularidade ambiental.",
    c: "empr",
    o: "SEMARH",
    v: "Solicitar",
    k: "",
    q: "Quero solicitar a renovação de licença de operação"
  },
  {
    t: "Solicitar renovação de declaração ambiental",
    d: "Renovação de Declaração de Baixo Impacto Ambiental e manutenção da validade da declaração.",
    c: "empr",
    o: "SEMARH",
    v: "Solicitar",
    k: "",
    q: "Quero solicitar a renovação de declaração ambiental"
  },
  {
    t: "Solicitar renovação de cadastro",
    d: "Renovação de cadastro de criador amador e manutenção do registro de criação de aves.",
    c: "empr",
    o: "SEMARH",
    v: "Solicitar",
    k: "",
    q: "Quero solicitar a renovação de cadastro de criador amador"
  },
  {
    t: "Registrar ocorrência",
    d: "Registre um boletim de ocorrência pela Delegacia Virtual.",
    c: "seg",
    o: "SSP",
    v: "Registrar",
    k: "policia boletim bo furto roubo",
    q: "Quero registrar uma ocorrência"
  },
  {
    t: "Boletim escolar",
    d: "Veja notas e frequência na rede estadual.",
    c: "edu",
    o: "SEDUC",
    v: "Consultar",
    k: "nota escola filho",
    q: "Quero ver o boletim escolar"
  },
  {
    t: "Inscrição no SISU · orientação",
    d: "Datas, documentos e passo a passo da inscrição.",
    c: "edu",
    o: "SEDUC",
    v: "Ver",
    k: "faculdade enem",
    q: "Como faço a inscrição no SISU?"
  },
  {
    t: "Segunda via da conta de água",
    d: "Emita a segunda via e veja débitos.",
    c: "agua",
    o: "ÁGUAS",
    v: "Emitir",
    k: "agua conta fatura",
    q: "Quero a segunda via da conta de água"
  },
  {
    t: "Cadastro em programas sociais",
    d: "Veja a que programas do Estado você tem direito.",
    c: "assist",
    o: "SAS",
    v: "Consultar",
    k: "beneficio auxilio",
    q: "Quero saber a que programas sociais tenho direito"
  },
  {
    t: "Óia o Risco · registrar evento climático",
    d: "Registre alagamentos, deslizamentos e outras situações de risco.",
    c: "seg",
    o: "SEDEC",
    v: "Registrar",
    k: "chuva alagamento defesa civil",
    q: "Quero registrar uma situação de risco"
  }
];
