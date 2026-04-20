import { z } from 'zod';

export const GenerationMetadataSchema = z.object({
  generation: z.number().int().nonnegative(),
  updatedAt: z.string().datetime(),
  sourceSignature: z.string().min(1).nullable(),
  reason: z.string().min(1),
  state: z.enum(['live', 'stale', 'absent', 'unavailable']),
});

export type GenerationMetadata = z.infer<typeof GenerationMetadataSchema>;
