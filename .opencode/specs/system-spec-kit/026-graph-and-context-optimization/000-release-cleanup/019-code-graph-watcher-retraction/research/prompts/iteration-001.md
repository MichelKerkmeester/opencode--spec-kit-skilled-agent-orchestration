## Packet 032: code-graph-watcher-retraction — Tier B-β doc retraction

You are cli-codex (gpt-5.5 high fast) implementing remediation packet **019-code-graph-watcher-retraction**.

### Goal

Closes 013's P1-1 finding (validated): `mcp_server/README.md:515-518` claims real-time structural code-graph watching, but adversarial retest at iter 4 confirmed `lib/ops/file-watcher.ts:274` only handles spec-doc/skill-graph watchers. **No code_graph watcher exists anywhere.**

Per the 013 research-report's recommendation, the **β path** (cheaper option) is to retract the README claim and document the actual contract: read-path/manual freshness via `code_graph/lib/ensure-ready.ts:329-442` plus operator-triggered `code_graph_scan` for full repair.

### Read these first

- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/017-automation-reality-supplemental-research/research/research-report.md` (Section 4 P1-1 verdict; Section 6 Packet 032 scope)
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/017-automation-reality-supplemental-research/research/iterations/iteration-004.md` (Hunter→Skeptic→Referee detail for P1-1)
- `.opencode/skill/system-spec-kit/mcp_server/README.md:515-518` (the offending claim)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:329-442` (the actual self-heal mechanism)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:177-356` (the manual full-scan path)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:787-828` (the read-path block-with-required-action behavior)
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:274` (proof: only spec-doc/skill-graph watchers)

### Implementation

1. **Edit `.opencode/skill/system-spec-kit/mcp_server/README.md` lines 515-518**: replace the structural code-graph watcher claim with a "Code-graph freshness model" subsection that says:
   - Read-path self-heal: `code_graph/lib/ensure-ready.ts` selectively reindexes changed tracked files when query/context handlers run
   - Manual full repair: `code_graph_scan` is operator-triggered (file:line ref)
   - Status surface: `code_graph_status` is read-only diagnostic
   - Required-action behavior: query handler blocks and emits required-action when full scan is needed (file:line ref)
2. **Search the codebase for any other "watcher" or "real-time" claim about code-graph** (grep for "watch" + "code_graph", "real-time" + "graph", etc.) — fix each occurrence to reference the read-path/manual contract.
3. **Update related docs that may inherit the false claim**:
   - `.opencode/skill/system-spec-kit/SKILL.md` — search for code-graph automation language
   - `CLAUDE.md` — search for code-graph automation language
   - `references/config/hook_system.md` — confirm no false watcher claim
4. **Add a brief note in the README** referencing 013's research-report for the full reality matrix.

### Packet structure to create (Level 2)

Same 7-file structure as 031 (spec/plan/tasks/checklist/implementation-summary/description.json/graph-metadata.json) under `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/019-code-graph-watcher-retraction/`. Use 013's packet as template.

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/018-doc-truth-pass"]`, `manual.related_to=["system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/017-automation-reality-supplemental-research"]`.

**Trigger phrases**: `["019-code-graph-watcher-retraction","code-graph watcher retraction","structural watcher doc fix","read-path graph freshness"]`.

**Causal summary**: `"Tier B-β doc retraction: removes README claim of real-time structural code-graph watcher; documents actual read-path/manual contract via ensure-ready.ts + code_graph_scan."`.

**Frontmatter rules**: Same compact `recent_action` / `next_safe_action` rules as 031. < 80 chars, non-narrative.

### Phases

1. **Phase 1: Setup** — Create 7 packet files. Initial completion_pct=5.
2. **Phase 2: Implementation** — Apply README retraction + sweep other docs for inherited false claims.
3. **Phase 3: Validation** — Strict validator exits 0; mark all checklist items complete; update implementation-summary to completion_pct=100.

### Constraints

- DOC-ONLY. No code changes.
- Strict validator MUST exit 0.
- DO NOT commit; orchestrator will commit.
- Cite file:line evidence in packet docs.

When done, last action is strict validator passing with `RESULT: PASSED` and 0 errors. No narration; just write files and exit.
