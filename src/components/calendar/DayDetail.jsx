import MacroBar from "../MacroBar";
import AchievementBadge from "../accomplishments/AchievementBadge";
import { HABIT_TARGETS } from "../../lib/habits";
import { NUTRITION_TARGETS, sumMacros } from "../../lib/nutrition";
import { STATUS_LABELS } from "../../lib/calendar";
import { ACHIEVEMENTS_BY_ID, TIERS } from "../../lib/accomplishments";
import { normalizeItems } from "../../lib/gratitude";
import { formatDuration, formatTimeOfDay } from "../../lib/rest";

const STATUS_COLORS = {
  full: "#34d399",
  partial: "#5ab4ff",
  rest: "#c08457",
  missed: "#6e7a8a",
  future: "#6e7a8a",
};

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

function Card({ title, right, children }) {
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h3 className="text-[12px] font-medium uppercase tracking-wide text-muted">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

export default function DayDetail({ detail }) {
  const { date, exerciseGroups, session, cardio, habitLog, pullupTarget, meals, gratitude, badges, status } = detail;
  const totals = sumMacros(meals);
  const gratitudeItems = normalizeItems(gratitude?.items).filter((t) => t.trim());
  const earnedBadges = (badges ?? []).map((b) => ACHIEVEMENTS_BY_ID[b.achievement_id]).filter(Boolean);
  // Mirrors exactly what the cards below render — a day whose only record is an
  // earned badge still has something on it.
  const hasAnything =
    exerciseGroups.length > 0 ||
    cardio.length > 0 ||
    habitLog ||
    meals.length > 0 ||
    gratitudeItems.length > 0 ||
    earnedBadges.length > 0;

  const statusColor = STATUS_COLORS[status] ?? "#6e7a8a";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-[18px] font-semibold text-body">{formatDate(date)}</h2>
        {status && (
          <span
            className="mt-1.5 inline-block rounded-pill px-2 py-0.5 text-[11px]"
            style={{ color: statusColor, background: `${statusColor}1f` }}
          >
            {STATUS_LABELS[status]}
          </span>
        )}
      </div>

      {!hasAnything && <p className="text-[13px] text-muted">Nothing logged on this day.</p>}

      {earnedBadges.length > 0 && (
        <Card title="Earned this day">
          <div className="flex flex-wrap gap-3">
            {earnedBadges.map((a) => {
              const tier = TIERS[a.tier] ?? TIERS.bronze;
              return (
                <div key={a.id} className="flex w-[86px] flex-col items-center gap-1">
                  <AchievementBadge achievement={a} size={40} />
                  <span className="text-center text-[10px] leading-tight" style={{ color: tier.color }}>
                    {a.name}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {exerciseGroups.length > 0 && (
        <Card
          title="Workout"
          right={
            session?.hasSession ? (
              <span className="font-mono text-[13px] text-body">{formatDuration(session.durationSeconds)}</span>
            ) : null
          }
        >
          {session?.hasSession && (
            <div className="mb-3 flex items-center justify-between gap-2 rounded-btn bg-white/[0.03] px-3 py-2 text-[11px]">
              <span className="text-muted">
                {formatTimeOfDay(session.startMs)} → {formatTimeOfDay(session.lastSetMs)}
              </span>
              <span className="font-mono text-body">
                {session.setCount} sets · {Math.round(session.totalVolume).toLocaleString()} lbs
              </span>
            </div>
          )}
          <div className="flex flex-col gap-3">
            {exerciseGroups.map((g) => (
              <div key={g.name}>
                <p className="mb-1.5 text-[14px] text-body">{g.name}</p>
                <div className="flex flex-wrap gap-1.5">
                  {g.sets.map((s) => (
                    <span
                      key={s.id}
                      className="rounded-pill border border-border bg-white/[0.03] px-2 py-1 font-mono text-[12px] text-body"
                    >
                      {s.weight_lbs}×{s.reps}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {habitLog && (
        <Card title="Habits">
          <div className="flex flex-col gap-2">
            {[
              { key: "pushups", label: "Pushups", target: HABIT_TARGETS.pushups.min },
              { key: "situps", label: "Situps", target: HABIT_TARGETS.situps.min },
              { key: "pullups", label: "Pullups", target: pullupTarget },
            ].map(({ key, label, target }) => {
              const value = habitLog[key] ?? 0;
              const met = value >= target;
              return (
                <div key={key} className="flex items-center justify-between gap-3">
                  <span className="text-[13px] text-body">{label}</span>
                  <div className="flex flex-1 items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (value / target) * 100)}%`,
                          background: met ? "#34d399" : "#5ab4ff",
                        }}
                      />
                    </div>
                    <span
                      className="w-[78px] shrink-0 whitespace-nowrap text-right font-mono text-[12px]"
                      style={{ color: met ? "#34d399" : "#6e7a8a" }}
                    >
                      {value} / {target}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {gratitudeItems.length > 0 && (
        <Card title="Gratitude" right={<span className="font-mono text-[12px] text-muted">{gratitudeItems.length}/3</span>}>
          <ul className="flex flex-col gap-1.5">
            {gratitudeItems.map((t, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-body">
                <span className="shrink-0 font-mono text-[12px] text-accent">{i + 1}</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {cardio.length > 0 && (
        <Card title="Cardio">
          <div className="flex flex-col gap-1.5">
            {cardio.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-btn bg-white/[0.03] px-3 py-2 text-[13px]"
              >
                <span className="text-body">{c.type}</span>
                <span className="font-mono text-muted">{c.duration_min} min</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {meals.length > 0 && (
        <Card title="Nutrition" right={<span className="font-mono text-[12px] text-muted">{meals.length} meals</span>}>
          <div className="flex flex-col gap-3">
            <MacroBar label="Protein" value={totals.protein_g} target={NUTRITION_TARGETS.protein} />
            <MacroBar label="Carbs" value={totals.carbs_g} target={NUTRITION_TARGETS.carbs} />
            <MacroBar label="Fat" value={totals.fat_g} target={NUTRITION_TARGETS.fat} />
            <MacroBar label="Calories" value={totals.calories} unit="" target={NUTRITION_TARGETS.calories} />
          </div>
        </Card>
      )}
    </div>
  );
}
