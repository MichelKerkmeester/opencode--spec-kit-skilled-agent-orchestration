## Packet 033: memory-retention-sweep — Tier B-α implementation

You are cli-codex (gpt-5.5 high fast) implementing remediation packet **033-memory-retention-sweep**.

### Goal

Closes 013's P1-2 finding (validated): `mcp_server/lib/scope-governance.ts:225-333` persists `delete_after` metadata on memory rows, but no sweep path consumes it. Adversarial retest at iter 4 confirmed: `session-manager.ts:737` cleanup interval exists but is scoped to session tables (not memory_index); bulk-delete also bypasses `delete_after`. **No retention enforcement runs.**

Per the 013 research-report's recommendation, the **α path** (audit-worthy) is to **implement** a retention sweep. Without it, "having the column without the sweep is the kind of thing that fails an audit later."

### Read these first

- `specs/system-spec-kit/026-graph-and-context-optimization/013-automation-reality-supplemental-research/research/research-report.md` (Section 4 P1-2 verdict; Section 6 Packet 033 scope)
- `specs/system-spec-kit/026-graph-and-context-optimization/013-automation-reality-supplemental-research/research/iterations/iteration-004.md` (Hunter→Skeptic→Referee detail for P1-2)
- `.opencode/skill/system-spec-kit/mcp_server/lib/scope-governance.ts` (specifically lines 225-333 — the `delete_after` persistence path)
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts` (specifically lines 202-257 cleanup intervals; lines 737-840 sweep target tables)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` (existing bulk-delete handler)
- `.opencode/skill/system-spec-kit/mcp_server/db/` (memory_index table schema for `delete_after`)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` (related health diagnostic)
- Any existing retention tests under `mcp_server/tests/` (`grep -l 'delete_after\|retention'`)

### Implementation

1. **Add a retention sweep function** that:
   - Reads `memory_index` rows where `delete_after IS NOT NULL AND delete_after < datetime('now')`
   - Removes each expired row (and any associated FTS / vector index entries to maintain referential integrity)
   - Logs each deletion with reason="retention_expired" + the original delete_after value (audit trail)
   - Supports dry-run mode (returns the rows it would delete without mutating)
   - Returns a summary: `{swept: N, retained: M, dryRun: bool, durationMs}`
2. **Hook the sweep into existing cleanup interval**:
   - Locate the schedule mechanism in `session-manager.ts:202-257` or equivalent
   - Add the retention sweep alongside session cleanup (do NOT remove or interfere with existing session cleanup)
   - Default to enabled; expose env flag `SPECKIT_RETENTION_SWEEP=false` to disable
   - Default sweep interval: every 1 hour (configurable via `SPECKIT_RETENTION_SWEEP_INTERVAL_MS`)
3. **Add CLI / MCP triggers** for manual invocation:
   - New MCP tool `memory_retention_sweep({ dryRun?: boolean })` returning the summary
   - Register in `mcp_server/tools/index.ts` and `tool-schemas.ts`
   - Add handler at `mcp_server/handlers/memory-retention-sweep.ts`
4. **Add tests** at `mcp_server/tests/memory-retention-sweep.vitest.ts` covering:
   - Expired row gets deleted; non-expired retained
   - Dry-run does not mutate
   - Audit log records reason + original delete_after
   - FTS/vector index referential integrity preserved
   - Sweep handles empty result set (no rows to delete) gracefully
   - Concurrent sweep + insert doesn't race-corrupt index
5. **Update docs**:
   - `mcp_server/README.md` — add a "Memory retention" subsection with sweep behavior, env flags, manual trigger
   - `mcp_server/ENV_REFERENCE.md` — document `SPECKIT_RETENTION_SWEEP` and `SPECKIT_RETENTION_SWEEP_INTERVAL_MS`
   - `scope-governance.ts` JSDoc — add a comment near `delete_after` persistence pointing to the sweep
6. **Run TypeScript build + tests**:
   - `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` (or equivalent — find the build command in package.json) — must succeed
   - `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run memory-retention-sweep` — must pass
   - DO NOT run the full vitest suite (some tests hang per memory feedback)

### Packet structure to create (Level 2)

Same 7-file structure as 031 under `specs/system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep/`. Use 013's packet as template.

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/031-doc-truth-pass"]`, `manual.related_to=["system-spec-kit/026-graph-and-context-optimization/013-automation-reality-supplemental-research"]`.

**Trigger phrases**: `["033-memory-retention-sweep","memory retention sweep","delete_after sweep","retention enforcement"]`.

**Causal summary**: `"Tier B-α implementation: adds retention sweep over memory_index.delete_after; new MCP tool memory_retention_sweep, env flags, audit logging, and tests. Closes 013 P1-2."`.

**Frontmatter rules**: Same compact `recent_action` / `next_safe_action` rules as 031. < 80 chars, non-narrative.

### Phases

1. **Phase 1: Setup** — Create 7 packet files. Initial completion_pct=5.
2. **Phase 2: Implementation** — Implement sweep + handler + tests + docs.
3. **Phase 3: Validation** — Strict validator exits 0; tests pass; build succeeds; mark checklist complete.

### Constraints

- This packet WRITES code. Be surgical. Do NOT modify unrelated handlers, tests, or schema.
- Strict validator MUST exit 0.
- Tests MUST pass for the new sweep file.
- TS build MUST succeed.
- DO NOT commit; orchestrator will commit.
- Cite file:line evidence in packet docs.
- If the existing cleanup-interval architecture is too brittle to extend, ADD a new dedicated retention scheduler instead — but document the choice in decision-record.md (optional addition).

When done, last action is strict validator + tests passing. No narration; just write files and exit.
