// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Affordance Normalizer
// ───────────────────────────────────────────────────────────────

export type AffordanceRelation =
  | 'depends_on'
  | 'enhances'
  | 'siblings'
  | 'prerequisite_for'
  | 'conflicts_with';

export interface AffordanceInput {
  readonly skillId?: string;
  readonly skill_id?: string;
  readonly name?: string;
  readonly triggers?: readonly string[];
  readonly category?: string;
  readonly dependsOn?: readonly AffordanceEdgeInput[];
  readonly depends_on?: readonly AffordanceEdgeInput[];
  readonly enhances?: readonly AffordanceEdgeInput[];
  readonly siblings?: readonly AffordanceEdgeInput[];
  readonly prerequisiteFor?: readonly AffordanceEdgeInput[];
  readonly prerequisite_for?: readonly AffordanceEdgeInput[];
  readonly conflictsWith?: readonly AffordanceEdgeInput[];
  readonly conflicts_with?: readonly AffordanceEdgeInput[];
  readonly description?: string;
  readonly [field: string]: unknown;
}

export type AffordanceEdgeInput =
  | string
  | {
    readonly target?: string;
    readonly targetSkillId?: string;
    readonly target_skill_id?: string;
    readonly weight?: number;
  };

export interface NormalizedAffordanceEdge {
  readonly edgeType: AffordanceRelation;
  readonly targetSkillId: string;
  readonly weight: number;
}

export interface NormalizedAffordance {
  readonly skillId: string;
  readonly name: string | null;
  readonly category: string | null;
  readonly derivedTriggers: readonly string[];
  readonly edges: readonly NormalizedAffordanceEdge[];
  readonly evidenceLabel: string;
}

export const AFFORDANCE_TRIGGER_FIELDS = ['name', 'triggers', 'category'] as const;

/**
 * R-007-P2-9: Debug counters for affordance-input drop categories. Operators
 * can read these via `getAffordanceNormalizerCounters()` to diagnose why
 * affordance evidence does or does not reach the scorer. Counters are
 * monotonically increasing across the lifetime of the process and may be
 * reset for tests via `resetAffordanceNormalizerCounters()`.
 *
 * Drop category semantics:
 *   - `received`              : raw affordance inputs handed to `normalize()`
 *   - `accepted`              : inputs that produced a NormalizedAffordance
 *   - `dropped_unknown_skill` : skillId missing or scrubbed to empty
 *   - `dropped_unsafe`        : retained for future prompt-injection /
 *                               sanitizer drop tracking (currently unused
 *                               because the sanitizer scrubs at the cleanPhrase
 *                               level rather than rejecting whole inputs)
 *   - `dropped_empty`         : skillId resolved but no triggers + no edges
 */
export interface AffordanceNormalizerCounters {
  received: number;
  accepted: number;
  dropped_unsafe: number;
  dropped_empty: number;
  dropped_unknown_skill: number;
}

const affordanceNormalizerCounters: AffordanceNormalizerCounters = {
  received: 0,
  accepted: 0,
  dropped_unsafe: 0,
  dropped_empty: 0,
  dropped_unknown_skill: 0,
};

export function getAffordanceNormalizerCounters(): AffordanceNormalizerCounters {
  return { ...affordanceNormalizerCounters };
}

export function resetAffordanceNormalizerCounters(): void {
  affordanceNormalizerCounters.received = 0;
  affordanceNormalizerCounters.accepted = 0;
  affordanceNormalizerCounters.dropped_unsafe = 0;
  affordanceNormalizerCounters.dropped_empty = 0;
  affordanceNormalizerCounters.dropped_unknown_skill = 0;
}

const MAX_PHRASE_LENGTH = 80;
const MAX_TRIGGERS_PER_AFFORDANCE = 12;
const MAX_EDGES_PER_AFFORDANCE = 12;
// R-007-9: broadened prompt-injection denylist. The original pattern
// only caught the exact strings `ignore previous/all instructions`,
// `system:`, `developer:`, `assistant:`, `execute:`, `instruction:`.
// Real-world prompt-injection corpora (Anthropic, OpenAI, Lakera) also
// use common synonyms ("disregard", "override", "forget all prior"),
// directional variants ("the above", "earlier", "prior"), and
// role-prefix variants ("user:", "human:", "[system]", "<system>").
//
// Anchoring strategy: keyword/role-prefix branches use a
// `(?:^|\s|\b)` lead so they fire at sentence start, after
// whitespace, or after a word boundary — but legitimate phrases
// like "ignore the cache when stale" or "system call audit" still
// pass because the keyword + directional-modifier pair is required.
// Bracketed/angled role markers (`[INST]`, `<system>`) deliberately
// have NO leading boundary so they trigger anywhere they appear.
//
// The list intentionally remains a denylist because affordance
// triggers are free-form short phrases — we cannot enumerate the
// allowed grammar without breaking valid skill descriptions.
const INSTRUCTION_PATTERN =
  /(?:(?:^|\s|\b)(?:(?:ignore|disregard|forget|skip|bypass|override)\s+(?:the\s+)?(?:previous|prior|earlier|above|all|any)(?:\s+(?:and\s+)?(?:previous|prior|earlier|above|all|any))*\s+(?:instruction|instructions|prompt|prompts|directions?|rule|rules|context|guidance|message|messages|system\s+prompt)|override\s+system\s+(?:prompt|message|instructions)|new\s+instructions?\s*:|reveal\s+(?:the\s+)?(?:system|developer)\s+(?:prompt|instruction|instructions)|system\s*:|developer\s*:|assistant\s*:|user\s*:|human\s*:|execute\s*:|instruction\s*:)|\[\s*(?:system|developer|assistant|user|human|inst|instruction)\s*\]|<\s*(?:system|developer|assistant|user|human)\s*>)/i;
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const URL_PATTERN = /\bhttps?:\/\/\S+|\bwww\.\S+/gi;
const TOKEN_PATTERN = /\b(?:bearer|token|secret|apikey|api_key)\s*[:=]\s*\S+/gi;

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function cleanPhrase(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const privacyStripped = value
    .replace(URL_PATTERN, ' ')
    .replace(EMAIL_PATTERN, ' ')
    .replace(TOKEN_PATTERN, ' ');
  if (INSTRUCTION_PATTERN.test(privacyStripped)) return null;
  const cleaned = privacyStripped
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[^A-Za-z0-9:/._ -]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  if (!cleaned || cleaned.length < 2) return null;
  return cleaned.slice(0, MAX_PHRASE_LENGTH);
}

function cleanSkillId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned || null;
}

function edgeInputs(value: unknown): readonly AffordanceEdgeInput[] {
  return Array.isArray(value) ? value.filter((entry): entry is AffordanceEdgeInput => (
    typeof entry === 'string'
    || (typeof entry === 'object' && entry !== null && !Array.isArray(entry))
  )) : [];
}

function normalizedEdge(
  edgeType: AffordanceRelation,
  rawEdge: AffordanceEdgeInput,
): NormalizedAffordanceEdge | null {
  const target = typeof rawEdge === 'string'
    ? cleanSkillId(rawEdge)
    : cleanSkillId(rawEdge.targetSkillId ?? rawEdge.target_skill_id ?? rawEdge.target);
  if (!target) return null;
  const rawWeight = typeof rawEdge === 'string' ? undefined : rawEdge.weight;
  const weight = typeof rawWeight === 'number' && Number.isFinite(rawWeight)
    ? Math.max(0, Math.min(1, rawWeight))
    : 0.7;
  return { edgeType, targetSkillId: target, weight };
}

function relationEdges(input: AffordanceInput): NormalizedAffordanceEdge[] {
  const edges: NormalizedAffordanceEdge[] = [];
  const relationFields: ReadonlyArray<readonly [AffordanceRelation, unknown]> = [
    ['depends_on', input.dependsOn ?? input.depends_on],
    ['enhances', input.enhances],
    ['siblings', input.siblings],
    ['prerequisite_for', input.prerequisiteFor ?? input.prerequisite_for],
    ['conflicts_with', input.conflictsWith ?? input.conflicts_with],
  ];
  for (const [edgeType, rawEdges] of relationFields) {
    for (const rawEdge of edgeInputs(rawEdges)) {
      const edge = normalizedEdge(edgeType, rawEdge);
      if (edge) edges.push(edge);
    }
  }
  return edges.slice(0, MAX_EDGES_PER_AFFORDANCE);
}

function triggerPhrases(input: AffordanceInput): string[] {
  const triggerValues = [
    cleanPhrase(input.name),
    cleanPhrase(input.category),
    ...(
      Array.isArray(input.triggers)
        ? input.triggers.map((trigger) => cleanPhrase(trigger))
        : []
    ),
  ];
  return unique(triggerValues.filter((entry): entry is string => Boolean(entry)))
    .slice(0, MAX_TRIGGERS_PER_AFFORDANCE);
}

export function normalize(toolDescriptions: readonly AffordanceInput[]): NormalizedAffordance[] {
  return toolDescriptions
    .map((input, index): NormalizedAffordance | null => {
      affordanceNormalizerCounters.received++;
      const skillId = cleanSkillId(input.skillId ?? input.skill_id);
      if (!skillId) {
        affordanceNormalizerCounters.dropped_unknown_skill++;
        return null;
      }
      const derivedTriggers = triggerPhrases(input);
      const edges = relationEdges(input);
      if (derivedTriggers.length === 0 && edges.length === 0) {
        affordanceNormalizerCounters.dropped_empty++;
        return null;
      }
      affordanceNormalizerCounters.accepted++;
      return {
        skillId,
        name: cleanPhrase(input.name),
        category: cleanPhrase(input.category),
        derivedTriggers,
        edges,
        evidenceLabel: `affordance:${skillId}:${index}`,
      };
    })
    .filter((entry): entry is NormalizedAffordance => Boolean(entry));
}
