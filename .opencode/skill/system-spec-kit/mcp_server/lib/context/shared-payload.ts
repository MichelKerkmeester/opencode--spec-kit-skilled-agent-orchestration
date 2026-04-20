// ───────────────────────────────────────────────────────────────
// MODULE: Shared Payload Contract
// ───────────────────────────────────────────────────────────────
// Phase 030 / Phase 1: common payload and provenance envelope
// shared by startup, recovery, and compaction surfaces.

import { assertNever } from '../utils/exhaustiveness.js';
import type { UnicodeRuntimeFingerprint } from '@spec-kit/shared/unicode-normalization';
import { sanitizeSkillLabel } from '../../skill-advisor/lib/render.js';

export const SHARED_PAYLOAD_KIND_VALUES = [
  'startup',
  'resume',
  'health',
  'bootstrap',
  'compaction',
] as const;

export type SharedPayloadKind = (typeof SHARED_PAYLOAD_KIND_VALUES)[number];

// ───────────────────────────────────────────────────────────────
// M8 / T-SHP-01 (R9-001): Trust-state vocabulary expansion.
// Canonical axes keep 'live' and 'stale' for existing-but-freshness
// semantics and add 'absent' (does not exist for this scope) and
// 'unavailable' (should exist but inaccessible — I/O failure,
// lock held, readiness probe threw). Older values ('cached',
// 'imported', 'rebuilt', 'rehomed') remain for compact-cache and
// migration-aware producers that already emit them on purpose.
export const SHARED_PAYLOAD_TRUST_STATE_VALUES = [
  'live',
  'cached',
  'stale',
  'absent',
  'unavailable',
  'imported',
  'rebuilt',
  'rehomed',
] as const;

export type SharedPayloadTrustState = (typeof SHARED_PAYLOAD_TRUST_STATE_VALUES)[number];

export function isSharedPayloadTrustState(value: unknown): value is SharedPayloadTrustState {
  return typeof value === 'string'
    && SHARED_PAYLOAD_TRUST_STATE_VALUES.includes(value as SharedPayloadTrustState);
}

export function assertSharedPayloadTrustState(value: unknown): SharedPayloadTrustState {
  if (!isSharedPayloadTrustState(value)) {
    throw new Error(
      `Invalid shared payload trust state: expected one of ${SHARED_PAYLOAD_TRUST_STATE_VALUES.join(', ')}`,
    );
  }
  switch (value) {
    case 'live':
    case 'cached':
    case 'stale':
    case 'absent':
    case 'unavailable':
    case 'imported':
    case 'rebuilt':
    case 'rehomed':
      return value;
    default:
      return assertNever(value, 'shared-payload-trust-state');
  }
}

export const SHARED_PAYLOAD_CERTAINTY_VALUES = [
  'exact',
  'estimated',
  'defaulted',
  'unknown',
] as const;

export type SharedPayloadCertainty = (typeof SHARED_PAYLOAD_CERTAINTY_VALUES)[number];

export const DETECTOR_PROVENANCE_VALUES = [
  'ast',
  'structured',
  'regex',
  'heuristic',
] as const;

export type DetectorProvenance = (typeof DETECTOR_PROVENANCE_VALUES)[number];

export const PARSER_PROVENANCE_VALUES = [
  'ast',
  'regex',
  'heuristic',
  'unknown',
] as const;

export type ParserProvenance = (typeof PARSER_PROVENANCE_VALUES)[number];

export const EVIDENCE_STATUS_VALUES = [
  'confirmed',
  'probable',
  'unverified',
  'unknown',
] as const;

export type EvidenceStatus = (typeof EVIDENCE_STATUS_VALUES)[number];

export const FRESHNESS_AUTHORITY_VALUES = [
  'live',
  'cached',
  'stale',
  'unknown',
] as const;

export type FreshnessAuthority = (typeof FRESHNESS_AUTHORITY_VALUES)[number];

export const MEASUREMENT_AUTHORITY_VALUES = [
  'provider_counted',
  'estimated',
  'defaulted',
  'unknown',
] as const;

export type MeasurementAuthority = (typeof MEASUREMENT_AUTHORITY_VALUES)[number];

export const PUBLICATION_METHODOLOGY_STATUSES = [
  'provisional',
  'published',
] as const;

export type PublicationMethodologyStatus = (typeof PUBLICATION_METHODOLOGY_STATUSES)[number];

export const MULTIPLIER_REQUIRED_FIELDS = [
  'promptTokens',
  'completionTokens',
  'cacheReadTokens',
  'cacheWriteTokens',
] as const;

export type MultiplierRequiredField = (typeof MULTIPLIER_REQUIRED_FIELDS)[number];

export interface PublicationMethodologyMetadata {
  schemaVersion: string;
  methodologyStatus: PublicationMethodologyStatus;
  provenance: string[];
}

export interface PublishableMetricField<T = unknown> {
  key: string;
  value: T;
  certainty: SharedPayloadCertainty;
  authority: MeasurementAuthority;
  methodology: PublicationMethodologyMetadata;
}

export interface StructuralTrust {
  parserProvenance: ParserProvenance;
  evidenceStatus: EvidenceStatus;
  freshnessAuthority: FreshnessAuthority;
}

export interface HotFileBreadcrumb {
  degree: number;
  changeCarefullyReason: string;
}

export const SHARED_PAYLOAD_SOURCE_KIND_VALUES = [
  'memory',
  'code-graph',
  'semantic',
  'session',
  'operational',
  'skill-inventory',
  'skill-graph',
  'advisor-runtime',
] as const;

export type SharedPayloadSourceKind = (typeof SHARED_PAYLOAD_SOURCE_KIND_VALUES)[number];

export interface SharedPayloadSourceRef {
  kind: SharedPayloadSourceKind;
  path: string;
}

export type SharedPayloadSourceRefValue = string | SharedPayloadSourceRef;

export const ADVISOR_ENVELOPE_FRESHNESS_VALUES = [
  'live',
  'stale',
  'absent',
  'unavailable',
] as const;

export type AdvisorEnvelopeFreshness = (typeof ADVISOR_ENVELOPE_FRESHNESS_VALUES)[number];

export const ADVISOR_ENVELOPE_STATUS_VALUES = [
  'ok',
  'skipped',
  'degraded',
  'fail_open',
] as const;

export type AdvisorEnvelopeStatus = (typeof ADVISOR_ENVELOPE_STATUS_VALUES)[number];

/**
 * Typed metadata carried by the shared-payload advisor producer.
 *
 * This contract intentionally allows only numeric trust fields plus one
 * sanitized, single-line skill label so prompt text and free-form reasons
 * cannot cross the shared transport boundary.
 *
 * @see .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-pt-01/research.md
 */
export interface AdvisorEnvelopeMetadata {
  freshness: AdvisorEnvelopeFreshness;
  confidence: number;
  uncertainty: number;
  skillLabel: string | null;
  status: AdvisorEnvelopeStatus;
}

export type SharedPayloadEnvelopeMetadata = AdvisorEnvelopeMetadata;

export const EDGE_EVIDENCE_CLASS_VALUES = [
  'direct_call',
  'import',
  'type_reference',
  'inferred_heuristic',
  'test_coverage',
] as const;

export type EdgeEvidenceClass = (typeof EDGE_EVIDENCE_CLASS_VALUES)[number];

export interface GraphEdgeEnrichment {
  edgeEvidenceClass: EdgeEvidenceClass;
  numericConfidence: number;
}

export type StructuralTrustCarrier<T extends object = Record<string, unknown>> =
  T & StructuralTrust;

export type GraphEdgeEnrichmentCarrier<T extends object = Record<string, unknown>> =
  T & GraphEdgeEnrichment;

export type MultiplierAuthorityField = Pick<PublishableMetricField<number>, 'certainty' | 'authority'>;

export type MultiplierAuthorityFields = Partial<Record<MultiplierRequiredField, MultiplierAuthorityField | null>>;

export interface SharedPayloadSection {
  key: string;
  title: string;
  content: string;
  source: SharedPayloadSourceKind;
  certainty?: SharedPayloadCertainty;
  structuralTrust?: StructuralTrust;
  graphEdgeEnrichment?: GraphEdgeEnrichment;
  hotFileBreadcrumb?: HotFileBreadcrumb;
}

export const SHARED_PAYLOAD_PRODUCER_VALUES = [
  'startup_brief',
  'session_snapshot',
  'session_resume',
  'session_health',
  'session_bootstrap',
  'compact_merger',
  'hook_cache',
  'advisor',
] as const;

export type SharedPayloadProducer = (typeof SHARED_PAYLOAD_PRODUCER_VALUES)[number];

export interface SharedPayloadProvenance {
  producer: SharedPayloadProducer;
  sourceSurface: string;
  trustState: SharedPayloadTrustState;
  generatedAt: string;
  lastUpdated: string | null;
  sourceRefs: SharedPayloadSourceRefValue[];
  sanitizerVersion?: string;
  runtimeFingerprint?: UnicodeRuntimeFingerprint;
}

export interface PreMergeSelectionMetadata {
  strategy: 'pre-merge';
  selectedFrom: string[];
  fileCount: number;
  topicCount: number;
  attentionSignalCount: number;
  notes: string[];
  antiFeedbackGuards: string[];
}

export interface SharedPayloadEnvelope {
  kind: SharedPayloadKind;
  summary: string;
  sections: SharedPayloadSection[];
  provenance: SharedPayloadProvenance;
  metadata?: SharedPayloadEnvelopeMetadata;
  selection?: PreMergeSelectionMetadata;
}

const SUMMARY_MAX_CHARS = 220;
const STRUCTURAL_TRUST_REQUIRED_FIELDS = [
  'parserProvenance',
  'evidenceStatus',
  'freshnessAuthority',
] as const;
const PROHIBITED_STRUCTURAL_TRUST_KEYS = [
  'trust',
  'trustScore',
  'confidence',
  'confidenceScore',
  'authorityScore',
] as const;
const ADVISOR_METADATA_ALLOWED_KEYS = [
  'freshness',
  'confidence',
  'uncertainty',
  'skillLabel',
  'status',
] as const;

export class StructuralTrustPayloadError extends Error {
  readonly code = 'STRUCTURAL_TRUST_PAYLOAD_INVALID';

  constructor(message: string) {
    super(message);
    this.name = 'StructuralTrustPayloadError';
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function formatAllowedValues(values: readonly string[]): string {
  return values.join(', ');
}

export function isSharedPayloadKind(value: unknown): value is SharedPayloadKind {
  return typeof value === 'string'
    && SHARED_PAYLOAD_KIND_VALUES.includes(value as SharedPayloadKind);
}

export function isSharedPayloadCertainty(value: unknown): value is SharedPayloadCertainty {
  return typeof value === 'string'
    && SHARED_PAYLOAD_CERTAINTY_VALUES.includes(value as SharedPayloadCertainty);
}

export function isSharedPayloadProducer(value: unknown): value is SharedPayloadProducer {
  return typeof value === 'string'
    && SHARED_PAYLOAD_PRODUCER_VALUES.includes(value as SharedPayloadProducer);
}

export function isSharedPayloadSourceKind(value: unknown): value is SharedPayloadSourceKind {
  return typeof value === 'string'
    && SHARED_PAYLOAD_SOURCE_KIND_VALUES.includes(value as SharedPayloadSourceKind);
}

export function isAdvisorEnvelopeFreshness(value: unknown): value is AdvisorEnvelopeFreshness {
  return typeof value === 'string'
    && ADVISOR_ENVELOPE_FRESHNESS_VALUES.includes(value as AdvisorEnvelopeFreshness);
}

export function isAdvisorEnvelopeStatus(value: unknown): value is AdvisorEnvelopeStatus {
  return typeof value === 'string'
    && ADVISOR_ENVELOPE_STATUS_VALUES.includes(value as AdvisorEnvelopeStatus);
}

function assertSharedPayloadKind(value: unknown): SharedPayloadKind {
  if (!isSharedPayloadKind(value)) {
    throw new Error(
      `Invalid shared payload envelope kind "${String(value)}"; expected one of ${formatAllowedValues(SHARED_PAYLOAD_KIND_VALUES)}.`,
    );
  }
  return value;
}

function assertSharedPayloadProducer(value: unknown): SharedPayloadProducer {
  if (!isSharedPayloadProducer(value)) {
    throw new Error(
      `Invalid shared payload envelope provenance.producer "${String(value)}"; expected one of ${formatAllowedValues(SHARED_PAYLOAD_PRODUCER_VALUES)}.`,
    );
  }
  return value;
}

function assertSharedPayloadSourceKind(value: unknown): SharedPayloadSourceKind {
  if (!isSharedPayloadSourceKind(value)) {
    throw new Error(
      `Invalid shared payload source ref kind "${String(value)}"; expected one of ${formatAllowedValues(SHARED_PAYLOAD_SOURCE_KIND_VALUES)}.`,
    );
  }
  return value;
}

function assertAdvisorEnvelopeFreshness(value: unknown): AdvisorEnvelopeFreshness {
  if (!isAdvisorEnvelopeFreshness(value)) {
    throw new Error(
      `Invalid advisor envelope metadata.freshness "${String(value)}"; expected one of ${formatAllowedValues(ADVISOR_ENVELOPE_FRESHNESS_VALUES)}.`,
    );
  }
  return value;
}

function assertAdvisorEnvelopeStatus(value: unknown): AdvisorEnvelopeStatus {
  if (!isAdvisorEnvelopeStatus(value)) {
    throw new Error(
      `Invalid advisor envelope metadata.status "${String(value)}"; expected one of ${formatAllowedValues(ADVISOR_ENVELOPE_STATUS_VALUES)}.`,
    );
  }
  return value;
}

export function isParserProvenance(value: unknown): value is ParserProvenance {
  return typeof value === 'string'
    && PARSER_PROVENANCE_VALUES.includes(value as ParserProvenance);
}

export function isDetectorProvenance(value: unknown): value is DetectorProvenance {
  return typeof value === 'string'
    && DETECTOR_PROVENANCE_VALUES.includes(value as DetectorProvenance);
}

export function isEvidenceStatus(value: unknown): value is EvidenceStatus {
  return typeof value === 'string'
    && EVIDENCE_STATUS_VALUES.includes(value as EvidenceStatus);
}

export function isFreshnessAuthority(value: unknown): value is FreshnessAuthority {
  return typeof value === 'string'
    && FRESHNESS_AUTHORITY_VALUES.includes(value as FreshnessAuthority);
}

export function assertSharedPayloadCertainty(value: unknown): SharedPayloadCertainty {
  if (!isSharedPayloadCertainty(value)) {
    throw new Error(
      `Invalid shared payload certainty: expected one of ${SHARED_PAYLOAD_CERTAINTY_VALUES.join(', ')}`,
    );
  }
  return value;
}

function assertParserProvenance(value: unknown): ParserProvenance {
  if (!isParserProvenance(value)) {
    throw new Error(
      `Invalid parser provenance: expected one of ${PARSER_PROVENANCE_VALUES.join(', ')}`,
    );
  }
  return value;
}

export function assertDetectorProvenance(value: unknown): DetectorProvenance {
  if (!isDetectorProvenance(value)) {
    throw new Error(
      `Invalid detector provenance: expected one of ${DETECTOR_PROVENANCE_VALUES.join(', ')}`,
    );
  }
  return value;
}

function assertEvidenceStatus(value: unknown): EvidenceStatus {
  if (!isEvidenceStatus(value)) {
    throw new Error(
      `Invalid evidence status: expected one of ${EVIDENCE_STATUS_VALUES.join(', ')}`,
    );
  }
  return value;
}

function assertFreshnessAuthority(value: unknown): FreshnessAuthority {
  if (!isFreshnessAuthority(value)) {
    throw new Error(
      `Invalid freshness authority: expected one of ${FRESHNESS_AUTHORITY_VALUES.join(', ')}`,
    );
  }
  return value;
}

function assertUnitIntervalNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`${label} must be a number within [0, 1].`);
  }
  if (value < 0 || value > 1) {
    throw new Error(`${label} must be within [0, 1].`);
  }
  return value;
}

function assertAdvisorSkillLabel(value: unknown): string | null {
  if (value === null) {
    return null;
  }
  if (typeof value !== 'string') {
    throw new Error('advisor envelope metadata.skillLabel must be a string or null.');
  }
  if (value.trim().length === 0) {
    throw new Error('advisor envelope metadata.skillLabel must not be empty.');
  }
  if (/[\u0000-\u001F\u007F]/.test(value)) {
    throw new Error('advisor envelope metadata.skillLabel must be a sanitized single-line label.');
  }
  const sanitized = sanitizeSkillLabel(value);
  if (!sanitized) {
    throw new Error('advisor envelope metadata.skillLabel must be a sanitized single-line label.');
  }
  return sanitized;
}

export function validateAdvisorEnvelopeMetadata(value: unknown): AdvisorEnvelopeMetadata {
  if (!isRecord(value)) {
    throw new Error('advisor envelope metadata requires an object payload.');
  }

  const unknownKeys = Object.keys(value).filter(
    (key) => !ADVISOR_METADATA_ALLOWED_KEYS.includes(
      key as (typeof ADVISOR_METADATA_ALLOWED_KEYS)[number],
    ),
  );
  if (unknownKeys.length > 0) {
    throw new Error(
      `advisor envelope metadata rejects unknown key(s): ${unknownKeys.join(', ')}.`,
    );
  }

  const missingKeys = ADVISOR_METADATA_ALLOWED_KEYS.filter(
    (key) => !Object.prototype.hasOwnProperty.call(value, key),
  );
  if (missingKeys.length > 0) {
    throw new Error(
      `advisor envelope metadata requires key(s): ${missingKeys.join(', ')}.`,
    );
  }

  return {
    freshness: assertAdvisorEnvelopeFreshness(value.freshness),
    confidence: assertUnitIntervalNumber(value.confidence, 'advisor envelope metadata.confidence'),
    uncertainty: assertUnitIntervalNumber(value.uncertainty, 'advisor envelope metadata.uncertainty'),
    skillLabel: assertAdvisorSkillLabel(value.skillLabel),
    status: assertAdvisorEnvelopeStatus(value.status),
  };
}

function isPromptFingerprintPath(value: string): boolean {
  return value.trim().startsWith('sha256:');
}

function assertNoPromptDerivedSourcePath(path: string): void {
  if (isPromptFingerprintPath(path)) {
    throw new Error('Shared payload privacy policy rejects prompt-derived provenance source refs.');
  }
}

function assertSanitizedSourcePath(path: string): string {
  const sanitized = sanitizeSkillLabel(path);
  if (!sanitized) {
    throw new Error('Shared payload source refs must use sanitized single-line paths.');
  }
  return sanitized;
}

export function validateSharedPayloadSourceRef(value: unknown): SharedPayloadSourceRefValue {
  if (typeof value === 'string') {
    if (!isNonEmptyString(value)) {
      throw new Error('Shared payload source refs require non-empty string entries.');
    }
    assertNoPromptDerivedSourcePath(value);
    return assertSanitizedSourcePath(value);
  }

  if (!isRecord(value)) {
    throw new Error('Shared payload source refs must be strings or structured source ref objects.');
  }

  if (value.kind === 'user-prompt') {
    throw new Error('Shared payload privacy policy rejects prompt-derived provenance source refs.');
  }
  const kind = assertSharedPayloadSourceKind(value.kind);
  if (!isNonEmptyString(value.path)) {
    throw new Error('Shared payload source ref objects require a non-empty path.');
  }
  assertNoPromptDerivedSourcePath(value.path);
  return {
    kind,
    path: assertSanitizedSourcePath(value.path),
  };
}

function validateSharedPayloadSourceRefs(value: unknown): SharedPayloadSourceRefValue[] {
  if (!Array.isArray(value)) {
    throw new Error('Shared payload provenance.sourceRefs must be an array.');
  }
  return value.map((sourceRef) => validateSharedPayloadSourceRef(sourceRef));
}

export function isMeasurementAuthority(value: unknown): value is MeasurementAuthority {
  return typeof value === 'string'
    && MEASUREMENT_AUTHORITY_VALUES.includes(value as MeasurementAuthority);
}

export function assertMeasurementAuthority(value: unknown): MeasurementAuthority {
  if (!isMeasurementAuthority(value)) {
    throw new Error(
      `Invalid measurement authority: expected one of ${MEASUREMENT_AUTHORITY_VALUES.join(', ')}`,
    );
  }
  return value;
}

export function detectorProvenanceToParserProvenance(
  value: DetectorProvenance,
): ParserProvenance {
  if (value === 'structured') {
    // Structured detector fallbacks stay on the detector axis and map to the
    // nearest parser provenance only when a parser-trust carrier requires it.
    return 'regex';
  }
  return assertParserProvenance(value);
}

export function createPublicationMethodologyMetadata(
  metadata: PublicationMethodologyMetadata,
): PublicationMethodologyMetadata {
  if (!isNonEmptyString(metadata.schemaVersion)) {
    throw new Error('Publication methodology metadata requires a non-empty schemaVersion.');
  }

  if (!PUBLICATION_METHODOLOGY_STATUSES.includes(metadata.methodologyStatus)) {
    throw new Error(
      `Publication methodology status must be one of ${PUBLICATION_METHODOLOGY_STATUSES.join(', ')}.`,
    );
  }

  if (!Array.isArray(metadata.provenance) || metadata.provenance.length === 0) {
    throw new Error('Publication methodology metadata requires at least one provenance entry.');
  }

  const normalizedProvenance = metadata.provenance
    .filter((entry): entry is string => isNonEmptyString(entry))
    .map((entry) => entry.trim());

  if (normalizedProvenance.length === 0) {
    throw new Error('Publication methodology metadata requires non-empty provenance entries.');
  }

  return {
    schemaVersion: metadata.schemaVersion.trim(),
    methodologyStatus: metadata.methodologyStatus,
    provenance: [...new Set(normalizedProvenance)],
  };
}

export function createPublishableMetricField<T>(
  field: PublishableMetricField<T>,
): PublishableMetricField<T> {
  if (!isNonEmptyString(field.key)) {
    throw new Error('Publishable metric fields require a non-empty key.');
  }

  return {
    key: field.key.trim(),
    value: field.value,
    certainty: assertSharedPayloadCertainty(field.certainty),
    authority: assertMeasurementAuthority(field.authority),
    methodology: createPublicationMethodologyMetadata(field.methodology),
  };
}

function assertStructuralTrustPayloadRecord(
  payload: unknown,
  label: string,
): Record<string, unknown> {
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new StructuralTrustPayloadError(
      `${label} requires a structured object with separate parserProvenance, evidenceStatus, and freshnessAuthority fields.`,
    );
  }

  return payload as Record<string, unknown>;
}

export function validateStructuralTrustPayload(
  payload: unknown,
  options: { label?: string } = {},
): StructuralTrust {
  const label = options.label ?? 'Structural trust payload';
  const record = assertStructuralTrustPayloadRecord(payload, label);

  const collapsedKeys = PROHIBITED_STRUCTURAL_TRUST_KEYS.filter((key) =>
    Object.prototype.hasOwnProperty.call(record, key),
  );
  if (collapsedKeys.length > 0) {
    throw new StructuralTrustPayloadError(
      `${label} rejects collapsed scalar fields: ${collapsedKeys.join(', ')}.`,
    );
  }

  const missingFields = STRUCTURAL_TRUST_REQUIRED_FIELDS.filter((field) =>
    !Object.prototype.hasOwnProperty.call(record, field),
  );
  if (missingFields.length > 0) {
    throw new StructuralTrustPayloadError(
      `${label} requires separate parserProvenance, evidenceStatus, and freshnessAuthority fields. Missing: ${missingFields.join(', ')}.`,
    );
  }

  return {
    parserProvenance: assertParserProvenance(record.parserProvenance),
    evidenceStatus: assertEvidenceStatus(record.evidenceStatus),
    freshnessAuthority: assertFreshnessAuthority(record.freshnessAuthority),
  };
}

export function makeStructuralTrust(input: StructuralTrust): StructuralTrust {
  return validateStructuralTrustPayload(input, { label: 'Structural trust' });
}

export function buildStructuralContextTrust(
  structuralContext: { status: string },
): StructuralTrust {
  if (structuralContext.status === 'ready') {
    return makeStructuralTrust({
      parserProvenance: 'ast',
      evidenceStatus: 'confirmed',
      freshnessAuthority: 'live',
    });
  }

  if (structuralContext.status === 'stale') {
    return makeStructuralTrust({
      parserProvenance: 'ast',
      evidenceStatus: 'probable',
      freshnessAuthority: 'stale',
    });
  }

  return makeStructuralTrust({
    parserProvenance: 'unknown',
    evidenceStatus: 'unverified',
    freshnessAuthority: 'unknown',
  });
}

export function attachStructuralTrustFields<T extends object>(
  payload: T,
  trustPayload: unknown,
  options: { label?: string } = {},
): StructuralTrustCarrier<T> {
  const structuralTrust = validateStructuralTrustPayload(trustPayload, options);
  return {
    ...payload,
    ...structuralTrust,
  };
}

export function isEdgeEvidenceClass(value: unknown): value is EdgeEvidenceClass {
  return typeof value === 'string'
    && EDGE_EVIDENCE_CLASS_VALUES.includes(value as EdgeEvidenceClass);
}

export function assertEdgeEvidenceClass(value: unknown): EdgeEvidenceClass {
  if (!isEdgeEvidenceClass(value)) {
    throw new Error(
      `Invalid edge evidence class: expected one of ${EDGE_EVIDENCE_CLASS_VALUES.join(', ')}`,
    );
  }
  return value;
}

export function validateGraphEdgeEnrichment(
  value: unknown,
  options: { label?: string } = {},
): GraphEdgeEnrichment {
  const label = options.label ?? 'Graph edge enrichment';
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} requires an object payload.`);
  }

  const record = value as Record<string, unknown>;
  const numericConfidence = record.numericConfidence;
  if (typeof numericConfidence !== 'number' || Number.isNaN(numericConfidence)) {
    throw new Error(`${label} requires a numericConfidence number.`);
  }
  if (numericConfidence < 0 || numericConfidence > 1) {
    throw new Error(`${label} numericConfidence must be within [0, 1].`);
  }

  return {
    edgeEvidenceClass: assertEdgeEvidenceClass(record.edgeEvidenceClass),
    numericConfidence,
  };
}

export function attachGraphEdgeEnrichment<T extends object>(
  payload: T,
  enrichment: unknown,
  options: { label?: string } = {},
): GraphEdgeEnrichmentCarrier<T> {
  const graphEdgeEnrichment = validateGraphEdgeEnrichment(enrichment, options);
  return {
    ...payload,
    ...graphEdgeEnrichment,
  };
}

export function isStructuralTrustComplete(value: StructuralTrust | null | undefined): value is StructuralTrust {
  if (!value) {
    return false;
  }

  const trust = makeStructuralTrust(value);
  return trust.parserProvenance !== 'unknown'
    && trust.evidenceStatus !== 'unknown'
    && trust.freshnessAuthority !== 'unknown';
}

export function canPublishMultiplier(fields: MultiplierAuthorityFields): boolean {
  return MULTIPLIER_REQUIRED_FIELDS.every((fieldName) => {
    const field = fields[fieldName];
    return field?.authority === 'provider_counted';
  });
}

export function summarizeCertaintyContract(entries: Array<{
  label: string;
  certainty: SharedPayloadCertainty;
}>): string {
  return entries
    .map(({ label, certainty }) => `${label}=${assertSharedPayloadCertainty(certainty)}`)
    .join(', ');
}

function truncateInline(text: string, maxChars: number = SUMMARY_MAX_CHARS): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxChars) {
    return normalized;
  }
  return `${normalized.slice(0, maxChars - 3).trimEnd()}...`;
}

export function summarizeUnknown(value: unknown, maxChars: number = SUMMARY_MAX_CHARS): string {
  if (value === null || value === undefined) {
    return 'None';
  }

  if (typeof value === 'string') {
    return truncateInline(value, maxChars);
  }

  try {
    return truncateInline(JSON.stringify(value), maxChars);
  } catch {
    return truncateInline(String(value), maxChars);
  }
}

function validateSharedPayloadProvenance(value: unknown): SharedPayloadProvenance {
  if (!isRecord(value)) {
    throw new Error('Shared payload envelope provenance requires an object payload.');
  }

  const producer = assertSharedPayloadProducer(value.producer);
  const trustState = assertSharedPayloadTrustState(value.trustState);
  const sourceRefs = validateSharedPayloadSourceRefs(value.sourceRefs);
  if (!isNonEmptyString(value.sourceSurface)) {
    throw new Error('Shared payload envelope provenance.sourceSurface must be a non-empty string.');
  }
  if (!isNonEmptyString(value.generatedAt)) {
    throw new Error('Shared payload envelope provenance.generatedAt must be a non-empty string.');
  }
  if (value.lastUpdated !== null && typeof value.lastUpdated !== 'string') {
    throw new Error('Shared payload envelope provenance.lastUpdated must be a string or null.');
  }

  return {
    producer,
    sourceSurface: value.sourceSurface.trim(),
    trustState,
    generatedAt: value.generatedAt.trim(),
    lastUpdated: value.lastUpdated,
    sourceRefs,
    ...(typeof value.sanitizerVersion === 'string'
      ? { sanitizerVersion: value.sanitizerVersion }
      : {}),
    ...(value.runtimeFingerprint
      ? { runtimeFingerprint: value.runtimeFingerprint as UnicodeRuntimeFingerprint }
      : {}),
  };
}

function validateSharedPayloadMetadata(
  producer: SharedPayloadProducer,
  metadata: unknown,
): SharedPayloadEnvelopeMetadata | undefined {
  if (producer === 'advisor') {
    return validateAdvisorEnvelopeMetadata(metadata);
  }
  if (metadata !== undefined) {
    throw new Error('Shared payload metadata is only supported for the advisor producer.');
  }
  return undefined;
}

export function createSharedPayloadEnvelope(input: {
  kind: SharedPayloadKind;
  sections: SharedPayloadSection[];
  provenance: SharedPayloadProvenance;
  metadata?: SharedPayloadEnvelopeMetadata;
  summary?: string;
  selection?: PreMergeSelectionMetadata;
}): SharedPayloadEnvelope {
  const provenance = validateSharedPayloadProvenance(input.provenance);
  const metadata = validateSharedPayloadMetadata(provenance.producer, input.metadata);
  const sections = input.sections
    .filter((section) => section.content.trim().length > 0)
    .map((section) => ({
      ...section,
      ...(section.structuralTrust
        ? {
          structuralTrust: validateStructuralTrustPayload(section.structuralTrust, {
            label: `Shared payload section "${section.key}" structuralTrust`,
          }),
        }
        : {}),
      ...(section.graphEdgeEnrichment
        ? {
          graphEdgeEnrichment: validateGraphEdgeEnrichment(section.graphEdgeEnrichment, {
            label: `Shared payload section "${section.key}" graphEdgeEnrichment`,
          }),
        }
        : {}),
    }));
  const summary = input.summary
    ? truncateInline(input.summary)
    : truncateInline(
      sections.length > 0
        ? sections
          .slice(0, 2)
          .map((section) => `${section.title}: ${section.content}`)
          .join(' | ')
        : `${input.kind} payload from ${input.provenance.producer}`,
    );

  return {
    kind: input.kind,
    summary,
    sections,
    provenance,
    ...(metadata ? { metadata } : {}),
    ...(input.selection ? { selection: input.selection } : {}),
  };
}

/** Narrow an unknown runtime payload to the shared payload envelope contract. */
export function coerceSharedPayloadEnvelope(value: unknown): SharedPayloadEnvelope | null {
  if (!isRecord(value)) {
    return null;
  }

  if (!Array.isArray(value.sections) || typeof value.summary !== 'string') {
    return null;
  }

  const kind = assertSharedPayloadKind(value.kind);
  const provenance = validateSharedPayloadProvenance(value.provenance);
  const metadata = validateSharedPayloadMetadata(provenance.producer, value.metadata);

  return {
    ...value,
    kind,
    summary: value.summary,
    sections: value.sections as SharedPayloadSection[],
    provenance,
    ...(metadata ? { metadata } : {}),
    ...(value.selection ? { selection: value.selection as PreMergeSelectionMetadata } : {}),
  };
}

// ───────────────────────────────────────────────────────────────
// M8 / T-SHP-01 (R9-001): Canonical mapping from structural freshness
// to trust state. 'empty' and 'missing' indicate the graph scope has
// no data (→ 'absent'); 'error' indicates the scope is unreachable
// (→ 'unavailable'). Callers that only observe structural status
// (no error axis) should use trustStateFromStructuralStatus instead.
export function trustStateFromGraphState(
  graphState: 'ready' | 'stale' | 'empty' | 'missing' | 'error',
): SharedPayloadTrustState {
  switch (graphState) {
    case 'ready':
      return 'live';
    case 'stale':
      return 'stale';
    case 'empty':
    case 'missing':
      return 'absent';
    case 'error':
      return 'unavailable';
    default:
      return assertNever(graphState, 'graph-state');
  }
}

export function trustStateFromStructuralStatus(
  status: 'ready' | 'stale' | 'missing',
): SharedPayloadTrustState {
  switch (status) {
    case 'ready':
      return 'live';
    case 'stale':
      return 'stale';
    case 'missing':
      return 'absent';
    default:
      return assertNever(status, 'structural-status');
  }
}

export function trustStateFromCache(
  cachedAt: string,
  maxAgeMs: number,
  nowMs: number = Date.now(),
): SharedPayloadTrustState {
  const cachedAtMs = new Date(cachedAt).getTime();
  if (Number.isNaN(cachedAtMs)) {
    return 'stale';
  }
  return nowMs - cachedAtMs >= maxAgeMs ? 'stale' : 'cached';
}

export function createPreMergeSelectionMetadata(input: {
  selectedFrom: string[];
  fileCount: number;
  topicCount: number;
  attentionSignalCount: number;
  notes?: string[];
  antiFeedbackGuards?: string[];
}): PreMergeSelectionMetadata {
  return {
    strategy: 'pre-merge',
    selectedFrom: [...new Set(input.selectedFrom)],
    fileCount: input.fileCount,
    topicCount: input.topicCount,
    attentionSignalCount: input.attentionSignalCount,
    notes: input.notes ?? [],
    antiFeedbackGuards: input.antiFeedbackGuards ?? [],
  };
}
