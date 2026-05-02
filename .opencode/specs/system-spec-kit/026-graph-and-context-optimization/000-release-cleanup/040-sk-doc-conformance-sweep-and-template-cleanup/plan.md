---
title: "Implementation Plan: sk-doc Conformance Sweep and Template Cleanup"
description: "Tiered execution plan: Tier 1 foundation, Tier 2 parallel cli-codex content rewrites, Tier 3 deterministic renames + path sweep, Tier 4 validation."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "040-sk-doc-conformance-sweep-and-template-cleanup plan"
  - "sk-doc conformance plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/040-sk-doc-conformance-sweep-and-template-cleanup"
    last_updated_at: "2026-04-30T08:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan doc rewritten to Level 3 canonical"
    next_safe_action: "Run validate.sh --strict; dispatch Tier 2a wave"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:040-sk-doc-conformance-sweep-and-template-cleanup"
      session_id: "040-sk-doc-conformance-sweep-and-template-cleanup"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 8
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-doc Conformance Sweep and Template Cleanup

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (sk-doc), shell + Python (validators) |
| **Framework** | sk-doc, system-spec-kit, sk-improve-prompt |
| **Storage** | File system (.opencode/) + Spec Kit Memory MCP (DB + embeddings) |
| **Testing** | `validate_document.py`, `validate.sh --strict`, manual spot-checks, `code_graph_status`, `memory_search` smoke tests |

### Overview
Severity-tiered execution. Each Tier-2 sub-phase fans out to parallel cli-codex gpt-5.5 high fast agents. Tier 1 is sequential foundation. Tier 3 is mostly deterministic git operations. Tier 4 is sequential validation. Total estimated effort: 25-35 cli-codex dispatches; ~2-4 hours wall time with full parallelism; ~150-300 files modified.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2-§3)
- [x] Success criteria measurable (spec.md §5, 7 criteria)
- [x] Dependencies identified (spec.md §6 + this plan §6)
- [x] Audit complete via 7 parallel cli-codex gpt-5.5 high fast agents (audit-findings.md)
- [x] Architectural decisions resolved (decision-record.md, D-001..D-006)

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001..REQ-008)
- [ ] `validate.sh --strict` passes on every modified spec folder (exit 0)
- [ ] `validate_document.py` passes on every modified document (exit 0)
- [ ] `grep -rIn "level3plus-govern\|templates/stress-test\|templates/sharded" .opencode/` returns zero active hits
- [ ] Memory + graph reindexed; smoke tests pass
- [ ] No skill_advisor regressions in routing
- [ ] implementation-summary.md authored post-implementation
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Severity-tiered bounded-wave execution: foundation → parallel content rewrites (3 sub-waves) → deterministic git ops + path sweep → validation. Each wave verifies before the next starts.

### Key Components
- **sk-doc skill** (canonical templates): authoritative format definitions consumed read-only
- **sk-improve-prompt skill**: generates RCAF-shaped prompts for per-feature playbook scenarios
- **cli-codex CLI**: parallel gpt-5.5 high fast dispatches that perform the actual content rewrites
- **system-spec-kit validators** (`validate.sh --strict`, `validate_document.py`): completion gate
- **Spec Kit Memory MCP** (`generate-context.js`, `code_graph_scan`): reindex post-renames
- **Spec folder 040** (this packet): orchestration + tracking surface

### Data Flow
1. Auditor (this conversation) reads canonical templates and audits surfaces via 7 parallel cli-codex audits.
2. Audit findings persist to `audit-findings.md`.
3. Tier 2 dispatch waves: each cli-codex dispatch reads canonical templates + 1 target surface, writes the rewritten content back to the repo, exits.
4. Tier 3 deterministic renames + path-reference sweep applied via `git mv` + targeted `grep`/`sed`-style edits.
5. Tier 4 validation reads modified surfaces, gates completion claim.
6. `generate-context.js` reindexes packet 040 + memory + graph; `_memory.continuity` reflects final state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (Tier 1 — Foundation)
- [x] T-001 SP-001 Phase 040 collision resolved naturally (prior 040 renumbered to 027)
- [x] T-002 SP-002 Spec folder shell created at 040-sk-doc-conformance-sweep-and-template-cleanup/
- [x] T-003..T-005 spec.md, plan.md, tasks.md written
- [x] T-006 checklist.md written
- [x] T-007 decision-record.md written
- [x] T-008 description.json written
- [x] T-009 graph-metadata.json written
- [x] T-010 audit-findings.md written
- [ ] T-011 `validate.sh --strict` passes on this packet (exit 0)

### Phase 2: Core Implementation (Tier 2 — Format Remediation, parallel cli-codex)

**Wave 2a (low effort, label rename + RCAF rewrite)** — 8 cli-codex dispatches in parallel:
- [ ] T-020..T-027 cli-claude-code, cli-codex, cli-gemini, cli-copilot, cli-opencode, mcp-chrome-devtools, mcp-code-mode, sk-deep-research playbooks
- [ ] T-028 Verify wave 2a results — spot-check 1 file per dispatch + run `validate_document.py` per root

**Wave 2b (medium effort)** — 12 dispatches:
- [ ] T-030..T-032 sk-deep-review, mcp-coco-index, code_graph playbooks
- [ ] T-033..T-036 sk-improve-agent, sk-deep-research, skill_advisor, code_graph feature_catalogs
- [ ] T-037..T-040 system-spec-kit refs PARTIAL+DRIFT batches; sk-code-review refs DRIFT
- [ ] T-041 Verify wave 2b results

**Wave 2c (high effort, full restructure)** — 5 dispatches with single-file scope each:
- [ ] T-050 sk-improve-agent playbook (convert 31 files)
- [ ] T-051 skill_advisor playbook reclassification (move 42/43 → operator_runbook/, create new manual_testing_playbook/)
- [ ] T-052 mcp-clickup playbook (create from scratch)
- [ ] T-053 system-spec-kit canonical playbook (full remediation, ~321 files)
- [ ] T-054 system-spec-kit canonical feature_catalog (strip 292 packet-history refs, add 272/302 source lines)
- [ ] T-055 Verify wave 2c results — manual spot-check 5+ random files per dispatch

### Phase 3: Verification (Tier 3 — Template cleanup + path sweep, then Tier 4 — Validation + memory save)

**Tier 3 — Templates cleanup + path-reference sweep:**
- [ ] T-060..T-070 delete templates/sharded/, rename stress-test → stress_test (+ README), rename addendum/level3plus-govern → level3-plus-govern, align templates/changelog/, rewrite plugins/README.md, sweep all path references; verify zero remaining hits

**Tier 4 — Validation + memory save:**
- [ ] T-080..T-088 validators per modified surface, code_graph_scan, memory_search smoke tests, manual spot-checks, advisor regression check
- [ ] T-090..T-094 update _memory.continuity, run generate-context.js, generate handover.md, optional changelog, mark all checklist items
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validator | Modified spec folders + documents | `validate.sh --strict`, `validate_document.py`, `quick_validate.py` |
| Path consistency | Renamed/deleted paths | `grep -rIn "level3plus-govern\|templates/stress-test\|templates/sharded" .opencode/` |
| Manual spot-check | 5 random files per category | Eyeball read; compare to canonical templates |
| Memory smoke | Renamed packet triggers | `memory_search({ query: "manual testing playbook" })` etc. |
| Graph smoke | Freshness post-rename | `code_graph_status`, `code_graph_query` |
| Advisor regression | Skill routing for playbook/catalog/reference triggers | `skill_advisor.py "<prompt>" --threshold 0.8` for representative prompts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc canonical templates | Internal (skill) | Green | Cannot rewrite to canonical shape; halt sweep |
| sk-improve-prompt skill | Internal (skill) | Green | Manual RCAF authoring as fallback |
| cli-codex CLI binary (codex-cli 0.125.0) | External | Green | Cannot dispatch parallel rewrites; serial fallback would 10x wall time |
| Spec Kit Memory MCP + generate-context.js | Internal (mcp) | Green | Memory reindex blocked; manual `memory_index_scan` fallback |
| `code_graph_scan` MCP | Internal (mcp) | Stale (orthogonal) | Path resolution may stay stale until next session |
| 037-feature-catalog-shape-realignment (prior packet) | Internal (sibling) | Complete | Provides catalog-shape precedent |
| 039-stress-test-expansion-and-alignment (prior packet) | Internal (sibling) | Complete | Provides stress-test path-reference patterns |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Tier 2 wave produces systemically wrong output (>20% of files in batch fail validation), OR memory/graph reindex fails post-rename, OR strict validation regression on pre-existing surfaces
- **Procedure**: Per-file revert via `git diff` + `git restore <path>` for content; `git mv` reversal for renames; `generate-context.js` re-run on prior state if memory drift; `code_graph_scan` to re-establish baseline
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Tier 1 (Setup) ─────► Tier 2a (low effort wave) ─────► Tier 2b (medium effort wave) ─────► Tier 2c (high effort wave) ─────► Tier 3 (cleanup + sweep) ─────► Tier 4 (validation + memory save)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Tier 1 | None | Tier 2a, 2b, 2c |
| Tier 2a | Tier 1 | Tier 2b |
| Tier 2b | Tier 2a verify | Tier 2c |
| Tier 2c | Tier 2b verify | Tier 3 |
| Tier 3 | Tier 2c verify | Tier 4 |
| Tier 4 | Tier 3 | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Tier 1 (Setup) | Low | 30-45 min |
| Tier 2a (8 parallel dispatches) | Medium | 30-45 min wall (each ~3-5 min) |
| Tier 2b (12 parallel dispatches) | High | 45-60 min wall |
| Tier 2c (5 single-scope dispatches) | High | 45-60 min wall + manual spot-check |
| Tier 3 (cleanup + sweep) | Low-Medium | 30-45 min |
| Tier 4 (validation + memory save) | Low | 15-30 min |
| **Total** | | **~3-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All sibling phase children (037, 039) confirmed complete
- [ ] cli-codex CLI verified available and authenticated
- [ ] sk-doc skill canonical templates pinned at current state

### Rollback Procedure
1. Halt the in-flight wave (kill any running cli-codex dispatches via `pkill -f "codex.*model.*gpt-5.5"`)
2. Diagnose failure (read dispatch outputs in `/tmp/claude-*/tasks/`)
3. Per-file revert via `git restore` for any files committed in the failed wave
4. Re-run wave with refined prompt OR escalate to manual remediation
5. Re-run `code_graph_scan` if graph state drifted

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: All changes are file edits in git-tracked paths. Standard git revert covers all reversal. Memory/graph reindex via `generate-context.js` re-runs are idempotent.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Tier 1    │────►│   Tier 2a   │────►│   Tier 2b   │────►│   Tier 2c   │
│  Foundation │     │  Low-effort │     │  Medium     │     │  High       │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                  │
                                                            ┌─────▼─────┐
                                                            │  Tier 3   │
                                                            │  Cleanup  │
                                                            └─────┬─────┘
                                                                  │
                                                            ┌─────▼─────┐
                                                            │  Tier 4   │
                                                            │ Validate  │
                                                            └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Tier 1 (foundation) | sk-doc templates | spec folder shell | Tier 2 |
| Tier 2a (low effort) | Tier 1 verified | label-fix + RCAF rewrites | Tier 2b |
| Tier 2b (medium) | Tier 2a verified | scenario-contract rebuilds | Tier 2c |
| Tier 2c (high) | Tier 2b verified | reclassifications + creations + canonical full remediation | Tier 3 |
| Tier 3 (cleanup) | Tier 2c verified | renames + path sweep | Tier 4 |
| Tier 4 (validate) | Tier 3 | completion claim + memory save | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Tier 1 — Foundation (T-001..T-011)** - 30-45 min - CRITICAL
2. **Tier 2c.T-053 — system-spec-kit canonical playbook full remediation** - 30-45 min - CRITICAL (largest single batch, ~321 files)
3. **Tier 2c.T-054 — system-spec-kit canonical feature_catalog full remediation** - 30-45 min - CRITICAL (~302 files)
4. **Tier 4 — Validation + memory save** - 15-30 min - CRITICAL

**Total Critical Path**: ~2-2.5 hours

**Parallel Opportunities**:
- All Tier 2a dispatches run simultaneously (8 cli-codex agents)
- All Tier 2b dispatches run simultaneously (12 cli-codex agents)
- Tier 2c dispatches T-050, T-051, T-052 can run simultaneously (different surfaces)
- Tier 3 git renames + path sweep can run alongside Tier 2c if scoped carefully (different file sets)
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Spec folder validated | `validate.sh --strict` exit 0 on packet 040 | End of Tier 1 |
| M2 | Tier 2a + 2b complete | 20 cli-codex dispatches succeeded; 28 reference files + 11 playbooks + 4 catalogs remediated | End of wave 2b verify |
| M3 | Tier 2c complete | 5 high-effort dispatches succeeded; 4 user-flagged surfaces resolved | End of wave 2c verify |
| M4 | Templates cleanup + path sweep complete | Zero hits for legacy paths | End of Tier 3 |
| M5 | Sweep complete | All P0 + ≥90% P1 checklist items checked with evidence | End of Tier 4 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the full ADR set (D-001 through D-006).

---

<!--
LEVEL 3 PLAN
- Tiered execution with bounded waves
- Single-file scope for high-effort dispatches
- Critical-path identified
-->
