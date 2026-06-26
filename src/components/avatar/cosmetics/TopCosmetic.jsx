// Placeholder for store items in the "Top" slot. Swap the fill for a real
// <image href={item.asset_path}> once Sprint 7 art lands — the registry
// lookup in cosmeticRegistry.js stays the same either way.
export default function TopCosmetic({ metrics }) {
  const { cx, shoulderY, waistY } = metrics;
  const top = shoulderY + 2;
  const bottom = waistY - 4;

  return (
    <path
      d={`M ${cx - 27} ${top} Q ${cx - 27} ${top - 7} ${cx - 17} ${top - 7}
          L ${cx + 17} ${top - 7} Q ${cx + 27} ${top - 7} ${cx + 27} ${top}
          L ${cx + 22} ${bottom} L ${cx - 22} ${bottom} Z`}
      fill="#5ab4ff"
      fillOpacity="0.16"
      stroke="#5ab4ff"
      strokeOpacity="0.45"
      strokeWidth="1.4"
    />
  );
}
