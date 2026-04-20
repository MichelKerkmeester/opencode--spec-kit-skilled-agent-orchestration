import { z } from 'zod';

export const DaemonHealthStateSchema = z.enum([
  'live',
  'degraded',
  'quarantined',
  'unavailable',
]);

export const DaemonStatusSchema = z.object({
  workspaceRoot: z.string().min(1),
  ownerId: z.string().min(1).nullable(),
  state: DaemonHealthStateSchema,
  trustState: z.enum(['live', 'stale', 'absent', 'unavailable']),
  generation: z.number().int().nonnegative(),
  lastHeartbeatAt: z.string().nullable(),
  lastScanAt: z.string().nullable(),
  watcher: z.object({
    enabled: z.boolean(),
    watchedPaths: z.number().int().nonnegative(),
    pendingEvents: z.number().int().nonnegative(),
    circuitOpen: z.boolean(),
  }),
  quarantineCount: z.number().int().nonnegative(),
  diagnostics: z.array(z.string()),
});

export type DaemonHealthState = z.infer<typeof DaemonHealthStateSchema>;
export type DaemonStatus = z.infer<typeof DaemonStatusSchema>;
