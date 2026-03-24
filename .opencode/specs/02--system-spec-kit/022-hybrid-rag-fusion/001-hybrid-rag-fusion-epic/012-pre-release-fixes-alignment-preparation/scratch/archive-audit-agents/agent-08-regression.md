**Commits analyzed**
- `54ee622` `fix(spec-kit): resolve 4 deferred findings — double-fusion, test isolation, behavioral tests, DB paths`
- `dace1f87` `fix(spec-kit): remove deprecated dead code + clean catalog/playbook references`
- `d4035de` `docs(spec-kit): update feature catalog + testing playbook for 40-fix code review audit`
- `98c5a4e` `fix(spec-kit): fix 15 review findings — 2 critical, 10 high, 3 medium`
- `a8036f3` `feat(spec-kit): implement 3 deprecated features + remove 3 dead modules`

**REGRESSIONS**
- `P1` The `54ee622` raw-candidate refactor weakened the Stage 1 fallback path. In raw mode, [`hybrid-search.ts#L1344`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1344) catches internal hybrid errors and, when `skipFusion` is set, returns `[]` at [`hybrid-search.ts#L1349`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1349). `collectRawCandidates()` then treats that as a normal empty-result case and only tries lexical fallbacks at [`hybrid-search.ts#L1418`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1418), so Stage 1 never reaches its explicit vector fallback branch at [`stage1-candidate-gen.ts#L622`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L622). Before this refactor, a hybrid failure could still degrade to vector; now the same failure can silently degrade to lexical-only or empty results.

**INCOMPLETE REFACTORS**
- `P3` The Stage 1 tests were not fully renamed or split when `collectRawCandidates()` replaced `searchWithFallback()`. [`stage1-expansion.vitest.ts#L52`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts#L52) and [`spec-folder-prefilter.vitest.ts#L44`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts#L44) mock both exports with the same function, while assertions and test names still talk about `searchWithFallback` at [`stage1-expansion.vitest.ts#L257`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts#L257) and [`spec-folder-prefilter.vitest.ts#L246`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts#L246). The suite still passes, but it no longer proves Stage 1 is specifically using the new raw-collector path.

**DEAD REFERENCES**
- `P2` `dace1f87` removed `index-refresh.vitest.ts`, but the playbook still cites it as active coverage at [`manual_testing_playbook.md#L3330`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md#L3330). That is a removed-feature cleanup miss.
- `P3` [`causal-edges.ts#L7`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts#L7) still imports `clearDegreeCache`, but only `clearDegreeCacheForDb` is used in the file at [`causal-edges.ts#L108`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts#L108). Harmless, but it is a dead import.

**MERGE ISSUES**
- None found in the reviewed diffs.
- `HEAD` is `272703507 Auto stash before merge of "main" and "origin/main"`.
- `git diff --check HEAD` returned no output, so the auto-stash merge appears clean.
- I did not find live `<<<<<<<` / `>>>>>>>` conflict markers under `.opencode/skill/system-spec-kit`.

**SUMMARY**
I reviewed the requested logs, deep-read the last 5 code-touching commits, and found one real regression risk in `54ee622` around lost vector fallback on raw hybrid failures. The rest looks mostly clean, with one stale removed-feature reference, one dead import, and one incomplete test refactor that weakens regression coverage. I also ran a focused Vitest batch covering the touched risk areas (`252` tests passed) and a direct TypeScript compile pass, which both succeeded.
