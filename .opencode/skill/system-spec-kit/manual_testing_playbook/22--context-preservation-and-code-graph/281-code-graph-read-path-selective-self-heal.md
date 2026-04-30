---
title: "281 -- Code graph read-path selective self-heal"
description: "Operator validation for no structural watcher, bounded read-path self-heal, and explicit full-scan handoff."
---

# 281 -- Code graph read-path selective self-heal

## 1. OVERVIEW

This scenario validates the read-path contract. Structural code graph freshness is repaired by bounded query/context reads or by explicit `code_graph_scan`; no structural source watcher should run a full scan automatically.

---

## 2. SCENARIO CONTRACT


- Objective: Modify a tracked file, run `code_graph_query`, verify selective self-heal metadata, and confirm full scans remain operator-triggered.
- Real user request: `` Please validate Code graph read-path selective self-heal against the documented validation surface and tell me whether the expected signals are present: Step 1 scan returns an indexed graph with non-zero files/nodes.; Step 3 returns `status: "ok"` and readiness/canonical readiness metadata showing bounded repair, such as `action: "selective_reindex"`, `inlineIndexPerformed: true`, or `selfHealResult: "ok"`.; Step 4 does not report a broad `full_scan` performed automatically.; Step 5 query returns a blocked payload when the stale set exceeds the selective threshold: `status: "blocked"`, `requiredAction: "code_graph_scan"`, `blockReason: "full_scan_required"`, and `fallbackDecision.nextTool: "code_graph_scan"` when present.; No transcript line shows an unrequested `code_graph_scan` during the query path. ``
- RCAF Prompt: `` As a context-and-code-graph validation operator, validate Code graph read-path selective self-heal against the documented validation surface. Verify Step 1 scan returns an indexed graph with non-zero files/nodes.; Step 3 returns `status: "ok"` and readiness/canonical readiness metadata showing bounded repair, such as `action: "selective_reindex"`, `inlineIndexPerformed: true`, or `selfHealResult: "ok"`.; Step 4 does not report a broad `full_scan` performed automatically.; Step 5 query returns a blocked payload when the stale set exceeds the selective threshold: `status: "blocked"`, `requiredAction: "code_graph_scan"`, `blockReason: "full_scan_required"`, and `fallbackDecision.nextTool: "code_graph_scan"` when present.; No transcript line shows an unrequested `code_graph_scan` during the query path. Return a concise pass/fail verdict with the main reason and cited evidence. ``
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Step 1 scan returns an indexed graph with non-zero files/nodes.; Step 3 returns `status: "ok"` and readiness/canonical readiness metadata showing bounded repair, such as `action: "selective_reindex"`, `inlineIndexPerformed: true`, or `selfHealResult: "ok"`.; Step 4 does not report a broad `full_scan` performed automatically.; Step 5 query returns a blocked payload when the stale set exceeds the selective threshold: `status: "blocked"`, `requiredAction: "code_graph_scan"`, `blockReason: "full_scan_required"`, and `fallbackDecision.nextTool: "code_graph_scan"` when present.; No transcript line shows an unrequested `code_graph_scan` during the query path
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the expected signals are present without contradicting evidence; FAIL if required signals are missing or execution cannot complete.

---

## 3. TEST EXECUTION

### Commands

1. Create a disposable copy and run an explicit initial scan:

```bash
WORK="/tmp/spec-kit-code-graph-self-heal-$(date +%s)"
rsync -a --exclude node_modules --exclude .git ./ "$WORK/"
cd "$WORK"
```

```text
code_graph_scan({ "rootDir": "/tmp/spec-kit-code-graph-self-heal-<timestamp>", "incremental": false })
```

2. Modify exactly one tracked file:

```bash
printf '\n// manual playbook self-heal marker %s\n' "$(date +%s)" >> .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/README.md
```

3. Run a structural read:

```text
code_graph_query({ "operation": "outline", "subject": ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/README.md", "limit": 20 })
```

4. Confirm status after the read:

```text
code_graph_status({})
```

5. Engineer a broad/full-scan state only in the disposable copy, then call query again:

```bash
find .opencode/skill/system-spec-kit/mcp_server/code_graph -name '*.ts' | head -60 | while read -r file; do printf '\n// broad stale marker %s\n' "$(date +%s)" >> "$file"; done
```

```text
code_graph_query({ "operation": "outline", "subject": ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts", "limit": 20 })
```

### Expected Output / Verification

- Step 1 scan returns an indexed graph with non-zero files/nodes.
- Step 3 returns `status: "ok"` and readiness/canonical readiness metadata showing bounded repair, such as `action: "selective_reindex"`, `inlineIndexPerformed: true`, or `selfHealResult: "ok"`.
- Step 4 does not report a broad `full_scan` performed automatically.
- Step 5 query returns a blocked payload when the stale set exceeds the selective threshold: `status: "blocked"`, `requiredAction: "code_graph_scan"`, `blockReason: "full_scan_required"`, and `fallbackDecision.nextTool: "code_graph_scan"` when present.
- No transcript line shows an unrequested `code_graph_scan` during the query path.

### Cleanup

```bash
cd -
rm -rf "$WORK"
```

### Variant Scenarios

- Run `detect_changes` after a file modification and verify it blocks on stale readiness because it passes `allowInlineIndex:false`.
- Run `code_graph_context` against the same modified file and verify it mirrors the blocked/full-scan contract.
- Touch fewer than the selective threshold and verify the read path repairs; touch more than the threshold and verify it refuses full scan.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Existing scan/query scenario: [254-code-graph-scan-query.md](254-code-graph-scan-query.md)
- Source: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts`
- Source: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts`
- Source: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts`

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 281
- Current behavior: code graph freshness is read-path/manual with no structural source watcher.
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/281-code-graph-read-path-selective-self-heal.md`
