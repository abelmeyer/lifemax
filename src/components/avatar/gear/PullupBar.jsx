export default function PullupBar({ metrics }) {
  const { cx, shoulderY, hipY, legHeight } = metrics;
  const barY = shoulderY - 50;
  const span = 70;
  const groundY = hipY + legHeight + 4;

  return (
    <g stroke="#6e7a8a" strokeWidth="2.5" strokeLinecap="round">
      <line x1={cx - span} y1={groundY} x2={cx - span} y2={barY} />
      <line x1={cx + span} y1={groundY} x2={cx + span} y2={barY} />
      <line x1={cx - span - 6} y1={barY} x2={cx + span + 6} y2={barY} stroke="#5ab4ff" strokeWidth="3.5" />
    </g>
  );
}
