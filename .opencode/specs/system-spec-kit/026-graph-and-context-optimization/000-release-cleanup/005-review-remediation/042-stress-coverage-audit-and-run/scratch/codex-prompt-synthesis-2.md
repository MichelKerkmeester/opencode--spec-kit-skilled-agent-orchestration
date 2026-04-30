# Stress-Run Report Synthesis

You are parsing the captured `npm run stress` log for spec-kit packet 042. Repository root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

## Packet folder

`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/042-stress-coverage-audit-and-run/`

## Inputs (read-only)

1. **Stress run log** — `<PACKET>/logs/stress-run-<UTC-timestamp>.log` (only one file in `logs/`; find it with `ls logs/`)
2. **Coverage matrix** — `<PACKET>/coverage-matrix.csv` (54 rows; columns include `feature_id`, `stress_test_files`, `supplementary_stress_files`)
3. **Stress baseline** (if present) — `.opencode/skill/system-spec-kit/mcp_server/stress_test/README.md` (search for "skip", "flake", "known-failure" sections)
4. **Stress runner config** — `.opencode/skill/system-spec-kit/mcp_server/vitest.stress.config.ts` and `package.json` script `stress`

## Output: `stress-run-report.md`

Locked structure:

### §1 — Run Metadata
- **Log file**: full relative path (must be the actual filename you read, not a placeholder)
- **Run date (UTC)**: extracted from filename or log
- **Exit code**: extracted from `STRESS_RUN_EXIT_CODE=` trailer line in the log
- **Total duration**: extracted from vitest summary (e.g. "Duration  3.42s")
- **Vitest version**: extracted from log header

### §2 — Per-Subdir Summary

Table:

| Subdir | Files | Tests Total | Passed | Failed | Skipped | Duration |
|--------|-------|-------------|--------|--------|---------|----------|
| `code-graph/` | … | … | … | … | … | … |
| `skill-advisor/` | … | … | … | … | … | … |
| `memory/` | … | … | … | … | … | … |
| `session/` | … | … | … | … | … | … |
| `search-quality/` | … | … | … | … | … | … |
| `matrix/` | … | … | … | … | … | … |
| **Totals** | … | … | … | … | … | … |

If a subdir was not run (e.g. excluded by config), say so explicitly with "(not in run)".

### §3 — Failures (if any)

For each FAIL or ERROR line in the log:
- Test file path (relative to repo root)
- Test name
- Brief failure reason (first 2-3 lines of the assertion / stack)
- **Mapped feature_id(s)** — look up the test file in `coverage-matrix.csv` `stress_test_files` and `supplementary_stress_files` columns; list all matching feature_ids

If zero failures, write "No failures observed."

### §4 — Skips (if any)

For each `.skip` or `it.skip` indicator in the log, list test name + reason if available. If zero, write "No skips observed."

### §5 — Baseline Diff

If `mcp_server/stress_test/README.md` documents known flakes/skips:
- For each known-issue line, indicate whether this run reproduced it (failure observed) or did not (passed despite expected flake)

If no baseline document exists, write: "No baseline document found at `mcp_server/stress_test/README.md`. Treat all failures and skips as new signals."

### §6 — Conclusions

3-5 bullet points:
- Was the run healthy? (exit code 0, low fail count, no infrastructure errors)
- Did any failures map to features classified as P0/P1 in the coverage matrix?
- Recommended next action (e.g., "investigate failed test X", "all green — proceed with packet finalization")

## How to work

1. `ls <PACKET>/logs/` to find the exact log filename — do NOT guess.
2. `tail -30` of the log first to see the vitest summary and the `STRESS_RUN_EXIT_CODE=` trailer.
3. `grep -E "(PASS|FAIL|✓|✗|Test Files|Tests|Duration)" <log>` to extract counts.
4. For per-subdir counts, vitest output groups files by directory; you may need to count `Test Files` lines and aggregate by path prefix.
5. When mapping failures to feature_ids, grep the matrix CSV for the failing test's relative path.
6. Cite the actual log filename in §1, NOT a placeholder.

## Done definition

- `stress-run-report.md` exists with all 6 sections in the locked order
- §1 cites a real log filename (file exists in `logs/`) and the actual exit code
- §2 totals row reconciles (passed + failed + skipped = total)
- §3 / §4 / §5 explicitly say "No … observed." when applicable rather than omitting the section
- File written under the packet folder, NOT scratch/
