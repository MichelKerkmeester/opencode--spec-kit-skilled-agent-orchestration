// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Lane Ablation
// ───────────────────────────────────────────────────────────────

import { scoreAdvisorPrompt } from './fusion.js';
import type { AdvisorProjection, ScorerLane } from './types.js';
import { SCORER_LANES } from './weights-config.js';

export interface AblationCase {
  readonly prompt: string;
  readonly expectedSkill: string;
}

export interface AblationSlice {
  readonly disabledLane: ScorerLane | 'none';
  readonly total: number;
  readonly correct: number;
  readonly accuracy: number;
  readonly unknown: number;
}

export interface AblationReport {
  readonly baseline: AblationSlice;
  readonly lanes: readonly AblationSlice[];
}

function evaluate(args: {
  cases: readonly AblationCase[];
  workspaceRoot: string;
  projection?: AdvisorProjection;
  disabledLanes?: readonly ScorerLane[];
  label: ScorerLane | 'none';
}): AblationSlice {
  let correct = 0;
  let unknown = 0;
  for (const item of args.cases) {
    const result = scoreAdvisorPrompt(item.prompt, {
      workspaceRoot: args.workspaceRoot,
      projection: args.projection,
      disabledLanes: args.disabledLanes,
    });
    if (result.unknown) unknown += 1;
    if (result.topSkill === item.expectedSkill) correct += 1;
  }
  return {
    disabledLane: args.label,
    total: args.cases.length,
    correct,
    accuracy: args.cases.length > 0 ? Number((correct / args.cases.length).toFixed(4)) : 0,
    unknown,
  };
}

export function runLaneAblation(args: {
  cases: readonly AblationCase[];
  workspaceRoot: string;
  projection?: AdvisorProjection;
}): AblationReport {
  const baseline = evaluate({
    cases: args.cases,
    workspaceRoot: args.workspaceRoot,
    projection: args.projection,
    label: 'none',
  });
  return {
    baseline,
    lanes: SCORER_LANES.map((lane) => evaluate({
      cases: args.cases,
      workspaceRoot: args.workspaceRoot,
      projection: args.projection,
      disabledLanes: [lane],
      label: lane,
    })),
  };
}
