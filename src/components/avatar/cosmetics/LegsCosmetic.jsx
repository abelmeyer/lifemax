export default function LegsCosmetic({ metrics }) {
  const { cx, hipY, legHeight } = metrics;
  const kneeY = hipY + legHeight * 0.55;

  return (
    <g stroke="#5ab4ff" strokeOpacity="0.55" strokeWidth="2" fill="none">
      <rect x={cx - 26} y={kneeY - 6} width={16} height={14} rx={5} />
      <rect x={cx + 10} y={kneeY - 6} width={16} height={14} rx={5} />
    </g>
  );
}
