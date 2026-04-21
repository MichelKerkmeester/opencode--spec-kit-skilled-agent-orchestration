# Implementation Dispatch: Canonical-Save Hardening

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast` per autonomous-completion directive (2026-04-18).

**Gate 3 pre-answered**: Option **E** (phase folder). All file writes pre-authorized. Proceed without asking.

**Autonomous context**: Overnight run, no confirmation gates.

## SCOPE

Read first:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/002-canonical-save-hardening/spec.md`
- `.../002-canonical-save-hardening/plan.md`
- `.../002-canonical-save-hardening/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-04/research.md`

Implement the 3 waves in order:

**Wave A — Save-lineage runtime parity:**
- Widen `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:95-97` `refreshGraphMetadata()` to accept `GraphMetadataRefreshOptions`
- Update caller in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1434-1450`
- Rebuild dist: `cd .opencode/skill/system-spec-kit && npm run build` (adjust if different build command)
- Verify `dist/core/workflow.js`, `dist/lib/graph/graph-metadata-parser.js`, `dist/lib/graph/graph-metadata-schema.js` include `save_lineage` field handling
- Add regression tests asserting `save_lineage: 'same_pass'` on fresh canonical save

**Wave B — Packet-root remediation:**
- Author coordination-parent `spec.md` for 4 packets:
  - `026/007-release-alignment-revisits/spec.md`
  - `026/008-cleanup-and-audit/spec.md`
  - `026/009-playbook-and-remediation/spec.md`
  - `026/010-search-and-routing-tuning/spec.md`
- Use the Level 2 spec template as base (see `.opencode/skill/system-spec-kit/templates/level_2/spec.md`)
- Each root spec should describe the packet's coordination role + reference existing sub-packets as source_docs
- Run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/001-release-alignment-revisits","sessionSummary":"Wave B: restored root spec for coordination-parent packet"}'` for each of 007/008/009/010
- Verify `derived.source_docs` non-empty in each `graph-metadata.json`

**Wave C — Validator rollout:**
- Create `.opencode/skill/system-spec-kit/scripts/rules/check-canonical-save.sh` implementing 5 rules (CANONICAL_SAVE_ROOT_SPEC_REQUIRED, CANONICAL_SAVE_SOURCE_DOCS_REQUIRED, CANONICAL_SAVE_LINEAGE_REQUIRED, CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED, CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS)
- Add dispatch entries + `show_help()` lines in `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Test against synthetic fixtures + full 026 tree (with 007-010 in allowlist until next release cutoff)
- Document grandfathering cutoff timestamp in rule comments

## CONSTRAINTS

- Run tests after each Wave: `cd .opencode/skill/system-spec-kit && npm test` or equivalent
- If tests fail, self-correct up to 3 attempts, then HALT and update `implementation-summary.md` with blocker
- Mark relevant tasks `[x]` in `tasks.md` with evidence (file:line or commit SHA)
- Update `checklist.md` evidence fields as items complete
- Update `implementation-summary.md` §What Was Built / §How It Was Delivered at end
- DO NOT run `git commit` or `git push` — the orchestrator commits at end
- DO use `git add` for staging if useful, but do not commit

## OUTPUT EXPECTATION

On success: all 3 waves implemented, tests green, spec docs updated (tasks.md `[x]`, checklist.md evidence, implementation-summary.md populated). Changes left in working tree for orchestrator commit.

On failure: HALT, update implementation-summary.md §Known Limitations with blocker description + which Wave(s) completed, return.
