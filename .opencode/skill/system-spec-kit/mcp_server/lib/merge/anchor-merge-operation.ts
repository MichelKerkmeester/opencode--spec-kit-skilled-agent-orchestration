// ───────────────────────────────────────────────────────────────
// MODULE: Anchor Merge Operation
// ───────────────────────────────────────────────────────────────
// Pure anchor-scoped merge transforms for canonical spec-doc writes.

export type AnchorMergeMode =
  | 'append-as-paragraph'
  | 'insert-new-adr'
  | 'append-table-row'
  | 'update-in-place'
  | 'append-section';

export interface AppendAsParagraphPayload {
  paragraph: string;
}

export interface InsertNewAdrPayload {
  title: string;
  context: string;
  decision: string;
  consequences?: string[];
  status?: string;
  date?: string;
}

export interface AppendTableRowPayload {
  cells: string[];
  dedupeColumn?: number;
  dedupeKey?: string;
}

export interface UpdateInPlacePayload {
  targetId: string;
  checked?: boolean;
  evidence?: string;
}

export interface AppendSectionPayload {
  title: string;
  body: string;
  headingLevel?: number;
}

export type AnchorMergePayload =
  | AppendAsParagraphPayload
  | InsertNewAdrPayload
  | AppendTableRowPayload
  | UpdateInPlacePayload
  | AppendSectionPayload;

export interface AnchorMergeRequest {
  documentContent: string;
  docPath: string;
  anchorId: string;
  mergeMode: AnchorMergeMode;
  payload: AnchorMergePayload;
  dedupeFingerprint: string;
}

export interface AnchorMergeResult {
  changed: boolean;
  docPath: string;
  anchorId: string;
  mergeMode: AnchorMergeMode;
  updatedDocument: string;
  updatedAnchorBody: string;
  dedupeFingerprint: string;
  reason?: string;
  metadata: {
    insertedFingerprintComment: boolean;
    adrNumber?: number;
    updatedLineIndex?: number;
    appendedSectionTitle?: string;
    appendedTableRow?: string[];
  };
}

export type AnchorMergeErrorCode =
  | 'SPECDOC_MERGE_001'
  | 'SPECDOC_MERGE_002'
  | 'SPECDOC_MERGE_003'
  | 'SPECDOC_MERGE_004'
  | 'SPECDOC_MERGE_005';

export class AnchorMergeOperationError extends Error {
  public readonly code: AnchorMergeErrorCode;
  public readonly details: Record<string, unknown>;

  constructor(code: AnchorMergeErrorCode, message: string, details: Record<string, unknown> = {}) {
    super(message);
    Object.setPrototypeOf(this, AnchorMergeOperationError.prototype);
    this.name = 'AnchorMergeOperationError';
    this.code = code;
    this.details = details;
  }
}

interface SplitDocument {
  frontmatter: string;
  separator: string;
  body: string;
  newline: string;
}

interface AnchorBlock {
  before: string;
  openMarker: string;
  rawAnchorBody: string;
  innerAnchorBody: string;
  leadingBoundary: string;
  trailingBoundary: string;
  closeMarker: string;
  after: string;
}

interface MergeTransformOutcome {
  changed: boolean;
  updatedAnchorBody: string;
  insertedFingerprintComment: boolean;
  reason?: string;
  metadata?: AnchorMergeResult['metadata'];
}

interface UpdateInPlaceOptions {
  checklistOnly?: boolean;
}

const ADR_ANCHOR_RE = /<!--\s*ANCHOR:\s*adr-(\d{3})\s*-->/gi;
const ADR_TITLE_RE = /^##\s+ADR-\d{3}:\s+(.+)$/gim;
const CONFLICT_MARKER_RE = /^(<<<<<<<|=======|>>>>>>>)(?: .*)?$/m;
const FP_COMMENT_PREFIX = '<!-- CONTINUITY-FP: ';

export function anchorMergeOperation(request: AnchorMergeRequest): AnchorMergeResult {
  if (typeof request.documentContent !== 'string' || request.documentContent.length === 0) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_001',
      `Target document ${request.docPath} is empty or unreadable.`,
      { docPath: request.docPath }
    );
  }

  const split = splitDocument(request.documentContent);
  if (request.mergeMode === 'update-in-place') {
    prevalidateTaskUpdateMerge(request, split.body);
  }
  if (request.mergeMode === 'insert-new-adr' && request.anchorId === 'adr-NNN') {
    failOnCorruptedAnchorBody(split.body, request);
    const transform = mergeInsertNewAdr(
      request.payload as InsertNewAdrPayload,
      split.body,
      request.dedupeFingerprint,
      split.newline,
    );
    validateAnchorGraph(request, split.body, transform.updatedAnchorBody);
    return {
      changed: transform.changed,
      docPath: request.docPath,
      anchorId: request.anchorId,
      mergeMode: request.mergeMode,
      updatedDocument: `${split.frontmatter}${split.separator}${transform.updatedAnchorBody}`,
      updatedAnchorBody: transform.updatedAnchorBody,
      dedupeFingerprint: request.dedupeFingerprint,
      reason: transform.reason,
      metadata: {
        insertedFingerprintComment: transform.insertedFingerprintComment,
        ...(transform.metadata ?? {}),
      },
    };
  }
  const block = locateAnchorBlock(split.body, request.anchorId);
  const transform = dispatchMergeMode(request, block.innerAnchorBody, split.newline);
  const rebuiltBody = rebuildBody(block, transform.updatedAnchorBody);
  validateAnchorGraph(request, split.body, rebuiltBody);

  const updatedDocument = `${split.frontmatter}${split.separator}${rebuiltBody}`;
  return {
    changed: transform.changed,
    docPath: request.docPath,
    anchorId: request.anchorId,
    mergeMode: request.mergeMode,
    updatedDocument,
    updatedAnchorBody: transform.updatedAnchorBody,
    dedupeFingerprint: request.dedupeFingerprint,
    reason: transform.reason,
    metadata: {
      insertedFingerprintComment: transform.insertedFingerprintComment,
      ...(transform.metadata ?? {}),
    },
  };
}

function splitDocument(documentContent: string): SplitDocument {
  const newline = documentContent.includes('\r\n') ? '\r\n' : '\n';
  const frontmatterMatch = documentContent.match(/^(---\r?\n[\s\S]*?\r?\n---)(\r?\n?)([\s\S]*)$/);
  if (!frontmatterMatch) {
    return {
      frontmatter: '',
      separator: '',
      body: documentContent,
      newline,
    };
  }

  return {
    frontmatter: frontmatterMatch[1],
    separator: frontmatterMatch[2] ?? '',
    body: frontmatterMatch[3] ?? '',
    newline,
  };
}

function locateAnchorBlock(body: string, anchorId: string): AnchorBlock {
  const escapedAnchorId = escapeRegex(anchorId);
  const openRe = new RegExp(`<!--\\s*(?:ANCHOR|anchor):\\s*${escapedAnchorId}\\s*-->`, 'i');
  const closeRe = new RegExp(`<!--\\s*\\/(?:ANCHOR|anchor):\\s*${escapedAnchorId}\\s*-->`, 'i');
  const openMatch = openRe.exec(body);

  if (!openMatch || openMatch.index === undefined) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_002',
      `Target anchor ${anchorId} not found.`,
      { anchorId }
    );
  }

  const openIndex = openMatch.index;
  const openMarker = openMatch[0];
  const openEnd = openIndex + openMarker.length;
  const closeSource = body.slice(openEnd);
  const closeMatch = closeRe.exec(closeSource);

  if (!closeMatch || closeMatch.index === undefined) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_003',
      `Anchor ${anchorId} is missing its closing marker.`,
      { anchorId }
    );
  }

  const closeIndex = openEnd + closeMatch.index;
  const closeMarker = closeMatch[0];
  const rawAnchorBody = body.slice(openEnd, closeIndex);
  const leadingBoundary = rawAnchorBody.match(/^\r?\n/u)?.[0] ?? '';
  const trailingBoundary = rawAnchorBody.match(/\r?\n$/u)?.[0] ?? '';
  const startTrim = leadingBoundary.length;
  const endTrim = trailingBoundary.length > 0 ? rawAnchorBody.length - trailingBoundary.length : rawAnchorBody.length;

  return {
    before: body.slice(0, openIndex),
    openMarker,
    rawAnchorBody,
    innerAnchorBody: rawAnchorBody.slice(startTrim, endTrim),
    leadingBoundary,
    trailingBoundary,
    closeMarker,
    after: body.slice(closeIndex + closeMarker.length),
  };
}

function rebuildBody(block: AnchorBlock, updatedAnchorBody: string): string {
  return [
    block.before,
    block.openMarker,
    block.leadingBoundary,
    updatedAnchorBody,
    block.trailingBoundary,
    block.closeMarker,
    block.after,
  ].join('');
}

function dispatchMergeMode(
  request: AnchorMergeRequest,
  anchorBody: string,
  newline: string
): MergeTransformOutcome {
  failOnCorruptedAnchorBody(anchorBody, request);
  const updateInPlacePayload = request.payload as UpdateInPlacePayload;
  const checklistOnly = isTaskUpdatePrevalidationCandidate(request.docPath, updateInPlacePayload.targetId);

  switch (request.mergeMode) {
    case 'append-as-paragraph':
      return mergeAppendAsParagraph(request.payload as AppendAsParagraphPayload, anchorBody, request.dedupeFingerprint, newline);
    case 'insert-new-adr':
      return mergeInsertNewAdr(request.payload as InsertNewAdrPayload, anchorBody, request.dedupeFingerprint, newline);
    case 'append-table-row':
      return mergeAppendTableRow(request.payload as AppendTableRowPayload, anchorBody, request.dedupeFingerprint, newline);
    case 'update-in-place':
      return mergeUpdateInPlace(updateInPlacePayload, anchorBody, { checklistOnly });
    case 'append-section':
      return mergeAppendSection(request.payload as AppendSectionPayload, anchorBody, request.dedupeFingerprint, newline);
    default:
      throw new AnchorMergeOperationError(
        'SPECDOC_MERGE_003',
        `Unsupported merge mode: ${String(request.mergeMode)}`,
        { mergeMode: request.mergeMode }
      );
  }
}

function mergeAppendAsParagraph(
  payload: AppendAsParagraphPayload,
  anchorBody: string,
  dedupeFingerprint: string,
  newline: string
): MergeTransformOutcome {
  const paragraph = normalizeParagraphPayload(payload.paragraph);
  if (fingerprintAlreadyPresent(anchorBody, dedupeFingerprint)) {
    return noOp(anchorBody, 'fingerprint already present');
  }
  if (normalizedText(anchorBody).includes(normalizedText(paragraph))) {
    return noOp(anchorBody, 'paragraph already present');
  }

  const fingerprintLine = buildFingerprintComment(dedupeFingerprint);
  const { bodyWithoutTrailingComments, trailingComments } = splitTrailingComments(anchorBody, newline);
  const updatedAnchorBody = bodyWithoutTrailingComments.trim().length === 0
    ? [fingerprintLine, paragraph].join(newline)
    : joinContentBlocks([bodyWithoutTrailingComments, fingerprintLine, paragraph], newline, trailingComments);

  return {
    changed: true,
    updatedAnchorBody,
    insertedFingerprintComment: true,
  };
}

function mergeInsertNewAdr(
  payload: InsertNewAdrPayload,
  anchorBody: string,
  dedupeFingerprint: string,
  newline: string
): MergeTransformOutcome {
  const title = normalizeTitle(payload.title);
  const context = normalizeParagraphPayload(payload.context);
  const decision = normalizeParagraphPayload(payload.decision);
  const consequences = Array.isArray(payload.consequences)
    ? payload.consequences.map((entry) => normalizeInlineText(entry)).filter(Boolean)
    : [];

  if (!title || !context || !decision) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_005',
      'ADR payload requires title, context, and decision.',
      { titlePresent: Boolean(title), contextPresent: Boolean(context), decisionPresent: Boolean(decision) }
    );
  }

  if (fingerprintAlreadyPresent(anchorBody, dedupeFingerprint)) {
    return noOp(anchorBody, 'adr fingerprint already present');
  }

  for (const match of anchorBody.matchAll(ADR_TITLE_RE)) {
    if (normalizeTitle(match[1] ?? '') === title) {
      return noOp(anchorBody, 'adr title already present');
    }
  }

  const nextAdrNumber = computeNextAdrNumber(anchorBody);
  const adrId = `adr-${String(nextAdrNumber).padStart(3, '0')}`;
  const adrSection = renderAdrSection({
    adrId,
    title,
    context,
    decision,
    consequences,
    dedupeFingerprint,
    newline,
    status: normalizeInlineText(payload.status ?? '') || 'Proposed',
    date: normalizeInlineText(payload.date ?? '') || new Date().toISOString().slice(0, 10),
  });
  const { bodyWithoutTrailingComments, trailingComments } = splitTrailingComments(anchorBody, newline);
  const updatedAnchorBody = bodyWithoutTrailingComments.trim().length === 0
    ? adrSection
    : joinContentBlocks([bodyWithoutTrailingComments, adrSection], newline, trailingComments);

  return {
    changed: true,
    updatedAnchorBody,
    insertedFingerprintComment: true,
    metadata: {
      insertedFingerprintComment: true,
      adrNumber: nextAdrNumber,
    },
  };
}

function mergeAppendTableRow(
  payload: AppendTableRowPayload,
  anchorBody: string,
  _dedupeFingerprint: string,
  newline: string
): MergeTransformOutcome {
  if (!Array.isArray(payload.cells) || payload.cells.length === 0) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_005',
      'append-table-row requires one or more cells.',
      {}
    );
  }

  const table = locateMarkdownTable(anchorBody);
  const normalizedCells = payload.cells.map((cell) => escapeTableCell(normalizeInlineText(cell)));
  if (normalizedCells.length !== table.columnCount) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_003',
      `Table row width ${normalizedCells.length} does not match header width ${table.columnCount}.`,
      { expected: table.columnCount, received: normalizedCells.length }
    );
  }

  const dedupeColumn = payload.dedupeColumn ?? 0;
  if (dedupeColumn < 0 || dedupeColumn >= normalizedCells.length) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_005',
      `Dedupe column ${dedupeColumn} is outside the row width.`,
      { dedupeColumn, width: normalizedCells.length }
    );
  }

  const dedupeKey = normalizeInlineText(payload.dedupeKey ?? normalizedCells[dedupeColumn]);
  if (!dedupeKey) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_005',
      'append-table-row requires a non-empty dedupe key.',
      { dedupeColumn }
    );
  }

  if (table.rows.some((row) => normalizeInlineText(row.cells[dedupeColumn] ?? '') === dedupeKey)) {
    return noOp(anchorBody, 'logical table row already present');
  }

  const newRow = `| ${normalizedCells.join(' | ')} |`;
  const updatedLines = [...table.lines];
  updatedLines.splice(table.insertAtLine, 0, newRow);

  return {
    changed: true,
    updatedAnchorBody: spliceLines(anchorBody, table.startLine, table.endLine, updatedLines, newline),
    insertedFingerprintComment: false,
    metadata: {
      insertedFingerprintComment: false,
      appendedTableRow: normalizedCells,
    },
  };
}

function mergeUpdateInPlace(
  payload: UpdateInPlacePayload,
  anchorBody: string,
  options: UpdateInPlaceOptions = {},
): MergeTransformOutcome {
  const targetId = normalizeInlineText(payload.targetId);
  if (!targetId) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_005',
      'update-in-place requires a non-empty targetId.',
      {}
    );
  }

  const lines = anchorBody.split(/\r?\n/);
  const targetMatches = lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => matchUpdateInPlaceLine(line, targetId, options.checklistOnly ?? false));

  if (targetMatches.length === 0) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_002',
      `Target item ${targetId} not found in anchor body.`,
      { targetId }
    );
  }

  if (targetMatches.length > 1) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_003',
      `Target item ${targetId} appears multiple times in the anchor body.`,
      { targetId, occurrences: targetMatches.length }
    );
  }

  const target = targetMatches[0];
  if (!target) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_002',
      `Target item ${targetId} not found in anchor body.`,
      { targetId }
    );
  }
  if (!/^\s*(?:[-*]|\d+\.)\s+/.test(target.line)) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_003',
      `Target item ${targetId} is not inside a structured list/checklist line.`,
      { targetId }
    );
  }

  let updatedLine = target.line;
  if (payload.checked !== undefined) {
    if (!/\[[ xX]\]/.test(updatedLine)) {
      throw new AnchorMergeOperationError(
        'SPECDOC_MERGE_003',
        `Target item ${targetId} does not contain a checklist marker.`,
        { targetId }
      );
    }
    updatedLine = updatedLine.replace(/\[[ xX]\]/, payload.checked ? '[x]' : '[ ]');
  }

  const evidence = payload.evidence ? normalizeInlineText(payload.evidence) : '';
  if (evidence && !updatedLine.includes(`[evidence: ${evidence}]`)) {
    updatedLine = `${updatedLine} [evidence: ${evidence}]`;
  }

  if (updatedLine === target.line) {
    return noOp(anchorBody, 'structured item already reflects requested state');
  }

  const updatedLines = [...lines];
  updatedLines[target.index] = updatedLine;

  return {
    changed: true,
    updatedAnchorBody: updatedLines.join(detectNewline(anchorBody)),
    insertedFingerprintComment: false,
    metadata: {
      insertedFingerprintComment: false,
      updatedLineIndex: target.index,
    },
  };
}

function prevalidateTaskUpdateMerge(request: AnchorMergeRequest, documentBody: string): void {
  const payload = request.payload as UpdateInPlacePayload;
  const targetId = normalizeInlineText(payload.targetId);
  if (!isTaskUpdatePrevalidationCandidate(request.docPath, targetId)) {
    return;
  }

  const matches = resolveChecklistTaskMatches(documentBody, targetId);
  if (matches.length === 1) {
    return;
  }

  if (matches.length === 0) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_002',
      `No matching task line found for ${targetId}`,
      { targetId, occurrences: 0 }
    );
  }

  throw new AnchorMergeOperationError(
    'SPECDOC_MERGE_003',
    `Ambiguous: ${matches.length} matching task lines for ${targetId}`,
    { targetId, occurrences: matches.length }
  );
}

function isTaskUpdatePrevalidationCandidate(docPath: string, targetId: string): boolean {
  return /(?:^|\/)(?:tasks|checklist)\.md$/iu.test(docPath) && /^(?:T\d{3}|CHK-\d{3})$/u.test(targetId);
}

function resolveChecklistTaskMatches(documentBody: string, targetId: string): Array<{ line: string; index: number }> {
  return documentBody
    .split(/\r?\n/)
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => matchUpdateInPlaceLine(line, targetId, true));
}

function matchUpdateInPlaceLine(line: string, targetId: string, checklistOnly: boolean): boolean {
  const targetPattern = new RegExp(`\\b${escapeRegex(targetId)}\\b`);
  if (checklistOnly) {
    return /^\s*(?:[-*]|\d+\.)\s+\[[ xX]\]\s+/.test(line) && targetPattern.test(line);
  }
  return targetPattern.test(line);
}

function mergeAppendSection(
  payload: AppendSectionPayload,
  anchorBody: string,
  dedupeFingerprint: string,
  newline: string
): MergeTransformOutcome {
  const title = normalizeTitle(payload.title);
  const body = normalizeMultilineBody(payload.body);
  if (!title || !body) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_005',
      'append-section requires a title and body.',
      { titlePresent: Boolean(title), bodyPresent: Boolean(body) }
    );
  }

  if (fingerprintAlreadyPresent(anchorBody, dedupeFingerprint)) {
    return noOp(anchorBody, 'section fingerprint already present');
  }

  if (sectionAlreadyPresent(anchorBody, title, body)) {
    return noOp(anchorBody, 'section already present');
  }

  const headingLevel = normalizeHeadingLevel(anchorBody, payload.headingLevel);
  const section = [
    `${'#'.repeat(headingLevel)} ${title}`,
    buildFingerprintComment(dedupeFingerprint),
    '',
    body,
  ].join(newline);
  const { bodyWithoutTrailingComments, trailingComments } = splitTrailingComments(anchorBody, newline);
  const updatedAnchorBody = bodyWithoutTrailingComments.trim().length === 0
    ? section
    : joinContentBlocks([bodyWithoutTrailingComments, section], newline, trailingComments);

  return {
    changed: true,
    updatedAnchorBody,
    insertedFingerprintComment: true,
    metadata: {
      insertedFingerprintComment: true,
      appendedSectionTitle: title,
    },
  };
}

function validateAnchorGraph(request: AnchorMergeRequest, originalBody: string, rebuiltBody: string): void {
  const originalGraph = collectAnchorGraph(originalBody);
  const rebuiltGraph = collectAnchorGraph(rebuiltBody);

  if (request.mergeMode !== 'insert-new-adr') {
    if (originalGraph.join('|') !== rebuiltGraph.join('|')) {
      throw new AnchorMergeOperationError(
        'SPECDOC_MERGE_004',
        `Merge mode ${request.mergeMode} attempted to mutate anchor structure outside its contract.`,
        { mergeMode: request.mergeMode, anchorId: request.anchorId }
      );
    }
  } else if (!isSubsequence(originalGraph, rebuiltGraph)) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_004',
      'ADR insertion changed the existing anchor order.',
      { anchorId: request.anchorId }
    );
  }
}

function collectAnchorGraph(body: string): string[] {
  const markerRe = /<!--\s*(\/?)(?:ANCHOR|anchor):\s*([^>\s]+)\s*-->/gi;
  const stack: string[] = [];
  const graph: string[] = [];

  for (const match of body.matchAll(markerRe)) {
    const isClose = (match[1] ?? '') === '/';
    const anchorId = match[2] ?? '';
    if (!anchorId) {
      throw new AnchorMergeOperationError(
        'SPECDOC_MERGE_004',
        'Encountered malformed anchor marker during post-merge validation.',
        {}
      );
    }

    if (!isClose) {
      stack.push(anchorId);
      graph.push(`open:${anchorId}`);
      continue;
    }

    const expected = stack.pop();
    if (expected !== anchorId) {
      throw new AnchorMergeOperationError(
        'SPECDOC_MERGE_004',
        `Anchor pairing mismatch: expected ${expected ?? 'none'} but saw ${anchorId}.`,
        { expected, actual: anchorId }
      );
    }
    graph.push(`close:${anchorId}`);
  }

  if (stack.length > 0) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_004',
      `Unclosed anchor markers remain after merge: ${stack.join(', ')}`,
      { unclosedAnchors: stack }
    );
  }

  return graph;
}

function normalizeParagraphPayload(paragraph: string): string {
  const cleaned = normalizeMultilineBody(paragraph);
  if (!cleaned) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_005',
      'append-as-paragraph requires non-empty paragraph content.',
      {}
    );
  }
  return cleaned;
}

function failOnCorruptedAnchorBody(anchorBody: string, request: AnchorMergeRequest): void {
  if (CONFLICT_MARKER_RE.test(anchorBody)) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_004',
      `Target anchor ${request.anchorId} contains unresolved conflict markers.`,
      { anchorId: request.anchorId }
    );
  }

  if (request.mergeMode !== 'insert-new-adr' && containsLiteralAnchorMarker(anchorBody)) {
    throw new AnchorMergeOperationError(
      'SPECDOC_MERGE_004',
      `Target anchor ${request.anchorId} contains nested anchor markers that ${request.mergeMode} cannot safely mutate.`,
      { anchorId: request.anchorId, mergeMode: request.mergeMode }
    );
  }
}

function fingerprintAlreadyPresent(anchorBody: string, dedupeFingerprint: string): boolean {
  return anchorBody.includes(buildFingerprintComment(dedupeFingerprint));
}

function buildFingerprintComment(dedupeFingerprint: string): string {
  return `${FP_COMMENT_PREFIX}${dedupeFingerprint} -->`;
}

function noOp(anchorBody: string, reason: string): MergeTransformOutcome {
  return {
    changed: false,
    updatedAnchorBody: anchorBody,
    insertedFingerprintComment: false,
    reason,
  };
}

function containsLiteralAnchorMarker(content: string): boolean {
  return /<!--\s*\/?(?:ANCHOR|anchor):/i.test(content);
}

function normalizedText(value: string): string {
  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}

function normalizeInlineText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function normalizeTitle(value: string): string {
  return normalizeInlineText(value).replace(/^[#:.,\s-]+|[#:.,\s-]+$/g, '');
}

function normalizeMultilineBody(value: string): string {
  return value
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+$/u, ''))
    .join('\n')
    .trim();
}

function computeNextAdrNumber(anchorBody: string): number {
  let maxValue = 0;
  for (const match of anchorBody.matchAll(ADR_ANCHOR_RE)) {
    const value = Number(match[1]);
    if (Number.isFinite(value)) {
      maxValue = Math.max(maxValue, value);
    }
  }
  return maxValue + 1;
}

interface RenderAdrSectionArgs {
  adrId: string;
  title: string;
  context: string;
  decision: string;
  consequences: string[];
  dedupeFingerprint: string;
  newline: string;
  status: string;
  date: string;
}

function renderAdrSection(args: RenderAdrSectionArgs): string {
  const consequencesBody = args.consequences.length > 0
    ? args.consequences.map((entry) => `- ${entry}`).join(args.newline)
    : '- No material consequences recorded yet.';

  return [
    `<!-- ANCHOR:${args.adrId} -->`,
    `## ADR-${args.adrId.slice(4)}: ${args.title}`,
    '',
    `**Status**: ${args.status}`,
    `**Date**: ${args.date}`,
    buildFingerprintComment(args.dedupeFingerprint),
    '',
    `<!-- ANCHOR:${args.adrId}-context -->`,
    '### Context',
    '',
    args.context,
    `<!-- /ANCHOR:${args.adrId}-context -->`,
    '',
    `<!-- ANCHOR:${args.adrId}-decision -->`,
    '### Decision',
    '',
    args.decision,
    `<!-- /ANCHOR:${args.adrId}-decision -->`,
    '',
    `<!-- ANCHOR:${args.adrId}-consequences -->`,
    '### Consequences',
    '',
    consequencesBody,
    `<!-- /ANCHOR:${args.adrId}-consequences -->`,
    `<!-- /ANCHOR:${args.adrId} -->`,
  ].join(args.newline);
}

interface ParsedTableRow {
  raw: string;
  cells: string[];
}

interface ParsedTable {
  lines: string[];
  rows: ParsedTableRow[];
  startLine: number;
  endLine: number;
  insertAtLine: number;
  columnCount: number;
}

function locateMarkdownTable(anchorBody: string): ParsedTable {
  const lines = anchorBody.split(/\r?\n/);
  for (let index = 0; index < lines.length - 1; index += 1) {
    if (!looksLikeTableHeader(lines[index]) || !looksLikeTableDivider(lines[index + 1])) {
      continue;
    }

    const tableLines = [lines[index], lines[index + 1]];
    let cursor = index + 2;
    while (cursor < lines.length && looksLikeTableDataRow(lines[cursor])) {
      tableLines.push(lines[cursor]);
      cursor += 1;
    }

    const headerCells = parseTableRow(lines[index]);
    if (headerCells.length === 0) {
      break;
    }

    const rows = tableLines.slice(2).map((row) => ({
      raw: row,
      cells: parseTableRow(row),
    }));

    return {
      lines: tableLines,
      rows,
      startLine: index,
      endLine: cursor - 1,
      insertAtLine: tableLines.length,
      columnCount: headerCells.length,
    };
  }

  throw new AnchorMergeOperationError(
    'SPECDOC_MERGE_003',
    'append-table-row requires a markdown table inside the target anchor.',
    {}
  );
}

function looksLikeTableHeader(line: string): boolean {
  return /^\s*\|.+\|\s*$/u.test(line);
}

function looksLikeTableDivider(line: string): boolean {
  return /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*$/u.test(line);
}

function looksLikeTableDataRow(line: string): boolean {
  if (/^\s*$/.test(line) || /^\s*<!--/.test(line)) {
    return false;
  }
  return /^\s*\|.+\|\s*$/u.test(line);
}

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split(/\s*\|\s*/)
    .map((cell) => cell.trim());
}

function escapeTableCell(value: string): string {
  return value.replace(/\|/g, '\\|');
}

function spliceLines(source: string, startLine: number, endLine: number, replacement: string[], newline: string): string {
  const lines = source.split(/\r?\n/);
  const nextLines = [
    ...lines.slice(0, startLine),
    ...replacement,
    ...lines.slice(endLine + 1),
  ];
  return nextLines.join(newline);
}

function normalizeHeadingLevel(anchorBody: string, explicitLevel?: number): number {
  if (explicitLevel !== undefined) {
    if (!Number.isInteger(explicitLevel) || explicitLevel < 2 || explicitLevel > 6) {
      throw new AnchorMergeOperationError(
        'SPECDOC_MERGE_005',
        `Heading level must be an integer between 2 and 6, received ${explicitLevel}.`,
        { headingLevel: explicitLevel }
      );
    }
    return explicitLevel;
  }

  const headings = Array.from(anchorBody.matchAll(/^(#{2,6})\s+/gm));
  if (headings.length === 0) {
    return 3;
  }

  const lastHeading = headings[headings.length - 1];
  return Math.min((lastHeading?.[1]?.length ?? 3), 6);
}

function sectionAlreadyPresent(anchorBody: string, title: string, body: string): boolean {
  const normalizedBody = normalizedText(body);
  const sectionRe = /^(#{2,6})\s+(.+)$/gm;
  const matches = Array.from(anchorBody.matchAll(sectionRe));

  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index];
    const sectionTitle = normalizeTitle(current?.[2] ?? '');
    if (sectionTitle !== title) {
      continue;
    }

    const start = (current?.index ?? 0) + (current?.[0]?.length ?? 0);
    const end = index + 1 < matches.length ? (matches[index + 1]?.index ?? anchorBody.length) : anchorBody.length;
    const sectionBody = anchorBody.slice(start, end);
    if (normalizedText(sectionBody).includes(normalizedBody)) {
      return true;
    }
  }

  return false;
}

function splitTrailingComments(anchorBody: string, newline: string): {
  bodyWithoutTrailingComments: string;
  trailingComments: string;
} {
  const lines = anchorBody.split(/\r?\n/);
  let cursor = lines.length - 1;
  let sawComment = false;

  while (cursor >= 0) {
    const trimmed = lines[cursor]?.trim() ?? '';
    if (trimmed === '') {
      cursor -= 1;
      continue;
    }
    if (/^<!--.*-->$/u.test(trimmed)) {
      sawComment = true;
      cursor -= 1;
      continue;
    }
    break;
  }

  if (!sawComment) {
    return {
      bodyWithoutTrailingComments: anchorBody.replace(/\s+$/u, ''),
      trailingComments: '',
    };
  }

  const trailingStart = cursor + 1;
  const bodyWithoutTrailingComments = lines.slice(0, trailingStart).join(newline).replace(/\s+$/u, '');
  const trailingComments = lines.slice(trailingStart).join(newline).replace(/^\s+/u, '');
  return { bodyWithoutTrailingComments, trailingComments };
}

function joinContentBlocks(parts: string[], newline: string, trailingComments: string): string {
  const compactParts = parts.map((part) => part.trim()).filter(Boolean);
  const base = compactParts.join(`${newline}${newline}`);
  if (!trailingComments) {
    return base;
  }
  return `${base}${newline}${newline}${trailingComments}`;
}

function detectNewline(value: string): string {
  return value.includes('\r\n') ? '\r\n' : '\n';
}

function isSubsequence(expected: string[], candidate: string[]): boolean {
  let expectedIndex = 0;
  for (const item of candidate) {
    if (item === expected[expectedIndex]) {
      expectedIndex += 1;
    }
  }
  return expectedIndex === expected.length;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
