// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Tool Contract Keys
// ───────────────────────────────────────────────────────────────
// F-018-D3-04 (partial): Single source of truth for the parameter key sets
// of the two most critical advisor tool contracts. The JSON Schema
// descriptors (skill_advisor/tools/advisor-recommend.ts +
// skill_advisor/tools/advisor-validate.ts) and the ALLOWED_PARAMETERS map in
// schemas/tool-input-schemas.ts both read from these tuples instead of
// hand-maintaining parallel string lists.
//
// This is a partial fix: the broader 60+-tool MCP contract surface still
// duplicates JSON Schema, Zod inputs, handler checks, and allowed-parameter
// lists. A clean single-source generation for the entire surface would
// require introducing zod-to-json-schema and a code-gen pipeline, which is
// out of scope for a single sub-phase. This module demonstrates the pattern
// on the two highest-priority advisor contracts so a follow-on packet has a
// concrete template to extend.

export const ADVISOR_RECOMMEND_PARAMETER_KEYS = [
  'prompt',
  'options',
] as const;

export type AdvisorRecommendParameterKey =
  (typeof ADVISOR_RECOMMEND_PARAMETER_KEYS)[number];

export const ADVISOR_VALIDATE_PARAMETER_KEYS = [
  'confirmHeavyRun',
  'skillSlug',
] as const;

export type AdvisorValidateParameterKey =
  (typeof ADVISOR_VALIDATE_PARAMETER_KEYS)[number];
