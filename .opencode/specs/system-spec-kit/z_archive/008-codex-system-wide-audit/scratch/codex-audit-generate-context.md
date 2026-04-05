# Codex-High Audit: generate-context subfolder behavior (Spec 123)

- Scope: `generate-context` subfolder resolution behavior (spec 123), plus related tests/verification scripts.
- Mode: Analysis only (no code edits).
- Confidence: High (review based on direct code/test artifact analysis).

## Executive Summary

1. Core subfolder implementation is generally solid: shared utility extraction and most resolution paths are correct.
2. One remaining P1 logic bug exists in `folder-detector.ts` fallback path handling for prefixed nested inputs.
3. Feature verification documentation is stale (P1): checklist/tasks show incomplete state despite implementation/tests existing.
4. No P0 security/data-loss issues identified.
5. Several P2 quality gaps remain (regex permissiveness, normalization consistency, duplicated scan behavior/documentation gaps).

## Severity Findings

### P0 (Blockers)

- None found.

### P1 (Required)

#### P1-01: Bare-child fallback in `folder-detector.ts` receives wrong value for prefixed nested input

- Impact: Recovery path can fail to resolve a valid child when direct nested resolution fails, reducing typo-recovery reliability.
- Evidence:
  - `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:112` calls `findChildFolderAsync(specArg)`.
  - For values like `specs/003-parent/121-child`, this passes a multi-segment string to child lookup, which is expected to receive a child folder name.
- Repro thought experiment:
  1. Invoke detector with `specs/003-parent/121-child` where nested target is not directly resolvable.
  2. Fallback path executes with full prefixed path string.
  3. Child lookup builds invalid joined candidates and misses potential valid child matches.
- Recommended fix: pass `path.basename(specArg)` into `findChildFolderAsync(...)` in this fallback branch.

#### P1-02: Spec 123 checklist P0 verification state is stale (0/12)

- Impact: Project state appears incomplete; automated/manual gates can treat completed work as unverified.
- Evidence:
  - `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/checklist.md` P0 items (`CHK-010`..`CHK-031`) remain unchecked.
  - Same file includes later evidence of passing implementation/testing sections, causing state mismatch.
- Recommended fix: execute/confirm listed format-coverage and backward-compat checks, then mark each item with explicit evidence.

#### P1-03: Spec 123 tasks tracking is stale

- Impact: Misrepresents implementation progress and creates audit friction for subsequent contributors.
- Evidence:
  - `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/tasks.md` phase state remains largely unchecked despite delivered code/tests.
- Recommended fix: reconcile task statuses with actual shipped/tested state and annotate evidence.

### P2 (Should Fix)

#### P2-01: Regex accepts trailing hyphen in spec folder names

- Impact: Permits atypical names (e.g., `003-foo-`) that can create naming inconsistency.
- Evidence:
  - `.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts:20`
  - Pattern allows trailing `-` due to `[a-z0-9-]*` suffix.
- Recommended fix: tighten pattern to disallow trailing hyphens while keeping multi-segment slugs valid.

#### P2-02: Path normalization strategy is inconsistent across resolver entry points

- Impact: Increased maintenance risk; behavior depends on which consumer normalizes first.
- Evidence:
  - `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` normalizes/strips prefixes during argument parsing.
  - `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts` applies separate prefix handling/resolution.
- Recommended fix: centralize normalization contract (single utility or canonical pre-resolved absolute form).

#### P2-03: Deep suggestion scan behavior is not fully aligned/documented

- Impact: Suggestion quality can differ by specs directory selection and scan strategy.
- Evidence:
  - `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` includes inline deep scan fallback logic.
  - Directory preference/suggestion behavior across multiple specs roots is only partially surfaced.
- Recommended fix: document exact selection/scan order and optionally reuse shared resolver utilities for consistency.

## Broken Features / Regressions

- Confirmed high-risk regression candidate: `folder-detector.ts` fallback argument handling bug (P1-01).
- No confirmed P0 regressions in core generate-context execution path from reviewed artifacts.

## Undocumented Behavior

1. Synthetic nested absolute path construction may proceed even when path does not yet exist (pre-creation flow semantics).
2. Multiple specs directory preference behavior is warning-driven and order-dependent.
3. Deep "did you mean" scans are not clearly documented as an all-roots search contract.

## Standards Misalignments

1. Verification documentation drift in spec 123 (`checklist.md` P0 items incomplete vs implementation/test reality).
2. Task-state documentation drift in spec 123 (`tasks.md` not synchronized).
3. Resolver normalization approach differs across consumers, reducing single-source-of-truth clarity.

## Concrete File-Level Patch Plan (No code yet)

- [ ] `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`
  - Patch P1-01: use basename for fallback child lookup input in async path.
- [ ] `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/checklist.md`
  - Patch P1-02: execute/record CHK-010..CHK-031 evidence; update verification summary.
- [ ] `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/tasks.md`
  - Patch P1-03: sync phase/task completion markers with actual implementation and test outcomes.
- [ ] `.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts`
  - Patch P2-01: tighten folder-name regex to prevent trailing hyphen names.
- [ ] `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
  - Patch P2-02/P2-03: normalize argument contract centrally; reduce/align deep suggestion scanning behavior.
- [ ] Related verification docs/tests (if present in `scripts/tests` or verification notes)
  - Document integration-vs-source test intent and required build/type-check gate.

## Affected Files Count

- Estimated impacted files for patch plan: **6**
