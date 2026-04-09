---
title: "Deep Review Report — 026 Graph and Context Optimization"
description: "Final synthesis of 15-iteration deep review across 4 dimensions for the 026 graph-and-context-optimization packet family. 6 P1 findings, 0 P0, 0 P2. Verdict: CONDITIONAL — remediation required before any further activation."
trigger_phrases:
  - "deep-review 026"
  - "026-graph-context review report"
  - "026 release readiness"
  - "deep-review iteration synthesis 026"
importance_tier: "important"
contextType: "review-report"
session_id: "2026-04-09T03:59:45Z"
verdict: "CONDITIONAL"
hasAdvisories: false
---

# Deep Review Report — 026 Graph and Context Optimization

<!-- ANCHOR:overview -->
## 1. OVERVIEW

| Field | Value |
|---|---|
| **Review target** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` (parent + 27 child/sub-phase folders) |
| **Reviewer backend** | cli-codex `gpt-5.4` (`reasoning_effort=high`, `service_tier=fast`, `sandbox=workspace-write`) |
| **Session id** | `2026-04-09T03:59:45Z` |
| **Iterations executed** | 15 of 20 (early-stop after 9 consecutive thought-only iterations + user approval) |
| **Dimensions covered** | D1 Correctness, D2 Security, D3 Traceability, D4 Maintainability |
| **Findings (active)** | **0 P0**, **6 P1**, **0 P2** |
| **Verdict** | **CONDITIONAL** — 6 P1 blockers must be resolved before any further activation of 026 packets 009/011/012/013 |
| **hasAdvisories** | `false` (no P2 nits surfaced) |
| **Convergence reason** | Composite vote: rolling avg ratio = 0.00, all dimensions touched, coverage_age ≥ 9. P0=0 means no clean-stop blocker; P1=6 means CONDITIONAL not PASS. |
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:scope -->
## 2. SCOPE & METHODOLOGY

### What was reviewed

Primary focus: the 9 packets shipped 2026-04-09 in commit `33823d006`:
- **005** (R1) provisional measurement contract
- **006** (R10) structural trust axis contract
- **007** (R6) detector provenance + regression floor
- **008** (R4) graph-first routing nudge
- **009** (R9) auditable savings publication contract
- **010** (R7) FTS capability cascade floor
- **011** (R5) graph payload validator + trust preservation
- **012** (R3) cached SessionStart consumer (gated)
- **013** (R8) warm-start bundle conditional validation

Secondary context: research lineage in `001-research-graph-context-systems/`, the 006-research-memory-redundancy classification map, prior shipped work in `002`/`003`/`004`.

### Reviewer protocol

15 fresh-context cli-codex iterations dispatched serially. Each iteration:
1. Read `deep-review-strategy.md`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-config.json`
2. Picked next dimension/focus from §12 NEXT FOCUS
3. Read 2–14 target files
4. Wrote `iterations/iteration-{NNN}.md` with findings
5. Appended JSONL record
6. Updated strategy.md (running findings, completed dimensions, next focus)
7. Rewrote findings-registry.json

The orchestrator (Claude Opus 4.6) substituted cli-codex for `Task @deep-review` because the LEAF agent's model parameter only accepts sonnet/opus/haiku, while the user's explicit reviewer preference was GPT-5.4.

### Iteration timeline

| Iter | Dimension | Status | New Findings | Cumulative | Ratio |
|---|---|---|---|---|---|
| 001 | D1 Correctness | insight | +1 P1 | 1 | 1.00 |
| 002 | D1 Correctness | insight | +1 P1 | 2 | 0.50 |
| 003 | D1 Correctness | insight | +1 P1 | 3 | 0.33 |
| 004 | D1 Correctness | insight | +1 P1 | 4 | 0.25 |
| 005 | D2 Security | insight | +1 P1 | 5 | 0.20 |
| 006 | D2 Security | insight | +1 P1 | 6 | 0.17 |
| 007 | D2 Security | thought | 0 | 6 | 0.00 |
| 008 | D3 Traceability | thought | 0 | 6 | 0.00 |
| 009 | D3 Traceability | thought | 0 | 6 | 0.00 |
| 010 | D4 Maintainability | thought | 0 | 6 | 0.00 |
| 011 | D4 Maintainability | thought | 0 | 6 | 0.00 |
| 012 | D3 Traceability | thought | 0 | 6 | 0.00 |
| 013 | D3 Traceability | thought | 0 | 6 | 0.00 |
| 014 | D3 Traceability | thought | 0 | 6 | 0.00 |
| 015 | D3 Traceability | thought | 0 | 6 | 0.00 |

Iteration 6 was killed and retried after stalling for 1+ hour (silent OpenAI API delay); the retry completed in ~3 minutes. State remained intact (clean restart, no partial JSONL writes).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:findings -->
## 3. FINDINGS

### Cluster summary

| Affected packet | Finding count | Severity | Theme |
|---|---|---|---|
| **011** | 1 (+1 cross-cut) | P1 | Resume trust preservation overclaimed; bootstrap synthesizes trust instead of preserving it |
| **012** | 1 (+1 cross-cut) | P1 | Frozen-corpus proof bypasses real `session_resume`/`session_bootstrap`/`session-prime` paths; cross-session cached selection unscoped |
| **013** | 1 | P1 | Bundle benchmark cannot observe pass-rate regressions (constant by construction) |
| **009** | 1 | P1 | Publication-gate ships as helper-only; spec required handler-level publication output behavior |

All 6 are P1 (Required) — no P0 blockers, no P2 advisories. The cluster centers on **two structural problems**: (a) packets that ship helpers without wiring them into the spec-named consumer surfaces (009, 012, 013), and (b) trust-axis preservation that is overclaimed but not actually plumbed end-to-end (011, 012 cross-cut, 005's bootstrap fallback path).

---

### DR-026-I001-P1-001 — Packet 011 does not preserve structural trust through the shipped `session_resume` payload

**Severity**: P1 · **Dimension**: D1 Correctness · **Affected packet**: 011 · **Source iteration**: 1

**Claim**: 011's spec.md and implementation-summary.md claim end-to-end resume trust preservation across `shared-payload`, `bootstrap`, `resume`, `graph-context`, and `bridge`. The shipped runtime does not satisfy this claim: `session-resume.ts` emits the `structural-context` section with `certainty` only, no `structuralTrust`. `session-bootstrap.ts:251` attempts `extractStructuralTrustFromPayload(resumePayload) ?? buildStructuralContextTrust(structuralContext)` — the `??` always falls through because the resume payload never carries structural trust, so bootstrap synthesizes trust from its independent local snapshot rather than preserving the runtime-emitted resume trust. The graph-payload-validator vitest stubs a resume payload that already contains `structuralTrust`, so the test does not exercise the real path.

**Evidence**:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-graph-payload-validator-and-trust-preservation/spec.md:64` (REQ-002 acceptance criterion: end-to-end preservation)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-graph-payload-validator-and-trust-preservation/spec.md:94` (REQ-002 detail)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-graph-payload-validator-and-trust-preservation/implementation-summary.md:36` (overclaim "end-to-end")
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-graph-payload-validator-and-trust-preservation/implementation-summary.md:46`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-graph-payload-validator-and-trust-preservation/implementation-summary.md:79`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:533` (structural-context section emitted without `structuralTrust` field)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:251` (`??` fallback)
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:138` (mocked stub bypasses real path)

**Adversarial spot-check (orchestrator)**: Confirmed by direct read of session-resume.ts:525-540 and session-bootstrap.ts:245-265. The `??` is exactly where described.

```json
{
  "claim": "Packet 011 overclaims end-to-end resume trust preservation while session-resume.ts emits structural-context without structuralTrust and session-bootstrap synthesizes from local snapshot.",
  "evidenceRefs": ["session-resume.ts:533", "session-bootstrap.ts:251", "011/spec.md:64", "011/spec.md:94", "011/implementation-summary.md:36"],
  "counterevidenceSought": "Searched for any other path that propagates structuralTrust from resume to bootstrap; none exists.",
  "alternativeExplanation": "The synthesized trust may still be 'correct enough' because graph snapshot is independent and authoritative — but this still violates the 'preserve end-to-end' contract claimed in 011's docs.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "If 011's spec is rewritten to scope preservation to graph-context payloads only (not the resume → bootstrap chain), the finding downgrades to P2 documentation honesty."
}
```

**Recommended remediation**:
1. EITHER (preferred): plumb `structuralTrust` through `session-resume.ts`'s `structural-context` section, then update bootstrap to consume it directly without the local-snapshot fallback.
2. OR: rewrite 011's spec REQ-002 + implementation-summary §What Was Built to honestly scope preservation to graph-context payloads only (not resume → bootstrap chain), and document the local-snapshot synthesis explicitly.
3. Add an integration test that exercises the real `session_resume` → `session_bootstrap` flow with structural trust assertion (replacing the current mock stub).

---

### DR-026-I002-P1-001 — Packet 012's frozen-corpus proof does not exercise real `session_resume`/`session_bootstrap`/`session-prime` surfaces

**Severity**: P1 · **Dimension**: D1 Correctness · **Affected packet**: 012 · **Source iteration**: 2

**Claim**: 012's spec.md (REQ-005, REQ-008) and implementation-summary.md state the frozen corpus proves equal-or-better behavior relative to live reconstruction. The shipped test `scripts/tests/session-cached-consumer.vitest.ts.test.ts` imports only the helper-level gate/additive functions (e.g., `evaluateCachedConsumerGates`, `additiveEnrichBootstrap`) and scores a handcrafted baseline object instead of exercising `session-bootstrap.ts`, `session-resume.ts`, or `session-prime.ts`. The "equal-or-better pass rate" claim is therefore unproven against the real consumer surfaces named in spec.md §3 Files to Change.

**Evidence**:
- `012/spec.md:112` (REQ-005 mirrors R3 acceptance: corpus shows equal-or-better pass rate)
- `012/spec.md:114` (REQ-005 detail)
- `012/spec.md:122` (REQ-008 corpus comparison requirement)
- `012/spec.md:142` (success criterion SC-004)
- `012/implementation-summary.md:35` (claims corpus proven)
- `012/implementation-summary.md:47`
- `012/implementation-summary.md:81`
- `scripts/tests/session-cached-consumer.vitest.ts.test.ts:6` (imports helpers only)
- `scripts/tests/session-cached-consumer.vitest.ts.test.ts:138`
- `scripts/tests/session-cached-consumer.vitest.ts.test.ts:152`

```json
{
  "claim": "012's frozen-corpus test bypasses session-bootstrap/session-resume/session-prime; the corpus comparison runs only against helper functions.",
  "evidenceRefs": ["session-cached-consumer.vitest.ts.test.ts:6", "session-cached-consumer.vitest.ts.test.ts:138", "012/spec.md:112", "012/implementation-summary.md:35"],
  "counterevidenceSought": "Searched for any integration test importing session-bootstrap/session-resume in scripts/tests/ — none found that exercise the cached-consumer path.",
  "alternativeExplanation": "Helper-level coverage may be intentionally bounded to avoid test flakiness; if so, the spec's R3 acceptance criterion is mis-stated.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "If 012's spec is rewritten to scope the corpus to helper-level gating only, finding downgrades to P2 documentation honesty."
}
```

**Recommended remediation**:
1. Add an integration test that mounts the real `session_bootstrap` and `session_resume` handlers, feeds them mocked stop-summary fixtures via the producer hook-state path, and asserts equal-or-better behavior across cached-accept and cached-reject scenarios.
2. OR rewrite 012/spec.md REQ-005, REQ-008, SC-004 to honestly scope the corpus to helper-level gating, and update the implementation-summary to match.

---

### DR-026-I003-P1-001 — Packet 013's bundle benchmark cannot observe pass-rate regressions

**Severity**: P1 · **Dimension**: D1 Correctness · **Affected packet**: 013 · **Source iteration**: 3

**Claim**: The warm-start variant runner counts only wrapper-derived `REQUIRED_FINAL_FIELDS` (`title`, `triggers`, `evidenceBullets`, `continuationState`, `decisionRecordPointer`, `implementationSummaryPointer`, `followUpResolution`) that are populated by every scenario for every variant. Therefore every lane scores the full pass count (28/28 across all variants in the benchmark matrix). The R8 / REQ-006 "equal-or-better pass rate" gate is **unfalsifiable by construction** — rejected cached continuity and weaker follow-up resolutions change cost but never measured pass rate.

**Evidence**:
- `013/spec.md:96` (REQ-004 mirrors R8 acceptance: lower cost AND equal-or-better pass rate)
- `013/spec.md:103` (REQ-006 honest comparison)
- `013/implementation-summary.md:59`
- `013/implementation-summary.md:73`
- `mcp_server/lib/eval/warm-start-variant-runner.ts:82` (REQUIRED_FINAL_FIELDS list)
- `mcp_server/lib/eval/warm-start-variant-runner.ts:191`
- `mcp_server/lib/eval/warm-start-variant-runner.ts:215`
- `scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:176`

**Adversarial spot-check (orchestrator)**: Confirmed. `REQUIRED_FINAL_FIELDS` at line 82-90 is exactly the wrapper boilerplate; any scenario produces all of them regardless of which variant is active.

```json
{
  "claim": "warm-start-variant-runner's pass-rate counter is constant by construction; the bundle-dominance claim (cost 43 vs baseline 64, pass 28/28) cannot be falsified.",
  "evidenceRefs": ["warm-start-variant-runner.ts:82", "warm-start-variant-runner.ts:191", "warm-start-variant-runner.ts:215"],
  "counterevidenceSought": "Searched for any pass-rate-affecting field outside REQUIRED_FINAL_FIELDS — none exist; the runner only scores wrapper boilerplate.",
  "alternativeExplanation": "If pass-rate parity is intended to be 'wrapper completeness' rather than 'follow-up answer correctness', the spec must say so explicitly. Currently it does not.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "If 013's spec is rewritten to define pass-rate as wrapper-completeness only, finding downgrades to P2 honesty."
}
```

**Recommended remediation**:
1. Extend `REQUIRED_FINAL_FIELDS` (or add a separate scoring dimension) to include scenario-derived fields that vary per variant: e.g., `cachedReuseAccepted`, `followUpResolutionAccuracy`, `liveReconstructionParity`.
2. Add at least one scenario in the corpus where the cached path is *rejected* and the live reconstruction *fails* a follow-up — so a pass-rate regression is observable.
3. Re-run the benchmark and update `scratch/benchmark-matrix.md` with honest numbers (the current `28/28` across all variants is a tell that the test is non-discriminating).

---

### DR-026-I004-P1-001 — Packet 009 marks the publication contract implemented without any live publication/export consumer

**Severity**: P1 · **Dimension**: D1 Correctness · **Affected packet**: 009 · **Source iteration**: 4

**Claim**: Packet 009's spec.md REQ-001/002 require publication output behavior (eligibility gates + exclusion reasons surfaced on real reporting handlers). The shipped runtime is `lib/context/publication-gate.ts` (a helper) plus `tests/publication-gate.vitest.ts` (a unit test). No publication or export handler in `mcp_server/handlers/` consumes the helper. Implementation-summary.md claims the contract is implemented and shipped — that overclaims runtime delivery.

**Evidence**:
- `009/spec.md:73` (Files to Change names `mcp_server/handlers` apply gates)
- `009/spec.md:87` (REQ-001 publication output requirement)
- `009/spec.md:88` (REQ-002 exclusion reason surfaced)
- `009/spec.md:115` (SC-001 publishable rows are auditable)
- `009/spec.md:116` (SC-002 hard eligibility gate)
- `009/implementation-summary.md:34`
- `009/implementation-summary.md:44`
- `009/implementation-summary.md:76`
- `mcp_server/lib/context/publication-gate.ts:47` (helper exists)
- `mcp_server/tests/publication-gate.vitest.ts:3` (unit test only)

**Note**: The codex implementer for 009 reported in its LIMITATIONS section: *"no row-oriented export handler exists yet, so the publication contract ships as a shared helper for future reporting/export surfaces"*. This honest limitation does NOT match the spec's REQ-001/002 acceptance criteria, which require handler-level enforcement. The packet should not have been marked Implemented.

```json
{
  "claim": "009 ships only the helper + unit test; no consumer handler enforces the publication gate, contradicting spec REQ-001/002 + SC-001/002.",
  "evidenceRefs": ["publication-gate.ts:47", "publication-gate.vitest.ts:3", "009/spec.md:73", "009/spec.md:87"],
  "counterevidenceSought": "Searched for any handler in mcp_server/handlers/ that imports publication-gate.ts; none found.",
  "alternativeExplanation": "Could be intentional 'contract first, consumer later' staging — but the implementation-summary does not say that; it claims the contract is implemented.",
  "finalSeverity": "P1",
  "confidence": 0.94,
  "downgradeTrigger": "If 009/spec.md is rewritten to declare 'helper-only contract for future consumers' and impl-summary acknowledges the helper-only status, downgrades to P2 honesty."
}
```

**Recommended remediation**:
1. Either wire `publication-gate.ts` into a real reporting/export handler (e.g., `handlers/memory-search.ts` for query response gating, or a new `handlers/export.ts`)
2. OR rewrite 009/spec.md scope + impl-summary to honestly declare "helper-only, consumer deferred" and downgrade the SC-001/SC-002 success criteria to "shared helper exported and tested".
3. Re-run validate.sh on 009 after the change.

---

### DR-026-I005-P1-001 — `session_bootstrap` synthesizes live structural trust onto errored resume outputs

**Severity**: P1 · **Dimension**: D2 Security · **Affected packets**: 005 (bootstrap), 011 (trust contract), 012 (cached consumer cross-cut) · **Source iteration**: 5

**Claim**: When `handleSessionResume()` throws inside `session-bootstrap.ts`, the bootstrap branch reduces the resume object to `{ error }` and then **annotates that errored object** with graph-derived `parserProvenance`/`evidenceStatus`/`freshnessAuthority` from the independent local structural snapshot (via `attachStructuralTrustFields`). This **widens authority** instead of failing closed when the resume owner surface never emitted validated trust metadata. The combined output then advertises a `StructuralTrust` envelope on a payload section whose owner explicitly errored — a fail-closed contract violation.

**Evidence**:
- `mcp_server/handlers/session-bootstrap.ts:201` (resume try/catch)
- `mcp_server/handlers/session-bootstrap.ts:203` (error reduction to `{ error }`)
- `mcp_server/handlers/session-bootstrap.ts:251` (`extractStructuralTrustFromPayload(resumePayload) ?? buildStructuralContextTrust(structuralContext)` synthesizes trust on error path)
- `mcp_server/handlers/session-bootstrap.ts:258` (attaches synthesized trust to errored resume)
- `011/spec.md:63` (fail-closed validator at code-graph and bridge boundaries)
- `011/spec.md:93` (REQ-001 fail-closed acceptance)
- `012/spec.md:24` (additive consumer must NOT widen authority)
- `012/implementation-summary.md:43` (compact wrapper not authority surface)

```json
{
  "claim": "On resume error, session-bootstrap annotates the errored resume payload with synthesized structural trust from the local snapshot, widening authority instead of failing closed.",
  "evidenceRefs": ["session-bootstrap.ts:201", "session-bootstrap.ts:203", "session-bootstrap.ts:258", "011/spec.md:63"],
  "counterevidenceSought": "Searched for any error-branch fail-closed guard in session-bootstrap.ts that would suppress structuralTrust attachment; none exists.",
  "alternativeExplanation": "The bootstrap may intentionally keep structural-context payload available even when resume errors, to give the caller something to render. If so, the structural trust attachment should be on a SEPARATE payload section (the local snapshot), not on the errored resume payload.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "If a separate structural-snapshot payload section is added and the errored resume is left untrusted, finding closes."
}
```

**Recommended remediation**:
1. In `session-bootstrap.ts:251`, when `resumeData.error` is set, do NOT call `attachStructuralTrustFields(resumeData, …)`. Either omit `structuralTrust` from the errored resume payload entirely, or attach it to a separate `structural-snapshot` payload section that is clearly distinct from the resume section.
2. Add a vitest case that throws from `handleSessionResume()` and asserts the errored resume payload does NOT carry `structuralTrust`.
3. Cross-reference with finding DR-026-I001-P1-001: the resume preservation gap and this fail-closed gap have a shared root cause (bootstrap is the only trust-attachment owner today).

---

### DR-026-I006-P1-001 — Unscoped cached continuity selection reuses the newest project hook state across sessions

**Severity**: P1 · **Dimension**: D2 Security · **Affected packets**: 012 (consumer), 002 (producer cross-cut) · **Source iteration**: 6

**Claim**: 012's candidate-selection path defaults to `loadMostRecentState()` in `hook-state.ts`, which picks the newest hook-state file in the project by mtime. SessionStart startup and `session_resume()` calls **without an explicit `specFolder`** therefore can accept and surface another recent session's cached continuity summary without proving that artifact belongs to the active session or requested scope. This violates 012/spec.md REQ-002 (freshness gate must include scope) and REQ-007 (invalidation must be explicit, not heuristic).

**Evidence**:
- `mcp_server/hooks/claude/hook-state.ts:91` (`loadMostRecentState` definition)
- `mcp_server/hooks/claude/hook-state.ts:99` (newest-by-mtime selection)
- `mcp_server/handlers/session-resume.ts:346` (loadMostRecentState call without scope)
- `mcp_server/handlers/session-resume.ts:354`
- `mcp_server/handlers/session-resume.ts:467`
- `mcp_server/hooks/claude/session-prime.ts:121`
- `mcp_server/hooks/claude/session-prime.ts:126`
- `012/spec.md:111` (REQ-002 freshness + scope)
- `012/spec.md:123` (REQ-007 explicit invalidation)

```json
{
  "claim": "Cached continuity selection falls back to newest-by-mtime project-wide; unscoped sessions can surface another session's hook-state.",
  "evidenceRefs": ["hook-state.ts:91", "hook-state.ts:99", "session-resume.ts:346", "session-prime.ts:121"],
  "counterevidenceSought": "Searched for explicit-scope guards in session-resume's loadMostRecentState callsites; the calls do not pass a scope filter.",
  "alternativeExplanation": "If the project only ever has one active session at a time (which is fragile), this is harmless. With concurrent sessions, branches, or worktrees, it leaks one session's continuity into another.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "If specFolder/sessionId scoping is added to loadMostRecentState and all unscoped callsites are removed or wrapped, finding closes."
}
```

**Recommended remediation**:
1. Add `specFolder` and/or `claudeSessionId` filtering to `loadMostRecentState()` and require all callers to pass it.
2. Update the 3 unscoped callsites in `session-resume.ts:346`, `session-resume.ts:467`, and `session-prime.ts:121` to pass scope.
3. Add a vitest case where two sessions write hook-states in parallel; assert that session A's resume only surfaces session A's cached continuity.
4. Update 012/spec.md REQ-002 to make the scope-binding requirement explicit at the candidate-selection level, not just at the gate level.

<!-- /ANCHOR:findings -->

---

<!-- ANCHOR:traceability -->
## 4. TRACEABILITY VERIFICATION

| Protocol | Level | Status | Notes |
|---|---|---|---|
| `spec_code` | core | **partial** | 4 of 9 packets (009, 011, 012, 013) have spec/code drift; the other 5 (005, 006, 007, 008, 010) align cleanly with spec Files to Change tables and acceptance criteria |
| `checklist_evidence` | core | **partial** | All 9 packets' checklists are marked `[x]` with `[SOURCE: file:line]` citations, but 4 packets (009, 011, 012, 013) cite code that doesn't actually satisfy the cited acceptance criterion (P1 findings above) |
| `skill_agent` | overlay | pass | No skill or agent file modifications in 005-013; cross-runtime agent definitions unchanged |
| `agent_cross_runtime` | overlay | notApplicable | No agent work in scope |
| `feature_catalog_code` | overlay | notApplicable | No feature catalog work in scope |
| `playbook_capability` | overlay | notApplicable | No testing playbook work in scope |

**Research citation integrity (R1–R10 → recommendations.md)**: All 9 packets cite specific line ranges in `001-research-graph-context-systems/research/recommendations.md`. Spot-checked R1 (lines 5–13, 005), R5 (lines 45–53, 011), R8 (lines 75–83, 013) — all citations resolve. **Pass.**

**006-research-memory-redundancy alignment (§3A Downstream Impact Map)**: All 9 packets carry the explicit classification note in their implementation-summary.md (verified via grep). 005/006/007/008/009/010/011 = "No change", 012/013 = "Recommendation/assumption alignment". **Pass.**
<!-- /ANCHOR:traceability -->

---

<!-- ANCHOR:dimension-summary -->
## 5. DIMENSION SUMMARIES

### D1 Correctness (iters 1–4, 11)
**Verdict: CONDITIONAL.** 4 P1 findings. The shared-payload contract is internally consistent and additive across the 3 layered packets (005/006/011); no duplicate type definitions. The break is **propagation** through the named consumer surfaces (resume preservation, cached corpus, bundle benchmark, publication consumer). All 4 findings share a structural pattern: helpers ship, but the spec's acceptance criterion requires consumer-level enforcement that did not land.

### D2 Security (iters 5–7)
**Verdict: CONDITIONAL.** 2 P1 findings. Both relate to fail-closed contract violations:
- Bootstrap synthesizes trust onto errored resume (widens authority instead of failing closed)
- Cached continuity selection falls back to newest-by-mtime project-wide without scope binding (cross-session leakage risk)

No injection paths, no secrets exposure, no unsafe deserialization paths discovered.

### D3 Traceability (iters 8–9, 12–15)
**Verdict: PASS with caveat.** Spec/code drift is fully captured by the D1 findings. Research citations resolve. Checklist evidence cites real files and lines. The "caveat" is that 4 packets' checklists cite code that exists but doesn't actually meet the acceptance criterion — this is a D1 issue surfaced through D3 review.

### D4 Maintainability (iters 10–11)
**Verdict: PASS.** No findings. Layered shared-payload composition is clean. Doc honesty is high outside the 4 overclaim cases above. ENV_REFERENCE.md sections are coherent. contracts/README.md sections are additive (no rewrites of prior sections).
<!-- /ANCHOR:dimension-summary -->

---

<!-- ANCHOR:remediation-lanes -->
## 6. REMEDIATION LANES

Four parallel lanes for the next implementation cycle. Each lane is independently shippable and reverts cleanly if needed.

### Lane A — Packet 011 trust-preservation propagation (1 finding)
**Findings**: DR-026-I001-P1-001 (and cross-cut with DR-026-I005-P1-001)
**Files**: `session-resume.ts`, `session-bootstrap.ts`, `tests/graph-payload-validator.vitest.ts`, `011/spec.md`, `011/implementation-summary.md`
**Effort**: M
**Approach**: Either plumb `structuralTrust` through `session-resume.ts:533` (recommended) or rewrite 011/spec REQ-002 to scope preservation to graph-context payloads only. Add a real integration test.

### Lane B — Packet 012 corpus + scoping (2 findings)
**Findings**: DR-026-I002-P1-001, DR-026-I006-P1-001
**Files**: `scripts/tests/session-cached-consumer.vitest.ts.test.ts`, `mcp_server/hooks/claude/hook-state.ts`, `mcp_server/handlers/session-resume.ts`, `mcp_server/hooks/claude/session-prime.ts`, `012/spec.md`
**Effort**: M-L
**Approach**:
1. Add session-bootstrap/session-resume integration coverage to the cached-consumer corpus test
2. Add `specFolder` scope filtering to `loadMostRecentState()` and update all callsites
3. Update 012/spec.md REQ-002 + REQ-007 to make scope-binding explicit at selection level

### Lane C — Packet 013 falsifiable benchmark (1 finding)
**Findings**: DR-026-I003-P1-001
**Files**: `mcp_server/lib/eval/warm-start-variant-runner.ts`, `scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts`, `013/scratch/benchmark-matrix.md`, `013/implementation-summary.md`
**Effort**: S-M
**Approach**: Extend `REQUIRED_FINAL_FIELDS` (or add a parallel scoring dimension) for scenario-varying outputs. Add a rejection scenario where pass-rate is observable. Re-run benchmark and update matrix with honest numbers.

### Lane D — Packet 009 publication consumer (1 finding)
**Findings**: DR-026-I004-P1-001
**Files**: One of `mcp_server/handlers/memory-search.ts` (gating consumer) OR new `mcp_server/handlers/export.ts`, `009/spec.md`, `009/implementation-summary.md`
**Effort**: S-M
**Approach**: Wire `publication-gate.ts` into a real reporting handler OR rewrite 009 docs to honestly declare helper-only status.

### Cross-cutting: bootstrap fail-closed (Lane A overlap)
**Findings**: DR-026-I005-P1-001
**Files**: `session-bootstrap.ts`
**Effort**: S
**Approach**: When `handleSessionResume()` throws, do NOT attach `structuralTrust` to the errored resume payload. Move local-snapshot trust to a separate payload section. Add a vitest case for the error branch.
<!-- /ANCHOR:remediation-lanes -->

---

<!-- ANCHOR:packets-cleared -->
## 7. PACKETS THAT PASSED REVIEW CLEAN

The following 5 packets had **zero findings** across all 4 dimensions and 15 iterations:

| Packet | R# | Title | Notes |
|---|---|---|---|
| **005** | R1 | Provisional measurement contract | Shared CertaintyStatus vocabulary is clean, additive, used by 009. canPublishMultiplier helper works as specified. |
| **006** | R10 | Structural trust axis contract | ParserProvenance/EvidenceStatus/FreshnessAuthority types are separate and never collapsed. Imports cleanly into 011 validator. |
| **007** | R6 | Detector provenance + regression floor | Audit found no AST overclaims (codex-implementer correctly pivoted to honest provenance descriptors + frozen fixture). |
| **008** | R4 | Graph-first routing nudge | Advisory-only, readiness-gated. No new router subsystem. Tests cover positive and negative cases. |
| **010** | R7 | FTS capability cascade floor | All 4 forced-degrade cases distinguished. Lexical-path metadata surfaces correctly. No `fts4_match` overclaim. |

005/006/007/008/010 are **release-ready**. The 4 conditional packets (009/011/012/013) require remediation before further activation, but do not require revert — the runtime they shipped is functional, just narrower than the spec claims.
<!-- /ANCHOR:packets-cleared -->

---

<!-- ANCHOR:risk-assessment -->
## 8. RISK ASSESSMENT

### Severity-weighted release readiness

| Severity | Count | Impact on 026 release |
|---|---|---|
| P0 (Blockers) | 0 | None — no release-blocking defects |
| P1 (Required) | 6 | **CONDITIONAL** — requires remediation before further activation of 009/011/012/013 |
| P2 (Suggestions) | 0 | None |

### Why no findings are P0

All 6 P1 findings share the property that the shipped code is **functionally usable** today — it just doesn't meet the spec's acceptance criteria fully. None of them break existing behavior, leak secrets, corrupt state, or block other packets. The risk is **truth-of-shipped-claims**, not runtime correctness of working code.

If 009/011/012/013 are not activated for production-grade reporting/trust/consumer flows yet, the P1s are **deferred-actionable**, not blocking. The remediation lanes can ship in a follow-up feature branch.

### Ship-now-vs-fix-first decision matrix

| Question | Answer |
|---|---|
| Do the P1s break tests? | No. All vitest, typecheck, and validate.sh continue to pass. |
| Do the P1s break other packets? | No. 005/006/007/008/010 are clean. |
| Do the P1s block downstream activation? | Yes — for any caller of 009 publication, 011 trust preservation, 012 cached consumer, 013 bundle. |
| Are the P1s reversible? | All 6 findings have a doc-only rewrite path that downgrades them to P2 honesty issues. The preferred remediation is the runtime fix; the fallback is honest scoping. |
<!-- /ANCHOR:risk-assessment -->

---

<!-- ANCHOR:next-steps -->
## 9. NEXT STEPS

1. **Decide ship-now-vs-fix-first** — present this report to packet owner. The 5 clean packets (005/006/007/008/010) can stay in main branch unchanged. The 4 conditional packets need a decision.
2. **If fix-first**: spawn `/spec_kit:plan` for each remediation lane (A, B, C, D) and dispatch implementation via cli-codex per-lane (similar pattern to the original 9-packet orchestration).
3. **If ship-now-with-known-debt**: rewrite the 4 affected packets' implementation-summary.md to add a "Known Limitations / Deferred Acceptance" section citing this review report. Downgrade SC-001/SC-002 in spec.md as needed. Re-run validate.sh.
4. **Always**: add the integration tests recommended in each finding's remediation steps. The current vitest suite uses too many helper-level mocks; integration tests at the handler level would have caught all 6 findings.
5. **Memory save** the review session via `generate-context.js` so the findings are recoverable in future sessions.

| Condition | Suggested next command |
|---|---|
| Fix-first (recommended for 011, 012) | `/spec_kit:plan "remediation lane A — packet 011 trust preservation"` |
| Ship-now-with-debt (acceptable for 009, 013 if no consumer is live) | Manual edits to 009/013 impl-summary.md, then commit |
| Re-run with deeper scope | `/spec_kit:deep-review:auto ".../026-graph-and-context-optimization/" --max-iterations=20 --convergence=0.05` |
| Want to investigate one finding deeper | `/spec_kit:deep-research "finding DR-026-I001-P1-001 — 011 resume trust preservation"` |
| Save context | `/memory:save .opencode/specs/system-spec-kit/026-graph-and-context-optimization/` |
<!-- /ANCHOR:next-steps -->

---

## STATUS

```
STATUS=OK
PATH=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/
ITERATIONS=15
STOP_REASON=converged_with_user_approval
P0=0 P1=6 P2=0
VERDICT=CONDITIONAL
HAS_ADVISORIES=false
PACKETS_CLEAN=[005, 006, 007, 008, 010]
PACKETS_CONDITIONAL=[009, 011, 012, 013]
REMEDIATION_LANES=4
```

**Generated**: 2026-04-09T04:50:00Z
**Reviewer backend**: cli-codex gpt-5.4 high fast (orchestrator: Claude Opus 4.6 1M)
**Session id**: 2026-04-09T03:59:45Z
