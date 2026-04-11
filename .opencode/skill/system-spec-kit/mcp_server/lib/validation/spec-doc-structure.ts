import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export type SpecDocRuleName =
  | 'FRONTMATTER_MEMORY_BLOCK'
  | 'MERGE_LEGALITY'
  | 'SPEC_DOC_SUFFICIENCY'
  | 'CROSS_ANCHOR_CONTAMINATION'
  | 'POST_SAVE_FINGERPRINT';

export interface RuleDiagnostic {
  code: string;
  severity: 'error' | 'warning';
  detail: string;
}

export interface RuleResult {
  rule: SpecDocRuleName;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  details: string[];
  diagnostics: RuleDiagnostic[];
}

export interface MergePlan {
  targetFile?: string;
  targetAnchor?: string;
  mergeMode?:
    | 'append-as-paragraph'
    | 'insert-new-adr'
    | 'append-table-row'
    | 'update-in-place'
    | 'append-section'
    | 'set-field';
  taskId?: string;
  fieldPath?: string;
  chunkText?: string;
}

export interface ContaminationPlan {
  routeCategory?: string;
  chunkText?: string;
  routeOverrideAccepted?: boolean;
}

export interface PostSavePlan {
  file?: string;
  expectedFingerprint?: string;
  snapshotContent?: string;
  expectedSize?: number;
  expectedMtimeMs?: number;
}

export interface SpecDocRuleOptions {
  folder: string;
  level: string;
  rule: SpecDocRuleName;
  mergePlan?: MergePlan | null;
  contaminationPlan?: ContaminationPlan | null;
  postSavePlan?: PostSavePlan | null;
}

interface DocumentRecord {
  basename: string;
  path: string;
  content: string;
}

interface AnchorOccurrence {
  id: string;
  startLine: number;
  endLine: number;
  body: string;
}

interface ParsedFrontmatter {
  rawBlock: string | null;
  error: string | null;
  memoryBlock: string | null;
  continuityBlock: string | null;
  fingerprint: string | null;
}

const SPEC_DOC_RULE_ORDER: readonly SpecDocRuleName[] = [
  'FRONTMATTER_MEMORY_BLOCK',
  'MERGE_LEGALITY',
  'SPEC_DOC_SUFFICIENCY',
  'CROSS_ANCHOR_CONTAMINATION',
  'POST_SAVE_FINGERPRINT',
] as const;

export const RULE_FAILURE_CODES: Readonly<Record<SpecDocRuleName, readonly string[]>> = {
  FRONTMATTER_MEMORY_BLOCK: [
    'SPECDOC_FRONTMATTER_001',
    'SPECDOC_FRONTMATTER_002',
    'SPECDOC_FRONTMATTER_003',
    'SPECDOC_FRONTMATTER_004',
    'SPECDOC_FRONTMATTER_005',
    'SPECDOC_FRONTMATTER_006',
    'SPECDOC_FRONTMATTER_007',
  ],
  MERGE_LEGALITY: [
    'SPECDOC_MERGE_001',
    'SPECDOC_MERGE_002',
    'SPECDOC_MERGE_003',
    'SPECDOC_MERGE_004',
    'SPECDOC_MERGE_005',
  ],
  SPEC_DOC_SUFFICIENCY: [
    'SPECDOC_SUFFICIENCY_001',
    'SPECDOC_SUFFICIENCY_002',
    'SPECDOC_SUFFICIENCY_003',
    'SPECDOC_SUFFICIENCY_004',
  ],
  CROSS_ANCHOR_CONTAMINATION: [
    'SPECDOC_CONTAM_001',
    'SPECDOC_CONTAM_002',
    'SPECDOC_CONTAM_003',
  ],
  POST_SAVE_FINGERPRINT: [
    'SPECDOC_FINGERPRINT_001',
    'SPECDOC_FINGERPRINT_002',
    'SPECDOC_FINGERPRINT_003',
    'SPECDOC_FINGERPRINT_004',
  ],
} as const;

const SPEC_DOC_BASENAMES = [
  'spec.md',
  'plan.md',
  'tasks.md',
  'checklist.md',
  'decision-record.md',
  'implementation-summary.md',
] as const;

const ROUTE_CATEGORY_ALIASES: Record<string, string> = {
  what_built: 'narrative_progress',
  how_delivered: 'delivery_log',
  task_update: 'task_update',
  decisions: 'decision_log',
  decision_log: 'decision_log',
  research: 'research_findings',
  research_findings: 'research_findings',
  metadata: 'metadata_only',
  metadata_only: 'metadata_only',
  drop: 'drop',
};

function normalizeRuleName(raw: string | undefined): SpecDocRuleName {
  const normalized = (raw ?? '')
    .trim()
    .toUpperCase()
    .replace(/-/g, '_');

  if (!SPEC_DOC_RULE_ORDER.includes(normalized as SpecDocRuleName)) {
    throw new Error(`Unknown spec-doc rule: ${raw ?? '(empty)'}`);
  }

  return normalized as SpecDocRuleName;
}

function collectDocuments(folder: string): DocumentRecord[] {
  const documents: DocumentRecord[] = [];

  for (const basename of SPEC_DOC_BASENAMES) {
    const docPath = path.join(folder, basename);
    if (fs.existsSync(docPath)) {
      documents.push({
        basename,
        path: docPath,
        content: fs.readFileSync(docPath, 'utf8'),
      });
    }
  }

  const optionalDocs = [
    { basename: 'handover.md', path: path.join(folder, 'handover.md') },
    { basename: 'research.md', path: path.join(folder, 'research.md') },
    { basename: 'research/research.md', path: path.join(folder, 'research', 'research.md') },
  ];

  for (const candidate of optionalDocs) {
    if (fs.existsSync(candidate.path)) {
      documents.push({
        basename: candidate.basename,
        path: candidate.path,
        content: fs.readFileSync(candidate.path, 'utf8'),
      });
    }
  }

  return documents;
}

function countLeadingSpaces(value: string): number {
  let count = 0;
  while (count < value.length && value[count] === ' ') {
    count += 1;
  }
  return count;
}

function extractFrontmatter(content: string): ParsedFrontmatter {
  const normalized = content.replace(/\r\n/g, '\n');
  const match = normalized.match(/^(?:\uFEFF)?---\n([\s\S]*?)\n---(?:\n|$)/);
  if (/^(?:\uFEFF)?---\n/.test(normalized) && !match) {
    return {
      rawBlock: null,
      error: 'frontmatter opening delimiter is missing a closing ---',
      memoryBlock: null,
      continuityBlock: null,
      fingerprint: null,
    };
  }
  if (!match) {
    return {
      rawBlock: null,
      error: null,
      memoryBlock: null,
      continuityBlock: null,
      fingerprint: null,
    };
  }

  const rawBlock = match[1];
  const lines = rawBlock.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim() || line.trim().startsWith('#')) {
      continue;
    }
    if (countLeadingSpaces(line) === 0 && !/^[A-Za-z_][A-Za-z0-9_-]*\s*:/.test(line)) {
      return {
        rawBlock,
        error: `invalid top-level YAML mapping at line ${index + 1}`,
        memoryBlock: null,
        continuityBlock: null,
        fingerprint: null,
      };
    }
  }
  let memoryStart = -1;
  for (let index = 0; index < lines.length; index += 1) {
    if (/^_memory:\s*$/.test(lines[index])) {
      memoryStart = index;
      break;
    }
  }

  let memoryBlock: string | null = null;
  let continuityBlock: string | null = null;
  let fingerprint: string | null = null;

  if (memoryStart >= 0) {
    const blockLines = [lines[memoryStart]];
    let index = memoryStart + 1;
    for (; index < lines.length; index += 1) {
      const line = lines[index];
      if (line.trim() && countLeadingSpaces(line) === 0) {
        break;
      }
      blockLines.push(line);
    }
    memoryBlock = blockLines.join('\n');

    let continuityStart = -1;
    const childLines = blockLines.slice(1);
    for (let childIndex = 0; childIndex < childLines.length; childIndex += 1) {
      if (/^\s{2}continuity:\s*$/.test(childLines[childIndex])) {
        continuityStart = childIndex;
        break;
      }
      const fingerprintMatch = childLines[childIndex].match(/^\s{2}fingerprint:\s*(.+?)\s*$/);
      if (fingerprintMatch) {
        fingerprint = stripYamlComment(fingerprintMatch[1]).trim();
      }
    }

    if (continuityStart >= 0) {
      const continuityLines = [childLines[continuityStart]];
      for (let childIndex = continuityStart + 1; childIndex < childLines.length; childIndex += 1) {
        const line = childLines[childIndex];
        if (line.trim() && countLeadingSpaces(line) <= 2) {
          break;
        }
        continuityLines.push(line);
      }
      continuityBlock = continuityLines.join('\n');
    }
  }

  return {
    rawBlock,
    error: null,
    memoryBlock,
    continuityBlock,
    fingerprint,
  };
}

function stripYamlComment(value: string): string {
  let quote: '"' | "'" | null = null;
  let escaped = false;

  for (let index = 0; index < value.length; index += 1) {
    const ch = value[index];
    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (quote === '"' && ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }

    if (ch === '#') {
      return value.slice(0, index).trimEnd();
    }
  }

  return value;
}

function extractContinuityField(block: string | null, field: string): string | null {
  if (!block) {
    return null;
  }
  const regex = new RegExp(`^\\s{4}${field}:\\s*(.+?)\\s*$`, 'm');
  const match = block.match(regex);
  if (!match) {
    return null;
  }

  const raw = stripYamlComment(match[1]).trim();
  if (
    (raw.startsWith('"') && raw.endsWith('"'))
    || (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return raw.slice(1, -1);
  }
  return raw;
}

function extractContinuityList(block: string | null, field: string): string[] {
  if (!block) {
    return [];
  }

  const blockMatch = block.match(new RegExp(`^\\s{4}${field}:\\s*$([\\s\\S]*?)(?=^\\s{4}[A-Za-z_][A-Za-z0-9_-]*:|$)`, 'm'));
  if (!blockMatch) {
    return [];
  }

  const items = blockMatch[1]
    .split('\n')
    .map((line) => line.match(/^\s{6}-\s*(.+?)\s*$/)?.[1]?.trim() ?? null)
    .filter((value): value is string => value !== null && value.length > 0)
    .map((value) => stripYamlComment(value));

  return items;
}

function parseAnchors(content: string): { anchors: AnchorOccurrence[]; errors: string[] } {
  const anchors: AnchorOccurrence[] = [];
  const errors: string[] = [];
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const stack: Array<{ id: string; startLine: number; bodyLines: string[] }> = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const lineNumber = index + 1;
    const openMatch = line.match(/<!--\s*ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->/);
    const closeMatch = line.match(/<!--\s*\/ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->/);

    if (openMatch) {
      const existingIndex = stack.findIndex((entry) => entry.id === openMatch[1]);
      if (existingIndex >= 0) {
        errors.push(`line ${lineNumber}: nested anchor '${openMatch[1]}' is not legal`);
      }
      stack.push({
        id: openMatch[1],
        startLine: lineNumber,
        bodyLines: [],
      });
      continue;
    }

    if (closeMatch) {
      const current = stack.pop();
      if (!current || current.id !== closeMatch[1]) {
        errors.push(`line ${lineNumber}: orphaned closing anchor '${closeMatch[1]}'`);
        continue;
      }
      anchors.push({
        id: current.id,
        startLine: current.startLine,
        endLine: lineNumber,
        body: current.bodyLines.join('\n').trim(),
      });
      continue;
    }

    if (stack.length > 0) {
      stack[stack.length - 1].bodyLines.push(line);
    }
  }

  if (stack.length > 0) {
    for (const openAnchor of stack) {
      errors.push(`line ${openAnchor.startLine}: unclosed anchor '${openAnchor.id}'`);
    }
  }

  return { anchors, errors };
}

function computeNormalizedFingerprint(content: string): string {
  const normalized = content
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+$/gm, '');

  return `sha256:${createHash('sha256').update(normalized, 'utf8').digest('hex')}`;
}

function resolveTargetPath(folder: string, candidate: string | undefined): string | null {
  if (!candidate) {
    return null;
  }
  if (path.isAbsolute(candidate)) {
    return candidate;
  }
  return path.join(folder, candidate);
}

function createResult(rule: SpecDocRuleName, diagnostics: RuleDiagnostic[], passMessage: string): RuleResult {
  const status = diagnostics.some((diagnostic) => diagnostic.severity === 'error')
    ? 'fail'
    : diagnostics.some((diagnostic) => diagnostic.severity === 'warning')
      ? 'warn'
      : 'pass';

  const details = diagnostics.map((diagnostic) => `${diagnostic.code}: ${diagnostic.detail}`);

  return {
    rule,
    status,
    message: status === 'pass' ? passMessage : `${diagnostics.length} ${rule.toLowerCase()} issue(s) found`,
    details,
    diagnostics,
  };
}

function validateFrontmatterMemoryBlock(folder: string): RuleResult {
  const diagnostics: RuleDiagnostic[] = [];

  for (const document of collectDocuments(folder)) {
    const parsed = extractFrontmatter(document.content);

    if (parsed.error) {
      diagnostics.push({
        code: 'SPECDOC_FRONTMATTER_001',
        severity: 'error',
        detail: `${document.basename}: malformed YAML frontmatter (${parsed.error})`,
      });
      continue;
    }

    if (!parsed.rawBlock) {
      continue;
    }

    if (!parsed.memoryBlock) {
      diagnostics.push({
        code: 'SPECDOC_FRONTMATTER_002',
        severity: 'warning',
        detail: `${document.basename}: missing _memory block`,
      });
      continue;
    }

    if (parsed.fingerprint && !/^sha256:[a-f0-9]{64}$/.test(parsed.fingerprint)) {
      diagnostics.push({
        code: 'SPECDOC_FRONTMATTER_005',
        severity: 'error',
        detail: `${document.basename}: fingerprint '${parsed.fingerprint}' is not sha256:<64-hex>`,
      });
    }

    if (!parsed.continuityBlock) {
      diagnostics.push({
        code: 'SPECDOC_FRONTMATTER_006',
        severity: 'warning',
        detail: `${document.basename}: _memory.continuity is missing`,
      });
      continue;
    }

    const packetPointer = extractContinuityField(parsed.continuityBlock, 'packet_pointer');
    const lastUpdatedAt = extractContinuityField(parsed.continuityBlock, 'last_updated_at');
    const lastUpdatedBy = extractContinuityField(parsed.continuityBlock, 'last_updated_by');
    const recentAction = extractContinuityField(parsed.continuityBlock, 'recent_action');
    const nextSafeAction = extractContinuityField(parsed.continuityBlock, 'next_safe_action');

    const requiredPairs: Array<[string, string | null]> = [
      ['packet_pointer', packetPointer],
      ['last_updated_at', lastUpdatedAt],
      ['last_updated_by', lastUpdatedBy],
      ['recent_action', recentAction],
      ['next_safe_action', nextSafeAction],
    ];

    const missingFields = requiredPairs.filter(([, value]) => value === null);
    if (missingFields.length > 0) {
      diagnostics.push({
        code: 'SPECDOC_FRONTMATTER_003',
        severity: 'error',
        detail: `${document.basename}: missing continuity fields ${missingFields.map(([field]) => field).join(', ')}`,
      });
    }

    if (packetPointer && (!/^[a-z0-9._-]+(?:\/[a-z0-9._-]+)+\/?$/.test(packetPointer) || packetPointer.includes('..') || packetPointer.includes('\\'))) {
      diagnostics.push({
        code: 'SPECDOC_FRONTMATTER_004',
        severity: 'error',
        detail: `${document.basename}: packet_pointer '${packetPointer}' is not a safe relative packet path`,
      });
    }

    if (lastUpdatedAt && Number.isNaN(Date.parse(lastUpdatedAt))) {
      diagnostics.push({
        code: 'SPECDOC_FRONTMATTER_004',
        severity: 'error',
        detail: `${document.basename}: last_updated_at '${lastUpdatedAt}' is not ISO-8601 parseable`,
      });
    }

    if (lastUpdatedBy && !/^[a-z0-9][a-z0-9._-]{1,63}$/.test(lastUpdatedBy)) {
      diagnostics.push({
        code: 'SPECDOC_FRONTMATTER_004',
        severity: 'error',
        detail: `${document.basename}: last_updated_by '${lastUpdatedBy}' is not an actor slug`,
      });
    }

    for (const [fieldName, fieldValue] of [['recent_action', recentAction], ['next_safe_action', nextSafeAction]] as const) {
      if (!fieldValue) {
        continue;
      }
      const looksNarrative = /\n|(^|\s)(?:because|so that|which means|the reason|details|summary)\b/i.test(fieldValue)
        || /(?:[.!?].*){2,}/.test(fieldValue)
        || /^[#>*-]/.test(fieldValue)
        || /\bhttps?:\/\//.test(fieldValue);
      if (looksNarrative || fieldValue.length > 96) {
        diagnostics.push({
          code: 'SPECDOC_FRONTMATTER_004',
          severity: 'error',
          detail: `${document.basename}: ${fieldName} must stay compact and non-narrative`,
        });
      }
    }

    const blockers = extractContinuityList(parsed.continuityBlock, 'blockers');
    const keyFiles = extractContinuityList(parsed.continuityBlock, 'key_files');

    if (blockers.length > 5) {
      diagnostics.push({
        code: 'SPECDOC_FRONTMATTER_004',
        severity: 'error',
        detail: `${document.basename}: blockers contains ${blockers.length} items (max 5)`,
      });
    }

    if (keyFiles.some((value) => value.startsWith('/') || value.includes('..') || value.includes('\\'))) {
      diagnostics.push({
        code: 'SPECDOC_FRONTMATTER_004',
        severity: 'error',
        detail: `${document.basename}: key_files must stay repo-relative`,
      });
    }

    if (Buffer.byteLength(parsed.continuityBlock, 'utf8') > 2048) {
      diagnostics.push({
        code: 'SPECDOC_FRONTMATTER_007',
        severity: 'warning',
        detail: `${document.basename}: _memory.continuity is ${Buffer.byteLength(parsed.continuityBlock, 'utf8')} bytes (> 2048)`,
      });
    }
  }

  return createResult(
    'FRONTMATTER_MEMORY_BLOCK',
    diagnostics,
    'All spec-doc frontmatter memory blocks are structurally valid',
  );
}

function detectAnchorShape(anchorBody: string, basename: string, anchorId: string): 'table' | 'checklist' | 'adr' | 'section' | 'prose' {
  const trimmed = anchorBody.trim();
  if (basename === 'decision-record.md' || anchorId.startsWith('adr-')) {
    return 'adr';
  }
  if (/^\|.+\|$/m.test(trimmed)) {
    return 'table';
  }
  if (/^-\s+\[[ xX]\]/m.test(trimmed) || /\bT\d{3}\b/.test(trimmed) || /\bCHK-\d{3}\b/.test(trimmed)) {
    return 'checklist';
  }
  if (/^##+\s+/m.test(trimmed)) {
    return 'section';
  }
  return 'prose';
}

function validateMergeLegality(folder: string, mergePlan: MergePlan | null | undefined): RuleResult {
  if (!mergePlan) {
    return createResult('MERGE_LEGALITY', [], 'No merge plan supplied; legality check skipped');
  }

  const diagnostics: RuleDiagnostic[] = [];
  const targetPath = resolveTargetPath(folder, mergePlan.targetFile);

  if (!targetPath || !fs.existsSync(targetPath)) {
    diagnostics.push({
      code: 'SPECDOC_MERGE_001',
      severity: 'error',
      detail: `target doc '${mergePlan.targetFile ?? '(missing)'}' does not exist`,
    });
    return createResult('MERGE_LEGALITY', diagnostics, 'Merge legality check passed');
  }

  const content = fs.readFileSync(targetPath, 'utf8');
  if (/^(<{7}|={7}|>{7})/m.test(content)) {
    diagnostics.push({
      code: 'SPECDOC_MERGE_005',
      severity: 'error',
      detail: `${path.basename(targetPath)} contains conflict markers`,
    });
    return createResult('MERGE_LEGALITY', diagnostics, 'Merge legality check passed');
  }

  if (mergePlan.mergeMode === 'set-field') {
    if (!mergePlan.fieldPath || !mergePlan.fieldPath.startsWith('_memory.')) {
      diagnostics.push({
        code: 'SPECDOC_MERGE_003',
        severity: 'error',
        detail: `set-field requires an _memory.* field path`,
      });
    }
    return createResult('MERGE_LEGALITY', diagnostics, 'Merge legality check passed');
  }

  const parsed = parseAnchors(content);
  if (parsed.errors.length > 0) {
    diagnostics.push({
      code: 'SPECDOC_MERGE_004',
      severity: 'error',
      detail: `${path.basename(targetPath)} cannot be merged because anchor parsing is already invalid`,
    });
    return createResult('MERGE_LEGALITY', diagnostics, 'Merge legality check passed');
  }

  const matches = parsed.anchors.filter((anchor) => anchor.id === mergePlan.targetAnchor);
  if (matches.length !== 1) {
    diagnostics.push({
      code: 'SPECDOC_MERGE_002',
      severity: 'error',
      detail: `${path.basename(targetPath)} target anchor '${mergePlan.targetAnchor ?? '(missing)'}' is missing or duplicated`,
    });
    return createResult('MERGE_LEGALITY', diagnostics, 'Merge legality check passed');
  }

  const targetAnchor = matches[0];
  const shape = detectAnchorShape(targetAnchor.body, path.basename(targetPath), targetAnchor.id);

  const compatible = (() => {
    switch (mergePlan.mergeMode) {
      case 'append-as-paragraph':
        return shape === 'prose' || shape === 'section';
      case 'insert-new-adr':
        return shape === 'adr';
      case 'append-table-row':
        return shape === 'table';
      case 'update-in-place':
        return shape === 'checklist';
      case 'append-section':
        return shape === 'section' || /research/.test(path.basename(targetPath));
      default:
        return false;
    }
  })();

  if (!compatible) {
    diagnostics.push({
      code: 'SPECDOC_MERGE_003',
      severity: 'error',
      detail: `${mergePlan.mergeMode ?? '(missing merge mode)'} is not legal for ${shape} anchor '${targetAnchor.id}'`,
    });
  }

  if (mergePlan.mergeMode === 'append-table-row' && mergePlan.chunkText) {
    const headerLine = targetAnchor.body.split('\n').find((line) => /^\|.+\|$/.test(line));
    if (headerLine) {
      const expectedColumns = headerLine.split('|').length;
      const actualColumns = mergePlan.chunkText.split('|').length;
      if (expectedColumns !== actualColumns) {
        diagnostics.push({
          code: 'SPECDOC_MERGE_004',
          severity: 'error',
          detail: `append-table-row column count ${actualColumns} does not match header width ${expectedColumns}`,
        });
      }
    }
  }

  if (mergePlan.mergeMode === 'update-in-place' && mergePlan.taskId && !targetAnchor.body.includes(mergePlan.taskId)) {
    diagnostics.push({
      code: 'SPECDOC_MERGE_004',
      severity: 'error',
      detail: `update-in-place target '${mergePlan.taskId}' was not found in anchor '${targetAnchor.id}'`,
    });
  }

  return createResult('MERGE_LEGALITY', diagnostics, 'Merge legality check passed');
}

function looksLikeCitation(text: string): boolean {
  return /\[[^\]]+\]\([^)]+\)|`[^`]+(?:\/[^`]+)?`|https?:\/\/|iteration-\d+|source:/i.test(text);
}

function validateSpecDocSufficiency(folder: string): RuleResult {
  const diagnostics: RuleDiagnostic[] = [];

  for (const document of collectDocuments(folder)) {
    const parsed = parseAnchors(document.content);
    const anchorMap = new Map(parsed.anchors.map((anchor) => [anchor.id, anchor]));

    for (const anchor of parsed.anchors) {
      if (anchor.body.trim().length === 0) {
        diagnostics.push({
          code: 'SPECDOC_SUFFICIENCY_001',
          severity: 'error',
          detail: `${document.basename}:${anchor.id} is empty`,
        });
      }
    }

    const whatBuilt = anchorMap.get('what-built');
    if (whatBuilt && !/(?:`[^`]+`|\[[^\]]+\]\([^)]+\)|[A-Za-z0-9._/-]+\.(?:ts|tsx|js|md|sh))/m.test(whatBuilt.body)) {
      diagnostics.push({
        code: 'SPECDOC_SUFFICIENCY_002',
        severity: 'warning',
        detail: `${document.basename}:what-built is missing a concrete file, code, or artifact citation`,
      });
    }

    const verification = anchorMap.get('verification');
    if (verification && !/(?:`[^`]+`|\bPASS\b|\bEVIDENCE\b|\bvitest\b|\bvalidate\.sh\b|\bnpm\b|\bcoverage\b|\btested\b)/i.test(verification.body)) {
      diagnostics.push({
        code: 'SPECDOC_SUFFICIENCY_002',
        severity: 'warning',
        detail: `${document.basename}:verification is missing a concrete command or verification artifact`,
      });
    }

    if (/research(?:\/research)?\.md$/.test(document.basename)) {
      const citedResearch = parsed.anchors.some((anchor) => looksLikeCitation(anchor.body));
      if (!citedResearch) {
        diagnostics.push({
          code: 'SPECDOC_SUFFICIENCY_004',
          severity: 'warning',
          detail: `${document.basename}: research content is missing a citation`,
        });
      }
    }

    if (document.basename === 'decision-record.md') {
      for (const anchor of parsed.anchors.filter((entry) => entry.id.startsWith('adr-'))) {
        if (/-(?:decision|alternatives|consequences)$/.test(anchor.id) && anchor.body.trim().length < 24) {
          diagnostics.push({
            code: 'SPECDOC_SUFFICIENCY_003',
            severity: 'warning',
            detail: `${document.basename}:${anchor.id} looks incomplete for ADR content`,
          });
        }
      }
    }
  }

  return createResult(
    'SPEC_DOC_SUFFICIENCY',
    diagnostics,
    'All targeted spec-doc anchors meet the sufficiency baseline',
  );
}

function inferCategory(text: string): string {
  const normalized = text.trim();
  if (!normalized) {
    return 'drop';
  }
  if (/CONVERSATION_LOG|toolCalls?|assistant:|user:|system:/i.test(normalized)) {
    return 'drop';
  }
  if (/^-\s+\[[ xX]\]|\bT\d{3}\b|\bCHK-\d{3}\b/m.test(normalized)) {
    return 'task_update';
  }
  if (/_memory|packet_pointer:|fingerprint:|session_dedup|completion_pct|open_questions:/i.test(normalized)) {
    return 'metadata_only';
  }
  if (/\bADR-\d+\b|\bwe chose\b|\bdecision\b/i.test(normalized)) {
    return 'decision_log';
  }
  if (/\bsource\b|\bcitation\b|\biteration-\d+\b|https?:\/\//i.test(normalized)) {
    return 'research_findings';
  }
  return 'narrative_progress';
}

function validateCrossAnchorContamination(contaminationPlan: ContaminationPlan | null | undefined): RuleResult {
  if (!contaminationPlan || !contaminationPlan.chunkText) {
    return createResult(
      'CROSS_ANCHOR_CONTAMINATION',
      [],
      'No routing payload supplied; contamination check skipped',
    );
  }

  const diagnostics: RuleDiagnostic[] = [];
  const inferred = inferCategory(contaminationPlan.chunkText);
  const routed = ROUTE_CATEGORY_ALIASES[(contaminationPlan.routeCategory ?? '').toLowerCase()] ?? contaminationPlan.routeCategory ?? 'unknown';

  if (inferred === 'drop') {
    diagnostics.push({
      code: 'SPECDOC_CONTAM_003',
      severity: 'error',
      detail: `routing payload resolves to drop but was routed as '${routed}'`,
    });
    return createResult(
      'CROSS_ANCHOR_CONTAMINATION',
      diagnostics,
      'Cross-anchor contamination check passed',
    );
  }

  if (routed !== inferred) {
    diagnostics.push({
      code: inferred === 'task_update' || inferred === 'metadata_only'
        ? 'SPECDOC_CONTAM_002'
        : 'SPECDOC_CONTAM_001',
      severity: 'warning',
      detail: `routing payload looks like '${inferred}' but was routed as '${routed}'`,
    });
  }

  if (contaminationPlan.routeOverrideAccepted && diagnostics.length > 0) {
    diagnostics.push({
      code: 'SPECDOC_CONTAM_001',
      severity: 'warning',
      detail: `route override accepted risk for '${routed}'`,
    });
  }

  return createResult(
    'CROSS_ANCHOR_CONTAMINATION',
    diagnostics,
    'Cross-anchor contamination check passed',
  );
}

function validatePostSaveFingerprint(folder: string, postSavePlan: PostSavePlan | null | undefined): RuleResult {
  if (!postSavePlan) {
    return createResult(
      'POST_SAVE_FINGERPRINT',
      [],
      'No post-save payload supplied; fingerprint check skipped',
    );
  }

  const diagnostics: RuleDiagnostic[] = [];

  if (!postSavePlan.expectedFingerprint) {
    diagnostics.push({
      code: 'SPECDOC_FINGERPRINT_001',
      severity: 'error',
      detail: `expected fingerprint is required`,
    });
    return createResult('POST_SAVE_FINGERPRINT', diagnostics, 'Post-save fingerprint check passed');
  }

  const targetPath = resolveTargetPath(folder, postSavePlan.file);
  if (!targetPath || !fs.existsSync(targetPath)) {
    diagnostics.push({
      code: 'SPECDOC_FINGERPRINT_004',
      severity: 'error',
      detail: `post-save target '${postSavePlan.file ?? '(missing)'}' does not exist`,
    });
    return createResult('POST_SAVE_FINGERPRINT', diagnostics, 'Post-save fingerprint check passed');
  }

  const currentContent = fs.readFileSync(targetPath, 'utf8');
  const currentFingerprint = computeNormalizedFingerprint(currentContent);
  const stat = fs.statSync(targetPath);

  if (
    (typeof postSavePlan.expectedSize === 'number' && stat.size !== postSavePlan.expectedSize)
    || (typeof postSavePlan.expectedMtimeMs === 'number' && Math.round(stat.mtimeMs) !== Math.round(postSavePlan.expectedMtimeMs))
  ) {
    diagnostics.push({
      code: 'SPECDOC_FINGERPRINT_004',
      severity: 'error',
      detail: `${path.basename(targetPath)} changed size or mtime during verification`,
    });
  }

  if (currentFingerprint !== postSavePlan.expectedFingerprint) {
    if (typeof postSavePlan.snapshotContent === 'string') {
      try {
        fs.writeFileSync(targetPath, postSavePlan.snapshotContent, 'utf8');
      } catch (error) {
        diagnostics.push({
          code: 'SPECDOC_FINGERPRINT_003',
          severity: 'error',
          detail: `rollback failed after fingerprint mismatch: ${(error as Error).message}`,
        });
      }
    }

    diagnostics.push({
      code: 'SPECDOC_FINGERPRINT_002',
      severity: 'error',
      detail: `${path.basename(targetPath)} fingerprint ${currentFingerprint} did not match expected ${postSavePlan.expectedFingerprint}`,
    });
  }

  return createResult(
    'POST_SAVE_FINGERPRINT',
    diagnostics,
    'Post-save fingerprint check passed',
  );
}

export function runSpecDocStructureRule(options: SpecDocRuleOptions): RuleResult {
  switch (options.rule) {
    case 'FRONTMATTER_MEMORY_BLOCK':
      return validateFrontmatterMemoryBlock(options.folder);
    case 'MERGE_LEGALITY':
      return validateMergeLegality(options.folder, options.mergePlan);
    case 'SPEC_DOC_SUFFICIENCY':
      return validateSpecDocSufficiency(options.folder);
    case 'CROSS_ANCHOR_CONTAMINATION':
      return validateCrossAnchorContamination(options.contaminationPlan);
    case 'POST_SAVE_FINGERPRINT':
      return validatePostSaveFingerprint(options.folder, options.postSavePlan);
    default:
      return createResult(options.rule, [], `${options.rule} skipped`);
  }
}

function emitTsv(result: RuleResult): void {
  process.stdout.write(`rule\t${result.rule}\n`);
  process.stdout.write(`status\t${result.status}\n`);
  process.stdout.write(`message\t${result.message}\n`);
  for (const diagnostic of result.diagnostics) {
    process.stdout.write(`detail\t${diagnostic.code}: ${diagnostic.detail}\n`);
  }
}

function parseJsonArg<T>(raw: string | undefined): T | null {
  if (!raw) {
    return null;
  }
  return JSON.parse(raw) as T;
}

function parseCliArgs(argv: string[]): SpecDocRuleOptions & { output: 'tsv' | 'json' } {
  const options: {
    folder?: string;
    level?: string;
    rule?: SpecDocRuleName;
    output: 'tsv' | 'json';
    mergePlan?: MergePlan | null;
    contaminationPlan?: ContaminationPlan | null;
    postSavePlan?: PostSavePlan | null;
  } = {
    output: 'tsv',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];
    switch (arg) {
      case '--folder':
        options.folder = value;
        index += 1;
        break;
      case '--level':
        options.level = value;
        index += 1;
        break;
      case '--rule':
        options.rule = normalizeRuleName(value);
        index += 1;
        break;
      case '--output':
        options.output = value === 'json' ? 'json' : 'tsv';
        index += 1;
        break;
      case '--merge-plan-json':
        options.mergePlan = parseJsonArg<MergePlan>(value);
        index += 1;
        break;
      case '--contamination-json':
        options.contaminationPlan = parseJsonArg<ContaminationPlan>(value);
        index += 1;
        break;
      case '--post-save-json':
        options.postSavePlan = parseJsonArg<PostSavePlan>(value);
        index += 1;
        break;
      default:
        break;
    }
  }

  if (!options.folder || !options.level || !options.rule) {
    throw new Error(
      'Usage: spec-doc-structure.ts --folder <path> --level <level> --rule <FRONTMATTER_MEMORY_BLOCK|MERGE_LEGALITY|SPEC_DOC_SUFFICIENCY|CROSS_ANCHOR_CONTAMINATION|POST_SAVE_FINGERPRINT> [--merge-plan-json <json>] [--contamination-json <json>] [--post-save-json <json>] [--output tsv|json]',
    );
  }

  return {
    folder: options.folder,
    level: options.level,
    rule: options.rule,
    mergePlan: options.mergePlan,
    contaminationPlan: options.contaminationPlan,
    postSavePlan: options.postSavePlan,
    output: options.output,
  };
}

function main(argv: string[]): number {
  const options = parseCliArgs(argv);
  const result = runSpecDocStructureRule(options);

  if (options.output === 'json') {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    emitTsv(result);
  }

  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 2;
  }
}
