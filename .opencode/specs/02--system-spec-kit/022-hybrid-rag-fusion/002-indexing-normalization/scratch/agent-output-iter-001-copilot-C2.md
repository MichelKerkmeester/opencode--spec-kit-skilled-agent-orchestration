● skill(sk-code--review)

I’m loading the relevant review standards and scanning all five files for the requested convention checks, then I’ll distill only concrete file:line findings.

● Read SKILL.md
  │ .agents/skills/sk-code--opencode/SKILL.md
  └ 1 line read

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ 1217 lines read

● Read memory-indexer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
  └ 204 lines read

● Read session-types.ts
  │ .opencode/skill/system-spec-kit/scripts/types/session-types.ts
  └ 534 lines read

● Read spec-affinity.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts
  └ 546 lines read

● Read collect-session-data.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
  └ 1009 lines read

● Read code_quality_checklist.md
  │ .agents/skills/sk-code--review/references/code_quality_checklist.md
  └ 162 lines read

● Read quick_reference.md
  │ .agents/skills/sk-code--review/references/quick_reference.md
  └ 151 lines read

● Read security_checklist.md
  │ .agents/skills/sk-code--review/references/security_checklist.md
  └ 206 lines read

I’ve got the files loaded; next I’m doing targeted pattern checks for assertions, logging, exports, and oversized functions so the findings stay precise.

● Search (grep)
  │ "export default" in {utils/input-normalizer.ts,core/memory-indexer.ts,utils/spec-affinity.ts,typ
  │ es/session-types.ts,extractors/collect-session-data.ts}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "@param|export function|export interface|export type" in {utils/input-normalizer.ts,core/memory-
  │ indexer.ts,utils/spec-affinity.ts,types/session-types.ts,extractors/collect-session-data.ts}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "catch\s*(\(|\{)" in {utils/input-normalizer.ts,core/memory-indexer.ts,utils/spec-affinity.ts,ty
  │ pes/session-types.ts,extractors/collect-session-data.ts}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "console\.(log|warn|error)" in {utils/input-normalizer.ts,core/memory-indexer.ts,utils/spec-affi
  │ nity.ts,types/session-types.ts,extractors/collect-session-data.ts}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "\bany\b|as unknown as|as [A-Z][A-Za-z0-9_<>{}\[\]\| ,]+|as typeof " in
  │ {utils/input-normalizer.ts,core/memory-indexer.ts,utils/spec-affinity.ts,types/session-types.ts,
  │ extractors/collect-session-data.ts} (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "^(//\s+\d+\.|/\*\s*─|/\*\s*-|//\s+─)" in {utils/input-normalizer.ts,core/memory-indexer.ts,util
  │ s/spec-affinity.ts,types/session-types.ts,extractors/collect-session-data.ts}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Analyze review target files for console usage, assertions, catches, and long functions (shell)
  │ python - <<'PY'
  │ from pathlib import Path
  │ import re
  │ files = [
  │ Path('.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts'),…
  └ 49 lines...

● Analyze review target files for console usage, assertions, catches, and long functions (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ files = [
  │ Path('.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts'),…
  └ 92 lines...

Quick pass result: all five files have the standard `MODULE` header block, there are no default exports, and I found no raw `any` usage. The main compliance gaps are section-marker consistency, unsafe assertions, mixed console logging, oversized functions, inline heuristics, and missing JSDoc on exported APIs.

`STD-001`  
Category: HEADER  
Severity: NICE-TO-HAVE  
File: `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:50`  
Description: The file starts with the standard numbered banner style, but later switches to block-style separators (`/* ... */`) for `MEMORY INDEXING` and `EXPORTS`, so section markers are not used consistently.  
Fix suggestion: Replace the block banners with the project’s numbered `// N. NAME` separators, or standardize the whole file on one approved style.

`STD-002`  
Category: HEADER  
Severity: SHOULD-FIX  
File: `.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:5`  
Description: Only the opening `// 1. SPEC AFFINITY` section uses the numbered separator pattern; the rest of this 546-line file is unsectioned, which breaks the convention used in the other scripts.  
Fix suggestion: Add numbered section banners for helpers, metadata loading, target construction, text matching, collected-data evaluation, and exports.

`STD-003`  
Category: IMPORT  
Severity: NICE-TO-HAVE  
File: `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:15`  
Description: Import ordering is mixed: stdlib imports are followed by internal imports, then external `@spec-kit/*` imports, then more internal imports. That does not match the stated `stdlib -> external -> internal` order.  
Fix suggestion: Group imports as `fs/path`, then `@spec-kit/*`, then `../*`, with type-only imports grouped consistently.

`STD-004`  
Category: TYPE  
Severity: SHOULD-FIX  
File: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:348`  
Description: This file relies on unsafe assertions in multiple places: `JSON.parse(... ) as T`, `as unknown as Record<string, unknown>` at lines 423/460/878, and `as typeof normalized.session/git` at lines 547/550. These assertions bypass structural validation for untrusted input.  
Fix suggestion: Introduce narrow runtime guards for `FILES`, `session`, `git`, and capture metadata, and return explicitly shaped objects instead of double-casting.

`STD-005`  
Category: ERROR  
Severity: SHOULD-FIX  
File: `.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:147`  
Description: Several catches are bare `catch {}` blocks (lines 147, 156, 250). They discard the error object entirely, which violates the `unknown`-typed catch convention and makes failures opaque.  
Fix suggestion: Use `catch (error: unknown)` and either log structured context or propagate the error where the caller needs to know why resolution/parsing failed.

`STD-006`  
Category: ERROR  
Severity: SHOULD-FIX  
File: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:870`  
Description: The path-resolution fallback uses a bare `catch {}` when `realpathSync` fails, so filesystem errors are silently swallowed without typed context.  
Fix suggestion: Change to `catch (error: unknown)` and emit a structured debug/warn log that preserves the candidate path and failure reason.

`STD-007`  
Category: LOGGING  
Severity: SHOULD-FIX  
File: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:563`  
Description: The file imports `structuredLog` but still emits a direct `console.log` for a normalization event. That breaks structured logging consistency.  
Fix suggestion: Replace the console call with `structuredLog('info', ...)` and include useful fields such as source kind and whether manual fields were transformed.

`STD-008`  
Category: LOGGING  
Severity: SHOULD-FIX  
File: `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:46`  
Description: This file mixes `structuredLog` with many direct `console.error/warn/log` calls (46, 73, 87, 90, 102, 110, 113, 138, 141, 187). Operational events are not consistently structured.  
Fix suggestion: Route operational diagnostics through `structuredLog`; keep console output only if the project explicitly treats it as end-user CLI feedback.

`STD-009`  
Category: LOGGING  
Severity: SHOULD-FIX  
File: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:722`  
Description: The file uses `structuredLog` for truncation events but still writes progress/warnings via `console.log` and `console.warn` (722, 761, 883).  
Fix suggestion: Standardize on one logging path, ideally `structuredLog`, and wrap any intentional terminal-facing progress output in a dedicated helper.

`STD-010`  
Category: FUNCTION  
Severity: SHOULD-FIX  
File: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:190`  
Description: Multiple functions exceed the 50-line guideline: `transformKeyDecision` (~62 lines), `normalizeInputData` (~180), `validateInputData` (~126), and `transformOpencodeCapture` (~337). The largest one mixes normalization, relevance filtering, timestamp repair, prompt extraction, observation building, and file synthesis.  
Fix suggestion: Split these into smaller helpers by responsibility, especially `transformOpencodeCapture` and `normalizeInputData`.

`STD-011`  
Category: FUNCTION  
Severity: SHOULD-FIX  
File: `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:54`  
Description: `indexMemory` is roughly 94 lines and combines embedding generation, trigger extraction, heuristic scoring, DB insertion, and notification side effects.  
Fix suggestion: Extract helpers for trigger phrase resolution, importance-weight calculation, and post-index notification.

`STD-012`  
Category: FUNCTION  
Severity: SHOULD-FIX  
File: `.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:467`  
Description: `evaluateCollectedDataSpecAffinity` is roughly 74 lines and repeats aggregation logic across paths and text collections.  
Fix suggestion: Pull the repeated “merge evaluation into sets” logic into a shared helper to keep the public function focused on orchestration.

`STD-013`  
Category: FUNCTION  
Severity: SHOULD-FIX  
File: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:172`  
Description: Several functions exceed the limit, most notably `collectSessionData` (~313 lines), plus `extractPreflightPostflightData` (~107), `generateLearningSummary` (~54), `determineSessionStatus` (~55), and `extractPendingTasks` (~70).  
Fix suggestion: Break `collectSessionData` into builders for folder resolution, summary/tool metrics, spec-doc discovery, and final `SessionData` assembly.

`STD-014`  
Category: CONSTANT  
Severity: SHOULD-FIX  
File: `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:119`  
Description: The importance-weight heuristic and performance threshold use unnamed literals (`10000`, `10`, `0.3`, `0.3`, `0.2`, `0.2`, `500`). These are domain rules, not self-evident values.  
Fix suggestion: Promote them to named constants or config values such as `IMPORTANCE_LENGTH_CAP`, `IMPORTANCE_ANCHOR_CAP`, and `EMBEDDING_WARN_THRESHOLD_MS`.

`STD-015`  
Category: DOC  
Severity: SHOULD-FIX  
File: `.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:301`  
Description: Exported functions `buildSpecAffinityTargets`, `matchesSpecAffinityFilePath`, `evaluateSpecAffinityText`, `matchesSpecAffinityText`, and `evaluateCollectedDataSpecAffinity` have no JSDoc.  
Fix suggestion: Add JSDoc with purpose, parameters, return shape, and any threshold assumptions (for example, the “2 keyword tokens” rule).

`STD-016`  
Category: DOC  
Severity: SHOULD-FIX  
File: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:697`  
Description: `collectSessionData` is exported but undocumented, despite being a high-surface API that accepts nullable input and performs fallback simulation.  
Fix suggestion: Add JSDoc covering inputs, fallback behavior, major derived fields, and the fact that it returns a fully assembled `SessionData` payload.


Total usage est:        1 Premium request
API time spent:         3m 38s
Total session time:     3m 54s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  406.7k in, 14.8k out, 352.5k cached (Est. 1 Premium request)
