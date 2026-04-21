// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Graph Evidence Calibration Tests
// ───────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..', '..', '..', '..', '..', '..');
const advisorPath = resolve(
  repoRoot,
  '.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py',
);

describe('advisor graph evidence calibration', () => {
  it('lowers uncertainty when graph evidence is the majority signal', () => {
    const script = `
import importlib.util
import json

spec = importlib.util.spec_from_file_location("skill_advisor", ${JSON.stringify(advisorPath)})
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

recommendations = [{
    "skill": "system-spec-kit",
    "confidence": 0.90,
    "uncertainty": 0.40,
    "_num_matches": 4,
    "_graph_boost_count": 3,
}]
mod.apply_graph_evidence_calibration(recommendations)
print(json.dumps(recommendations[0]))
`;

    const result = spawnSync('python3', ['-c', script], {
      cwd: repoRoot,
      encoding: 'utf8',
    });

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    const recommendation = JSON.parse(result.stdout) as {
      confidence: number;
      uncertainty: number;
    };

    expect(recommendation.confidence).toBe(0.81);
    expect(recommendation.uncertainty).toBe(0.34);
  });
});
