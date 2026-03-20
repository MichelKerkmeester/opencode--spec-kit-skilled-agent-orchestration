# Deep Research Strategy: JSON Mode Hybrid Enrichment (Phase 1B)

## Research Topic
Improvements, edge cases, and gaps in the JSON Mode Hybrid Enrichment (Phase 1B) implementation.

## Key Questions

### Domain A: V8 Safety
- **Q1** — What observation leak paths exist in `enrichFileSourceData()`? Can git-extracted observations or FILES bypass the explicit skip guard and contaminate the JSON-authoritative payload?
  - Status: ANSWERED (Iter 001+003) — No direct contamination. Skip guard intact. Shallow copy is the gap.
  - Priority: HIGH
- **Q2** — Can file description enhancement inject new file entries (not just enhance existing ones)? Does the shallow copy `{ ...collectedData }` share nested refs, allowing mutations to `enriched.FILES[i]` to affect originals?
  - Status: ANSWERED (Iter 003) — Update-only, no injection. Shallow copy mutates originals in-place. Threshold/provenance side-effects found.
  - Priority: HIGH

### Domain B: Type Safety
- **Q3** — Which `as Record<string, unknown>` casts in `collect-session-data.ts` are unnecessary given that `CollectedDataBase` already has typed `session?: SessionMetadata` and `git?: GitMetadata` fields?
  - Status: ANSWERED (Iter 001) — 13/13 unnecessary. All can use direct typed access.
  - Priority: MEDIUM
- **Q4** — How deep should runtime validation go for `session` and `git` blocks in `input-normalizer.ts`? Currently validates they are objects but not their inner field types/values. Should `session.status` values be validated at input boundary?
  - Status: ANSWERED (Iter 002) — 6 fields need boundary validation (status, completionPercent, messageCount, toolCount, repositoryState, isDetachedHead). 5 open-text fields fine with consumer guards.
  - Priority: MEDIUM

### Domain C: Priority Override Consistency
- **Q5** — Can `session.status` and `session.completionPercent` produce conflicting states? (e.g., status="COMPLETED" but completionPercent=30). What happens when explicit status differs from heuristic-inferred status?
  - Status: ANSWERED (Iter 002) — Independent override chains preserve contradictions. COMPLETED+30% and BLOCKED+100% emitted unchanged.
  - Priority: HIGH
- **Q6** — Are all session/git field wirings complete? Do `session.lastAction`, `session.nextAction`, `session.blockers`, `session.duration`, `session.messageCount`, `session.toolCount` all flow correctly through the pipeline to the final `SessionData` output?
  - Status: ANSWERED (Iter 002) — All consumed but several are display-only overrides. Manual-normalized path drops session/git entirely.
  - Priority: MEDIUM

### Domain D: Integration
- **Q7** — Do template placeholders `{{HEAD_REF}}`, `{{COMMIT_REF}}`, `{{REPOSITORY_STATE}}`, `{{IS_DETACHED_HEAD}}` correctly consume the enriched/overridden values from `collectSessionData`? Is the priority chain (JSON payload > enrichment > auto-detect) honored end-to-end?
  - Status: ANSWERED (Iter 001) — 9 fields wired correctly. 2 issues: empty-string git clobbers, boolean rendering as Yes/No.
  - Priority: MEDIUM
- **Q8** — What are the top test coverage gaps? Which edge cases in the enrichment + priority override logic are most likely to cause production failures but are currently untested?
  - Status: ANSWERED (Iter 003) — 10 test scenarios identified. Zero existing tests use session/git JSON payloads. Entire Phase 1B contract untested.
  - Priority: HIGH

## Agent Roles

| Slot | Role | Focus |
|------|------|-------|
| C1 | Code Auditor | Deep-read source, trace data flow, find bugs/edge cases |
| C2 | Type & Validation Analyst | Type safety, validation gaps, cast risks |
| C3 | Integration Verifier | Template wiring, backward compatibility, test gaps |

## Iteration Plan

| Iter | Focus Questions | C1 Focus | C2 Focus | C3 Focus |
|------|----------------|----------|----------|----------|
| 001 | Q1 + Q3 + Q7 | V8 safety: trace gitContext/specContext through enrichFileSourceData | Catalog all `as Record` casts, identify failure modes | Trace git/session fields from enrichment to collectSessionData to template |
| 002 | Q4 + Q5 + Q6 | Priority override conflict scenarios (status vs percent) | Validation depth: should session.status/git.repositoryState be validated? | Trace duration/blockers/lastAction/nextAction through full pipeline |
| 003 | Q2 + Q8 | File description enhancement: can it inject new files? Shallow copy mutation? | Shallow copy hazard: `{ ...collectedData }` shares nested refs | Top 10 test scenarios with risk ordering |
| 004 | Refinement | Error handling: partial git data, empty strings vs nullish | Edge cases: empty `session: {}`, NaN/Infinity/out-of-range values | Backward compatibility: old-format JSON identical output? |
| 005 | Synthesis | Cross-validate top findings from iterations 1-4 | Produce concrete type improvement recommendations | Produce concrete test plan |
| 006 | Convergence | Only if needed — deepest remaining gap | — | — |

## Convergence Criteria

3-signal composite (stop when weighted score > 0.60 or max iterations reached):
1. Rolling average of last 3 `newInfoRatio` < 0.08 (weight 0.30)
2. MAD noise floor (weight 0.35)
3. Question entropy: answered/total >= 0.85 (weight 0.35)

## Progress Log

| Iter | Date | New Findings | newInfoRatio | Questions Answered |
|------|------|-------------|-------------|-------------------|
| 001 | 2026-03-20 | 7 | 1.00 | Q3, Q7 (Q1 partial) |
| 002 | 2026-03-20 | 7 | 0.64 | Q4, Q5, Q6 |
| 003 | 2026-03-20 | 5 | 0.35 | Q1, Q2, Q8 |
| **CONVERGED** | 2026-03-20 | — | — | **8/8 answered** |
