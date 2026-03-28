---
title: Deep Research Strategy - Review Logic Improvements
description: Runtime strategy tracking research progress on improving sk-deep-research review mode logic
---

# Deep Research Strategy - Session Tracking

<!-- ANCHOR:overview -->
## 1. Overview

### Purpose
Track research progress on improving the review logic in sk-deep-research. Covers canonical source-of-truth, complexity reduction, convergence validation, cross-reference protocols, report quality, agent architecture, and integration patterns.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. Topic
How to further improve the review logic in sk-deep-research and related commands/agents. Focus areas: (1) canonical source-of-truth problem for review mode definitions, (2) reducing conceptual complexity while maintaining rigor, (3) empirical validation of convergence thresholds, (4) cross-reference protocol improvements, (5) review report quality and actionability, (6) agent architecture improvements for @deep-review, (7) integration with existing @review agent and sk-code--review skill.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. Key Questions (remaining)
- [x] Q1: How can we establish a single canonical source-of-truth for review mode definitions (dimensions, verdicts, target types) and auto-propagate changes to YAML, README, agent docs, and playbooks?
- [x] Q2: What is the minimum viable set of review dimensions and scoring concepts that preserves audit rigor while reducing cognitive load from the current 7+5+4+5+6 taxonomy?
- [x] Q3: What empirical data or simulation approach can validate the convergence thresholds (newFindingsRatio, P0 override, dimension coverage) proposed in iteration-002 of the prior research?
- [x] Q4: How should cross-reference verification protocols be elevated from appendix-level documentation to first-class, machine-verifiable checks in the review loop?
- [x] Q5: What specific improvements to review-report.md structure and content would make findings more actionable for downstream /spec_kit:plan remediation?
- [x] Q6: What architectural changes to @deep-review would improve its effectiveness — scope of read-only vs writable boundaries, tool budget, dispatch template, adversarial self-check design?
- [x] Q7: How should @deep-review integrate with the existing @review agent and sk-code--review skill to avoid duplication while leveraging complementary strengths?

---

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. Non-Goals
- Reimplementing the entire deep research loop from scratch
- Changing the fundamental LEAF agent dispatch architecture
- Modifying the core JSONL state format
- Building a GUI or web interface for review mode
- Addressing research mode (only review mode improvements)

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. Stop Conditions
- All 7 key questions answered with actionable recommendations
- Convergence detected (newInfoRatio < 0.05 across rolling window)
- 10 iterations reached
- All improvement areas have concrete, implementable proposals

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. Answered Questions
- Q1 (partial): Mapping complete. Review-mode definitions are scattered across review YAML workflows, deep-review agent docs, command docs, quick reference, README, changelog, and derivative reference/playbook files. Recommended direction is a neutral contract manifest plus generated downstream artifacts with verification.
- Q1 (answered): The canonical source should be a neutral review-mode contract manifest owned by `sk-deep-research`, with stable IDs for target types, dimensions, severities, verdicts, guards, convergence rules, cross-reference protocols, report sections, and JSONL fields. Existing human-oriented files should stay mixed authored/generated with explicit generated markers, while CI/pre-commit enforces render parity, marker integrity, and duplicate-literal linting.
- Q2 (answered): The minimum viable operator model is 4 review dimensions (`correctness`, `security`, `traceability`, `maintainability`), 3 binary gates (`evidence`, `scope`, `coverage`), 3 verdicts (`FAIL`, `CONDITIONAL`, `PASS`), unchanged `P0/P1/P2` severities, and cross-reference protocols demoted from top-level taxonomy to tagged checks under traceability. `PASS WITH NOTES` should become PASS plus advisory metadata, and numeric composite score should become reporting-only telemetry rather than the release gate.
- Q3 (answered): The right validation method is deterministic replay over completed review JSONL traces, not threshold guessing in the abstract. Replaying specs `012` and `013` shows the 7 -> 4 dimension collapse causes an early STOP regression unless coverage only votes stop after one post-coverage stabilization pass and stuck/no-progress is decoupled from rolling convergence. Recommended calibration: keep `rollingStopThreshold = 0.08`, add `noProgressThreshold = 0.05`, and require `coverageAge >= 1` before the coverage signal can vote STOP.
- Q4 (answered): Cross-reference verification should become a typed `traceabilityChecks` contract with stable protocol IDs, applicability rules, pass/partial/fail/blocked semantics, and per-iteration JSONL results. `spec_code` and `checklist_evidence` should be default required protocols, while `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability` should be overlays that can become gating only for matching target types.
- Q5 (answered): `review-report.md` should be reorganized as a planner-facing remediation packet, not only an audit summary. Keep a concise decision layer, move a normalized finding registry and remediation workstreams near the top, add `Spec Seed` and `Plan Seed` sections that mirror the existing system-spec-kit templates, and embed one canonical `Planning Packet` JSON block so `/spec_kit:plan` can consume a stable machine-readable handoff instead of scraping prose.
- Q6 (answered): `@deep-review` should keep review targets read-only but tighten machine-enforced writes to a scratch-only allowlist, shift cumulative JSONL/strategy mutation and P0/P1 adjudication toward the orchestrator, replace the universal 9-12 budget with explicit `scan | verify | adjudicate` profiles, and enrich dispatch with contested findings, reviewed-file coverage, runtime capability metadata, and output-schema versioning. Cross-runtime body text is already closely aligned, but capability metadata still drifts (notably Codex lineage and Gemini memory-tool declaration), so parity checks need to validate front matter as well as prose.
- Q7 (answered): `@review` and `@deep-review` should remain separate execution profiles, but they should share one baseline `review-core` contract owned by `sk-code--review` (or a generated derivative of the canonical manifest from Q1). Reuse must happen through shared doctrine plus orchestrator-mediated seed/calibration packets, not direct nested agent invocation. `@review` should keep standalone UX and gate adapters, while `@deep-review` should own iterative state, convergence, and traceability/adjudication extensions.

---

<!-- /ANCHOR:answered-questions -->
<!-- ANCHOR:what-worked -->
## 7. What Worked
- Targeted `rg` passes over the review YAMLs, agent docs, quick reference, README, and scratch playbook files quickly exposed both the canonical runtime copies and the derivative drift points.
- Scratch playbook artifacts were high-value because they recorded concrete mismatches, not just abstract concerns about "documentation drift."
- Looking at `system-spec-kit` template composition patterns gave an in-repo precedent for generated operational artifacts instead of ad hoc manual sync.
- Inspecting `system-spec-kit` generated-file banners and `compose.sh --verify` behavior turned the manifest recommendation into a concrete ownership and validation model.
- Comparing the current review taxonomy against SonarQube, Semgrep, Qlty, and GitHub review/check models made the simplification principle clearer: keep issue concerns compact, keep severity separate, and keep gates binary.
- Replaying actual review JSONL traces from specs `012` and `013` made the convergence problem concrete much faster than hypothesizing about thresholds in isolation.
- Comparing the same runs under 7-dimension versus 4-dimension coverage accounting isolated the real regression source: coverage timing, not rolling-threshold math alone.
- Separating cross-reference work into protocol registry, result envelope, and gate policy clarified what must live in the canonical review contract versus in target-specific overlays.
- Comparing the review synthesis contract directly against the `spec-core` and `plan` templates exposed the missing handoff layer much faster than only reading review artifacts in isolation.
- Using one real `review-report.md` plus its corresponding `plan.md` made the planning gap concrete: remediation prose exists, but a normalized plan seed does not.
- Separating runtime front matter from shared agent body text made the Q6 architecture gaps much easier to see; the main inconsistencies are in capability declarations and write boundaries, not the markdown instructions themselves.
- Comparing `@deep-review` with `@deep-research` clarified that review mode should specialize as an evidence/adjudication producer rather than inheriting all of research mode's broader writing and discovery behavior.
- Comparing `@review`, `@deep-review`, and the always-loaded `sk-code--review` quick reference made the real integration seam obvious: doctrine is shared, but execution-mode UX and state handling are not.
- Checking the quick reference instead of only the agent docs exposed a concrete integration blocker: the baseline review skill still carries a `P0-P3` ladder and user-interaction steps that do not match the autonomous deep-review loop.

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. What Failed
- CocoIndex semantic search did not return useful results for this markdown-heavy contract-mapping task.
- Broad repo-wide grep was too noisy until constrained to the review-mode file set and the known derivative docs.
- Human shorthand references to `compose.sh` paths were occasionally imprecise; reading the actual script path was necessary before locking the workflow design.
- Code Climate itself was not a great current comparison source because its docs surface has shifted toward Qlty, so Qlty provided more usable current reference material.
- Threshold-only tuning was a dead end for Q3; once the simplified model hits 4/4 coverage, the unchanged coverage vote dominates too early.
- CocoIndex remained low-yield for the Q4 cross-reference redesign as well because the relevant logic is still concentrated in markdown/YAML contract docs rather than code paths.
- The current 11-section scorecard layout is a dead end for remediation handoff because it forces `/spec_kit:plan` to infer problem framing, workstreams, and verification from prose.
- Body-only diffs between runtime agent files were less useful than expected for Q6 because they hide the real drift in tool declarations, permission surfaces, and generation lineage.
- Reading only agent docs would have missed the baseline-skill drift; the integration problem is split across agents and the skill's always-loaded quick reference.
- Treating all guidance inside `sk-code--review` as reusable doctrine is a dead end because some of it is intentionally interactive single-pass UX, not loop-safe autonomous behavior.

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. Exhausted Approaches (do not retry)
[None yet]

---

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. Ruled Out Directions
- Full-file generation for README/agent/playbook docs as the default propagation model; mixed authored/generated blocks fit the repo's current documentation surfaces better.
- Historical version-history/changelog entries as canonical review-mode contract sources.
- Keeping the current 7 review dimensions as the operator-facing taxonomy.
- Using the numeric composite score as the primary release gate.
- Treating the 6 cross-reference protocols as a peer taxonomy next to dimensions, guards, and verdicts.
- Re-fitting only the rolling threshold while leaving coverage as an immediate stop vote.
- Reusing one shared threshold for both rolling convergence and stuck/no-progress in the simplified model.
- Making all 6 cross-reference protocols universal hard gates for every review target.
- Keeping cross-reference verification as markdown-only prose without structured JSONL state.
- Introducing a separate top-level cross-reference score outside the `traceability` dimension.
- Keeping `review-report.md` as a scorecard plus prose-only remediation section.
- Making `/spec_kit:plan` scrape narrative text instead of consuming a single canonical planner packet.
- Preserving `PASS WITH NOTES` as a first-class planner verdict after Q2 reduced verdicts to `FAIL | CONDITIONAL | PASS` plus advisory metadata.
- Granting `@deep-review` broader write access to reviewed files instead of tightening the scratch boundary.
- Keeping one universal 9-12 review budget regardless of whether the iteration is doing scan, verification, or adjudication work.
- Relying on same-iteration Hunter/Skeptic/Referee as the only durable validation boundary for new P0/P1 findings.
- Treating cross-runtime consistency as solved because the shared body prose matches while front matter and tool declarations still diverge.
- Making `@deep-review` call `@review` directly, or making `@review` call `@deep-review`, as the primary reuse mechanism.
- Maintaining a second independent rubric/severity contract inside `@deep-review` after introducing a shared review-core baseline.
- Reusing interactive single-pass instructions such as "ask the user what to do next" inside autonomous deep-review iterations.

---

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. Next Focus
Synthesis pass: consolidate Q1-Q7 into one implementation roadmap covering canonical contract ownership, generated artifacts, migration sequencing, and the minimal change set across YAML, agents, skills, and review outputs.

---

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 12. Known Context
Prior research (v1, archived) established:
- Review mode reuses the deep research loop "spine" with 2 components as-is, 12 adapted, 1 replaced
- Convergence uses severity-weighted newFindingsRatio + 5 review guards + P0 override
- 5 target types, 7 review dimensions, 6 cross-reference protocols
- @deep-review agent (separate from @review) with read-only/write-only boundary
- 11-section review-report.md with 4 verdicts (PASS, CONDITIONAL, PASS WITH NOTES, FAIL)
- Implementation used :review suffixes on /spec_kit:deep-research (not separate /spec_kit:deep-review)
- Recurring documentation drift between YAML runtime definitions and docs
- Conceptual complexity flagged as cognitive overhead risk

GPT-5.4 review summary (this session):
- Canonical drift is the #1 weakness — docs repeatedly lag behind YAML
- 7+5+4+5+6 taxonomy is powerful but cognitively heavy
- Convergence thresholds never empirically validated
- Packet structure gap: missing plan/tasks/checklist despite having implementation evidence

Iteration 3 added:
- Best simplification target is 4 dimensions: correctness, security, traceability, maintainability
- Quality guards should collapse to 3 binary gates: evidence, scope, coverage
- `PASS WITH NOTES` should become PASS plus advisory metadata, not a fourth verdict
- Cross-reference protocols should remain as validation methods, not top-level taxonomy
- Numeric composite score should become reporting-only telemetry instead of gate logic

Iteration 4 added:
- Real review traces from specs `012` and `013` are sufficient to build a deterministic replay harness for convergence validation
- The 7 -> 4 dimension collapse introduces a real early-stop regression if coverage still votes STOP immediately on first `1.0` coverage
- The smallest safe calibration is structural: coverage should require one post-coverage stabilization pass before voting STOP
- `rollingStopThreshold = 0.08` still looks reasonable, but stuck/no-progress should use its own lower threshold (`0.05`) rather than sharing the broader convergence cutoff

Iteration 5 added:
- Cross-reference verification should be represented as typed `traceabilityChecks` results with stable protocol IDs, applicability metadata, and machine-verifiable pass/partial/fail/blocked semantics
- `spec_code` and `checklist_evidence` are the default required protocols; the other 4 protocols are overlays that become required only for matching target types or artifact sets
- JSONL should hold the per-iteration source of truth, strategy should hold cumulative latest-status/open-risk summaries, and the dashboard should remain derived-only
- Required protocol `fail` or `blocked` should veto convergence, while `partial` should keep the loop in CONTINUE until unresolved claims are cleared or explicitly bounded

Iteration 6 added:
- `review-report.md` should be reorganized around a decision layer plus planner-facing remediation packet, with audit material moved later instead of dominating the top half
- The missing handoff is a normalized `Planning Packet`, not more remediation prose: the report should expose `problemStatement`, `purpose`, scope, active findings, workstreams, verification, dependencies, and open questions
- `Spec Seed` and `Plan Seed` sections should mirror the existing `spec-core` and `plan` templates so `/spec_kit:plan` can translate findings into spec/plan artifacts with less inference
- One canonical machine-readable JSON block is the simplest parse target; relying on narrative remediation sections or score tables would keep the planner contract fragile

Iteration 7 added:
- `@deep-review` should become a stricter evidence packet author: review targets remain read-only, while machine-enforced writes should shrink to a scratch-only allowlist and cumulative state mutation should move closer to the orchestrator
- The current universal 9-12 budget is too blunt for review mode; the loop should dispatch explicit `scan`, `verify`, and `adjudicate` budget profiles based on iteration type
- Dispatch context should carry contested findings, reviewed-file coverage, exhausted approaches, runtime capability profile, writable-path contract, and expected output schema rather than only broad prose instructions
- Hunter/Skeptic/Referee should emit typed claim-validation packets for new P0/P1, with immediate post-iteration orchestrator adjudication before convergence uses those findings
- Cross-runtime body text is already close, but capability metadata still drifts: OpenCode permissions are broad, Gemini under-declares memory tooling, and Codex points at a different generation lineage marker

Iteration 8 added:
- `@review` and `@deep-review` should share doctrine through a common `review-core` contract, but remain separate execution profiles: single-pass baseline review versus iterative loop review
- Direct nested invocation between the two reviewers is the wrong reuse model because both agents are LEAF-only; the orchestrator should mediate optional seed/calibration packet exchange instead
- `sk-code--review` is the right owner for shared review doctrine, but it must split reusable baseline rules from interactive single-pass UX before deep review can consume it cleanly
- There is already a concrete integration drift in the baseline layer: the always-loaded quick reference still documents `P0-P3` severities and "ask the user what to do next", while both review agents operate on `P0/P1/P2` and autonomous loop execution

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. Research Boundaries
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: false
- research/research.md ownership: workflow-owned canonical synthesis output
- Current segment: 1
- Started: 2026-03-24T16:37:00Z
<!-- /ANCHOR:research-boundaries -->
