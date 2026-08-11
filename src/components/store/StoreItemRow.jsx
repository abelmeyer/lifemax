import { SparkleIcon } from "../icons";
import ItemThumb from "../avatar/cosmetics/ItemThumb";

// One catalog row: thumbnail, name + slot tag + description, and the single
// action button whose meaning depends on ownership/affordability/prestige.
export default function StoreItemRow({
  item,
  owned,
  equipped,
  locked,
  canAfford,
  pending,
  justActioned,
  onBuy,
  onEquip,
  onUnequip,
}) {
  let label;
  let action;
  let color;
  let border;
  let disabled = pending;

  if (owned) {
    if (equipped) {
      label = "Equipped";
      action = onUnequip;
      color = "#34d399";
      border = "rgba(52,211,153,0.35)";
    } else {
      label = "Equip";
      action = onEquip;
      color = "#5ab4ff";
      border = "rgba(90,180,255,0.35)";
    }
  } else if (locked) {
    label = "Locked";
    action = undefined;
    color = "#6e7a8a";
    border = "rgba(255,255,255,0.07)";
    disabled = true;
  } else {
    label = null;
    action = onBuy;
    color = canAfford ? "#5ab4ff" : "#6e7a8a";
    border = "rgba(255,255,255,0.07)";
    disabled = disabled || !canAfford;
  }

  return (
    <div
      className="card-shadow flex items-center justify-between gap-3 rounded-card border border-border bg-surface p-4 transition-opacity duration-200"
      style={{ opacity: locked ? 0.5 : 1 }}
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[10px] border border-border">
        <ItemThumb item={item} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[13px] font-medium text-body">{item.name}</p>
          <span className="shrink-0 rounded-pill bg-white/[0.04] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted">
            {item.category}
          </span>
        </div>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{item.description}</p>
      </div>
      <button
        type="button"
        onClick={action}
        disabled={disabled}
        className={`flex shrink-0 items-center gap-1.5 rounded-btn border px-3 py-2 text-[12px] font-medium transition-colors duration-200 disabled:cursor-not-allowed active:scale-95 ${justActioned ? "pop-in" : ""}`}
        style={{ color, borderColor: border }}
      >
        {label ?? (
          <>
            <SparkleIcon width={12} height={12} />
            {item.cost_aura}
          </>
        )}
      </button>
    </div>
  );
}
