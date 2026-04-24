---
title: "T [system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/001-deep-review-and-remediation/tasks]"
description: "Task Format: T### [P?] Description (file path or finding ref). All 243 findings mapped to actionable tasks across 11 workstreams."
trigger_phrases:
  - "remediation tasks"
  - "015 tasks"
  - "finding tasks"
  - "workstream tasks"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/001-deep-review-and-remediation"
    last_updated_at: "2026-04-16T12:00:00Z"
    last_updated_by: "claude-opus-4.6"
    recent_action: "Created granular task list covering all 243 findings"
    next_safe_action: "Begin executing Workstream 0 tasks"
    blockers:
      - "T001 P0 blocker must complete before release"
    key_files:
      - "review/review-report.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:tasks-v1-2026-04-16"
      session_id: "remediation-planning-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 015 Deep Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
| `[D]` | Deferred with reason |

**Task Format**: `T### [P?] Description (finding ref)`
**Finding refs**: `S3.X#Y` = review-report.md Section 3.X, finding #Y
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:ws-0 -->
## Workstream 0: P0 Reconsolidation Scope-Boundary Fix (1 finding)

- [ ] T001 [P0] Add scope-field validation (`tenant_id`, `user_id`, `agent_id`, `session_id`) before merge in `reconsolidation-bridge.ts:208` (S2, S3.2#1)
- [ ] T002 [P0] Abort reconsolidation and preserve both records on scope mismatch (S2)
- [ ] T003 [P0] Add regression test: cross-scope merge attempt must be rejected (`reconsolidation-bridge.vitest.ts`) (S2)
- [ ] T004 [P0] Audit all callers of reconsolidation-bridge for scope-boundary assumptions (S2)
- [ ] T005 [P0] **Verify**: existing reconsolidation tests still pass after fix (S2)
<!-- /ANCHOR:ws-0 -->

---

<!-- ANCHOR:ws-0b -->
## Workstream 0b: Path-Boundary Hardening (5 findings)

- [ ] T010 [P1] [P] Add `path.resolve()` + `startsWith(allowedRoot)` guard to `validateMergeLegality()` and `validatePostSaveFingerprint()` (S3.15, S3.5#3 iter 8)
- [ ] T011 [P1] [P] Reject symlinks in `resolveDatabasePaths()` or resolve via `realpathSync` and re-validate (`core/config.ts:45-83`) (S3.15, S3.13#11 iter 15)
- [ ] T012 [P1] [P] Add workspace-root boundary check to `skill_graph_scan` dispatch (S3.15, S3.1#4 iter 23, S3.2#6 iter 20)
- [ ] T013 [P1] [P] Reject absolute `specFolder` values outside packet roots in resume handlers (`resume-ladder.ts:523`) (S3.8#1 iter 21)
- [ ] T014 [P1] [P] Reject absolute path candidates in `keepKeyFile()` / `buildKeyFileLookupPaths()` or normalize to repo-relative (`graph-metadata-parser.ts:395,562,1021`) (S3.5#1 iter 2, S3.13#1-3 iter 2)
- [ ] T015 [P1] Add regression tests for each path-escape vector (5 tests minimum) (S3.15)
- [ ] T016 [P1] **Verify**: all existing path-related tests still pass (S3.15)
<!-- /ANCHOR:ws-0b -->

---

<!-- ANCHOR:ws-0c -->
## Workstream 0c: Public-Contract Verification (8 findings)

- [ ] T020 [P1] [P] Diff `tool-schemas.ts` field lists against actual handler response shapes for all tool families (S3.14#1, S3.2#8 iter 44)
- [ ] T021 [P1] [P] Fix `deep_loop_graph_status` to return promised `schemaVersion` and DB-size fields, or update schema to match reality (S3.14#1 iter 1, S3.7#1 iter 1)
- [ ] T022 [P1] [P] Fix `tool-input-schemas.ts` runtime contract divergence for later tool families (S3.2#8 iter 44)
- [ ] T023 [P1] [P] Fix or remove dead L9 coverage-graph tool registrations in `tools/index.ts` (S3.7#1 iter 1)
- [ ] T024 [P1] Verify every README/SKILL.md entrypoint path resolves to existing file on disk (S3.14)
- [ ] T025 [P1] Cross-check agent runtime directories across all 4 runtimes (S3.14)
- [ ] T026 [P1] Fix compact recovery hook clearing cache before stdout flush (`session-prime.ts`) (S3.14#2 iter 15, S3.13#10 iter 15)
- [ ] T027 [P1] Extend `tool-input-schema.vitest.ts` to cover `code_graph_*`, `skill_graph_*`, `ccc_*` families (S3.6#41 iter 44)
- [ ] T028 [P1] **Verify**: schema-validation suite passes after fixes (S3.14)
<!-- /ANCHOR:ws-0c -->

---

<!-- ANCHOR:ws-1 -->
## Workstream 1: Status Drift Cleanup (28 findings)

### 1a. Packet 009 Status (4 findings: 2 P1, 2 P2)

- [ ] T030 [P1] [P] Fix 009/003 contradictory completion status across spec.md, plan.md, graph-metadata.json (S3.3#1 iter 1)
- [ ] T031 [P1] [P] Fix 009/001 closed-as-complete while required checklist item still open (S3.3#9 iter 32)
- [ ] T032 [P2] [P] Fix 009/003 fragmented closeout evidence across task/checklist surfaces (S3.3#16 iter 34)
- [ ] T033 [P2] [P] Fix 009/003 missing single closeout narrative surface (S3.3#18 iter 38)

### 1b. Packet 010 Status (10 findings: 5 P1, 5 P2)

- [ ] T034 [P1] [P] Fix 010/002 child phases 001-003 `planned` status after delivery (S3.3#2 iter 3)
- [ ] T035 [P1] [P] Fix 010/003 closeout docs pointing at wrong root packet (S3.3#3 iter 6)
- [ ] T036 [P1] [P] Fix 010/003 child packets 006/007 `planned` after closure (S3.3#4 iter 11)
- [ ] T037 [P1] [P] Fix 010/001 child packets leaving plan.md in `planned` after closeout (S3.3#5 iter 13)
- [ ] T038 [P1] [P] Fix 010/002 phases 005/006 still advertising `planned` (S3.3#6 iter 27, S3.3#10 iter 35)
- [ ] T039 [P2] [P] Fix 010/002/005 resolved security-boundary questions still phrased as open (S3.3#14 iter 23)
- [ ] T040 [P2] [P] Fix 010/003 root closeout evidence not tracing full child set (S3.3#15 iter 33)
- [ ] T041 [P2] [P] Fix sampled complete 010 child summaries with template placeholders (S3.3#21 iter 42)
- [ ] T042 [P2] [P] Fix 010/001 `planned` status due to bundled Codex mirror sync (S3.3#19 iter 39)
- [ ] T043 [P2] [P] Fix placeholder closeout metadata (`closed_by_commit: TBD`) across 010 phases (S3.3#26 iter 47)

### 1c. Packet 012 Status (3 findings: 1 P1, 2 P2)

- [ ] T044 [P1] [P] Fix 012 tasks.md marking deferred integration tests as completed (S3.3#7 iter 28)
- [ ] T045 [P2] [P] Fix 012 broad tool grant normalized in closeout narrative (S3.3#13 iter 20)
- [ ] T046 [P2] [P] Fix 012 recording deferred manual verification as completed (S3.3#22 iter 43)

### 1d. Cross-Cutting Status Code (5 findings: 3 P1, 2 P2)

- [ ] T047 [P1] Fix `determineSessionStatus()` false-completion on clean worktree (`collect-session-data.ts:408`) (S3.3#8 iter 31)
- [ ] T048 [P1] Fix deep-review executing deferred `completed-continue` path on completed sessions (S3.3#11 iter 35)
- [ ] T049 [P1] Fix `/complete` debug-escalation path wired to generic agent instead of `@debug` (S3.3#12 iter 43)
- [ ] T050 [P2] Fix command parity tests to detect lifecycle behavior drift beyond token presence (S3.3#17 iter 35)
- [ ] T051 [P2] Fix `spec_kit_complete_auto.yaml` duplicated `D)` option in debug-escalation prompt (S3.3#23 iter 43)

### 1e. Remaining Cross-Cutting Status (6 findings: 1 P1, 5 P2)

- [ ] T052 [P2] Fix parity coverage skipping `/complete` command assets (S3.3#24 iter 43)
- [ ] T053 [P2] Fix 012 ghost M13 maintenance surface reference (S3.3#25 iter 44)
- [ ] T054 [P2] Fix incomplete mode menu for `/improve:prompt` (S3.3#27 iter 51)
- [ ] T055 [P2] Fix deep-research/deep-review stale `fork`/`completed-continue` references (S3.3#28 iter 67)
- [ ] T056 [P2] Fix 009/003 completed packet lacking implementation summary (S3.3#20 iter 42)
- [ ] T057 [P1] **Verify**: zero status contradictions remain after batch updates (S3.3)
<!-- /ANCHOR:ws-1 -->

---

<!-- ANCHOR:ws-2 -->
## Workstream 2: Packet 014 Identity Fix (5 findings)

- [ ] T060 [P1] [P] Replace `SC-016` with `SC-014` in 014/spec.md:217 (S3.4#1 iter 5)
- [ ] T061 [P1] [P] Replace `CHK-016-*` with `CHK-014-*` in 014/checklist.md:199 (S3.4#3 iter 7)
- [ ] T062 [P1] [P] Fix 014 traceability surfaces carrying `016` lineage (014/tasks.md:47, tasks.md:54) (S3.4#2 iter 33, S3.4#4 iter 43)
- [ ] T063 [P2] [P] Fix 014 changelog carrying `016` identity (S3.4#5 iter 49)
- [ ] T064 [P2] Verify no cross-contamination with actual 016 packet if it exists (S3.4)
- [ ] T065 [P1] **Verify**: `grep -r "016" 014-memory-save-rewrite/` returns zero hits after fixes (S3.4)
<!-- /ANCHOR:ws-2 -->

---

<!-- ANCHOR:ws-3 -->
## Workstream 3: Command & Workflow Integrity (16 findings)

### 3a. YAML Workflow Fixes (10 P1)

- [ ] T070 [P1] [P] Fix frontmatter YAML comment stripping in `parseSectionValue` (`frontmatter-migration.ts:581`) (S3.1#1 iter 12)
- [ ] T071 [P1] [P] Fix quoted trigger phrase YAML serialization (`frontmatter-migration.ts:627,1170`) (S3.1#2 iter 12)
- [ ] T072 [P1] [P] Fix `spec_kit_implement_{auto,confirm}` default scope blocking non-spec code edits (S3.1#3 iter 16)
- [ ] T073 [P1] [P] Fix `skill_graph_scan` traversing outside workspace — security guard missing (S3.1#4 iter 23)
- [ ] T074 [P1] [P] Fix `/spec_kit:resume` cross-scope memory metadata disclosure (S3.1#5 iter 26)
- [ ] T075 [P1] Fix `runWorkflow()` quality score override bug (`workflow.ts:1082`) (S3.1#6 iter 31)
- [ ] T076 [P1] Fix 250ms dispatch graph-context timeout not actually capping latency (`context-server.ts:631`) (S3.1#7 iter 36)
- [ ] T077 [P1] Fix `/create:feature-catalog` root filename disagreement (S3.1#8 iter 51)
- [ ] T078 [P1] Fix `doctor_mcp_install.yaml` stale `guide_section` labels (S3.1#9 iter 52)
- [ ] T079 [P1] Fix 10 YAML files referencing `spec_kit_memory_memory_save(...)` instead of `memory_save` (S3.1#10 iter 53)

### 3b. Doc/Template Fixes (4 P1, 2 P2)

- [ ] T080 [P1] Fix `config_checklist.md` JSONC validation commands unsafe for real JSONC (S3.1#11 iter 66)
- [ ] T081 [P1] Fix `sk-doc` command scaffolding teaching multiline `description` (S3.1#12 iter 67)
- [ ] T082 [P1] Fix Gate 3 carry-over rule drift across root runtime docs (S3.1#13 iter 70)
- [ ] T083 [P1] Fix root docs pointing at non-existent `generate-context.js` entrypoint (S3.1#14 iter 70)
- [ ] T084 [P2] Fix implement workflow contradicting itself about `implementation-summary.md` for Level 1 (S3.1#15 iter 4)
- [ ] T085 [P2] Fix resume.md overstated as modified file in M13 change trace (S3.1#16 iter 28)

### 3c. Verification

- [ ] T086 [P1] **Verify**: all YAML workflows reference only live MCP tools (S3.1)
- [ ] T087 [P1] **Verify**: `validate.sh --strict` passes for all affected command assets (S3.1)
<!-- /ANCHOR:ws-3 -->

---

<!-- ANCHOR:ws-4 -->
## Workstream 4: Error Handling & Security Hardening (12 findings)

### 4a. Error Handling (7 findings: 3 P1, 4 P2)

- [ ] T090 [P1] Fix absolute `specFolder` resume handlers reading outside packet roots (`resume-ladder.ts:523`) (S3.8#1 iter 21)
- [ ] T091 [P1] Fix `discover_graph_metadata()` failing open on corrupt skill metadata (`skill_graph_compiler.py:50`) (S3.8#2 iter 27)
- [ ] T092 [P1] Fix `get_cached_skill_records()` silently dropping unreadable SKILL.md while reporting healthy (`skill_advisor_runtime.py:38`) (S3.8#3 iter 27)
- [ ] T093 [P2] [P] Fix `session_bootstrap` silently converting malformed child payloads to `{}` while reporting `"full"` (S3.8#4 iter 29)
- [ ] T094 [P2] [P] Fix `extractSpecTitle()` silently discarding read/parse failures (`title-builder.ts:67`) (S3.8#5 iter 39)
- [ ] T095 [P2] [P] Fix dataset-shape validation divergence between bench and regression scripts (S3.8#6 iter 42)
- [ ] T096 [P2] Fix `session-prime` silently hiding startup-brief regressions (`session-prime.ts:35`) (S3.8#7 iter 44)

### 4b. Security (5 findings: 1 P1, 4 P2)

- [ ] T097 [P1] Verify NFR-S05 fail-closed lock control with actual code evidence, not just docs (`012 spec.md:382`) (S3.9#1 iter 16)
- [ ] T098 [P2] [P] Add transcript snapshot hygiene as packet-local security requirement in 014 (S3.9#2 iter 22)
- [ ] T099 [P2] [P] Add artifact sanitization requirement to 009 execution-artifact retention spec (S3.9#3 iter 22)
- [ ] T100 [P2] Fix `sanitizeTriggerPhrases()` order-sensitive shadow removal (`trigger-phrase-sanitizer.ts:190`) (S3.9#5 iter 40)
- [ ] T101 [P2] **Verify**: no new security regressions introduced (S3.9)
<!-- /ANCHOR:ws-4 -->

---

<!-- ANCHOR:ws-5 -->
## Workstream 5: Traceability & Evidence Gaps (25 findings)

### 5a. Evidence & Cross-Reference Fixes (10 P1)

- [ ] T110 [P1] Fix `keepKeyFile()` / `buildKeyFileLookupPaths()` accepting absolute paths (S3.5#1 iter 2, covered also by T014)
- [ ] T111 [P1] Fix `handleMemoryStats` regex vs literal substring mismatch (S3.5#2 iter 6)
- [ ] T112 [P1] Fix checkpoint scoped restore using wrong database handle for causal edges (`checkpoints.ts:849`) (S3.5#3 iter 7)
- [ ] T113 [P1] Fix `SPEC_DOC_SUFFICIENCY` ignoring anchor-parse failures (`spec-doc-structure.ts:665`) (S3.5#4 iter 8)
- [ ] T114 [P1] Fix `generate-context` silent retargeting of multi-segment spec path by basename (`generate-context.ts:477`) (S3.5#5 iter 10)
- [ ] T115 [P1] Wire post-save reviewer into production scripts pipeline (`workflow.ts:1242`) (S3.5#6 iter 11)
- [ ] T116 [P1] Fix 010/002/004 Tier 3 docs contradicting 014 opt-in/manual-review guard (S3.5#7 iter 25)
- [ ] T117 [P1] Fix `renderDashboard()` unescaped metadata injection in human review surface (`wave-coordination-board.cjs:487`) (S3.5#8 iter 25)
- [ ] T118 [P1] Fix 014 checklist evidence not tracing to first-order proof surfaces (S3.5#9 iter 29, S3.5#10 iter 31)
- [ ] T119 [P1] Fix 010/003/006 broadened pruning rule beyond approved contract (S3.5#11 iter 36)

### 5b. Additional P1 Traceability (5 P1)

- [ ] T120 [P1] Fix 010/003/007 expanded runtime-name rejection list beyond requirement surface (S3.5#12 iter 36)
- [ ] T121 [P1] Fix `gate-d-regression-intent-routing.vitest.ts` not exercising live canonical-filtering (S3.5#13 iter 47)
- [ ] T122 [P1] Fix `memory-search-integration.vitest.ts` being source-text snapshot instead of integration suite (S3.5#14 iter 49)
- [ ] T123 [P1] Fix `sk-code-full-stack` Node.js/React Native/Swift templates still being browser-web (S3.5#15 iter 66)
- [ ] T124 [P1] **Verify**: every checklist item has traceable file:line evidence (S3.5)

### 5c. P2 Traceability (10 P2)

- [ ] T125 [P2] [P] Fix 014 machine-readable evidence indexing only exposing 1 of 3 transcript proofs (S3.5#16 iter 31)
- [ ] T126 [P2] [P] Fix pipeline tests leaving traceability regressions unguarded (S3.5#17 iter 31)
- [ ] T127 [P2] [P] Fix 014 packet-verification evidence not self-locating (S3.5#18 iter 37)
- [ ] T128 [P2] [P] Fix 009/001 checklist evidence using shorthand placeholders (S3.5#19 iter 38)
- [ ] T129 [P2] [P] Fix 010 graph metadata carrying heading-shaped/stopword entities (S3.5#20 iter 39)
- [ ] T130 [P2] [P] Fix canonical packet truth depending on excluded review artifact (S3.5#21 iter 40)
- [ ] T131 [P2] [P] Fix description.json noisy `memoryNameHistory` (S3.5#22 iter 40)
- [ ] T132 [P2] [P] Fix line-for-line duplicate runtime-capabilities resolver (S3.5#23 iter 41)
- [ ] T133 [P2] [P] Fix deep-review parity suite not exercising resolver module (S3.5#24 iter 41)
- [ ] T134 [P2] Fix wrong follow-up command name `/doctor:mcp_install` -> `/doctor:mcp_debug` (S3.5#25 iter 51)
<!-- /ANCHOR:ws-5 -->

---

<!-- ANCHOR:ws-6 -->
## Workstream 6: Stale References & Placeholder Cleanup (26 findings)

### 6a. Stale References — P1 (8 findings from S3.7)

- [ ] T140 [P1] Fix dead `deep_loop_graph_*` MCP tool surface — registered in schemas but never in tools/index.ts (S3.7#1 iter 1)
- [ ] T141 [P1] [P] Fix 009/001 stale `Phase 014` / `014-playbook-prompt-rewrite` references (S3.7#2 iter 2)
- [ ] T142 [P1] Fix `MEMORY METADATA` inline comments overriding real tier with stale defaults (`frontmatter-migration.ts:1032`) (S3.7#3 iter 12)
- [ ] T143 [P1] Fix cross-anchor contamination validating against stale route names (`spec-doc-structure.ts:138`) (S3.7#4 iter 30)
- [ ] T144 [P1] Fix `includeArchived` dead code in keyword/multi-concept search (`vector-index-queries.ts:343`) (S3.7#5 iter 34)
- [ ] T145 [P1] Fix stale canonical plan link in 009/003 pointing at nonexistent 016 packet (S3.7#6 iter 42)
- [ ] T146 [P1] Fix Claude agent-delegation reference advertising removed agent IDs `speckit`/`research` (S3.7#7 iter 64)
- [ ] T147 [P1] Fix stale Gate 3 phase-boundary rule in CLAUDE.md conflicting with shared contract (S3.7#8 iter 69)

### 6b. Placeholder Residue — P1 (4 findings from S3.10)

- [ ] T148 [P1] [P] Fix malformed copy-paste commands in Copilot prompt templates (`prompt_templates.md:105,255`) (S3.10#1 iter 65)
- [ ] T149 [P1] [P] Fix Code Mode env-var contract contradiction with unprefixed onboarding examples (`config_template.md:347`) (S3.10#2 iter 65)
- [ ] T150 [P1] [P] Fix feature-catalog templates generating `FEATURE_CATALOG.md` vs live `feature_catalog.md` (S3.10#3 iter 67)
- [ ] T151 [P1] Fix broken Level 1 copy command in `template_mapping.md` (S3.10#4 iter 68)

### 6c. Stale References — P2 (13 findings from S3.7)

- [ ] T152 [P2] [P] Fix 014 machine-readable freshness stale against canonical metadata pair (S3.7#9 iter 7)
- [ ] T153 [P2] [P] Fix post-save-review coverage too shallow to catch dead wiring (S3.7#10 iter 11)
- [ ] T154 [P2] [P] Fix 009/001 checklist deferring CHK-052 to deprecated `memory/` path (S3.7#11 iter 26)
- [ ] T155 [P2] [P] Fix dead branch in adjacency construction (`coverage-graph-signals.cjs:89`) (S3.7#12 iter 40)
- [ ] T156 [P2] [P] Fix `gate-d-regression-memory-tiers.vitest.ts` pre-filtering failure case (S3.7#13 iter 47)
- [ ] T157 [P2] [P] Fix 010/003 stale lineage aliases in checklist (S3.7#14 iter 49)
- [ ] T158 [P2] [P] Fix stale runtime note about `.agents/agents` symlink in create commands (S3.7#15 iter 51)
- [ ] T159 [P2] [P] Fix changelog workflow stale `370+` scale claim (S3.7#16 iter 52)
- [ ] T160 [P2] [P] Fix mcp-chrome-devtools broad `pkill` recipe in troubleshooting (S3.7#17 iter 60)
- [ ] T161 [P2] [P] Fix Copilot CLI stale default-model statement (`cli_reference.md:132`) (S3.7#18 iter 64)
- [ ] T162 [P2] [P] Fix dead sibling `../prompt_templates.md` reference across 4 prompt quality cards (S3.7#19 iter 65)
- [ ] T163 [P2] [P] Fix stale `sk-code-web` parent-skill label in sk-code-full-stack checklists (S3.7#20 iter 66)
- [ ] T164 [P2] Fix stale continuity contract in `level_decision_matrix.md` referencing `memory/` folders (S3.7#21 iter 68)

### 6d. Placeholder Residue — P2 (1 finding from S3.10)

- [ ] T165 [P2] Fix sk-doc skill-template assets self-contradictory anchor convention examples (S3.10#5 iter 68)

### 6e. Verification

- [ ] T166 [P1] **Verify**: grep for known stale patterns returns zero hits (S3.7, S3.10)
<!-- /ANCHOR:ws-6 -->

---

<!-- ANCHOR:ws-7 -->
## Workstream 7: Agent & Skill Doc Refresh (37 findings)

### 7a. Agent Definition Alignment (21 P1)

- [ ] T170 [P1] Update deep-review agent docs + reducer to match live iteration schema (S3.2 Opus#1 iter 56)
- [ ] T171 [P1] Add `@context` LEAF-only guardrail to 3 root docs (AGENTS.md, CODEX.md, GEMINI.md) (S3.2 Opus#2 iter 69)
- [ ] T172 [P1] [P] Fix graph-metadata-parser accepting paths verbatim without normalization (S3.2#2 iter 2)
- [ ] T173 [P1] [P] Fix `skill_advisor.py` accepting invalid `--semantic-hits/--cocoindex-hits` as success (S3.2#3 iter 4)
- [ ] T174 [P1] [P] Fix reducer schema-drift crash outside fail-closed path (`reduce-state.cjs:39`) (S3.2#4 iter 14)
- [ ] T175 [P1] [P] Fix `skill_advisor_bench.py` mis-parsing prompts starting with `-` (S3.2#5 iter 17)
- [ ] T176 [P1] [P] Fix `skill_graph_scan` filesystem-hash DoS + workspace escape (S3.2#6 iter 20)
- [ ] T177 [P1] Fix deep-review capability resolver advertising legacy `agents` runtime (S3.2#7 iter 28)
- [ ] T178 [P1] Fix published schema vs runtime contract for later tool families (S3.2#8 iter 44, covered also by T022)
- [ ] T179 [P1] [P] Fix Claude agent mirrors hardcoding OpenCode agent-definition paths (S3.2#9 iter 54)
- [ ] T180 [P1] [P] Fix Gemini runtime mirrors still sending readers to `.opencode/agent/*.md` (S3.2#10 iter 55, S3.2#11 iter 57)
- [ ] T181 [P1] Fix review/orchestration docs requiring nonexistent `sk-code` baseline skill (S3.2#12 iter 57)
- [ ] T182 [P1] Fix cli-claude-code pointing Claude delegations at OpenCode directory (S3.2#13 iter 58)
- [ ] T183 [P1] Fix mcp-clickup unprefixed env vars vs Code Mode requirement (S3.2#14 iter 58)
- [ ] T184 [P1] Fix sk-deep-research missing Gemini runtime path in capability matrix (S3.2#15 iter 59)
- [ ] T185 [P1] Fix cli-claude-code README pointing custom-agent authors at wrong directory (S3.2#16 iter 60)
- [ ] T186 [P1] Fix cli-claude-code documenting agent names not in mirrored inventories (S3.2#17 iter 61)
- [ ] T187 [P1] Fix cli-copilot/SKILL.md normalizing full-autonomy as default (S3.2#18 iter 61)
- [ ] T188 [P1] Fix deep-research capability matrix contradicting its machine-readable source (S3.2#19 iter 62)
- [ ] T189 [P1] Establish single source-of-truth contract for cross-runtime agent definitions (S3.11#1 iter 56)
- [ ] T190 [P1] **Verify**: all 4 runtime agent directories consistent after fixes (S3.2)

### 7b. Agent & Skill Doc — P2 (16 findings)

- [ ] T191 [P2] [P] Fix `top1_accuracy` excluding empty-result failures from denominator (S3.2#20 iter 4)
- [ ] T192 [P2] [P] Fix `reviewPostSaveQuality()` unable to escalate PSR baseline HIGH findings (S3.2#21 iter 11)
- [ ] T193 [P2] [P] Fix `replay-runner.cjs` issues (S3.2#22 iter 18)
- [ ] T194 [P2] [P] Fix `skill_graph_query` returning raw `SkillNode` with `sourcePath`/`contentHash` (S3.2#23 iter 20)
- [ ] T195 [P2] [P] Fix wave-segment-state accepting empty-string merge identifiers (S3.2#24 iter 25)
- [ ] T196 [P2] [P] Fix `handleMemorySave()` near-duplicate dry-run branches (S3.2#25 iter 37)
- [ ] T197 [P2] [P] Fix duplicate reviewer check ID `DUP5` for two unrelated drift classes (S3.2#26 iter 39)
- [ ] T198 [P2] [P] Fix quality scorer hard-coding double-quoted frontmatter title parser (S3.2#27 iter 39)
- [ ] T199 [P2] [P] Fix semantic contract drift across short-term allowlists (S3.2#28 iter 40)
- [ ] T200 [P2] [P] Clean up three orphaned simulation helpers (S3.2#29 iter 40)
- [ ] T201 [P2] [P] Fix two harnesses duplicating local infrastructure (S3.2#30 iter 42)
- [ ] T202 [P2] [P] Fix deep-research/review skills anchoring to CLAUDE.md (S3.2#31 iter 59)
- [ ] T203 [P2] [P] Fix mcp-code-mode README self-contradicting tool surface (S3.2#32 iter 60)
- [ ] T204 [P2] [P] Fix cli-copilot inconsistent auth guidance (S3.2#33 iter 61)
- [ ] T205 [P2] [P] Fix hook_system.md overstating Codex runtime parity (S3.2#34 iter 63)
- [ ] T206 [P2] [P] Fix non-Copilot agent-catalog banners claiming "9" instead of 10 agents (S3.2#35 iter 64)
- [ ] T207 [P2] [P] Fix ClickUp tool-count summary internal inconsistency (S3.2#36 iter 65)
- [ ] T208 [P2] Fix Go backend checklists naming wrong parent skill (S3.2#37 iter 65)
<!-- /ANCHOR:ws-7 -->

---

<!-- ANCHOR:ws-8 -->
## Workstream 8: Test Quality Improvements (47 findings)

### 8a. P1 Test Fixes (11 findings)

- [ ] T210 [P1] Fix `coverage_gaps` reporting wrong thing for review graphs (S3.6#1 iter 2)
- [ ] T211 [P1] Fix deep-review reducer dropping `blendedScore` from convergence (S3.6#2 iter 3)
- [ ] T212 [P1] Fix content-router cache test not varying context fields (S3.6#3 iter 9)
- [ ] T213 [P1] Fix intent-classifier accuracy gate excluding 2 of 7 intents (S3.6#4 iter 32, S3.6#9 iter 48)
- [ ] T214 [P1] Fix `reconsolidation-bridge.vitest.ts` not testing planner-default safety branch (S3.6#5 iter 33)
- [ ] T215 [P1] Fix archived constitutional filtering test hard-coding broken behavior (S3.6#6 iter 34)
- [ ] T216 [P1] Fix `causal-fixes.vitest.ts` not testing production `relations` filter path (S3.6#7 iter 45)
- [ ] T217 [P1] Fix `context-server.vitest.ts` testing shadow `parseArgs()` copy (S3.6#8 iter 46)
- [ ] T218 [P1] Fix cross-encoder silent-skip guards letting API disappearance pass (S3.6#10 iter 50)
- [ ] T219 [P1] Fix adaptive-fusion tests not verifying result ordering when enabled (S3.6 Opus#1 iter 45)
- [ ] T220 [P1] **Verify**: all P1 test fixes pass in vitest run (S3.6)

### 8b. P2 Test Improvements — False Positives (12 findings)

- [ ] T221 [P2] [P] Fix `deep_loop_graph_query` collapsing two query modes into same branch (S3.6#11 iter 1)
- [ ] T222 [P2] [P] Fix test net string-based approach missing broken coverage-graph surface (S3.6#12 iter 1)
- [ ] T223 [P2] [P] Fix archived coverage-graph "tests" being stubs not live checks (S3.6#13 iter 2)
- [ ] T224 [P2] [P] Fix false-positive regression expectations in merge tests (S3.6#21 iter 13)
- [ ] T225 [P2] [P] Fix false-positive regression test in `graph-aware-stop.vitest.ts` (S3.6#23 iter 14)
- [ ] T226 [P2] [P] Fix false-positive hook coverage in `hook-session-start.vitest.ts` (S3.6#25 iter 15)
- [ ] T227 [P2] [P] Fix false-positive parameter tests in `handler-memory-triggers.vitest.ts` (S3.6#44 iter 48)
- [ ] T228 [P2] [P] Fix `handler-helpers.vitest.ts` silently skipping coverage on import fail (S3.6#43 iter 47)
- [ ] T229 [P2] [P] Fix `gate-d-regression-memory-tiers.vitest.ts` pre-filtering failure case (S3.6#13b iter 47)
- [ ] T230 [P2] [P] Fix `n3lite-consolidation.vitest.ts` positive heuristic path unpinned (S3.6#45 iter 49)
- [ ] T231 [P2] [P] Fix `T12` validating hand-built `DegradedModeContract` instead of real branch (S3.13#34 iter 45)
- [ ] T232 [P2] [P] Fix `search-limits-scoring.vitest.ts` source-text assertions where behavior needed (S3.6#46 iter 50)

### 8c. P2 Test Improvements — Missing Coverage (14 findings)

- [ ] T233 [P2] [P] Fix test coverage skewed toward helpers, not shipped wrapping path (S3.6#14 iter 3)
- [ ] T234 [P2] [P] Fix `handleCoverageGraphStatus` fail-open on signal computation errors (S3.6#15 iter 5)
- [ ] T235 [P2] [P] Fix `search-archival.vitest.ts` signature-only checks (S3.6#16 iter 7)
- [ ] T236 [P2] [P] Fix `getRelatedMemories` no positive-path coverage (S3.6#17 iter 7)
- [ ] T237 [P2] [P] Fix whitespace-only trigger phrases counting as coverage (S3.6#18 iter 8)
- [ ] T238 [P2] [P] Fix `test-template-comprehensive.js` using local stub instead of production renderer (S3.6#19 iter 10)
- [ ] T239 [P2] [P] Fix frontmatter regression coverage missing exact failure modes (S3.6#20 iter 12)
- [ ] T240 [P2] [P] Fix missing edge-case coverage for astral Unicode and grapheme inputs (S3.6#22 iter 13)
- [ ] T241 [P2] [P] Fix missing coverage for parseable schema corruption (S3.6#24 iter 14)
- [ ] T242 [P2] [P] Fix `test-phase-command-workflows.js` string-presence-only checks (S3.6#26 iter 16)
- [ ] T243 [P2] [P] Fix skill-advisor harnesses lacking direct automated coverage (S3.6#27 iter 17)
- [ ] T244 [P2] [P] Add dedicated schema/dispatcher coverage for `skill_graph_*` (S3.6#30 iter 23)
- [ ] T245 [P2] [P] Fix handler-memory-list-edge/triggers tests missing filter interaction (S3.6#31 iter 26)
- [ ] T246 [P2] [P] Add automated test files for `skill_advisor` scripts (S3.6#32 iter 27)

### 8d. P2 Test Improvements — Assertions & Depth (11 findings)

- [ ] T247 [P2] [P] Add executable coverage for deep-review `runtime-capabilities.cjs` (S3.6#33 iter 28)
- [ ] T248 [P2] [P] Fix test surface not exercising non-progress route categories (S3.6#34 iter 30)
- [ ] T249 [P2] [P] Fix `memory-context.vitest.ts` source-text assertions instead of runtime path (S3.6#35 iter 32)
- [ ] T250 [P2] [P] Fix `hybrid-search.vitest.ts` smoke-test-strength integration contracts (S3.6#36 iter 32)
- [ ] T251 [P2] [P] Fix `search-limits-scoring.vitest.ts` source-grep names overstating coverage (S3.6#37 iter 33)
- [ ] T252 [P2] [P] Fix `vector-index-impl.vitest.ts` hard-coded `EMBEDDING_DIM` (S3.6#38 iter 34)
- [ ] T253 [P2] [P] Fix `context-server-error-envelope.vitest.ts` pure source-regex test (S3.6#39 iter 36)
- [ ] T254 [P2] [P] Fix `search-flags.ts` outgrown dedicated parser coverage (S3.6#40 iter 38)
- [ ] T255 [P2] Fix shadow scheduler tests missing concurrency/singleton guards (S3.6#47 iter 50)
- [ ] T256 [P2] Fix `resume-ladder.vitest.ts` only testing workspace-relative paths (S3.6#29 iter 21)
- [ ] T257 [P2] **Verify**: `npx vitest run` passes with no silent skips (S3.6)
<!-- /ANCHOR:ws-8 -->

---

<!-- ANCHOR:ws-other -->
## Cross-Cutting: Other Findings (S3.13 items distributed above or listed here)

The "Other" category (S3.13, 44 findings) has been distributed to their natural workstreams. The following items from S3.13 are tracked in workstreams above:

| S3.13 Finding | Mapped To |
|---------------|-----------|
| S3.13#1-3 (absolute path indexing) | T014 (WS 0b) |
| S3.13#4 (future-date timestamp) | T152 (WS 6) |
| S3.13#5 (over-budget payloads) | T020 (WS 0c) |
| S3.13#6-7 (cache replay bugs) | T212, T075 (WS 3, 8) |
| S3.13#8 (009/003 -> 016 lineage) | T145 (WS 6) |
| S3.13#9 (Unicode truncation) | T240 (WS 8) |
| S3.13#10-11 (compact recovery, DB paths) | T026 (WS 0c), T011 (WS 0b) |
| S3.13#12 (bounded search contract) | T075 (WS 3) |
| S3.13#13 (009/003 plan lineage) | T145 (WS 6) |
| S3.13#14 (session_resume minimal) | T020 (WS 0c) |
| S3.13#15 (DB path import-time) | T011 (WS 0b) |
| S3.13#16 (memory_stats regex) | T111 (WS 5) |
| S3.13#17 (Gate D benchmarks) | T255 (WS 8) |
| S3.13#18 (mcp-code-mode README) | T203 (WS 7) |
| S3.13#19 (folder_routing.md) | T164 (WS 6) |
| S3.13#20 (structure refs memory/) | T164 (WS 6) |
| S3.13#21-44 (remaining P2) | Various WS 3-8 tasks |

### Reducer & State (S3.12, 1 finding)

- [ ] T260 [P2] Fix deep-research advertising wrong archive root (`state_paths.archive_root`) (S3.12#1 iter 35)
<!-- /ANCHOR:ws-other -->

---

<!-- ANCHOR:summary-stats -->
## Task Summary

| Workstream | P0 | P1 | P2 | Total Tasks |
|-----------|-----|-----|-----|-------------|
| 0: P0 fix | 5 | 0 | 0 | 5 |
| 0b: Path hardening | 0 | 7 | 0 | 7 |
| 0c: Contract verify | 0 | 9 | 0 | 9 |
| 1: Status drift | 0 | 8 | 20 | 28 |
| 2: 014 identity | 0 | 4 | 2 | 6 |
| 3: Command integrity | 0 | 14 | 4 | 18 |
| 4: Error/security | 0 | 4 | 8 | 12 |
| 5: Traceability | 0 | 15 | 10 | 25 |
| 6: Stale refs | 0 | 13 | 14 | 27 |
| 7: Agent/skill docs | 0 | 21 | 18 | 39 |
| 8: Test quality | 0 | 11 | 38 | 49 |
| Cross-cutting | 0 | 0 | 1 | 1 |
| **Total** | **5** | **106** | **115** | **226** |

Note: Some review findings map to multiple tasks (fix + verify); some related findings consolidate into single tasks. The 226 tasks cover all 243 original findings plus verification tasks.
<!-- /ANCHOR:summary-stats -->
