import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  buildSpecAffinityTargets,
  evaluateCollectedDataSpecAffinity,
  matchesSpecAffinityText,
} from '../utils/spec-affinity';

const tempRoots: string[] = [];

function makeTempSpecRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-spec-affinity-'));
  tempRoots.push(root);
  return root;
}

afterEach(() => {
  while (tempRoots.length > 0) {
    fs.rmSync(tempRoots.pop()!, { recursive: true, force: true });
  }
});

describe('spec affinity evaluation', () => {
  it('derives exact phrases and file targets from a target spec folder', () => {
    const specRoot = path.join(makeTempSpecRoot(), '010-perfect-session-capturing');
    fs.mkdirSync(specRoot, { recursive: true });
    fs.writeFileSync(path.join(specRoot, 'description.json'), JSON.stringify({
      title: 'Perfect Session Capturing',
      triggerPhrases: ['perfect session capturing', 'stateless capture quality'],
    }), 'utf-8');
    fs.writeFileSync(
      path.join(specRoot, 'spec.md'),
      [
        '---',
        'title: "Perfect Session Capturing"',
        'trigger_phrases:',
        '  - "perfect session capturing"',
        '---',
        '',
        '## 3. SCOPE',
        '',
        '### Files to Change',
        '',
        '| File Path | Change Type | Description |',
        '|-----------|-------------|-------------|',
        '| `scripts/core/workflow.ts` | Modify | Tighten alignment guards |',
      ].join('\n'),
      'utf-8',
    );

    const targets = buildSpecAffinityTargets(specRoot);

    expect(targets.specId).toBe('010-perfect-session-capturing');
    expect(targets.exactPhrases).toEqual(expect.arrayContaining([
      '010 perfect session capturing',
      'perfect session capturing',
      'stateless capture quality',
    ]));
    expect(targets.fileTargets).toContain('scripts/core/workflow.ts');
  });

  it('treats exact file-target references inside command text as valid spec anchors', () => {
    const specRoot = path.join(makeTempSpecRoot(), '010-perfect-session-capturing');
    fs.mkdirSync(specRoot, { recursive: true });
    fs.writeFileSync(
      path.join(specRoot, 'spec.md'),
      [
        '## 3. SCOPE',
        '',
        '### Files to Change',
        '',
        '| File Path | Change Type | Description |',
        '|-----------|-------------|-------------|',
        '| `scripts/core/workflow.ts` | Modify | Tighten alignment guards |',
      ].join('\n'),
      'utf-8',
    );

    const targets = buildSpecAffinityTargets(specRoot);

    expect(matchesSpecAffinityText(
      "sed -n '680,760p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts",
      targets,
    )).toBe(true);
  });

  it('rejects same-workspace generic content when no spec-specific anchor is present', () => {
    const specRoot = path.join(makeTempSpecRoot(), '010-perfect-session-capturing');
    fs.mkdirSync(specRoot, { recursive: true });
    fs.writeFileSync(
      path.join(specRoot, 'spec.md'),
      [
        '---',
        'title: "Perfect Session Capturing"',
        '---',
        '## 3. SCOPE',
        '',
        '### Files to Change',
        '',
        '| File Path | Change Type | Description |',
        '|-----------|-------------|-------------|',
        '| `scripts/core/workflow.ts` | Modify | Tighten alignment guards |',
      ].join('\n'),
      'utf-8',
    );

    const result = evaluateCollectedDataSpecAffinity({
      userPrompts: [{ prompt: 'Route to the media editor and convert images to webp.' }],
      observations: [
        {
          title: 'Prepare media editor flow',
          narrative: 'Queued unrelated asset conversion work.',
          files: ['.opencode/skill/system-spec-kit/scripts/core/config.ts'],
        },
      ],
      FILES: [
        {
          FILE_PATH: '.opencode/skill/system-spec-kit/scripts/core/config.ts',
          DESCRIPTION: 'Generic infrastructure file touched during unrelated work.',
        },
      ],
    }, specRoot);

    expect(result.hasAnchor).toBe(false);
    expect(result.matchedFileTargets).toEqual([]);
    expect(result.matchedPhrases).toEqual([]);
  });

  it('filters single-word stopword trigger phrases from exact phrase anchors', () => {
    const specRoot = path.join(makeTempSpecRoot(), '010-generic-processing');
    fs.mkdirSync(specRoot, { recursive: true });
    fs.writeFileSync(
      path.join(specRoot, 'spec.md'),
      [
        '---',
        'title: "Generic Processing"',
        'trigger_phrases:',
        '  - "processing"',
        '---',
      ].join('\n'),
      'utf-8',
    );

    const targets = buildSpecAffinityTargets(specRoot);
    const result = evaluateCollectedDataSpecAffinity({
      userPrompts: [{ prompt: 'We are postprocessing images for export.' }],
      observations: [],
      FILES: [],
    }, specRoot);

    expect(targets.exactPhrases).not.toContain('processing');
    expect(result.hasAnchor).toBe(false);
    expect(result.matchedPhrases).toEqual([]);
  });

  it('uses whole-phrase boundaries for exact phrase matches', () => {
    const specRoot = path.join(makeTempSpecRoot(), '011-processing-task');
    fs.mkdirSync(specRoot, { recursive: true });
    fs.writeFileSync(
      path.join(specRoot, 'spec.md'),
      [
        '---',
        'title: "Processing Task"',
        'trigger_phrases:',
        '  - "processing task"',
        '---',
      ].join('\n'),
      'utf-8',
    );

    const targets = buildSpecAffinityTargets(specRoot);

    expect(matchesSpecAffinityText('The processing task is queued for tonight.', targets)).toBe(true);
    expect(matchesSpecAffinityText('The postprocessing task is queued for tonight.', targets)).toBe(false);
  });
});
