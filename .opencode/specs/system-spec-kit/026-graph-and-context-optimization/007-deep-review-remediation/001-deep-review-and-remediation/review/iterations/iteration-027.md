# Iteration 27 - security - advisor

## Dispatcher
- iteration: 27 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:06:26.510Z

## Files Reviewed
- .opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py
- .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py
- .opencode/skill/skill-advisor/scripts/skill_advisor.py
- .opencode/skill/skill-advisor/scripts/init-skill-graph.sh
- .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py
- .opencode/skill/skill-advisor/scripts/skill_advisor_bench.py

## Findings - New
### P0 Findings
- None.

### P1 Findings
#### P1-001 [P1] `discover_graph_metadata()` fails open on corrupt/unreadable skill metadata, so validation/export can succeed with a silently truncated graph
- File: `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:50-76,589-646`
- Evidence: `discover_graph_metadata()` catches `json.JSONDecodeError` and `OSError`, prints a warning, and drops the offending `graph-metadata.json` from `results` instead of surfacing a validation error (`skill_graph_compiler.py:69-75`). `main()` validates only the surviving entries in `all_metadata` and prints `VALIDATION PASSED` whenever `total_errors == 0` (`skill_graph_compiler.py:589-646`), so a malformed or unreadable metadata file disappears from both validation and compiled output rather than failing closed. `init-skill-graph.sh` trusts that exit path as the guardrail before exporting the fallback graph (`init-skill-graph.sh:53-60`).
- Recommendation: treat discovery-time parse/read failures as hard validation errors and abort export when any checked-in `graph-metadata.json` cannot be loaded.

```json
{
  "claim": "A broken or tampered graph-metadata.json can be silently omitted from validation and from the exported skill graph because discovery downgrades parse/read failures to warnings.",
  "evidenceRefs": [
    ".opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:69-75",
    ".opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:589-646",
    ".opencode/skill/skill-advisor/scripts/init-skill-graph.sh:53-60"
  ],
  "counterevidenceSought": "I looked for a separate accumulator that turns discovery warnings into a non-zero exit code, or for a second pass that verifies every on-disk graph-metadata.json was loaded before printing VALIDATION PASSED, and found neither in the reviewed compiler/init flow.",
  "alternativeExplanation": "If the compiler were intentionally designed to build partial graphs from best-effort metadata, warning-only discovery would be acceptable; the CLI text and init script, though, present this step as graph validation, not partial recovery.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if another reviewed enforcement layer proves that unreadable or malformed graph-metadata.json files are impossible in shipped flows or are rejected before this compiler runs."
}
```

#### P1-002 [P1] `get_cached_skill_records()` silently drops unreadable/corrupt `SKILL.md` files, and `health_check()` still reports healthy routing
- File: `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:38-64,165-197`; `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1185-1187,1849-1888`
- Evidence: `parse_frontmatter_fast()` returns `None` on `OSError`, `UnicodeDecodeError`, or `ValueError` without logging (`skill_advisor_runtime.py:40-64`). `get_cached_skill_records()` skips any `None` result via `continue` and stores the reduced record set as the cache (`skill_advisor_runtime.py:177-188`), and `get_skills()` consumes that partial map directly (`skill_advisor.py:1185-1187`). `health_check()` reports `status: "ok"` whenever at least one real skill remains and the graph loads, while `get_cache_status()` exposes only a count of cached records and no skipped/error count (`skill_advisor.py:1849-1888`, `skill_advisor_runtime.py:191-197`), so a corrupted or unreadable `SKILL.md` can remove a skill from Gate 2 routing without surfacing degraded health.
- Recommendation: record skipped skill files explicitly and make health fail/degrade whenever discovery drops a checked-in `SKILL.md`.

```json
{
  "claim": "The runtime skill catalog fails open: a broken SKILL.md is silently removed from routing and the health endpoint can still claim the advisor is healthy.",
  "evidenceRefs": [
    ".opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:40-64",
    ".opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:177-197",
    ".opencode/skill/skill-advisor/scripts/skill_advisor.py:1185-1187",
    ".opencode/skill/skill-advisor/scripts/skill_advisor.py:1849-1888"
  ],
  "counterevidenceSought": "I looked for any skipped-file telemetry, expected-skill-count check, or health guard that compares discovered skills against the on-disk SKILL.md inventory, and found none in the reviewed runtime/health path.",
  "alternativeExplanation": "If SKILL.md files are guaranteed immutable and always validated elsewhere before runtime, silent omission would be less risky; in the shipped advisor flow, though, these files are the authoritative routing catalog for mandatory skill selection.",
  "finalSeverity": "P1",
  "confidence": 0.94,
  "downgradeTrigger": "Downgrade if a separate reviewed startup/CI gate is proven to block every unreadable or malformed SKILL.md before users can invoke the advisor."
}
```

### P2 Findings
- `.opencode/skill/skill-advisor` currently has no automated test files adjacent to the reviewed scripts; discovery only surfaced `manual_testing_playbook/manual_testing_playbook.md`, while the shipped harnesses `skill_advisor_regression.py` and `skill_advisor_bench.py` focus prompt accuracy/latency (`skill_advisor_regression.py:68-246`, `skill_advisor_bench.py:96-260`). There is no automated regression coverage for corrupt `graph-metadata.json`, unreadable `SKILL.md`, or health-check fail-closed behavior, so both integrity issues above can regress while the package still appears green.

## Traceability Checks
- `skill_graph_compiler.py` and `init-skill-graph.sh` do **not** fully match their own "validate graph metadata before export" contract: discovery-time parse/read failures are downgraded to warnings and omitted from the compiled graph instead of blocking export.
- The rest of the reviewed advisor subset stays within local parsing/routing responsibilities. I found no `shell=True`, `eval`, network fetches, or unquoted shell expansion in the reviewed implementation surface.

## Confirmed-Clean Surfaces
- `.opencode/skill/skill-advisor/scripts/init-skill-graph.sh` - uses fixed command invocations and a quoted `run_from_repo "$@"` wrapper; no command-construction or shell-injection sink is exposed in the reviewed setup flow.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py` - `_load_skill_graph()` invokes the compiler through `subprocess.run([...])` list form rather than shell evaluation, so the auto-compile fallback itself is not a command-injection vector.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` - `validate_derived_metadata()` does block raw absolute paths and plain `..` escapes for `derived.source_docs`, `derived.key_files`, and `derived.entities[*].path`; the reviewed issue is fail-open error handling, not an obvious direct traversal-by-string bug.

## Next Focus
- Review the remaining advisor ingestion paths (`--semantic-hits`, batch input, and SQLite graph loading) for the same fail-open integrity pattern: malformed inputs that get downgraded to warnings or silent omission instead of hard failure.
