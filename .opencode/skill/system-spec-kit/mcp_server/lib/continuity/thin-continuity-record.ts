export const THIN_CONTINUITY_MAX_BYTES = 2048;

export type ThinContinuityErrorCode =
  | 'MEMORY_003'
  | 'MEMORY_004'
  | 'MEMORY_005'
  | 'MEMORY_006'
  | 'MEMORY_007'
  | 'MEMORY_008'
  | 'MEMORY_009'
  | 'MEMORY_010'
  | 'MEMORY_011'
  | 'MEMORY_012'
  | 'MEMORY_013'
  | 'MEMORY_014'
  | 'MEMORY_015'
  | 'MEMORY_016'
  | 'MEMORY_017';

export interface ThinContinuitySessionDedup {
  fingerprint: string;
  session_id: string;
  parent_session_id: string | null;
}

export interface ThinContinuityRecord {
  packet_pointer: string;
  last_updated_at: string;
  last_updated_by: string;
  recent_action: string;
  next_safe_action: string;
  blockers: string[];
  key_files: string[];
  session_dedup?: ThinContinuitySessionDedup;
  completion_pct: number;
  open_questions: string[];
  answered_questions: string[];
}

export interface ThinContinuityValidationError {
  code: ThinContinuityErrorCode;
  field: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ThinContinuityValidationOptions {
  legacyMode?: boolean;
  fallbackPacketPointer?: string;
  fallbackTimestamp?: string;
  fallbackActor?: string;
  fallbackSessionId?: string;
}

export interface ThinContinuityValidationResult {
  ok: boolean;
  record?: ThinContinuityRecord;
  yaml?: string;
  bytes?: number;
  errors: ThinContinuityValidationError[];
}

export interface ThinContinuityReadResult extends ThinContinuityValidationResult {
  frontmatter?: Record<string, unknown>;
}

export interface ThinContinuityWriteResult extends ThinContinuityValidationResult {
  frontmatter?: Record<string, unknown>;
  markdown?: string;
}

type YamlScalar = string | number | boolean | null;
type YamlValue = YamlScalar | YamlValue[] | { [key: string]: YamlValue };
type UnknownRecord = Record<string, unknown>;

const FRONTMATTER_RE = /^(?:\uFEFF)?(?:\s*<!--[\s\S]*?-->\s*)*---\s*\r?\n([\s\S]*?)\r?\n---(?:\s*\r?\n|$)/;
const BODY_AFTER_FRONTMATTER_RE = /^(?:\uFEFF)?(?:\s*<!--[\s\S]*?-->\s*)*---\s*\r?\n[\s\S]*?\r?\n---(?:\s*\r?\n|$)?/;
const QUESTION_ID_RE = /^Q[1-9][0-9]*$/;
const PACKET_POINTER_RE = /^[a-z0-9._-]+(?:\/[a-z0-9._-]+)+\/?$/;
const ACTOR_RE = /^[a-z0-9][a-z0-9._-]{1,63}$/;
const SESSION_ID_RE = /^[A-Za-z0-9][A-Za-z0-9._:-]{2,63}$/;
const FINGERPRINT_RE = /^sha256:[a-f0-9]{64}$/;
const BARE_FINGERPRINT_RE = /^[a-f0-9]{64}$/;
const SENTINEL_VALUES = new Set(['', 'none', 'n/a', 'na']);
const COMPACT_FIELD_DISCOURSE_RE = /\b(?:because|so that|which means|the reason|details|summary)\b/i;
const LIST_PREFIX_RE = /^\s*(?:[-*+]|\d+\.)\s+/;
const MARKDOWN_STRUCTURE_RE = /^\s*(?:#{1,6}\s+|>\s+|```)/;
const URL_RE = /https?:\/\/|www\./i;
const MULTI_SPACE_RE = /\s+/g;

const NEXT_ACTION_VERBS = new Set([
  'add',
  'align',
  'audit',
  'await',
  'awaiting',
  'backfill',
  'blocked',
  'build',
  'check',
  'clear',
  'compare',
  'complete',
  'continue',
  'create',
  'document',
  'draft',
  'fix',
  'implement',
  'inspect',
  'investigate',
  'measure',
  'migrate',
  'monitor',
  'observe',
  'paused',
  'pending',
  'prepare',
  'ready',
  'record',
  'refresh',
  'rerun',
  'resume',
  'review',
  'route',
  'run',
  'stabilize',
  'sync',
  'update',
  'validate',
  'verify',
  'wait',
]);

function isPlainObject(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function buildError(
  code: ThinContinuityErrorCode,
  field: string,
  message: string,
  details?: Record<string, unknown>,
): ThinContinuityValidationError {
  return { code, field, message, details };
}

function normalizeWhitespace(value: string): string {
  return value.replace(MULTI_SPACE_RE, ' ').trim();
}

function tokenize(value: string): string[] {
  return normalizeWhitespace(value).split(' ').filter(Boolean);
}

function looksCompactNarrativeViolation(value: string): boolean {
  if (!value) {
    return false;
  }

  if (value.includes('\n') || value.includes('\r')) {
    return true;
  }

  if (LIST_PREFIX_RE.test(value) || MARKDOWN_STRUCTURE_RE.test(value) || URL_RE.test(value)) {
    return true;
  }

  const sentenceTerminators = value.match(/[.!?]/g) ?? [];
  if (sentenceTerminators.length > 1) {
    return true;
  }

  return COMPACT_FIELD_DISCOURSE_RE.test(value);
}

function formatIsoSeconds(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function countIndent(line: string): number {
  const match = line.match(/^ */);
  return match?.[0].length ?? 0;
}

function parseYamlScalar(raw: string): YamlValue {
  const trimmed = raw.trim();
  if (trimmed === 'null') {
    return null;
  }
  if (trimmed === 'true') {
    return true;
  }
  if (trimmed === 'false') {
    return false;
  }
  if (/^-?\d+$/.test(trimmed)) {
    return Number(trimmed);
  }
  if (trimmed === '[]') {
    return [];
  }
  if (trimmed === '{}') {
    return {};
  }
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replace(/''/g, "'");
  }
  return trimmed;
}

function parseYamlArray(lines: string[], startIndex: number, indent: number): { value: YamlValue[]; nextIndex: number } {
  const result: YamlValue[] = [];
  let index = startIndex;

  while (index < lines.length) {
    const line = lines[index];
    if (line.trim().length === 0) {
      index += 1;
      continue;
    }

    const lineIndent = countIndent(line);
    if (lineIndent < indent) {
      break;
    }
    if (lineIndent !== indent) {
      throw new Error(`Invalid YAML indentation for array item: "${line}"`);
    }

    const trimmed = line.slice(indent);
    if (!trimmed.startsWith('- ')) {
      break;
    }

    const itemValue = trimmed.slice(2).trim();
    if (itemValue.length === 0) {
      throw new Error('Nested array items are not supported in thin continuity YAML');
    }

    result.push(parseYamlScalar(itemValue));
    index += 1;
  }

  return { value: result, nextIndex: index };
}

function parseYamlMapping(lines: string[], startIndex: number, indent: number): { value: UnknownRecord; nextIndex: number } {
  const result: UnknownRecord = {};
  let index = startIndex;

  while (index < lines.length) {
    const line = lines[index];
    if (line.trim().length === 0) {
      index += 1;
      continue;
    }

    const lineIndent = countIndent(line);
    if (lineIndent < indent) {
      break;
    }
    if (lineIndent !== indent) {
      throw new Error(`Invalid YAML indentation for mapping entry: "${line}"`);
    }

    const trimmed = line.slice(indent);
    if (trimmed.startsWith('- ')) {
      throw new Error(`Unexpected YAML array item at mapping scope: "${line}"`);
    }

    const separatorIndex = trimmed.indexOf(':');
    if (separatorIndex <= 0) {
      throw new Error(`Malformed YAML mapping entry: "${line}"`);
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const remainder = trimmed.slice(separatorIndex + 1).trim();
    if (remainder.length > 0) {
      result[key] = parseYamlScalar(remainder);
      index += 1;
      continue;
    }

    let nextIndex = index + 1;
    while (nextIndex < lines.length && lines[nextIndex].trim().length === 0) {
      nextIndex += 1;
    }

    if (nextIndex >= lines.length || countIndent(lines[nextIndex]) <= indent) {
      result[key] = null;
      index = nextIndex;
      continue;
    }

    const nextIndent = countIndent(lines[nextIndex]);
    if (nextIndent !== indent + 2) {
      throw new Error(`Invalid YAML child indentation for key "${key}"`);
    }

    const childTrimmed = lines[nextIndex].slice(nextIndent);
    if (childTrimmed.startsWith('- ')) {
      const parsedArray = parseYamlArray(lines, nextIndex, nextIndent);
      result[key] = parsedArray.value;
      index = parsedArray.nextIndex;
      continue;
    }

    const parsedMapping = parseYamlMapping(lines, nextIndex, nextIndent);
    result[key] = parsedMapping.value;
    index = parsedMapping.nextIndex;
  }

  return { value: result, nextIndex: index };
}

function parseYamlDocument(raw: string): UnknownRecord {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const parsed = parseYamlMapping(lines, 0, 0);
  return parsed.value;
}

function quoteYamlString(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function serializeYamlValue(value: YamlValue, indent = 0): string[] {
  const prefix = ' '.repeat(indent);

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return [`${prefix}[]`];
    }
    return value.flatMap((item) => {
      if (Array.isArray(item) || isPlainObject(item)) {
        throw new Error('Nested arrays or objects inside arrays are not supported for thin continuity YAML');
      }
      return [`${prefix}- ${serializeYamlScalar(item)}`];
    });
  }

  if (isPlainObject(value)) {
    const lines: string[] = [];
    for (const [key, child] of Object.entries(value)) {
      if (Array.isArray(child)) {
        if (child.length === 0) {
          lines.push(`${prefix}${key}: []`);
        } else {
          lines.push(`${prefix}${key}:`);
          lines.push(...serializeYamlValue(child, indent + 2));
        }
        continue;
      }

      if (isPlainObject(child)) {
        if (Object.keys(child).length === 0) {
          lines.push(`${prefix}${key}: {}`);
        } else {
          lines.push(`${prefix}${key}:`);
          lines.push(...serializeYamlValue(child, indent + 2));
        }
        continue;
      }

      lines.push(`${prefix}${key}: ${serializeYamlScalar(child)}`);
    }
    return lines;
  }

  return [`${prefix}${serializeYamlScalar(value)}`];
}

function serializeYamlScalar(value: YamlScalar): string {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return quoteYamlString(value);
}

function extractFrontmatter(markdown: string): { rawFrontmatter: string; body: string } {
  const match = markdown.match(FRONTMATTER_RE);
  if (!match) {
    return { rawFrontmatter: '', body: markdown };
  }

  return {
    rawFrontmatter: match[1],
    body: markdown.replace(BODY_AFTER_FRONTMATTER_RE, ''),
  };
}

function normalizePacketPointer(
  value: unknown,
  options: ThinContinuityValidationOptions,
  errors: ThinContinuityValidationError[],
): string | null {
  const fallback = options.legacyMode ? options.fallbackPacketPointer : undefined;
  const candidate = typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : fallback;

  if (typeof candidate !== 'string' || candidate.length === 0) {
    errors.push(buildError('MEMORY_003', 'packet_pointer', 'packet_pointer is required'));
    return null;
  }

  if (candidate.includes('\\') || candidate.startsWith('/') || candidate.includes('..')) {
    errors.push(buildError('MEMORY_003', 'packet_pointer', 'packet_pointer must be a relative packet path'));
    return null;
  }

  const normalized = candidate
    .replace(/^\.opencode\//, '')
    .replace(/^\.\/+/, '')
    .replace(/\/{2,}/g, '/')
    .replace(/\/$/, '');

  if (!PACKET_POINTER_RE.test(normalized)) {
    errors.push(buildError('MEMORY_003', 'packet_pointer', 'packet_pointer does not match the canonical packet-path shape'));
    return null;
  }

  return normalized;
}

function normalizeTimestamp(
  value: unknown,
  options: ThinContinuityValidationOptions,
  errors: ThinContinuityValidationError[],
): string | null {
  const fallback = options.legacyMode ? options.fallbackTimestamp : undefined;
  const candidate = typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : fallback;

  if (typeof candidate !== 'string' || candidate.length === 0) {
    errors.push(buildError('MEMORY_004', 'last_updated_at', 'last_updated_at is required'));
    return null;
  }

  const parsed = new Date(candidate);
  if (Number.isNaN(parsed.getTime())) {
    errors.push(buildError('MEMORY_004', 'last_updated_at', 'last_updated_at must be a valid ISO-8601 timestamp'));
    return null;
  }

  return formatIsoSeconds(parsed);
}

function normalizeActor(
  value: unknown,
  options: ThinContinuityValidationOptions,
  errors: ThinContinuityValidationError[],
): string | null {
  const fallback = options.legacyMode ? (options.fallbackActor ?? 'legacy-backfill') : undefined;
  const candidate = typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : fallback;

  if (typeof candidate !== 'string' || candidate.length === 0) {
    errors.push(buildError('MEMORY_005', 'last_updated_by', 'last_updated_by is required'));
    return null;
  }

  if (!ACTOR_RE.test(candidate)) {
    errors.push(buildError('MEMORY_005', 'last_updated_by', 'last_updated_by must be a lowercase actor slug'));
    return null;
  }

  return candidate;
}

function normalizeCompactField(
  value: unknown,
  field: 'recent_action' | 'next_safe_action',
  options: ThinContinuityValidationOptions,
  errors: ThinContinuityValidationError[],
): string | null {
  const fallbackDefaults: Record<typeof field, string> = {
    recent_action: 'Legacy continuity imported',
    next_safe_action: 'Refresh continuity on next save',
  };
  const errorCode: Record<typeof field, ThinContinuityErrorCode> = {
    recent_action: 'MEMORY_006',
    next_safe_action: 'MEMORY_007',
  };
  const fallback = options.legacyMode ? fallbackDefaults[field] : undefined;
  const candidate = typeof value === 'string' && value.trim().length > 0
    ? normalizeWhitespace(value)
    : fallback;

  if (typeof candidate !== 'string' || candidate.length === 0) {
    errors.push(buildError(errorCode[field], field, `${field} is required`));
    return null;
  }

  if (candidate.length > 96 || tokenize(candidate).length > 16 || looksCompactNarrativeViolation(candidate)) {
    errors.push(buildError(errorCode[field], field, `${field} must stay compact and non-narrative`));
    return null;
  }

  if (field === 'next_safe_action') {
    const firstToken = tokenize(candidate)[0]?.toLowerCase() ?? '';
    if (!NEXT_ACTION_VERBS.has(firstToken)) {
      errors.push(buildError('MEMORY_007', field, 'next_safe_action must begin with an imperative or status verb'));
      return null;
    }
  }

  return candidate;
}

function normalizeCompactList(
  value: unknown,
  field: 'blockers' | 'key_files',
  errors: ThinContinuityValidationError[],
): string[] {
  const errorCode = field === 'blockers' ? 'MEMORY_008' : 'MEMORY_009';
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    errors.push(buildError(errorCode, field, `${field} must be an array when present`));
    return [];
  }

  const normalized: string[] = [];
  const seen = new Set<string>();

  for (let index = value.length - 1; index >= 0; index -= 1) {
    const rawItem = value[index];
    if (typeof rawItem !== 'string') {
      errors.push(buildError(errorCode, field, `${field} entries must be strings`));
      return [];
    }

    const compact = normalizeWhitespace(rawItem);
    if (field === 'blockers') {
      if (SENTINEL_VALUES.has(compact.toLowerCase())) {
        continue;
      }

      if (
        compact.length === 0 ||
        compact.length > 72 ||
        tokenize(compact).length > 10 ||
        looksCompactNarrativeViolation(compact)
      ) {
        errors.push(buildError('MEMORY_008', field, 'blockers must be compact single-line status items'));
        return [];
      }

      if (!seen.has(compact)) {
        normalized.unshift(compact);
        seen.add(compact);
      }
      continue;
    }

    if (compact.length === 0 || compact.length > 160) {
      errors.push(buildError('MEMORY_009', field, 'key_files entries must be non-empty repo-relative paths'));
      return [];
    }

    if (compact.startsWith('/') || compact.includes('\\') || compact.includes('..')) {
      errors.push(buildError('MEMORY_009', field, 'key_files must stay repo-relative and may not escape the workspace'));
      return [];
    }

    const normalizedPath = compact
      .replace(/^\.\/+/, '')
      .replace(/\/{2,}/g, '/');

    if (normalizedPath.split('/').some((segment) => segment.length === 0)) {
      errors.push(buildError('MEMORY_009', field, 'key_files may not contain empty path segments'));
      return [];
    }

    if (!seen.has(normalizedPath)) {
      normalized.unshift(normalizedPath);
      seen.add(normalizedPath);
    }
  }

  if (normalized.length > 5) {
    errors.push(buildError(errorCode, field, `${field} may contain at most 5 unique items`));
    return [];
  }

  return normalized;
}

function normalizeSessionDedup(
  value: unknown,
  options: ThinContinuityValidationOptions,
  errors: ThinContinuityValidationError[],
): ThinContinuitySessionDedup | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (!isPlainObject(value)) {
    errors.push(buildError('MEMORY_010', 'session_dedup', 'session_dedup must be an object when present'));
    return undefined;
  }

  if (Object.keys(value).length === 0 && options.legacyMode) {
    return undefined;
  }

  let fingerprint = value.fingerprint;
  if (typeof fingerprint === 'string' && options.legacyMode && BARE_FINGERPRINT_RE.test(fingerprint.trim())) {
    fingerprint = `sha256:${fingerprint.trim()}`;
  }

  if (typeof fingerprint !== 'string' || !FINGERPRINT_RE.test(fingerprint.trim())) {
    errors.push(buildError('MEMORY_011', 'session_dedup.fingerprint', 'fingerprint must be a sha256-prefixed 64-hex digest'));
    return undefined;
  }

  let sessionId = value.session_id;
  if ((sessionId === undefined || sessionId === null) && options.legacyMode && options.fallbackSessionId) {
    sessionId = options.fallbackSessionId;
  }
  if (typeof sessionId !== 'string' || !SESSION_ID_RE.test(sessionId.trim())) {
    errors.push(buildError('MEMORY_012', 'session_dedup.session_id', 'session_id must match the continuity session-id shape'));
    return undefined;
  }

  const rawParent = value.parent_session_id;
  if (rawParent !== undefined && rawParent !== null && typeof rawParent !== 'string') {
    errors.push(buildError('MEMORY_013', 'session_dedup.parent_session_id', 'parent_session_id must be null or a session-id string'));
    return undefined;
  }

  let parentSessionId: string | null = rawParent ?? null;
  if (typeof parentSessionId === 'string') {
    parentSessionId = parentSessionId.trim();
    if (!SESSION_ID_RE.test(parentSessionId)) {
      errors.push(buildError('MEMORY_013', 'session_dedup.parent_session_id', 'parent_session_id must match the continuity session-id shape'));
      return undefined;
    }
    if (parentSessionId === sessionId.trim()) {
      if (options.legacyMode) {
        parentSessionId = null;
      } else {
        errors.push(buildError('MEMORY_013', 'session_dedup.parent_session_id', 'parent_session_id may not equal session_id'));
        return undefined;
      }
    }
  }

  return {
    fingerprint: fingerprint.trim(),
    session_id: sessionId.trim(),
    parent_session_id: parentSessionId,
  };
}

function normalizeCompletionPct(
  value: unknown,
  blockers: string[],
  openQuestions: string[],
  errors: ThinContinuityValidationError[],
): number {
  if (value === undefined || value === null) {
    return 0;
  }

  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 100) {
    errors.push(buildError('MEMORY_014', 'completion_pct', 'completion_pct must be an integer between 0 and 100'));
    return 0;
  }

  if (value === 100 && (blockers.length > 0 || openQuestions.length > 0)) {
    errors.push(buildError('MEMORY_014', 'completion_pct', 'completion_pct cannot be 100 while blockers or open_questions remain'));
    return 0;
  }

  return value;
}

function normalizeQuestionSet(
  value: unknown,
  field: 'open_questions' | 'answered_questions',
  errors: ThinContinuityValidationError[],
): string[] {
  const code = field === 'open_questions' ? 'MEMORY_015' : 'MEMORY_016';
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    errors.push(buildError(code, field, `${field} must be an array when present`));
    return [];
  }

  const normalized = new Set<string>();
  for (const entry of value) {
    if (typeof entry !== 'string') {
      errors.push(buildError(code, field, `${field} entries must be question ids`));
      return [];
    }
    const questionId = entry.trim().toUpperCase();
    if (!QUESTION_ID_RE.test(questionId)) {
      errors.push(buildError(code, field, `${field} entries must match QNNN`));
      return [];
    }
    normalized.add(questionId);
  }

  if (normalized.size > 12) {
    errors.push(buildError(code, field, `${field} may contain at most 12 question ids`));
    return [];
  }

  return [...normalized].sort((left, right) => Number(left.slice(1)) - Number(right.slice(1)));
}

function validateQuestionOverlap(
  openQuestions: string[],
  answeredQuestions: string[],
  errors: ThinContinuityValidationError[],
): void {
  const overlap = openQuestions.filter((questionId) => answeredQuestions.includes(questionId));
  if (overlap.length > 0) {
    errors.push(buildError(
      'MEMORY_016',
      'answered_questions',
      'open_questions and answered_questions must be disjoint',
      { overlap },
    ));
  }
}

function buildOrderedRecord(record: ThinContinuityRecord, compactOptionalFields = false): Record<string, YamlValue> {
  const ordered: Record<string, YamlValue> = {
    packet_pointer: record.packet_pointer,
    last_updated_at: record.last_updated_at,
    last_updated_by: record.last_updated_by,
    recent_action: record.recent_action,
    next_safe_action: record.next_safe_action,
  };

  if (!compactOptionalFields || record.blockers.length > 0) {
    ordered.blockers = record.blockers;
  }
  if (!compactOptionalFields || record.key_files.length > 0) {
    ordered.key_files = record.key_files;
  }
  if (record.session_dedup) {
    ordered.session_dedup = {
      fingerprint: record.session_dedup.fingerprint,
      session_id: record.session_dedup.session_id,
      parent_session_id: record.session_dedup.parent_session_id,
    };
  }
  if (!compactOptionalFields || record.completion_pct !== 0) {
    ordered.completion_pct = record.completion_pct;
  }
  if (!compactOptionalFields || record.open_questions.length > 0) {
    ordered.open_questions = record.open_questions;
  }
  if (!compactOptionalFields || record.answered_questions.length > 0) {
    ordered.answered_questions = record.answered_questions;
  }

  return ordered;
}

function serializeEnvelope(record: ThinContinuityRecord, compactOptionalFields = false): { yaml: string; bytes: number } {
  const lines = serializeYamlValue(
    {
      _memory: {
        continuity: buildOrderedRecord(record, compactOptionalFields),
      },
    },
    0,
  );
  const serialized = lines.join('\n');
  return {
    yaml: serialized,
    bytes: Buffer.byteLength(serialized, 'utf8'),
  };
}

function compactForBudget(record: ThinContinuityRecord): ThinContinuityRecord {
  return {
    ...record,
    blockers: record.blockers.slice(-3),
    key_files: record.key_files.slice(-3),
  };
}

function heaviestFields(record: ThinContinuityRecord): Array<{ field: string; bytes: number }> {
  return Object.entries(buildOrderedRecord(record, false))
    .map(([field, value]) => ({
      field,
      bytes: Buffer.byteLength(serializeYamlValue({ [field]: value }, 0).join('\n'), 'utf8'),
    }))
    .sort((left, right) => right.bytes - left.bytes)
    .slice(0, 3);
}

function extractContinuityInput(source: string | UnknownRecord): { frontmatter: UnknownRecord; continuity: unknown } {
  if (typeof source === 'string') {
    const { rawFrontmatter } = extractFrontmatter(source);
    if (rawFrontmatter.trim().length === 0) {
      return { frontmatter: {}, continuity: undefined };
    }

    const frontmatter = parseYamlDocument(rawFrontmatter);
    const memoryBlock = frontmatter._memory;
    return {
      frontmatter,
      continuity: isPlainObject(memoryBlock) ? memoryBlock.continuity : undefined,
    };
  }

  const memoryBlock = source._memory;
  return {
    frontmatter: source,
    continuity: isPlainObject(memoryBlock) ? memoryBlock.continuity : undefined,
  };
}

function mergeFrontmatterWithContinuity(
  frontmatter: UnknownRecord,
  record: ThinContinuityRecord,
): UnknownRecord {
  const existingMemory = frontmatter._memory;
  if (existingMemory !== undefined && !isPlainObject(existingMemory)) {
    throw new Error('_memory must remain a mapping when present');
  }

  return {
    ...frontmatter,
    _memory: {
      ...(isPlainObject(existingMemory) ? existingMemory : {}),
      continuity: buildOrderedRecord(record, false),
    },
  };
}

export function validateThinContinuityRecord(
  input: unknown,
  options: ThinContinuityValidationOptions = {},
): ThinContinuityValidationResult {
  const errors: ThinContinuityValidationError[] = [];
  if (!isPlainObject(input)) {
    return {
      ok: false,
      errors: [buildError('MEMORY_010', 'continuity', 'continuity must be a mapping object')],
    };
  }

  const packetPointer = normalizePacketPointer(input.packet_pointer, options, errors);
  const lastUpdatedAt = normalizeTimestamp(input.last_updated_at, options, errors);
  const lastUpdatedBy = normalizeActor(input.last_updated_by, options, errors);
  const recentAction = normalizeCompactField(input.recent_action, 'recent_action', options, errors);
  const nextSafeAction = normalizeCompactField(input.next_safe_action, 'next_safe_action', options, errors);
  const blockers = normalizeCompactList(input.blockers, 'blockers', errors);
  const keyFiles = normalizeCompactList(input.key_files, 'key_files', errors);
  const openQuestions = normalizeQuestionSet(input.open_questions, 'open_questions', errors);
  const answeredQuestions = normalizeQuestionSet(input.answered_questions, 'answered_questions', errors);
  validateQuestionOverlap(openQuestions, answeredQuestions, errors);
  const sessionDedup = normalizeSessionDedup(input.session_dedup, options, errors);
  const completionPct = normalizeCompletionPct(input.completion_pct, blockers, openQuestions, errors);

  if (errors.length > 0 || !packetPointer || !lastUpdatedAt || !lastUpdatedBy || !recentAction || !nextSafeAction) {
    return { ok: false, errors };
  }

  const normalizedRecord: ThinContinuityRecord = {
    packet_pointer: packetPointer,
    last_updated_at: lastUpdatedAt,
    last_updated_by: lastUpdatedBy,
    recent_action: recentAction,
    next_safe_action: nextSafeAction,
    blockers,
    key_files: keyFiles,
    ...(sessionDedup ? { session_dedup: sessionDedup } : {}),
    completion_pct: completionPct,
    open_questions: openQuestions,
    answered_questions: answeredQuestions,
  };

  let finalRecord = normalizedRecord;
  let serialized = serializeEnvelope(finalRecord, false);

  if (serialized.bytes > THIN_CONTINUITY_MAX_BYTES) {
    finalRecord = compactForBudget(normalizedRecord);
    serialized = serializeEnvelope(finalRecord, true);
  }

  if (serialized.bytes > THIN_CONTINUITY_MAX_BYTES) {
    return {
      ok: false,
      errors: [
        buildError(
          'MEMORY_017',
          'continuity',
          `continuity block exceeds ${THIN_CONTINUITY_MAX_BYTES} bytes after normalization`,
          {
            actualBytes: serialized.bytes,
            heaviestFields: heaviestFields(finalRecord),
          },
        ),
      ],
    };
  }

  return {
    ok: true,
    record: finalRecord,
    yaml: serialized.yaml,
    bytes: serialized.bytes,
    errors: [],
  };
}

export function readThinContinuityRecord(
  source: string | UnknownRecord,
  options: ThinContinuityValidationOptions = {},
): ThinContinuityReadResult {
  try {
    const extracted = extractContinuityInput(source);
    const validation = validateThinContinuityRecord(extracted.continuity, options);
    return {
      ...validation,
      frontmatter: extracted.frontmatter,
    };
  } catch (error) {
    return {
      ok: false,
      errors: [
        buildError('MEMORY_010', 'continuity', error instanceof Error ? error.message : 'Failed to parse continuity block'),
      ],
    };
  }
}

export function serializeThinContinuityRecord(record: ThinContinuityRecord, compactOptionalFields = false): string {
  return serializeEnvelope(record, compactOptionalFields).yaml;
}

export function writeThinContinuityRecord(
  frontmatter: UnknownRecord,
  input: unknown,
  options: ThinContinuityValidationOptions = {},
): ThinContinuityWriteResult {
  const validation = validateThinContinuityRecord(input, options);
  if (!validation.ok || !validation.record || !validation.yaml) {
    return validation;
  }

  try {
    return {
      ...validation,
      frontmatter: mergeFrontmatterWithContinuity(frontmatter, validation.record),
    };
  } catch (error) {
    return {
      ok: false,
      errors: [
        buildError('MEMORY_010', '_memory', error instanceof Error ? error.message : 'Failed to update continuity frontmatter'),
      ],
    };
  }
}

export function upsertThinContinuityInMarkdown(
  markdown: string,
  input: unknown,
  options: ThinContinuityValidationOptions = {},
): ThinContinuityWriteResult {
  try {
    const { rawFrontmatter, body } = extractFrontmatter(markdown);
    const currentFrontmatter = rawFrontmatter.trim().length > 0 ? parseYamlDocument(rawFrontmatter) : {};
    const writeResult = writeThinContinuityRecord(currentFrontmatter, input, options);
    if (!writeResult.ok || !writeResult.frontmatter) {
      return writeResult;
    }

    const frontmatterYaml = serializeYamlValue(writeResult.frontmatter as Record<string, YamlValue>, 0).join('\n');
    const bodyPrefix = body.length > 0 ? '\n' : '';
    return {
      ...writeResult,
      markdown: `---\n${frontmatterYaml}\n---\n${bodyPrefix}${body}`,
    };
  } catch (error) {
    return {
      ok: false,
      errors: [
        buildError('MEMORY_010', 'continuity', error instanceof Error ? error.message : 'Failed to upsert continuity in markdown'),
      ],
    };
  }
}
