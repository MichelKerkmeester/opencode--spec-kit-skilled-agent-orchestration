import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { validateMemoryQualityContent } from '../lib/validate-memory-quality';

const TEMP_ROOTS: string[] = [];

async function createSpecFolder(): Promise<string> {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'speckit-v12-'));
  TEMP_ROOTS.push(tempRoot);
  const specFolder = path.join(
    tempRoot,
    'specs',
    'system-spec-kit',
    '017-v12-normalization-fixture',
  );
  await fs.mkdir(specFolder, { recursive: true });
  await fs.writeFile(
    path.join(specFolder, 'spec.md'),
    `---
title: "Spec: V12 normalization fixture"
trigger_phrases:
  - "026 graph and context optimization"
  - "memory save heuristic calibration"
---

# Spec: V12 normalization fixture
`,
    'utf8',
  );
  return specFolder;
}

afterEach(async () => {
  await Promise.all(TEMP_ROOTS.splice(0).map((root) => fs.rm(root, { recursive: true, force: true })));
});

describe('V12 topical normalization', () => {
  it('passes when the memory body uses slug-form phrases only', async () => {
    const specFolder = await createSpecFolder();
    const result = validateMemoryQualityContent(`---
title: "Slug form memory"
spec_folder: "${specFolder}"
trigger_phrases:
  - "slug form memory"
tool_count: 0
---

# Slug form memory

This body references 026-graph-and-context-optimization and memory-save-heuristic-calibration directly.
It should satisfy the topical coherence gate even though the spec trigger phrases are prose.
`);

    expect(result.ruleResults.find((rule) => rule.ruleId === 'V12')?.passed).toBe(true);
  });

  it('passes when the memory body uses prose-form phrases only', async () => {
    const specFolder = await createSpecFolder();
    const result = validateMemoryQualityContent(`---
title: "Prose form memory"
spec_folder: "${specFolder}"
trigger_phrases:
  - "prose form memory"
tool_count: 0
---

# Prose form memory

This body talks about 026 graph and context optimization and memory save heuristic calibration
using prose instead of the hyphenated slug form.
`);

    expect(result.ruleResults.find((rule) => rule.ruleId === 'V12')?.passed).toBe(true);
  });

  it('fails when the memory body has zero overlap with the spec trigger phrases', async () => {
    const specFolder = await createSpecFolder();
    const result = validateMemoryQualityContent(`---
title: "Unrelated memory"
spec_folder: "${specFolder}"
trigger_phrases:
  - "unrelated memory"
tool_count: 0
---

# Unrelated memory

This body only discusses database migrations, css tokens, and mobile routing issues with no relevant overlap.
`);

    const v12 = result.ruleResults.find((rule) => rule.ruleId === 'V12');
    expect(v12?.passed).toBe(false);
    expect(v12?.message).toContain('V12_TOPICAL_MISMATCH');
  });

  it('resolves the spec folder correctly with and without filePath fallback', async () => {
    const specFolder = await createSpecFolder();
    const content = `---
title: "File path fallback memory"
spec_folder: ""
trigger_phrases:
  - "file path fallback memory"
tool_count: 0
---

# File path fallback memory

This body references 026-graph-and-context-optimization and memory-save-heuristic-calibration in slug form.
`;

    const withPath = validateMemoryQualityContent(content, {
      filePath: path.join(specFolder, 'notes.md'),
    });
    expect(withPath.ruleResults.find((rule) => rule.ruleId === 'V12')?.passed).toBe(true);

    const withoutPath = validateMemoryQualityContent(content.replace('spec_folder: ""', `spec_folder: "${specFolder}"`));
    expect(withoutPath.ruleResults.find((rule) => rule.ruleId === 'V12')?.passed).toBe(true);
  });
});
