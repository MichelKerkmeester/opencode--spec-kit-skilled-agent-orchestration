import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createEmptyGraphMetadataManual,
  deriveGraphMetadata,
  GRAPH_METADATA_SCHEMA_VERSION,
  mergeGraphMetadata,
  serializeGraphMetadata,
  type GraphMetadata,
  validateGraphMetadataContent,
} from '../api';
import { __testables as graphMetadataParserTestables } from '../lib/graph/graph-metadata-parser.js';

const createdRoots = new Set<string>();

interface GraphMetadataFixtureOptions {
  track?: string;
  packetId?: string;
  specStatus?: string | null;
  planStatus?: string | null;
  implementationSummaryStatus?: string | null;
  includeChecklist?: boolean;
  checklistItems?: string[];
  implementationSummaryReferences?: string[];
  materializeImplementationSummaryReferences?: boolean;
  specTriggerPhrases?: string[];
  extraFiles?: string[];
}

function createSpecFolder(options: GraphMetadataFixtureOptions = {}): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-metadata-schema-'));
  createdRoots.add(root);
  const track = options.track ?? 'system-spec-kit';
  const packetId = options.packetId ?? '900-graph-metadata';
  const specFolder = path.join(root, '.opencode', 'specs', track, packetId);
  fs.mkdirSync(specFolder, { recursive: true });
  const specFrontmatter = [
    '---',
    'title: "Graph Metadata Packet"',
    'description: "Packet-level graph metadata coverage."',
    `trigger_phrases: [${(options.specTriggerPhrases ?? ['graph metadata', 'packet graph'])
      .map((phrase) => `"${phrase}"`)
      .join(', ')}]`,
    'importance_tier: "critical"',
  ];
  if (options.specStatus !== null) {
    specFrontmatter.push(`status: "${options.specStatus ?? 'planned'}"`);
  }
  specFrontmatter.push('---');
  fs.writeFileSync(path.join(specFolder, 'spec.md'), [
    ...specFrontmatter,
    '',
    '# Graph Metadata Packet',
    '',
    '### Overview',
    '',
    'Defines the packet graph metadata contract for packet-aware save and retrieval flows.',
    '',
    '| File Path | Change Type | Description |',
    '|-----------|-------------|-------------|',
    '| `mcp_server/lib/graph/graph-metadata-parser.ts` | Add | Parser implementation |',
  ].join('\n'), 'utf-8');
  const planFrontmatter = [
    '---',
    'title: "Plan"',
    'trigger_phrases: ["graph metadata plan"]',
  ];
  if (options.planStatus !== null) {
    planFrontmatter.push(`status: "${options.planStatus ?? 'in_progress'}"`);
  }
  planFrontmatter.push('---');
  fs.writeFileSync(path.join(specFolder, 'plan.md'), [...planFrontmatter, '', '# Plan'].join('\n'), 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'tasks.md'), '# Tasks\n', 'utf-8');
  const implementationSummaryFrontmatter = [
    '---',
    'title: "Implementation Summary"',
  ];
  if (options.implementationSummaryStatus !== null) {
    implementationSummaryFrontmatter.push(`status: "${options.implementationSummaryStatus ?? 'complete'}"`);
  }
  implementationSummaryFrontmatter.push('---');
  const implementationSummaryLines = options.implementationSummaryReferences ?? [
    'scripts/core/workflow.ts',
    'mcp_server/handlers/memory-index.ts',
  ];
  fs.writeFileSync(path.join(specFolder, 'implementation-summary.md'), [
    ...implementationSummaryFrontmatter,
    '',
    '| File Path | Change Type | Description |',
    '|-----------|-------------|-------------|',
    ...implementationSummaryLines.map((reference, index) => (
      `| \`${reference}\` | Modify | Fixture reference ${index + 1} |`
    )),
  ].join('\n'), 'utf-8');
  if (options.includeChecklist ?? false) {
    const checklistItems = options.checklistItems ?? ['- [x] Verify graph metadata'];
    fs.writeFileSync(path.join(specFolder, 'checklist.md'), [
      '---',
      'title: "Checklist"',
      '---',
      '',
      '# Checklist',
      ...checklistItems,
    ].join('\n'), 'utf-8');
  }

  const implementationSummaryPaths = options.materializeImplementationSummaryReferences === false
    ? []
    : (options.implementationSummaryReferences ?? [
      'scripts/core/workflow.ts',
      'mcp_server/handlers/memory-index.ts',
    ]);
  const extraPaths = options.extraFiles ?? [];

  const ensureFile = (reference: string): void => {
    const normalized = reference.replace(/\\/g, '/').replace(/^\.\//, '');
    let absolutePath: string;

    if (path.isAbsolute(reference)) {
      absolutePath = reference;
    } else if (normalized.startsWith('.opencode/')) {
      absolutePath = path.join(root, normalized);
    } else if (normalized.startsWith('specs/')) {
      absolutePath = path.join(root, '.opencode', normalized);
    } else if (
      normalized.startsWith('system-spec-kit/')
      || normalized.startsWith('skilled-agent-orchestration/')
    ) {
      absolutePath = path.join(root, '.opencode', 'specs', normalized);
    } else if (normalized === 'spec.md' || normalized === 'plan.md' || normalized === 'tasks.md'
      || normalized === 'checklist.md' || normalized === 'decision-record.md'
      || normalized === 'implementation-summary.md' || normalized === 'research.md'
      || normalized === 'handover.md' || normalized.startsWith('research/')) {
      absolutePath = path.join(specFolder, normalized);
    } else {
      absolutePath = path.join(root, '.opencode', 'skill', 'system-spec-kit', normalized);
    }

    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    if (!fs.existsSync(absolutePath)) {
      fs.writeFileSync(absolutePath, '// fixture\n', 'utf-8');
    }
  };

  for (const reference of implementationSummaryPaths) {
    ensureFile(reference);
  }
  for (const reference of extraPaths) {
    ensureFile(reference);
  }

  return specFolder;
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('graph metadata schema and parser', () => {
  it('accepts derived metadata created from canonical packet docs', () => {
    const specFolder = createSpecFolder();
    const metadata = deriveGraphMetadata(specFolder, null, { now: '2026-04-12T12:00:00.000Z' });

    expect(metadata.schema_version).toBe(GRAPH_METADATA_SCHEMA_VERSION);
    expect(metadata.spec_folder).toBe('system-spec-kit/900-graph-metadata');
    expect(metadata.derived.trigger_phrases).toEqual(
      expect.arrayContaining(['graph metadata', 'packet graph', 'graph metadata plan']),
    );
    expect(metadata.derived.status).toBe('complete');
    expect(metadata.derived.importance_tier).toBe('critical');
    expect(metadata.derived.key_files).toEqual(
      expect.arrayContaining([
        'scripts/core/workflow.ts',
        'mcp_server/handlers/memory-index.ts',
      ]),
    );
  });

  it('preserves manual relationships while regenerating derived fields', () => {
    const specFolder = createSpecFolder();
    const existing: GraphMetadata = {
      ...deriveGraphMetadata(specFolder, null, { now: '2026-04-11T12:00:00.000Z' }),
      manual: {
        depends_on: [{ packet_id: 'system-spec-kit/001-base', reason: 'Needs base behavior', source: 'manual' }],
        supersedes: [],
        related_to: [{ packet_id: 'system-spec-kit/002-peer', reason: 'Peer rollout', source: 'manual' }],
      },
      derived: {
        ...deriveGraphMetadata(specFolder, null, { now: '2026-04-11T12:00:00.000Z' }).derived,
        last_accessed_at: '2026-04-11T13:00:00.000Z',
      },
    };

    const merged = mergeGraphMetadata(existing, deriveGraphMetadata(specFolder, existing, { now: '2026-04-12T12:00:00.000Z' }));

    expect(merged.manual).toEqual(existing.manual);
    expect(merged.derived.created_at).toBe(existing.derived.created_at);
    expect(merged.derived.last_accessed_at).toBe('2026-04-11T13:00:00.000Z');
    expect(merged.derived.last_save_at).toBe('2026-04-12T12:00:00.000Z');
  });

  it('rejects malformed payloads and schema version drift', () => {
    const validation = validateGraphMetadataContent(JSON.stringify({
      schema_version: 2,
      packet_id: 'bad',
      spec_folder: 'bad',
      parent_id: null,
      children_ids: [],
      manual: createEmptyGraphMetadataManual(),
      derived: {},
    }));

    expect(validation.ok).toBe(false);
    expect(validation.errors.join(' ')).toContain('schema_version');
  });

  it('accepts legacy line-based graph metadata content', () => {
    const validation = validateGraphMetadataContent([
      'Packet: system-spec-kit/999-legacy-packet',
      'Spec Folder: system-spec-kit/999-legacy-packet',
      'Status: planned',
      'Importance Tier: important',
      'Summary: Legacy graph metadata payload still present in the repo.',
      'Parent: system-spec-kit/998-parent',
      'Depends On: system-spec-kit/010-foundation',
      'Supersedes: system-spec-kit/009-older',
      'Related To: system-spec-kit/011-peer',
      'Key Topics: legacy, graph, metadata',
      'Key Files: spec.md, plan.md',
      'Source Docs: spec.md, plan.md',
    ].join('\n'));

    expect(validation.ok).toBe(true);
    expect(validation.metadata?.packet_id).toBe('system-spec-kit/999-legacy-packet');
    expect(validation.metadata?.parent_id).toBe('system-spec-kit/998-parent');
    expect(validation.metadata?.manual.depends_on[0]?.packet_id).toBe('system-spec-kit/010-foundation');
    expect(validation.metadata?.manual.supersedes[0]?.packet_id).toBe('system-spec-kit/009-older');
    expect(validation.metadata?.manual.related_to[0]?.packet_id).toBe('system-spec-kit/011-peer');
  });

  it('derives complete status when implementation-summary exists and checklist items are all checked', () => {
    const specFolder = createSpecFolder({
      specStatus: null,
      planStatus: null,
      implementationSummaryStatus: null,
      includeChecklist: true,
      checklistItems: [
        '- [x] P0 parser change applied',
        '- [x] P1 verification recorded',
      ],
    });

    const metadata = deriveGraphMetadata(specFolder, null, { now: '2026-04-12T12:00:00.000Z' });

    expect(metadata.derived.status).toBe('complete');
  });

  it('derives in_progress status when implementation-summary exists and checklist items remain unchecked', () => {
    const specFolder = createSpecFolder({
      specStatus: null,
      planStatus: null,
      implementationSummaryStatus: null,
      includeChecklist: true,
      checklistItems: [
        '- [x] P0 parser change applied',
        '- [ ] P1 verification still pending',
      ],
    });

    const metadata = deriveGraphMetadata(specFolder, null, { now: '2026-04-12T12:00:00.000Z' });

    expect(metadata.derived.status).toBe('in_progress');
  });

  it('derives complete status when implementation-summary exists without a checklist', () => {
    const specFolder = createSpecFolder({
      specStatus: null,
      planStatus: null,
      implementationSummaryStatus: null,
      includeChecklist: false,
    });

    const metadata = deriveGraphMetadata(specFolder, null, { now: '2026-04-12T12:00:00.000Z' });

    expect(metadata.derived.status).toBe('complete');
  });

  it('keeps explicit frontmatter status ahead of checklist-aware fallback logic', () => {
    const specFolder = createSpecFolder({
      specStatus: null,
      planStatus: 'planned',
      implementationSummaryStatus: null,
      includeChecklist: true,
      checklistItems: ['- [x] P0 parser change applied'],
    });

    const metadata = deriveGraphMetadata(specFolder, null, { now: '2026-04-12T12:00:00.000Z' });

    expect(metadata.derived.status).toBe('planned');
  });

  it('normalizes completed-style frontmatter statuses to complete', () => {
    const specFolder = createSpecFolder({
      specStatus: null,
      planStatus: 'Planned',
      implementationSummaryStatus: 'Done',
      includeChecklist: false,
    });

    const metadata = deriveGraphMetadata(specFolder, null, { now: '2026-04-12T12:00:00.000Z' });

    expect(metadata.derived.status).toBe('complete');
  });

  it('normalizes in-progress frontmatter statuses to in_progress', () => {
    const specFolder = createSpecFolder({
      specStatus: null,
      planStatus: 'active',
      implementationSummaryStatus: null,
      includeChecklist: false,
    });

    const metadata = deriveGraphMetadata(specFolder, null, { now: '2026-04-12T12:00:00.000Z' });

    expect(metadata.derived.status).toBe('in_progress');
  });

  it('filters command, version, mime, pseudo-field, relative, and bare-noise key file candidates', () => {
    expect(graphMetadataParserTestables.keepKeyFile('node scripts/build.js')).toBe(false);
    expect(graphMetadataParserTestables.keepKeyFile('TMPDIR=.tmp/vitest-tmp')).toBe(false);
    expect(graphMetadataParserTestables.keepKeyFile('v1.2.3')).toBe(false);
    expect(graphMetadataParserTestables.keepKeyFile('application/json')).toBe(false);
    expect(graphMetadataParserTestables.keepKeyFile('_memory.continuity')).toBe(false);
    expect(graphMetadataParserTestables.keepKeyFile('Summary: not a file path')).toBe(false);
    expect(graphMetadataParserTestables.keepKeyFile('`node scripts/build.js --watch`')).toBe(false);
    expect(graphMetadataParserTestables.keepKeyFile('src/a.ts | src/b.ts')).toBe(false);
    expect(graphMetadataParserTestables.keepKeyFile('cd .opencode/skill/system-spec-kit')).toBe(false);
    expect(graphMetadataParserTestables.keepKeyFile('node tool.js --flag-a --flag-b --flag-c')).toBe(false);
    expect(graphMetadataParserTestables.keepKeyFile('spec.md && plan.md')).toBe(false);
    expect(graphMetadataParserTestables.keepKeyFile('spec.md || plan.md')).toBe(false);
    expect(graphMetadataParserTestables.keepKeyFile('spec.md >> out.txt')).toBe(false);
    expect(graphMetadataParserTestables.keepKeyFile('../spec.md')).toBe(false);
    expect(graphMetadataParserTestables.keepKeyFile('workflow.ts')).toBe(false);
    expect(graphMetadataParserTestables.keepKeyFile('memory/metadata.json')).toBe(false);
    expect(graphMetadataParserTestables.keepKeyFile('.opencode/specs/system-spec-kit/900-graph-metadata/memory/metadata.json')).toBe(false);
    expect(graphMetadataParserTestables.keepKeyFile('spec.md')).toBe(true);
    expect(graphMetadataParserTestables.keepKeyFile('research/research.md')).toBe(true);
  });

  it('resolves cross-track spec references when the current-track path does not exist', () => {
    const specFolder = createSpecFolder({
      materializeImplementationSummaryReferences: false,
      implementationSummaryReferences: [
        'system-spec-kit/901-cross-track/spec.md',
      ],
      extraFiles: [
        'skilled-agent-orchestration/901-cross-track/spec.md',
      ],
    });

    const metadata = deriveGraphMetadata(specFolder, null, { now: '2026-04-12T12:00:00.000Z' });

    expect(metadata.derived.key_files).toContain('skilled-agent-orchestration/901-cross-track/spec.md');
    expect(metadata.derived.key_files).not.toContain('system-spec-kit/901-cross-track/spec.md');
  });

  it('drops obsolete memory metadata references and nonexistent key-file candidates', () => {
    const specFolder = createSpecFolder({
      materializeImplementationSummaryReferences: false,
      implementationSummaryReferences: [
        'scripts/core/workflow.ts',
        'memory/metadata.json',
        'scripts/missing-does-not-exist.ts',
      ],
      extraFiles: [
        'scripts/core/workflow.ts',
      ],
    });

    const metadata = deriveGraphMetadata(specFolder, null, { now: '2026-04-12T12:00:00.000Z' });

    expect(metadata.derived.key_files).toContain('scripts/core/workflow.ts');
    expect(metadata.derived.key_files).not.toContain('memory/metadata.json');
    expect(metadata.derived.key_files).not.toContain('scripts/missing-does-not-exist.ts');
  });

  it('prefers canonical path-like key file entities over basename duplicates', () => {
    const specFolder = createSpecFolder({
      implementationSummaryReferences: [
        'specs/system-spec-kit/900-graph-metadata/spec.md',
        'spec.md',
        'specs/system-spec-kit/900-graph-metadata/plan.md',
        'plan.md',
      ],
    });

    const metadata = deriveGraphMetadata(specFolder, null, { now: '2026-04-12T12:00:00.000Z' });
    const specEntity = metadata.derived.entities.find((entity) => entity.name === 'spec.md');
    const planEntity = metadata.derived.entities.find((entity) => entity.name === 'plan.md');

    expect(specEntity?.path).toBe('specs/system-spec-kit/900-graph-metadata/spec.md');
    expect(planEntity?.path).toBe('specs/system-spec-kit/900-graph-metadata/plan.md');
    expect(metadata.derived.entities.filter((entity) => entity.name === 'spec.md')).toHaveLength(1);
    expect(metadata.derived.entities.filter((entity) => entity.name === 'plan.md')).toHaveLength(1);
  });

  it('does not treat sibling packet paths as canonical entity matches', () => {
    const specFolder = createSpecFolder({
      implementationSummaryReferences: [
        'specs/system-spec-kit/901-sibling/spec.md',
        'spec.md',
      ],
    });

    const metadata = deriveGraphMetadata(specFolder, null, { now: '2026-04-12T12:00:00.000Z' });
    const specEntity = metadata.derived.entities.find((entity) => entity.name === 'spec.md');

    expect(specEntity?.path).toBe('spec.md');
  });

  it('limits canonical entity preference to the current spec-folder path prefix', () => {
    const specFolder = createSpecFolder({
      implementationSummaryReferences: [
        'specs/system-spec-kit/900-graph-metadata/spec.md',
        'specs/system-spec-kit/900-other-packet/spec.md',
        'spec.md',
      ],
      extraFiles: [
        'specs/system-spec-kit/900-other-packet/spec.md',
      ],
    });

    const metadata = deriveGraphMetadata(specFolder, null, { now: '2026-04-12T12:00:00.000Z' });
    const specEntity = metadata.derived.entities.find((entity) => entity.name === 'spec.md');

    expect(specEntity?.path).toBe('specs/system-spec-kit/900-graph-metadata/spec.md');
    expect(metadata.derived.entities.filter((entity) => entity.path === 'specs/system-spec-kit/900-other-packet/spec.md')).toHaveLength(0);
  });

  it('drops external canonical packet docs instead of surfacing them as entity leaks', () => {
    const specFolder = createSpecFolder({
      implementationSummaryReferences: [
        'specs/system-spec-kit/900-other-packet/handover.md',
      ],
      extraFiles: [
        'specs/system-spec-kit/900-other-packet/handover.md',
      ],
    });

    const metadata = deriveGraphMetadata(specFolder, null, { now: '2026-04-12T12:00:00.000Z' });

    expect(metadata.derived.entities.some((entity) => entity.path === 'specs/system-spec-kit/900-other-packet/handover.md')).toBe(false);
    expect(metadata.derived.entities.some((entity) => entity.name === 'handover.md')).toBe(false);
  });

  it('raises the entity cap to 24 and rejects bare runtime names', () => {
    const specFolder = createSpecFolder({
      implementationSummaryReferences: Array.from({ length: 30 }, (_, index) => `scripts/entities/entity-${index + 1}.ts`),
    });

    const metadata = deriveGraphMetadata(specFolder, null, { now: '2026-04-12T12:00:00.000Z' });

    expect(metadata.derived.entities).toHaveLength(24);
    expect(graphMetadataParserTestables.shouldKeepEntityName('python')).toBe(false);
    expect(graphMetadataParserTestables.shouldKeepEntityName('node')).toBe(false);
    expect(graphMetadataParserTestables.shouldKeepEntityName('tsc')).toBe(false);
    expect(graphMetadataParserTestables.shouldKeepEntityName('GraphMetadataParser')).toBe(true);
  });

  it('caps derived trigger_phrases at 12 entries', () => {
    const specFolder = createSpecFolder({
      specTriggerPhrases: Array.from({ length: 15 }, (_, index) => `graph phrase ${index + 1}`),
    });

    const metadata = deriveGraphMetadata(specFolder, null, { now: '2026-04-12T12:00:00.000Z' });

    expect(metadata.derived.trigger_phrases).toHaveLength(12);
    expect(metadata.derived.trigger_phrases[0]).toBe('graph phrase 1');
    expect(metadata.derived.trigger_phrases[11]).toBe('graph phrase 12');
  });

  it('uses distinct temp files for interleaved graph-metadata writes in the same process', () => {
    const specFolder = createSpecFolder();
    const graphPath = path.join(specFolder, 'graph-metadata.json');
    const metadataA = deriveGraphMetadata(specFolder, null, { now: '2026-04-12T12:00:00.000Z' });
    const metadataB: GraphMetadata = {
      ...metadataA,
      derived: {
        ...metadataA.derived,
        causal_summary: 'Nested writer payload',
        last_save_at: '2026-04-12T12:00:01.000Z',
      },
    };
    const tempPaths: string[] = [];
    let nestedWriteTriggered = false;
    const originalWriteFileSync = fs.writeFileSync.bind(fs) as typeof fs.writeFileSync;

    vi.spyOn(Date, 'now').mockReturnValue(1_713_251_200_000);
    vi.spyOn(fs, 'writeFileSync').mockImplementation((...args: Parameters<typeof fs.writeFileSync>) => {
      const [filePath] = args;

      if (typeof filePath === 'string' && filePath.includes('.tmp-')) {
        tempPaths.push(filePath);
        originalWriteFileSync(...args);
        if (!nestedWriteTriggered) {
          nestedWriteTriggered = true;
          graphMetadataParserTestables.writeGraphMetadataFile(graphPath, metadataB);
        }
        return;
      }

      originalWriteFileSync(...args);
    });

    expect(() => graphMetadataParserTestables.writeGraphMetadataFile(graphPath, metadataA)).not.toThrow();
    expect(tempPaths).toHaveLength(2);
    expect(new Set(tempPaths).size).toBe(2);
    const counterMatches = tempPaths.map((tempPath) => tempPath.match(new RegExp(`\\.tmp-${process.pid}-(\\d+)-([0-9a-f]{8})$`)));

    expect(counterMatches[0]).not.toBeNull();
    expect(counterMatches[1]).not.toBeNull();
    expect(new Set(counterMatches.map((match) => match?.[1])).size).toBe(2);
    expect(fs.readFileSync(graphPath, 'utf-8')).toBe(serializeGraphMetadata(metadataA));
  });
});
