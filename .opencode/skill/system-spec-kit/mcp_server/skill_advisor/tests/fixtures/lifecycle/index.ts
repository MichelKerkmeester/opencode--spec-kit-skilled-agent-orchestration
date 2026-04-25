// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Lifecycle Test Fixtures
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// FIXTURES: Lifecycle Metadata
// ───────────────────────────────────────────────────────────────

export const lifecycleFixtures = {
  superseded: {
    skillId: 'sk-x-v1',
    redirectTo: 'sk-x-v2',
    lifecycleStatus: 'deprecated',
  },
  successor: {
    skillId: 'sk-x-v2',
    redirectFrom: ['sk-x-v1'],
    lifecycleStatus: 'active',
  },
  archived: {
    skillId: 'archived-skill',
    sourcePath: '.opencode/skill/z_archive/archived-skill/graph-metadata.json',
    lifecycleStatus: 'archived',
  },
  future: {
    skillId: 'future-skill',
    sourcePath: '.opencode/skill/z_future/future-skill/graph-metadata.json',
    lifecycleStatus: 'future',
  },
  rolledBack: {
    schema_version: 1,
    skill_id: 'rolled-back-skill',
    intent_signals: ['rolled back'],
  },
  mixedVersion: [
    { schema_version: 1, skill_id: 'v1-skill', intent_signals: ['legacy route'] },
    { schema_version: 2, skill_id: 'v2-skill', intent_signals: ['modern route'] },
  ],
} as const;

