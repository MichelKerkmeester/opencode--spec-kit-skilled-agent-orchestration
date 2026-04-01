// ───────────────────────────────────────────────────────────────
// MODULE: Ontology Hooks
// ───────────────────────────────────────────────────────────────
// Feature catalog: Schema-guided extraction ontology hooks
// Simple ontology hook interface that validates entity/relation
// pairs against a configurable schema. Prevents out-of-vocabulary
// entities from polluting the causal graph.
// Feature-gated via SPECKIT_ONTOLOGY_HOOKS (default OFF).
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { isOntologyHooksEnabled } from '../search/search-flags.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface OntologySchema {
  entityTypes: string[];
  relationTypes: string[];
  extractionRules: Rule[];
}

export interface Rule {
  id: string;
  entityType: string;
  relationType: string;
}

// ───────────────────────────────────────────────────────────────
// 2. SCHEMA LOADING
// ───────────────────────────────────────────────────────────────

/**
 * Default ontology schema — matches the causal_edges CHECK constraint
 * and common entity types used across the spec-kit memory system.
 */
const DEFAULT_SCHEMA: OntologySchema = {
  entityTypes: [
    'spec', 'memory', 'decision', 'feature', 'module',
    'config', 'pattern', 'concept', 'person', 'tool',
  ],
  relationTypes: [
    'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports',
  ],
  extractionRules: [],
};

/**
 * Load ontology schema from environment or default.
 * Reads SPECKIT_ONTOLOGY_SCHEMA env var as JSON.
 * Returns null if no schema configured and no default is appropriate.
 * Returns the default schema when no env override is set.
 */
export function loadOntologySchema(schemaPath?: string): OntologySchema | null {
  if (!isOntologyHooksEnabled()) {
    return null;
  }

  try {
    if (schemaPath && schemaPath.trim().length > 0) {
      const resolvedPath = path.resolve(schemaPath);
      const raw = readFileSync(resolvedPath, 'utf8');
      const parsed = JSON.parse(raw) as Partial<OntologySchema>;
      return normalizeOntologySchema(parsed);
    }

    const envSchema = process.env.SPECKIT_ONTOLOGY_SCHEMA?.trim();
    if (!envSchema) {
      return DEFAULT_SCHEMA;
    }

    const parsed = JSON.parse(envSchema) as Partial<OntologySchema>;
    return normalizeOntologySchema(parsed);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[ontology-hooks] loadOntologySchema failed (fail-open): ${message}`);
    return DEFAULT_SCHEMA;
  }
}

function normalizeOntologySchema(parsed: Partial<OntologySchema>): OntologySchema {
  if (
    !Array.isArray(parsed.entityTypes) || parsed.entityTypes.length === 0 ||
    !Array.isArray(parsed.relationTypes) || parsed.relationTypes.length === 0
  ) {
    console.warn('[ontology-hooks] Invalid ontology schema — falling back to default');
    return DEFAULT_SCHEMA;
  }

  const extractionRules = Array.isArray(parsed.extractionRules)
    ? parsed.extractionRules
        .filter((rule): rule is Rule =>
          !!rule &&
          typeof rule.id === 'string' &&
          typeof rule.entityType === 'string' &&
          typeof rule.relationType === 'string')
        .map((rule) => ({
          id: rule.id,
          entityType: rule.entityType.toLowerCase(),
          relationType: rule.relationType.toLowerCase(),
        }))
    : [];

  return {
    entityTypes: parsed.entityTypes.map((t) => String(t).toLowerCase()),
    relationTypes: parsed.relationTypes.map((t) => String(t).toLowerCase()),
    extractionRules,
  };
}

// ───────────────────────────────────────────────────────────────
// 3. VALIDATION
// ───────────────────────────────────────────────────────────────

/**
 * Validate that an entity/relation pair is allowed by the schema.
 * Comparison is case-insensitive.
 * Returns true if both the entity type and relation type are in the schema.
 */
export function validateExtraction(
  entity: string,
  relation: string,
  schema: OntologySchema,
): boolean {
  if (!isOntologyHooksEnabled()) {
    return true;
  }

  const entityLower = entity.toLowerCase();
  const relationLower = relation.toLowerCase();

  const entityAllowed = schema.entityTypes.some(
    (t) => t.toLowerCase() === entityLower,
  );
  const relationAllowed = schema.relationTypes.some(
    (t) => t.toLowerCase() === relationLower,
  );

  if (!entityAllowed || !relationAllowed) {
    return false;
  }

  if (!Array.isArray(schema.extractionRules) || schema.extractionRules.length === 0) {
    return true;
  }

  return schema.extractionRules.some((rule) =>
    rule.entityType === entityLower && rule.relationType === relationLower);
}
