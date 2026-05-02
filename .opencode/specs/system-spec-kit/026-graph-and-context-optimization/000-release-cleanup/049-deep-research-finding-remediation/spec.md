---
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: 049 Deep-Research Finding Remediation (Phase Parent) [template:level_2/spec.md]"
description: "Phase parent that closes the 78 remaining findings (27 P1 + 51 P2) from packet 046's 20-iteration deep research. Decomposes the work across 10 sub-phase children grouped by subsystem so each child stays a tractable Level 2 packet."
trigger_phrases:
  - "049 deep research finding remediation"
  - "F-001 through F-020 remediation"
  - "046 followup"
  - "phase parent 049"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation"
    last_updated_at: "2026-05-01T07:20:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Phase parent + 10 children scaffolded; manifest authored"
    next_safe_action: "Author each child spec.md, then execute sub-phases in waves (Wave 1: 002,004,008,009,010 / Wave 2: 001,003,005,007 / Wave 3: 006)"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/046-system-deep-research-bugs-and-improvements/research/research.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/048-iter-001-daemon-concurrency-fixes/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-orchestration"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Feature Specification: 049 Deep-Research Finding Remediation (Phase Parent)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (Phase Parent) |
| **Priority** | P1 (aggregate of P1+P2 findings) |
| **Status** | In Progress |
| **Created** | 2026-05-01 |
| **Branch** | `main` (no feature branch — direct work on main per project policy) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 046's 20-iteration deep research surfaced 82 findings (0 P0, 31 P1, 51 P2) across daemon concurrency, code-graph consistency, advisor quality, validators, deep-loop workflows, search tuning, tests, architecture, topology, and CLI orchestrator skills. Packet 048 closed 4 findings (F-001-A1-01..04). The remaining 78 findings (27 P1 + 51 P2) need to be addressed without dropping product correctness, stress-test reliability, or the strict spec-validation contract.

### Purpose
Land surgical product-code, schema, doc, and test fixes for all 78 remaining findings so the system-spec-kit ships into release with a clean P1+P2 backlog. Every fix is real code change; no comment-only resolutions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 78 findings spanning F-002, F-003-A3-01..03, F-004-A4-01..04, F-005-A5-01..06, F-006-B1-01..03, F-007-B2-01..06, F-008-B3-01..02, F-009-B4-01..05, F-010-B5-01..04, F-011-C1-01..05, F-012-C2-01..04, F-013-C3-01, F-014-C4-01..04, F-015-C5-01..06, F-016-D1-01..08, F-017-D2-01..03, F-018-D3-01..04, F-019-D4-01..03, F-020-D5-01..04
- 10 sub-phase Level-2 packets under this parent, each with full spec/plan/tasks/checklist/impl-summary
- Stress tests added for every P1 product-code finding
- Targeted vitest runs after each sub-phase + full `npm run stress` between waves
- Strict validation per child packet
- One commit per sub-phase pushed immediately to `origin main`

### Out of Scope
- Architectural rewrites that exceed surgical scope — F-016-D1-06 (split watcher) gets minimal change; deeper refactor deferred to a follow-on packet and documented in the relevant child's implementation-summary
- F-001-A1-01..04 (already closed in 048)
- New deep research; this packet is remediation-only

### Files to Change (subsystem map)

| Sub-phase | Subsystem | Primary file roots |
|-----------|-----------|--------------------|
| 001 | code_graph SQLite atomicity, staleness, error fallback | `mcp_server/code_graph/lib/{ensure-ready,code-graph-db,code-graph-context}.ts`, `mcp_server/code_graph/handlers/query.ts` |
| 002 | YAML state machine + parent metadata | `command/spec_kit/assets/spec_kit_deep-{research,review}_auto.yaml`, `scripts/memory/generate-context.ts` |
| 003 | Advisor scorer + regression fixture | `skill_advisor/lib/scorer/{lanes/graph-causal,projection,fusion,ambiguity}.ts`, `skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` |
| 004 | Validator scripts + memory parser + advisor schemas | `scripts/rules/check-{spec-doc-integrity,evidence,template-headers}.sh`, `mcp_server/lib/parsing/memory-parser.ts`, `mcp_server/handlers/causal-links-processor.ts`, `mcp_server/skill_advisor/{schemas/advisor-tool-schemas,handlers/advisor-validate}.ts`, `mcp_server/formatters/search-results.ts`, `mcp_server/lib/storage/checkpoints.ts` |
| 005 | Watcher unwatch + queue caps + scorer projection fallback | `skill_advisor/lib/daemon/watcher.ts` (selective), `skill_advisor/lib/scorer/projection.ts`, `mcp_server/lib/ops/file-watcher.ts` |
| 006 | Boundary cleanup + cycle break + schema dedup | `mcp_server/lib/{skill-graph/skill-graph-db,context/shared-payload,resume/resume-ladder,session/session-snapshot,graph/community-summaries}.ts`, `mcp_server/skill_advisor/lib/{compat/daemon-probe,freshness/{rebuild-from-source,trust-state},scorer/{lanes/derived,types},corpus/df-idf,daemon/watcher,skill-advisor-brief}.ts`, `mcp_server/{context-server,tool-schemas}.ts` |
| 007 | Phase topology + dist alignment + MJS bridge | `command/spec_kit/assets/spec_kit_implement_auto.yaml`, `mcp_server/lib/spec/is-phase-parent.ts`, `.opencode/plugins/spec-kit-skill-advisor.js`, `scripts/evals/check-source-dist-alignment.ts`, `mcp_server/dist/tests/search-quality/harness.js` (orphan), `mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` |
| 008 | Search-quality reranking + metrics | `mcp_server/{stress_test/search-quality/metrics,lib/search/{rerank-gate,cross-encoder,cocoindex-calibration,pipeline/stage2-fusion}}.ts` |
| 009 | Test reliability | `mcp_server/stress_test/{session/gate-d-resume-perf,session/gate-d-benchmark-session-resume,skill-advisor/opencode-plugin-bridge-stress}.vitest.ts`, `mcp_server/tests/{envelope,hybrid-search-flags,memory-save-pipeline-enforcement}.vitest.ts` |
| 010 | CLI orchestrator skill docs + templates | `skill/cli-{opencode/SKILL.md,opencode/references/agent_delegation.md,copilot/SKILL.md,codex/assets/prompt_templates.md,claude-code/assets/prompt_templates.md,gemini/assets/prompt_templates.md}` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional
- FR-1: Every one of the 78 findings appears in at least one sub-phase's `implementation-summary.md` "Findings closed" table OR is documented as "deferred (reason)" / "already remediated by NNN".
- FR-2: Every P1 finding that is product code (not pure doc) ships with at least one stress test that would have failed against the pre-fix code, mirroring packet 048's pattern.
- FR-3: Each sub-phase commit includes the finding IDs in its message body.

### Non-Functional
- NFR-1: `npm run stress` (run from `.opencode/skill/system-spec-kit/mcp_server/`) stays at 56+ files / 163+ tests / exit 0 throughout. Baseline confirmed at 56/163 before this packet.
- NFR-2: `validate.sh --strict` exits 0 for every sub-phase before its commit.
- NFR-3: All commits push to `origin main` immediately. No giant final push.

### Constraints
- Stay on `main`; every `create.sh` uses `--skip-branch`.
- Use `cli-codex gpt-5.5 high` (normal speed) for any synthesis work; never `service_tier=fast`.
- Architectural rewrites > surgical scope are deferred to follow-on packets.
- F-016-D1-06 (full watcher split) is out of scope; sub-phase 006 applies the minimal extraction step.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:phase-doc-map -->
## 5. PHASE DOCUMENTATION MAP

| Phase | Folder | Scope | Findings (count) | Status |
|---|---|---|---:|---|
| 001 | `001-code-graph-consistency/` | code_graph SQLite atomicity, staleness, error fallback | F-002-A2-01..03, F-014-C4-01..04, F-004-A4-02..03 (9) | Pending |
| 002 | `002-deep-loop-workflow-state/` | YAML state machine, lock cleanup, parent metadata | F-010-B5-01..04, F-019-D4-01 (5) | Pending |
| 003 | `003-advisor-quality/` | hook drift, scorer fusion, regression fixture | F-006-B1-01..03, F-012-C2-01..04, F-013-C3-01 (8) | Pending |
| 004 | `004-validation-and-memory/` | validator parsers, memory parser, schema gaps | F-008-B3-01..02, F-009-B4-01..05, F-005-A5-01..06 (13) | Pending |
| 005 | `005-resource-leaks-silent-errors/` | watcher unwatch, queue caps, scorer projection fallback | F-003-A3-01..03, F-004-A4-01, F-004-A4-04 (5) | Pending |
| 006 | `006-architecture-cleanup/` | boundary discipline, cycle breaks, schema dedup | F-016-D1-01..08, F-017-D2-01..03, F-018-D3-01..04 (15) | Pending |
| 007 | `007-topology-build-boundary/` | spec topology, dist alignment, MJS bridge | F-019-D4-02..03, F-020-D5-01..04 (6) | Pending |
| 008 | `008-search-quality-tuning/` | rerank gate, NDCG, candidate windowing, learned blend | F-011-C1-01..05 (5) | Pending |
| 009 | `009-test-reliability/` | env snapshots, mkdtemp roots, deterministic timing | F-015-C5-01..06 (6) | Pending |
| 010 | `010-cli-orchestrator-drift/` | OpenCode/Copilot/Codex/Claude-Code/Gemini SKILL.md + templates | F-007-B2-01..06 (6) | Pending |
| **Total** | — | — | **78** | — |

> Findings F-001-A1-01..04 are excluded — already closed by packet 048.

### Wave Plan

- **Wave 1 (parallel, no overlap):** 002, 004, 008, 009, 010 — five independent sub-phases
- **Wave 2 (parallel, no overlap with Wave 1):** 001, 003, 005, 007 — four independent sub-phases
- **Wave 3 (sequential after Waves 1-2):** 006 — architecture cleanup, biggest blast radius

Sub-phases 001, 005, 006 share `mcp_server/skill_advisor/lib/daemon/watcher.ts` — sequenced across waves so they never write that file in parallel. Sub-phases 003, 006 share scorer files — sequenced.
<!-- /ANCHOR:phase-doc-map -->

---

<!-- ANCHOR:transitions -->
## 6. PHASE TRANSITION CRITERIA

| From | To | Criteria | Verification |
|---|---|---|---|
| Wave 1 | Wave 2 | Sub-phases 002, 004, 008, 009, 010 each: `validate.sh --strict` exit 0 + targeted vitest pass + commit pushed to main + spec docs complete | Sub-phase implementation-summary status = Complete |
| Wave 2 | Wave 3 | Sub-phases 001, 003, 005, 007 each: `validate.sh --strict` exit 0 + targeted vitest pass + commit pushed | Sub-phase implementation-summary status = Complete |
| Wave 3 | Done | Sub-phase 006 complete + full `npm run stress` exit 0 / 56+ files / 163+ tests | Final master implementation-summary aggregates all 10 + total finding count |
<!-- /ANCHOR:transitions -->

---

<!-- ANCHOR:edges -->
## 7. EDGE CASES & FAILURE MODES

| Edge | Trigger | Expected behavior |
|------|---------|-------------------|
| Finding location drifted | A finding's cited line range no longer matches current code | Sub-phase agent reads surrounding context, locates the new line, applies the fix, and notes the drift in implementation-summary |
| Finding already remediated | Adjacent packet (e.g. 047, 048) already closed it | Sub-phase notes "already remediated by NNN" in implementation-summary, skips without claiming new credit, does not double-count |
| Stress run fails | `npm run stress` regresses | Wave halts. Triage which sub-phase introduced the failure; revert minimum surgical change; re-attempt with smaller scope |
| Template architectural rewrite required | Finding's "real fix" exceeds surgical scope | Apply minimal step, document larger refactor as deferred in sub-phase implementation-summary §Known Limitations |
<!-- /ANCHOR:edges -->

---

<!-- ANCHOR:effort -->
## 8. EFFORT ESTIMATION

| Sub-phase | Findings | Files touched (approx) | Effort (hours, single dev) |
|-----------|---------:|----------------------:|---------------------------:|
| 001 | 9 | 4 | 4-6 |
| 002 | 5 | 3 | 2-3 |
| 003 | 8 | 5 | 3-5 |
| 004 | 13 | 8 | 5-7 |
| 005 | 5 | 3 | 2-3 |
| 006 | 15 | 14 | 6-9 |
| 007 | 6 | 6 | 3-4 |
| 008 | 5 | 5 | 3-4 |
| 009 | 6 | 6 | 2-3 |
| 010 | 6 | 6 | 2-3 |
| **Aggregate** | **78** | **~60** | **32-47** |

Multi-day work in serial; multi-hour with disciplined parallel waves.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:success -->
## 9. SUCCESS CRITERIA

- [ ] All 10 sub-phase children present with valid spec/plan/tasks/checklist/implementation-summary docs.
- [ ] `validate.sh --strict` exit 0 on every sub-phase.
- [ ] Every one of the 78 findings has a row in some sub-phase's implementation-summary or is documented deferred/already-remediated.
- [ ] `npm run stress` exit 0 with at least 56 files / 163 tests at completion.
- [ ] All commits pushed to `origin main`.
- [ ] Final master implementation-summary at `049/implementation-summary.md` aggregates findings closed, deferred, files modified, commit hashes.
<!-- /ANCHOR:success -->

---

<!-- ANCHOR:open-questions -->
## 10. OPEN QUESTIONS

- None blocking. The five strategic questions in research.md §15 (multi-process SQLite, mixed-intent advisor routing, perf thresholds in CI, phase-parent threshold, dist scope) are out of scope for this remediation packet and will be answered by future strategic work.
<!-- /ANCHOR:open-questions -->

---

<!--
CORE TEMPLATE: Phase Parent (lean trio policy — only spec.md, description.json, graph-metadata.json live at parent root). Heavy docs (plan/tasks/checklist/implementation-summary) live in each child. The level-2 trio created by --subfolder at this root will be removed; spec.md is the manifest, description.json + graph-metadata.json are auto-generated metadata.

HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
