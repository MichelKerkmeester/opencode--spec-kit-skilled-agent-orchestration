---
title: "278 -- Memory retention sweep basic flow"
description: "Operator validation for packet 033 memory_retention_sweep: expired delete_after rows, dry-run preview, deletion audit, and scheduled cleanup interval."
---

# 278 -- Memory retention sweep basic flow

## 1. OVERVIEW

This scenario validates the operator-visible retention sweep shipped in packet 033. It proves that an expired governed memory can be previewed with `dryRun`, deleted by `memory_retention_sweep`, and removed by the scheduled interval when `SPECKIT_RETENTION_SWEEP_INTERVAL_MS` is reduced in a disposable runtime.

---

## 2. SCENARIO CONTRACT

- **Goal**: Verify `memory_retention_sweep` consumes `memory_index.delete_after` without deleting retained rows.
- **Prerequisites**:
  - Working directory is the repository root.
  - Spec Kit Memory MCP tools are available.
  - A disposable spec folder is used for the inserted row.
  - Terminal transcript capture is enabled.
- **Prompt**: `As a Spec Kit operator, create one governed ephemeral memory with deleteAfter in the past, preview it with memory_retention_sweep dryRun, run the real sweep, verify the row is gone and audit metadata names retention_expired, then repeat with SPECKIT_RETENTION_SWEEP_INTERVAL_MS=1000 in a disposable server runtime to prove the scheduled sweep fires. Return PASS/FAIL with evidence paths.`

---

## 3. TEST EXECUTION

### Commands

1. Prepare a disposable retained file:

```bash
TEST_SPEC="specs/test-retention-playbook-$(date +%s)"
mkdir -p "$TEST_SPEC"
printf '%s\n' '---' 'title: Retention Sweep Manual Test' 'trigger_phrases: ["retention sweep manual test"]' '---' '# Retention Sweep Manual Test' '' 'Temporary operator validation file.' > "$TEST_SPEC/spec.md"
```

2. Save it with an expired retention timestamp through the MCP tool:

```text
memory_save({
  "filePath": "/absolute/path/to/repo/<TEST_SPEC>/spec.md",
  "retentionPolicy": "ephemeral",
  "deleteAfter": "2000-01-01T00:00:00.000Z",
  "tenantId": "manual-retention",
  "userId": "operator",
  "sessionId": "retention-playbook",
  "agentId": "manual-test",
  "provenanceActor": "manual-test",
  "provenanceSource": "278-memory-retention-sweep-basic-flow"
})
```

3. Preview without deletion:

```text
memory_retention_sweep({ "dryRun": true })
```

4. Run the deleting sweep:

```text
memory_retention_sweep({ "dryRun": false })
```

5. Verify no retained result remains for the unique trigger:

```text
memory_context({ "input": "retention sweep manual test", "mode": "quick", "limit": 5 })
```

6. Verify the scheduled interval in a disposable server process:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
SPECKIT_RETENTION_SWEEP=true SPECKIT_RETENTION_SWEEP_INTERVAL_MS=1000 npm --prefix .opencode/skill/system-spec-kit/mcp_server start 2>&1 | tee /tmp/retention-sweep-interval.log
```

In a second terminal, insert another expired row as in steps 1-2, wait at least 3 seconds, then run the verification query in step 5 without manually calling `memory_retention_sweep`.

### Expected Output / Verification

- Dry-run returns `dryRun: true`, `swept: 0`, and a candidate containing the saved row.
- Real sweep returns `dryRun: false`, `swept >= 1`, and `deletedIds` includes the expired row.
- The follow-up `memory_context` call does not return the unique temporary title or trigger phrase.
- Governance/audit evidence records `reason: "retention_expired"` and preserves the original `delete_after`.
- Interval test removes the second expired row without manual sweep invocation.

### Cleanup

```bash
rm -rf "$TEST_SPEC"
rm -f /tmp/retention-sweep-interval.log
```

If the interval server is still running, stop it with `Ctrl-C`.

### Variant Scenarios

- Future `deleteAfter`: save another row with a timestamp one day in the future; both dry-run and real sweep must retain it.
- Retention disabled: run the server with `SPECKIT_RETENTION_SWEEP=false`; interval deletion must not occur, while manual `memory_retention_sweep({ "dryRun": false })` still works.
- Invalid interval: set `SPECKIT_RETENTION_SWEEP_INTERVAL_MS=not-a-number`; the runtime should fall back to the default interval rather than crash.

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Packet 033 spec: [033-memory-retention-sweep/spec.md](../../../../../specs/system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep/spec.md)
- MCP docs: [mcp_server/README.md](../../mcp_server/README.md)
- Source: `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts`
- Source: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`

---

## 5. SOURCE METADATA

- Group: Maintenance
- Playbook ID: 278
- Packet: 033-memory-retention-sweep
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--maintenance/278-memory-retention-sweep-basic-flow.md`
