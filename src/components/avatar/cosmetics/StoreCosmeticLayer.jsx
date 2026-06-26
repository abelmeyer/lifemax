import { COSMETIC_RENDERERS } from "./cosmeticRegistry";

export default function StoreCosmeticLayer({ item, metrics }) {
  const Renderer = COSMETIC_RENDERERS[item.category];
  if (!Renderer) return null;

  return (
    <g aria-label={item.name}>
      <Renderer metrics={metrics} />
    </g>
  );
}
