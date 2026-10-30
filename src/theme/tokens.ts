/**
 * Tokens de design do Gov.pi Cidadão (app).
 * Extraídos da Proposta web "menu azul" (v21.13). Todos os componentes leem daqui:
 * se a cor da marca mudar, muda em um lugar só.
 */

export const color = {
  // Marca
  brand: '#034EA2',
  brandDark: '#023C7E',
  brandLight: '#0B5CBD',
  brandTint: '#E3EEF9',
  brandInk: '#0B2F66',
  navy: '#192D48',

  // Superfícies e texto
  bg: '#F4F6FA',
  surface: '#FFFFFF',
  surface2: '#E8EEF6',
  ink: '#14233A',
  muted: '#44546B',
  line: '#D6DEE9',
  /** Divisória bem clara entre seções em fundo branco (estilo Méliuz). */
  divider: '#EEF1F5',
  lineStrong: '#B9C5D6',

  // Estados
  good: '#0A7A36',
  goodBg: '#E0F2E7',
  warnInk: '#5A3B00',
  warnBg: '#FFF1CF',
  danger: '#D93025',
  dangerBg: '#FCE3DC',

  // Paleta das ondas (carteira, conquistas, categorias)
  waveBlue: '#004CA0',
  waveGreen: '#007830',
  waveOrange: '#EC4020',
  waveYellow: '#FCB810',
  waveDeep: '#003A7A',

  // Canais
  whats: '#00782F',
  whatsBg: '#E8F1E9',
  oia: '#E87F3A',
  oiaBg: '#FFF2EB',

  white: '#FFFFFF',
  onBrand: '#FFFFFF',
  scrim: 'rgba(8,14,26,0.5)',
} as const;

/** Cores de fundo/ícone para categorias e conquistas (k0..k3 da web). */
export const kind = [
  { bg: '#E3EEF9', fg: '#004CA0', ring: '#004CA0' },
  { bg: '#DDF1E3', fg: '#007830', ring: '#007830' },
  { bg: '#FCE3DC', fg: '#C2330F', ring: '#EC4020' },
  { bg: '#FEF1CC', fg: '#7A5400', ring: '#FCB810' },
] as const;

export const font = {
  regular: 'Montserrat_400Regular',
  medium: 'Montserrat_500Medium',
  semibold: 'Montserrat_600SemiBold',
  bold: 'Montserrat_700Bold',
} as const;

// Mesmos raios da proposta web v21: 8px (itens, campos, carteira), 10px (botões), 12px (blocos), 22px (folhas)
export const radius = { sm: 8, md: 10, lg: 12, xl: 12, sheet: 22, pill: 999 } as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 } as const;

/** Área mínima de toque no Android (48dp). */
export const touch = 48;

export const shadow = {
  card: {
    shadowColor: '#0A1428',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  float: {
    shadowColor: '#001946',
    shadowOpacity: 0.28,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
} as const;

/**
 * Faixa de menu superior (topo das abas e das telas internas).
 * FAIXA_BRANCA = true: branca como o cabeçalho da web v23, logo colorida, título no tom escuro
 * dos títulos das dobras (#14233A) e ícones em #192D48. false = azul com ondas (antes).
 */
/**
 * Teste das opções de faixa com a logo colorida (uma por vez):
 *   1 = faixa branca compacta + primeira dobra azul-clara na Início (saudação e campo)
 *   2 = (próximo teste) faixa transparente que fica branca ao rolar
 *   3 = (próximo teste) faixa branca com sombra ao rolar
 *   4 = (próximo teste) logo colorida num selo branco dentro da faixa azul
 *   5 = faixa azul com a logo branca (último caso)
 *   0 = faixa branca simples (versão anterior)
 */
export const ESTILO_FAIXA = 1 as 0 | 1 | 2 | 3 | 4 | 5;
export const FAIXA_BRANCA: boolean = ESTILO_FAIXA !== 5 && ESTILO_FAIXA !== 4;
/** Fundo da primeira dobra clara (mesmo --hero da web) */
export const HERO_CLARO = '#E3EDFB';
export const bar = FAIXA_BRANCA
  ? { bg: '#FFFFFF', fg: '#192D48', title: '#14233A', sub: '#44546B', line: '#E3E8EF', pressed: '#E8EEF6' }
  : { bg: '#034EA2', fg: '#FFFFFF', title: '#FFFFFF', sub: 'rgba(255,255,255,0.85)', line: 'transparent', pressed: 'rgba(255,255,255,0.16)' };
