export default function ChestArmDefinition({ metrics }) {
  const { cx, shoulderY, waistY } = metrics;
  const chestY = shoulderY + 16;

  return (
    <g stroke="#5ab4ff" strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" fill="none">
      <path d={`M ${cx - 24} ${chestY} Q ${cx - 12} ${chestY + 10} ${cx - 3} ${chestY + 2}`} />
      <path d={`M ${cx + 24} ${chestY} Q ${cx + 12} ${chestY + 10} ${cx + 3} ${chestY + 2}`} />
      <path d={`M ${cx - 30} ${shoulderY + 24} Q ${cx - 34} ${(shoulderY + waistY) / 2} ${cx - 28} ${waistY - 14}`} />
      <path d={`M ${cx + 30} ${shoulderY + 24} Q ${cx + 34} ${(shoulderY + waistY) / 2} ${cx + 28} ${waistY - 14}`} />
    </g>
  );
}
