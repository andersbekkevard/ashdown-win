import { z } from "zod";

const cannon = z.object({
  x: z.number().min(-0.5).max(1.5),
  y: z.number().min(-0.5).max(1.5),
  angle: z.number().min(0).max(360),
});
const burst = z.object({
  particleCount: z.number().int().min(0).max(200),
  spread: z.number().min(0).max(360),
  startVelocity: z.number().min(0).max(100),
  scalar: z.number().min(0.1).max(6),
});

export const confettiSettingsSchema = z.object({
  cannon,
  bursts: z.tuple([burst, burst]),
  gravity: z.number().min(-2).max(4),
  decay: z.number().min(0).max(1),
  drift: z.number().min(-5).max(5),
  ticks: z.number().int().min(30).max(600),
  flat: z.boolean(),
  colors: z.array(z.string().regex(/^#[0-9a-f]{6}$/i)).min(1).max(8),
  shapes: z.object({
    square: z.number().int().min(0).max(5),
    circle: z.number().int().min(0).max(5),
    star: z.number().int().min(0).max(5),
  }).refine((mix) => mix.square + mix.circle + mix.star > 0),
  durationMs: z.number().int().min(500).max(10000),
});

export type ConfettiSettings = z.infer<typeof confettiSettingsSchema>;

/** The production defaults and the workbench presets have one owner. */
export function defaultConfettiSettings(mobile: boolean): ConfettiSettings {
  return {
    cannon: { x: -0.04, y: 0.84, angle: 65 },
    bursts: [
      { particleCount: 48, spread: 48, startVelocity: mobile ? 28 : 43, scalar: mobile ? 2.16 : 2.52 },
      { particleCount: 36, spread: 88, startVelocity: mobile ? 19 : 29, scalar: mobile ? 1.62 : 1.8 },
    ],
    gravity: 1.05,
    decay: 0.92,
    drift: 0,
    ticks: 160,
    flat: false,
    colors: ["#fb3aa3", "#ffd046", "#5eeac0", "#ffffff", "#7c7be8"],
    shapes: { square: 2, circle: 1, star: 0 },
    durationMs: 1800,
  };
}
