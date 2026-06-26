export default function WristsCosmetic({ metrics }) {
  const { cx, shoulderY, armHeight } = metrics;
  const cuffY = shoulderY + 8 + armHeight - 8;

  return (
    <g stroke="#5ab4ff" strokeOpacity="0.6" strokeWidth="2.2" strokeLinecap="round">
      <line x1={cx - 48} y1={cuffY} x2={cx - 36} y2={cuffY} />
      <line x1={cx + 36} y1={cuffY} x2={cx + 48} y2={cuffY} />
    </g>
  );
}
