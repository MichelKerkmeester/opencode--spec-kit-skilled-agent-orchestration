// ───────────────────────────────────────────────────────────────
// MODULE: Graph Metadata Parser
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

import { ZodError } from 'zod';

import { extractEntities } from '../extraction/entity-extractor.js';
import { extractKeywords } from '../search/folder-discovery.js';
import {
  canClassifyAsGraphMetadataPath,
  extractSpecFolderFromGraphMetadataPath,
  GRAPH_METADATA_FILENAME,
  isSpecLeafSegment,
} from '../config/spec-doc-paths.js';
import {
  createEmptyGraphMetadataManual,
  type GraphEntityReference,
  GRAPH_METADATA_SCHEMA_VERSION,
  graphMetadataSchema,
  type GraphMetadata,
  type GraphMetadataDerived,
  type GraphMetadataManual,
  type PacketReference,
} from './graph-metadata-schema.js';

const CANONICAL_PACKET_DOCS = [
  'spec.md',
  'plan.md',
  'tasks.md',
  'checklist.md',
  'decision-record.md',
  'implementation-summary.md',
  path.join('research', 'research.md'),
  'research.md',
  'handover.md',
] as const;

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const FILE_REFERENCE_RE = /`([^`\n]+\.[A-Za-z0-9._-]+)`/g;
const CANONICAL_PACKET_DOC_RE =
  /^(spec\.md|plan\.md|tasks\.md|checklist\.md|decision-record\.md|implementation-summary\.md|research\.md|research\/research\.md|handover\.md)$/;
const KEY_FILE_NOISE_RE =
  /^(node |npx |pnpm |npm |yarn |bun |python([0-9]+(\.[0-9]+)*)? |bash |sh |vitest |jest |mocha |tsx |ts-node |TMPDIR)|^v[0-9]+\.[0-9]+(\.[0-9]+)?$|^[a-z]+\/[a-z0-9+-]+$|^_memory\.continuity$|^[A-Za-z][A-Za-z0-9_-]*:\s.+$|^console\.warn(\(|$)/;
const BARE_FILE_RE = /^[^/]+\.[A-Za-z0-9._-]+$/;
const TITLE_LIKE_KEY_FILE_RE = /^([A-Z][a-z]+)( [A-Z][A-Za-z0-9._-]*)+$/;
const KEY_FILE_COMMAND_START_RE = /^(cd|echo|cat|grep|find|rm|mkdir)\s+/;
const CROSS_TRACK_SPEC_FOLDERS = ['system-spec-kit', 'skilled-agent-orchestration'] as const;
const BARE_RUNTIME_ENTITY_NAMES = new Set([
  'python',
  'node',
  'bash',
  'sh',
  'npm',
  'npx',
  'vitest',
  'jest',
  'tsc',
]);

interface ParsedSpecDoc {
  relativePath: string;
  content: string;
  title: string | null;
  description: string | null;
  triggerPhrases: string[];
  importanceTier: string | null;
  status: string | null;
}

export interface GraphMetadataValidationResult {
  ok: boolean;
  metadata: GraphMetadata | null;
  errors: string[];
}

export interface GraphMetadataRefreshOptions {
  now?: Date | string;
  statusOverride?: string | null;
}

export interface GraphMetadataRefreshResult {
  filePath: string;
  metadata: GraphMetadata;
  created: boolean;
}

function toIsoString(value?: Date | string | null): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string' && ISO_DATE_RE.test(value)) {
    return value;
  }
  return new Date().toISOString();
}

function parseJsonObject(content: string): unknown {
  return JSON.parse(content) as unknown;
}

function parseDelimitedValues(raw: string | null | undefined): string[] {
  if (!raw || typeof raw !== 'string') {
    return [];
  }

  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeDerivedStatus(status: string | null | undefined): string | null {
  if (typeof status !== 'string') {
    return null;
  }

  const trimmed = status.trim();
  if (!trimmed) {
    return null;
  }

  const normalized = trimmed.toLowerCase().replace(/[\s-]+/g, '_');
  switch (normalized) {
    case 'complete':
    case 'done':
    case 'completed':
      return 'complete';
    case 'active':
    case 'in_progress':
      return 'in_progress';
    case 'planned':
      return 'planned';
    default:
      return normalized;
  }
}

function parseLegacyGraphMetadataContent(content: string): GraphMetadata | null {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const values = new Map<string, string>();
  for (const line of lines) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex <= 0) {
      continue;
    }
    const key = line.slice(0, separatorIndex).trim().toLowerCase();
    const value = line.slice(separatorIndex + 1).trim();
    if (!key || !value) {
      continue;
    }
    values.set(key, value);
  }

  const packetId = values.get('packet');
  const specFolder = values.get('spec folder');
  if (!packetId || !specFolder) {
    return null;
  }

  const nowIso = new Date().toISOString();
  const summary = values.get('summary') ?? '';
  const keyTopics = parseDelimitedValues(values.get('key topics'));
  const triggerPhrases = Array.from(new Set([
    ...keyTopics,
    ...extractKeywords(`${packetId} ${specFolder} ${summary}`).slice(0, 8),
  ]));
  const sourceDocs = parseDelimitedValues(values.get('source docs'));
  const toPacketReferences = (raw: string | undefined): PacketReference[] => {
    return parseDelimitedValues(raw).map((packet) => ({
      packet_id: packet,
      reason: 'Imported from legacy graph-metadata.json',
      source: 'legacy',
    }));
  };

  return {
    schema_version: GRAPH_METADATA_SCHEMA_VERSION,
    packet_id: packetId,
    spec_folder: specFolder,
    parent_id: values.get('parent') ?? null,
    children_ids: parseDelimitedValues(values.get('children')),
    manual: {
      depends_on: toPacketReferences(values.get('depends on')),
      supersedes: toPacketReferences(values.get('supersedes')),
      related_to: toPacketReferences(values.get('related to')),
    },
    derived: {
      trigger_phrases: triggerPhrases.length > 0 ? triggerPhrases : [packetId, specFolder],
      key_topics: keyTopics,
      importance_tier: values.get('importance tier') ?? 'normal',
      status: normalizeDerivedStatus(values.get('status')) ?? 'planned',
      key_files: parseDelimitedValues(values.get('key files')),
      entities: [],
      causal_summary: summary,
      created_at: nowIso,
      last_save_at: nowIso,
      last_accessed_at: null,
      source_docs: sourceDocs,
    },
  };
}

function formatZodError(error: ZodError): string[] {
  return error.issues.map((issue) => {
    const location = issue.path.length > 0 ? issue.path.join('.') : 'root';
    return `${location}: ${issue.message}`;
  });
}

/**
 * Validate raw graph metadata content against the current schema.
 *
 * @param content - Raw JSON or legacy metadata file contents
 * @returns Validation outcome with parsed metadata when successful
 */
export function validateGraphMetadataContent(content: string): GraphMetadataValidationResult {
  try {
    const parsed = parseJsonObject(content);
    const metadata = graphMetadataSchema.parse(parsed);
    return { ok: true, metadata, errors: [] };
  } catch (error: unknown) {
    const legacyMetadata = parseLegacyGraphMetadataContent(content);
    if (legacyMetadata) {
      try {
        const metadata = graphMetadataSchema.parse(legacyMetadata);
        return { ok: true, metadata, errors: [] };
      } catch (legacyError: unknown) {
        if (legacyError instanceof ZodError) {
          return { ok: false, metadata: null, errors: formatZodError(legacyError) };
        }
        return {
          ok: false,
          metadata: null,
          errors: [legacyError instanceof Error ? legacyError.message : String(legacyError)],
        };
      }
    }

    if (error instanceof ZodError) {
      return { ok: false, metadata: null, errors: formatZodError(error) };
    }
    return {
      ok: false,
      metadata: null,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}

/**
 * Load and validate a graph-metadata file from disk.
 *
 * @param filePath - Absolute path to the graph-metadata file
 * @returns Parsed metadata, or `null` when the file does not exist
 * @throws Error when the file exists but fails schema validation
 */
export function loadGraphMetadata(filePath: string): GraphMetadata | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const validation = validateGraphMetadataContent(content);
  if (!validation.ok || !validation.metadata) {
    const detail = validation.errors.join('; ') || 'unknown validation error';
    throw new Error(`Invalid graph metadata at ${filePath}: ${detail}`);
  }

  return validation.metadata;
}

function readDoc(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function extractFrontmatter(content: string): string | null {
  const match = content.match(
    /^(?:\uFEFF)?(?:\s*<!--[\s\S]*?-->\s*)*---\s*\r?\n([\s\S]*?)\r?\n---(?:\s*\r?\n|$)/,
  );
  return match?.[1] ?? null;
}

function extractFrontmatterScalar(content: string, key: string): string | null {
  const frontmatter = extractFrontmatter(content);
  if (!frontmatter) {
    return null;
  }

  const match = frontmatter.match(new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, 'mi'));
  if (!match) {
    return null;
  }

  const raw = match[1].trim();
  return raw.replace(/^['"]|['"]$/g, '').trim() || null;
}

function extractFrontmatterArray(content: string, key: string): string[] {
  const frontmatter = extractFrontmatter(content);
  if (!frontmatter) {
    return [];
  }

  const inlineMatch = frontmatter.match(new RegExp(`(?:${key}):\\s*\\[([^\\]]+)\\]`, 'i'));
  if (inlineMatch) {
    const quotedValues = inlineMatch[1].match(/["']([^"']+)["']/g);
    if (!quotedValues) {
      return [];
    }
    return quotedValues
      .map((value) => value.replace(/^['"]|['"]$/g, '').trim())
      .filter((value) => value.length > 0);
  }

  const lines = frontmatter.split('\n');
  const values: string[] = [];
  let inBlock = false;
  for (const line of lines) {
    if (!inBlock && new RegExp(`^\\s*${key}:\\s*$`, 'i').test(line)) {
      inBlock = true;
      continue;
    }
    if (!inBlock) {
      continue;
    }
    const itemMatch = line.match(/^\s*-\s*["']?([^"'\n#]+?)["']?\s*(?:#.*)?$/);
    if (itemMatch) {
      values.push(itemMatch[1].trim());
      continue;
    }
    if (!/^\s*$/.test(line) && !/^\s*#/.test(line)) {
      break;
    }
  }
  return values.filter((value) => value.length > 0);
}

function extractTitle(content: string): string | null {
  const frontmatterTitle = extractFrontmatterScalar(content, 'title');
  if (frontmatterTitle) {
    return frontmatterTitle;
  }

  const headingMatch = content.match(/^#\s+(.+)$/m);
  return headingMatch?.[1]?.trim() || null;
}

function extractSummary(content: string): string | null {
  const overviewMatch = content.match(/###\s+Overview\s*\n([\s\S]*?)(?:\n###|\n##|\n<!--|$)/i);
  if (overviewMatch?.[1]) {
    const normalized = overviewMatch[1]
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join(' ');
    if (normalized.length > 0) {
      return normalized;
    }
  }

  const paragraphMatch = content.match(/\n([A-Z][^\n]{30,})\n/);
  return paragraphMatch?.[1]?.trim() || null;
}

function extractReferencedFilePaths(content: string): string[] {
  const referenced = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = FILE_REFERENCE_RE.exec(content)) !== null) {
    const candidate = match[1].trim();
    if (
      candidate.length > 0 &&
      !candidate.startsWith('http') &&
      !candidate.startsWith('./research/') &&
      !candidate.startsWith('../') &&
      !candidate.includes('*') &&
      !candidate.includes('...')
    ) {
      referenced.add(candidate);
    }
  }
  return Array.from(referenced);
}

function keepKeyFile(candidate: string): boolean {
  const normalized = candidate.trim().replace(/\\/g, '/');
  if (!normalized) {
    return false;
  }
  const normalizedLower = normalized.toLowerCase();
  if (normalized.startsWith('`') && normalized.endsWith('`')) {
    return false;
  }
  if (normalized.startsWith('../')) {
    return false;
  }
  if (KEY_FILE_COMMAND_START_RE.test(normalized)) {
    return false;
  }
  if (KEY_FILE_NOISE_RE.test(normalized)) {
    return false;
  }
  if (
    normalizedLower === 'memory/metadata.json'
    || normalizedLower.endsWith('/memory/metadata.json')
  ) {
    return false;
  }
  if (normalized.includes(' | ') || normalized.includes('&&') || normalized.includes('||') || normalized.includes('>>')) {
    return false;
  }
  if ((normalized.match(/(?:^|\s)(?:--|-)[A-Za-z0-9]/g) ?? []).length >= 3) {
    return false;
  }
  if (TITLE_LIKE_KEY_FILE_RE.test(normalized)) {
    return false;
  }
  if (normalized.includes('/')) {
    const lastSegment = normalized.split('/').pop() ?? '';
    if (!lastSegment.includes('.')) {
      return false;
    }
  }
  if (BARE_FILE_RE.test(normalized) && !CANONICAL_PACKET_DOC_RE.test(normalized)) {
    return false;
  }
  return true;
}

function collectPacketDocs(specFolderPath: string): ParsedSpecDoc[] {
  const docs: ParsedSpecDoc[] = [];
  for (const relativePath of CANONICAL_PACKET_DOCS) {
    const filePath = path.join(specFolderPath, relativePath);
    const content = readDoc(filePath);
    if (!content) {
      continue;
    }

    docs.push({
      relativePath: relativePath.replace(/\\/g, '/'),
      content,
      title: extractTitle(content),
      description: extractFrontmatterScalar(content, 'description'),
      triggerPhrases: extractFrontmatterArray(content, 'trigger_phrases'),
      importanceTier: extractFrontmatterScalar(content, 'importance_tier'),
      status: normalizeDerivedStatus(extractFrontmatterScalar(content, 'status')),
    });
  }

  return docs;
}

function resolveSpecFolderPath(specFolderPath: string): string {
  const normalized = specFolderPath.replace(/\\/g, '/');
  const explicit = extractSpecFolderFromGraphMetadataPath(path.join(normalized, GRAPH_METADATA_FILENAME));
  if (explicit) {
    return explicit;
  }

  const segments = normalized.split('/').filter(Boolean);
  const specsIndex = segments.findIndex((segment) => segment === 'specs');
  if (specsIndex >= 0 && specsIndex < segments.length - 1) {
    return segments.slice(specsIndex + 1).join('/');
  }

  return path.basename(specFolderPath);
}

function resolveParentId(specFolder: string): string | null {
  const segments = specFolder.split('/').filter(Boolean);
  if (segments.length < 2) {
    return null;
  }
  const parentLeaf = segments[segments.length - 2] ?? '';
  if (!isSpecLeafSegment(parentLeaf)) {
    return null;
  }
  return segments.slice(0, -1).join('/');
}

function resolveChildrenIds(specFolderPath: string, specFolder: string): string[] {
  try {
    return fs.readdirSync(specFolderPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && isSpecLeafSegment(entry.name))
      .map((entry) => `${specFolder}/${entry.name}`)
      .sort();
  } catch {
    return [];
  }
}

function selectFirstValue(values: Array<string | null | undefined>, fallback: string): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }
  return fallback;
}

function findSpecsRoot(specFolderPath: string): string | null {
  let current = path.resolve(specFolderPath);
  while (true) {
    if (path.basename(current) === 'specs' && path.basename(path.dirname(current)) === '.opencode') {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

function isExistingFile(filePath: string): boolean {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function swapCrossTrackPath(candidate: string, currentTrack: string | null): string | null {
  if (!currentTrack || !CROSS_TRACK_SPEC_FOLDERS.includes(currentTrack as typeof CROSS_TRACK_SPEC_FOLDERS[number])) {
    return null;
  }

  const otherTrack = CROSS_TRACK_SPEC_FOLDERS.find((track) => track !== currentTrack);
  if (!otherTrack) {
    return null;
  }

  const normalized = candidate.replace(/\\/g, '/').replace(/^\.\//, '');
  const replacements: Array<[string, string]> = [
    [`${currentTrack}/`, `${otherTrack}/`],
    [`specs/${currentTrack}/`, `specs/${otherTrack}/`],
    [`.opencode/specs/${currentTrack}/`, `.opencode/specs/${otherTrack}/`],
  ];

  for (const [fromPrefix, toPrefix] of replacements) {
    if (normalized.startsWith(fromPrefix)) {
      return `${toPrefix}${normalized.slice(fromPrefix.length)}`;
    }
  }

  return null;
}

function buildKeyFileLookupPaths(
  candidate: string,
  specFolderPath: string,
  specsRoot: string | null,
  repoRoot: string | null,
): string[] {
  const normalized = candidate.replace(/\\/g, '/').replace(/^\.\//, '');
  const lookups = new Set<string>();

  if (path.isAbsolute(candidate)) {
    lookups.add(path.resolve(candidate));
  } else {
    lookups.add(path.resolve(specFolderPath, normalized));
    if (repoRoot) {
      lookups.add(path.resolve(repoRoot, normalized));
      if (normalized.startsWith('.opencode/')) {
        lookups.add(path.resolve(repoRoot, normalized));
      }
      if (normalized.startsWith('specs/')) {
        lookups.add(path.resolve(repoRoot, '.opencode', normalized));
      }

      const systemSpecKitRoot = path.join(repoRoot, '.opencode', 'skill', 'system-spec-kit');
      const workspaceRoots = [
        systemSpecKitRoot,
        path.join(systemSpecKitRoot, 'mcp_server'),
        path.join(systemSpecKitRoot, 'scripts'),
      ];
      for (const root of workspaceRoots) {
        lookups.add(path.resolve(root, normalized));
      }
    }
    if (
      specsRoot
      && CROSS_TRACK_SPEC_FOLDERS.some((track) => normalized === track || normalized.startsWith(`${track}/`))
    ) {
      lookups.add(path.resolve(specsRoot, normalized));
    }
  }

  return Array.from(lookups);
}

function resolveKeyFileCandidate(
  specFolderPath: string,
  specFolder: string,
  candidate: string,
): string | null {
  const normalized = candidate.trim().replace(/\\/g, '/').replace(/^\.\//, '');
  if (!normalized) {
    return null;
  }

  const specsRoot = findSpecsRoot(specFolderPath);
  const repoRoot = specsRoot ? path.dirname(path.dirname(specsRoot)) : null;
  const currentTrack = specFolder.split('/').filter(Boolean)[0] ?? null;
  const candidates = [normalized];
  const swapped = swapCrossTrackPath(normalized, currentTrack);
  if (swapped && swapped !== normalized) {
    candidates.push(swapped);
  }

  for (const displayPath of candidates) {
    const lookupPaths = buildKeyFileLookupPaths(displayPath, specFolderPath, specsRoot, repoRoot);
    if (lookupPaths.some(isExistingFile)) {
      return displayPath;
    }
  }

  return null;
}

function classifyEntityKind(filePath: string): string {
  const normalized = filePath.toLowerCase();
  if (normalized.endsWith('.sh')) return 'script';
  if (normalized.endsWith('.md')) return 'doc';
  if (normalized.endsWith('.json') || normalized.endsWith('.yaml') || normalized.endsWith('.yml')) return 'config';
  if (normalized.endsWith('.test.ts') || normalized.endsWith('.vitest.ts')) return 'test';
  if (normalized.endsWith('.ts') || normalized.endsWith('.js') || normalized.endsWith('.tsx') || normalized.endsWith('.jsx')) return 'code';
  return 'file';
}

function stripSpecsRootPrefix(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/').replace(/^\.\//, '');
  for (const marker of ['/.opencode/specs/', '/specs/', '.opencode/specs/', 'specs/']) {
    const markerIndex = normalized.indexOf(marker);
    if (markerIndex >= 0) {
      return normalized.slice(markerIndex + marker.length);
    }
  }
  return normalized;
}

function shouldKeepEntityName(name: string): boolean {
  const normalized = name.trim().toLowerCase();
  return normalized.length > 0
    && normalized.length <= 80
    && !BARE_RUNTIME_ENTITY_NAMES.has(normalized);
}

function deriveEntities(
  specFolder: string,
  docs: ParsedSpecDoc[],
  keyFiles: string[],
): GraphEntityReference[] {
  const entities = new Map<string, GraphEntityReference>();
  const canonicalDocSuffixes = new Set(
    CANONICAL_PACKET_DOCS.map((docPath) => docPath.replace(/\\/g, '/')),
  );
  const specFolderPrefix = `${specFolder.replace(/\\/g, '/')}/`;

  const isCanonicalEntityPath = (filePath: string): boolean => {
    const normalized = stripSpecsRootPrefix(filePath);
    if (canonicalDocSuffixes.has(normalized)) {
      return true;
    }

    if (!normalized.startsWith(specFolderPrefix)) {
      return false;
    }

    const localDocPath = normalized.slice(specFolderPrefix.length);
    return canonicalDocSuffixes.has(localDocPath);
  };

  const isExternalCanonicalDocPath = (filePath: string): boolean => {
    const normalized = stripSpecsRootPrefix(filePath);
    const matchesCanonicalDoc = canonicalDocSuffixes.has(normalized)
      || Array.from(canonicalDocSuffixes).some((docPath) => normalized.endsWith(`/${docPath}`));
    return matchesCanonicalDoc && !isCanonicalEntityPath(filePath);
  };

  const prefersCandidate = (
    existing: GraphEntityReference,
    candidate: GraphEntityReference,
  ): boolean => {
    const existingPath = existing.path.replace(/\\/g, '/');
    const candidatePath = candidate.path.replace(/\\/g, '/');
    const existingCanonical = isCanonicalEntityPath(existingPath);
    const candidateCanonical = isCanonicalEntityPath(candidatePath);
    if (candidateCanonical && !existingCanonical) {
      return true;
    }
    if (!candidateCanonical) {
      return false;
    }

    const existingPathLike = existingPath.includes('/');
    const candidatePathLike = candidatePath.includes('/');
    return candidatePathLike && !existingPathLike;
  };

  const upsertEntityByName = (candidate: GraphEntityReference): void => {
    const nameKey = candidate.name.trim().toLowerCase();
    if (!shouldKeepEntityName(candidate.name)) {
      return;
    }

    const existing = entities.get(nameKey);
    if (!existing || prefersCandidate(existing, candidate)) {
      entities.set(nameKey, candidate);
    }
  };

  for (const filePath of keyFiles) {
    if (isExternalCanonicalDocPath(filePath)) {
      continue;
    }
    upsertEntityByName({
      name: path.basename(filePath),
      kind: classifyEntityKind(filePath),
      path: filePath,
      source: 'derived',
    });
  }

  for (const doc of docs) {
    const extracted = extractEntities(doc.content).slice(0, 6);
    for (const entity of extracted) {
      const normalizedName = entity.text.replace(/[\r\n]+/g, ' ').trim();
      if (!normalizedName || normalizedName.length > 80) {
        continue;
      }
      upsertEntityByName({
        name: normalizedName,
        kind: entity.type,
        path: doc.relativePath,
        source: 'derived',
      });
    }
  }

  return Array.from(entities.values()).slice(0, 24);
}

function normalizeUnique(values: string[]): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }
    seen.add(trimmed);
    normalized.push(trimmed);
  }
  return normalized;
}

function deriveKeyFiles(specFolderPath: string, specFolder: string, docs: ParsedSpecDoc[]): string[] {
  const preferredDoc = docs.find((doc) => doc.relativePath === 'implementation-summary.md');
  const referenced = preferredDoc
    ? extractReferencedFilePaths(preferredDoc.content).filter(keepKeyFile)
    : [];

  const fallbackRefs = docs
    .flatMap((doc) => extractReferencedFilePaths(doc.content))
    .filter(keepKeyFile);
  const merged = normalizeUnique([...referenced, ...fallbackRefs, ...docs.map((doc) => doc.relativePath)]);
  const resolved = merged
    .map((candidate) => resolveKeyFileCandidate(specFolderPath, specFolder, candidate))
    .filter((candidate): candidate is string => Boolean(candidate));
  return normalizeUnique(resolved).slice(0, 20);
}

function deriveKeyTopics(docs: ParsedSpecDoc[], triggerPhrases: string[], causalSummary: string): string[] {
  const source = [
    ...triggerPhrases,
    causalSummary,
    ...docs.flatMap((doc) => [doc.title, doc.description].filter((value): value is string => Boolean(value))),
  ].join(' ');
  return extractKeywords(source).slice(0, 12);
}

function deriveCausalSummary(docs: ParsedSpecDoc[]): string {
  const specDoc = docs.find((doc) => doc.relativePath === 'spec.md');
  if (specDoc) {
    const summary = extractSummary(specDoc.content);
    if (summary) {
      return summary;
    }
  }

  return selectFirstValue(
    docs.flatMap((doc) => [doc.description, doc.title]),
    'Packet metadata derived from canonical spec documents.',
  );
}

function deriveStatus(docs: ParsedSpecDoc[], override?: string | null): string {
  const normalizedOverride = normalizeDerivedStatus(override);
  if (normalizedOverride) {
    return normalizedOverride;
  }

  const ranked = [
    docs.find((doc) => doc.relativePath === 'implementation-summary.md')?.status,
    docs.find((doc) => doc.relativePath === 'checklist.md')?.status,
    docs.find((doc) => doc.relativePath === 'tasks.md')?.status,
    docs.find((doc) => doc.relativePath === 'plan.md')?.status,
    docs.find((doc) => doc.relativePath === 'spec.md')?.status,
  ];
  const frontmatterStatus = normalizeDerivedStatus(selectFirstValue(ranked, ''));
  if (frontmatterStatus) {
    return frontmatterStatus;
  }

  const implementationSummaryDoc = docs.find((doc) => doc.relativePath === 'implementation-summary.md');
  if (!implementationSummaryDoc) {
    return 'planned';
  }

  const checklistDoc = docs.find((doc) => doc.relativePath === 'checklist.md');
  if (!checklistDoc) {
    return 'complete';
  }

  return evaluateChecklistCompletion(checklistDoc.content) === 'COMPLETE'
    ? 'complete'
    : 'in_progress';
}

function evaluateChecklistCompletion(content: string): 'COMPLETE' | 'INCOMPLETE' {
  const checklistItems = content.match(/^\s*[-*]\s+\[[ xX]\]\s+.+$/gm) ?? [];
  if (checklistItems.length === 0) {
    return 'INCOMPLETE';
  }
  return checklistItems.every((line) => !/\[\s\]/.test(line)) ? 'COMPLETE' : 'INCOMPLETE';
}

function deriveImportanceTier(docs: ParsedSpecDoc[]): string {
  const ranked = [
    docs.find((doc) => doc.relativePath === 'decision-record.md')?.importanceTier,
    docs.find((doc) => doc.relativePath === 'plan.md')?.importanceTier,
    docs.find((doc) => doc.relativePath === 'spec.md')?.importanceTier,
    docs.find((doc) => doc.relativePath === 'implementation-summary.md')?.importanceTier,
  ];
  return selectFirstValue(ranked, 'important');
}

/**
 * Derive graph metadata from the canonical documents in a spec folder.
 *
 * @param specFolderPath - Absolute path to the packet/spec folder
 * @param existing - Existing graph metadata used to preserve durable fields
 * @param options - Refresh controls such as timestamp and status override
 * @returns Freshly derived graph metadata validated by the schema
 */
export function deriveGraphMetadata(
  specFolderPath: string,
  existing: GraphMetadata | null = null,
  options: GraphMetadataRefreshOptions = {},
): GraphMetadata {
  const nowIso = toIsoString(options.now);
  const docs = collectPacketDocs(specFolderPath);
  const specFolder = resolveSpecFolderPath(specFolderPath);
  const packetId = specFolder;
  const triggerPhrases = normalizeUnique(docs.flatMap((doc) => doc.triggerPhrases)).slice(0, 12);
  const causalSummary = deriveCausalSummary(docs);
  const keyFiles = deriveKeyFiles(specFolderPath, specFolder, docs);
  const keyTopics = deriveKeyTopics(docs, triggerPhrases, causalSummary);
  const sourceDocs = docs.map((doc) => doc.relativePath);
  const entities = deriveEntities(specFolder, docs, keyFiles);

  const derived: GraphMetadataDerived = {
    trigger_phrases: triggerPhrases,
    key_topics: keyTopics,
    importance_tier: deriveImportanceTier(docs),
    status: deriveStatus(docs, options.statusOverride),
    key_files: keyFiles,
    entities,
    causal_summary: causalSummary,
    created_at: existing?.derived.created_at ?? nowIso,
    last_save_at: nowIso,
    last_accessed_at: existing?.derived.last_accessed_at ?? null,
    source_docs: sourceDocs,
  };

  return graphMetadataSchema.parse({
    schema_version: GRAPH_METADATA_SCHEMA_VERSION,
    packet_id: packetId,
    spec_folder: specFolder,
    parent_id: resolveParentId(specFolder),
    children_ids: resolveChildrenIds(specFolderPath, specFolder),
    manual: existing?.manual ?? createEmptyGraphMetadataManual(),
    derived,
  });
}

/**
 * Merge refreshed derived metadata with persisted manual relationships.
 *
 * @param existing - Previously saved graph metadata, if present
 * @param refreshed - Newly derived graph metadata snapshot
 * @returns Schema-validated merged metadata payload
 */
export function mergeGraphMetadata(
  existing: GraphMetadata | null,
  refreshed: GraphMetadata,
): GraphMetadata {
  return graphMetadataSchema.parse({
    ...refreshed,
    manual: existing?.manual ?? createEmptyGraphMetadataManual(),
    derived: {
      ...refreshed.derived,
      created_at: existing?.derived.created_at ?? refreshed.derived.created_at,
      last_accessed_at: existing?.derived.last_accessed_at ?? refreshed.derived.last_accessed_at,
    },
  });
}

/**
 * Serialize graph metadata as stable pretty-printed JSON.
 *
 * @param metadata - Graph metadata payload to serialize
 * @returns JSON document terminated with a trailing newline
 */
export function serializeGraphMetadata(metadata: GraphMetadata): string {
  return `${JSON.stringify(metadata, null, 2)}\n`;
}

/**
 * Write graph metadata to disk using an atomic temp-file swap.
 *
 * @param filePath - Destination graph-metadata path
 * @param metadata - Metadata payload to persist
 */
export function writeGraphMetadataFile(filePath: string, metadata: GraphMetadata): void {
  const resolvedFilePath = path.resolve(filePath);
  const parentDir = path.dirname(resolvedFilePath);
  let canonicalParentDir: string;
  try {
    canonicalParentDir = fs.realpathSync(parentDir);
  } catch {
    throw new Error(`Graph metadata parent directory is invalid or contains a broken symlink: ${parentDir}`);
  }

  const canonicalFilePath = path.join(canonicalParentDir, path.basename(resolvedFilePath));
  if (!canClassifyAsGraphMetadataPath(canonicalFilePath)) {
    throw new Error(`Refusing to write graph metadata outside a supported specs root: ${canonicalFilePath}`);
  }

  const content = serializeGraphMetadata(metadata);
  const tempPath = `${canonicalFilePath}.tmp-${process.pid}-${Date.now()}`;

  fs.mkdirSync(path.dirname(canonicalFilePath), { recursive: true });
  fs.writeFileSync(tempPath, content, 'utf-8');
  fs.renameSync(tempPath, canonicalFilePath);
}

/**
 * Refresh the graph-metadata file for a single spec folder.
 *
 * @param specFolderPath - Absolute path to the target spec folder
 * @param options - Refresh controls such as timestamp and status override
 * @returns Saved metadata plus the final output path and creation status
 */
export function refreshGraphMetadataForSpecFolder(
  specFolderPath: string,
  options: GraphMetadataRefreshOptions = {},
): GraphMetadataRefreshResult {
  const resolvedSpecFolderPath = path.resolve(specFolderPath);
  let canonicalSpecFolderPath: string;
  try {
    canonicalSpecFolderPath = fs.realpathSync(resolvedSpecFolderPath);
  } catch {
    throw new Error(`Spec folder path is invalid or contains a broken symlink: ${resolvedSpecFolderPath}`);
  }

  if (!canClassifyAsGraphMetadataPath(path.join(canonicalSpecFolderPath, GRAPH_METADATA_FILENAME))) {
    throw new Error(`Spec folder is not under a supported specs root: ${canonicalSpecFolderPath}`);
  }

  const filePath = path.join(canonicalSpecFolderPath, GRAPH_METADATA_FILENAME);
  const existing = loadGraphMetadata(filePath);
  const refreshed = deriveGraphMetadata(canonicalSpecFolderPath, existing, options);
  const merged = mergeGraphMetadata(existing, refreshed);
  writeGraphMetadataFile(filePath, merged);

  return {
    filePath,
    metadata: merged,
    created: existing === null,
  };
}

/**
 * Convert graph metadata into a searchable text block for indexing.
 *
 * @param metadata - Metadata payload to flatten into indexable text
 * @returns Plain-text summary containing packet relationships and derived fields
 */
export function graphMetadataToIndexableText(metadata: GraphMetadata): string {
  const lines = [
    `Packet: ${metadata.packet_id}`,
    `Spec Folder: ${metadata.spec_folder}`,
    `Status: ${metadata.derived.status}`,
    `Importance Tier: ${metadata.derived.importance_tier}`,
    `Summary: ${metadata.derived.causal_summary}`,
  ];

  if (metadata.parent_id) {
    lines.push(`Parent: ${metadata.parent_id}`);
  }
  if (metadata.children_ids.length > 0) {
    lines.push(`Children: ${metadata.children_ids.join(', ')}`);
  }
  if (metadata.derived.trigger_phrases.length > 0) {
    lines.push(`Trigger Phrases: ${metadata.derived.trigger_phrases.join(', ')}`);
  }
  if (metadata.derived.key_topics.length > 0) {
    lines.push(`Key Topics: ${metadata.derived.key_topics.join(', ')}`);
  }
  if (metadata.derived.key_files.length > 0) {
    lines.push(`Key Files: ${metadata.derived.key_files.join(', ')}`);
  }
  if (metadata.manual.depends_on.length > 0) {
    lines.push(`Depends On: ${metadata.manual.depends_on.map((ref) => ref.packet_id).join(', ')}`);
  }
  if (metadata.manual.supersedes.length > 0) {
    lines.push(`Supersedes: ${metadata.manual.supersedes.map((ref) => ref.packet_id).join(', ')}`);
  }
  if (metadata.manual.related_to.length > 0) {
    lines.push(`Related To: ${metadata.manual.related_to.map((ref) => ref.packet_id).join(', ')}`);
  }
  if (metadata.derived.source_docs.length > 0) {
    lines.push(`Source Docs: ${metadata.derived.source_docs.join(', ')}`);
  }

  return `${lines.join('\n')}\n`;
}

/**
 * Convert packet references into causal-link buckets used by indexing.
 *
 * @param manual - Manual relationship section from graph metadata
 * @returns Packet IDs grouped by causal-link relation
 */
export function packetReferencesToCausalLinks(manual: GraphMetadataManual): Record<string, string[]> {
  return {
    blocks: manual.depends_on.map((ref) => ref.packet_id),
    supersedes: manual.supersedes.map((ref) => ref.packet_id),
    related_to: manual.related_to.map((ref) => ref.packet_id),
  };
}

export const __testables = {
  keepKeyFile,
  evaluateChecklistCompletion,
  resolveKeyFileCandidate,
  shouldKeepEntityName,
};
