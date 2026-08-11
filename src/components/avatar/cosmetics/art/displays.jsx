// Display items sit beside the avatar, not on the body.

export function TrophyCase({ metrics }) {
  const { cx } = metrics;
  const x = cx + 62;

  const trophy = (tx, ty, color) => (
    <g transform={`translate(${tx}, ${ty})`}>
      <path d="M -4 0 L 4 0 L 3 6 Q 0 8.5 -3 6 Z" fill={color} />
      <path d="M -4 1 Q -7 2 -5 5 M 4 1 Q 7 2 5 5" stroke={color} strokeWidth="1.1" fill="none" />
      <rect x="-1.2" y="8" width="2.4" height="2.5" fill={color} />
      <rect x="-3.5" y="10.5" width="7" height="2" rx="0.6" fill={color} />
    </g>
  );

  return (
    <g>
      <rect x={x - 20} y="18" width="40" height="76" rx="6" fill="#14141c" stroke="#3d3d4e" strokeWidth="1.4" />
      <rect x={x - 20} y="18" width="40" height="76" rx="6" fill="none" stroke="#5ab4ff" strokeOpacity="0.25" strokeWidth="1.4" />
      <line x1={x - 16} y1="44" x2={x + 16} y2="44" stroke="#3d3d4e" strokeWidth="1.3" />
      <line x1={x - 16} y1="69" x2={x + 16} y2="69" stroke="#3d3d4e" strokeWidth="1.3" />
      {trophy(x - 8, 30, "#e3bd54")}
      {trophy(x + 8, 30, "#b9bec8")}
      {trophy(x, 55, "#c69a2e")}
      <ellipse cx={x} cy="86" rx="10" ry="2.5" fill="#5ab4ff" opacity="0.12" />
      <path d={`M ${x - 5} 80 L ${x + 5} 80 L ${x + 4} 84 L ${x - 4} 84 Z`} fill="#e3bd54" opacity="0.9" />
    </g>
  );
}

// TODO(art): Medal Rack — placeholder, renders nothing until drawn.
export function MedalRack() {
  return null;
}

// TODO(art): PR Board — placeholder, renders nothing until drawn.
export function PRBoard() {
  return null;
}

// TODO(art): Hall of Fame Plaque — placeholder, renders nothing until drawn.
export function HallOfFamePlaque() {
  return null;
}
