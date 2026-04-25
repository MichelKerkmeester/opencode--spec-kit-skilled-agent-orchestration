import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  formatMeasurementReport,
  predictSmartRouterRoute,
  runMeasurement,
  type CorpusRow,
} from '../../scripts/observability/smart-router-measurement';
import type { AdvisorHookResult } from '../skill_advisor/lib/skill-advisor-brief.js';

const roots = new Set<string>();

function tempWorkspace(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'smart-router-measurement-'));
  roots.add(root);
  fs.mkdirSync(path.join(root, '.opencode', 'skill'), { recursive: true });
  return root;
}

function writeSkill(root: string, skill: string, content: string, resources: readonly string[] = []): void {
  const skillDir = path.join(root, '.opencode', 'skill', skill);
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(path.join(skillDir, 'SKILL.md'), content, 'utf8');
  for (const resource of resources) {
    const resourcePath = path.join(skillDir, resource);
    fs.mkdirSync(path.dirname(resourcePath), { recursive: true });
    fs.writeFileSync(resourcePath, `# ${resource}\n`, 'utf8');
  }
}

function advisorResult(skill: string, confidence = 0.91, uncertainty = 0.1): AdvisorHookResult {
  return {
    status: 'ok',
    freshness: 'live',
    brief: `Advisor: use ${skill} (confidence ${confidence.toFixed(2)}, uncertainty ${uncertainty.toFixed(2)}).`,
    recommendations: [{
      skill,
      confidence,
      uncertainty,
      passes_threshold: true,
    }],
    diagnostics: null,
    metrics: {
      durationMs: 1,
      cacheHit: false,
      subprocessInvoked: false,
      retriesAttempted: 0,
      recommendationCount: 1,
      tokenCap: 80,
    },
    generatedAt: '2026-04-19T20:45:00.000Z',
    sharedPayload: null,
  };
}

const routedSkill = [
  '# Routed Skill',
  '',
  '<!-- ANCHOR:smart-routing -->',
  '### Smart Router Pseudocode',
  '',
  '```python',
  'DEFAULT_RESOURCE = "references/shared/universal_patterns.md"',
  'INTENT_SIGNALS = {',
  '    "TYPESCRIPT": {"weight": 3, "keywords": ["typescript", "tsc"]},',
  '    "CONFIG": {"weight": 2, "keywords": ["json", "config"]},',
  '}',
  'RESOURCE_MAP = {',
  '    "TYPESCRIPT": ["references/typescript/style_guide.md"],',
  '    "CONFIG": ["references/config/json.md"],',
  '}',
  'LOADING_LEVELS = {',
  '    "ALWAYS": [DEFAULT_RESOURCE],',
  '    "ON_DEMAND_KEYWORDS": ["full checklist"],',
  '    "ON_DEMAND": ["assets/checklists/typescript_checklist.md"],',
  '}',
  '```',
  '<!-- /ANCHOR:smart-routing -->',
  '',
].join('\n');

afterEach(() => {
  for (const root of roots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  roots.clear();
});

describe('smart-router static measurement harness', () => {
  it('runs on a five-prompt subset fixture and computes advisor accuracy', async () => {
    const root = tempWorkspace();
    writeSkill(root, 'sk-code-opencode', routedSkill, [
      'references/shared/universal_patterns.md',
      'references/typescript/style_guide.md',
      'references/config/json.md',
      'assets/checklists/typescript_checklist.md',
    ]);
    writeSkill(root, 'sk-doc', routedSkill, [
      'references/shared/universal_patterns.md',
      'references/config/json.md',
    ]);

    const corpusRows: CorpusRow[] = [
      { id: 'p1', prompt: 'Implement TypeScript support', skill_top_1: 'sk-code-opencode' },
      { id: 'p2', prompt: 'Fix json config docs', skill_top_1: 'sk-doc' },
      { id: 'p3', prompt: 'Run the full checklist for tsc', skill_top_1: 'sk-code-opencode' },
      { id: 'p4', prompt: 'Update TypeScript examples', skill_top_1: 'sk-code-opencode' },
      { id: 'p5', prompt: 'Write docs', skill_top_1: 'sk-doc' },
    ];

    const summary = await runMeasurement({
      workspaceRoot: root,
      corpusRows,
      recordTelemetry: false,
      buildBrief: async (prompt) => advisorResult(prompt.includes('docs') || prompt.includes('json') ? 'sk-doc' : 'sk-code-opencode'),
    });

    expect(summary.totalPrompts).toBe(5);
    expect(summary.correct).toBe(5);
    expect(summary.accuracy).toBe(1);
    expect(summary.perSkill.find((row) => row.skill === 'sk-code-opencode')?.onDemandHits).toBe(1);
    expect(summary.allowedResourceDistribution).toHaveProperty('2');
  });

  it('formats valid markdown with the methodology caveat', async () => {
    const root = tempWorkspace();
    writeSkill(root, 'sk-code-opencode', routedSkill, [
      'references/shared/universal_patterns.md',
      'references/typescript/style_guide.md',
    ]);

    const summary = await runMeasurement({
      workspaceRoot: root,
      corpusRows: [{ id: 'p1', prompt: 'Implement TypeScript support', skill_top_1: 'sk-code-opencode' }],
      recordTelemetry: false,
      buildBrief: async () => advisorResult('sk-code-opencode'),
    });
    const markdown = formatMeasurementReport(summary);

    expect(markdown).toMatch(/^# Smart Router Static Measurement Report/);
    expect(markdown).toContain('Advisor top-1 accuracy vs corpus labels');
    expect(markdown).toContain('It does not measure actual AI tool reads');
  });

  it('records static compliance telemetry to the separated default stream', async () => {
    const root = tempWorkspace();
    writeSkill(root, 'sk-code-opencode', routedSkill, [
      'references/shared/universal_patterns.md',
      'references/typescript/style_guide.md',
    ]);

    await runMeasurement({
      workspaceRoot: root,
      corpusRows: [{ id: 'p1', prompt: 'Implement TypeScript support', skill_top_1: 'sk-code-opencode' }],
      recordTelemetry: true,
      buildBrief: async () => advisorResult('sk-code-opencode'),
    });

    const staticStream = path.join(root, '.opencode', 'reports', 'smart-router-static', 'compliance.jsonl');
    const liveStream = path.join(root, '.opencode', 'skill', '.smart-router-telemetry', 'compliance.jsonl');
    expect(fs.existsSync(staticStream)).toBe(true);
    expect(fs.existsSync(liveStream)).toBe(false);
    expect(fs.readFileSync(staticStream, 'utf8')).toContain('"promptId":"p1"');
  });

  it('falls back gracefully when a skill has no SMART ROUTING section', () => {
    const root = tempWorkspace();
    writeSkill(root, 'sk-no-router', '# No Router\n');

    const prediction = predictSmartRouterRoute({
      workspaceRoot: root,
      skill: 'sk-no-router',
      prompt: 'Implement TypeScript support',
    });

    expect(prediction.unknown).toBe(true);
    expect(prediction.predictedRoute).toEqual(['UNKNOWN']);
    expect(prediction.allowedResources).toEqual(['__unknown_unparsed__']);
  });
});
