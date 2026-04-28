// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph DB Test Fixtures
// ───────────────────────────────────────────────────────────────

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function writeGraphMetadata(
  skillRoot: string,
  skillId: string,
  edges: Record<string, unknown[]> = {},
): void {
  const skillDir = join(skillRoot, skillId);
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, 'graph-metadata.json'), JSON.stringify({
    schema_version: 1,
    skill_id: skillId,
    family: 'system',
    category: 'test',
    domains: ['test'],
    intent_signals: [skillId],
    derived: {},
    edges,
  }), 'utf8');
}
