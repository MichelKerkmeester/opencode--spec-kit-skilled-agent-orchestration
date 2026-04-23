# 026 Cross-Phase Research Synthesis

## Summary
- Total unique findings: 28
- By severity: P0=9, P1=16, P2=3
- Phases contributing: 10/10
- Cross-cutting themes: 5

## Cross-Cutting Themes

### Operational Proof Trails Implementation
- Severity: P0
- Contributing phases: 001, 003, 005, 006, 008, 010
- Underlying issue: major fixes are landing faster than live acceptance reruns, smoke matrices, and wrapper-level release proofs, so packet summaries overstate readiness.
- Architectural fix: make live acceptance evidence a promotion prerequisite for scan, index, routing, executor, and wrapper release claims.

### Documentation And Status Surfaces Drift From Runtime Truth
- Severity: P1
- Contributing phases: 001, 002, 004, 005, 007, 009
- Underlying issue: packet specs, implementation summaries, quick references, and runtime READMEs describe contracts that no longer match shipped behavior.
- Architectural fix: generate or validate operator-facing docs from one runtime-truth source and fail packet completion when status surfaces drift.

### Cross-Runtime Parity Remains Uneven
- Severity: P1
- Contributing phases: 001, 007, 008, 009
- Underlying issue: Codex, Copilot, Gemini, and CLI executor paths still disagree on readiness, wrapper wiring, lifecycle names, and startup context shape.
- Architectural fix: centralize parity contracts in shared detection, startup, and wrapper adapters with one smoke matrix that gates promotion.

### Concurrency And Freshness Guards Rely On Partial Contracts
- Severity: P0
- Contributing phases: 001, 002, 003, 010
- Underlying issue: lock scope, staged persistence, and transactional bypass protections remain split across code paths and are not fully covered by routed or scoped regressions.
- Architectural fix: move critical write preparation under lock, collapse scan and ensure-ready persistence into one path, and replace boolean bypasses with harder internal contracts.

### Deep-Loop Governance Is Not Self-Enforcing
- Severity: P0
- Contributing phases: 004, 007, 008
- Underlying issue: the deep-research and deep-review workflows advertise strict governance, validation, and completion semantics that the automation does not consistently enforce.
- Architectural fix: unify artifact roots, require validation hooks inside the workflow, and block completion or retry flows on missing proof artifacts.

## Per-Phase Summaries

### 001 Research And Baseline
- The archived master synthesis is directionally useful but stale enough to mis-sequence current work if treated as the live blocker map.
- The new center of risk is operational acceptance for indexing, scans, hook parity, and routing telemetry rather than missing design substrate.
- Lower-severity drift remains in continuity framing, trust-axis narrative updates, and how research convergence is described versus operational completion.

### 002 Continuity Memory Runtime
- The phase contains a live P0 data-integrity defect: routed full-auto saves can lose earlier writes because canonical merge preparation happens before the folder lock.
- Resume behavior and resume-facing docs no longer agree on precedence, archive fallback, or parent-handover traversal.
- Save concurrency protection is still process-local and under-tested, and packet-local traceability has drifted through stale paths and numbering.

### 003 Code Graph Package
- The highest-risk defect is still the manual code_graph_scan persistence path, which can mark broken files fresh after a failed write.
- Runtime trust metadata and public schemas drift from the handler contract, especially around parser provenance, unionMode, and seed shapes.
- Performance and maintenance debt remains in selective reindex behavior, debounce scoping, and post-dedup cleanup coverage.

### 004 Agent Governance And Commands
- Child-phase deep-research runs still split artifacts across two roots, so one run can span both phase-local and packet-root research directories.
- Runtime and command documentation drifts across Codex agent extensions, invocation syntax, convergence math, and stale README inventories.
- Governance rules for markdown validation are stronger in policy than in what the workflow actually enforces.

### 005 Release Cleanup Playbooks
- The manual-testing release contract is still contradictory because the root playbook forbids `UNAUTOMATABLE` while the runner and packet evidence depend on it.
- Packet-local release evidence is stale: some blockers no longer reproduce, counts disagree, and artifact roots still point at retired packet paths.
- The wrapper lacks one authoritative post-remediation release gate that proves playbook policy, packet docs, and runner output still agree.

### 006 Search Routing Advisor
- The top P0 defect is decision freezing before graph conflict penalties are applied, which can leave conflicting skills marked as passing.
- The live search path does not fully honor the adaptive-fusion contract and still hides continuity behavior behind internal routing knobs.
- Hook lifecycle names in the packet docs are also stale relative to the tested runtime contract.

### 007 Deep Review Remediation
- A real P0 blocker remains live in the 005-006 campaign: CF-108 still reproduces and the fix requires historical packet authority outside the prior worker scope.
- Multiple remediation packets are effectively shipped but still advertised as draft, spec-ready, or zero-progress in parent status surfaces.
- Completion governance also remains soft: some flows can auto-complete without explicit proof and `/complete` still misroutes the documented debug escalation.

### 008 Runtime Executor Hardening
- Non-native CLI executor runs are still fail-by-contract because executor metadata is validated before the workflow writes it and timeout or crash helpers are not wired.
- Permission posture and wrapper hardening remain under-proven, especially for sandbox controls and Copilot large-prompt execution.
- Runtime evidence is still too unit-heavy for the failure paths that the packet claims to have hardened.

### 009 Hook Daemon Parity
- Parity gaps have shifted from the advisor core into readiness detection, wrapper activation, lifecycle naming, and startup-surface consistency.
- Codex can look live too easily, Copilot wrapper parity is still reverted, and Gemini docs still lag the checked-in hook surface.
- Lower-severity drift remains in generic hook-based readiness heuristics, startup-shaping parity, and daemon availability reporting.

### 010 Memory Indexer Lineage And Concurrency Fix
- No new P0 defect was confirmed in the packet itself, but the live acceptance rerun remains unexecuted, so operational closure is incomplete.
- The main P1 hardening gap is that `fromScan` is still a soft internal boolean contract rather than a structurally harder API shape.
- Direct regressions are still missing for null canonical-path fallback and scoped fromScan behavior.

## Master Findings Table (P0 + P1)

| ID | Severity | Phase(s) | Category | Summary | Evidence | Recommended Fix |
| --- | --- | --- | --- | --- | --- | --- |
| CF-001 | P0 | 001 | architecture | Archived roadmap and convergence labels are stale enough to mis-sequence follow-on work. | 001 iter-01; archived dashboard; 001 iter-09 | Rebuild the root state model around shipped, reopened, and still-open work, and split research convergence from operational acceptance. |
| CF-002 | P0 | 001,010 | correctness | Scan and index acceptance is still open even after the core design fixes landed. | 001 iter-04/07; 010 iter-09; 010 verification notes | Rerun live acceptance in a capable runtime and gate readiness claims on recorded proof. |
| CF-003 | P1 | 001,006 | performance | Search-routing quality is still supported mostly by predictive or observe-only telemetry. | 001 iter-05; 006 iter-07/09; 006 phase-007 summary | Finish live telemetry capture and make routing-efficacy claims depend on live evidence. |
| CF-004 | P1 | 001,007,009 | correctness | Copilot parity is still incomplete because wrapper/schema reapply work remains reverted and the backlog is stale. | 001 iter-06; 007 iter-08; 009 iter-03 | Reapply the Copilot wrapper work and rebuild the 007 backlog from live 009 state. |
| CF-005 | P0 | 002 | correctness | Routed full-auto saves can lose writes because merge preparation happens before the folder lock. | 002 iter-05; atomic-index-memory; memory-save handler | Move canonical merge preparation under lock or recompute it inside the locked section. |
| CF-006 | P1 | 002 | correctness | Resume code, tests, and docs no longer agree on precedence, archive fallback, or parent handover. | 002 iter-02/03/04; resume-ladder; memory-context | Choose one resume contract and update runtime, tests, and Gate D/E docs together. |
| CF-007 | P1 | 002,010 | architecture | Save and index concurrency protections still rely on process-local or soft contracts and missing regressions. | 002 iter-06/07; 010 iter-08/09; mutex and types code | Harden save/index contracts and add routed plus scoped regression coverage. |
| CF-009 | P0 | 001,003 | correctness | Manual `code_graph_scan` still bypasses staged persistence and can mark broken files fresh. | 001 iter-07; 003 iter-01; ensure-ready; scan handler | Force manual scans and inline refreshes through one staged persistence helper. |
| CF-010 | P1 | 001,003 | correctness | Code-graph trust metadata is inconsistent across query, context, startup, and docs. | 001 iter-02; 003 iter-06; query/readiness/shared-payload | Route all trust metadata through one provenance mapping layer. |
| CF-011 | P1 | 003 | architecture | Code-graph schemas lag the handler contract, making runtime features unreachable through validated inputs. | 003 iter-02/03; tool input schemas; tool definitions | Bring schemas into parity with handlers or intentionally narrow the handlers. |
| CF-012 | P1 | 003 | performance | Selective code-graph refresh still walks too much and debounce reuse is under-scoped. | 003 iter-05; ensure-ready; structural-indexer | Add a direct stale-file refresh path and key debounce entries by root plus options. |
| CF-014 | P0 | 004 | architecture | Child-phase deep-research runs still split artifacts across phase-local and packet-root research paths. | 004 iter-06/07; state_format; YAML; path resolver | Choose one artifact-root contract and route prompts, state, and synthesis through it. |
| CF-015 | P1 | 004 | docs | Agent-governance docs drift across Codex extensions, mode syntax, convergence math, and stale README inventories. | 004 iter-01/04/05/10; Codex agent tables | Regenerate runtime-facing docs from one authoritative contract. |
| CF-016 | P1 | 004 | architecture | Deep-research governance rules are stronger in policy than in workflow enforcement. | 004 iter-08; AGENTS; system-spec-kit; deep-research YAML | Add workflow validation hooks or codify a narrow research-specific exemption. |
| CF-017 | P0 | 005 | correctness | The release-cleanup playbook forbids `UNAUTOMATABLE`, but the runner and packet evidence depend on it. | 005 iter-06; playbook; runner; Phase 015 tasks | Normalize the result-class contract before treating the wrapper as release-ready. |
| CF-018 | P1 | 005 | docs | Release-cleanup evidence is stale across validation status, former blockers, artifact roots, and scenario counts. | 005 iter-02/04/05/07/08 | Re-run the wrapper-level sweep and rewrite packet docs from live runner output. |
| CF-019 | P0 | 006 | correctness | Skill-advisor pass/fail freezes before graph conflict penalties are applied. | 006 iter-06; skill_advisor.py threshold logic | Recompute threshold pass/fail after all recommendation mutators complete. |
| CF-020 | P1 | 006 | correctness | The live search pipeline drifts from the adaptive-fusion contract and still hides critical routing behavior. | 006 iter-01/02/03/04; hybrid-search; adaptive-fusion | Make classifier, fusion, calibration, and rerank behavior follow one public contract. |
| CF-021 | P1 | 006,009 | docs | Hook lifecycle naming still differs across routing docs, parity docs, implementation summaries, and tests. | 006 iter-08; 009 iter-05; hook_system; packet summaries | Freeze one hook vocabulary and update all docs and fixtures from it. |
| CF-022 | P0 | 007 | correctness | The 005-006 campaign still has a live P0 blocker because CF-108 reproduces and needs historical packet authority. | 007 iter-06; 005-006 child checklist lines 59/66 | Open a write-authorized follow-up or ADR-defer the blocker explicitly. |
| CF-023 | P1 | 007 | docs | Remediation status surfaces are stale against shipped work and current 009 truth. | 007 iter-02/04/07/08; 009 parent spec | Rebuild the 007 ledger from live child state and reconcile 007 with 009 parent status. |
| CF-024 | P1 | 007 | correctness | Completion governance still allows false completion and false routing. | 007 iter-09; collect-session-data; complete_confirm YAML | Require explicit completion proof and align `/complete` routing with documented debug escalation. |
| CF-025 | P0 | 008 | correctness | Non-native CLI executor runs are still fail-by-contract and failure events are not wired into live dispatch. | 008 iter-01/05/10; prompt pack; validator; YAML | Write executor metadata earlier and emit typed timeout or failure events before validation. |
| CF-026 | P1 | 008 | security | CLI executor hardening is incomplete because permission controls, wrapper behavior, and failure-path proof are still inconsistent. | 008 iter-02/03/08/09; executor-config; YAML | Either make permission controls real or remove them from the public contract, then add live smoke coverage. |
| CF-027 | P1 | 009 | architecture | Runtime readiness detection and operator guidance are still inconsistent across Codex, Copilot, Gemini, and daemon status surfaces. | 009 iter-02/04/05/06/07; codex-hook-policy | Tighten readiness detection and normalize startup and status surfaces around documented prerequisites. |

P2 findings summary:
- `CF-008` (`002`): packet-local continuity traceability still drifts through stale research pointers and flattened numbering.
- `CF-013` (`003`): code-graph cleanup debt remains in dangling-edge reconciliation and post-migration docs or regression coverage.
- `CF-028` (`010`): memory-indexer hardening still lacks direct regressions for null canonical fallback and scoped `fromScan` flows.

## Remediation Roadmap

### Bucket 1: Integrity And Concurrency Closure
- Scope: close the save race, harden save and index contracts, unify staged scan persistence, and finish the blocked live acceptance reruns.
- Dependencies: `CF-002`, `CF-005`, `CF-007`, `CF-009`, `CF-028`
- Risk: high, because these are data-integrity and freshness-trust issues that can invalidate later packet claims.
- Estimated LOC: 250-450

### Bucket 2: Routing And Decision Fidelity
- Scope: fix threshold-freeze ordering, align search pipeline behavior with adaptive fusion, and replace predictive-only routing claims with live measurement.
- Dependencies: `CF-003`, `CF-019`, `CF-020`, `CF-021`
- Risk: high, because bad routing and false pass states can poison downstream tool and skill selection.
- Estimated LOC: 220-380

### Bucket 3: Deep-Loop Runtime Hardening
- Scope: unify child-phase artifact roots, enforce workflow validation, wire executor failure semantics, and harden permission and wrapper behavior.
- Dependencies: `CF-014`, `CF-016`, `CF-025`, `CF-026`
- Risk: high, because workflow-state corruption and fail-by-contract executor behavior block reliable research automation.
- Estimated LOC: 300-520

### Bucket 4: Hook Parity And Readiness Normalization
- Scope: reapply Copilot parity work, tighten runtime readiness detection, normalize lifecycle naming, and align startup or daemon status surfaces.
- Dependencies: `CF-004`, `CF-021`, `CF-023`, `CF-027`
- Risk: medium-high, because operator trust and cross-runtime rollout decisions depend on these signals.
- Estimated LOC: 180-320

### Bucket 5: Documentation And Status Reconciliation
- Scope: refresh the root roadmap, normalize runtime-facing governance docs, reconcile release-cleanup evidence, and require explicit completion proof for status promotion.
- Dependencies: `CF-001`, `CF-006`, `CF-015`, `CF-017`, `CF-018`, `CF-022`, `CF-024`
- Risk: medium-high, because stale docs and status surfaces are hiding or reintroducing real blockers.
- Estimated LOC: 220-420

## Recommended Sub-Phase Scope

- Short-name: `integrity-parity-closure`
- Level: 3
- Spec summary: This sub-phase should consolidate the still-live cross-packet blockers that keep 026 from having trustworthy runtime, routing, and remediation status. Its core job is to close the P0 integrity defects, convert the top P1 parity and governance drifts into executable contracts, and re-run the live proofs needed to retire stale readiness claims. The scope should explicitly join scan or index integrity, deep-loop runtime hardening, hook parity normalization, and packet-status reconciliation so the follow-on work does not split operational truth across multiple partial packets. The sub-phase should treat live evidence as the promotion gate for every finding it closes.
- Tasks: `CF-002`, `CF-004`, `CF-005`, `CF-007`, `CF-009`, `CF-014`, `CF-017`, `CF-019`, `CF-022`, `CF-025`, `CF-003`, `CF-020`, `CF-021`, `CF-023`, `CF-024`, `CF-026`, `CF-027`
- Success criteria: every P0 above is either fixed with passing live verification or explicitly ADR-deferred with owner and rationale; top P1 parity and governance findings have one authoritative contract surface; wrapper, routing, scan, and executor claims are backed by current live evidence; 007 and 009 status surfaces agree with packet reality.
- Out-of-scope items: broad P2 cleanup, historical archive beautification beyond what is needed to unblock live work, new product features, and speculative refactors unrelated to the finding IDs above.
