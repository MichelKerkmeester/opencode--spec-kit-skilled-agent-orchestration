# Iteration 017 — Dimension(s): D3

## Scope this iteration
Reviewed D3 Performance + Observability because iteration 17 rotates back to D3. This pass focused on fresh live-telemetry identity evidence across the wrapper, route prediction, classifier, and analyzer to check whether the observability surface can faithfully detect cross-skill misreads rather than rehashing the earlier zero-read and static-measurement issues.

## Evidence read
- .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:76-95 -> `normalizeReadPath()` extracts both the actual skill folder and the resource-relative path from each observed read.
- .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:146-153 -> `onToolCall()` records telemetry with `selectedSkill: active.selectedSkill` and `actualReads: [read.resource]`, dropping the observed `read.selectedSkill`.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:495-513 -> predicted `allowedResources` are stored as relative resource strings with tier prefixes, not skill-qualified paths.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:160-179 -> compliance classification keys the allow-list by bare `resource.path` and checks `actualReads` against those bare strings.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:125-147 -> analyzer totals and per-skill rates are computed from the stored `selectedSkill` field on each telemetry record.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
id P1-017-01, dimension D3, live-session telemetry can misclassify cross-skill reads as compliant because it strips the observed skill identity before classification. Evidence: the wrapper already knows the actual skill folder for each read at .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:76-95, but the emitted record keeps only `selectedSkill: active.selectedSkill` and `actualReads: [read.resource]` at .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:146-153. The predicted allow-list is likewise stored as relative resource strings at .opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:495-513, and the classifier compares only those bare paths at .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:160-179. Analyzer rollups then attribute the record to the configured skill via the stored `selectedSkill` field at .opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:125-147. Impact: if a session configured for one skill reads a same-relative-path file from another skill, the telemetry stream can count that read as allowed instead of `extra`, under-reporting cross-skill overload and skewing per-skill compliance conclusions. Remediation: preserve skill-qualified read identities in telemetry (or explicitly compare `read.selectedSkill` to `active.selectedSkill` and force `extra` on mismatch), then add a regression test covering same-relative-path reads across two different skills.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.11 (fresh D3 evidence across wrapper/classifier identity handling found one new observability issue late in the loop)
- cumulative_p0: 0
- cumulative_p1: 10
- cumulative_p2: 8
- dimensions_advanced: [D3]
- stuck_counter: 0

## Next iteration focus
Advance D4 Maintainability + sk-code-opencode alignment with fresh TypeScript strictness and code-discipline evidence from the skill-advisor modules.
