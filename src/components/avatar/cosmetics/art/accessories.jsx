export function ChalkBag({ metrics }) {
  const { cx, hipY } = metrics;
  const bx = cx + 38;
  const by = hipY - 6;
  return (
    <g>
      <path d={`M ${bx - 6} ${by - 4} Q ${cx + 26} ${by - 10} ${cx + 20} ${by - 12}`} fill="none" stroke="#6e5a3f" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d={`M ${bx - 8} ${by}
            Q ${bx - 9} ${by - 5} ${bx - 5} ${by - 5}
            L ${bx + 5} ${by - 5}
            Q ${bx + 9} ${by - 5} ${bx + 8} ${by}
            Q ${bx + 10} ${by + 16} ${bx} ${by + 17}
            Q ${bx - 10} ${by + 16} ${bx - 8} ${by}
            Z`}
        fill="#d8d1c2"
        stroke="#b3a98f"
        strokeWidth="1.3"
      />
      <path d={`M ${bx - 7} ${by - 1} Q ${bx} ${by + 2} ${bx + 7} ${by - 1}`} fill="none" stroke="#b3a98f" strokeWidth="1.2" />
      <circle cx={bx - 3} cy={by - 8} r="1.6" fill="#eef0f4" opacity="0.8" />
      <circle cx={bx + 4} cy={by - 11} r="1.1" fill="#eef0f4" opacity="0.6" />
      <circle cx={bx + 1} cy={by - 14} r="0.8" fill="#eef0f4" opacity="0.45" />
    </g>
  );
}

// TODO(art): Gym Towel — placeholder, renders nothing until drawn.
export function GymTowel() {
  return null;
}

// TODO(art): Water Bottle — placeholder, renders nothing until drawn.
export function WaterBottle() {
  return null;
}

// TODO(art): Weighted Vest — placeholder, renders nothing until drawn.
export function WeightedVest() {
  return null;
}

// TODO(art): Championship Medal — placeholder, renders nothing until drawn.
export function ChampionshipMedal() {
  return null;
}
