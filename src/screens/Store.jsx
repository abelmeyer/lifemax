import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScreenHeader from "../components/ScreenHeader";
import { ChevronLeftIcon, SparkleIcon, StarIcon } from "../components/icons";
import { useAuth } from "../lib/AuthContext";
import { fetchEconomy, fetchStoreItems, fetchOwnedItems, purchaseItem } from "../lib/economy";

const TIER_LABELS = {
  1: "Basic Fits",
  3: "Gear",
  5: "Premium",
  10: "Exclusive",
};

export default function Store() {
  const { user } = useAuth();
  const [economy, setEconomy] = useState(null);
  const [items, setItems] = useState([]);
  const [ownedIds, setOwnedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [econ, storeItems, owned] = await Promise.all([
        fetchEconomy(user.id),
        fetchStoreItems(),
        fetchOwnedItems(user.id),
      ]);
      if (!mounted) return;
      setEconomy(econ);
      setItems(storeItems);
      setOwnedIds(new Set(owned.map((o) => o.item_id)));
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [user.id]);

  async function handleBuy(item) {
    setError(null);
    setPendingId(item.id);
    try {
      const updated = await purchaseItem(user.id, item, economy);
      setEconomy(updated);
      setOwnedIds((prev) => new Set([...prev, item.id]));
    } catch (e) {
      setError(e.message);
    } finally {
      setPendingId(null);
    }
  }

  if (loading) {
    return (
      <>
        <ScreenHeader title="Store" subtitle="Spend aura on cosmetics, unlocked by prestige." />
        <div className="flex justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      </>
    );
  }

  const tiers = [1, 3, 5, 10];
  const grouped = tiers.map((tier) => ({
    tier,
    label: TIER_LABELS[tier],
    items: items.filter((i) => i.required_prestige === tier),
  }));

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/"
          className="flex h-9 w-9 items-center justify-center rounded-button border border-border bg-surface text-muted transition-colors duration-200 hover:text-body"
        >
          <ChevronLeftIcon width={18} height={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-body">Store</h1>
          <p className="mt-1 text-[13px] text-muted leading-relaxed">Spend aura on cosmetics, unlocked by prestige.</p>
        </div>
      </div>

      <div
        className="mb-6 flex items-center justify-between rounded-card border border-border bg-surface px-5 py-4"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
      >
        <div className="flex items-center gap-2 text-accent">
          <SparkleIcon width={18} height={18} />
          <span className="font-mono text-[20px] font-semibold">{economy.aura_balance}</span>
          <span className="text-[12px] text-muted">aura</span>
        </div>
        <div className="flex items-center gap-2 text-body">
          <StarIcon width={16} height={16} />
          <span className="font-mono text-[15px]">Prestige {economy.prestige_level}</span>
        </div>
      </div>

      {error && (
        <div
          className="fade-in mb-4 rounded-card border px-4 py-3 text-[13px]"
          style={{ borderColor: "rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.08)", color: "#f87171" }}
        >
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {grouped.map(({ tier, label, items: tierItems }) => {
          const locked = economy.prestige_level < tier;
          return (
            <div key={tier}>
              <div className="mb-2.5 flex items-baseline justify-between">
                <h3 className="text-[15px] font-medium text-body">{label}</h3>
                <span className="text-[11px] uppercase tracking-wide text-muted">Prestige {tier}+</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {tierItems.map((item) => {
                  const owned = ownedIds.has(item.id);
                  const canAfford = economy.aura_balance >= item.cost_aura;
                  const disabled = locked || owned || !canAfford || pendingId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-card border border-border bg-surface p-4"
                      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)", opacity: locked ? 0.5 : 1 }}
                    >
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-body">{item.name}</p>
                        <p className="mt-0.5 text-[11px] text-muted leading-relaxed">{item.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleBuy(item)}
                        disabled={disabled}
                        className="flex shrink-0 items-center gap-1.5 rounded-button border border-border px-3 py-2 text-[12px] font-medium transition-colors duration-200 disabled:cursor-not-allowed"
                        style={{
                          color: owned ? "#34d399" : locked || !canAfford ? "#6e7a8a" : "#5ab4ff",
                          borderColor: owned ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.07)",
                        }}
                      >
                        {owned ? (
                          "Owned"
                        ) : locked ? (
                          "Locked"
                        ) : (
                          <>
                            <SparkleIcon width={12} height={12} />
                            {item.cost_aura}
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
