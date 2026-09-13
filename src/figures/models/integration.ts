/** One curve shared by the integration lessons, with exact bounds and area. */
export const integrand = (x: number) => 1 + 0.45 * Math.sin(1.6 * x + 0.4) + 0.08 * x;

export function integral(t: number): number {
  return t + (0.45 / 1.6) * (Math.cos(0.4) - Math.cos(1.6 * t + 0.4)) + 0.04 * t * t;
}

/** |g′| ≤ 0.45 × 1.6 + 0.08 everywhere. */
export const slopeBound = 0.8;

export function integrandRange(lo: number, hi: number) {
  const candidates = [lo, hi];
  const angle = Math.acos(-0.08 / (0.45 * 1.6));
  for (const phase of [angle, -angle]) {
    const first = Math.ceil((1.6 * lo + 0.4 - phase) / (2 * Math.PI));
    const last = Math.floor((1.6 * hi + 0.4 - phase) / (2 * Math.PI));
    for (let k = first; k <= last; k += 1) {
      candidates.push((phase + 2 * Math.PI * k - 0.4) / 1.6);
    }
  }
  let pMin = lo;
  let pMax = lo;
  for (const x of candidates) {
    if (integrand(x) < integrand(pMin)) pMin = x;
    if (integrand(x) > integrand(pMax)) pMax = x;
  }
  return { min: integrand(pMin), max: integrand(pMax), pMin, pMax };
}
