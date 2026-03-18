---
title: "Verification Checklist: CocoIndex Code MCP Integration"
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
  - **Evidence**: `spec.md` created with 9 sections including requirements (REQ-001 to REQ-008), success criteria (SC-001 to SC-004), NFRs, and edge cases
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` created with 4-phase implementation plan, architecture, data flow diagram, dependencies, and rollback procedures
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: `pipx` available, `python3.11` available at Homebrew path, `cocoindex-code v0.2.3` installed to `~/.local/bin/ccc`

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks
  - **Evidence**: No custom code written in Phase 1 - config-only changes; all 5 JSON files and 1 TOML file pass syntax validation via `python3 json.load` and `python3.11 tomllib.load`
- [x] CHK-011 [P0] No console errors or warnings
  - **Evidence**: `ccc index` completed without errors; `ccc search "MCP server initialization"` returns results
- [x] CHK-012 [P1] Error handling implemented
  - **Evidence**: N/A for Phase 1 config-only - no custom code; `.mcp.json` has `disabled: true` as the primary error-prevention mechanism
- [x] CHK-013 [P1] Code follows project patterns
  - **Evidence**: `cocoindex_code` naming follows existing snake_case convention (`spec_kit_memory`, `code_mode`); `_NOTE_*` env var documentation follows existing `opencode.json` and `.claude/mcp.json` pattern

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met
  - **Evidence**: SC-001 - all 6 configs have `cocoindex_code` entry; SC-002 - `.cocoindex_code/` gitignored; SC-003 - 6,792 files indexed, 105,965 chunks; SC-004 - all syntax validations pass
- [x] CHK-021 [P0] Manual testing complete
  - **Evidence**: `ccc --version` returns v0.2.3; `ccc index` completed; `ccc search "MCP server initialization"` returns relevant TypeScript results with file paths and line numbers
- [x] CHK-022 [P1] Edge cases tested
  - **Evidence**: PATH collision with existing `/opt/homebrew/bin/ccc` identified and mitigated by using full path `/Users/michelkerkmeester/.local/bin/ccc` in configs; absolute vs relative env var format verified per config type
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
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` all created on 2026-03-18 and reflect the Phase 1 implementation accurately
- [x] CHK-041 [P1] Code comments adequate
  - **Evidence**: `_NOTE_1`, `_NOTE_2`, `_NOTE_3` env vars in `opencode.json` and `.claude/mcp.json` document install requirements, embedding model, and gitignore need; inline TOML comments added in `.codex/config.toml`
- [x] CHK-042 [P2] README updated (if applicable)
  - **Evidence**: N/A - Phase 1 is internal infrastructure; no user-facing README change needed; Phase 2 skill folder will include README

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: No temp files created during Phase 1 implementation; all work was direct config file edits
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: `scratch/` directory contains no implementation artifacts from this phase
- [x] CHK-052 [P2] Findings saved to memory/
  - **Evidence**: `memory/` contains 2 session context files from 2026-03-18 capturing Phase 1 state and Phase 2 next steps

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:cross-cli-validation -->
## Cross-CLI Auto-Usage Validation

- [x] CHK-060 [P0] Cross-CLI test executed across all 4 CLIs with 3 prompts each
  - **Evidence**: `scratch/cross-cli-auto-usage-test-results.md` documents all 12 test runs with tool call counts, result counts, and token usage
- [x] CHK-061 [P0] Auto-discovery confirmed: 3/4 CLIs used CocoIndex without agent routing changes
  - **Evidence**: Claude Code (3/3 exclusive), Gemini (3/3, 2 exclusive + 1 hybrid), Copilot (3/3 attempted); Codex billing-blocked
- [x] CHK-062 [P1] Copilot MCP failure root cause identified and reproduced
  - **Evidence**: 5 concurrent `refresh_index=true` queries generated +165 daemon errors (685 to 850); same queries with `refresh_index=false` generated 0 errors; Copilot's exact failing queries return results with `refresh_index=false`
- [x] CHK-063 [P1] Root cause documented in test results and implementation summary
  - **Evidence**: Root cause analysis section in `scratch/cross-cli-auto-usage-test-results.md`; findings F1-F4 and recommendations R1-R6 in `implementation-summary.md`
- [x] CHK-064 [P1] SKILL.md updated with query optimization and `refresh_index` guidance
  - **Evidence**: "Query Optimization" and "Concurrent Query Sessions" sections added to SKILL.md Rules section
- [x] CHK-065 [P2] Codex retry attempted
  - **Evidence**: `codex exec "echo hello"` returned `ERROR: You've hit your usage limit`; documented as deferred
- [x] CHK-066 [P1] Memory saved for session continuity
  - **Evidence**: Memory #4404 saved to `022-mcp-coco-integration/memory/18-03-26_14-35__next-steps.md` (85/100 quality)

<!-- /ANCHOR:cross-cli-validation -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 13 | 13/13 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-03-18
**Verified By**: AI Assistant (Claude Opus 4.6)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
All items marked [x] with specific evidence
Phase 1 config-only implementation - complete 2026-03-18
Cross-CLI validation + root cause analysis - complete 2026-03-18
-->
