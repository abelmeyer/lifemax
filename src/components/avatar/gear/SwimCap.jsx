export default function SwimCap({ metrics }) {
  const { cx, shoulderY } = metrics;
  const headCy = shoulderY - 24;

  return (
    <g>
      <path
        d={`M ${cx - 19} ${headCy + 2} Q ${cx - 19} ${headCy - 22} ${cx} ${headCy - 22} Q ${cx + 19} ${headCy - 22} ${cx + 19} ${headCy + 2} Z`}
        fill="#5ab4ff"
        fillOpacity="0.9"
      />
      <ellipse cx={cx - 7} cy={headCy + 1} rx="5" ry="4" fill="#0d0d12" stroke="#78c6ff" strokeWidth="1.2" />
      <ellipse cx={cx + 7} cy={headCy + 1} rx="5" ry="4" fill="#0d0d12" stroke="#78c6ff" strokeWidth="1.2" />
      <line x1={cx - 2} y1={headCy + 1} x2={cx + 2} y2={headCy + 1} stroke="#78c6ff" strokeWidth="1.2" />
    </g>
  );
}
