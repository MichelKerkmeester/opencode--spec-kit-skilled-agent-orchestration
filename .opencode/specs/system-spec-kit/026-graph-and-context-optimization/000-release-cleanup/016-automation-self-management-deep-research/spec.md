---
title: "Research Charter: Automation & Self-Management of Advisor, Code-Graph, sk-doc, Memory"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Deep research charter: how truly automated, auto-called, auto-reindexed, and auto-utilized are the skill advisor, code graph, system-spec-kit, and the database/graph/memory feature surfaces? Ground every claim in file:line evidence."
trigger_phrases:
  - "016-automation-self-management-deep-research"
  - "automation deep research"
  - "skill advisor automation"
  - "code graph automation"
  - "system-spec-kit automation"
  - "memory automation deep research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/016-automation-self-management-deep-research"
    last_updated_at: "2026-04-29T14:10:33+02:00"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Completed automation reality research"
    next_safe_action: "Use research/research-report.md Planning Packet to seed remediation phase for aspirational gaps"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Research Charter: Automation & Self-Management

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `026-graph-and-context-optimization` |
| **Mode** | Deep research (`/spec_kit:deep-research:auto` pattern) |
| **Iterations** | 7 (max); convergence allowed earlier |
| **Executor** | cli-codex `gpt-5.5` reasoning=`xhigh` service-tier=null (normal) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The system-spec-kit + skill advisor + code-graph + memory subsystems are documented as "auto-managing" in many places (hook injection, auto-reindexing, auto-routing, auto-prioritizing, etc.). But how much of that is **actually automatic at runtime** vs **operator-triggered** vs **manual fallback**? Specifically:

- **Skill advisor**: When does it actually fire? Is the gate-2 routing always-on or hook-dependent? When is the advisor scoring re-tuned? Who calls `skill_advisor.py` vs the hook?
- **Code graph**: Is the graph auto-reindexed on file changes (via watcher / hooks)? Or does it require manual `code_graph_scan`? What triggers staleness detection? What auto-recovers a degraded graph?
- **system-spec-kit**: Are spec folders auto-validated? Auto-indexed by memory_search? Are continuity blocks auto-refreshed? When does `generate-context.js` run automatically vs manually?
- **Memory / database**: Auto-reindexing on changes? Auto-cleanup of stale entries? Auto-checkpoints? Auto-causal-graph updates?
- **Hooks** (skill advisor hook, session-stop, gate-3 classifier): When are they wired vs not? What's the "if hook unavailable, fall back to..." chain?

### Purpose

Run a 7-iteration deep research loop that produces an **automation reality map** for each subsystem:

For each automation claim found in docs/code, determine:
- **Auto-fires**: triggered without operator intervention; cite the trigger
- **Operator-triggered**: requires explicit invocation; cite the entry point
- **Half-automated**: triggered automatically in some paths, requires manual fallback in others; cite both
- **Documented but absent**: claim exists in docs/READMEs but no runtime path supports it; flag as P0/P1

Output: a triage of which automation claims hold, which are partial, which are aspirational, and recommended remediation for the gap-of-the-decade items.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (research questions)

- **RQ1 — Skill advisor automation**: Catalog every entry point that invokes the advisor. Distinguish hook-based (auto on prompt entry) vs CLI-based (`skill_advisor.py`) vs MCP-based (`advisor_recommend` tool) vs scoring-tuner (`doctor:skill-advisor` command). When does each fire? What's the chain when the hook is unavailable per runtime (Claude/Copilot/Codex/Gemini/OpenCode)?
- **RQ2 — Code graph automation**: Catalog `code_graph_scan` (full + incremental + hot-fix), `code_graph_status` (readiness probe), `code_graph_verify`, `ensureCodeGraphReady` (the readiness gate inside graph reads), file-watcher (chokidar) auto-trigger paths, `doctor:code-graph` apply-mode. Distinguish "fires automatically when graph stale" vs "operator must invoke `code_graph_scan`."
- **RQ3 — system-spec-kit automation**: Catalog `validate.sh --strict`, `generate-context.js` (canonical save), `is_phase_parent` detection, `_memory.continuity` refresh, post-save quality review. When do spec docs get re-indexed into memory_search? When do graph-metadata.json + description.json get auto-refreshed?
- **RQ4 — Database/memory automation**: Catalog `memory_save`, `memory_index_scan`, `memory_match_triggers`, `session_bootstrap`, checkpoint creation, retention/cleanup, causal-graph link inference, drift detection. What auto-fires vs requires manual call?
- **RQ5 — Hook system reality**: For each runtime (Claude / Copilot / Codex / Gemini / OpenCode plugin bridge), confirm which hooks are actually wired in production. What's the fall-back chain? Is the skill advisor hook reliable across all runtimes?
- **RQ6 — Cross-cutting auto-wiring gaps**: Are there features documented as "auto" but with no runtime path? Conversely, are there auto behaviors that aren't documented anywhere?
- **RQ7 — Synthesis and recommendation matrix**: For each subsystem, produce a 4-column reality map: claim / actual behavior / gap-class (auto / half / manual / aspirational) / recommended action.

### Out of Scope (research only)

- Implementing fixes to surfaced gaps (research-only; downstream remediation phase will implement)
- Changing runtime behavior of any subsystem
- Re-running stress tests
- Touching skill advisor scoring tables (`doctor:skill-advisor` is research-only here)
- Modifying any prior packet content (read-only on existing packets)

### Files to Read (representative; iterations may add more)

- Skill advisor:
  - `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`
  - `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts`
  - `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
  - `.opencode/skill/system-spec-kit/references/config/hook_system.md`
- Code graph:
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/{query,scan,verify,status}.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/watcher/`
  - `.opencode/command/doctor/assets/doctor_code-graph_*.yaml`
- system-spec-kit:
  - `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
  - `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` source
  - `.opencode/skill/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts`
  - `.opencode/skill/system-spec-kit/SKILL.md`
- Memory/DB:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-{save,search,context,crud,index-scan}.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoint.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/causal/`
- Hook wiring:
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/`
  - `.opencode/hooks/`
  - `.claude/settings.local.json` (if any) for runtime config
  - `.codex/`, `.gemini/`, `.opencode/agent/` for per-runtime hook surfaces
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none)

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 7 iterations produce externalized state. | Numbered iteration files under `research/iterations/` and matching JSONL deltas under `research/deltas/`. |
| REQ-002 | Each iteration has a focused angle. | Iter focus map in `research/deep-research-strategy.md`; each iter cites focus + new findings. |
| REQ-003 | Convergence detected honestly. | Final iter records stop reason + newInfoRatio sequence. |
| REQ-004 | RQ1-RQ7 each have a 4-column reality-map answer. | claim / actual behavior / gap-class / recommended-action; at least 8 rows per subsystem. |
| REQ-005 | Every "auto-fires" claim has a triggering file:line citation. | Code path traced from event source to the automation it claims to drive. |
| REQ-006 | Every "documented but absent" finding gets P0/P1 severity. | These are the highest-leverage findings. |
| REQ-007 | Per-runtime hook reality (RQ5) covered for all 5 CLI runtimes + native. | Each runtime has its own row; "unwired" status documented honestly. |
| REQ-008 | Final research-report.md authored with 9-section structure + Planning Packet. | Report passes deep-research skeleton: Executive Summary, RQs Answered, Top Workstreams, Cross-System Insights, Active Findings Registry, Planning Packet, Convergence Audit, Sources, Open Questions. |

### Acceptance Scenarios

1. **Given** the research completes, **when** a reviewer opens `research/research-report.md`, **then** each RQ1-RQ7 has a direct 4-column reality-map answer with file:line citations.
2. **Given** a "documented but absent" automation gap is found, **when** synthesis runs, **then** the finding carries P0 or P1 severity and is included in the Planning Packet for downstream remediation.
3. **Given** Phase L planning needs an automation baseline, **when** a reviewer reads the Planning Packet, **then** they can prioritize remediation without re-running this research.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 7 iter files + 7 delta files written.
- **SC-002**: Convergence event recorded with newInfoRatio sequence.
- **SC-003**: Research report enumerates RQ1-RQ7 reality maps with file:line citations.
- **SC-004**: Strict validator exits 0 on this packet.
- **SC-005**: Planning Packet enables a follow-on remediation phase to act without re-investigating sources.

### Acceptance Scenarios

- **SCN-001**: **Given** an "auto-reindex on file change" claim is found in a README, **when** the research traces the code path, **then** either a watcher file:line is cited OR the finding is marked "documented but absent" with P1.
- **SCN-002**: **Given** a hook is documented for a runtime, **when** the research checks the runtime's config, **then** "wired" or "unwired" status is documented with config-file:line evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | xhigh reasoning + 7 iters can drift into speculation if grounding is weak | Per-iter file:line citations are MANDATORY; speculation findings get severity ≤ P2 |
| Risk | "Automation" is a fuzzy term | The 4-class taxonomy (auto / half / manual / aspirational) tightens the definition |
| Risk | Hook reality varies wildly across runtimes (Claude vs Copilot vs OpenCode) | RQ5 is dedicated to per-runtime reality; one row per runtime |
| Dependency | Phase H/I/J/K work shipped on main today | All 16 commits committed |
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

### Security
- **NFR-S01**: No secrets, credentials, or external service tokens are required.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A "claim" found in CLAUDE.md vs SKILL.md vs README.md may differ; surface inconsistency as a separate finding.
- A hook wired in `settings.local.json` but not in `settings.json` is a per-operator config, not a runtime contract; document as such.
- A feature that fires "auto" only in DEV mode but requires manual trigger in production: classify as half-automated.

### Error Scenarios
- A claim is found in docs but the code path can't be traced: mark "documented but absent" with severity per consequence (P0 if it would mislead operators; P1 if it's stale doc).
- An auto-fire claim is found but the trigger requires a feature flag that's not enabled by default: half-automated.
- Validator failure: repair packet-local docs only; do not modify runtime code or prior packets.

### State Transitions
- Planned → Complete: state log gets 7 iteration events plus `synthesis_complete`.
- Research → remediation: final Planning Packet seeds a downstream phase without applying runtime changes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | Research spans advisor + code-graph + sk-doc + memory + hooks across 5 runtimes |
| Risk | 12/25 | Research-only; no runtime code modifications |
| Research | 18/20 | 7 focused iterations with source citations and synthesis |
| **Total** | **52/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Q1: Should the 4-class taxonomy be 4 (auto/half/manual/aspirational) or 5 (with "operator-triggered" distinct from "manual")? **Default**: 4 classes; "operator-triggered" = "manual" for this research's purposes.
- Q2: Should hook reality be tested empirically (run something and observe) or just documentation-traced? **Default**: documentation + code-trace only; empirical hooks-fire-when-expected testing is out-of-scope (would be a separate stress cycle).
- Q3: Should the research probe "what gets auto-fired in normal session" vs "what happens after user types specific phrase"? **Default**: both — RQ5 covers the per-runtime entry-point reality.
<!-- /ANCHOR:questions -->
