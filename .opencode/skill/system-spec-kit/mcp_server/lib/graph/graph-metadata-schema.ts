// ───────────────────────────────────────────────────────────────
// MODULE: Graph Metadata Schema
// ───────────────────────────────────────────────────────────────

import { z } from 'zod';

export const GRAPH_METADATA_SCHEMA_VERSION = 1 as const;
export const GRAPH_METADATA_DOCUMENT_TYPE = 'graph_metadata' as const;
export const GRAPH_METADATA_FILENAME = 'graph-metadata.json' as const;
export const GRAPH_METADATA_MIGRATED_QUALITY_FLAG = 'graph_metadata_migrated' as const;
export const SAVE_LINEAGE_VALUES = ['description_only', 'graph_only', 'same_pass'] as const;
export const GRAPH_METADATA_TRIGGER_PHRASE_LIMIT = 12;
export const GRAPH_METADATA_KEY_TOPIC_LIMIT = 12;
export const GRAPH_METADATA_KEY_FILE_LIMIT = 20;
export const GRAPH_METADATA_ENTITY_LIMIT = 24;
export type GraphMetadataMigrationSource = 'legacy';
export type SaveLineage = typeof SAVE_LINEAGE_VALUES[number];

export const packetReferenceSchema = z.object({
  packet_id: z.string().min(1),
  reason: z.string().min(1),
  source: z.string().min(1),
  spec_folder: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
});

export const graphEntityReferenceSchema = z.object({
  name: z.string().min(1),
  kind: z.string().min(1),
  path: z.string().min(1),
  source: z.string().min(1),
});

export const graphMetadataManualSchema = z.object({
  depends_on: z.array(packetReferenceSchema),
  supersedes: z.array(packetReferenceSchema),
  related_to: z.array(packetReferenceSchema),
});

export const graphMetadataDerivedSchema = z.object({
  trigger_phrases: z.array(z.string().min(1)).max(GRAPH_METADATA_TRIGGER_PHRASE_LIMIT),
  key_topics: z.array(z.string().min(1)).max(GRAPH_METADATA_KEY_TOPIC_LIMIT),
  importance_tier: z.string().min(1),
  status: z.string().min(1),
  key_files: z.array(z.string().min(1)).max(GRAPH_METADATA_KEY_FILE_LIMIT),
  entities: z.array(graphEntityReferenceSchema).max(GRAPH_METADATA_ENTITY_LIMIT),
  causal_summary: z.string(),
  created_at: z.string().datetime({ offset: true }),
  last_save_at: z.string().datetime({ offset: true }),
  save_lineage: z.enum(SAVE_LINEAGE_VALUES).optional(),
  last_accessed_at: z.string().datetime({ offset: true }).nullable(),
  source_docs: z.array(z.string().min(1)),
});

export const graphMetadataSchema = z.object({
  schema_version: z.literal(GRAPH_METADATA_SCHEMA_VERSION),
  packet_id: z.string().min(1),
  spec_folder: z.string().min(1),
  parent_id: z.string().min(1).nullable(),
  children_ids: z.array(z.string().min(1)),
  migrated: z.boolean().optional(),
  migration_source: z.literal('legacy').optional(),
  manual: graphMetadataManualSchema,
  derived: graphMetadataDerivedSchema,
});

export type PacketReference = z.infer<typeof packetReferenceSchema>;
export type GraphEntityReference = z.infer<typeof graphEntityReferenceSchema>;
export type GraphMetadataManual = z.infer<typeof graphMetadataManualSchema>;
export type GraphMetadataDerived = z.infer<typeof graphMetadataDerivedSchema>;
export type GraphMetadata = z.infer<typeof graphMetadataSchema>;

/**
 * Create an empty manual-relationship section for new graph metadata files.
 *
 * @returns Initialized manual relationship payload with empty lists
 */
export function createEmptyGraphMetadataManual(): GraphMetadataManual {
  return {
    depends_on: [],
    supersedes: [],
    related_to: [],
  };
}
