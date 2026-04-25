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

const MAX_PHRASE_LENGTH = 80;
const MAX_TRIGGERS_PER_AFFORDANCE = 12;
const MAX_EDGES_PER_AFFORDANCE = 12;
const INSTRUCTION_PATTERN =
  /\b(ignore\s+(previous|all)\s+instructions|system\s*:|developer\s*:|assistant\s*:|execute\s*:|instruction\s*:)\b/i;
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
      const skillId = cleanSkillId(input.skillId ?? input.skill_id);
      if (!skillId) return null;
      const derivedTriggers = triggerPhrases(input);
      const edges = relationEdges(input);
      if (derivedTriggers.length === 0 && edges.length === 0) return null;
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
