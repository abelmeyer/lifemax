import { COSMETIC_RENDERERS } from "./cosmeticRegistry";
import { ITEM_ART } from "./itemArt";

// Per-item art first (keyed by store_items.name); generic slot placeholder
// as a fallback so new catalog rows render something before art exists.
export default function StoreCosmeticLayer({ item, metrics, geo }) {
  const Renderer =
    Object.prototype.hasOwnProperty.call(ITEM_ART, item.name)
      ? ITEM_ART[item.name]
      : Object.prototype.hasOwnProperty.call(COSMETIC_RENDERERS, item.category)
        ? COSMETIC_RENDERERS[item.category]
        : null;
  if (!Renderer) return null;

  return (
    <g aria-label={item.name}>
      <Renderer metrics={metrics} geo={geo} />
    </g>
  );
}
