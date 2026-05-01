import { z, type ZodIssue } from 'zod';

export const DESCRIPTION_CANONICAL_DERIVED_KEYS = [
  'specFolder',
  'specId',
  'folderSlug',
  'parentChain',
  'lastUpdated',
] as const;

export const DESCRIPTION_CANONICAL_AUTHORED_KEYS = [
  'description',
  'keywords',
] as const;

export const DESCRIPTION_TRACKING_KEYS = [
  'memorySequence',
  'memoryNameHistory',
] as const;

export const DESCRIPTION_KNOWN_AUTHORED_OPTIONAL_KEYS = [
  'title',
  'type',
  'trigger_phrases',
  'path',
  'level',
] as const;

export const DESCRIPTION_RESERVED_KEYS = [
  ...DESCRIPTION_CANONICAL_DERIVED_KEYS,
  ...DESCRIPTION_CANONICAL_AUTHORED_KEYS,
  ...DESCRIPTION_TRACKING_KEYS,
  ...DESCRIPTION_KNOWN_AUTHORED_OPTIONAL_KEYS,
] as const;

const STRING_ARRAY_FIELDS = new Set([
  'keywords',
  'parentChain',
  'memoryNameHistory',
  'trigger_phrases',
]);

const RESERVED_KEY_SET = new Set<string>(DESCRIPTION_RESERVED_KEYS);

const stringArraySchema = z.array(z.string());

export const folderDescriptionSchema = z.object({
  specFolder: z.string(),
  description: z.string(),
  keywords: stringArraySchema,
  lastUpdated: z.string(),
});

export const perFolderDescriptionSchema = folderDescriptionSchema.extend({
  specId: z.string().optional(),
  folderSlug: z.string().optional(),
  parentChain: stringArraySchema.optional(),
  memorySequence: z.number().optional(),
  memoryNameHistory: stringArraySchema.optional(),
  title: z.string().optional(),
  type: z.string().optional(),
  trigger_phrases: stringArraySchema.optional(),
  path: z.string().optional(),
  level: z.union([z.number(), z.string()]).optional(),
}).passthrough();

export type FolderDescriptionShape = z.infer<typeof folderDescriptionSchema>;
export type PerFolderDescriptionShape = z.infer<typeof perFolderDescriptionSchema>;

export type DescriptionCanonicalDerivedKey =
  (typeof DESCRIPTION_CANONICAL_DERIVED_KEYS)[number];
export type DescriptionCanonicalAuthoredKey =
  (typeof DESCRIPTION_CANONICAL_AUTHORED_KEYS)[number];
export type DescriptionTrackingKey =
  (typeof DESCRIPTION_TRACKING_KEYS)[number];
export type DescriptionKnownAuthoredOptionalKey =
  (typeof DESCRIPTION_KNOWN_AUTHORED_OPTIONAL_KEYS)[number];
export type DescriptionReservedKey =
  (typeof DESCRIPTION_RESERVED_KEYS)[number];

export type DescriptionCanonicalFields = Pick<
  PerFolderDescriptionShape,
  DescriptionCanonicalDerivedKey | DescriptionCanonicalAuthoredKey
>;

export type DescriptionTrackingFields = Pick<
  PerFolderDescriptionShape,
  DescriptionTrackingKey
>;

export type DescriptionKnownAuthoredOptionalFields = Pick<
  PerFolderDescriptionShape,
  DescriptionKnownAuthoredOptionalKey
>;

export function isDescriptionReservedKey(key: string): key is DescriptionReservedKey {
  return RESERVED_KEY_SET.has(key);
}

export function pickCanonicalDescriptionFields(
  value: Record<string, unknown>,
): DescriptionCanonicalFields {
  const picked: Record<string, unknown> = {};

  for (const key of DESCRIPTION_CANONICAL_DERIVED_KEYS) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      picked[key] = value[key];
    }
  }

  for (const key of DESCRIPTION_CANONICAL_AUTHORED_KEYS) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      picked[key] = value[key];
    }
  }

  return picked as DescriptionCanonicalFields;
}

function formatExpectedType(field: string): string {
  if (STRING_ARRAY_FIELDS.has(field)) {
    return 'a string[]';
  }

  switch (field) {
    case 'memorySequence':
      return 'a number';
    default:
      return 'a string';
  }
}

function formatIssue(issue: ZodIssue): string {
  const field = String(issue.path[0] ?? 'value');
  return `${field} must be ${formatExpectedType(field)}`;
}

export function formatDescriptionSchemaIssues(issues: ZodIssue[]): string[] {
  const seen = new Set<string>();
  const formatted: string[] = [];

  for (const issue of issues) {
    const message = formatIssue(issue);
    if (seen.has(message)) continue;
    seen.add(message);
    formatted.push(message);
  }

  return formatted;
}
