// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Index Scope Policy
// ───────────────────────────────────────────────────────────────

export const CODE_GRAPH_INDEX_SKILLS_ENV = 'SPECKIT_CODE_GRAPH_INDEX_SKILLS';
export const CODE_GRAPH_SCOPE_FINGERPRINT_KEY = 'scope_fingerprint';
export const CODE_GRAPH_SCOPE_LABEL_KEY = 'scope_label';

export const CODE_GRAPH_SKILL_EXCLUDE_GLOBS = ['**/.opencode/skill/**'] as const;

export type IndexScopePolicySource = 'default' | 'env' | 'scan-argument';

export interface IndexScopePolicy {
  includeSkills: boolean;
  source: IndexScopePolicySource;
  fingerprint: string;
  label: string;
  excludedSkillGlobs: readonly string[];
}

export interface ResolveIndexScopePolicyInput {
  includeSkills?: boolean;
  env?: Record<string, string | undefined>;
}

function isEnabledEnvValue(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === 'true';
}

export function resolveIndexScopePolicy(input: ResolveIndexScopePolicyInput = {}): IndexScopePolicy {
  const env = input.env ?? process.env;
  const envIncludesSkills = isEnabledEnvValue(env[CODE_GRAPH_INDEX_SKILLS_ENV]);
  const perCallProvided = typeof input.includeSkills === 'boolean';
  const includeSkills = perCallProvided ? input.includeSkills === true : envIncludesSkills;
  const source: IndexScopePolicySource = perCallProvided
    ? 'scan-argument'
    : envIncludesSkills
      ? 'env'
      : 'default';

  return {
    includeSkills,
    source,
    fingerprint: includeSkills
      ? 'code-graph-scope:v1:skills=included:mcp-coco-index=excluded'
      : 'code-graph-scope:v1:skills=excluded:mcp-coco-index=excluded',
    label: includeSkills
      ? 'end-user code plus .opencode/skill opt-in; mcp-coco-index/mcp_server excluded'
      : 'end-user code only; .opencode/skill and mcp-coco-index/mcp_server excluded',
    excludedSkillGlobs: includeSkills ? [] : CODE_GRAPH_SKILL_EXCLUDE_GLOBS,
  };
}
