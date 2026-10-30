import Svg, { Circle, Path, Rect } from 'react-native-svg';

/**
 * Ícones de traço (24x24), no mesmo desenho dos SVGs da Proposta web.
 * Ficam em SVG para manter a nitidez em qualquer densidade de tela.
 */
const P: Record<string, string> = {
  home: 'M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z',
  route: 'M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 17h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7',
  chat: 'M4 5h16v11H10l-4 3.5V16H4z',
  chats: 'M3 4h12v8.5H8.5L5.5 15.5v-3H3zM18 9h3v8.5h-2.5v3L15.5 17.5H9v-2.5',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c.8-4 4-6 8-6s7.2 2 8 6',
  back: 'M15 5l-7 7 7 7',
  close: 'M6 6l12 12M18 6L6 18',
  history: 'M4 12a8 8 0 1 0 3-6.2M4 4v4h4M12 8v4l3 2',
  bell: 'M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0',
  plus: 'M12 5v14M5 12h14',
  camera: 'M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  mic: 'M9 6a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0zM5 11a7 7 0 0 0 14 0M12 18v3',
  send: 'M12 19V5M5 12l7-7 7 7',
  search: 'M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM16 16l4 4',
  right: 'M9 5l7 7-7 7',
  down: 'M6 9l6 6 6-6',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
  wallet: 'M3 7h18v12H3zM3 7l2-3h12l2 3M16 13h2',
  card: 'M3 6h18v13H3zM3 10h18',
  idcard: 'M3 5h18v14H3zM7 15c.5-1.6 1.6-2.4 3-2.4s2.5.8 3 2.4M10 11a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4zM15 9h3M15 12h3',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  check: 'M5 12l5 5 9-10',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  shield: 'M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z',
  car: 'M5 16V11l2-5h10l2 5v5M5 16h14M5 16v3M19 16v3M7.5 13.5h.01M16.5 13.5h.01M4 11h16',
  heart: 'M12 20s-7-4.4-9-9c-1.3-3 .7-6 3.8-6 2 0 3.5 1.2 4.2 2.6C11.7 6.2 13.2 5 15.2 5c3.1 0 5.1 3 3.8 6-2 4.6-7 9-7 9z',
  coins: 'M9 10c3.3 0 6-1.1 6-2.5S12.3 5 9 5 3 6.1 3 7.5 5.7 10 9 10zM3 7.5v4C3 12.9 5.7 14 9 14s6-1.1 6-2.5M15 11c3.3 0 6 1.1 6 2.5S18.3 16 15 16s-6-1.1-6-2.5M9 13.5v3c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-3',
  school: 'M3 9l9-5 9 5-9 5zM7 11.2V16c1.5 1.3 3.2 2 5 2s3.5-.7 5-2v-4.8M21 9v6',
  people: 'M9 11a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 9 11zM3 20c.6-3.4 3-5.2 6-5.2s5.4 1.8 6 5.2M16 5.2a3 3 0 0 1 0 5.6M18.5 14.8c1.4.7 2.2 2.2 2.5 4.2',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  briefcase: 'M4 8h16v11H4zM9 8V5h6v3M4 13h16',
  badge: 'M5 4h14v16H5zM9 9h6M9 13h6M9 17h3',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  music: 'M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM19 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z',
  leaf: 'M5 19c0-8 5-13 15-14-1 10-6 15-14 15M5 19l7-7',
  qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2M14 18h2v2M18 18h2v2',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3',
  share: 'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4',
  file: 'M7 3h8l4 4v14H7zM15 3v4h4M10 13h6M10 17h6',
  finger: 'M12 11v4M8.5 7.5a5 5 0 0 1 8.5 3.5v2.5M7 11v2a5 5 0 0 0 1.5 3.6M12 20a8 8 0 0 0 2.5-3M17 15.5c-.3 1.9-1 3.6-2 5M5 9a8 8 0 0 1 13-4',
  whats: 'M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z',
  spark: 'M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 0 1 4.9.7c0 1.7-2.4 2.1-2.4 3.8M12 17h.01',
  logout: 'M9 4H5v16h4M16 8l4 4-4 4M20 12H9',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5h.01',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  alert: 'M12 4l9 16H3zM12 10v4M12 17h.01',
  refresh: 'M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5',
  sliders: 'M4 7h10M18 7h2M4 17h4M12 17h8M16 5v4M10 15v4',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  phone: 'M7 3h10v18H7zM11 18h2',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  eyeoff: 'M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.9 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2',
  pin: 'M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 2-2 5 5M15.5 9.5h.01',
  trophy: 'M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M12 14v4M8 21h8M9 18h6',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  prism: 'M12 4 21 20H3z',
  ext: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  wave: 'M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4',
};

export type IconName = keyof typeof P | 'starFill' | 'dot';

export function Icon({
  name,
  size = 22,
  color = 'currentColor',
  strokeWidth = 1.9,
}: {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  if (name === 'starFill') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d={P.star} fill={color} stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
      </Svg>
    );
  }
  if (name === 'dot') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx={12} cy={12} r={5} fill={color} />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={P[name] ?? P.info}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** QR Code ilustrativo (padrão fixo, só para o protótipo). */
export function FakeQR({ size = 200 }: { size?: number }) {
  const n = 21;
  const cell = size / n;
  const cells: { x: number; y: number }[] = [];
  const finder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      if (finder(x, y)) continue;
      const v = (x * 7 + y * 13 + ((x * y) % 5)) % 3;
      if (v === 0) cells.push({ x, y });
    }
  const F = ({ x, y }: { x: number; y: number }) => (
    <>
      <Rect x={x * cell} y={y * cell} width={cell * 7} height={cell * 7} fill="#111" />
      <Rect x={(x + 1) * cell} y={(y + 1) * cell} width={cell * 5} height={cell * 5} fill="#fff" />
      <Rect x={(x + 2) * cell} y={(y + 2) * cell} width={cell * 3} height={cell * 3} fill="#111" />
    </>
  );
  return (
    <Svg width={size} height={size}>
      <Rect width={size} height={size} fill="#fff" />
      <F x={0} y={0} />
      <F x={n - 7} y={0} />
      <F x={0} y={n - 7} />
      {cells.map((c, i) => (
        <Rect key={i} x={c.x * cell} y={c.y * cell} width={cell} height={cell} fill="#111" />
      ))}
    </Svg>
  );
}
