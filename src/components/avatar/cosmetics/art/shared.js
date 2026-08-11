import { getStageGeometry } from "../../../../lib/avatarConfig";

// Geometry contract for every cosmetic component: it receives { metrics, geo }.
// `metrics` is the fixed layout (cx 110 · shoulders y78 · waist y150 · hips
// y168); `geo` is getStageGeometry(level, metrics) — the EXACT rectangles
// AvatarBody draws at the wearer's physique stage: shoulderHalf/waistHalf,
// armLeftX/armRightX + armWidth, legLeftX/legRightX + legWidth, and hipHalf
// (the width a Bottom must cover).
//
// Fixed pixel offsets are a bug here: shoulders span 60→90 and the waist 70→44
// across the six stages, so anything hardcoded detaches from the body at stage
// 1 and stage 6. Anchor to `geo`, then add a couple of px of margin so the
// garment reads as fabric over the limb rather than paint.

// Callers outside the avatar (store thumbnails) render art without a level;
// mid-range physique matches the ghost body ItemThumb draws behind it.
export const geoOr = (geo, metrics) => geo ?? getStageGeometry(4, metrics);

// Half-width of the torso silhouette at a given y — the same quadratic
// AvatarBody sweeps down each side — so a top can be cut proud of the body
// it covers at every point, not just at the shoulder and waist.
export function torsoHalf(g, y) {
  const t = Math.min(1, Math.max(0, (y - g.shoulderY) / (g.waistY - g.shoulderY)));
  const ctrl = g.shoulderHalf + 6;
  return (1 - t) * (1 - t) * g.shoulderHalf + 2 * t * (1 - t) * ctrl + t * t * g.waistHalf;
}

// Head geometry, matching AvatarBody's skull circle.
export function headCenter(metrics) {
  return { hx: metrics.cx, hy: metrics.shoulderY - 24, hr: 19 };
}
