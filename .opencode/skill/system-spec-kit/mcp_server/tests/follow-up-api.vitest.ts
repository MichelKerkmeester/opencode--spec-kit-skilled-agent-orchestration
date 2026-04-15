import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

const createdRoots = new Set<string>();

function createGraphMetadataFixture(): { root: string; specFolder: string; graphPath: string } {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'follow-up-api-'));
  createdRoots.add(root);
  const specFolder = path.join(root, '.opencode', 'specs', 'system-spec-kit', '915-follow-up-api');
  fs.mkdirSync(specFolder, { recursive: true });
  const graphPath = path.join(specFolder, 'graph-metadata.json');
  fs.writeFileSync(graphPath, JSON.stringify({
    schema_version: 1,
    packet_id: 'system-spec-kit/915-follow-up-api',
    spec_folder: 'system-spec-kit/915-follow-up-api',
    parent_id: null,
    children_ids: [],
    manual: { depends_on: [], supersedes: [], related_to: [] },
    derived: {
      trigger_phrases: ['follow-up api'],
      key_topics: ['follow-up api'],
      importance_tier: 'important',
      status: 'complete',
      key_files: ['spec.md'],
      entities: [],
      causal_summary: 'Follow-up API fixture',
      created_at: '2026-04-15T00:00:00.000Z',
      last_save_at: '2026-04-15T00:00:00.000Z',
      last_accessed_at: null,
      source_docs: ['spec.md'],
    },
  }, null, 2), 'utf8');
  fs.writeFileSync(path.join(specFolder, 'spec.md'), [
    '---',
    'title: "Follow-up API Fixture"',
    'description: "Exercise refreshGraphMetadata follow-up coverage."',
    'trigger_phrases:',
    '  - "follow-up api"',
    'importance_tier: "important"',
    'contextType: "planning"',
    '---',
    '',
    '# Follow-up API Fixture',
    '',
    '## Problem',
    '',
    'Exercise the explicit indexing follow-up APIs.',
    '',
  ].join('\n'), 'utf8');
  return { root, specFolder, graphPath };
}

describe('explicit follow-up indexing APIs', () => {
  afterEach(() => {
    for (const root of createdRoots) {
      fs.rmSync(root, { recursive: true, force: true });
    }
    createdRoots.clear();
    vi.doUnmock('../handlers/index.js');
    vi.resetModules();
    vi.restoreAllMocks();
    delete process.env.SPECKIT_POST_INSERT_ENRICHMENT_ENABLED;
  });

  it('refreshGraphMetadata updates graph metadata through the explicit follow-up API', async () => {
    const fixture = createGraphMetadataFixture();
    const { refreshGraphMetadata } = await import('../api/indexing.js');

    const refreshed = refreshGraphMetadata(fixture.specFolder);

    expect(fs.realpathSync(refreshed.filePath)).toBe(fs.realpathSync(fixture.graphPath));
    expect(refreshed.metadata.spec_folder).toBe('system-spec-kit/915-follow-up-api');
  });

  it('reindexSpecDocs runs the standard incremental spec-doc scan with explicit follow-up arguments', async () => {
    const scanResponse = {
      content: [{ type: 'text', text: JSON.stringify({ data: { status: 'indexed', scanned: 2 } }) }],
      isError: false,
    };
    const handleMemoryIndexScan = vi.fn(async () => scanResponse);

    vi.doMock('../handlers/index.js', () => ({
      handleMemoryIndexScan,
    }));

    const { reindexSpecDocs } = await import('../api/indexing.js');
    const response = await reindexSpecDocs('system-spec-kit/015-save-flow-planner-first-trim');

    expect(response).toBe(scanResponse);
    expect(handleMemoryIndexScan).toHaveBeenCalledWith({
      specFolder: 'system-spec-kit/015-save-flow-planner-first-trim',
      includeSpecDocs: true,
      includeConstitutional: false,
      incremental: true,
      force: false,
    });
  });

  it('runEnrichmentBackfill enables enrichment during the scan and restores the environment afterwards', async () => {
    process.env.SPECKIT_POST_INSERT_ENRICHMENT_ENABLED = 'false';
    const envStates: string[] = [];
    const scanResponse = {
      content: [{ type: 'text', text: JSON.stringify({ data: { status: 'indexed', scanned: 1 } }) }],
      isError: false,
    };
    const handleMemoryIndexScan = vi.fn(async (args) => {
      envStates.push(process.env.SPECKIT_POST_INSERT_ENRICHMENT_ENABLED ?? 'unset');
      return { ...scanResponse, args };
    });

    vi.doMock('../handlers/index.js', () => ({
      handleMemoryIndexScan,
    }));

    const { runEnrichmentBackfill } = await import('../api/indexing.js');
    const response = await runEnrichmentBackfill('system-spec-kit/015-save-flow-planner-first-trim');

    expect(response).toEqual(expect.objectContaining(scanResponse));
    expect(envStates).toEqual(['true']);
    expect(process.env.SPECKIT_POST_INSERT_ENRICHMENT_ENABLED).toBe('false');
    expect(handleMemoryIndexScan).toHaveBeenCalledWith({
      specFolder: 'system-spec-kit/015-save-flow-planner-first-trim',
      includeSpecDocs: true,
      includeConstitutional: false,
      incremental: true,
      force: false,
    });
  });

  it('runEnrichmentBackfill restores the environment even when the scan throws', async () => {
    delete process.env.SPECKIT_POST_INSERT_ENRICHMENT_ENABLED;
    const handleMemoryIndexScan = vi.fn(async () => {
      throw new Error('scan failed');
    });

    vi.doMock('../handlers/index.js', () => ({
      handleMemoryIndexScan,
    }));

    const { runEnrichmentBackfill } = await import('../api/indexing.js');

    await expect(
      runEnrichmentBackfill('system-spec-kit/015-save-flow-planner-first-trim'),
    ).rejects.toThrow('scan failed');
    expect(process.env.SPECKIT_POST_INSERT_ENRICHMENT_ENABLED).toBeUndefined();
  });
});
