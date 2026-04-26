// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Query Result Adapter
// ───────────────────────────────────────────────────────────────
// Shared transport adapter for code_graph_query responses.

export interface CodeGraphQueryResponse {
  content: Array<{
    type?: string;
    text?: string;
  } & Record<string, unknown>>;
}

export interface OutlineQueryNode {
  name?: string;
  kind?: string;
  fqName?: string;
  line?: number;
  signature?: string;
  symbolId?: string;
}

export interface RelationshipQueryEdge {
  source?: string;
  target?: string;
  file?: string;
  line?: number;
  confidence?: number;
  numericConfidence?: number;
  detectorProvenance?: string | null;
  evidenceClass?: string | null;
  reason?: string | null;
  step?: string | null;
  edgeEvidenceClass?: string;
}

export interface OutlineQueryData extends Record<string, unknown> {
  nodes: OutlineQueryNode[];
}

export interface RelationshipQueryData extends Record<string, unknown> {
  edges: RelationshipQueryEdge[];
}

export interface ParsedQueryFailure {
  status: 'blocked' | 'error';
  reason: string;
}

export interface ParsedQuerySuccess<TData extends Record<string, unknown>> {
  status: 'ok';
  data: TData;
}

export type ParsedOutlineQueryResult = ParsedQuerySuccess<OutlineQueryData> | ParsedQueryFailure;
export type ParsedRelationshipQueryResult = ParsedQuerySuccess<RelationshipQueryData> | ParsedQueryFailure;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function asOptionalNullableString(value: unknown): string | null | undefined {
  if (value === null) {
    return null;
  }

  return asOptionalString(value);
}

function asOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function extractParsedPayload(
  response: unknown,
  context: string,
): Record<string, unknown> {
  if (!isRecord(response)) {
    throw new Error(`${context} response must be an object`);
  }

  const content = response.content;
  if (!Array.isArray(content) || content.length === 0) {
    throw new Error(`${context} response must include non-empty content`);
  }

  const textContent = content.find(
    (item) => isRecord(item) && item.type === 'text' && typeof item.text === 'string',
  );
  if (!isRecord(textContent) || typeof textContent.text !== 'string') {
    throw new Error(`${context} response must include text content`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(textContent.text);
  } catch (error) {
    throw new Error(
      `Failed to parse ${context} JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (!isRecord(parsed)) {
    throw new Error(`${context} payload must be a JSON object`);
  }

  return parsed;
}

function extractFailure(parsed: Record<string, unknown>, context: string): ParsedQueryFailure | null {
  const status = parsed.status;
  if (status !== 'blocked' && status !== 'error') {
    return null;
  }

  return {
    status,
    reason: asOptionalString(parsed.error)
      ?? asOptionalString(parsed.reason)
      ?? `${context} returned status "${status}"`,
  };
}

function parseOutlineNode(value: unknown): OutlineQueryNode {
  if (!isRecord(value)) {
    return {};
  }

  return {
    ...(asOptionalString(value.name) ? { name: asOptionalString(value.name) } : {}),
    ...(asOptionalString(value.kind) ? { kind: asOptionalString(value.kind) } : {}),
    ...(asOptionalString(value.fqName) ? { fqName: asOptionalString(value.fqName) } : {}),
    ...(asOptionalNumber(value.line) !== undefined ? { line: asOptionalNumber(value.line) } : {}),
    ...(asOptionalString(value.signature) ? { signature: asOptionalString(value.signature) } : {}),
    ...(asOptionalString(value.symbolId) ? { symbolId: asOptionalString(value.symbolId) } : {}),
  };
}

function parseRelationshipEdge(value: unknown): RelationshipQueryEdge {
  if (!isRecord(value)) {
    return {};
  }

  return {
    ...(asOptionalString(value.source) ? { source: asOptionalString(value.source) } : {}),
    ...(asOptionalString(value.target) ? { target: asOptionalString(value.target) } : {}),
    ...(asOptionalString(value.file) ? { file: asOptionalString(value.file) } : {}),
    ...(asOptionalNumber(value.line) !== undefined ? { line: asOptionalNumber(value.line) } : {}),
    ...(asOptionalNumber(value.confidence) !== undefined ? { confidence: asOptionalNumber(value.confidence) } : {}),
    ...(asOptionalNumber(value.numericConfidence) !== undefined
      ? { numericConfidence: asOptionalNumber(value.numericConfidence) }
      : {}),
    ...(asOptionalNullableString(value.detectorProvenance) !== undefined
      ? { detectorProvenance: asOptionalNullableString(value.detectorProvenance) }
      : {}),
    ...(asOptionalNullableString(value.evidenceClass) !== undefined
      ? { evidenceClass: asOptionalNullableString(value.evidenceClass) }
      : {}),
    ...(asOptionalNullableString(value.reason) !== undefined
      ? { reason: asOptionalNullableString(value.reason) }
      : {}),
    ...(asOptionalNullableString(value.step) !== undefined
      ? { step: asOptionalNullableString(value.step) }
      : {}),
    ...(asOptionalString(value.edgeEvidenceClass)
      ? { edgeEvidenceClass: asOptionalString(value.edgeEvidenceClass) }
      : {}),
  };
}

function parseSuccessData<TData extends Record<string, unknown>>(
  parsed: Record<string, unknown>,
  context: string,
  normalizer: (data: Record<string, unknown>) => TData,
): ParsedQuerySuccess<TData> {
  const status = parsed.status;
  if (status !== 'ok') {
    throw new Error(`Unsupported ${context} status: ${typeof status === 'string' ? status : String(status)}`);
  }

  const rawData = parsed.data;
  if (!isRecord(rawData)) {
    throw new Error(`${context} payload with status "ok" must include object data`);
  }

  return {
    status: 'ok',
    data: normalizer(rawData),
  };
}

export function parseOutlineQueryResult(response: unknown): ParsedOutlineQueryResult {
  const context = 'outline query';
  const parsed = extractParsedPayload(response, context);
  const failure = extractFailure(parsed, context);
  if (failure) {
    return failure;
  }

  return parseSuccessData(parsed, context, (data) => {
    const rawNodes = data.nodes;
    if (!Array.isArray(rawNodes)) {
      throw new Error('outline query payload data must include array nodes');
    }

    const nodes = rawNodes.map(parseOutlineNode);
    const normalizedData: OutlineQueryData = { ...data, nodes };
    return normalizedData;
  });
}

export function parseRelationshipQueryResult(response: unknown): ParsedRelationshipQueryResult {
  const context = 'relationship query';
  const parsed = extractParsedPayload(response, context);
  const failure = extractFailure(parsed, context);
  if (failure) {
    return failure;
  }

  return parseSuccessData(parsed, context, (data) => {
    const rawEdges = data.edges;
    if (!Array.isArray(rawEdges)) {
      throw new Error('relationship query payload data must include array edges');
    }

    const edges = rawEdges.map(parseRelationshipEdge);
    const normalizedData: RelationshipQueryData = { ...data, edges };
    return normalizedData;
  });
}
