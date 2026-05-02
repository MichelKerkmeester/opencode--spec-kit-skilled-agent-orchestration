## Packet 035: full-matrix-execution-validation — Tier D

You are cli-codex (gpt-5.5 high fast) implementing remediation packet **022-full-matrix-execution-validation**.

### Goal

Execute the full automation matrix design from packet 030 (`specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/030-v1-0-4-full-matrix-stress-test-design/`). Capture per-cell pass/fail/blocked evidence. Convert remaining manual-only diagnostic surfaces into either accepted manual status or scoped remediation tickets.

### Read these first

- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/030-v1-0-4-full-matrix-stress-test-design/spec.md` (the matrix scope)
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/030-v1-0-4-full-matrix-stress-test-design/plan.md` (the execution architecture — Option C: each feature owns its runner; meta-aggregator reads per-cell JSONL)
- All other packet docs in 030/ (decision-record, feature-catalog-impact-audit, testing-playbook-impact-audit if present)
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/017-automation-reality-supplemental-research/research/research-report.md` (Section 6 Packet 035 scope)

### Implementation

1. **Discovery phase**: Read 030's matrix design completely. Identify:
   - All feature surfaces (F1-F14 per spec)
   - All executor surfaces (cli-codex, cli-copilot, cli-gemini, cli-claude-code, cli-opencode, native+inline)
   - Which cells are applicable vs N/A (e.g., F11 hooks not reachable from cli-gemini)
   - Where per-cell runners live (per Option C architecture)
2. **Scope discipline**: Freeze the matrix BEFORE execution. List cells in 035/research/iterations/iteration-001.md. Mark each cell with status `applicable` | `not_applicable_with_reason`.
3. **Execution phase**:
   - For each applicable cell, run the corresponding feature-runner with the executor (or skip if runner doesn't exist yet — flag as `runner_missing`)
   - Capture per-cell JSONL output to `035/results/<feature>-<executor>.jsonl`
   - Record actual triggers, outputs, fail-open behavior, feature flags, and manual fallbacks per cell
4. **Aggregation phase**:
   - Aggregate per-cell results into a single matrix table
   - Report: passed cells, failed cells, blocked cells, runner_missing cells, not_applicable cells
   - Compute headline metrics: pass rate by feature, pass rate by executor, overall coverage %
5. **Output**: Write `035/findings.md` with:
   - The full signed-off matrix (rows × executors)
   - Per-cell evidence (file:line refs to runner output)
   - Convergence verdict per row (does the feature work across all applicable executors? if not, why?)
   - Tickets opened for cells that failed or had runner_missing — each ticket maps to a remediation packet
   - Honest scoping caveats: this is its own NEW BASELINE, not directly comparable to v1.0.2 / v1.0.3 / 029

### Scoping

- If 030's design is incomplete (missing per-feature runners), DO NOT block: execute what you can, flag missing runners as `runner_missing`, recommend a separate packet to build them.
- Do NOT run the full vitest suite (per memory feedback, some files hang). Run feature-runners individually.
- Reasonable execution timeout per cell: 5 min. After timeout, mark `timeout_cell` and continue.

### Packet structure to create (Level 2)

Same 7-file structure as 031 under `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/022-full-matrix-execution-validation/`. Plus an additional `findings.md` at packet root.

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/018-doc-truth-pass","system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/019-code-graph-watcher-retraction","system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/020-memory-retention-sweep","system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/021-half-auto-upgrades","system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/030-v1-0-4-full-matrix-stress-test-design"]`.

**Trigger phrases**: `["022-full-matrix-execution-validation","full matrix execution","v1-0-4 stress","matrix execution validation","feature × executor matrix"]`.

**Causal summary**: `"Tier D: execute 030's full-matrix design across feature × executor cells. Capture per-cell pass/fail/blocked. Produce signed-off matrix + remediation tickets for cells that failed or had runner_missing. New baseline; not comparable to v1.0.2/v1.0.3/029."`.

**Frontmatter rules**: Same compact `recent_action` / `next_safe_action` rules as 031. < 80 chars, non-narrative.

### Phases

1. **Phase 1: Setup** — Create 7 packet files. Initial completion_pct=5.
2. **Phase 2: Implementation** — Discovery → scope freeze → execution → aggregation → findings.md.
3. **Phase 3: Validation** — Strict validator exits 0; findings.md complete with signed-off matrix.

### Constraints

- This packet RUNS tests but does NOT mutate runtime code (research/validation only).
- Strict validator MUST exit 0.
- DO NOT commit; orchestrator will commit.
- Cite file:line evidence in packet docs.
- Honest reporting: if 030's design is incomplete or runners are missing, say so explicitly.
- Acceptable terminal states: PASS / CONDITIONAL / FAIL with explicit rationale.

When done, last action is strict validator passing. No narration; just write files and exit.
