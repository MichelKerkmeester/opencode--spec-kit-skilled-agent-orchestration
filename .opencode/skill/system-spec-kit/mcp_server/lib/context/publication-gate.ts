// ───────────────────────────────────────────────────────────────────
// MODULE: Publication Gate
// ───────────────────────────────────────────────────────────────────

import {
  PUBLICATION_METHODOLOGY_STATUSES,
  canPublishMultiplier,
  createPublicationMethodologyMetadata,
  isSharedPayloadCertainty,
  type MultiplierAuthorityFields,
  type PublicationMethodologyStatus,
} from './shared-payload.js';

export type PublicationExclusionReason =
  | 'missing_methodology'
  | 'missing_schema_version'
  | 'missing_provenance'
  | 'unsupported_certainty';

export type PublicationGateResult =
  | { publishable: true }
  | { publishable: false; exclusionReason: PublicationExclusionReason };

export interface PublicationGateRow {
  certainty: unknown;
  methodologyStatus?: PublicationMethodologyStatus | null;
  schemaVersion?: string | null;
  provenance?: string[] | null;
  multiplierAuthorityFields?: MultiplierAuthorityFields | null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isPublicationMethodologyStatus(value: unknown): value is PublicationMethodologyStatus {
  return typeof value === 'string'
    && PUBLICATION_METHODOLOGY_STATUSES.includes(value as PublicationMethodologyStatus);
}

function normalizeProvenance(entries: string[] | null | undefined): string[] {
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries
    .filter(isNonEmptyString)
    .map((entry) => entry.trim());
}

export function evaluatePublicationGate(row: PublicationGateRow): PublicationGateResult {
  if (!isSharedPayloadCertainty(row.certainty)) {
    return {
      publishable: false,
      exclusionReason: 'unsupported_certainty',
    };
  }

  if (!isPublicationMethodologyStatus(row.methodologyStatus)) {
    return {
      publishable: false,
      exclusionReason: 'missing_methodology',
    };
  }

  if (!isNonEmptyString(row.schemaVersion)) {
    return {
      publishable: false,
      exclusionReason: 'missing_schema_version',
    };
  }

  const provenance = normalizeProvenance(row.provenance);
  if (provenance.length === 0) {
    return {
      publishable: false,
      exclusionReason: 'missing_provenance',
    };
  }

  createPublicationMethodologyMetadata({
    schemaVersion: row.schemaVersion.trim(),
    methodologyStatus: row.methodologyStatus,
    provenance,
  });

  if (row.multiplierAuthorityFields && !canPublishMultiplier(row.multiplierAuthorityFields)) {
    return {
      publishable: false,
      exclusionReason: 'unsupported_certainty',
    };
  }

  return { publishable: true };
}
