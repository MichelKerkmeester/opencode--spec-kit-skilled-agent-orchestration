# Changelog: 024/028-startup-highlights-remediation

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 028-startup-highlights-remediation — 2026-04-02

The startup brief already surfaced structural highlights, but the signal quality was not good enough to trust. Duplicate entries, vendored code, and the wrong ranking heuristic wasted startup budget on noise. This phase repaired all three P1 findings from the 2026-04-02 deep review and turned the highlights section into something that actually orients the AI instead of distracting it.

> Spec folder: `.opencode/specs/system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation/`

---

## Bug Fixes (3)

### Deduplicated startup highlights

**Problem:** The query grouped by symbol ID even when different rows rendered to the same visible name, kind, and file. The startup brief could waste most of its slots repeating what looked like the same symbol.

**Fix:** Reworked the SQL aggregation so grouping happens on the display fields and totals are summed, which removes visible duplicates from the highlight list.

### Project-only path filtering

**Problem:** Vendored packages, virtual environments, generated output, and test files were showing up in startup highlights, which made the orientation section feel random.

**Fix:** Added a filtered-node stage with hard path exclusions for common non-project directories such as `site-packages`, `node_modules`, `.venv`, `dist`, `build`, and test folders. Startup highlights now prefer project code.

### Incoming-call ranking instead of noisy callers

**Problem:** The old heuristic rewarded the chattiest callers, not the symbols the codebase depends on most. That pulled test harnesses and utility fan-out into the highlights instead of central project symbols.

**Fix:** Switched the edge join to rank by incoming callers, so the startup brief now surfaces the functions and classes other code depends on rather than whichever symbol happens to call the most things.

---

## Testing (2)

### Targeted startup-brief test expansion

**Problem:** The fix needed proof that it changed the behavior users actually see, not just the shape of the SQL.

**Fix:** Added three startup-brief tests covering orientation output, empty highlights, and configurable highlight count, bringing the focused suite to 6 passing tests.

### Live query validation

**Problem:** A SQL cleanup can pass unit tests and still produce poor real-world output on the actual repo.

**Fix:** Ran a live `queryStartupHighlights(5)` check after the remediation. The phase summary records `0 duplicates`, `0 vendored/test files`, and all five returned results from project code, which is the practical proof this follow-on phase was meant to deliver.

---

## Deep Review Closure (1)

### Review findings closed

**Problem:** The deep review for startup usefulness had an active `CONDITIONAL` verdict because the highlights section was low-signal and under-justified.

**Fix:** Phase 028 closed the three active P1 findings, and the current packet review report now records `PASS | hasAdvisories=true` with the P1 set resolved.

---

<details>
<summary>Files Changed (3)</summary>

| File | What changed |
|------|-------------|
| `mcp_server/lib/code-graph/code-graph-db.ts` | Rewrote `queryStartupHighlights()` with filtered, aggregated, ranked SQL. |
| `mcp_server/lib/code-graph/startup-brief.ts` | Exposed `highlightCount` through `buildStartupBrief()`. |
| `tests/startup-brief.vitest.ts` | Added three tests covering orientation note, empty highlights, and custom count. |

</details>

---

## Upgrade

No migration required. The behavior change is intentionally narrow: startup highlights stay enabled, but now only after the query was cleaned up enough to meet the review quality bar.
