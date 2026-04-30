## Packet 037/003: testing-playbook-trio — Tier B doc updates

You are cli-codex (gpt-5.5 high fast) implementing **037/003-testing-playbook-trio**.

### Goal

Update the manual testing playbooks for THREE skills/subsystems to add reproducible operator-level test entries for the new tools/handlers/runners shipped in packets 031-036:

1. **system-spec-kit manual testing playbook**
2. **skill_advisor manual testing playbook**
3. **code_graph manual testing playbook**

### Discovery (do this first)

Locate the playbooks:

```bash
find .opencode/skill -type d -name 'manual_testing_playbook*' -or -type d -name 'manual-testing-playbook*'
find .opencode/skill -type f -name '*playbook*'
find .opencode/skill/sk-doc -name '*playbook*'
```

Read at least one existing playbook entry to understand the format.

Note: `cli-opencode` skill already has a manual testing playbook with multiple numbered subdirs (`01--cli-invocation/`, `02--external-dispatch/`, etc.) — that's the format pattern to follow.

### Entries to add

#### system-spec-kit playbook

For 033 memory_retention_sweep:
- Operator command sequence to insert a row with delete_after, run sweep, verify deletion
- Dry-run verification
- Cleanup interval verification (set SPECKIT_RETENTION_SWEEP_INTERVAL_MS, observe sweep fires)

For 034 advisor_rebuild:
- Trigger advisor stale state
- Run advisor_status (diagnostic only; verify no rebuild)
- Run advisor_rebuild (verify rebuild fires)

For 036 CLI matrix adapters (if shipped):
- Run a single cell from each adapter
- Verify JSONL output shape
- Verify timeout handling

#### skill_advisor playbook

For 034 advisor_rebuild + advisor_status separation:
- Reproduce advisor stale state
- Verify advisor_status diagnostic-only output
- Verify advisor_rebuild explicit rebuild path

#### code_graph playbook

For 032 watcher retraction (read-path contract):
- Modify a tracked file
- Run code_graph_query → verify selective self-heal output
- Confirm full scan IS NOT auto-triggered (operator must run code_graph_scan explicitly)

For 035 cell coverage:
- Reference 035's per-cell evidence files for code_graph cells (F5, F6, F7, F8)

### Format conventions (per sk-doc playbook template)

Each entry should include:
- Title (e.g., "001-memory-retention-sweep-basic-flow")
- Goal
- Prerequisites
- Step-by-step commands (copy-paste-able)
- Expected output / verification
- Cleanup
- Variant scenarios

### Implementation phases

#### Phase 1: Discover playbook locations
Run discovery commands. Write `discovery-notes.md` listing actual paths.

#### Phase 2: Read templates
Read sk-doc's playbook template + at least 2 existing playbook entries from cli-opencode for format reference.

#### Phase 3: Add entries
Add new playbook entries for the listed scenarios. Be surgical — additive only.

#### Phase 4: Verify sk-doc compliance
Each new entry should pass sk-doc playbook validation if a validator exists.

### Packet structure to create (Level 2)

7-file structure under `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/003-testing-playbook-trio/`.

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/001-sk-code-opencode-audit"]`.

**Trigger phrases**: `["037-003-testing-playbook-trio","manual testing playbook","playbook updates 031-036","system-spec-kit playbook","skill_advisor playbook","code_graph playbook"]`.

**Causal summary**: `"Updates 3 manual testing playbooks with reproducible operator entries for new tools from 031-036. Doc-only; sk-doc template-aligned."`.

**Frontmatter**: compact rules.

### Constraints

- DOC-ONLY. No code changes.
- Strict validator MUST exit 0 on this packet.
- Step-by-step commands must be copy-pasteable and accurate.
- DO NOT commit; orchestrator will commit.
- If a playbook doesn't exist at expected paths, document the gap and skip (don't fabricate).

When done, last action is strict validator passing. No narration; just write files and exit.
