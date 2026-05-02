---
title: "Research Charter: Automation Reality Supplemental — Continuation of 012"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "5-iter supplemental deep research extending 012's automation reality map. Deepens the 4 P1 aspirational findings via adversarial Hunter→Skeptic→Referee, probes under-covered surfaces (deep-loop graph, CCC + eval + ablation, validator auto-fire), and outputs a sequenced remediation backlog (packets 031-035)."
trigger_phrases:
  - "017-automation-reality-supplemental-research"
  - "automation reality supplemental"
  - "deep-loop graph automation"
  - "CCC eval ablation reality"
  - "validator auto-fire reality"
  - "automation remediation backlog"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/017-automation-reality-supplemental-research"
    last_updated_at: "2026-04-29T20:35:30+02:00"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Resource map indexed"
    next_safe_action: "Use packet for downstream work"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Research Charter: Automation Reality Supplemental

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (5 iters converged) |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `026-graph-and-context-optimization` |
| **Continuation Of** | `016-automation-self-management-deep-research` (sessionId 2026-04-29T13:15:00.000Z) |
| **Mode** | Deep research (`/spec_kit:deep-research:auto`) |
| **Iterations** | 5 (max); convergence threshold 0.10 |
| **Executor** | cli-codex `gpt-5.5` reasoning=`xhigh` service-tier=`fast` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

012's 7-iteration deep research produced a 50-row automation reality map (14 auto / 14 half / 18 manual / 4 P1 aspirational) but stopped on `max_iterations` with newInfoRatio=0.18 — STILL ABOVE the 0.10 convergence threshold. Information density was not exhausted. Three concrete gaps remained:

1. **Under-covered surfaces**: deep-loop graph automation (deep_loop_graph_query/upsert/convergence/status), CCC + eval reporting + ablation runner reality, validator auto-fire surface (PostToolUse paths, generate-context.js auto-trigger conditions) — not mapped per-iter.
2. **Adversarial validation**: 012's 4 P1 aspirational findings were classified using Hunter→Skeptic→Referee pattern, but rigor varied. Each deserves a hostile re-test: dynamic-loaded path missed? Platform-specific autoload? Test-fixture exercising it?
3. **Operator-actionable remediation**: 012 produced a Planning Packet but no sequenced packet-numbered backlog. Operators need: which remediation packet first, what's the effort, what's the dependency graph?

### Purpose

Run a 5-iteration supplemental loop that:

- Extends the reality map with new rows for deep-loop graph, CCC, eval, ablation, validator auto-fire surfaces
- Re-tests each of 012's 4 P1 aspirational findings with adversarial rigor; demote/promote based on new evidence
- Hunts for NEW gaps in surfaces 012 didn't reach (session-manager cleanup intervals, freshness checks, skill_graph_validate auto-fire, memory_drift_why path, etc.)
- Produces a sequenced remediation backlog (packets 031-035) with effort estimates, dependencies, and operator triggers
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (research questions)

- **RQ1 — Deep-loop graph automation**: Catalog deep_loop_graph_query/upsert/convergence/status entry-points. Where do they fire? Only via deep-research/deep-review YAMLs? Cite file:line. Reality classification for each.
- **RQ2 — CCC + eval reporting + ablation runner reality**: ccc_reindex/feedback/status, eval_run_ablation, eval_reporting_dashboard. MCP-tool-only? Test-fixture-only? Aspirational? Document who calls each.
- **RQ3 — Validator auto-fire surface**: Does validate.sh fire on PostToolUse for spec doc edits? generate-context.js auto-trigger conditions. Pin file:line for every "validation auto-fires" claim across the codebase.
- **RQ4 — Adversarial 4-P1 retest**: Each of 012's 4 P1 aspirational findings gets actively hostile re-test. Dynamic-loaded path missed? Platform-specific autoload? Test-fixture exercising it? Demote/promote based on rigor.
- **RQ5 — NEW gap hunt**: Hunt for gaps in surfaces 012 didn't reach (session-manager cleanup intervals, freshness checks, skill_graph_validate auto-fire, memory_drift_why path, learning_history, advisor_status freshness, code_graph_context auto-fire, eval/dashboard/causal helpers).
- **RQ6 — Remediation packet sequencing**: Map findings to packets 031-035 with: scope, effort estimate, dependency graph, operator trigger conditions, whether it's a doc fix vs code change.

### Out of Scope (research only)

- Implementing fixes (separate downstream packets 031-035 will execute)
- Re-running the full 012 research (this is supplemental, not replacement)
- Modifying any prior packet content (read-only on existing packets)
- Running stress tests, harness, or any production code path mutations
- Modifying skill advisor scoring tables

### Files to Read (representative; iterations may add more)

- Deep-loop graph:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/coverage-graph.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/deep-loop-graph-*.ts`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-{research,review}_{auto,confirm}.yaml`
- CCC + eval + ablation:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/ccc-{reindex,feedback,status}.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-{run-ablation,reporting-dashboard}.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/eval/`
- Validator auto-fire:
  - `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
  - `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/`
  - `.claude/settings.local.json`, `.codex/settings.json`, hook configs across runtimes
- Adversarial retest targets (012's 4 P1):
  - `.opencode/skill/system-spec-kit/mcp_server/README.md` (line 515-518)
  - `.opencode/skill/system-spec-kit/mcp_server/lib/scope-governance.ts` (line 225-333)
  - `.opencode/skill/system-spec-kit/references/config/hook_system.md` (line 22)
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md` (line 27-34)
  - `.codex/settings.json`, `.codex/hooks.json` (if present)
- New gap hunt:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/session-manager.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/skill_graph_*.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-drift-why.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-get-learning-history.ts`
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none)

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 iterations produce externalized state. | Numbered iteration files under `research/iterations/` and matching JSONL deltas under `research/deltas/`. |
| REQ-002 | Each iteration has a focused angle per the focus map. | Iter focus map in `research/deep-research-strategy.md`; each iter cites focus + new findings. |
| REQ-003 | Convergence detected honestly. | Final iter records stop reason + newInfoRatio sequence; honest reporting if max_iterations vs converged. |
| REQ-004 | RQ1-RQ6 each have evidence-cited answers. | claim / actual behavior / gap-class / recommended-action; new rows added to delta-vs-012 reality map. |
| REQ-005 | Every "auto-fires" claim has a triggering file:line citation. | Code path traced from event source to the automation it claims to drive. |
| REQ-006 | Each of 012's 4 P1 findings gets adversarial retest verdict. | validated / demoted / promoted; rationale documented. |
| REQ-007 | Remediation packets 031-035 are sequenced with effort estimates and dependencies. | Operator can read the backlog and prioritize without re-investigating. |
| REQ-008 | Final research-report.md authored with 7-section structure. | Sections: supplemental scope vs 012, extended reality map (delta), per-RQ answers, 4-P1 adversarial outcomes, NEW gaps, remediation backlog, open questions. |

### Acceptance Scenarios

1. **Given** the research completes, **when** a reviewer opens the synthesis output (research/research-report.md), **then** each RQ1-RQ6 has cited answers and a remediation backlog with packet sequencing.
2. **Given** a 4-P1 finding survives adversarial retest, **when** synthesis runs, **then** the finding stays at P1 with new corroborating evidence.
3. **Given** a 4-P1 finding is challenged successfully, **when** synthesis runs, **then** the finding is demoted to P2 or removed with rationale.
4. **Given** Phase 031-035 planning needs a remediation roadmap, **when** a reviewer reads the backlog, **then** they can pick a packet and start execution without re-investigating sources.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 5 iter files + 5 delta files written.
- **SC-002**: Convergence event recorded with newInfoRatio sequence.
- **SC-003**: Research report enumerates RQ1-RQ6 + 4-P1 adversarial outcomes + remediation backlog with file:line citations.
- **SC-004**: Strict validator exits 0 on this packet.
- **SC-005**: Remediation backlog enables follow-on packets 031-035 to execute without re-research.

### Acceptance Scenarios

- **SCN-001**: **Given** an iter cites a "deep_loop_graph_convergence auto-fires" claim, **when** synthesis runs, **then** either a YAML/handler/test file:line is cited OR the finding is marked "documented but absent" with P1.
- **SCN-002**: **Given** 012's "code-graph watcher overclaim" P1 finding is re-tested, **when** the iter completes, **then** the verdict is one of: validated (still P1), demoted (P2 with rationale), promoted (P0 with rationale), or new evidence reclassifies as half-automated.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Continuation can drift from 012's lineage if config doesn't link | parentSessionId + lineageMode=continuation set in deep-research-config.json |
| Risk | Adversarial Hunter→Skeptic→Referee can be performative without rigor | Each finding's challenge must reference NEW file:line evidence not surfaced in 012 |
| Risk | "5 iterations" may not be enough if surfaces are deeper than estimated | Per-iter convergence vote; if newInfoRatio > 0.10 after iter 5, document as "partial convergence; iter 6+ would surface more" |
| Risk | Remediation packet sequencing can over-promise | Effort estimates use cli-codex hours, not hand-coded; explicit dependency graph |
| Dependency | 012 packet shipped on main today (commit ad76b7569) | Lineage links to that synthesis_complete event |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Research must not run runtime stress tests, the harness, or mutate any production code path.
- **NFR-P02**: Each iteration's externalized state ≤ 50 KB (typical).

### Reliability
- **NFR-R01**: Every concrete finding cites file:line evidence or carries `speculation: true` flag.
- **NFR-R02**: Convergence tracking records full newInfoRatio sequence and stop reason.
- **NFR-R03**: Adversarial retest of 4 P1 findings must cite NEW evidence (not just rehash 012's findings).

### Security
- **NFR-S01**: No secrets, credentials, or external service tokens are required.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A 012 P1 finding that survives adversarial retest with ZERO new evidence: keep at P1 with explicit "no new evidence; 012's classification stands" annotation.
- A 012 P1 finding that adversarial retest finds wired in a test fixture only: reclassify as half-automated (test-only auto-fire) with packet recommendation to either implement or doc-honestly.
- A new gap discovered in iter 5 that warrants P0: document in research-report and add to remediation backlog as priority-zero.

### Error Scenarios
- cli-codex dispatch timeout: retry once at reduced scope; mark iteration as `timeout` if second attempt fails.
- Convergence not reached after iter 5: document partial convergence; recommend whether iter 6+ would justify another packet.
- Remediation packet sequencing surfaces unresolvable dependencies: document with "BLOCKED — needs upstream decision" annotation.

### State Transitions
- Planned → Complete: state log gets 5 iteration events plus `synthesis_complete`.
- Research → remediation: final backlog seeds packets 031-035 without applying runtime changes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Supplemental research (5 iters, narrower than 012's 7) |
| Risk | 10/25 | Research-only; lineage-linked to 012 |
| Research | 19/20 | 5 focused iterations, adversarial pass, sequenced backlog output |
| **Total** | **47/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Q1: Should "demoted" findings stay in the report or move to scratch? **Default**: stay in report with explicit "DEMOTED via adversarial retest in iter 4" annotation; transparency over tidiness.
- Q2: Should remediation packet 031 be Level 1, 2, or 3? **Default**: Level 2 (Tier A doc-truth pass); upgrade if scope grows.
- Q3: Should the supplemental research re-run validation across CLAUDE.md, SKILL.md, README, references/? **Default**: yes — RQ3 covers validator auto-fire claims across these surfaces.

This packet is a CONTINUATION of 016-automation-self-management-deep-research. It supplements (does NOT replace) 012's findings. The 4-class taxonomy (auto / half / manual / aspirational) and 50-row baseline reality map carry forward; this packet adds rows and challenges the 4 P1 aspirational findings with adversarial rigor.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Findings will be populated by the synthesis phase.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->
