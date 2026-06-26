export default function SitupBench({ metrics }) {
  const { cx, hipY, legHeight } = metrics;
  const benchX = cx + 95;
  const benchY = hipY + legHeight - 18;

  return (
    <g stroke="#6e7a8a" strokeWidth="2" strokeLinecap="round" fill="none">
      <rect x={benchX} y={benchY} width="46" height="9" rx="3" fill="#1a1a23" stroke="#3a3a48" />
      <line x1={benchX + 6} y1={benchY + 9} x2={benchX + 6} y2={benchY + 24} />
      <line x1={benchX + 40} y1={benchY + 9} x2={benchX + 40} y2={benchY + 24} />
      <rect
        x={benchX - 4}
        y={benchY - 18}
        width="14"
        height="18"
        rx="3"
        fill="#1a1a23"
        stroke="#3a3a48"
        transform={`rotate(-25 ${benchX + 3} ${benchY})`}
      />
    </g>
  );
}
