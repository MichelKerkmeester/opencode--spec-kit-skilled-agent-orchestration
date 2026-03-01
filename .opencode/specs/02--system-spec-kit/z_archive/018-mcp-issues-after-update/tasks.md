---
title: "Tasks: MCP Server Failures After Updates [135-mcp-issues-after-update/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "mcp"
  - "server"
  - "failures"
  - "after"
  - "135"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: MCP Server Failures After Updates

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Investigation

- [x] T001 Collect user error reports and log examples [Evidence: MCP startup failures post-update]
- [x] T002 Review git history for node_modules relocation changes [Evidence: Fallback build awareness]
- [x] T003 [P] Examine MCP server configuration and startup code [Evidence: context-server.js analysis]
- [x] T004 Test hypothesis: Reproduce failure with relocated node_modules [Evidence: Build verification passed]
- [x] T005 Identify alternate root causes (paths, permissions, dependencies) [Evidence: better-sqlite3 native module]
- [x] T006 Document findings with evidence in decision-record or memory/ [Evidence: Documented in implementation-summary.md]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Documentation Update

- [x] T007 Read current install guide thoroughly (`.opencode/install_guides/MCP - Spec Kit Memory.md`) [Evidence: Complete rewrite executed]
- [x] T008 Design structure for new debugging section [Evidence: Recovery-first workflow via sk-doc]
- [x] T009 Write error message reference table with common failures [Evidence: Troubleshooting section added]
- [x] T010 Document recovery procedure for node_modules issues [Evidence: Build fallback procedures in guide]
- [x] T011 Document recovery procedures for other identified causes [Evidence: Native module checks, path validation]
- [x] T012 Add health check validation commands section [Evidence: check-native-modules.sh documented]
- [x] T013 Write troubleshooting workflow diagram or step-by-step guide [Evidence: Step-by-step recovery flow]
- [x] T014 Update install guide with all new content [Evidence: `.opencode/install_guides/MCP - Spec Kit Memory.md` + backing file]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Manually test debugging procedures on affected system [Evidence: npm install + build in .opencode/skill/system-spec-kit]
- [x] T016 Verify error messages in documentation match real failures [Evidence: better-sqlite3 check reports OK]
- [x] T017 Validate recovery procedures successfully restore MCP server [Evidence: Startup smoke test for context-server.js passed]
- [x] T018 Test health check commands work as documented [Evidence: scripts/setup/check-native-modules.sh passed]
- [x] T019 Review documentation for clarity, completeness, accuracy [Evidence: Full installer end-to-end run succeeded]
- [x] T020 Update checklist.md with verification evidence [Evidence: Checklist updated with all evidence references]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Install guide updated with debugging section
- [x] Manual verification passed (procedures work on test system)
- [x] Root cause(s) documented with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Install Guide**: `.opencode/install_guides/MCP - Spec Kit Memory.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
