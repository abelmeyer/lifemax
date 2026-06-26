export default function BottomCosmetic({ metrics }) {
  const { cx, waistY, hipY, legHeight } = metrics;
  const top = waistY + 3;
  const bottom = hipY + legHeight * 0.35;

  return (
    <rect
      x={cx - 30}
      y={top}
      width={60}
      height={bottom - top}
      rx={7}
      fill="#5ab4ff"
      fillOpacity="0.14"
      stroke="#5ab4ff"
      strokeOpacity="0.4"
      strokeWidth="1.4"
    />
  );
}
