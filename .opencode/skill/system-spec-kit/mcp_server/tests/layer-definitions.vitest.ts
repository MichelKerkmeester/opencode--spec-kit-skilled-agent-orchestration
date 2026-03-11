// ---------------------------------------------------------------
// TEST: LAYER DEFINITIONS
// ---------------------------------------------------------------

import { describe, it, expect, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as mod from '../lib/architecture/layer-definitions';
import type { LayerId, TaskType } from '../lib/architecture/layer-definitions';
import { checkSharedNeutrality, checkWrapperOnly } from '../../scripts/evals/check-architecture-boundaries';

function expectLayerInfo(value: ReturnType<typeof mod.getLayerInfo>) {
  expect(value).not.toBeNull();
  return value as NonNullable<typeof value>;
}

/* -------------------------------------------------------------
   TEST SUITES
---------------------------------------------------------------- */

describe('Layer Definitions Tests', () => {

  // 4.1 LAYER_DEFINITIONS CONSTANT

  describe('LAYER_DEFINITIONS Constant', () => {

    const LD = mod.LAYER_DEFINITIONS;

    it('T01: All 7 layers present', () => {
      const expectedLayers = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];
      const keys = Object.keys(LD);
      const allPresent = expectedLayers.every(l => l in LD);
      expect(allPresent).toBe(true);
      expect(keys.length).toBe(7);
    });

    it('T02: Each layer has all required fields', () => {
      const requiredFields = ['id', 'name', 'description', 'tokenBudget', 'priority', 'useCase', 'tools'];
      for (const [, layer] of Object.entries(LD)) {
        const missing = requiredFields.filter(field => !(field in layer));
        expect(missing).toEqual([]);
      }
    });

    it('T03: Layer IDs match their keys', () => {
      for (const [key, layer] of Object.entries(LD)) {
        expect(layer.id).toBe(key);
      }
    });

    it('T04: Layer names match expected values', () => {
      const expectedNames: Record<string, string> = {
        L1: 'Orchestration', L2: 'Core', L3: 'Discovery',
        L4: 'Mutation', L5: 'Lifecycle', L6: 'Analysis', L7: 'Maintenance',
      };
      for (const [layerId, expectedName] of Object.entries(expectedNames) as [LayerId, string][]) {
        expect(LD[layerId]?.name).toBe(expectedName);
      }
    });

    it('T05: Priorities are unique and sequential 1-7', () => {
      const priorities = Object.values(LD).map(layer => layer.priority).sort((a, b) => a - b);
      expect(priorities).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('T06: Token budgets are positive numbers', () => {
      for (const [, layer] of Object.entries(LD)) {
        const budget = layer.tokenBudget;
        expect(typeof budget).toBe('number');
        expect(budget).toBeGreaterThan(0);
      }
    });

    it('T07: Tools arrays are non-empty', () => {
      for (const [, layer] of Object.entries(LD)) {
        const tools = layer.tools;
        expect(Array.isArray(tools)).toBe(true);
        expect(tools.length).toBeGreaterThan(0);
      }
    });

    it('T08: Specific token budget values match', () => {
      const expectedBudgets: Record<string, number> = {
        L1: 2000, L2: 1500, L3: 800, L4: 500, L5: 600, L6: 1200, L7: 1000,
      };
      for (const [layerId, expected] of Object.entries(expectedBudgets) as [LayerId, number][]) {
        expect(LD[layerId]?.tokenBudget).toBe(expected);
      }
    });
  });

  // 4.2 TOOL_LAYER_MAP CONSTANT

  describe('TOOL_LAYER_MAP Constant', () => {

    const TLM = mod.TOOL_LAYER_MAP;
    const LD = mod.LAYER_DEFINITIONS;

    it('T09: TOOL_LAYER_MAP is a plain object', () => {
      expect(typeof TLM).toBe('object');
      expect(TLM).not.toBeNull();
      expect(Array.isArray(TLM)).toBe(false);
    });

    it('T10: All tools from LAYER_DEFINITIONS are mapped', () => {
      const allTools: string[] = [];
      for (const layer of Object.values(LD)) {
        allTools.push(...layer.tools);
      }
      const missing = allTools.filter(t => !(t in TLM));
      expect(missing).toEqual([]);
    });

    it('T11: Specific tool-to-layer mappings are correct', () => {
      const expectedMappings: Record<string, string> = {
        memory_context: 'L1',
        memory_search: 'L2',
        memory_save: 'L2',
        memory_match_triggers: 'L2',
        memory_list: 'L3',
        memory_stats: 'L3',
        memory_health: 'L3',
        memory_update: 'L4',
        memory_delete: 'L4',
        memory_validate: 'L4',
        checkpoint_create: 'L5',
        checkpoint_list: 'L5',
        checkpoint_restore: 'L5',
        checkpoint_delete: 'L5',
        memory_drift_why: 'L6',
        memory_causal_link: 'L6',
        memory_causal_stats: 'L6',
        memory_causal_unlink: 'L6',
        task_preflight: 'L6',
        task_postflight: 'L6',
        memory_index_scan: 'L7',
        memory_get_learning_history: 'L7',
      };
      for (const [tool, expectedLayer] of Object.entries(expectedMappings)) {
        expect(TLM[tool]).toBe(expectedLayer);
      }
    });

    it('T12: All map values are valid LayerIds', () => {
      const validLayers = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];
      for (const [tool, layer] of Object.entries(TLM)) {
        expect(validLayers).toContain(layer);
      }
    });
  });

  // 4.3 getLayerPrefix()

  describe('getLayerPrefix()', () => {

    it('T13: Known tools return correct prefix format', () => {
      const testCases = [
        { tool: 'memory_context', expected: '[L1:Orchestration]' },
        { tool: 'memory_search', expected: '[L2:Core]' },
        { tool: 'memory_list', expected: '[L3:Discovery]' },
        { tool: 'memory_update', expected: '[L4:Mutation]' },
        { tool: 'checkpoint_create', expected: '[L5:Lifecycle]' },
        { tool: 'memory_drift_why', expected: '[L6:Analysis]' },
        { tool: 'memory_index_scan', expected: '[L7:Maintenance]' },
      ];
      for (const { tool, expected } of testCases) {
        expect(mod.getLayerPrefix(tool)).toBe(expected);
      }
    });

    it('T14: Unknown tool returns empty string', () => {
      expect(mod.getLayerPrefix('nonexistent_tool')).toBe('');
    });

    it('T15: Empty string input returns empty string', () => {
      expect(mod.getLayerPrefix('')).toBe('');
    });
  });

  // 4.4 enhanceDescription()

  describe('enhanceDescription()', () => {

    it('T16: Known tool prepends layer prefix', () => {
      const result = mod.enhanceDescription('memory_context', 'Some description text');
      expect(result).toBe('[L1:Orchestration] Some description text');
    });

    it('T17: Multiple tools produce correct enhanced descriptions', () => {
      const cases = [
        { tool: 'memory_search', desc: 'Search memories', prefix: '[L2:Core]' },
        { tool: 'memory_delete', desc: 'Delete a memory', prefix: '[L4:Mutation]' },
        { tool: 'task_preflight', desc: 'Capture baseline', prefix: '[L6:Analysis]' },
      ];
      for (const { tool, desc, prefix } of cases) {
        expect(mod.enhanceDescription(tool, desc)).toBe(`${prefix} ${desc}`);
      }
    });

    it('T18: Unknown tool returns description unchanged', () => {
      const desc = 'Original description';
      expect(mod.enhanceDescription('unknown_tool', desc)).toBe(desc);
    });

    it('T19: Empty description with known tool gets prefix', () => {
      expect(mod.enhanceDescription('memory_context', '')).toBe('[L1:Orchestration] ');
    });
  });

  // 4.5 getTokenBudget()

  describe('getTokenBudget()', () => {

    it('T20: Known tools return correct token budgets', () => {
      const cases = [
        { tool: 'memory_context', expected: 2000 },
        { tool: 'memory_search', expected: 1500 },
        { tool: 'memory_list', expected: 800 },
        { tool: 'memory_update', expected: 500 },
        { tool: 'checkpoint_create', expected: 600 },
        { tool: 'memory_drift_why', expected: 1200 },
        { tool: 'memory_index_scan', expected: 1000 },
      ];
      for (const { tool, expected } of cases) {
        expect(mod.getTokenBudget(tool)).toBe(expected);
      }
    });

    it('T21: Unknown tool returns default budget 1000', () => {
      expect(mod.getTokenBudget('nonexistent_tool')).toBe(1000);
    });

    it('T22: Return type is always number', () => {
      expect(typeof mod.getTokenBudget('memory_context')).toBe('number');
      expect(typeof mod.getTokenBudget('fake_tool')).toBe('number');
    });
  });

  // 4.6 getLayerInfo()

  describe('getLayerInfo()', () => {

    it('T23: Known tool returns full layer definition', () => {
      const info = expectLayerInfo(mod.getLayerInfo('memory_context'));
      expect(info).toBeDefined();
      expect(info.id).toBe('L1');
      expect(info.name).toBe('Orchestration');
      expect(info.tokenBudget).toBe(2000);
      expect(info.priority).toBe(1);
      expect(Array.isArray(info.tools)).toBe(true);
      expect(info.tools).toContain('memory_context');
    });

    it('T24: Returns a copy, not a reference', () => {
      const info1 = mod.getLayerInfo('memory_context');
      const info2 = mod.getLayerInfo('memory_context');
      expect(info1).not.toBe(info2);
    });

    it('T25: Unknown tool returns null', () => {
      expect(mod.getLayerInfo('nonexistent_tool')).toBeNull();
    });

    it('T26: Returned object has all required fields', () => {
      const info = expectLayerInfo(mod.getLayerInfo('memory_search'));
      const requiredFields = ['id', 'name', 'description', 'tokenBudget', 'priority', 'useCase', 'tools'];
      const missing = requiredFields.filter(f => !(f in info));
      expect(missing).toEqual([]);
    });
  });

  // 4.7 getLayersByPriority()

  describe('getLayersByPriority()', () => {

    it('T27: Returns array of 7 layers', () => {
      const layers = mod.getLayersByPriority();
      expect(Array.isArray(layers)).toBe(true);
      expect(layers.length).toBe(7);
    });

    it('T28: Sorted ascending by priority', () => {
      const layers = mod.getLayersByPriority();
      const priorities = layers.map(layer => layer.priority);
      for (let i = 1; i < priorities.length; i++) {
        expect(priorities[i]).toBeGreaterThanOrEqual(priorities[i - 1]);
      }
      expect(priorities[0]).toBe(1);
      expect(priorities[6]).toBe(7);
    });

    it('T29: First=L1 Orchestration, Last=L7 Maintenance', () => {
      const layers = mod.getLayersByPriority();
      expect(layers[0].id).toBe('L1');
      expect(layers[0].name).toBe('Orchestration');
      expect(layers[layers.length - 1].id).toBe('L7');
      expect(layers[layers.length - 1].name).toBe('Maintenance');
    });
  });

  // 4.8 getRecommendedLayers()

  describe('getRecommendedLayers()', () => {

    it('T30: Each task type returns correct recommended layers', () => {
      const expectations: Record<string, string[]> = {
        search: ['L1', 'L2'],
        browse: ['L3', 'L2'],
        modify: ['L4', 'L3'],
        checkpoint: ['L5'],
        analyze: ['L6', 'L2'],
        maintenance: ['L7', 'L3'],
        default: ['L1', 'L3', 'L2'],
      };
      for (const [taskType, expected] of Object.entries(expectations) as [TaskType, LayerId[]][]) {
        expect(mod.getRecommendedLayers(taskType)).toEqual(expected);
      }
    });

    it('T31: Returns arrays of valid LayerIds', () => {
      const result = mod.getRecommendedLayers('search');
      const validLayers = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];
      expect(Array.isArray(result)).toBe(true);
      for (const l of result) {
        expect(validLayers).toContain(l);
      }
    });

    it('T32: Unknown task type falls back to default', () => {
      const result = mod.getRecommendedLayers('unknown_task_type' as TaskType);
      const defaultResult = mod.getRecommendedLayers('default');
      expect(result).toEqual(defaultResult);
    });

    it('T33: All task types return non-empty arrays', () => {
      const taskTypes: TaskType[] = ['search', 'browse', 'modify', 'checkpoint', 'analyze', 'maintenance', 'default'];
      for (const task of taskTypes) {
        const result = mod.getRecommendedLayers(task);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      }
    });
  });

  // 4.9 getLayerDocumentation()

  describe('getLayerDocumentation()', () => {

    it('T34: Returns a non-empty string', () => {
      const doc = mod.getLayerDocumentation();
      expect(typeof doc).toBe('string');
      expect(doc.length).toBeGreaterThan(0);
    });

    it('T35: Contains main heading', () => {
      const doc = mod.getLayerDocumentation();
      expect(doc).toContain('# Memory System Layer Architecture');
    });

    it('T36: Contains all 7 layer sections in order', () => {
      const doc = mod.getLayerDocumentation();
      const layerHeaders = [
        '## L1: Orchestration',
        '## L2: Core',
        '## L3: Discovery',
        '## L4: Mutation',
        '## L5: Lifecycle',
        '## L6: Analysis',
        '## L7: Maintenance',
      ];

      let lastIndex = -1;
      for (const header of layerHeaders) {
        const idx = doc.indexOf(header);
        expect(idx).toBeGreaterThan(lastIndex);
        lastIndex = idx;
      }
    });

    it('T37: Contains Token Budget lines for each layer', () => {
      const doc = mod.getLayerDocumentation();
      const budgetPatterns = [
        '**Token Budget:** 2000',
        '**Token Budget:** 1500',
        '**Token Budget:** 800',
        '**Token Budget:** 500',
        '**Token Budget:** 600',
        '**Token Budget:** 1200',
        '**Token Budget:** 1000',
      ];
      for (const pattern of budgetPatterns) {
        expect(doc).toContain(pattern);
      }
    });

    it('T38: Contains tool names in documentation', () => {
      const doc = mod.getLayerDocumentation();
      const toolSamples = ['memory_context', 'memory_search', 'memory_list',
                           'memory_update', 'checkpoint_create', 'memory_drift_why',
                           'memory_index_scan'];
      for (const tool of toolSamples) {
        expect(doc).toContain(tool);
      }
    });
  });

  // 4.10 Architecture boundary enforcement checks

  describe('Architecture Boundary Enforcement', () => {
    const fixtureRoots: string[] = [];

    function createFixtureRoot(): string {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'arch-boundary-fixture-'));
      fixtureRoots.push(root);
      fs.mkdirSync(path.join(root, 'shared'), { recursive: true });
      fs.mkdirSync(path.join(root, 'mcp_server', 'scripts'), { recursive: true });
      fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
      return root;
    }

    function writeFixtureFile(root: string, relativePath: string, content: string): void {
      const filePath = path.join(root, relativePath);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, content, 'utf-8');
    }

    afterEach(() => {
      while (fixtureRoots.length > 0) {
        const root = fixtureRoots.pop();
        if (root) {
          fs.rmSync(root, { recursive: true, force: true });
        }
      }
    });

    it('T39: GAP A detects shared -> mcp_server/scripts imports across syntax variants', () => {
      const root = createFixtureRoot();

      writeFixtureFile(root, 'shared/named-multiline.ts', [
        'import {',
        '  runtimeA,',
        '  runtimeB,',
        "} from '../mcp_server/runtime';",
        'export { runtimeA, runtimeB };',
      ].join('\n'));

      writeFixtureFile(root, 'shared/default-import.ts', [
        "import tool from '../scripts/tool-default';",
        'export default tool;',
      ].join('\n'));

      writeFixtureFile(root, 'shared/namespace-import.ts', [
        "import * as tooling from '../scripts/tool-namespace';",
        'export { tooling };',
      ].join('\n'));

      writeFixtureFile(root, 'shared/dynamic-import.ts', [
        'export async function loadRuntime() {',
        "  return import('../mcp_server/dynamic-runtime');",
        '}',
      ].join('\n'));

      const violations = checkSharedNeutrality(root);
      const importPaths = violations.map((v) => v.importPath);

      expect(importPaths).toEqual(expect.arrayContaining([
        '../mcp_server/runtime',
        '../scripts/tool-default',
        '../scripts/tool-namespace',
        '../mcp_server/dynamic-runtime',
      ]));
      expect(violations.length).toBe(4);
    });

    it('T40: GAP B flags wrappers exceeding 50 substantive lines', () => {
      const root = createFixtureRoot();
      const body = Array.from({ length: 55 }, (_, idx) => `const value${idx} = ${idx};`).join('\n');

      writeFixtureFile(root, 'mcp_server/scripts/too-long.ts', [
        "import { spawnSync } from 'child_process';",
        "const targetScript = '../../scripts/dist/memory/cli.js';",
        body,
        "spawnSync(process.execPath, [targetScript], { stdio: 'inherit' });",
      ].join('\n'));

      const violations = checkWrapperOnly(root);
      const violation = violations.find((v) => v.file.endsWith(path.join('mcp_server', 'scripts', 'too-long.ts')));

      expect(violation).toBeDefined();
      expect(violation?.reasons.join(' ')).toContain('substantive lines (max 50)');
    });

    it('T41: GAP B flags wrappers missing child_process import', () => {
      const root = createFixtureRoot();

      writeFixtureFile(root, 'mcp_server/scripts/no-child-process.ts', [
        "const targetScript = '../../scripts/dist/memory/cli.js';",
        'export function getTarget() {',
        '  return targetScript;',
        '}',
      ].join('\n'));

      const violations = checkWrapperOnly(root);
      const violation = violations.find((v) => v.file.endsWith(path.join('mcp_server', 'scripts', 'no-child-process.ts')));

      expect(violation).toBeDefined();
      expect(violation?.reasons).toContain('missing child_process import');
    });

    it('T42: GAP B flags wrappers missing scripts/dist reference', () => {
      const root = createFixtureRoot();

      writeFixtureFile(root, 'mcp_server/scripts/no-dist-reference.ts', [
        "import { spawnSync } from 'child_process';",
        "const targetScript = '../memory/cli.js';",
        "spawnSync(process.execPath, [targetScript], { stdio: 'inherit' });",
      ].join('\n'));

      const violations = checkWrapperOnly(root);
      const violation = violations.find((v) => v.file.endsWith(path.join('mcp_server', 'scripts', 'no-dist-reference.ts')));

      expect(violation).toBeDefined();
      expect(violation?.reasons).toContain('no reference to scripts/dist/');
    });

    it('T43: GAP B catches wrapper bypasses (barrel re-exports and scripts import without spawn/exec)', () => {
      const root = createFixtureRoot();

      writeFixtureFile(root, 'mcp_server/scripts/barrel-export.ts', [
        "export * from '../../scripts/dist/memory/reindex-embeddings.js';",
      ].join('\n'));

      writeFixtureFile(root, 'mcp_server/scripts/no-spawn-usage.ts', [
        "import { spawnSync } from 'child_process';",
        "import '../../scripts/dist/memory/reindex-embeddings.js';",
        'const forwarded = spawnSync;',
        'void forwarded;',
      ].join('\n'));

      const violations = checkWrapperOnly(root);
      const barrel = violations.find((v) => v.file.endsWith(path.join('mcp_server', 'scripts', 'barrel-export.ts')));
      const noSpawn = violations.find((v) => v.file.endsWith(path.join('mcp_server', 'scripts', 'no-spawn-usage.ts')));

      expect(barrel).toBeDefined();
      expect(barrel?.reasons).toContain('missing child_process import');
      expect(barrel?.reasons).toContain('no child_process spawn/exec usage');

      expect(noSpawn).toBeDefined();
      expect(noSpawn?.reasons).toContain('no child_process spawn/exec usage');
    });

    it('T44: legitimate thin wrappers pass GAP B checks', () => {
      const root = createFixtureRoot();

      writeFixtureFile(root, 'mcp_server/scripts/valid-wrapper.ts', [
        "import { spawnSync } from 'child_process';",
        "import path from 'path';",
        "const targetScript = path.resolve(__dirname, '../../scripts/dist/memory/reindex-embeddings.js');",
        "const result = spawnSync(process.execPath, [targetScript, ...process.argv.slice(2)], { stdio: 'inherit' });",
        "if (typeof result.status === 'number') {",
        '  process.exit(result.status);',
        '}',
        'process.exit(1);',
      ].join('\n'));

      const violations = checkWrapperOnly(root);
      expect(violations).toEqual([]);
    });

    it('T45: valid mcp_server/scripts -> shared imports are not false positives', () => {
      const root = createFixtureRoot();

      writeFixtureFile(root, 'shared/utils.ts', [
        'export const sharedValue = 42;',
      ].join('\n'));

      writeFixtureFile(root, 'shared/consumer.ts', [
        "import { sharedValue } from './utils';",
        'export const value = sharedValue;',
      ].join('\n'));

      writeFixtureFile(root, 'mcp_server/lib/consumer.ts', [
        "import { sharedValue } from '../../shared/utils';",
        'export const fromMcp = sharedValue;',
      ].join('\n'));

      writeFixtureFile(root, 'scripts/use-shared.ts', [
        "import { sharedValue } from '../shared/utils';",
        'export const fromScripts = sharedValue;',
      ].join('\n'));

      const gapAViolations = checkSharedNeutrality(root);
      expect(gapAViolations).toEqual([]);
    });
  });
});
