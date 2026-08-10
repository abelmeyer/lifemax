// Hair, face, and facial-hair layers for the customizable avatar. Everything
// is positioned off the same metrics object the body uses, so these layers
// stay glued to the head across all physique stages.
//
// Head geometry (from AvatarBody): center (cx, shoulderY - 24), radius 19.

function headCenter(metrics) {
  return { hx: metrics.cx, hy: metrics.shoulderY - 24, r: 19 };
}

// Long hair renders a back panel behind the torso plus front strands; every
// other style renders entirely in the front layer.
export function HairBack({ metrics, appearance }) {
  const { hx, hy } = headCenter(metrics);
  const { hairColor, hairStyle } = appearance;
  if (hairStyle !== "long") return null;

  return (
    <path
      d={`M ${hx - 20} ${hy - 10}
          Q ${hx - 24} ${hy + 18} ${hx - 21} ${hy + 44}
          Q ${hx - 14} ${hy + 50} ${hx - 8} ${hy + 46}
          L ${hx + 8} ${hy + 46}
          Q ${hx + 14} ${hy + 50} ${hx + 21} ${hy + 44}
          Q ${hx + 24} ${hy + 18} ${hx + 20} ${hy - 10}
          Q ${hx} ${hy - 26} ${hx - 20} ${hy - 10}
          Z`}
      fill={hairColor.base}
      stroke={hairColor.shine}
      strokeOpacity="0.25"
      strokeWidth="1"
    />
  );
}

function BuzzCut({ hx, hy, hairColor }) {
  return (
    <path
      d={`M ${hx - 18.4} ${hy - 3}
          Q ${hx - 18.4} ${hy - 19.5} ${hx} ${hy - 19.5}
          Q ${hx + 18.4} ${hy - 19.5} ${hx + 18.4} ${hy - 3}
          Q ${hx + 11} ${hy - 10.5} ${hx} ${hy - 11}
          Q ${hx - 11} ${hy - 10.5} ${hx - 18.4} ${hy - 3}
          Z`}
      fill={hairColor.base}
      fillOpacity="0.55"
    />
  );
}

function ShortHair({ hx, hy, hairColor }) {
  return (
    <g>
      <path
        d={`M ${hx - 19} ${hy - 1}
            Q ${hx - 19.5} ${hy - 20.5} ${hx} ${hy - 20.5}
            Q ${hx + 19.5} ${hy - 20.5} ${hx + 19} ${hy - 1}
            L ${hx + 16.5} ${hy - 1}
            Q ${hx + 16} ${hy - 12} ${hx + 6} ${hy - 13.5}
            Q ${hx - 8} ${hy - 15} ${hx - 16.5} ${hy - 7}
            L ${hx - 16.5} ${hy - 1}
            Z`}
        fill={hairColor.base}
      />
      <path
        d={`M ${hx - 13} ${hy - 16} Q ${hx - 2} ${hy - 19} ${hx + 9} ${hy - 15.5}`}
        fill="none"
        stroke={hairColor.shine}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
    </g>
  );
}

function CurlyHair({ hx, hy, hairColor }) {
  const curls = [
    { x: hx - 15, y: hy - 8, r: 6 },
    { x: hx - 9, y: hy - 14, r: 6.5 },
    { x: hx, y: hy - 16.5, r: 7 },
    { x: hx + 9, y: hy - 14, r: 6.5 },
    { x: hx + 15, y: hy - 8, r: 6 },
  ];
  return (
    <g>
      {curls.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={hairColor.base} />
      ))}
      <circle cx={hx - 6} cy={hy - 15} r="1.6" fill={hairColor.shine} fillOpacity="0.55" />
      <circle cx={hx + 7} cy={hy - 13} r="1.4" fill={hairColor.shine} fillOpacity="0.55" />
      <circle cx={hx + 1} cy={hy - 18} r="1.5" fill={hairColor.shine} fillOpacity="0.55" />
    </g>
  );
}

function LongHairFront({ hx, hy, hairColor }) {
  return (
    <g>
      <path
        d={`M ${hx - 19} ${hy + 2}
            Q ${hx - 20} ${hy - 20.5} ${hx} ${hy - 20.5}
            Q ${hx + 20} ${hy - 20.5} ${hx + 19} ${hy + 2}
            L ${hx + 15.5} ${hy + 2}
            Q ${hx + 16} ${hy - 12} ${hx + 5} ${hy - 14}
            Q ${hx - 9} ${hy - 15.5} ${hx - 15.5} ${hy - 5}
            L ${hx - 15.5} ${hy + 2}
            Z`}
        fill={hairColor.base}
      />
      {/* face-framing strands falling past the jaw */}
      <path
        d={`M ${hx - 19} ${hy - 2} Q ${hx - 21} ${hy + 14} ${hx - 17} ${hy + 24}
            L ${hx - 14} ${hy + 22} Q ${hx - 16.5} ${hy + 10} ${hx - 15.5} ${hy - 2} Z`}
        fill={hairColor.base}
      />
      <path
        d={`M ${hx + 19} ${hy - 2} Q ${hx + 21} ${hy + 14} ${hx + 17} ${hy + 24}
            L ${hx + 14} ${hy + 22} Q ${hx + 16.5} ${hy + 10} ${hx + 15.5} ${hy - 2} Z`}
        fill={hairColor.base}
      />
      <path
        d={`M ${hx - 12} ${hy - 16} Q ${hx - 1} ${hy - 19} ${hx + 10} ${hy - 15}`}
        fill="none"
        stroke={hairColor.shine}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
    </g>
  );
}

function BunHair({ hx, hy, hairColor }) {
  return (
    <g>
      <circle cx={hx} cy={hy - 23.5} r="6.2" fill={hairColor.base} />
      <path
        d={`M ${hx - 5} ${hy - 21} Q ${hx} ${hy - 24.5} ${hx + 5} ${hy - 21}`}
        fill="none"
        stroke={hairColor.shine}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
      <path
        d={`M ${hx - 18.7} ${hy - 2}
            Q ${hx - 19} ${hy - 20} ${hx} ${hy - 20}
            Q ${hx + 19} ${hy - 20} ${hx + 18.7} ${hy - 2}
            Q ${hx + 12} ${hy - 11} ${hx} ${hy - 11.5}
            Q ${hx - 12} ${hy - 11} ${hx - 18.7} ${hy - 2}
            Z`}
        fill={hairColor.base}
      />
    </g>
  );
}

function BaldHead({ hx, hy }) {
  return <ellipse cx={hx - 7} cy={hy - 12} rx="5" ry="2.6" fill="#ffffff" fillOpacity="0.09" />;
}

const HAIR_FRONT = {
  bald: BaldHead,
  buzz: BuzzCut,
  short: ShortHair,
  curly: CurlyHair,
  long: LongHairFront,
  bun: BunHair,
};

export function HairFront({ metrics, appearance }) {
  const { hx, hy } = headCenter(metrics);
  const Style = HAIR_FRONT[appearance.hairStyle] ?? ShortHair;
  return <Style hx={hx} hy={hy} hairColor={appearance.hairColor} />;
}

// Eyes, brows, ears, and a neutral mouth — drawn under hair and facial hair.
export function Face({ metrics, appearance }) {
  const { hx, hy } = headCenter(metrics);
  const { skin } = appearance;
  return (
    <g>
      <ellipse cx={hx - 18.5} cy={hy + 1} rx="2.8" ry="4.2" fill={skin.base} stroke={skin.line} strokeWidth="1.2" />
      <ellipse cx={hx + 18.5} cy={hy + 1} rx="2.8" ry="4.2" fill={skin.base} stroke={skin.line} strokeWidth="1.2" />
      <ellipse cx={hx - 6.5} cy={hy - 0.5} rx="1.7" ry="2.5" fill="#1f232b" />
      <ellipse cx={hx + 6.5} cy={hy - 0.5} rx="1.7" ry="2.5" fill="#1f232b" />
      <path
        d={`M ${hx - 9.5} ${hy - 6} Q ${hx - 6.5} ${hy - 7.5} ${hx - 3.5} ${hy - 6}`}
        fill="none"
        stroke={skin.line}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d={`M ${hx + 3.5} ${hy - 6} Q ${hx + 6.5} ${hy - 7.5} ${hx + 9.5} ${hy - 6}`}
        fill="none"
        stroke={skin.line}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d={`M ${hx - 3.5} ${hy + 10.5} Q ${hx} ${hy + 12} ${hx + 3.5} ${hy + 10.5}`}
        fill="none"
        stroke={skin.line}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </g>
  );
}

function Stubble({ hx, hy, hairColor }) {
  return (
    <path
      d={`M ${hx - 17.5} ${hy + 6}
          Q ${hx - 15} ${hy + 18.2} ${hx} ${hy + 18.8}
          Q ${hx + 15} ${hy + 18.2} ${hx + 17.5} ${hy + 6}
          Q ${hx + 13} ${hy + 13.5} ${hx} ${hy + 14}
          Q ${hx - 13} ${hy + 13.5} ${hx - 17.5} ${hy + 6}
          Z`}
      fill={hairColor.base}
      fillOpacity="0.3"
    />
  );
}

function Mustache({ hx, hy, hairColor }) {
  return (
    <path
      d={`M ${hx - 7.5} ${hy + 9.5}
          Q ${hx} ${hy + 6} ${hx + 7.5} ${hy + 9.5}
          Q ${hx + 4} ${hy + 11} ${hx} ${hy + 9}
          Q ${hx - 4} ${hy + 11} ${hx - 7.5} ${hy + 9.5}
          Z`}
      fill={hairColor.base}
    />
  );
}

function Beard({ hx, hy, hairColor }) {
  return (
    <g>
      <path
        d={`M ${hx - 18} ${hy + 2}
            Q ${hx - 17} ${hy + 20} ${hx} ${hy + 21.5}
            Q ${hx + 17} ${hy + 20} ${hx + 18} ${hy + 2}
            L ${hx + 14.5} ${hy + 2}
            Q ${hx + 13.5} ${hy + 12} ${hx + 7} ${hy + 13.5}
            L ${hx + 6} ${hy + 8.5} L ${hx - 6} ${hy + 8.5} L ${hx - 7} ${hy + 13.5}
            Q ${hx - 13.5} ${hy + 12} ${hx - 14.5} ${hy + 2}
            Z`}
        fill={hairColor.base}
      />
      <Mustache hx={hx} hy={hy} hairColor={hairColor} />
    </g>
  );
}

const FACIAL_RENDERERS = {
  stubble: Stubble,
  mustache: Mustache,
  beard: Beard,
};

export function FacialHairLayer({ metrics, appearance }) {
  const { hx, hy } = headCenter(metrics);
  const Renderer = FACIAL_RENDERERS[appearance.facialHair];
  if (!Renderer) return null;
  return <Renderer hx={hx} hy={hy} hairColor={appearance.hairColor} />;
}
