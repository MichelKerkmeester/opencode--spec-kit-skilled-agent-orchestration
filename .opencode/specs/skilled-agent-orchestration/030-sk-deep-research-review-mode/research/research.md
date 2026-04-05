---
title: "Research: Improving Review Logic in [03--commands-and-skills/030-sk-deep-research-review-mode/research]"
description: "This research investigated 7 key questions about improving the review logic in sk-deep-research and related commands/agents. Across 8 iterations using GPT-5.4 agents, the resear..."
trigger_phrases:
  - "research"
  - "improving"
  - "review"
  - "logic"
  - "030"
  - "deep"
importance_tier: "normal"
contextType: "research"
---
# Research: Improving Review Logic in sk-deep-research (v2)

> **Note**: This replaces the v1 research that designed review mode's initial architecture. V1 findings are archived in `scratch/archive-research-v1/`. This v2 research investigates how to further improve the now-implemented review logic.

## 1. Executive Summary

This research investigated 7 key questions about improving the review logic in `sk-deep-research` and related commands/agents. Across 8 iterations using GPT-5.4 agents, the research produced concrete, implementable recommendations for each area. The core finding is that review mode needs three structural changes: a canonical contract manifest to eliminate documentation drift, a simplified taxonomy to reduce cognitive overhead, and stronger machine-verifiable boundaries for cross-reference checks, convergence, and downstream planning handoff.

**Key recommendations:**
- **Canonical manifest** (`review_mode_contract.yaml`) with generated-block propagation and CI drift detection
- **Simplified taxonomy**: 7→4 dimensions, 5→3 gates, 4→3 verdicts, protocols demoted to tagged traceability checks
- **Calibrated convergence**: `coverageAge >= 1` gate, split thresholds (`rollingStop=0.08`, `noProgress=0.05`)
- **Machine-verifiable cross-references**: typed JSONL storage with core/overlay protocol split
- **Planner-ready reports**: handoff-first ordering with canonical JSON planning packet
- **Agent hardening**: scratch-only writes, budget profiles (scan/verify/adjudicate), typed claim adjudication
- **Unified review model**: shared `review-core` contract via `sk-code-review` consumed by both `@review` and `@deep-review`

---

## 2. Research Context

**Topic**: How to further improve the review logic in sk-deep-research and related commands/agents.

**Prior work**: Review mode v1.2.0 was implemented with `:review` suffixes on `/spec_kit:deep-research`. A prior research session (archived in `scratch/archive-research-v1/`) designed the original review mode architecture. A GPT-5.4 review of this spec folder identified 5 key improvement areas: canonical source-of-truth drift, conceptual complexity, unvalidated convergence thresholds, incomplete packet structure, and command naming decisions.

**Scope**: Research-only. Implementation belongs in separate spec folders.

---

## 3. Key Questions & Answers

### Q1: Canonical Source-of-Truth (Iterations 1-2)

**Problem**: Review mode definitions (dimensions, verdicts, target types, report sections, convergence parameters) are scattered across 8+ file families: review YAML workflows (auto/confirm), agent definitions (4 runtimes), command docs, quick reference, README, changelog, state format reference, and loop protocol reference. Documentation drift is not hypothetical — multiple playbook waves and consistency sweeps were needed to catch mismatches.

**Answer**: Introduce a neutral **review-mode contract manifest** (`review_mode_contract.yaml`) owned by `sk-deep-research`. The manifest holds stable IDs for all review-mode concepts (target types, dimensions, severities, verdicts, guards, convergence rules, cross-reference protocols, report sections, JSONL fields). Downstream artifacts use **mixed authored/generated blocks** with explicit markers (`<!-- BEGIN GENERATED: review-taxonomy -->` / `<!-- END GENERATED: review-taxonomy -->`). A render pipeline (`render-review-contract`) generates/updates blocks, and a `--verify` mode in CI/pre-commit catches drift.

**Key design decisions**:
- Mixed authored/generated (not full-file generation) preserves narrative prose in agent docs, README, and playbooks
- Validator checks: schema validity, render parity, marker integrity, duplicate-literal lint, enum parity, JSONL parity, runtime coverage, playbook assertions
- Ownership matrix: YAML workflows (mixed), agent docs (mixed), quick reference (mixed), README (mixed), snapshots (fully generated)

**Sources**: Iterations 1-2, citing YAML workflows, agent definitions, `compose.sh` patterns in system-spec-kit.

---

### Q2: Minimum Viable Taxonomy (Iteration 3)

**Problem**: The current taxonomy carries 7+5+4+5+6 = 27 operator-facing concepts across 5 categories. The docs already disagree on whether scoring is 5-dimensional or 7-dimensional. External review tools (SonarQube, Semgrep, Qlty, GitHub) use far simpler models.

**Answer**: Reduce to **4 dimensions + 3 gates + 3 verdicts**:

| Layer | Current | Proposed |
|-------|---------|----------|
| **Dimensions** | correctness, security, spec-alignment, completeness, cross-ref-integrity, patterns, documentation-quality (7) | **correctness, security, traceability, maintainability** (4) |
| **Severity** | P0, P1, P2 (3) | P0, P1, P2 (unchanged) |
| **Gates** | evidence-completeness, scope-alignment, no-inference-only, severity-coverage, cross-reference (5) | **evidence, scope, coverage** (3) |
| **Verdicts** | FAIL, CONDITIONAL, PASS WITH NOTES, PASS (4) | **FAIL, CONDITIONAL, PASS** (3) + `hasAdvisories` metadata |
| **Protocols** | 6 top-level taxonomy items | Tagged checks under `traceability` |
| **Convergence** | 5 signals + weights | **novelty, coverage, stability** (3 operational concepts) |

**Migration map**:
- `spec-alignment` + `completeness` + `cross-ref-integrity` → `traceability`
- `patterns` + `documentation-quality` → `maintainability`
- `evidence-completeness` + `no-inference-only` → `evidence` gate
- `PASS WITH NOTES` → `PASS` + advisory metadata
- Numeric composite score → reporting-only telemetry (not release gate)

---

### Q3: Convergence Threshold Validation (Iteration 4)

**Problem**: Convergence thresholds (rolling stop at 0.08, dimension coverage, MAD noise floor, P0 override) were proposed in prior research but never empirically validated. The 7→4 dimension reduction changes coverage timing.

**Answer**: Deterministic **replay over completed JSONL traces** from real review runs (specs 012 and 013) is the right validation method.

**Key finding**: The 7→4 dimension collapse causes an **early-stop regression** on spec 012. With 4 dimensions, full coverage arrives one iteration earlier, causing a false STOP at run 5 that would miss a real late P2 finding at run 6.

**Calibrated fix**:
- Keep `rollingStopThreshold = 0.08`
- Split stuck/no-progress into separate `noProgressThreshold = 0.05`
- Add `coverageAge >= 1` requirement: coverage only votes STOP after one post-coverage stabilization pass
- Keep composite consensus at `> 0.60`
- Leave `stuckThreshold = 2` (with the split threshold)

---

### Q4: Cross-Reference Verification Redesign (Iteration 5)

**Problem**: The 6 cross-reference protocols exist as appendix-level prose, not machine-verifiable state. Results are reported narratively, not stored in typed JSONL.

**Answer**: Three-layer model:

1. **Protocol registry** in canonical manifest with stable IDs, applicability rules, gate class, and required evidence kinds
2. **Per-iteration result envelope** in JSONL with typed status, counts, and evidence refs
3. **Derived presentation** in strategy, dashboard, and review-report.md

**Core vs overlay split**:
- **Core** (universal): `spec_code`, `checklist_evidence`
- **Overlay** (target-specific): `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`

**Convergence interaction**:
- `fail`/`blocked` on required protocol → veto convergence immediately
- `partial` on required protocol → keep CONTINUE until resolved
- Overlay protocols → advisory unless target type promotes them to required

**Status semantics**: `pass | partial | fail | not_applicable | blocked`

---

### Q5: Review Report Actionability (Iteration 6)

**Problem**: Current 11-section report is audit-focused, not planner-friendly. `/spec_kit:plan` needs structured inputs (problem statement, scope, files, requirements), but the report buries actionable content in the last section.

**Answer**: Two-layer report architecture:

1. **Decision layer**: verdict, active blockers, stop reason
2. **Planning layer**: normalized remediation packet seeding `/spec_kit:plan`

**New section order**: Executive Summary → Planning Trigger → Active Finding Registry → Remediation Workstreams → Spec Seed → Plan Seed → Traceability Status → Deferred Items → Audit Appendix

**Machine-readable packet**: Single canonical `## Planning Packet` JSON block with:
- `recommendedCommand`, `planningIntent`, `problemStatement`, `purpose`
- `scope` (inScope, outOfScope, filesToChange)
- `activeFindings[]` with typed registry entries
- `workstreams[]` with phase hints and dependencies
- `traceabilityGate` for planning-readiness assessment
- Direct field mapping to `spec.md` and `plan.md` templates

---

### Q6: @deep-review Agent Architecture (Iteration 7)

**Problem**: The agent's prose contract says "read-only" but runtime permissions grant broad write access. Tool budget is one-size-fits-all. Adversarial self-check is prose-based, not typed. Cross-runtime front-matter drifts.

**Answer**:

1. **Permission hardening**: Restrict writes to scratch-only allowlist. Remove `external_directory: allow`. Let orchestrator own JSONL append and strategy mutation.

2. **Budget profiles** (replacing universal 9-12):
   - `scan`: 9-11 calls for ordinary dimension discovery
   - `verify`: 11-13 calls for cross-runtime/cross-reference checks
   - `adjudicate`: 8-10 calls for skepticism-only follow-up

3. **Dispatch enrichment**: Add `reviewContractVersion`, `budgetProfile`, `allowedWritablePaths`, `filesAlreadyReviewed`, `activeFindingsForDimension`, `contestedFindingRefs`, `exhaustedApproaches`, `expectedOutputs`

4. **Typed adversarial validation**: Every new P0/P1 emits a claim packet with `claim`, `evidenceRefs`, `counterevidenceSought`, `alternativeExplanation`, `finalSeverity`, `confidence`, `downgradeTrigger`. Orchestrator adjudicates before convergence math uses them.

5. **Cross-runtime parity**: Generate front-matter from agent-capability manifest. Separate body-contract drift from capability-contract drift.

6. **Role clarification**: @deep-review = evidence packet author. Orchestrator = cumulative state owner, deduplication, report compilation.

---

### Q7: Integration with @review and sk-code-review (Iteration 8)

**Problem**: @deep-review, @review, and sk-code-review share review doctrine but currently duplicate rubric, severity, and overlay logic. The severity ladder even disagrees (P0-P2 in agents vs P0-P3 in skill quick reference).

**Answer**: Unified review model with three layers:

1. **Review Core Contract** (owned by `sk-code-review`): canonical severities, evidence rules, output ordering, overlay precedence, baseline check families
2. **Execution Profile**: `single-pass` (@review) or `iterative` (@deep-review)
3. **Orchestration Layer**: standalone report/gate for @review; convergence/dedupe/planning-packet for deep review

**Key boundaries**:
- Shared: severity semantics, evidence requirements, findings schema, baseline+overlay precedence
- @review-only: standalone mode selection, PR/pre-commit UX, numeric gate adapter
- @deep-review-only: dimension queue, scratch emission, convergence metadata, traceability/adjudication extensions

**Integration rules**:
- No nested agent-to-agent invocation (both are LEAF)
- Orchestrator mediates exchange via typed seed/calibration packets
- Optional: @review preflight pass seeds hotspots before deep review loop
- Optional: @review calibration pass after convergence catches baseline misses
- `sk-code-review` splits into: `review-core` (shared), `review-ux-single-pass` (@review-only), `review-risk-pack` (checklists/overlays for both)

---

## 4. Implementation Roadmap

### Phase 1: Foundation (Prerequisites)
1. Normalize severity ladder: resolve P0-P3 vs P0-P2 disagreement across skill and agents
2. Create canonical `review_mode_contract.yaml` manifest with all review-mode concepts
3. Build `render-review-contract` tool and `--verify` CI check
4. Split `sk-code-review` into `review-core` + `review-ux-single-pass` + `review-risk-pack`

### Phase 2: Taxonomy Migration
5. Apply 7→4 dimension mapping across all surfaces
6. Collapse 5 guards to 3 binary gates
7. Merge PASS WITH NOTES into PASS + advisory metadata
8. Demote numeric composite score to reporting-only telemetry
9. Update convergence with `coverageAge >= 1` gate and split thresholds

### Phase 3: Machine-Verifiable State
10. Implement typed `traceabilityChecks` in JSONL with protocol registry
11. Add structured finding registry to iteration outputs
12. Implement typed P0/P1 claim-adjudication packets
13. Build deterministic replay harness for convergence regression testing

### Phase 4: Report & Agent
14. Restructure review-report.md with handoff-first ordering
15. Add Planning Packet JSON block and spec/plan seed sections
16. Harden @deep-review permissions to scratch-only writes
17. Implement budget profiles (scan/verify/adjudicate)
18. Enrich dispatch template with structured state
19. Generate cross-runtime front-matter from agent-capability manifest

### Phase 5: Integration
20. Wire @deep-review to load `review-core` from sk-code-review
21. Remove duplicated rubric/severity from @deep-review agent
22. Implement orchestrator-mediated packet exchange between review modes
23. End-to-end validation: replay + playbook + integration test

---

## 5. Ruled Out Directions

| Direction | Why Ruled Out | Iteration |
|-----------|--------------|-----------|
| Manual sync as primary drift control | Already failed — needed multiple playbook waves | 1 |
| YAML-only canonical source | Can't serve agent docs, README, playbooks | 1 |
| Full-file generation for all docs | Would destroy authored narrative prose | 2 |
| Keeping 7 operator-facing dimensions | Too much overlap; docs already disagree | 3 |
| Numeric composite score as release gate | Creates competing decision system | 3 |
| Cross-reference protocols as peer taxonomy | Contradicts traceability consolidation | 3 |
| Threshold-only convergence refit | Doesn't fix coverage timing regression | 4 |
| Shared threshold for rolling/stuck | Different concerns need different cutoffs | 4 |
| All 6 protocols as universal hard gates | Forces false failures on absent artifacts | 5 |
| Markdown-only cross-reference results | No typed state for loop decisions | 5 |
| Planner scraping freeform narrative | Unreliable; needs structured packet | 6 |
| Scorecard-plus-prose as final report | Not planner-friendly | 6 |
| Broader write permissions for @deep-review | Weakens read-only safety boundary | 7 |
| Single universal tool budget | Ignores different iteration profiles | 7 |
| Same-iteration self-check as only validation | Too late for convergence math | 7 |
| Body-text match as sufficient parity | Misses capability/front-matter drift | 7 |
| Nested agent-to-agent invocation | Both are LEAF; coupling via dispatch | 8 |
| Duplicating review rubric in @deep-review | Drift-prone; should load from review-core | 8 |
| Sharing single-pass UX with deep review | Interactive rules don't fit autonomous loop | 8 |

---

## 6. Open Questions

1. **Replay corpus size**: The convergence calibration is based on only 2 real review runs. More historical sessions needed before treating thresholds as final.
2. **Manifest format**: JSON vs YAML for the contract manifest. YAML is more readable for mixed content; JSON is easier to parse programmatically. Both are viable.
3. **Progressive synthesis interaction**: Should the planning packet be progressively built during iterations, or only compiled in final synthesis?
4. **Agent-capability manifest scope**: Should the cross-runtime parity generator be specific to @deep-review, or a repo-wide agent-manifest system?

---

## 7. Methodology

- **Approach**: Iterative deep research with GPT-5.4 agents via `codex exec` (high reasoning effort)
- **Iterations**: 8 (stopped at all_questions_answered)
- **newInfoRatio trajectory**: 0.74 → 0.63 → 0.58 → 0.56 → 0.49 → 0.44 → 0.39 → 0.34
- **Evidence sources**: Codebase files (YAML workflows, agent definitions, skill docs, reference files, prior review runs), external documentation (SonarQube, Semgrep, Qlty, GitHub)
- **State management**: Externalized JSONL + strategy.md + per-iteration finding files

---

## 8. Sources

### Internal (Codebase)
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml`
- `.opencode/command/spec_kit/deep-research.md`
- `.opencode/command/spec_kit/plan.md`
- `.opencode/agent/deep-review.md` (+ `.claude/`, `.codex/`, `.gemini/`, `.opencode/agent/chatgpt/` variants)
- `.opencode/agent/review.md`
- `.opencode/skill/sk-deep-research/SKILL.md` and references (loop_protocol.md, state_format.md, convergence.md, quick_reference.md)
- `.opencode/skill/sk-deep-research/README.md`
- `.opencode/skill/sk-code-review/SKILL.md` and references
- `.opencode/skill/system-spec-kit/` (templates, compose.sh, template_guide.md)
- Real review runs: specs 012 (pre-release-fixes) and 013 (memory-generation-quality)
- Archived v1 research: `scratch/archive-research-v1/`

### External
- SonarQube: `https://docs.sonarsource.com/sonarqube-server/10.3/user-guide/issues/`
- Semgrep: `https://semgrep.dev/docs/running-rules`, `https://dev2.semgrep.dev/docs/kb/rules/understand-severities`
- Qlty: `https://docs.qlty.sh/cloud/maintainability/metrics`
- GitHub Code Scanning: `https://docs.github.com/en/code-security/`

---

## 9. Convergence Report

- **Stop reason**: all_questions_answered
- **Total iterations**: 8
- **Questions answered**: 7/7
- **Remaining questions**: 0
- **Last 3 iteration summaries**:
  - Run 6: Q5 report actionability (0.44)
  - Run 7: Q6 agent architecture (0.39)
  - Run 8: Q7 integration design (0.34)
- **Convergence threshold**: 0.05
- **Quality guards**: All passed (multi-source citations, aligned focus, no single-weak-source answers)

**All research questions answered. Ready for implementation via `/spec_kit:plan`.**
