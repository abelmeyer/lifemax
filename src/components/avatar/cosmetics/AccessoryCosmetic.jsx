export default function AccessoryCosmetic({ metrics }) {
  const { cx, waistY, hipY } = metrics;
  const y = (waistY + hipY) / 2;

  return (
    <rect
      x={cx + 22}
      y={y - 6}
      width={12}
      height={16}
      rx={3}
      fill="#5ab4ff"
      fillOpacity="0.4"
      stroke="#5ab4ff"
      strokeOpacity="0.6"
      strokeWidth="1.2"
    />
  );
}
