// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Skill Projection
// ───────────────────────────────────────────────────────────────

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import Database from 'better-sqlite3';

import { lifecycleStatusForPath } from '../lifecycle/archive-handling.js';
import type { AdvisorProjection, SkillEdgeProjection, SkillLifecycleStatus, SkillProjection } from './types.js';
import { phraseVariants, unique } from './text.js';

interface SkillNodeRow {
  readonly id: string;
  readonly family: string;
  readonly category: string;
  readonly domains: string | null;
  readonly intent_signals: string | null;
  readonly derived: string | null;
  readonly source_path: string;
}

interface SkillEdgeRow {
  readonly source_id: string;
  readonly target_id: string;
  readonly edge_type: SkillEdgeProjection['edgeType'];
  readonly weight: number;
  readonly context: string;
}

interface SkillMarkdownMetadata {
  readonly name: string;
  readonly description: string;
  readonly keywords: readonly string[];
}

const SKILL_GRAPH_DB = join('.opencode', 'skill', 'system-spec-kit', 'mcp_server', 'database', 'skill-graph.sqlite');

const COMMAND_BRIDGES: readonly SkillProjection[] = [
  {
    id: 'command-spec-kit',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-spec-kit',
    description: 'Spec Kit command bridge for /spec_kit workflows.',
    keywords: ['/spec_kit:plan', '/spec_kit:resume', '/spec_kit:deep-research', '/spec_kit:deep-review'],
    domains: ['spec-kit', 'command'],
    intentSignals: ['/spec_kit:plan', '/spec_kit:resume', '/spec_kit:deep-research', '/spec_kit:deep-review'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    id: 'command-memory-save',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-memory-save',
    description: 'Memory save command bridge for /memory:save context preservation.',
    keywords: ['/memory:save', 'save context', 'save memory'],
    domains: ['memory', 'command'],
    intentSignals: ['/memory:save', 'save context', 'save memory'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
];

function jsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((entry): entry is string => typeof entry === 'string') : [];
  } catch {
    return [];
  }
}

function jsonObject(value: string | null | undefined): Record<string, unknown> {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : {};
  } catch {
    return {};
  }
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];
}

function readJson(filePath: string): Record<string, unknown> {
  if (!existsSync(filePath)) return {};
  const parsed: unknown = JSON.parse(readFileSync(filePath, 'utf8'));
  return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
}

function parseSkillMarkdown(skillMdPath: string, fallbackId: string): SkillMarkdownMetadata {
  if (!existsSync(skillMdPath)) {
    return { name: fallbackId, description: '', keywords: [] };
  }
  const raw = readFileSync(skillMdPath, 'utf8');
  const frontmatter: Record<string, string> = {};
  if (raw.startsWith('---\n')) {
    const end = raw.indexOf('\n---', 4);
    if (end > 0) {
      for (const line of raw.slice(4, end).split(/\r?\n/)) {
        const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
        if (match) frontmatter[match[1]] = match[2].replace(/^["']|["']$/g, '').trim();
      }
    }
  }
  const keywordMatch = /<!--\s*Keywords:\s*([\s\S]*?)-->/i.exec(raw);
  const keywords = keywordMatch
    ? keywordMatch[1].split(',').map((item) => item.trim()).filter(Boolean)
    : [];
  return {
    name: frontmatter.name || fallbackId,
    description: frontmatter.description || '',
    keywords,
  };
}

function lifecycleStatus(raw: unknown, sourcePath: string): SkillLifecycleStatus {
  if (raw === 'deprecated' || raw === 'archived' || raw === 'future' || raw === 'active') return raw;
  const pathStatus = lifecycleStatusForPath(sourcePath);
  return pathStatus === 'archived' || pathStatus === 'future' ? pathStatus : 'active';
}

function projectionFromRow(row: SkillNodeRow): SkillProjection {
  const derived = jsonObject(row.derived);
  const graphMetadata = readJson(row.source_path);
  const skillDir = dirname(row.source_path);
  const skillMd = parseSkillMarkdown(join(skillDir, 'SKILL.md'), row.id);
  const lifecycle = lifecycleStatus(
    graphMetadata.lifecycle_status ?? derived.lifecycle_status,
    row.source_path,
  );
  const redirectTo = typeof graphMetadata.redirect_to === 'string'
    ? graphMetadata.redirect_to
    : (typeof derived.redirect_to === 'string' ? derived.redirect_to : null);
  const redirectFrom = stringArray(graphMetadata.redirect_from ?? derived.redirect_from);
  const derivedTriggers = unique([
    ...stringArray(derived.trigger_phrases),
    ...stringArray(derived.key_topics),
    ...stringArray(derived.entities),
    ...stringArray(derived.key_files),
    ...stringArray(derived.source_docs),
  ].flatMap((entry) => phraseVariants(entry)));

  return {
    id: row.id,
    kind: 'skill',
    family: row.family,
    category: row.category,
    name: skillMd.name,
    description: skillMd.description,
    keywords: unique(skillMd.keywords.flatMap((entry) => phraseVariants(entry))),
    domains: unique(jsonArray(row.domains).flatMap((entry) => phraseVariants(entry))),
    intentSignals: unique(jsonArray(row.intent_signals).flatMap((entry) => phraseVariants(entry))),
    derivedTriggers,
    derivedKeywords: derivedTriggers,
    sourcePath: row.source_path,
    lifecycleStatus: lifecycle,
    redirectTo,
    redirectFrom,
  };
}

function loadSqliteProjection(workspaceRoot: string): AdvisorProjection | null {
  const dbPath = join(workspaceRoot, SKILL_GRAPH_DB);
  if (!existsSync(dbPath)) return null;
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    const rows = db.prepare(`
      SELECT id, family, category, domains, intent_signals, derived, source_path
      FROM skill_nodes
      ORDER BY id ASC
    `).all() as SkillNodeRow[];
    const edgeRows = db.prepare(`
      SELECT source_id, target_id, edge_type, weight, context
      FROM skill_edges
      ORDER BY source_id ASC, edge_type ASC, target_id ASC
    `).all() as SkillEdgeRow[];
    return {
      skills: [...rows.map(projectionFromRow), ...COMMAND_BRIDGES],
      edges: edgeRows.map((row) => ({
        sourceId: row.source_id,
        targetId: row.target_id,
        edgeType: row.edge_type,
        weight: Math.max(0, Math.min(1, row.weight)),
        context: row.context,
      })),
      generatedAt: new Date().toISOString(),
      source: 'sqlite',
    };
  } finally {
    db.close();
  }
}

function loadFilesystemProjection(workspaceRoot: string): AdvisorProjection {
  const skillRoot = join(workspaceRoot, '.opencode', 'skill');
  const skills: SkillProjection[] = [];
  const edges: SkillEdgeProjection[] = [];
  if (!existsSync(skillRoot)) {
    return { skills: [...COMMAND_BRIDGES], edges, generatedAt: new Date().toISOString(), source: 'filesystem' };
  }
  for (const entry of readdirSync(skillRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillDir = join(skillRoot, entry.name);
    const metadataPath = join(skillDir, 'graph-metadata.json');
    if (!existsSync(metadataPath)) continue;
    const metadata = readJson(metadataPath);
    const skillMd = parseSkillMarkdown(join(skillDir, 'SKILL.md'), entry.name);
    const skillId = typeof metadata.skill_id === 'string' ? metadata.skill_id : entry.name;
    const derived = typeof metadata.derived === 'object' && metadata.derived !== null && !Array.isArray(metadata.derived)
      ? metadata.derived as Record<string, unknown>
      : {};
    skills.push({
      id: skillId,
      kind: 'skill',
      family: typeof metadata.family === 'string' ? metadata.family : 'system',
      category: typeof metadata.category === 'string' ? metadata.category : 'skill',
      name: skillMd.name,
      description: skillMd.description,
      keywords: unique(skillMd.keywords.flatMap((item) => phraseVariants(item))),
      domains: unique(stringArray(metadata.domains).flatMap((item) => phraseVariants(item))),
      intentSignals: unique(stringArray(metadata.intent_signals).flatMap((item) => phraseVariants(item))),
      derivedTriggers: unique([
        ...stringArray(derived.trigger_phrases),
        ...stringArray(derived.key_topics),
        ...stringArray(derived.entities),
        ...stringArray(derived.key_files),
        ...stringArray(derived.source_docs),
      ].flatMap((item) => phraseVariants(item))),
      derivedKeywords: [],
      sourcePath: metadataPath,
      lifecycleStatus: lifecycleStatus(metadata.lifecycle_status ?? derived.lifecycle_status, metadataPath),
      redirectTo: typeof metadata.redirect_to === 'string' ? metadata.redirect_to : undefined,
      redirectFrom: stringArray(metadata.redirect_from),
    });
  }
  return { skills: [...skills, ...COMMAND_BRIDGES], edges, generatedAt: new Date().toISOString(), source: 'filesystem' };
}

export function loadAdvisorProjection(workspaceRoot: string): AdvisorProjection {
  const resolvedRoot = resolve(workspaceRoot);
  return loadSqliteProjection(resolvedRoot) ?? loadFilesystemProjection(resolvedRoot);
}

export function createFixtureProjection(
  skills: readonly SkillProjection[],
  edges: readonly SkillEdgeProjection[] = [],
): AdvisorProjection {
  return {
    skills,
    edges,
    generatedAt: new Date().toISOString(),
    source: 'fixture',
  };
}
