// ───────────────────────────────────────────────────────────────
// MODULE: Prompt-safe Redirect Metadata
// ───────────────────────────────────────────────────────────────

import { sanitizeEnvelopeSkillLabel } from '../derived/sanitizer.js';
import type { SkillLifecycleStatus } from '../scorer/types.js';

export type CompatLifecycleStatus = SkillLifecycleStatus | 'rolled-back';

export interface RedirectMetadataInput {
  readonly skillId: string;
  readonly status?: CompatLifecycleStatus;
  readonly redirectFrom?: readonly string[] | string | null;
  readonly redirectTo?: string | null;
  readonly schemaVersion?: number | null;
  readonly note?: string | null;
}

export interface PromptSafeRedirectMetadata {
  status?: CompatLifecycleStatus;
  redirect_from?: string | readonly string[];
  redirect_to?: string;
  schema_version?: number;
  note?: string;
  default_routable?: boolean;
}

const NON_DEFAULT_ROUTABLE = new Set<CompatLifecycleStatus>(['archived', 'future']);

function sanitizeOne(value: string | null | undefined): string | null {
  return sanitizeEnvelopeSkillLabel(value ?? '') ?? null;
}

function sanitizeMany(value: readonly string[] | string | null | undefined): string[] {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return values
    .map((entry) => sanitizeOne(entry))
    .filter((entry): entry is string => Boolean(entry));
}

export function renderRedirectMetadata(input: RedirectMetadataInput): PromptSafeRedirectMetadata {
  const status = input.status ?? 'active';
  const metadata: PromptSafeRedirectMetadata = {};
  const redirectTo = sanitizeOne(input.redirectTo);
  const redirectFrom = sanitizeMany(input.redirectFrom);
  const safeSkillId = sanitizeOne(input.skillId);

  if (status !== 'active') {
    metadata.status = status;
  }
  if (redirectTo) {
    metadata.redirect_to = redirectTo;
    if (safeSkillId && redirectFrom.length === 0) {
      metadata.redirect_from = safeSkillId;
    }
  }
  if (redirectFrom.length === 1) {
    metadata.redirect_from = redirectFrom[0];
  } else if (redirectFrom.length > 1) {
    metadata.redirect_from = redirectFrom;
  }
  if (status === 'deprecated' && !metadata.redirect_from && safeSkillId) {
    metadata.redirect_from = safeSkillId;
  }
  if (status === 'rolled-back') {
    metadata.schema_version = input.schemaVersion ?? 1;
    metadata.note = sanitizeOne(input.note) ?? 'v1 restored';
  }
  if (NON_DEFAULT_ROUTABLE.has(status)) {
    metadata.default_routable = false;
  }

  return metadata;
}

export function renderRecommendationRedirectMetadata(input: RedirectMetadataInput): PromptSafeRedirectMetadata {
  return renderRedirectMetadata(input);
}
