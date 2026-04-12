---
title: "260 -- Code graph auto-trigger on fresh install"
description: "This scenario validates Code graph auto-trigger for 260. It focuses on verifying ensureCodeGraphReady() detects empty/stale graphs and auto-indexes."
audited_post_018: true
---

# 260 -- Code graph auto-trigger on fresh install

## 1. OVERVIEW

This scenario validates Code graph auto-trigger (ensureCodeGraphReady).

---

## 2. CURRENT REALITY

- **Objective**: Verify that ensureCodeGraphReady() correctly detects graph freshness state (fresh/stale/empty) and triggers the appropriate action (none/full_scan/selective_reindex). On an empty graph, a full scan must fire. When git HEAD has changed and files are stale, selective reindex must fire for changed files (up to 50). When more than 50 files are stale, a full rescan must trigger. The 10-second timeout must abort long-running indexing.
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
  - Git repository with at least one commit
- **Prompt**: `As a context-and-code-graph validation operator, validate Code graph auto-trigger on fresh install against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts. Verify ensureCodeGraphReady() correctly detects graph freshness state (fresh/stale/empty) and triggers the appropriate action (none/full_scan/selective_reindex). On an empty graph, a full scan must fire. When git HEAD has changed and files are stale, selective reindex must fire for changed files (up to 50). When more than 50 files are stale, a full rescan must trigger. The 10-second timeout must abort long-running indexing. Return a concise pass/fail verdict with the main reason and cited evidence.`
- **Expected signals**:
  - Empty graph: action=full_scan, reason includes "empty"
  - After scan: code_nodes and code_edges tables populated
  - After file modification: action=selective_reindex with stale file listed
  - Timeout: graceful abort without crash
- **Pass/fail criteria**:
  - PASS: Auto-trigger correctly detects all three states (empty/stale/fresh) and performs correct action
  - FAIL: Missing auto-trigger on empty graph, stale files not detected, or timeout causes crash

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 260a | Code graph auto-trigger | Empty graph triggers full scan | `As a context-and-code-graph validation operator, validate Empty graph triggers full scan against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts. Verify readyResult.action === 'full_scan', reason includes 'empty' or 'no nodes'. Return a concise pass/fail verdict with the main reason and cited evidence.` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts` | ReadyResult.action === 'full_scan', reason includes 'empty' or 'no nodes' | Test output showing action and reason | PASS if full_scan triggered on empty graph | Check getDb() returns valid database, verify code_nodes table exists |
| 260b | Code graph auto-trigger | Git HEAD change triggers selective reindex | `As a context-and-code-graph validation operator, validate Git HEAD change triggers selective reindex against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts. Verify readyResult.action === 'selective_reindex', files array lists changed files. Return a concise pass/fail verdict with the main reason and cited evidence.` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts` | ReadyResult.action === 'selective_reindex', files array lists changed files | Test output showing action and file list | PASS if selective reindex triggered with correct file list | Check getCurrentGitHead() and getLastGitHead() comparison logic |
| 260c | Code graph auto-trigger | Fresh graph returns action=none | `As a context-and-code-graph validation operator, validate Fresh graph returns action=none against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts. Verify readyResult.action === 'none', reason includes 'fresh'. Return a concise pass/fail verdict with the main reason and cited evidence.` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts` | ReadyResult.action === 'none', reason includes 'fresh' | Test output showing no-op result | PASS if no indexing triggered on fresh graph | Verify setLastGitHead() was called after previous scan |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md](../../feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 260
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/260-code-graph-auto-trigger.md`
