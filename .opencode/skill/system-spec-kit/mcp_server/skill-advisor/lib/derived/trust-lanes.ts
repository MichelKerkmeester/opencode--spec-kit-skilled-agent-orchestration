// ───────────────────────────────────────────────────────────────
// MODULE: Derived Metadata Trust Lanes
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export type DerivedSourceCategory =
  | 'frontmatter'
  | 'headings'
  | 'body'
  | 'examples'
  | 'references'
  | 'assets'
  | 'intent_signals'
  | 'source_docs'
  | 'key_files';

export type DerivedTrustLane =
  | 'explicit_author'
  | 'frontmatter'
  | 'body'
  | 'examples'
  | 'local_docs'
  | 'derived_local'
  | 'derived_generated';

export interface TrustLaneProjection {
  readonly sourceCategory: DerivedSourceCategory;
  readonly trustLane: DerivedTrustLane;
  readonly maxContribution: number;
  readonly decays: boolean;
}

// ───────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────

const TRUST_LANES: Readonly<Record<DerivedSourceCategory, TrustLaneProjection>> = {
  frontmatter: { sourceCategory: 'frontmatter', trustLane: 'frontmatter', maxContribution: 1.0, decays: false },
  headings: { sourceCategory: 'headings', trustLane: 'derived_local', maxContribution: 0.7, decays: true },
  body: { sourceCategory: 'body', trustLane: 'body', maxContribution: 0.45, decays: true },
  examples: { sourceCategory: 'examples', trustLane: 'examples', maxContribution: 0.5, decays: true },
  references: { sourceCategory: 'references', trustLane: 'local_docs', maxContribution: 0.6, decays: true },
  assets: { sourceCategory: 'assets', trustLane: 'derived_local', maxContribution: 0.35, decays: true },
  intent_signals: { sourceCategory: 'intent_signals', trustLane: 'explicit_author', maxContribution: 1.0, decays: false },
  source_docs: { sourceCategory: 'source_docs', trustLane: 'derived_generated', maxContribution: 0.35, decays: true },
  key_files: { sourceCategory: 'key_files', trustLane: 'derived_generated', maxContribution: 0.35, decays: true },
};

export function trustLaneForSource(sourceCategory: DerivedSourceCategory): TrustLaneProjection {
  return TRUST_LANES[sourceCategory];
}

export function isAuthorLane(trustLane: DerivedTrustLane): boolean {
  return trustLane === 'explicit_author' || trustLane === 'frontmatter';
}

export function isDerivedLane(trustLane: DerivedTrustLane): boolean {
  return !isAuthorLane(trustLane);
}

export function capContribution(score: number, sourceCategory: DerivedSourceCategory): number {
  const lane = trustLaneForSource(sourceCategory);
  return Math.min(Math.max(0, score), lane.maxContribution);
}

