import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchLiftProgress } from "../../lib/workouts";

const TRACKED_LIFTS = ["Barbell Bench Press", "Barbell Squat"];

function formatTick(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-btn border border-border bg-surface px-3 py-2 text-[12px]"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
    >
      <p className="text-muted">{formatTick(label)}</p>
      <p className="font-mono text-body">{payload[0].value} lbs</p>
    </div>
  );
}

export default function LiftProgressChart({ userId }) {
  const [lifts, setLifts] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchLiftProgress(userId, TRACKED_LIFTS).then((data) => {
      if (mounted) setLifts(data);
    });
    return () => {
      mounted = false;
    };
  }, [userId]);

  if (!lifts) return null;

  const liftsWithData = lifts.filter((l) => l.points.length >= 2);
  if (liftsWithData.length === 0) return null;

  return (
    <div
      className="mb-3 flex flex-col gap-4 rounded-card border border-border bg-surface p-5"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
    >
      <h3 className="text-[15px] font-medium text-body">Progress</h3>
      {liftsWithData.map((lift) => (
        <div key={lift.name}>
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-[12px] text-muted">{lift.name}</span>
            <span className="font-mono text-[13px] text-body">
              {lift.points[lift.points.length - 1].weight} lbs
            </span>
          </div>
          <div style={{ height: 110 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lift.points} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                <XAxis dataKey="date" hide />
                <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.07)" }} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#5ab4ff"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3, fill: "#5ab4ff" }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}
