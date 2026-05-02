// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Index Scope Policy
// ───────────────────────────────────────────────────────────────

export const CODE_GRAPH_INDEX_SKILLS_ENV = 'SPECKIT_CODE_GRAPH_INDEX_SKILLS';
export const CODE_GRAPH_INDEX_AGENTS_ENV = 'SPECKIT_CODE_GRAPH_INDEX_AGENTS';
export const CODE_GRAPH_INDEX_COMMANDS_ENV = 'SPECKIT_CODE_GRAPH_INDEX_COMMANDS';
export const CODE_GRAPH_INDEX_SPECS_ENV = 'SPECKIT_CODE_GRAPH_INDEX_SPECS';
export const CODE_GRAPH_INDEX_PLUGINS_ENV = 'SPECKIT_CODE_GRAPH_INDEX_PLUGINS';
export const CODE_GRAPH_SCOPE_FINGERPRINT_KEY = 'scope_fingerprint';
export const CODE_GRAPH_SCOPE_LABEL_KEY = 'scope_label';
export const CODE_GRAPH_SCOPE_SOURCE_KEY = 'scope_source';

export const CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS = {
  skill: ['**/.opencode/skill/**'],
  agent: ['**/.opencode/agent/**'],
  command: ['**/.opencode/command/**'],
  specs: ['**/.opencode/specs/**'],
  plugins: ['**/.opencode/plugins/**'],
} as const;

export const CODE_GRAPH_SKILL_EXCLUDE_GLOBS = CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS.skill;

export type IndexScopePolicySource = 'default' | 'env' | 'scan-argument';
export type IncludedSkillsList = 'all' | 'none' | string[];

export interface IndexScopePolicy {
  includeSkills: boolean;
  includedSkillsList: IncludedSkillsList;
  source: IndexScopePolicySource;
  fingerprint: string;
  label: string;
  excludedSkillGlobs: readonly string[];
  includeAgents: boolean;
  includeCommands: boolean;
  includeSpecs: boolean;
  includePlugins: boolean;
  excludedAgentGlobs: readonly string[];
  excludedCommandGlobs: readonly string[];
  excludedSpecGlobs: readonly string[];
  excludedPluginGlobs: readonly string[];
}

export interface ResolveIndexScopePolicyInput {
  includeSkills?: boolean | string[];
  includeAgents?: boolean;
  includeCommands?: boolean;
  includeSpecs?: boolean;
  includePlugins?: boolean;
  env?: Record<string, string | undefined>;
}

const SKILL_NAME_PATTERN = /^sk-[a-z0-9-]+$/;

function isEnabledEnvValue(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === 'true';
}

function isIndexScopePolicySource(value: string | null | undefined): value is IndexScopePolicySource {
  return value === 'default' || value === 'env' || value === 'scan-argument';
}

function hasPerCallScopeOverride(input: ResolveIndexScopePolicyInput): boolean {
  return input.includeSkills !== undefined
    || input.includeAgents !== undefined
    || input.includeCommands !== undefined
    || input.includeSpecs !== undefined
    || input.includePlugins !== undefined;
}

function normalizeSkillList(values: readonly string[]): string[] {
  return [...new Set(values.map(value => value.trim()).filter(value => SKILL_NAME_PATTERN.test(value)))].sort();
}

function parseSkillsEnvValue(value: string | undefined): IncludedSkillsList {
  const normalized = value?.trim();
  if (!normalized || normalized.toLowerCase() === 'false') {
    return 'none';
  }
  if (normalized.toLowerCase() === 'true') {
    return 'all';
  }

  const skills = normalizeSkillList(normalized.split(','));
  return skills.length > 0 ? skills : 'none';
}

function resolveIncludedSkillsList(
  includeSkills: ResolveIndexScopePolicyInput['includeSkills'],
  env: Record<string, string | undefined>,
): IncludedSkillsList {
  if (includeSkills === true) return 'all';
  if (includeSkills === false) return 'none';
  if (Array.isArray(includeSkills)) {
    const skills = normalizeSkillList(includeSkills);
    return skills.length > 0 ? skills : 'none';
  }
  return parseSkillsEnvValue(env[CODE_GRAPH_INDEX_SKILLS_ENV]);
}

function buildFingerprint(policy: Omit<IndexScopePolicy, 'fingerprint' | 'label'>): string {
  const skills = policy.includedSkillsList === 'all'
    ? 'all'
    : policy.includedSkillsList === 'none'
      ? 'none'
      : `list[${[...policy.includedSkillsList].sort().join(',')}]`;
  return [
    'code-graph-scope:v2',
    `skills=${skills}`,
    `agents=${policy.includeAgents ? 'all' : 'none'}`,
    `commands=${policy.includeCommands ? 'all' : 'none'}`,
    `specs=${policy.includeSpecs ? 'all' : 'none'}`,
    `plugins=${policy.includePlugins ? 'all' : 'none'}`,
    'mcp-coco-index=excluded',
  ].join(':');
}

function buildLabel(policy: Omit<IndexScopePolicy, 'fingerprint' | 'label'>): string {
  const includedFolders = [
    policy.includeSkills ? 'skills' : null,
    policy.includeAgents ? 'agents' : null,
    policy.includeCommands ? 'commands' : null,
    policy.includeSpecs ? 'specs' : null,
    policy.includePlugins ? 'plugins' : null,
  ].filter(Boolean);
  const includedSuffix = includedFolders.length > 0
    ? `; opted-in .opencode folders: ${includedFolders.join(', ')}`
    : '; .opencode skill, agent, command, specs and plugins excluded';
  return `end-user code only${includedSuffix}; mcp-coco-index/mcp_server excluded`;
}

function buildIndexScopePolicy(input: {
  includedSkillsList: IncludedSkillsList;
  includeAgents: boolean;
  includeCommands: boolean;
  includeSpecs: boolean;
  includePlugins: boolean;
  source: IndexScopePolicySource;
}): IndexScopePolicy {
  const includeSkills = input.includedSkillsList !== 'none';
  const policyWithoutDerivedText = {
    includeSkills,
    includedSkillsList: input.includedSkillsList,
    source: input.source,
    excludedSkillGlobs: input.includedSkillsList === 'none' ? CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS.skill : [],
    includeAgents: input.includeAgents,
    includeCommands: input.includeCommands,
    includeSpecs: input.includeSpecs,
    includePlugins: input.includePlugins,
    excludedAgentGlobs: input.includeAgents ? [] : CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS.agent,
    excludedCommandGlobs: input.includeCommands ? [] : CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS.command,
    excludedSpecGlobs: input.includeSpecs ? [] : CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS.specs,
    excludedPluginGlobs: input.includePlugins ? [] : CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS.plugins,
  };
  return {
    ...policyWithoutDerivedText,
    fingerprint: buildFingerprint(policyWithoutDerivedText),
    label: buildLabel(policyWithoutDerivedText),
  };
}

export function resolveIndexScopePolicy(input: ResolveIndexScopePolicyInput = {}): IndexScopePolicy {
  const env = input.env ?? process.env;
  const perCallProvided = hasPerCallScopeOverride(input);
  const includedSkillsList = resolveIncludedSkillsList(input.includeSkills, env);
  const includeAgents = input.includeAgents ?? isEnabledEnvValue(env[CODE_GRAPH_INDEX_AGENTS_ENV]);
  const includeCommands = input.includeCommands ?? isEnabledEnvValue(env[CODE_GRAPH_INDEX_COMMANDS_ENV]);
  const includeSpecs = input.includeSpecs ?? isEnabledEnvValue(env[CODE_GRAPH_INDEX_SPECS_ENV]);
  const includePlugins = input.includePlugins ?? isEnabledEnvValue(env[CODE_GRAPH_INDEX_PLUGINS_ENV]);
  const envProvided = includedSkillsList !== 'none'
    || includeAgents
    || includeCommands
    || includeSpecs
    || includePlugins;
  const source: IndexScopePolicySource = perCallProvided
    ? 'scan-argument'
    : envProvided
      ? 'env'
      : 'default';

  return buildIndexScopePolicy({
    includedSkillsList,
    includeAgents,
    includeCommands,
    includeSpecs,
    includePlugins,
    source,
  });
}

export function parseIndexScopePolicyFromFingerprint(input: {
  fingerprint: string | null;
  source?: string | null;
}): IndexScopePolicy | null {
  if (!input.fingerprint?.startsWith('code-graph-scope:v2:')) {
    return null;
  }

  const segments = input.fingerprint.split(':').slice(2);
  const values = new Map<string, string>();
  for (const segment of segments) {
    const [key, value] = segment.split('=');
    if (!key || value === undefined) {
      return null;
    }
    values.set(key, value);
  }

  if (values.get('mcp-coco-index') !== 'excluded') {
    return null;
  }

  const skillsValue = values.get('skills');
  let includedSkillsList: IncludedSkillsList;
  if (skillsValue === 'all') {
    includedSkillsList = 'all';
  } else if (skillsValue === 'none') {
    includedSkillsList = 'none';
  } else {
    const match = skillsValue?.match(/^list\[(.*)\]$/);
    if (!match) {
      return null;
    }
    includedSkillsList = match[1].length > 0 ? normalizeSkillList(match[1].split(',')) : 'none';
  }

  return buildIndexScopePolicy({
    includedSkillsList,
    includeAgents: values.get('agents') === 'all',
    includeCommands: values.get('commands') === 'all',
    includeSpecs: values.get('specs') === 'all',
    includePlugins: values.get('plugins') === 'all',
    source: isIndexScopePolicySource(input.source) ? input.source : 'default',
  });
}
