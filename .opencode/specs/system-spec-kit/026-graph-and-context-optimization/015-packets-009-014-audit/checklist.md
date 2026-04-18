---
title: "Verification Checklist: 015 Deep Review Remediation"
description: "Quality gates for 243-finding remediation across 11 workstreams. P0 blocker, per-workstream completion, cross-cutting quality, release readiness."
trigger_phrases:
  - "remediation checklist"
  - "015 checklist"
  - "review remediation verification"
  - "release readiness"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-packets-009-014-audit"
    last_updated_at: "2026-04-16T12:00:00Z"
    last_updated_by: "claude-opus-4.6"
    recent_action: "Created verification checklist for 11-workstream remediation"
    next_safe_action: "Execute P0 remediation then verify CHK-001 through CHK-006"
    blockers:
      - "P0 blocker must pass before any release consideration"
    key_files:
      - "review/review-report.md"
      - "tasks.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:checklist-v1-2026-04-16"
      session_id: "remediation-planning-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 015 Deep Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:p0-blocker -->
## P0 Blocker Verification (MUST PASS BEFORE ANY RELEASE)

- [ ] CHK-001 [P0] Reconsolidation-bridge scope-boundary validation added before merge decision point
  - Evidence: `reconsolidation-bridge.ts` contains scope-field comparison at/before line 208
- [ ] CHK-002 [P0] Cross-scope merge attempt is rejected (candidate + survivor preserved separately)
  - Evidence: New test case in `reconsolidation-bridge.vitest.ts` passes with cross-scope inputs
- [ ] CHK-003 [P0] Governance metadata preserved on all reconsolidation survivors
  - Evidence: `tenant_id`, `user_id`, `agent_id`, `session_id` present in merged record
- [ ] CHK-004 [P0] All existing reconsolidation tests still pass after fix
  - Evidence: `npx vitest run reconsolidation-bridge` exit 0
- [ ] CHK-005 [P0] Caller audit complete -- no other code paths assume same-scope without checking
  - Evidence: Grep for `reconsolidation` callers shows all paths validated
- [ ] CHK-006 [P0] `validate.sh --strict` passes for the MCP server package
  - Evidence: Exit 0
<!-- /ANCHOR:p0-blocker -->

---

<!-- ANCHOR:ws-0b-verify -->
## Workstream 0b: Path-Boundary Hardening

- [ ] CHK-010 [P1] Folder-scoped validators reject absolute paths outside allowed root
  - Evidence: Regression test with `/tmp/malicious/spec.md` returns error
- [ ] CHK-011 [P1] `resolveDatabasePaths()` rejects or resolves symlinks safely
  - Evidence: Symlink-escape test passes
- [ ] CHK-012 [P1] `skill_graph_scan` cannot traverse outside workspace root
  - Evidence: Out-of-workspace scan test returns error
- [ ] CHK-013 [P1] Resume handlers reject absolute `specFolder` outside packet roots
  - Evidence: Absolute-path resume test returns error
- [ ] CHK-014 [P1] `keepKeyFile()` rejects or normalizes absolute path candidates
  - Evidence: Absolute path input normalized or rejected in test
- [ ] CHK-015 [P1] Five path-escape regression tests all pass
  - Evidence: `npx vitest run` exit 0 for boundary tests
<!-- /ANCHOR:ws-0b-verify -->

---

<!-- ANCHOR:ws-0c-verify -->
## Workstream 0c: Public-Contract Verification

- [ ] CHK-020 [P1] Every `tool-schemas.ts` field has matching handler response field
  - Evidence: Schema diff produces zero mismatches
- [ ] CHK-021 [P1] Dead tool registrations removed or implemented
  - Evidence: `tools/index.ts` registers only tools with live handlers
- [ ] CHK-022 [P1] Every README/SKILL.md entrypoint path resolves to existing file
  - Evidence: Path-resolution sweep returns zero broken refs
- [ ] CHK-023 [P1] Agent runtime directories consistent across all 4 runtimes
  - Evidence: Cross-runtime diff shows no directory mismatches
- [ ] CHK-024 [P1] Schema-validation test covers all tool families
  - Evidence: `tool-input-schema.vitest.ts` tests `code_graph_*`, `skill_graph_*`, `ccc_*`
<!-- /ANCHOR:ws-0c-verify -->

---

<!-- ANCHOR:ws-1-verify -->
## Workstream 1: Status Drift Cleanup

- [ ] CHK-030 [P1] Zero status contradictions between `spec.md`/`plan.md` frontmatter and `graph-metadata.json`
  - Evidence: Automated scan of all 4 packets returns zero drift findings
- [ ] CHK-031 [P1] Zero `closed_by_commit: TBD` placeholders in implementation summaries
  - Evidence: `grep -r "TBD" */implementation-summary.md` returns empty
- [ ] CHK-032 [P1] `determineSessionStatus()` no longer marks sessions complete on clean worktree alone
  - Evidence: Test with clean worktree + unresolved next steps returns non-COMPLETED
- [ ] CHK-033 [P1] Deep-review does not execute `completed-continue` on already-completed sessions
  - Evidence: Completed session does not trigger deferred path
- [ ] CHK-034 [P1] `/complete` debug-escalation routes to `@debug`, not generic agent
  - Evidence: YAML file references correct agent path
- [ ] CHK-035 [P2] All deferred manual verification items clearly marked as deferred (not `[x]`)
  - Evidence: 012 tasks.md deferred items show `[D]` or equivalent
- [ ] CHK-036 [P1] `validate.sh --strict` passes for all 4 packets after status updates
  - Evidence: Exit 0 on 009, 010, 012, 014
<!-- /ANCHOR:ws-1-verify -->

---

<!-- ANCHOR:ws-2-verify -->
## Workstream 2: Packet 014 Identity Fix

- [ ] CHK-040 [P1] Zero `SC-016` references in 014 packet
  - Evidence: `grep -r "SC-016" 014-memory-save-rewrite/` returns empty
- [ ] CHK-041 [P1] Zero `CHK-016` references in 014 packet
  - Evidence: `grep -r "CHK-016" 014-memory-save-rewrite/` returns empty
- [ ] CHK-042 [P1] Zero `Packet 016` / `packet-016` references in 014 packet
  - Evidence: `grep -ri "packet.016" 014-memory-save-rewrite/` returns empty
- [ ] CHK-043 [P1] `validate.sh --strict` passes for 014 after identity fix
  - Evidence: Exit 0
<!-- /ANCHOR:ws-2-verify -->

---

<!-- ANCHOR:ws-3-verify -->
## Workstream 3: Command & Workflow Integrity

- [ ] CHK-050 [P1] Zero YAML files reference `spec_kit_memory_memory_save`
  - Evidence: `grep -r "spec_kit_memory_memory_save" .opencode/command/` returns empty
- [ ] CHK-051 [P1] `doctor_mcp_install.yaml` section labels match actual install guide headings
  - Evidence: Manual cross-check or automated label-verification
- [ ] CHK-052 [P1] `runWorkflow()` quality score matches pipeline-calculated score
  - Evidence: Test case verifying `filterStats.qualityScore` propagates correctly
- [ ] CHK-053 [P1] Dispatch graph-context timeout actually caps tool-call latency
  - Evidence: Test with slow query respects 250ms cap
- [ ] CHK-054 [P1] Frontmatter YAML comment stripping works for list-style values
  - Evidence: `parseSectionValue` test with inline comments passes
- [ ] CHK-055 [P1] Quoted trigger phrases serialize to valid YAML
  - Evidence: Round-trip test with quoted phrases produces parseable output
- [ ] CHK-056 [P1] Root docs reference existing `generate-context.js` entrypoint
  - Evidence: Path referenced in CLAUDE.md/AGENTS.md exists on disk
- [ ] CHK-057 [P1] Gate 3 carry-over rules consistent across all root runtime docs
  - Evidence: Diff of Gate 3 section across root docs shows no contradictions
- [ ] CHK-058 [P2] Implementation-summary.md Level 1 mandate consistent across implement workflows
  - Evidence: Both auto/confirm variants agree on Level 1 requirements
<!-- /ANCHOR:ws-3-verify -->

---

<!-- ANCHOR:ws-4-verify -->
## Workstream 4: Error Handling & Security Hardening

- [ ] CHK-060 [P1] `discover_graph_metadata()` reports corruption instead of silent success
  - Evidence: Corrupt metadata test produces error/warning, not empty success
- [ ] CHK-061 [P1] `get_cached_skill_records()` reports dropped SKILL.md in health check
  - Evidence: Unreadable SKILL.md test shows degraded health status
- [ ] CHK-062 [P1] NFR-S05 fail-closed lock verified with code evidence (not just docs)
  - Evidence: Test or code audit confirming lock behavior
- [ ] CHK-063 [P1] No silent error swallowing in reviewed error handlers
  - Evidence: `session_bootstrap`, `extractSpecTitle`, `session-prime` all propagate errors
- [ ] CHK-064 [P2] `sanitizeTriggerPhrases()` produces same result regardless of input order
  - Evidence: Permutation test passes
- [ ] CHK-065 [P2] Agent tool permissions tightened from `--allow-all-tools` where appropriate
  - Evidence: cli-copilot SKILL.md no longer normalizes full autonomy as default
<!-- /ANCHOR:ws-4-verify -->

---

<!-- ANCHOR:ws-5-verify -->
## Workstream 5: Traceability & Evidence Gaps

- [ ] CHK-070 [P1] Every packet checklist item has `file:line` evidence reference
  - Evidence: Automated scan finds zero evidence-free checklist items
- [ ] CHK-071 [P1] All required implementation summaries exist (009/003, etc.)
  - Evidence: `ls */implementation-summary.md` confirms presence
- [ ] CHK-072 [P1] Post-save reviewer wired into production `workflow.ts` pipeline
  - Evidence: `workflow.ts` calls post-save-review functions
- [ ] CHK-073 [P1] `SPEC_DOC_SUFFICIENCY` fails on malformed anchors instead of ignoring
  - Evidence: Malformed anchor test returns failure
- [ ] CHK-074 [P1] `generate-context` does not silently retarget multi-segment paths
  - Evidence: Explicit multi-segment path test resolves to correct packet
- [ ] CHK-075 [P1] `renderDashboard()` escapes metadata before embedding in HTML surface
  - Evidence: Injection-attempt test produces escaped output
- [ ] CHK-076 [P1] All cross-reference links in spec docs resolve to existing targets
  - Evidence: Link-resolution sweep returns zero broken refs
- [ ] CHK-077 [P2] Node.js/React Native/Swift stack templates are not browser-web copies
  - Evidence: Stack-specific content verified in each template
<!-- /ANCHOR:ws-5-verify -->

---

<!-- ANCHOR:ws-6-verify -->
## Workstream 6: Stale References & Placeholder Cleanup

- [ ] CHK-080 [P1] Dead `deep_loop_graph_*` tool surface resolved (registered or removed)
  - Evidence: `tools/index.ts` and `tool-schemas.ts` are in sync
- [ ] CHK-081 [P1] Zero `Phase 014` / `014-playbook-prompt-rewrite` refs in 009/001
  - Evidence: grep returns empty
- [ ] CHK-082 [P1] Cross-anchor contamination validates against live 8-category router
  - Evidence: Route-name list in validator matches content-router categories
- [ ] CHK-083 [P1] `includeArchived` either functional or removed from API
  - Evidence: Code review or test confirms behavior
- [ ] CHK-084 [P1] 009/003 plan link points to existing spec (not nonexistent 016)
  - Evidence: `parent_spec` path resolves on disk
- [ ] CHK-085 [P1] Removed agent IDs (`speckit`, `research`) no longer in delegation docs
  - Evidence: grep returns empty
- [ ] CHK-086 [P1] CLAUDE.md Gate 3 rule matches shared runtime contract
  - Evidence: Diff of Gate 3 section produces no contradictions
- [ ] CHK-087 [P1] Copilot prompt template commands are valid (no collapsed flags)
  - Evidence: Manual or automated syntax check of template commands
- [ ] CHK-088 [P1] Code Mode env-var examples use correct prefixed names
  - Evidence: `config_template.md` and `env_template.md` use prefixed vars
- [ ] CHK-089 [P1] Feature-catalog template generates correct filename (`feature_catalog.md`)
  - Evidence: Template output matches live package convention
- [ ] CHK-090 [P1] Level 1 copy command in `template_mapping.md` is syntactically valid
  - Evidence: Command runs without error
- [ ] CHK-091 [P2] Known stale patterns (grep sweep) return zero hits
  - Evidence: Comprehensive stale-pattern grep returns empty
<!-- /ANCHOR:ws-6-verify -->

---

<!-- ANCHOR:ws-7-verify -->
## Workstream 7: Agent & Skill Doc Refresh

- [ ] CHK-100 [P1] Deep-review agent docs + reducer match live iteration schema
  - Evidence: Reducer processes current-format iteration artifacts correctly
- [ ] CHK-101 [P1] `@context` LEAF-only guardrail documented in all 4 root docs
  - Evidence: grep for LEAF-only in each root doc returns hit
- [ ] CHK-102 [P1] All 4 runtime agent directories consistent (same agent count, same definitions)
  - Evidence: Cross-runtime diff produces zero functional differences
- [ ] CHK-103 [P1] Claude/Gemini agent mirrors reference their own runtime directories
  - Evidence: No `.opencode/agent/` refs in `.claude/agents/` or `.gemini/agents/`
- [ ] CHK-104 [P1] `sk-code` baseline skill reference resolves to actual catalog entry
  - Evidence: Skill name in review/orchestration docs exists in skill inventory
- [ ] CHK-105 [P1] mcp-clickup env vars use correct prefixed names
  - Evidence: SKILL.md env-var section uses Code Mode prefixed names
- [ ] CHK-106 [P1] cli-copilot default invocation is NOT full-autonomy
  - Evidence: SKILL.md core pattern uses scoped permissions
- [ ] CHK-107 [P1] Single source-of-truth for cross-runtime agent definitions established
  - Evidence: Documentation or convention clearly designates canonical source
- [ ] CHK-108 [P2] Agent-catalog counts match actual inventory across all runtimes
  - Evidence: Banner numbers match `ls *.md | wc -l` in each agent directory
<!-- /ANCHOR:ws-7-verify -->

---

<!-- ANCHOR:ws-8-verify -->
## Workstream 8: Test Quality Improvements

- [ ] CHK-110 [P1] `coverage_gaps` reports correctly for review graphs
  - Evidence: Review-graph test produces expected gap output
- [ ] CHK-111 [P1] Deep-review reducer preserves `blendedScore` in convergence output
  - Evidence: Reducer output includes `blendedScore` field
- [ ] CHK-112 [P1] Intent-classifier accuracy gate includes all 7 public intents
  - Evidence: Test accuracy denominator counts all 7 intents
- [ ] CHK-113 [P1] `reconsolidation-bridge.vitest.ts` exercises planner-default safety branch
  - Evidence: Test case for planner-default scenario exists and passes
- [ ] CHK-114 [P1] Constitutional filtering test catches actual broken behavior
  - Evidence: Test fails when filtering is broken (not hard-coded to pass)
- [ ] CHK-115 [P1] `context-server.vitest.ts` imports and tests shipped `parseArgs()`
  - Evidence: Test imports from production module, not local copy
- [ ] CHK-116 [P1] Cross-encoder contract tests fail when exported API is missing
  - Evidence: Removing export causes test failure (not silent skip)
- [ ] CHK-117 [P1] Adaptive-fusion enabled-mode tests verify result ordering changes
  - Evidence: Test asserts different ranking between standard and adaptive modes
- [ ] CHK-118 [P1] Zero false-positive tests in flagged suites
  - Evidence: Each P1-flagged test verified to fail on actual regression
- [ ] CHK-119 [P2] `npx vitest run` passes with no silent skips
  - Evidence: Exit 0, no `.skip` or early-return guards on critical paths
<!-- /ANCHOR:ws-8-verify -->

---

<!-- ANCHOR:cross-cutting -->
## Cross-Cutting Quality Gates

- [ ] CHK-200 [P0] All vitest suites pass: `npx vitest run` exit 0
  - Evidence: CI or local run log
- [ ] CHK-201 [P1] `validate.sh --strict` passes for all 4 packets (009, 010, 012, 014)
  - Evidence: Exit 0 for each packet
- [ ] CHK-202 [P1] No new test regressions introduced during remediation
  - Evidence: Diff of test pass/fail counts shows no new failures
- [ ] CHK-203 [P1] All path-escape regression tests added and passing
  - Evidence: Test files exist and pass
- [ ] CHK-204 [P1] All tasks in tasks.md marked either [x] or [D] with reason
  - Evidence: Zero `[ ]` items remaining (all resolved or deferred)
<!-- /ANCHOR:cross-cutting -->

---

<!-- ANCHOR:release-readiness -->
## Final Release-Readiness Checklist

- [ ] CHK-300 [P0] P0 blocker (CHK-001 through CHK-006) all verified
  - Evidence: All P0 items show [x]
- [ ] CHK-301 [P0] All P1 checklist items either verified [x] or explicitly deferred [D]
  - Evidence: Zero unchecked P1 items
- [ ] CHK-302 [P1] Implementation summary updated to reflect remediation completion
  - Evidence: `implementation-summary.md` exists with remediation details
- [ ] CHK-303 [P1] `graph-metadata.json` status updated to `complete`
  - Evidence: Status field reads "complete"
- [ ] CHK-304 [P1] `description.json` updated with final remediation description
  - Evidence: Description reflects completed state
- [ ] CHK-305 [P2] All P2 items either fixed or deferred with documented reason
  - Evidence: Each P2 [D] item has reason annotation
<!-- /ANCHOR:release-readiness -->

---

<!-- ANCHOR:summary -->
## Checklist Summary

| Category | P0 | P1 | P2 | Total |
|----------|-----|-----|-----|-------|
| P0 Blocker | 6 | 0 | 0 | 6 |
| WS 0b Path Hardening | 0 | 6 | 0 | 6 |
| WS 0c Contract Verify | 0 | 5 | 0 | 5 |
| WS 1 Status Drift | 0 | 6 | 1 | 7 |
| WS 2 014 Identity | 0 | 4 | 0 | 4 |
| WS 3 Command Integrity | 0 | 8 | 1 | 9 |
| WS 4 Error/Security | 0 | 4 | 2 | 6 |
| WS 5 Traceability | 0 | 7 | 1 | 8 |
| WS 6 Stale Refs | 0 | 12 | 1 | 13 |
| WS 7 Agent/Skill Docs | 0 | 8 | 1 | 9 |
| WS 8 Test Quality | 0 | 9 | 1 | 10 |
| Cross-Cutting | 1 | 4 | 0 | 5 |
| Release Readiness | 2 | 2 | 1 | 5 |
| **Total** | **9** | **75** | **9** | **93** |
<!-- /ANCHOR:summary -->
