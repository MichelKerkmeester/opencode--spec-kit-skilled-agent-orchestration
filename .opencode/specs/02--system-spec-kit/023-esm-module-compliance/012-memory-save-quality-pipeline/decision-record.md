---
title: "Decision Record: Memory Save Quality Pipeline [023/012]"
description: "Architecture decisions for fixing JSON-mode memory save quality, informed by 20 research iterations."
---
# Decision Record: Phase 012 — Memory Save Quality Pipeline

## DR-001: Use existing normalizeInputData() over new dual-source extractor

**Context**: Two options to get JSON data to extractors: (A) call existing `normalizeInputData()` for JSON input too, or (B) write a completely new extraction path.
**Decision**: Option A — wire JSON through existing normalization at `workflow.ts:613`.
**Rationale**: The normalization already converts sessionSummary → userPrompts and keyDecisions → _manualDecisions. Only 12 LOC to activate for JSON path. Option B would be 60-75 LOC of new code duplicating what normalization already does.
**Evidence**: Research iteration 010 confirmed normalization bypass as root cause.

## DR-002: Plain roles over _synthetic (amended)

**Context**: Synthesized messages from JSON need to be distinguishable from transcript messages. Using `_synthetic: true` would cause downstream filters to discard them.
**Decision**: Use plain User/Assistant roles without any source flag. Originally planned as `_source: 'json'`, simplified during implementation.
**Rationale**: The existing `_synthetic` flag triggers penalization/filtering in quality scoring and template rendering. Investigation confirmed no downstream code filters by message source — only by role. Adding an unused `_source` field would be dead code. Plain User/Assistant roles achieve the goal (not penalized) without adding complexity.
**Evidence**: Research iteration 011 traced `_synthetic` filtering in 3 downstream consumers. Implementation review confirmed no `_source` consumers exist.
**Amendment**: Original DR-002 specified `_source: 'json'` flag. Dropped during implementation as unnecessary — documented 2026-04-01.

## DR-003: Relax V8 for sibling phases, not all JSON

**Context**: V8 contamination flags "Phase 015" as cross-spec pollution in a memory for spec 024.
**Decision**: Add sibling phase names to V8's existing allowedIds mechanism. Do NOT disable V8 for all JSON input.
**Rationale**: V8 correctly catches genuine cross-spec contamination. The bug is that sibling phases within the same parent aren't in the allowlist. Surgical fix preserves contamination detection for real leaks.
**Evidence**: Research iteration 013 confirmed V8 already has allowlist infrastructure — just missing sibling population.

## DR-004: Quality floor with damping over hard minimum

**Context**: JSON saves need a minimum quality guarantee, but a hard floor could mask genuine rendering problems.
**Decision**: Floor = `jsonFloor * 0.85`, capped at 70/100. Contamination penalties override.
**Rationale**: The 0.85x damping ensures that a poorly-structured JSON payload doesn't artificially score high. The 70 cap ensures the floor never produces a "perfect" score. Contamination override prevents masking real issues.
**Evidence**: Research iteration 012 modeled scoring projections showing 0.85x produces 55-65 effective floor for typical inputs.

## DR-005: Accept filesChanged as field alias

**Context**: AI agents use `filesChanged` in JSON payloads but the script only accepts `filesModified`/`files_modified`.
**Decision**: Add `filesChanged` as accepted alias, mapped to `filesModified` during normalization.
**Rationale**: The field name mismatch caused silent data loss in every JSON save that used `filesChanged`. This is a one-line fix with high impact.
**Evidence**: Research iteration 006 discovered the mismatch via KNOWN_RAW_INPUT_FIELDS set analysis.

## DR-006: Cap key_files at 20, exclude iteration directories

**Context**: Without scoping, key_files lists 300+ entries including every research/review iteration.
**Decision**: Cap at 20 files sorted by mtime desc. Exclude `research/iterations/` and `review/iterations/` from enumeration.
**Rationale**: Key files should highlight the most relevant recent files, not provide a complete directory listing. Research/review iterations are auxiliary — they inflate the list without adding retrieval value.
**Evidence**: Research iteration 014 traced the uncapped enumeration in `buildKeyFiles()` / `listSpecFolderKeyFiles()`.
