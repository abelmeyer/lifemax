// "Display" items don't sit on the body — they show as a small badge near
// the avatar instead (e.g. a trophy case).
export default function DisplayCosmetic({ metrics }) {
  const { cx } = metrics;

  return (
    <g transform={`translate(${cx + 72}, 16)`}>
      <rect x="-14" y="-10" width="28" height="22" rx="4" fill="#16161e" stroke="#5ab4ff" strokeOpacity="0.5" strokeWidth="1.2" />
      <path d="M -6 -4 L 0 2 L 6 -4" stroke="#5ab4ff" strokeOpacity="0.7" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </g>
  );
}
