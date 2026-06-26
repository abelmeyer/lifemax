export default function WaistCosmetic({ metrics }) {
  const { cx, waistY } = metrics;

  return (
    <g>
      <rect x={cx - 28} y={waistY - 3} width={56} height={6} rx={2} fill="#5ab4ff" fillOpacity="0.5" />
      <rect x={cx - 4} y={waistY - 4} width={8} height={8} rx={1.5} fill="#0d0d12" stroke="#5ab4ff" strokeWidth="1.2" />
    </g>
  );
}
