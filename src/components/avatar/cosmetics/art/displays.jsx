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

export function MedalRack({ metrics }) {
  const { cx } = metrics;
  const x = cx + 62;
  const railY = 36;
  // Ribbon lengths are staggered so three discs of near-identical size still
  // read as three medals and not as one blob at thumbnail scale.
  const medals = [
    [x - 13, 22, "#e3bd54", "#a8801f", "#a92b3f"],
    [x, 31, "#c9cfd9", "#8b919c", "#2e6cab"],
    [x + 13, 25, "#c07a3e", "#8a5227", "#3f8f5f"],
  ];

  return (
    <g>
      <rect x={x - 22} y="18" width="44" height="16" rx="3" fill="#3a2a1c" stroke="#5d452c" strokeWidth="1.4" />
      <line x1={x - 17} y1="26" x2={x + 17} y2="26" stroke="#5d452c" strokeWidth="1.1" />
      <rect x={x - 20} y={railY - 2} width="40" height="4" rx="2" fill="#8b919c" stroke="#6a707a" strokeWidth="1" />
      <circle cx={x - 20} cy={railY} r="2.4" fill="#b9bec8" />
      <circle cx={x + 20} cy={railY} r="2.4" fill="#b9bec8" />
      {medals.map(([mx, len, face, rim, ribbon], i) => {
        const top = railY + 1;
        const cyM = top + len + 6.5;
        return (
          <g key={i}>
            <path d={`M ${mx - 5} ${top} L ${mx + 5} ${top} L ${mx + 3} ${top + len} L ${mx - 3} ${top + len} Z`} fill={ribbon} stroke="#1a1a24" strokeWidth="0.8" />
            <line x1={mx} y1={top + 2} x2={mx} y2={top + len - 2} stroke="#0d0d12" strokeOpacity="0.35" strokeWidth="1" />
            <circle cx={mx} cy={cyM} r="6.6" fill={face} stroke={rim} strokeWidth="1.2" />
            <circle cx={mx} cy={cyM} r="3.6" fill="none" stroke={rim} strokeWidth="0.9" />
            <circle cx={mx} cy={cyM} r="1.5" fill={rim} />
          </g>
        );
      })}
      <g fill="#b9bec8" fillOpacity="0.55">
        <circle cx={x - 13} cy={railY} r="1.3" />
        <circle cx={x} cy={railY} r="1.3" />
        <circle cx={x + 13} cy={railY} r="1.3" />
      </g>
    </g>
  );
}

export function PRBoard({ metrics }) {
  const { cx } = metrics;
  const x = cx + 62;
  const bx = x - 22;
  const by = 16;
  const bw = 44;
  const bh = 76;
  const rows = [
    ["SQ", "405", "#dfe9e2"],
    ["BP", "275", "#dfe9e2"],
    ["DL", "495", "#ffd88a"],
  ];

  return (
    <g>
      <rect x={bx} y={by} width={bw} height={bh} rx="3" fill="#5c4126" stroke="#3e2b1c" strokeWidth="1.4" />
      <rect x={bx + 3.5} y={by + 3.5} width={bw - 7} height={bh - 15} rx="1.5" fill="#1a2620" stroke="#0f1a16" strokeWidth="1" />
      <text x={x} y={by + 13} textAnchor="middle" fontSize="6.4" fontWeight="600" letterSpacing="0.5" fill="#eaf3ed" fillOpacity="0.92">
        PR BOARD
      </text>
      <line x1={bx + 8} y1={by + 17.5} x2={bx + bw - 8} y2={by + 17.5} stroke="#eaf3ed" strokeOpacity="0.4" strokeWidth="1" />
      {rows.map(([lift, load, ink], i) => {
        const ry = by + 30 + i * 13;
        return (
          <g key={lift} transform={`rotate(${i % 2 ? 0.9 : -1.2} ${x} ${ry})`}>
            <text x={bx + 7} y={ry} fontSize="7" fill={ink} fillOpacity="0.85">
              {lift}
            </text>
            <text x={bx + bw - 7} y={ry} textAnchor="end" fontSize="7.5" fontWeight="600" fill={ink} fillOpacity="0.95">
              {load}
            </text>
          </g>
        );
      })}
      <line x1={bx + bw - 21} y1={by + 58} x2={bx + bw - 7} y2={by + 58} stroke="#ffd88a" strokeOpacity="0.75" strokeWidth="1.1" />
      <ellipse cx={bx + 13} cy={by + 52} rx="9" ry="4" fill="#eaf3ed" opacity="0.05" />
      {/* chalk ledge */}
      <rect x={bx + 3.5} y={by + bh - 11} width={bw - 7} height="4" rx="1.2" fill="#6e5030" stroke="#3e2b1c" strokeWidth="0.9" />
      <rect x={bx + 8} y={by + bh - 14} width="9" height="3" rx="1.5" fill="#eef4f0" />
      <rect x={bx + bw - 20} y={by + bh - 15} width="12" height="4" rx="1" fill="#3d3d4e" stroke="#5a5a6e" strokeWidth="0.8" />
    </g>
  );
}

export function HallOfFamePlaque({ metrics }) {
  const { cx } = metrics;
  const x = cx + 62;
  const y0 = 20;
  const y1 = 94;
  const shell = (inset) =>
    `M ${x - 21 + inset} ${y0 + 10}
     Q ${x - 21 + inset} ${y0 + 1 + inset} ${x - 11} ${y0 - 1 + inset}
     Q ${x} ${y0 - 5 + inset} ${x + 11} ${y0 - 1 + inset}
     Q ${x + 21 - inset} ${y0 + 1 + inset} ${x + 21 - inset} ${y0 + 10}
     L ${x + 21 - inset} ${y1 - 5}
     Q ${x + 21 - inset} ${y1 - inset} ${x + 16} ${y1 - inset}
     L ${x - 16} ${y1 - inset}
     Q ${x - 21 + inset} ${y1 - inset} ${x - 21 + inset} ${y1 - 5}
     Z`;

  return (
    <g>
      <path d={shell(0)} fill="#8a5f2b" stroke="#e3bd54" strokeWidth="1.6" />
      <path d={shell(4)} fill="#6b4620" stroke="#c69a2e" strokeWidth="1" />
      {/* laurel flanking the star — the crest that reads cast, not printed */}
      <g fill="none" stroke="#e3bd54" strokeWidth="1.2" strokeLinecap="round">
        <path d={`M ${x - 9} ${y0 + 8} q -5 7 -1 15`} />
        <path d={`M ${x + 9} ${y0 + 8} q 5 7 1 15`} />
      </g>
      <g fill="#e3bd54" fillOpacity="0.85">
        <ellipse cx={x - 12.5} cy={y0 + 12} rx="2.4" ry="1.3" transform={`rotate(-40 ${x - 12.5} ${y0 + 12})`} />
        <ellipse cx={x - 12.5} cy={y0 + 18} rx="2.4" ry="1.3" transform={`rotate(-15 ${x - 12.5} ${y0 + 18})`} />
        <ellipse cx={x + 12.5} cy={y0 + 12} rx="2.4" ry="1.3" transform={`rotate(40 ${x + 12.5} ${y0 + 12})`} />
        <ellipse cx={x + 12.5} cy={y0 + 18} rx="2.4" ry="1.3" transform={`rotate(15 ${x + 12.5} ${y0 + 18})`} />
      </g>
      <path
        d={`M ${x} ${y0 + 8} L ${x + 2.1} ${y0 + 13.4} L ${x + 7.6} ${y0 + 13.8} L ${x + 3.4} ${y0 + 17.4}
            L ${x + 4.7} ${y0 + 22.8} L ${x} ${y0 + 19.8} L ${x - 4.7} ${y0 + 22.8} L ${x - 3.4} ${y0 + 17.4}
            L ${x - 7.6} ${y0 + 13.8} L ${x - 2.1} ${y0 + 13.4} Z`}
        fill="#fdf3d0"
        stroke="#c69a2e"
        strokeWidth="0.7"
      />
      {[0, 1, 2].map((i) => {
        const ry = y0 + 32 + i * 11;
        const w = 26 - i * 4;
        return (
          <g key={i}>
            <rect x={x - w / 2} y={ry} width={w} height="6" rx="1.4" fill="#573a17" stroke="#c69a2e" strokeWidth="0.8" />
            <rect x={x - w / 2 + 1.5} y={ry + 1.2} width={w - 3} height="1.4" rx="0.7" fill="#d9b25c" fillOpacity="0.7" />
          </g>
        );
      })}
      <path
        d={`M ${x - 15} ${y1 - 18} L ${x + 15} ${y1 - 18} L ${x + 15} ${y1 - 10} L ${x} ${y1 - 6} L ${x - 15} ${y1 - 10} Z`}
        fill="#c69a2e"
        stroke="#8f6c1c"
        strokeWidth="1"
      />
      <line x1={x - 9} y1={y1 - 14} x2={x + 9} y2={y1 - 14} stroke="#fdf3d0" strokeOpacity="0.75" strokeWidth="1.1" />
      <g fill="#e3bd54">
        <circle cx={x - 16} cy={y0 + 9} r="1.7" />
        <circle cx={x + 16} cy={y0 + 9} r="1.7" />
        <circle cx={x - 16} cy={y1 - 6} r="1.7" />
        <circle cx={x + 16} cy={y1 - 6} r="1.7" />
      </g>
      <path d={`M ${x - 19} ${y0 + 14} L ${x - 6} ${y0 + 2} L ${x - 1} ${y0 + 2} L ${x - 19} ${y0 + 22} Z`} fill="#fff3c9" fillOpacity="0.12" />
    </g>
  );
}
