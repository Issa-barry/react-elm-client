import { Dimensions } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

const { width: W, height: SCREEN_H } = Dimensions.get('window');
const H = SCREEN_H * 0.58;

// ── Cloud : cercles qui se chevauchent ─────────────────────────────────────
function Cloud({ x, y, s = 1, op = 0.8 }: { x: number; y: number; s?: number; op?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
      <Circle cx={0}   cy={0}   r={22} fill="white" />
      <Circle cx={32}  cy={5}   r={17} fill="white" />
      <Circle cx={-22} cy={8}   r={14} fill="white" />
      <Circle cx={14}  cy={-12} r={16} fill="white" />
      <Rect   x={-36} y={8}  width={85} height={22} fill="white" />
    </G>
  );
}

// ── Goutte d'eau ───────────────────────────────────────────────────────────
function Drop({ x, y, r = 10, op = 0.75 }: { x: number; y: number; r?: number; op?: number }) {
  const d = `M 0 ${-r} C ${r * 0.85} ${-r * 0.3} ${r * 0.95} ${r * 0.4} 0 ${r} C ${-r * 0.95} ${r * 0.4} ${-r * 0.85} ${-r * 0.3} 0 ${-r} Z`;
  return (
    <G transform={`translate(${x},${y})`} opacity={op}>
      <Path d={d} fill="white" />
    </G>
  );
}

// ── Étoile 4 branches ─────────────────────────────────────────────────────
function Sparkle({ x, y, r = 8, op = 0.8 }: { x: number; y: number; r?: number; op?: number }) {
  const d = `M 0 ${-r} L ${r * 0.22} ${-r * 0.22} L ${r} 0 L ${r * 0.22} ${r * 0.22} L 0 ${r} L ${-r * 0.22} ${r * 0.22} L ${-r} 0 L ${-r * 0.22} ${-r * 0.22} Z`;
  return (
    <G transform={`translate(${x},${y})`} opacity={op}>
      <Path d={d} fill="white" />
    </G>
  );
}

// ── Silhouette du sachet (élément central) ─────────────────────────────────
function Sachet({ cx, cy, w, h }: { cx: number; cy: number; w: number; h: number }) {
  return (
    <G>
      {/* Corps principal */}
      <Rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={w * 0.09} fill="white" opacity={0.08} />
      {/* Scellé haut */}
      <Rect x={cx - w / 2} y={cy - h / 2} width={w} height={h * 0.07} rx={4} fill="white" opacity={0.2} />
      {/* Scellé bas */}
      <Rect x={cx - w / 2} y={cy + h / 2 - h * 0.07} width={w} height={h * 0.07} rx={4} fill="white" opacity={0.2} />
      {/* Soufflets latéraux */}
      <Ellipse cx={cx - w / 2} cy={cy} rx={8} ry={h * 0.3} fill="white" opacity={0.1} />
      <Ellipse cx={cx + w / 2} cy={cy} rx={8} ry={h * 0.3} fill="white" opacity={0.1} />
      {/* Reflets */}
      <Rect x={cx - w * 0.38} y={cy - h * 0.35} width={w * 0.12} height={h * 0.5} rx={6} fill="white" opacity={0.05} />
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

      {/* ── Nuages ── */}
      <Cloud x={W * 0.13} y={H * 0.17} s={1.2} op={0.7} />
      <Cloud x={W * 0.72} y={H * 0.12} s={0.9} op={0.6} />
      <Cloud x={W * 0.48} y={H * 0.05} s={0.6} op={0.45} />
      <Cloud x={W * 0.28} y={H * 0.72} s={0.55} op={0.35} />
      <Cloud x={W * 0.76} y={H * 0.78} s={0.65} op={0.32} />

      {/* ── Gouttes ── */}
      <Drop x={W * 0.1}  y={H * 0.42} r={14} op={0.65} />
      <Drop x={W * 0.87} y={H * 0.36} r={11} op={0.6} />
      <Drop x={W * 0.27} y={H * 0.23} r={9}  op={0.55} />
      <Drop x={W * 0.73} y={H * 0.62} r={10} op={0.5} />
      <Drop x={W * 0.62} y={H * 0.17} r={8}  op={0.5} />
      <Drop x={W * 0.16} y={H * 0.65} r={7}  op={0.45} />
      <Drop x={W * 0.82} y={H * 0.18} r={8}  op={0.45} />

      {/* ── Étoiles ── */}
      <Sparkle x={W * 0.07} y={H * 0.75} r={9}  op={0.75} />
      <Sparkle x={W * 0.9}  y={H * 0.55} r={11} op={0.7} />
      <Sparkle x={W * 0.52} y={H * 0.88} r={8}  op={0.65} />
      <Sparkle x={W * 0.18} y={H * 0.87} r={6}  op={0.55} />
      <Sparkle x={W * 0.76} y={H * 0.28} r={7}  op={0.55} />
      <Sparkle x={W * 0.4}  y={H * 0.1}  r={6}  op={0.5} />
      <Sparkle x={W * 0.93} y={H * 0.82} r={5}  op={0.45} />

    </Svg>
  );
}
