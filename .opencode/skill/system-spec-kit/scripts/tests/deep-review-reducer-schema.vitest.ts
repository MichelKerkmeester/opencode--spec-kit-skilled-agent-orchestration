import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import yaml from 'js-yaml';
import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');

function readWorkspaceFile(relativePath: string): string {
  return fs.readFileSync(path.join(WORKSPACE_ROOT, relativePath), 'utf8');
}

describe('deep-review reducer and schema contract', () => {
  it('keeps reducer, severity, and release-readiness schemas stable in the canonical assets', () => {
    const contract = yaml.load(
      readWorkspaceFile('.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml'),
    ) as Record<string, any>;
    const config = JSON.parse(
      readWorkspaceFile('.opencode/skill/sk-deep-review/assets/deep_review_config.json'),
    ) as Record<string, any>;

    expect(contract.contract.severities.map((item: { id: string }) => item.id)).toEqual(['P0', 'P1', 'P2']);
    expect(contract.contract.severities.map((item: { weight: number }) => item.weight)).toEqual([10, 5, 1]);

    expect(contract.contract.reducer.enabled).toBe(true);
    expect(contract.contract.reducer.inputs).toEqual([
      'latestJSONLDelta',
      'newIterationFile',
      'priorReducedState',
    ]);
    expect(contract.contract.reducer.outputs).toEqual([
      'findingsRegistry',
      'dashboardMetrics',
      'strategyUpdates',
    ]);
    expect(contract.contract.reducer.idempotent).toBe(true);

    expect(contract.contract.releaseReadinessStates.map((item: { id: string }) => item.id)).toEqual([
      'in-progress',
      'converged',
      'release-blocking',
    ]);
    expect(contract.contract.outputs.config.pathPattern).toContain('deep-review-config.json');
    expect(contract.contract.outputs.findingsRegistry.pathPattern).toContain('deep-review-findings-registry.json');
    expect(contract.contract.outputs.pauseSentinel.pathPattern).toContain('.deep-review-pause');
    expect(contract.contract.outputs.jsonl.pathPattern).toContain('deep-review-state.jsonl');

    expect(config.releaseReadinessState).toBe('in-progress');
    expect(config.reducer.inputs).toEqual(['latestJSONLDelta', 'newIterationFile', 'priorReducedState']);
    expect(config.reducer.outputs).toEqual(['findingsRegistry', 'dashboardMetrics', 'strategyUpdates']);
    expect(config.reducer.metrics).toEqual([
      'dimensionsCovered',
      'findingsBySeverity',
      'openFindings',
      'resolvedFindings',
      'convergenceScore',
    ]);
    expect(config.fileProtection['deep-review-findings-registry.json']).toBe('auto-generated');
    expect(config.fileProtection['.deep-review-pause']).toBe('operator-controlled');
  });

  it('wires reducer refresh and machine-owned report guidance into both review workflows', () => {
    const autoYaml = readWorkspaceFile('.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml');
    const confirmYaml = readWorkspaceFile('.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml');

    for (const [docPath, content] of [
      ['auto', autoYaml],
      ['confirm', confirmYaml],
    ] as const) {
      expect(content, `${docPath} workflow should include reducer refresh step`).toContain('step_reduce_review_state:');
      expect(content, `${docPath} workflow should read the canonical state log`).toContain(
        '"{spec_folder}/review/deep-review-state.jsonl"',
      );
      expect(content, `${docPath} workflow should read the findings registry`).toContain(
        '"{spec_folder}/review/deep-review-findings-registry.json"',
      );
      expect(content, `${docPath} workflow should write the findings registry`).toContain(
        'write: "{spec_folder}/review/deep-review-findings-registry.json"',
      );
      expect(content, `${docPath} workflow should treat reducer reruns as idempotent`).toContain('idempotent');
      expect(content, `${docPath} workflow should carry release readiness through synthesis`).toContain(
        'releaseReadinessState',
      );
      expect(content, `${docPath} workflow should preserve machine-owned report markers`).toContain(
        'Preserve machine-owned markers so completed-continue can snapshot and reopen without mutating prior synthesis.',
      );
    }
  });

  it('documents reducer metrics and machine-owned report boundaries in the review references', () => {
    const stateFormat = readWorkspaceFile('.opencode/skill/sk-deep-review/references/state_format.md');
    const loopProtocol = readWorkspaceFile('.opencode/skill/sk-deep-review/references/loop_protocol.md');
    const convergence = readWorkspaceFile('.opencode/skill/sk-deep-review/references/convergence.md');

    expect(stateFormat).toContain('deep-review-findings-registry.json');
    expect(stateFormat).toContain('releaseReadinessState');
    expect(stateFormat).toContain('convergenceScore');
    expect(stateFormat).toContain('review-report-v*.md');

    expect(loopProtocol).toContain('latestJSONLDelta');
    expect(loopProtocol).toContain('dashboardMetrics');
    expect(loopProtocol).toContain('strategyUpdates');
    expect(loopProtocol).toContain('completed-continue');

    expect(convergence).toContain('release-blocking');
    expect(convergence).toContain('converged');
    expect(convergence).toContain('in-progress');
  });
});
