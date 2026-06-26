export default function SixPack({ metrics }) {
  const { cx, shoulderY, waistY } = metrics;
  const top = shoulderY + 22;
  const bottom = waistY - 6;
  const rowGap = (bottom - top) / 3;

  return (
    <g stroke="#5ab4ff" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round">
      <line x1={cx} y1={top} x2={cx} y2={bottom} />
      {[0, 1, 2].map((i) => (
        <line key={i} x1={cx - 9} y1={top + rowGap * i + 4} x2={cx + 9} y2={top + rowGap * i + 4} />
      ))}
    </g>
  );
}
