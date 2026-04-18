// ───────────────────────────────────────────────────────────────
// MODULE: description.json merge-preserving repair helper
// ───────────────────────────────────────────────────────────────

import { mergeDescription, type DescriptionMergeResult } from './description-merge.js';
import {
  pickCanonicalDescriptionFields,
  type DescriptionCanonicalFields,
} from './description-schema.js';

export type MergePreserveInput<T extends Record<string, unknown>> = {
  partial: Record<string, unknown>;
  canonicalOverrides: T & DescriptionCanonicalFields;
};

export type MergePreserveResult<T extends Record<string, unknown>> =
  DescriptionMergeResult<T>;

export function mergePreserveRepair<T extends Record<string, unknown>>(
  input: MergePreserveInput<T>,
): MergePreserveResult<T> {
  return mergeDescription(
    input.partial,
    pickCanonicalDescriptionFields(input.canonicalOverrides),
    input.canonicalOverrides,
  );
}
