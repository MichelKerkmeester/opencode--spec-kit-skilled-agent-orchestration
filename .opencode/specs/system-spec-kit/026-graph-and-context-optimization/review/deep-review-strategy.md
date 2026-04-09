---
title: Deep Review Strategy — 026 Graph and Context Optimization
description: Runtime strategy file tracking deep review progress across dimensions for parent packet 026 and all child phases (001-013 + sub-phases under 001/003).
---

# Deep Review Strategy — 026 Graph and Context Optimization

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Deep review session for the full 026-graph-and-context-optimization packet family. Target = parent packet + 13 top-level child phases + 14 sub-phases (6 under 001, 8 under 003). Primary focus: the 9 packets shipped 2026-04-09 in commit `33823d006` (005-013). Secondary context: the research train (001), previously-shipped continuity work (002), memory-quality remediation (003), and agent guardrails (004).

Reviewer backend: **cli-codex gpt-5.4 high fast** (user explicit; substituted for Task @deep-review because that LEAF agent only supports sonnet/opus/haiku).
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:topic -->
## 2. TOPIC

Review all work done under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` (all phases). Verify that shipped packets align with research recommendations R1–R10 (from `001-research-graph-context-systems/research/recommendations.md`), that the 9 newly-shipped packets (005–013) are honest about what was delivered, that the checklists are verified with real evidence, that no duplicate type definitions exist in `shared-payload.ts`, that tests genuinely exercise acceptance criteria, and that the 006-research-memory-redundancy classification (no change / assumption alignment) is honored.
<!-- /ANCHOR:topic -->

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness — Logic errors, off-by-one, wrong return types, broken invariants, acceptance criteria coverage
- [x] D2 Security — Injection, auth bypass, secrets exposure, unsafe deserialization, trust-boundary violations
- [x] D3 Traceability — Spec/code alignment, checklist evidence, cross-reference integrity, R1-R10 research citation coverage
- [x] D4 Maintainability — Patterns, clarity, documentation quality, scope discipline, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- NOT reviewing upstream research packets (001's child deep-research iterations 001-006) beyond checking that recommendations.md citations from 005-013 point at real lines.
- NOT auditing memory generator/collector/template runtime (owned by 003/006-memory-duplication-reduction, already shipped in 7f0c0572a). Verify only that 005-013 honor its contract.
- NOT running full benchmark suites or performance profiling (performance is scoped to P2 suggestions only).
- NOT proposing new features — remediation recommendations only.
- NOT modifying reviewed files — review target is READ-ONLY.
<!-- /ANCHOR:non-goals -->

---

<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- 20 iterations reached (hard max, user-set)
- All 4 dimensions covered + P0==0 + P1==0 + quality gates pass + coverage_age≥1 (ideal clean stop)
- Rolling avg newFindingsRatio ≤ 0.08 over last 2 iterations + coverage complete
- 3+ consecutive error iterations (stuck recovery, escalate to operator)
- `.deep-review-pause` sentinel file detected
<!-- /ANCHOR:stop-conditions -->

---

<!-- ANCHOR:completed-dimensions -->
## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | covered with open P1s | 004 | Shipped packets 005-013 were reviewed for correctness; four P1 issues remain across packets 009, 011, 012, and 013, but the D1 coverage sweep is complete. |
| D2 Security | covered with open P1s | 007 | The security sweep confirmed two active P1s in packet 011/bootstrap and packet 012/startup selection, while the compact recovery trust-label follow-up found no additional D2 defect because compaction explicitly rewrites provenance to cached authority before SessionStart replay. |
| D3 Traceability | covered with open P1s | 015 | The traceability sweep completed in 009, the 014 convergence pass confirmed the same four closeout overclaim seams remain distinct, and the 015 synthesis-readiness reread found no missing evidence or defensible downgrade path before `review-report.md` synthesis. Packets 005, 006, 007, and 010 still align with their cited runtime and research evidence, while packets 009, 011, 012, and 013 still retain separate D3 synthesis lanes. |
| D4 Maintainability | covered with no new findings | 011 | The remaining shared seams in `memory-context.ts` and `context-server.ts` stayed localized: the structural-routing nudges are surface-specific adapters rather than drift, overlay `skill_agent` review is not applicable for 005-013, and no new D4-only defect was found beyond the six existing P1s. |
<!-- MACHINE-OWNED: END -->

---

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 6 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2

[Findings tracked in `deep-review-findings-registry.json`. This section is a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

<!-- /ANCHOR:running-findings -->
<!-- ANCHOR:what-worked -->
## 8. WHAT WORKED
- Reading the bootstrap exception path against the 011/012 trust-boundary language was high signal: the shared validator remains strict, but the owner-surface propagation in `session-bootstrap.ts` is where trust promotion reappears.
- Reading the packet-local benchmark runner beside its vitest assertions surfaced a stronger issue than simple wording drift: the pass-rate branch is invariant by construction, so the matrix cannot actually falsify the R8 "no pass-rate loss" gate.
- Comparing packet specs, implementation summaries, runtime code, and focused tests on the same seam was high-signal; the resume-trust gap only became obvious once the mocked test fixture was contrasted with the real `session-resume.ts` payload builder.
- The shared-payload contract itself appears additive and internally consistent in this pass; the main break is propagation through the resume owner rather than duplicate or contradictory type-layering inside `shared-payload.ts`.
- Re-reading packet `012`'s acceptance criteria against the shipped scripts-side corpus quickly separated "gate helper works" from "packet proved live-baseline parity"; the distinction is easy to miss if the implementation summary is taken at face value.
- For packet `009`, pairing the spec's shipped-status requirements with the implementation summary's explicit helper-only limitation exposed the real issue quickly: the helper is honest, but the packet closeout still claims a delivered publication contract that no runtime consumer enforces.
- Comparing `loadMostRecentState()` with the unscoped `session_resume` and SessionStart startup callers was high signal: the fidelity/freshness gate is strict once a candidate is chosen, but the candidate-selection step still trusts "newest project state" as a proxy for current-session continuity.
- Tracing `pendingCompactPrime.payloadContract` back to `compact-inject.ts` was decisive: the compaction writer forcibly rewrites provenance to `producer=hook_cache`, `sourceSurface=compact-cache`, and `trustState=cached` before `session-prime.ts` ever wraps the payload, which ruled out a duplicate compact-path trust-escalation finding.
- This iteration's highest-signal move was comparing checklist evidence lines directly against the tests they cite. That quickly separated real runtime proof from helper-only baseline checks and mock-fed preservation tests.
- The research-side acceptance criteria still line up with the shipped packet intent; the drift is mostly in closeout/checklist evidence that certifies stronger proof than the cited runtime lines provide.
- Spot-checking packets `005`, `006`, `007`, and `010` against both the cited runtime/test lines and their matching R1/R6/R7/R10 recommendation slices was high signal: it confirmed the remaining D3 drift is concentrated in the already-flagged packets rather than being systemic across the whole 005-013 wave.
- Reading D4 through the shared runtime hotspots showed the follow-on change cost is still bounded: `shared-payload.ts` centralizes validation/enrichment, while `session-bootstrap.ts`, `session-resume.ts`, and `session-prime.ts` remain the only seams that would need coordinated remediation for the active P1s.
- The `011`/`012`/`013` implementation summaries still point at the correct runtime owners even where earlier iterations found overclaims, which lowers the risk of future follow-on work drifting into a second implementation home.
- Reviewing `memory-context.ts` against `context-server.ts` confirmed the structural-routing advisories are intentionally split by surface: the handler emits only when graph-backed structural intent is already proven, while the server injects a generic fallback hint only when the response metadata does not already contain one.
- The stabilization reread across packets `009`, `011`, `012`, and `013` was high signal: each packet's limitation language narrowed the owner boundary, but none of it neutralized the already-open overclaim seam, so the six P1s remain cleanly separable going into synthesis.
- Re-reading the packet limitation sections directly against `publication-gate.ts`, `session-bootstrap.ts`, `session-resume.ts`, and `warm-start-variant-runner.ts` was high signal: the docs now define remediation boundaries clearly, but the owner code still leaves the same four traceability seams intact.
- The final convergence reread stayed high signal because it tested the only remaining question that mattered before synthesis: whether any of the four traceability lanes could be merged, downgraded, or retired. Re-reading the current implementation summaries beside their owner files showed they still fail for different reasons, which justifies stopping LEAF iterations rather than churning on the same seams.
- Treating the strategy handoff itself as a falsifiable traceability claim was high signal: a synthesis-readiness reread of the four open packet lanes showed the registry already contains enough stable evidence for report synthesis, and the absence of new contradictions is itself useful convergence evidence.

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 9. WHAT FAILED
- `session_bootstrap` catches `session_resume` failures, reduces the resume branch to `{ error }`, and then attaches graph-derived structural trust to that errored object, so the authoritative resume surface appears live and confirmed even when it never emitted validated trust metadata.
- Packet `013`'s pass-rate gate counts only wrapper-derived fields that every variant always sets, so the benchmark cannot represent the exact failure mode that `REQ-006` claims to guard against.
- Packet `011`'s focused regression coverage stubs a resume payload that already contains `structuralTrust`, so it does not verify whether the shipped `session_resume.ts` path actually emits that trust metadata.
- Packet `011`'s documentation overstates runtime delivery relative to the reviewed code: it claims end-to-end resume preservation while the current resume payload still omits `structuralTrust`.
- Packet `012`'s frozen-corpus evidence validates helper-level gating and additive merge shape, but it does not exercise the real `session_resume`, `session_bootstrap`, or `session-prime` continuity surfaces that the packet treats as proven.
- Packet `009`'s implementation summary documents a helper-only outcome, but the packet remains marked implemented against spec requirements that still demand handler-level publication-output behavior and surfaced exclusion reasons.
- Packet `012`'s scope gate only constrains callers that already provide `specFolder`; startup and unscoped `session_resume` still select the newest project state by file mtime, so another session's cached summary can appear as valid continuity without an active-session proof.
- Packet `012`'s checklist and focused tests still do not give startup-specific evidence for rejecting unrelated recent hook state; this iteration had to prove the compact-path safety from runtime code rather than from the packet's own verification artifacts.
- Packet `011`'s checklist cites a bootstrap-preservation test that injects a pre-shaped resume payload with `structuralTrust`, so the packet's verification artifact certifies a stronger end-to-end preservation claim than the real `session_resume.ts` surface provides.
- Packet `012`'s checklist evidence for CHK-021/030/031 overstates live-baseline and bounded-surface proof by citing helper-only additive comparisons and surface lines that never establish the claimed end-to-end runtime parity.
- Packet `013`'s checklist and closeout still treat an invariant required-field counter as if it were a freshness-sensitive pass-rate gate, so the packet's traceability artifacts certify R8 / REQ-006 more strongly than the runner can actually falsify.
- Packet `009`'s checklist still marks documentation honesty and activation gating as verified even though the packet's own implementation summary says no row-oriented publication handler exists yet, so the D3 failure there is now explicitly narrowed to closeout evidence rather than the helper implementation itself.
- The review packet left overlay `skill_agent` bookkeeping pending longer than the evidence required; the shipped 005-013 scope never touched agent-definition or playbook surfaces, so this cross-reference gap was procedural rather than a product defect.
- The convergence reread did not create any safe merge or downgrade path: packets `009`, `011`, `012`, and `013` still fail on different owner/evidence seams, so synthesis must preserve them as separate remediation lanes rather than collapsing them into one generalized documentation issue.
- The packet limitation sections reduce ambiguity about intended ownership, but they still stop short of retracting the stronger delivery claims in the same closeouts, so another LEAF reread would likely only restate the same four failures.
- This stop-check pass confirmed the review is now synthesis-bound rather than discovery-bound: the evidence is stable, all four dimensions are already covered, and another LEAF iteration would likely only restate the same four traceability failures without changing release guidance.
- The synthesis-readiness reread likewise produced no new contradictions, owner shifts, or retirement path for the active lanes. That is useful for convergence, but it also confirms the remaining work is reporting rather than additional LEAF discovery.

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
[Populated when a review approach has been tried from multiple angles without new findings]

---

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 11. RULED OUT DIRECTIONS
[Populated as iterations rule out hypotheses with evidence]

---

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
**Iteration 16 recommendation (synthesis only):** Stop LEAF review dispatches and move directly into `review-report.md` synthesis. Iteration 015 revalidated the same four packet lanes against the current owner files and still found no defensible merge, downgrade, retirement path, or missing citation that would justify more LEAF discovery. Synthesis should preserve four remediation lanes with conditional-release wording:
- Packet `009`: helper-only publication gate remains honest locally, but the packet closeout still overclaims live publication-output delivery.
- Packet `011`: bootstrap and graph-validator ownership is correct, but the shipped resume/bootstrap split still does not prove the trust-preservation claim the packet certifies.
- Packet `012`: cached-consumer closeout still certifies live-baseline parity and bounded continuity proof more strongly than the reviewed owner surfaces establish.
- Packet `013`: the benchmark runner remains pure and packet-local, but the pass-rate proxy is invariant and therefore cannot prove the R8 gate it is cited to satisfy.
<!-- MACHINE-OWNED: END -->

---

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 13. KNOWN CONTEXT

### Commit lineage
- **33823d006** (2026-04-09): feat(026-graph-context): ship packets 005-013 (R1-R10 runtime closeouts) — 40 files, +2125/-391. Committed by the orchestrator in this session after 9 cli-codex dispatches.
- **072cce66c** (2026-04-08 20:39): chore(026-graph-context): 003-memory-quality 100% closeout + input-normalizer fast-path fix + bundled 026 WIP — pre-session commit containing initial runtime for 005/006/007/010/012 that was later layered on.
- **7f0c0572a**: feat(026-memory-redundancy): flip memory save contract to compact retrieval wrapper — owns the memory-wrapper runtime contract referenced by 005-013's 006-research-memory-redundancy alignment notes.

### Phase map
| Phase | R# | Title | Status | Shipped where |
|---|---|---|---|---|
| 001 | — | Research graph context systems | Complete | prior sessions |
| 001/006 | — | Research memory redundancy (follow-on) | Complete | prior sessions |
| 002 | R2 | Cache-warning hooks (producer-first) | Shipped 2026-04-08 | pre-session |
| 003 | — | Memory quality issues (parent) | Shipped 2026-04-08 | pre-session, own review/ |
| 003/006 | — | Memory duplication reduction (wrapper runtime host) | Shipped | 7f0c0572a |
| 003/008 | — | Input normalizer fastpath fix | Shipped | 072cce66c |
| 004 | — | Agent execution guardrails | Shipped | prior sessions |
| 005 | R1 | Provisional measurement contract | Shipped 2026-04-09 | 33823d006 |
| 006 | R10 | Structural trust axis contract | Shipped 2026-04-09 | 33823d006 |
| 007 | R6 | Detector provenance + regression floor | Shipped 2026-04-09 | 33823d006 |
| 008 | R4 | Graph-first routing nudge | Shipped 2026-04-09 | 33823d006 |
| 009 | R9 | Auditable savings publication contract | Shipped 2026-04-09 | 33823d006 |
| 010 | R7 | FTS capability cascade floor | Shipped 2026-04-09 | 33823d006 |
| 011 | R5 | Graph payload validator + trust preservation | Shipped 2026-04-09 | 33823d006 |
| 012 | R3 | Cached SessionStart consumer (gated) | Shipped 2026-04-09 | 33823d006 |
| 013 | R8 | Warm-start bundle conditional validation | Shipped 2026-04-09 | 33823d006 |

### Shared runtime hotspots (multi-packet overlay)
- `mcp_server/lib/context/shared-payload.ts` — layered by 005 (CertaintyStatus), 006 (StructuralTrust axes), 011 (validator). ~490 lines. **High-risk: verify no duplicate type definitions, consistent exports, additive layering.**
- `mcp_server/handlers/session-bootstrap.ts` — touched by 005/006/011/012/008. **High-risk: verify compositional order, no accidental field overrides.**
- `mcp_server/lib/contracts/README.md` — gained sections from 006/007/009/011. **Medium-risk: verify no rewrites of prior sections.**
- `mcp_server/handlers/session-resume.ts` — touched by 005/012.
- `mcp_server/hooks/claude/session-prime.ts` — touched by 008/012.
- `mcp_server/ENV_REFERENCE.md` — docs for 005/010/013.

### Research citations to spot-check
- R1 (005): recommendations.md lines 5-13
- R2 (002): lines 15-23 (pre-session)
- R3 (012): lines 25-33
- R4 (008): lines 35-43
- R5 (011): lines 45-53
- R6 (007): lines 55-63
- R7 (010): lines 65-73
- R8 (013): lines 75-83
- R9 (009): lines 85-93
- R10 (006): lines 95-103

### 006-Memory-Redundancy classifications (from §3A of that packet's spec.md)
- 005/006/007/008/009/010/011 → "No change"
- 012/013 → "Recommendation/assumption alignment" (upstream artifact described as compact continuity wrapper)
- Wrapper-contract runtime host: 003/006-memory-duplication-reduction (commit 7f0c0572a)

### Verification evidence from shipment
- All 9 packets: typecheck PASS, focused vitest PASS, `validate.sh --strict` PASS
- Per-packet checklist tallies (from codex completion reports): 005=24/24, 006=24/24, 007=24/24, 008=24/24, 009=24/24, 010=24/24, 011=24/24, 012=24/24, 013=25/25
- 013 benchmark matrix: baseline=64/R2=80/R3=68/R4=54/R2+R3+R4=43 cost, pass=28/28 all variants, BUNDLE_DOMINATES=yes
- No leftover `[###-feature-name]` placeholders
- 6 new runtime/test files + 2 new packet artifacts (012 decision-record, 013 scratch benchmark matrix)
<!-- /ANCHOR:known-context -->

---

<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 015 | D3 coverage is complete, and the synthesis-readiness reread again confirmed the same four active traceability gaps remain distinct: packets `005`, `006`, `007`, and `010` aligned cleanly with their cited runtime and recommendation evidence, while packets `009`, `011`, `012`, and `013` still retain separate owner/evidence blockers with no safe merge, downgrade, or retirement path. |
| `checklist_evidence` | core | fail | 015 | Packet `009` joins packets `011`, `012`, and `013` as a checklist-evidence miss: each packet's closeout still cites stronger delivery proof than the reviewed runtime or test lines actually establish, and the synthesis-readiness reread found no corrective citation path. |
| `skill_agent` | overlay | notApplicable | 011 | The shipped `005`-`013` packet scope and the reviewed `memory-context.ts` / `context-server.ts` seams do not touch `.opencode/agent`, `.claude/agents`, `.codex/agents`, feature-catalog, or playbook surfaces, so no overlay agent-contract review target exists in this wave. |
| `agent_cross_runtime` | overlay | notApplicable | — | No agent modifications in 005-013 |
| `feature_catalog_code` | overlay | notApplicable | — | No feature catalog work in 005-013 |
| `playbook_capability` | overlay | notApplicable | — | No testing playbook work in 005-013 |
<!-- MACHINE-OWNED: END -->

---

<!-- /ANCHOR:cross-reference-status -->
<!-- ANCHOR:files-under-review -->
## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
### Shared runtime (multi-packet overlay)
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| mcp_server/lib/context/shared-payload.ts | D1, D2, D3, D4 | 010 | D4 pass found the validator/enricher seam centralized and additive; no new maintainability-only defect beyond the existing cross-surface P1s | reviewed |
| mcp_server/handlers/session-bootstrap.ts | D1, D2, D3, D4 | 015 | P1 active: bootstrap still widens trust on errored resume payloads, and the synthesis-readiness reread confirmed packet `011` / `012` closeouts still cite stronger bootstrap proof than the reviewed runtime establishes; D4 pass confirmed remediation remains localized to this fallback/enrichment seam | finding |
| mcp_server/handlers/session-resume.ts | D1, D2, D3, D4 | 015 | P1 active from D1: `structural-context` section omits `structuralTrust`; P1 active from D2: unscoped cached continuity falls back to the newest project hook state; the synthesis-readiness reread confirmed packets `011` / `012` still overstate what this surface proves; D4 pass found no separate abstraction-sprawl defect | finding |
| mcp_server/hooks/claude/session-prime.ts | D1, D2, D3, D4 | 010 | P1 active from D2 on startup: unscoped cached-summary selection can still surface another session's continuity hint; D3 confirmed packet `012` checklist evidence cites startup lines that do not prove the broader bounded-surface claim; D4 pass found the follow-on cost localized to this reuse seam | finding |
| mcp_server/hooks/claude/hook-state.ts | D2 | 007 | `loadMostRecentState()` selects by newest project-level file mtime only; no session or spec binding exists at this layer | finding |
| mcp_server/hooks/claude/shared.ts | D2 | 007 | `wrapRecoveredCompactPayload()` replays supplied provenance transparently, but the upstream compaction writer now forces `trustState=cached` and `sourceSurface=compact-cache`, so this seam did not add a new D2 defect | reviewed |
| mcp_server/hooks/claude/compact-inject.ts | D2 | 007 | Explicitly rewrites compact recovery provenance to `producer=hook_cache`, `sourceSurface=compact-cache`, and `trustState=cached`; no new D2 finding in this pass | reviewed |
| mcp_server/handlers/memory-context.ts | D4 | 011 | Reviewed shared orchestration seam; query-intent routing, graph-context attachment, and structural-routing metadata remain localized, and no new maintainability-only defect stood up | reviewed |
| mcp_server/handlers/code-graph/query.ts | D1, D2 | 005 | Emission still routes through the shared fail-closed validator; no new D2 finding in this pass | reviewed |
| mcp_server/context-server.ts | D4 | 011 | Reviewed dispatch-side hinting/enrichment seam; the structural nudge helper is a distinct fallback surface rather than drift from `memory-context.ts`, so no new D4 defect was added | reviewed |
| mcp_server/lib/contracts/README.md | D1 | 004 | Packet 009 docs accurately describe the row-level contract, but they do not change the helper-only runtime reality | reviewed |
| mcp_server/ENV_REFERENCE.md | D2 | 005 | Docs keep no-bypass wording for trust and publication contracts; no direct D2 defect found in this pass | reviewed |

### Per-packet runtime (005-013)
| Packet | Runtime files | Test files | Status |
|--------|---------------|------------|--------|
| 005 | shared-payload.ts (additions), session-bootstrap.ts, session-resume.ts, ENV_REFERENCE.md | tests/shared-payload-certainty.vitest.ts | reviewed; D3 spot-check passed for the R1 implementation summary, cited runtime lines, and focused certainty-handler coverage |
| 006 | shared-payload.ts (additions), confidence-scoring.ts, contracts/README.md (add), session-bootstrap.ts (add) | tests/structural-trust-axis.vitest.ts | reviewed; D3 spot-check passed for the R10 implementation summary and additive trust-axis contract evidence |
| 007 | lib/search/evidence-gap-detector.ts, lib/search/deterministic-extractor.ts, lib/contracts/README.md (add) | scripts/tests/detector-regression-floor.vitest.ts.test.ts | reviewed; D3 spot-check passed and the regression-floor boundary remained honest about detector integrity vs outcome proof |
| 008 | context-server.ts, hooks/claude/session-prime.ts (add), session-bootstrap.ts (add), handlers/memory-context.ts | tests/graph-first-routing-nudge.vitest.ts | reviewed; no new D1 defect found in this pass, hook limitation remains explicitly generic |
| 009 | lib/context/publication-gate.ts (NEW), lib/contracts/README.md (add), ENV_REFERENCE.md (add) | tests/publication-gate.vitest.ts | P1 active: helper-only gate remains honest about its current limitation, and the synthesis-readiness reread confirmed the packet closeout still claims implemented publication-output behavior without a live consumer, so the D3 overclaim stays separate from the other owner-surface blockers |
| 010 | handlers/memory-search.ts, lib/search/sqlite-fts.ts, lib/search/README.md | tests/sqlite-fts.vitest.ts (extended), tests/handler-memory-search.vitest.ts (extended) | reviewed; D3 spot-check passed for the R7 lexical-capability implementation summary and forced-degrade evidence |
| 011 | shared-payload.ts (validator additions), handlers/code-graph/query.ts, handlers/session-bootstrap.ts (preservation), lib/contracts/README.md (add) | tests/graph-payload-validator.vitest.ts | P1 active: bootstrap promotes graph-derived trust onto errored resume outputs instead of failing closed, and the synthesis-readiness reread confirmed packet evidence still treats a mock-fed preservation test as proof of end-to-end `session_resume` preservation; D4 pass found the packet still points at the correct owners for follow-on fixes |
| 012 | handlers/session-bootstrap.ts (gated consumer), handlers/session-resume.ts (additive), hooks/claude/session-prime.ts (hints), decision-record.md (NEW) | scripts/tests/session-cached-consumer.vitest.ts.test.ts | P1 active: helper-only corpus overclaims live-baseline proof; D2 authority boundary still includes unscoped newest-state selection; the synthesis-readiness reread confirmed CHK-021/030/031 still cite stronger runtime proof than the reviewed owner surfaces establish; D4 pass found no extra maintainability-only defect beyond the shared-owner coupling already captured |
| 013 | lib/eval/warm-start-variant-runner.ts (NEW), ENV_REFERENCE.md (add), scratch/benchmark-matrix.md (NEW) | scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts (NEW) | P1 active: pass-rate proxy is invariant, so R8 / REQ-006 cannot actually fail on pass loss, and the synthesis-readiness reread confirmed the packet closeout still certifies that proxy as if it were an honest pass-rate gate; D4 pass found the pure runner remains packet-local despite the open correctness issue |

### Packet docs (spec/plan/tasks/checklist/decision-record/implementation-summary) for all 9 packets
Full doc set for 005-013 is in scope. ~54 files (9 packets × 6 docs).
<!-- MACHINE-OWNED: END -->

---

<!-- /ANCHOR:files-under-review -->
<!-- ANCHOR:review-boundaries -->
## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 20
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-04-09T03:59:45Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes (but codex may exceed the wall-clock budget if thinking time is long; orchestrator absorbs that)
- Severity threshold: P2
- Review target type: spec-folder (parent 026 with 27 child/sub-packet folders)
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent]
- Reviewer backend: cli-codex gpt-5.4 high fast (user explicit, substituted for Task @deep-review)
- Started: 2026-04-09T03:59:45Z
<!-- MACHINE-OWNED: END -->
<!-- /ANCHOR:review-boundaries -->
