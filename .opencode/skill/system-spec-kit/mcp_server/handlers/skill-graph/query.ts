// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Query Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for skill_graph_query — traverses skill graph
// relationships from the SQLite-backed store.

import type { SkillFamily } from '../../lib/skill-graph/skill-graph-db.js';
import * as skillGraphQueries from '../../lib/skill-graph/skill-graph-queries.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export type QueryType =
  | 'depends_on'
  | 'dependents'
  | 'enhances'
  | 'enhanced_by'
  | 'family_members'
  | 'conflicts'
  | 'transitive_path'
  | 'hub_skills'
  | 'orphans'
  | 'subgraph';

export interface QueryArgs {
  queryType: QueryType;
  skillId?: string;
  sourceSkillId?: string;
  targetSkillId?: string;
  family?: string;
  minInbound?: number;
  depth?: number;
  limit?: number;
}

type HandlerResponse = { content: Array<{ type: string; text: string }> };
const SKILL_FAMILIES = new Set<SkillFamily>(['cli', 'mcp', 'sk-code', 'sk-deep', 'sk-util', 'system']);

// ───────────────────────────────────────────────────────────────
// 2. HANDLER
// ───────────────────────────────────────────────────────────────

/** Handle skill_graph_query tool call */
export async function handleSkillGraphQuery(
  args: QueryArgs,
): Promise<HandlerResponse> {
  try {
    const limit = clamp(args.limit, 1, 200, 50);
    const depth = clamp(args.depth, 1, 10, 2);
    const minInbound = clamp(args.minInbound, 0, 200, 2);

    switch (args.queryType) {
      case 'depends_on':
        return requireSkillId(args.skillId, args.queryType, (skillId) => okResponse({
          queryType: args.queryType,
          skillId,
          relationships: sliceResults(skillGraphQueries.dependsOn(skillId), limit),
        }));

      case 'dependents':
        return requireSkillId(args.skillId, args.queryType, (skillId) => okResponse({
          queryType: args.queryType,
          skillId,
          relationships: sliceResults(skillGraphQueries.dependents(skillId), limit),
        }));

      case 'enhances':
        return requireSkillId(args.skillId, args.queryType, (skillId) => okResponse({
          queryType: args.queryType,
          skillId,
          relationships: sliceResults(skillGraphQueries.enhances(skillId), limit),
        }));

      case 'enhanced_by':
        return requireSkillId(args.skillId, args.queryType, (skillId) => okResponse({
          queryType: args.queryType,
          skillId,
          relationships: sliceResults(skillGraphQueries.enhancedBy(skillId), limit),
        }));

      case 'family_members':
        if (!args.family || args.family.trim().length === 0) {
          return errorResponse('family is required for family_members query');
        }
        if (!isSkillFamily(args.family)) {
          return errorResponse(`family must be one of: ${[...SKILL_FAMILIES].join(', ')}`);
        }
        return okResponse({
          queryType: args.queryType,
          family: args.family,
          members: sliceResults(skillGraphQueries.familyMembers(args.family), limit),
        });

      case 'conflicts':
        return requireSkillId(args.skillId, args.queryType, (skillId) => okResponse({
          queryType: args.queryType,
          skillId,
          relationships: sliceResults(skillGraphQueries.conflicts(skillId), limit),
        }));

      case 'transitive_path':
        if (!args.sourceSkillId || args.sourceSkillId.trim().length === 0) {
          return errorResponse('sourceSkillId is required for transitive_path query');
        }
        if (!args.targetSkillId || args.targetSkillId.trim().length === 0) {
          return errorResponse('targetSkillId is required for transitive_path query');
        }
        return okResponse({
          queryType: args.queryType,
          sourceSkillId: args.sourceSkillId,
          targetSkillId: args.targetSkillId,
          path: skillGraphQueries.transitivePath(args.sourceSkillId, args.targetSkillId),
        });

      case 'hub_skills':
        return okResponse({
          queryType: args.queryType,
          minInbound,
          skills: sliceResults(skillGraphQueries.hubSkills(minInbound), limit),
        });

      case 'orphans':
        return okResponse({
          queryType: args.queryType,
          skills: sliceResults(skillGraphQueries.orphans(), limit),
        });

      case 'subgraph':
        return requireSkillId(args.skillId, args.queryType, (skillId) => okResponse({
          queryType: args.queryType,
          skillId,
          depth,
          graph: skillGraphQueries.subgraph(skillId, depth),
        }));

      default:
        return errorResponse(
          `Unknown queryType: "${args.queryType}". Valid types: depends_on, dependents, enhances, enhanced_by, family_members, conflicts, transitive_path, hub_skills, orphans, subgraph`,
        );
    }
  } catch (err: unknown) {
    return errorResponse(
      `Skill graph query failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function requireSkillId(
  skillId: string | undefined,
  queryType: QueryType,
  next: (resolvedSkillId: string) => HandlerResponse,
): HandlerResponse {
  if (!skillId || skillId.trim().length === 0) {
    return errorResponse(`skillId is required for ${queryType} query`);
  }

  return next(skillId);
}

function isSkillFamily(value: string): value is SkillFamily {
  return SKILL_FAMILIES.has(value as SkillFamily);
}

function clamp(
  value: number | undefined,
  minimum: number,
  maximum: number,
  fallback: number,
): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(Math.max(value, minimum), maximum);
}

function sliceResults<T>(results: T, limit: number): T {
  if (!Array.isArray(results)) return results;
  return results.slice(0, limit) as T;
}

function sanitizeQueryOutput(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeQueryOutput);
  }

  if (value && typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      if (key === 'sourcePath' || key === 'contentHash') {
        continue;
      }
      sanitized[key] = sanitizeQueryOutput(nestedValue);
    }
    return sanitized;
  }

  return value;
}

function okResponse(data: Record<string, unknown>): HandlerResponse {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: sanitizeQueryOutput(data) }),
    }],
  };
}

function errorResponse(error: string): HandlerResponse {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'error', error }),
    }],
  };
}
