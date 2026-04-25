import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { describe, expect, it } from 'vitest';

const repoRoot = path.resolve(process.cwd(), '../../../..');
const campaignRoot = path.join(
  repoRoot,
  '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor',
);

const migrationDescriptionFolders = [
  '001-search-and-routing-tuning/001-search-fusion-tuning',
  '001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty',
  '001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry',
  '001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile',
  '001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum',
  '001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment',
  '001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation',
  '001-search-and-routing-tuning/002-content-routing-accuracy',
  '001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion',
  '001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion',
  '001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier',
  '001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment',
  '001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety',
  '001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment',
  '001-search-and-routing-tuning/003-graph-metadata-validation',
  '001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation',
  '001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files',
  '001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities',
  '001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files',
  '001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment',
  '001-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution',
  '001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements',
  '002-skill-advisor-graph/005-repo-wide-path-migration',
  '002-skill-advisor-graph/007-skill-graph-auto-setup',
  '004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy',
];

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(campaignRoot, relativePath), 'utf8');
}

function expectRelativeReferenceToExist(documentRelativePath: string, reference: string): void {
  const documentPath = path.join(campaignRoot, documentRelativePath);
  const resolved = path.resolve(path.dirname(documentPath), reference);
  expect(fs.existsSync(resolved), `${reference} from ${documentRelativePath}`).toBe(true);
}

describe('006 campaign migration lineage remediation', () => {
  it('keeps description parentChain aligned with the live specFolder route', () => {
    for (const folder of migrationDescriptionFolders) {
      const description = readJson<{ specFolder: string; parentChain: string[] }>(
        path.join(campaignRoot, folder, 'description.json'),
      );
      const expectedParentChain = description.specFolder.split('/').slice(0, -1);

      expect(description.parentChain, folder).toEqual(expectedParentChain);
      expect(description.parentChain.join('/'), folder).not.toMatch(
        /010-search-and-routing-tuning|011-skill-advisor-graph|021-smart-router-context-efficacy/,
      );
    }
  });

  it('keeps packet-local migration docs anchored to current paths', () => {
    const prompt = readText('001-search-and-routing-tuning/001-search-fusion-tuning/prompts/deep-research-prompt.md');
    expect(prompt).toContain(
      '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning',
    );
    expect(prompt).not.toContain('002-continuity-memory-runtime/003-continuity-refactor-gates');

    expectRelativeReferenceToExist(
      '001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum/plan.md',
      '../../../../research/010-search-and-routing-tuning-pt-01/research.md',
    );
    expectRelativeReferenceToExist(
      '001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion/plan.md',
      '../../../../research/010-search-and-routing-tuning-pt-02/research.md',
    );
    expectRelativeReferenceToExist(
      '004-smart-router-context-efficacy/spec.md',
      '../../research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl',
    );

    const docSurfaceFiles = ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'implementation-summary.md'];
    for (const file of docSurfaceFiles) {
      const text = readText(`001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment/${file}`);
      expect(text, file).not.toContain('018 phase 004');
      expect(text, file).not.toContain('018-phase-004-doc-surface-alignment');
    }
  });

  it('records completed smart-router research state under the current 004 lineage', () => {
    const initialConfig = readJson<{ specFolder: string; status: string; lineage: { sessionId: string } }>(
      path.join(campaignRoot, '004-smart-router-context-efficacy/001-initial-research/research/deep-research-config.json'),
    );
    expect(initialConfig.specFolder).toBe(
      'system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/004-smart-router-context-efficacy/001-initial-research',
    );
    expect(initialConfig.status).toBe('complete');
    expect(initialConfig.lineage.sessionId).toBe('004-001-r01');

    const initialState = readText('004-smart-router-context-efficacy/001-initial-research/research/deep-research-state.jsonl');
    expect(initialState).toContain(
      '"specFolder":"system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/004-smart-router-context-efficacy/001-initial-research"',
    );
    expect(initialState).not.toContain('021-smart-router-context-efficacy');
    expect(initialState).toContain('"sessionId":"004-001-r01"');

    const childConfig = readJson<{ specFolder: string; status: string; lineage: { sessionId: string } }>(
      path.join(campaignRoot, '004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy/research/deep-research-config.json'),
    );
    expect(childConfig.specFolder).toBe(
      'system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy',
    );
    expect(childConfig.status).toBe('complete');
    expect(childConfig.lineage.sessionId).toBe('004-002-r01');

    const childState = readText('004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy/research/deep-research-state.jsonl');
    expect(childState).not.toContain('021-smart-router-context-efficacy');
    expect(childState).toContain('"sessionId":"004-002-r01"');
  });

  it('does not silently fall back to the legacy skill-graph.json runtime artifact', () => {
    const scriptPath = path.join(
      repoRoot,
      '.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py',
    );
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'advisor-graph-fallback-'));
    const sqlitePath = path.join(tmpDir, 'missing-skill-graph.sqlite');
    const jsonPath = path.join(tmpDir, 'skill-graph.json');
    fs.writeFileSync(
      jsonPath,
      JSON.stringify({
        schema_version: 1,
        generated_at: '2026-04-21T00:00:00Z',
        skill_count: 1,
        families: {},
        adjacency: {},
        signals: {},
        conflicts: [],
        hub_skills: [],
      }),
    );

    const probe = [
      'import importlib.util, json',
      `spec = importlib.util.spec_from_file_location("advisor", ${JSON.stringify(scriptPath)})`,
      'advisor = importlib.util.module_from_spec(spec)',
      'spec.loader.exec_module(advisor)',
      `advisor.SKILL_GRAPH_SQLITE_PATH = ${JSON.stringify(sqlitePath)}`,
      `advisor.SKILL_GRAPH_PATH = ${JSON.stringify(jsonPath)}`,
      'advisor._SKILL_GRAPH = None',
      'advisor._SKILL_GRAPH_SOURCE = None',
      'loaded = advisor._load_skill_graph()',
      'health = advisor.health_check()',
      'print(json.dumps({"loaded": loaded is not None, "source": advisor._SKILL_GRAPH_SOURCE, "error": health.get("skill_graph_error")}))',
    ].join('\n');

    const output = execFileSync('python3', ['-c', probe], { encoding: 'utf8' });
    const result = JSON.parse(output) as { loaded: boolean; source: string | null; error: string };

    expect(result).toEqual({
      loaded: false,
      source: null,
      error: 'sqlite_missing_json_ignored',
    });
  });
});
