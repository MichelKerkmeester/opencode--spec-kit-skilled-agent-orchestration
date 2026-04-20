// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Scorer Types
// ───────────────────────────────────────────────────────────────

export type ScorerLane =
  | 'explicit_author'
  | 'lexical'
  | 'graph_causal'
  | 'derived_generated'
  | 'semantic_shadow';

export type SkillLifecycleStatus = 'active' | 'deprecated' | 'archived' | 'future';

export interface SkillProjection {
  readonly id: string;
  readonly kind: 'skill' | 'command';
  readonly family: string;
  readonly category: string;
  readonly name: string;
  readonly description: string;
  readonly keywords: readonly string[];
  readonly domains: readonly string[];
  readonly intentSignals: readonly string[];
  readonly derivedTriggers: readonly string[];
  readonly derivedKeywords: readonly string[];
  readonly sourcePath: string | null;
  readonly lifecycleStatus: SkillLifecycleStatus;
  readonly redirectTo?: string | null;
  readonly redirectFrom?: readonly string[];
}

export interface SkillEdgeProjection {
  readonly sourceId: string;
  readonly targetId: string;
  readonly edgeType: 'depends_on' | 'enhances' | 'siblings' | 'conflicts_with' | 'prerequisite_for';
  readonly weight: number;
  readonly context?: string;
}

export interface AdvisorProjection {
  readonly skills: readonly SkillProjection[];
  readonly edges: readonly SkillEdgeProjection[];
  readonly generatedAt: string;
  readonly source: 'sqlite' | 'filesystem' | 'fixture';
}

export interface LaneMatch {
  readonly skillId: string;
  readonly lane: ScorerLane;
  readonly score: number;
  readonly evidence: readonly string[];
  readonly shadowOnly?: boolean;
}

export interface LaneScores {
  readonly explicit_author: readonly LaneMatch[];
  readonly lexical: readonly LaneMatch[];
  readonly graph_causal: readonly LaneMatch[];
  readonly derived_generated: readonly LaneMatch[];
  readonly semantic_shadow: readonly LaneMatch[];
}

export interface LaneContribution {
  readonly lane: ScorerLane;
  readonly rawScore: number;
  readonly weightedScore: number;
  readonly weight: number;
  readonly evidence: readonly string[];
  readonly shadowOnly: boolean;
}

export interface AdvisorScoredRecommendation {
  readonly skill: string;
  readonly kind: 'skill' | 'command';
  readonly confidence: number;
  readonly uncertainty: number;
  readonly passes_threshold: boolean;
  readonly reason: string;
  readonly score: number;
  readonly laneContributions: readonly LaneContribution[];
  readonly dominantLane: ScorerLane | null;
  readonly ambiguousWith?: readonly string[];
  readonly redirectTo?: string;
  readonly redirectFrom?: readonly string[];
  readonly lifecycleStatus: SkillLifecycleStatus;
}

export interface AdvisorScoringOptions {
  readonly workspaceRoot: string;
  readonly projection?: AdvisorProjection;
  readonly confidenceThreshold?: number;
  readonly uncertaintyThreshold?: number;
  readonly includeAllCandidates?: boolean;
  readonly disabledLanes?: readonly ScorerLane[];
}

export interface AdvisorScoringResult {
  readonly recommendations: readonly AdvisorScoredRecommendation[];
  readonly topSkill: string | null;
  readonly unknown: boolean;
  readonly ambiguous: boolean;
  readonly metrics: {
    readonly candidateCount: number;
    readonly liveLaneCount: number;
  };
}
