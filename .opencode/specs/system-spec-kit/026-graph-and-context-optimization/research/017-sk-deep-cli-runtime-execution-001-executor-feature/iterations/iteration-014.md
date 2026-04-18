# Iteration 014

## Focus

Q3: audit the seven code-graph sibling handlers against the eight-value `SharedPayloadTrustState` union and determine whether the current readiness vocabulary is fully reachable or partly dead-code/documentation-only.

## Actions Taken

1. Re-anchored on iteration 013 and the active deep-research strategy to confirm Q3 was the next unanswered high-priority question.
2. Read the canonical trust-state definition in `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` plus the shared code-graph projection helpers in `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/readiness-contract.ts`.
3. Audited the seven handler implementations: `query.ts`, `scan.ts`, `status.ts`, `context.ts`, `ccc-status.ts`, `ccc-reindex.ts`, and `ccc-feedback.ts`.
4. Read the focused contract tests in `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-siblings-readiness.vitest.ts` and `.opencode/skill/system-spec-kit/mcp_server/tests/m8-trust-state-vocabulary.vitest.ts`.
5. Searched the runtime for active producers of the legacy states (`cached`, `imported`, `rebuilt`, `rehomed`) to distinguish "reachable elsewhere" from "dead in this surface."

## Findings

### P1. The seven code-graph handlers do not expose the full eight-value trust-state union; they only reach a four-state subset by design

Evidence:
- `SHARED_PAYLOAD_TRUST_STATE_VALUES` defines eight legal values: `live`, `cached`, `stale`, `absent`, `unavailable`, `imported`, `rebuilt`, `rehomed`.
- `readiness-contract.ts` explicitly documents that the code-graph readiness helpers project only a subset of that canonical union.
- `queryTrustStateFromFreshness()` maps only `fresh -> live`, `stale -> stale`, and `empty -> absent`.
- The sibling-readiness test only accepts `live`, `stale`, `absent`, and `unavailable` for handler outputs.

Reachability matrix from static audit:

| Handler | Reachable trustState values | Why |
| --- | --- | --- |
| `query.ts` | `live`, `stale`, `absent` | Returns `buildReadinessBlock(readiness)` after `ensureCodeGraphReady()` succeeds; crashes return an error response, not a readiness payload |
| `scan.ts` | `live`, `absent` | Fabricates readiness from `lastPersistedAt ? 'fresh' : 'empty'`; no stale or unavailable branch |
| `status.ts` | `live`, `stale`, `absent` | Uses `getGraphFreshness()` and `buildReadinessBlock()` |
| `context.ts` | `live`, `stale`, `absent`, `unavailable` | Normal path uses `buildReadinessBlock()`; readiness-check crash overrides `trustState` to `unavailable` |
| `ccc-status.ts` | `unavailable` | Hard-coded `buildUnavailableReadiness('readiness_not_applicable')` |
| `ccc-reindex.ts` | `unavailable` | Same stub behavior |
| `ccc-feedback.ts` | `unavailable` | Same stub behavior |

Why this matters:
- The public "canonical vocabulary" claim is true only in the permissive type-acceptance sense, not in the "all eight states can appear here" sense.
- Any Phase 019 work should treat this surface as a four-state operational subset, not an eight-state runtime matrix.

Risk-ranked remediation candidates:
- P1: tighten docs and test language to say "the handlers stay inside the canonical union and intentionally emit only the readiness-relevant subset."
- P2: add an explicit reachability table to the readiness contract docs so operators do not infer that every handler can emit all eight values.

### P1. `cached` is live elsewhere in the runtime, but it is not reachable from any of the seven code-graph handlers

Evidence:
- Active `trustState: 'cached'` producers exist in `hooks/copilot/compact-cache.ts`, `hooks/gemini/compact-cache.ts`, and `hooks/claude/compact-inject.ts`.
- `trustStateFromCache()` in `shared-payload.ts` also returns `cached` or `stale`.
- None of the seven audited handler files call `trustStateFromCache()` or assign `trustState: 'cached'`.

Why this matters:
- `cached` is not dead globally, so removing it from the canonical union would break compact-cache and session-prime surfaces.
- But it is dead for the code-graph readiness contract specifically, which means cross-surface operators should not expect cache semantics from these handlers.

Risk-ranked remediation candidates:
- P1: keep `cached` in the shared union, but explicitly mark it as "hook/cache-only" in readiness-facing docs.
- P2: split "canonical union" from "per-surface reachable subset" in operator-facing playbooks.

### P1. `imported`, `rebuilt`, and `rehomed` appear to be union-retention placeholders rather than active runtime states in this surface

Evidence:
- The only concrete occurrences found under `mcp_server/` for `imported`, `rebuilt`, and `rehomed` were the trust-state union definition, the exhaustiveness guard, and tests/comments describing legacy or migration-era retention.
- No audited handler assigns those values.
- No active producer search under `mcp_server/` surfaced runtime `trustState: 'imported'`, `trustState: 'rebuilt'`, or `trustState: 'rehomed'`.

Why this matters:
- For this Q3 surface, those three values are effectively dead code or documentation-only compatibility terms today.
- They still impose cognitive load because the shared union looks richer than the runtime behavior operators can actually observe.

Risk-ranked remediation candidates:
- P1: document these three as retained compatibility states with no current code-graph-handler producer.
- P2: if broader runtime audit confirms there are still no active producers anywhere, consider a later deprecation packet rather than carrying them indefinitely as unexplained union noise.

### P2. The scan handler is narrower than the rest of the readiness family and never emits `stale`, which creates a subtle asymmetry inside the "shared" contract

Evidence:
- `scan.ts` does not call `ensureCodeGraphReady()` or `getGraphFreshness()`.
- It derives readiness from whether the new scan persisted anything at all, so the output collapses to `live` or `absent`.
- By contrast, `query.ts`, `status.ts`, and `context.ts` can all surface stale graph state.

Why this matters:
- The handlers share field names and helper types, but not one uniform reachability profile.
- Consumers that infer "every sibling can produce stale" from the shared contract are wrong for `scan.ts`.

Risk-ranked remediation candidates:
- P2: document `scan.ts` as a post-action persistence verdict rather than a full freshness probe.
- P2: only broaden scan to emit `stale` if a real operator need emerges; otherwise keep the simpler live/absent semantics and describe them honestly.

## Questions Answered

- Q3 is answered: the current code-graph readiness surface is only partially reachable. The seven handlers collectively emit a four-state subset (`live`, `stale`, `absent`, `unavailable`) of the eight-value `SharedPayloadTrustState` union.
- `cached` is an active runtime state, but only on hook/cache surfaces, not in the seven code-graph handlers.
- `imported`, `rebuilt`, and `rehomed` are not currently produced by the audited handler family and appear to be retained compatibility vocabulary rather than live readiness outcomes.

## Questions Remaining

- We still have not proven whether `imported`, `rebuilt`, and `rehomed` have any active producer outside the immediate `system-spec-kit/mcp_server` runtime slice.
- We have not yet decided whether the better remediation is doc narrowing, test tightening, or future union deprecation.
- We have not checked whether any downstream consumer currently assumes "canonical union" means "all eight values are practically observable."

## Next Focus

Move to Q9 and audit the evidence-marker bracket-depth lint for false positives in nested fence, mismatched fence, and paren-heavy markdown edge cases. That keeps the next pass on a similarly bounded static-analysis surface with concrete reproduction paths.
