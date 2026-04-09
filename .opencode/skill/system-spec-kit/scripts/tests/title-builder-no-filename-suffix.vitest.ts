import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { buildMemoryDashboardTitle } from '../core/title-builder';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = path.join(TEST_DIR, 'fixtures', 'post-save-render', 'title-fixture.json');

describe('title builder render fix', () => {
  it('keeps the dashboard title free of filename suffix garbage', () => {
    const fixture = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf8')) as {
      memoryTitle: string;
      specFolderName: string;
      contextFilename: string;
    };

    const result = buildMemoryDashboardTitle(
      fixture.memoryTitle,
      fixture.specFolderName,
      fixture.contextFilename,
    );

    expect(result).toBe(fixture.memoryTitle);
    expect(result).not.toMatch(/\[[^/\]]+\/[^\]]+\]$/);
  });
});
