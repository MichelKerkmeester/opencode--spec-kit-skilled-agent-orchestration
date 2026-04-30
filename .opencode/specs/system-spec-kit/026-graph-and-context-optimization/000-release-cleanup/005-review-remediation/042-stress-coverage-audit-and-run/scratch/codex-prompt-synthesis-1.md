# Coverage Synthesis — Stress-Test vs Feature Catalogs

You are producing two artifacts for spec-kit packet 042. Repository root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`. Stay inside the workspace; only write files inside the packet folder.

## Packet folder (write outputs HERE)

`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/042-stress-coverage-audit-and-run/`

## Inputs (read-only)

1. **Code-graph feature catalog** — `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/feature_catalog.md` (master index) and every per-feature file under `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/`. Total: **17 features** in 8 groups (Read-path Freshness, Manual Scan/Verify/Status, Detect-Changes Preflight, Context Retrieval, Coverage Graph, MCP Tool Surface, CCC Integration, Doctor Code Graph).
2. **Skill-advisor feature catalog** — `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/feature_catalog.md` and every per-feature file under that folder. Total: **37 features** in 7 groups (Daemon & Freshness, Auto-Indexing, Lifecycle Routing, Scorer Fusion, MCP Surface, Hooks & Plugin, Python Compat).
3. **Stress-test directory** — `.opencode/skill/system-spec-kit/mcp_server/stress_test/`. Subdirs:
   - `code-graph/` (3 files)
   - `skill-advisor/` (2 files)
   - `memory/` (3 files)
   - `session/` (3 files)
   - `search-quality/` (~17 files, W3-W13 harness)
   - `matrix/` (1 file)
4. **Vitest unit tests** — `.opencode/skill/system-spec-kit/mcp_server/code_graph/__tests__/` and `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/__tests__/` (or wherever the subsystem-local tests live — search to confirm).
5. **Manual playbook** — `.opencode/skill/system-spec-kit/mcp_server/manual_testing_playbook/` (scenario folders such as `01--native-mcp-tools/`, `02--manual-scan-verify-status/`).
6. **Stress runner config** — `.opencode/skill/system-spec-kit/mcp_server/package.json` and `vitest.stress.config.ts`.

## Output 1: `coverage-matrix.csv`

CSV header (LOCKED — first line MUST match exactly):

```
feature_id,subsystem,group,feature_name,catalog_anchor,stress_test_files,supplementary_stress_files,vitest_unit_files,manual_playbook_refs,stress_coverage_required,gap_classification,evidence
```

Then exactly **54 data rows** — 17 code_graph + 37 skill_advisor.

Column rules:
- `feature_id` — derive a stable id like `cg-001`, `cg-002`, ..., `cg-017` for code_graph (in catalog order); `sa-001`..`sa-037` for skill_advisor.
- `subsystem` — `code_graph` or `skill_advisor`
- `group` — the group from the catalog index
- `feature_name` — verbatim from the catalog
- `catalog_anchor` — relative path to the per-feature file (or section anchor) inside the catalog folder
- `stress_test_files` — semicolon-separated relative paths in `stress_test/code-graph/` or `stress_test/skill-advisor/` only (the subsystem-tagged dirs); empty if none
- `supplementary_stress_files` — semicolon-separated relative paths in `stress_test/{memory,session,search-quality,matrix}/`; empty if none
- `vitest_unit_files` — semicolon-separated relative paths in subsystem `__tests__/`; empty if none
- `manual_playbook_refs` — semicolon-separated paths/anchors in `manual_testing_playbook/`; empty if none
- `stress_coverage_required` — `Y` / `N` / `Maybe` per the rubric (see Output 2 §1)
- `gap_classification` — `P0` / `P1` / `P2` / `none` per the rubric
- `evidence` — one short sentence justifying the classification

CSV escaping: if a cell contains a comma, wrap in double quotes; if it contains double quotes, escape as `""`. Use `;` as separator inside list cells (NOT comma) so that overall CSV stays well-formed.

## Output 2: `coverage-audit.md`

Structure (LOCKED order):

### §1 — Rubrics (frozen BEFORE any matrix discussion)

Verbatim text:

```
**`stress_coverage_required` rubric:**
- **Y** — feature has concurrency, filesystem, lease, capacity-cap, large-corpus, perf-budget, or degraded-state surface
- **N** — pure config / types / registration / static contract with no runtime pressure surface
- **Maybe** — runtime surface exists but expected load is bounded; flag for human review

**`gap_classification` rubric:**
- **P0** — required (Y) AND no direct stress test AND no equivalent supplementary coverage; on a hot path
- **P1** — required (Y) AND direct test exists but is thin (single happy-path or insufficient pressure axis)
- **P2** — `Maybe` AND uncovered, OR documented nice-to-have
- **none** — required is N, OR direct stress test exists with adequate axes
```

### §2 — Per-Group Findings

For EACH of the 15 catalog groups (8 code_graph + 7 skill_advisor):
- One paragraph (3-5 sentences) summarizing coverage state
- Bullet list of feature_ids in that group with their gap_classification

### §3 — Gap Inventory

Three subsections:
- **P0 gaps** — table with columns `feature_id | feature_name | rationale`
- **P1 gaps** — same shape
- **P2 gaps** — same shape

Each table cell `feature_id` MUST link back to the matrix row by id (just write the id; reviewers will grep).

### §4 — Follow-on Recommendation

If §3 P0 table has any rows: write "RECOMMEND opening packet `043-stress-test-gap-remediation` to write missing tests for the P0 features above. Do not auto-create — the user must approve scope."

If §3 P0 table is empty: write "NO follow-on packet recommended. P1/P2 items roll into normal release-readiness backlog."

### §5 — Method Notes

3-5 bullet points on how the audit was performed (which files were grepped, which directories listed, any heuristics used).

## How to work

1. **Read the catalog index files first**, then walk the per-feature files. Don't invent features — count and enumerate from source.
2. **Walk the stress_test tree** with `ls`/`find` and read each test file's `describe`/`it` blocks to know what it actually exercises.
3. **Cross-reference**: for each catalog feature, search test files for the feature's tool name, function name, or behavior keyword. Record matches.
4. **Apply the rubric** consistently. When in doubt, choose `Maybe`/`P2` rather than `Y`/`P0`.
5. **Produce both files in one pass.** Do not claim completion until both files exist with the row counts and structure specified.

## Done definition

- `coverage-matrix.csv` exists with header verbatim + 54 data rows + no empty `stress_coverage_required` or `gap_classification` cells.
- `coverage-audit.md` exists with §1 rubrics frozen first, then §2 per-group findings (15 groups), then §3 gap tables, then §4 recommendation, then §5 method notes.
- Both files written under the packet folder, NOT under scratch/.

Be thorough. Be specific. Cite catalog anchors and test file paths verbatim.
