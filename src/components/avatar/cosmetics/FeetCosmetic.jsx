export default function FeetCosmetic({ metrics }) {
  const { cx, hipY, legHeight } = metrics;
  const footY = hipY + legHeight + 1;

  return (
    <g fill="#5ab4ff" fillOpacity="0.5">
      <ellipse cx={cx - 12} cy={footY} rx={8} ry={4} />
      <ellipse cx={cx + 12} cy={footY} rx={8} ry={4} />
    </g>
  );
}
