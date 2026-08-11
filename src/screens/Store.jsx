import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, SparkleIcon, StarIcon } from "../components/icons";
import StoreItemRow from "../components/store/StoreItemRow";
import { useAuth } from "../lib/AuthContext";
import { fetchEconomy, fetchStoreItems, fetchOwnedItems, purchaseItem, equipItem, unequipItem } from "../lib/economy";

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
  const [ownedById, setOwnedById] = useState({});
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState(null);
  const [justActionedId, setJustActionedId] = useState(null);
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
      setOwnedById(Object.fromEntries(owned.map((o) => [o.item_id, o])));
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [user.id]);

  function flashAction(itemId) {
    setJustActionedId(itemId);
    setTimeout(() => setJustActionedId(null), 360);
  }

  async function handleBuy(item) {
    setError(null);
    setPendingId(item.id);
    try {
      const updated = await purchaseItem(user.id, item, economy);
      setEconomy(updated);
      setOwnedById((prev) => ({ ...prev, [item.id]: { item_id: item.id, equipped: false } }));
      flashAction(item.id);
    } catch (e) {
      setError(e.message);
    } finally {
      setPendingId(null);
    }
  }

  async function handleEquip(item) {
    setError(null);
    setPendingId(item.id);
    try {
      await equipItem(user.id, item, items);
      setOwnedById((prev) => {
        const next = { ...prev };
        for (const i of items) {
          if (i.category === item.category && next[i.id]) {
            next[i.id] = { ...next[i.id], equipped: i.id === item.id };
          }
        }
        return next;
      });
      flashAction(item.id);
    } catch (e) {
      setError(e.message);
    } finally {
      setPendingId(null);
    }
  }

  async function handleUnequip(item) {
    setError(null);
    setPendingId(item.id);
    try {
      await unequipItem(user.id, item);
      setOwnedById((prev) => ({ ...prev, [item.id]: { ...prev[item.id], equipped: false } }));
      flashAction(item.id);
    } catch (e) {
      setError(e.message);
    } finally {
      setPendingId(null);
    }
  }

  if (loading) {
    return (
      <>
        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-body">Store</h1>
        </div>
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
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn border border-border bg-surface text-muted transition-colors duration-200 hover:text-body active:scale-95"
        >
          <ChevronLeftIcon width={18} height={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-body">Store</h1>
          <p className="mt-1 text-[13px] text-muted leading-relaxed">Spend aura on cosmetics, unlocked by prestige.</p>
        </div>
      </div>

      <div className="card-shadow mb-6 flex items-center justify-between rounded-card border border-border bg-surface px-5 py-4">
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
                  const owned = ownedById[item.id];
                  return (
                    <StoreItemRow
                      key={item.id}
                      item={item}
                      owned={Boolean(owned)}
                      equipped={owned?.equipped ?? false}
                      locked={locked}
                      canAfford={economy.aura_balance >= item.cost_aura}
                      pending={pendingId === item.id}
                      justActioned={justActionedId === item.id}
                      onBuy={() => handleBuy(item)}
                      onEquip={() => handleEquip(item)}
                      onUnequip={() => handleUnequip(item)}
                    />
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
