import { COSMETIC_RENDERERS } from "./cosmeticRegistry";
import { ITEM_ART } from "./itemArt";

// Per-item art first (keyed by store_items.name); generic slot placeholder
// as a fallback so new catalog rows render something before art exists.
export default function StoreCosmeticLayer({ item, metrics }) {
  const Renderer = ITEM_ART[item.name] ?? COSMETIC_RENDERERS[item.category];
  if (!Renderer) return null;

  return (
    <g aria-label={item.name}>
      <Renderer metrics={metrics} />
    </g>
  );
}
