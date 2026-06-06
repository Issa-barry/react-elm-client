import { Dimensions } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

const { width: W, height: SCREEN_H } = Dimensions.get('window');
const H = SCREEN_H * 0.58;

// ── Nuage : 3 bosses distinctes + corps large (fidèle au sachet) ───────────
function Cloud({ x, y, s = 1, op = 0.85 }: Readonly<{ x: number; y: number; s?: number; op?: number }>) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
      {/* Bosse gauche (petite) */}
      <Circle cx={-26} cy={-3}  r={16} fill="white" />
      {/* Bosse centre (la plus haute) */}
      <Circle cx={0}   cy={-17} r={22} fill="white" />
      {/* Bosse droite (moyenne) */}
      <Circle cx={26}  cy={-5}  r={18} fill="white" />
      {/* Corps principal qui unit tout */}
      <Ellipse cx={2} cy={16} rx={48} ry={19} fill="white" />
    </G>
  );
}

// ── Goutte d'eau : ronde en bas, pointue en haut (comme sur le sachet) ─────
function Drop({ x, y, r = 10, op = 0.75 }: Readonly<{ x: number; y: number; r?: number; op?: number }>) {
  const h  = r * 1.85;  // hauteur totale
  const cy = r * 0.82;  // centre y du cercle du bas
  // Cubic bezier pour les flancs + arc pour la partie ronde du bas
  const d = `M 0 ${-h} C ${r * 0.65} ${-h * 0.65} ${r} ${-r * 0.15} ${r} ${cy} A ${r} ${r} 0 0 1 ${-r} ${cy} C ${-r} ${-r * 0.15} ${-r * 0.65} ${-h * 0.65} 0 ${-h} Z`;
  return (
    <G transform={`translate(${x},${y})`} opacity={op}>
      <Path d={d} fill="white" />
    </G>
  );
}

// ── Étoile 5 branches (identique à celles du sachet) ─────────────────────
function Star({ x, y, r = 10, op = 0.85 }: Readonly<{ x: number; y: number; r?: number; op?: number }>) {
  const ri = r * 0.38; // rayon intérieur
  const PI = Math.PI;
  let d = '';
  for (let i = 0; i < 5; i++) {
    const oa = -PI / 2 + (i * 2 * PI) / 5;       // angle sommet extérieur
    const ia = oa + PI / 5;                        // angle creux intérieur
    const ox = Number.parseFloat((r  * Math.cos(oa)).toFixed(2));
    const oy = Number.parseFloat((r  * Math.sin(oa)).toFixed(2));
    const ix = Number.parseFloat((ri * Math.cos(ia)).toFixed(2));
    const iy = Number.parseFloat((ri * Math.sin(ia)).toFixed(2));
    d += i === 0 ? `M ${ox} ${oy}` : ` L ${ox} ${oy}`;
    d += ` L ${ix} ${iy}`;
  }
  d += ' Z';
  return (
    <G transform={`translate(${x},${y})`} opacity={op}>
      <Path d={d} fill="white" />
    </G>
  );
}

// ── Silhouette du sachet (élément central subtil) ─────────────────────────
function Sachet({ cx, cy, w, h }: Readonly<{ cx: number; cy: number; w: number; h: number }>) {
  return (
    <G>
      <Rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={w * 0.09} fill="white" opacity={0.07} />
      <Rect x={cx - w / 2} y={cy - h / 2} width={w} height={h * 0.065} rx={4} fill="white" opacity={0.18} />
      <Rect x={cx - w / 2} y={cy + h / 2 - h * 0.065} width={w} height={h * 0.065} rx={4} fill="white" opacity={0.18} />
      <Ellipse cx={cx - w / 2} cy={cy} rx={7} ry={h * 0.3} fill="white" opacity={0.09} />
      <Ellipse cx={cx + w / 2} cy={cy} rx={7} ry={h * 0.3} fill="white" opacity={0.09} />
    </G>
  );
}

export function HeroIllustration() {
  const cx = W / 2;
  const cy = H * 0.5;

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>

      {/* Silhouette sachet au centre */}
      <Sachet cx={cx} cy={cy} w={W * 0.52} h={H * 0.62} />

      {/* ── Nuages ─────────────────────────────────────────────────────────── */}
      <Cloud x={W * 0.16} y={H * 0.18} s={1.2} op={0.72} />
      <Cloud x={W * 0.78} y={H * 0.13} s={0.9} op={0.62} />
      <Cloud x={W * 0.5}  y={H * 0.06} s={0.6} op={0.45} />
      <Cloud x={W * 0.22} y={H * 0.76} s={0.5} op={0.35} />
      <Cloud x={W * 0.8}  y={H * 0.8}  s={0.6} op={0.32} />

      {/* ── Gouttes d'eau ───────────────────────────────────────────────────── */}
      <Drop x={W * 0.1}  y={H * 0.42} r={13} op={0.65} />
      <Drop x={W * 0.88} y={H * 0.36} r={11} op={0.6} />
      <Drop x={W * 0.28} y={H * 0.23} r={9}  op={0.55} />
      <Drop x={W * 0.74} y={H * 0.63} r={10} op={0.52} />
      <Drop x={W * 0.63} y={H * 0.15} r={8}  op={0.5} />
      <Drop x={W * 0.15} y={H * 0.66} r={7}  op={0.45} />
      <Drop x={W * 0.83} y={H * 0.21} r={8}  op={0.45} />

      {/* ── Étoiles 5 branches ──────────────────────────────────────────────── */}
      <Star x={W * 0.07} y={H * 0.75} r={10} op={0.75} />
      <Star x={W * 0.9}  y={H * 0.56} r={12} op={0.7} />
      <Star x={W * 0.52} y={H * 0.88} r={9}  op={0.65} />
      <Star x={W * 0.18} y={H * 0.87} r={7}  op={0.55} />
      <Star x={W * 0.76} y={H * 0.29} r={8}  op={0.55} />
      <Star x={W * 0.4}  y={H * 0.1}  r={7}  op={0.5} />
      <Star x={W * 0.92} y={H * 0.84} r={6}  op={0.45} />

    </Svg>
  );
}
