// ---------------------------------------------------------------
// MODULE: Data Validator
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. DATA VALIDATOR
// ───────────────────────────────────────────────────────────────
// Validates data structures — syncs boolean flags with array contents, sanitizes strings

// ───────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────
/** Mapping of array field names to their corresponding boolean flag field names */
export interface ArrayFlagMappings {
  readonly [key: string]: string;
}

/** Mapping of presence field names to their corresponding boolean flag field names */
export interface PresenceFlagMappings {
  readonly [key: string]: string;
}

/** Generic constraint for data passed to validateDataStructure.
 * Callers pass their own typed objects (DecisionRecord, DiagramOutput, etc.)
 * without needing [key: string]: unknown index signatures.
 * Kept as a type alias for backward-compatible re-exports. */
export type ValidatedData = Record<string, unknown>;

/** Item within an array that can be a primitive or object */
type ArrayItem = string | number | boolean | Record<string, unknown>;

// ───────────────────────────────────────────────────────────────
// 3. CONFIGURATION
// ───────────────────────────────────────────────────────────────
const ARRAY_FLAG_MAPPINGS: ArrayFlagMappings = {
  CODE_BLOCKS: 'HAS_CODE_BLOCKS',
  NOTES: 'HAS_NOTES',
  RELATED_FILES: 'HAS_RELATED_FILES',
  CAVEATS: 'HAS_CAVEATS',
  FOLLOWUP: 'HAS_FOLLOWUP',
  OPTIONS: 'HAS_OPTIONS',
  EVIDENCE: 'HAS_EVIDENCE',
  PHASES: 'HAS_PHASES',
  MESSAGES: 'HAS_MESSAGES'
};

const PRESENCE_FLAG_MAPPINGS: PresenceFlagMappings = {
  DESCRIPTION: 'HAS_DESCRIPTION',
  RESULT_PREVIEW: 'HAS_RESULT',
  DECISION_TREE: 'HAS_DECISION_TREE'
};

// ───────────────────────────────────────────────────────────────
// 4. UTILITIES
// ───────────────────────────────────────────────────────────────
function ensureArrayOfObjects(value: unknown, objectKey: string): Array<Record<string, string>> {
  if (!value) return [];
  if (!Array.isArray(value)) {
    return [{ [objectKey]: String(value) }];
  }
  if (value.length > 0 && typeof value[0] === 'string') {
    return value.map((item: string) => ({ [objectKey]: item }));
  }
  return value as Array<Record<string, string>>;
}

function hasArrayContent(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}

// ───────────────────────────────────────────────────────────────
// 5. VALIDATION
// ───────────────────────────────────────────────────────────────
function validateDataStructure<T extends object>(data: T): T {
  const validated: Record<string, unknown> = { ...data } as Record<string, unknown>;

  for (const [field, flagField] of Object.entries(ARRAY_FLAG_MAPPINGS)) {
    validated[flagField] = hasArrayContent(validated[field]);
  }

  for (const [field, flagField] of Object.entries(PRESENCE_FLAG_MAPPINGS)) {
    if (validated[field]) {
      validated[flagField] = true;
    }
  }

  if (validated.PROS !== undefined) {
    validated.PROS = ensureArrayOfObjects(validated.PROS, 'PRO');
  }
  if (validated.CONS !== undefined) {
    validated.CONS = ensureArrayOfObjects(validated.CONS, 'CON');
  }

  validated.HAS_PROS_CONS = hasArrayContent(validated.PROS) || hasArrayContent(validated.CONS);

  for (const key in validated) {
    if (Array.isArray(validated[key])) {
      validated[key] = (validated[key] as ArrayItem[]).map((item: ArrayItem) => {
        if (typeof item === 'object' && item !== null) {
          return validateDataStructure(item as Record<string, unknown>);
        }
        return item;
      });
    }
  }

  return validated as T;
}

// ───────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────
export {
  ARRAY_FLAG_MAPPINGS,
  PRESENCE_FLAG_MAPPINGS,
  ensureArrayOfObjects,
  hasArrayContent,
  validateDataStructure,
};
