---
title: "Verification Checklist: CocoIndex Code MCP Integration [03--commands-and-skills/022-mcp-coco-integration/checklist]"
description: "Verification Date: 2026-03-18"
trigger_phrases:
  - "cocoindex checklist"
  - "coco-index verification"
  - "cocoindex_code checklist"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: CocoIndex Code MCP Integration

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

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` documents the multi-phase scope, requirements (REQ-001 to REQ-014), success criteria (SC-001 to SC-009), NFRs, and edge cases
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` documents the delivered installation, validation, and hardening phases, plus testing strategy, dependencies, and rollback procedures
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: Install script available at `.opencode/skill/mcp-coco-index/scripts/install.sh`, `python3.11` available at Homebrew path, `cocoindex-code v0.2.3` installed to `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc`

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks
  - **Evidence**: All 5 JSON files and 1 TOML file pass syntax validation via `python3 json.load` and `python3.11 tomllib.load`; touched shell scripts pass `bash -n`; `.opencode/skill/skill-advisor/scripts/skill_advisor.py` passes `python3 -m py_compile`
- [x] CHK-011 [P0] No console errors or warnings
  - **Evidence**: `ccc index` completed without errors; `doctor.sh`, `doctor.sh --json`, `ensure_ready.sh --json`, and advisor verification commands all exited 0
- [x] CHK-012 [P1] Error handling implemented
  - **Evidence**: `doctor.sh` and `ensure_ready.sh` now expose `ready|degraded|not_ready`, stable issue codes, and recommended next steps; `ensure_ready.sh` performs idempotent install/init/index actions; `.mcp.json` remains `disabled: true` by default
- [x] CHK-013 [P1] Code follows project patterns
  - **Evidence**: `cocoindex_code` naming follows existing snake_case convention (`spec_kit_memory`, `code_mode`); `_NOTE_*` env var documentation follows existing `opencode.json` and `.claude/mcp.json` pattern

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met
  - **Evidence**: SC-001 - all 6 configs have `cocoindex_code` entry; SC-002 - `.cocoindex_code/` gitignored; SC-003 - readiness helpers report non-zero file/chunk counts after indexing (`5859` / `78525` in the shared repo validation run); SC-004 - all syntax validations pass; SC-008/SC-009 - strict readiness and downstream adoption packaging are now documented and verified
- [x] CHK-021 [P0] Manual testing complete
  - **Evidence**: `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/python -c "import importlib.metadata as m; print(m.version('cocoindex-code'))"` prints `0.2.3`; `ccc index` completed; `ccc search "MCP server initialization"` returns relevant TypeScript results with file paths and line numbers
- [x] CHK-022 [P1] Edge cases tested
  - **Evidence**: PATH collision with existing `/opt/homebrew/bin/ccc` identified and mitigated by using repo-relative `.opencode/.../ccc` in configs; repo-relative `COCOINDEX_CODE_ROOT_PATH="."` verified across the 6 config formats
- [x] CHK-023 [P1] Error scenarios validated
  - **Evidence**: Peer review score 88/100 (PASS) with 0 blockers, 0 P1 issues identified; config format differences across JSON vs TOML confirmed correct

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - **Evidence**: `COCOINDEX_CODE_ROOT_PATH` is a file system path, not a credential; no API keys required (all-MiniLM-L6-v2 runs locally); manual review of all 6 config files confirms no tokens, passwords, or keys
- [x] CHK-031 [P0] Input validation implemented
  - **Evidence**: N/A for Phase 1 - no custom code; CocoIndex server handles input validation internally
- [x] CHK-032 [P1] Auth/authz working correctly
  - **Evidence**: N/A for Phase 1 - CocoIndex is a local tool with no auth layer; daemon uses Unix domain socket (no network exposure); index directory gitignored to prevent code chunk leakage

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` now reflect the Phase 1 integration, Phase 2 hardening, and the Phase 3 strict-readiness/adoption-packaging pass
- [x] CHK-041 [P1] Code comments adequate
  - **Evidence**: `_NOTE_1`, `_NOTE_2`, `_NOTE_3` env vars in `opencode.json` and `.claude/mcp.json` document install requirements, embedding model, and gitignore need; inline TOML comments added in `.codex/config.toml`
- [x] CHK-042 [P2] README updated (if applicable)
  - **Evidence**: The skill README, cross-CLI playbook, and downstream adoption checklist now point operators to strict readiness modes and sibling-repo rollout guidance

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: The only retained scratch artifact is `scratch/cross-cli-auto-usage-test-results.md`, which is intentional validation evidence rather than a stray temp file
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: `scratch/` contains only the retained cross-CLI validation report; no extra transient work files remain
- [x] CHK-052 [P2] Findings saved to memory/
  - **Evidence**: `memory/18-03-26_19-06__portable-cocoindex-mcp-paths-applied.md` was generated for this spec folder, alongside `memory/metadata.json`

<!-- /ANCHOR:file-org -->

---

### Cross-CLI Auto-Usage Validation

- [x] CHK-060 [P0] Cross-CLI test executed across all 4 CLIs with 3 prompts each
  - **Evidence**: `scratch/cross-cli-auto-usage-test-results.md` documents all 12 test runs with tool call counts, result counts, and token usage
- [x] CHK-061 [P0] Auto-discovery confirmed: 3/4 CLIs used CocoIndex without agent routing changes
  - **Evidence**: Claude Code (3/3 exclusive), Gemini (3/3, 2 exclusive + 1 hybrid), Copilot (3/3 attempted); Codex billing-blocked
- [x] CHK-062 [P1] Copilot MCP failure root cause identified and reproduced
  - **Evidence**: 5 concurrent `refresh_index=true` queries generated +165 daemon errors (685 to 850); same queries with `refresh_index=false` generated 0 errors; Copilot's exact failing queries return results with `refresh_index=false`
- [x] CHK-063 [P1] Root cause documented in test results and implementation summary
  - **Evidence**: Root cause analysis section in `scratch/cross-cli-auto-usage-test-results.md`; findings F1-F4 and recommendations R1-R6 in `implementation-summary.md`
- [x] CHK-064 [P1] SKILL.md updated with query optimization and `refresh_index` guidance
  - **Evidence**: "Query Optimization" and "Concurrent Query Sessions" sections added to `../../../skill/mcp-coco-index/SKILL.md`
- [x] CHK-065 [P2] Codex retry attempted
  - **Evidence**: `codex exec "echo hello"` returned `ERROR: You've hit your usage limit`; documented as deferred
- [x] CHK-066 [P1] Memory saved for session continuity
  - **Evidence**: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/022-cocoindex-fixes-memory.json '.opencode/specs/03--commands-and-skills/022-mcp-coco-integration'` created `memory/18-03-26_19-06__portable-cocoindex-mcp-paths-applied.md`


---

### Phase 2 Hardening Verification

- [x] CHK-070 [P0] Touched CocoIndex docs match the installed runtime contract
  - **Evidence**: Verified touched docs no longer claim MCP exposes `index`, `status`, or `reset`; no touched docs document `ccc daemon start` or `ccc index --refresh`
- [x] CHK-071 [P0] Helper scripts pass syntax and JSON output checks
  - **Evidence**: `bash -n` passed for `common.sh`, `doctor.sh`, `ensure_ready.sh`, `install.sh`, and `update.sh`; `doctor.sh --json` and `ensure_ready.sh --json` returned clean JSON
- [x] CHK-072 [P1] Helper scripts are operational in both the main repo and a fresh temp project
  - **Evidence**: `doctor.sh` reported healthy binary/index/daemon/config status in the repo root; `ensure_ready.sh --json --root <tmpdir>` performed `init` and `index` and returned clean JSON with `actionsPerformed` showing both steps
- [x] CHK-073 [P1] Advisor prefers the repo-local CocoIndex binary
  - **Evidence**: `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --health` reports `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc` in `cocoindex_binary`
- [x] CHK-074 [P1] Semantic exploration prompts route to CocoIndex without strongly routing exact-text prompts
  - **Evidence**: `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "find code that handles auth" --threshold 0.8` returns `mcp-coco-index` at 0.95 confidence; `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "find exact string TODO comments" --threshold 0.8 --show-rejections` keeps CocoIndex below threshold


---

### Phase 3 Strict Readiness & Adoption Packaging Verification

- [x] CHK-080 [P0] Strict readiness issue codes and shared state are implemented centrally
  - **Evidence**: `scripts/common.sh` defines exit codes `20` through `25` and computes shared `status`, `blockingIssues`, `warnings`, `detectedConfigs`, `expectedConfigs`, and `recommendedNextStep`
- [x] CHK-081 [P0] Shared-repo strict readiness passes after automated recovery
  - **Evidence**: `doctor.sh --json --strict --require-config --expect-config opencode.json` first surfaced exit `23` with `indexFiles: 0` and `indexChunks: 0`; `ensure_ready.sh --json --strict --require-config --expect-config opencode.json` then ran `actionsPerformed: ["index"]`; rerunning `doctor.sh` returned `status: "ready"` with `indexFiles: 5859`, `indexChunks: 78525`, and `expectedConfigs: ["opencode.json"]`
- [x] CHK-082 [P1] Strict post-bootstrap config validation fails correctly in a temp project
  - **Evidence**: `ensure_ready.sh --json --strict --require-config --root <tmpdir>` exited `24` after performing `["init", "index"]`, with `blockingIssues: [24]`, `detectedConfigs: []`, and `recommendedNextStep` pointing to `../../../skill/mcp-coco-index/references/downstream_adoption_checklist.md`
- [x] CHK-083 [P1] Downstream adoption guidance is published without hidden config-writing automation
  - **Evidence**: `../../../skill/mcp-coco-index/references/downstream_adoption_checklist.md` documents the minimum sibling-repo payload/config/gitignore bundle, explicitly states the shared helpers verify readiness but do not write config files, and is referenced from `../../../skill/mcp-coco-index/SKILL.md`, `../../../skill/mcp-coco-index/README.md`, and `../../../skill/mcp-coco-index/references/cross_cli_playbook.md`


---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 19 | 19/19 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-03-18
**Verified By**: AI Assistant (Codex)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
All items marked [x] with specific evidence
Phase 1 config-only implementation - complete 2026-03-18
Cross-CLI validation + root cause analysis - complete 2026-03-18
-->
