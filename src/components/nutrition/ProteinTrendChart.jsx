import { useEffect, useState } from "react";
import { Bar, BarChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { fetchProteinTrend, NUTRITION_TARGETS } from "../../lib/nutrition";

function formatTick(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="card-shadow rounded-btn border border-border bg-surface px-3 py-2 text-[12px]"
    >
      <p className="text-muted">{formatTick(label)}</p>
      <p className="font-mono text-body">{payload[0].value}g protein</p>
    </div>
  );
}

export default function ProteinTrendChart({ userId }) {
  const [points, setPoints] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchProteinTrend(userId).then((data) => {
      if (mounted) setPoints(data);
    });
    return () => {
      mounted = false;
    };
  }, [userId]);

  if (!points) return null;
  if (!points.some((p) => p.protein > 0)) return null;

  return (
    <div
      className="card-shadow mb-3 rounded-card border border-border bg-surface p-5"
    >
      <h3 className="mb-3 text-[15px] font-medium text-body">30-day protein</h3>
      <div style={{ height: 130 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={points} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
            <XAxis dataKey="date" hide />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <ReferenceLine y={NUTRITION_TARGETS.protein.min} stroke="#6e7a8a" strokeDasharray="3 3" />
            <Bar dataKey="protein" fill="#5ab4ff" radius={[2, 2, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-[11px] text-muted">Dashed line marks the {NUTRITION_TARGETS.protein.min}g target.</p>
    </div>
  );
}
