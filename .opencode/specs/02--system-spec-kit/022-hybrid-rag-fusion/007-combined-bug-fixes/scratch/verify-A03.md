## Agent A03: Cross-Commit Regression (Commits 11-15)

**Reviewer:** Claude Opus 4.6 (A03)
**Date:** 2026-03-08
**Scope:** Commits 7b95bbfc, bcc067a7, 6c47c091, 65554a3d — cross-commit regression analysis
**Files reviewed:** 5 focus files + grep across entire scripts/ and mcp_server/ trees

---

### Summary

The five commits under review introduce config centralization, a contamination deny-list, code-block-safe HTML stripping, an alignment-check throw, and a rollout-policy import revert. Overall the changes are well-structured with no P0 blockers. Two P2 findings relate to orphaned config constants and a minor false-positive risk in the contamination filter. The rollout-policy import path is confirmed correct after revert.

**Score: 82/100 (ACCEPTABLE — PASS)**

| Dimension       | Score | Max | Notes |
|-----------------|-------|-----|-------|
| Correctness     | 25    | 30  | Orphaned config values reduce score slightly |
| Security        | 23    | 25  | Session ID entropy is adequate (48-bit CSPRNG) |
| Patterns        | 18    | 20  | Consistent patterns, minor dead-config concern |
| Maintainability | 10    | 15  | Orphaned constants create confusion for future devs |
| Performance     | 6     | 10  | HTML stripping regex split is fine for typical content sizes |

---

### Findings

#### P2-01: Orphaned config constants — `MIN_PROMPT_LENGTH` and `MAX_OBSERVATIONS` never consumed

- **File:** `scripts/core/config.ts:236-237` (definition) and `scripts/core/config.ts:83-84,149-150` (defaults)
- **Evidence:** `CONFIG.MIN_PROMPT_LENGTH` (default: 60) and `CONFIG.MAX_OBSERVATIONS` (default: 3) are declared in the `SpecKitConfig` interface (lines 52, 53), set in the CONFIG object (lines 236-237), validated via `positiveFields` (lines 83-84), and assigned defaults (lines 149-150). However, a project-wide grep for `CONFIG.MIN_PROMPT_LENGTH` and `CONFIG.MAX_OBSERVATIONS` returns **zero results** across both `scripts/` and `mcp_server/`. These constants were likely moved from inline usage during config centralization (commit 14) but their consumers were either removed or never migrated.
- **Impact:** Dead code. No functional regression, but creates confusion about intended use. Future devs may waste time tracing non-existent consumers.
- **Suggestion:** Either add consumers or remove from `WorkflowConfig`, `SpecKitConfig`, and `validateConfig`.

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|-----------------|-------------------|-----------------|----------------|
| Orphaned MIN_PROMPT_LENGTH / MAX_OBSERVATIONS | P1 | These may be consumed at runtime via dynamic property access, or used in templates/tests outside grep scope. However, TypeScript config is only used by TS modules, and grep covered the entire project tree. No hits. | Confirmed orphaned, but no functional regression — downgrade. | P2 |

---

#### P2-02: Contamination filter — broad patterns risk false positives on quoted AI dialogue

- **File:** `scripts/extractors/contamination-filter.ts:6-43`
- **Evidence:** Patterns like `/\bI need to\b/gi` (line 12), `/\bLet me check\b/gi` (line 11), `/\bStep\s+\d+:/gi` (line 10), and `/\bSure!\s/gi` (line 37) will match legitimate user-authored content that quotes AI output or discusses workflow steps. For example, a spec document that says "Step 1: Configure the database" or a user message "I need to fix the pipeline" would have these phrases stripped.
- **Impact:** LOW. The filter operates on orchestration chatter before semantic extraction. Content entering this path is AI assistant output, not user-authored specs. However, if a human writes conversational text in the session that gets captured as an observation, legitimate phrases could be stripped.
- **Suggestion:** Consider anchoring patterns to line-start or sentence-start positions (e.g., `/^Let me check\b/gim`) to reduce false positives on mid-sentence occurrences. Alternatively, add a minimum-removal threshold: if >50% of content would be removed, skip filtering and flag for manual review.

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|-----------------|-------------------|-----------------|----------------|
| Broad deny-list patterns | P1 | The filter is specifically designed for AI orchestration chatter; its input is assistant messages, not human prose. False positives on human content are unlikely given the data flow. The `\b` word boundaries already limit matching scope. | Valid concern but impact is limited by data pipeline context. Downgrade. | P2 |

---

#### P2-03: Alignment check throw at 5% threshold could block edge cases

- **File:** `scripts/core/workflow.ts:578-607`
- **Evidence:** The alignment check (line 598) throws when `overlapRatio < 0.05` — i.e., fewer than 5% of captured file paths contain spec-folder keywords. The spec keywords are derived from the folder name after stripping the numeric prefix (line 584: `path.basename(activeSpecFolderArg).replace(/^\d+-/, '').toLowerCase()`), then split on hyphens, filtering words >= 3 chars.
- **Scenario risk:** A spec folder named `007-combined-bug-fixes` yields keywords `["combined", "bug", "fixes"]`. If the session modifies files like `pipeline.ts`, `search.ts`, `quality-scorer.ts` — none of which contain "combined", "bug", or "fixes" — the check throws. This is by design (preventing cross-spec contamination), but the 5% threshold is very aggressive. A session that touches 20 files where only 1 path contains a keyword (5%) will pass; 0 out of 20 will throw. The error message correctly instructs the user to "pass data via JSON file" as a workaround.
- **Impact:** LOW. The throw is intentional (commit 11: "alignment check now throws to block cross-spec contamination"). The workaround (JSON file) exists. The check only applies in stateless mode (no data file, no preloaded data).
- **Suggestion:** Consider logging a warning at 5-15% overlap rather than silently passing, to alert users of borderline alignment.

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|-----------------|-------------------|-----------------|----------------|
| Aggressive 5% threshold | P1 | This is the explicit design intent of commit 11. The workaround (JSON file) exists. Stateless mode is specifically the risky path. | Intentional behavior with documented escape hatch. Downgrade. | P2 |

---

#### PASS: HTML stripping correctly preserves code blocks

- **File:** `scripts/core/workflow.ts:969-988`
- **Evidence:** The implementation splits content on fenced code blocks using `/(```[\s\S]*?```)/g` (line 974), which captures code fences as array elements. The `map` callback (line 976-981) checks `segment.startsWith('```')` to identify code blocks (preserved) vs. non-code sections (where `<div>`, `<span>`, `<p>`, `<br>`, `<hr>` tags are stripped). The regex uses a capture group, so `split()` includes the matched fences in the result array at odd indices — the `startsWith` check correctly identifies these.
- **Correctness confirmed:** The approach is sound. Nested fences (```` ``` ```` inside ```` ``` ````) would be consumed by the first greedy match, which is the correct behavior for markdown rendering. The `[\s\S]*?` lazy quantifier matches the shortest fence pair, preventing over-consumption.

---

#### PASS: Session ID entropy is adequate

- **File:** `scripts/extractors/session-extractor.ts:123-128`
- **Evidence:** `crypto.randomBytes(6)` produces 6 bytes = 48 bits of entropy from Node's CSPRNG. The output format is `session-{timestamp}-{12-hex-chars}`. The hex encoding (`[a-f0-9]`) is safe — no special characters that could cause injection in file paths or JSON. 48 bits provides ~281 trillion possible values, sufficient for session uniqueness.
- **Comment accuracy:** Line 124 correctly documents "6 bytes = 12 hex chars = 48 bits".

---

#### PASS: Rollout-policy import path is correct after revert

- **File:** `mcp_server/lib/search/causal-boost.ts:9`
- **Evidence:** The import `from '../cache/cognitive/rollout-policy'` resolves from `mcp_server/lib/search/` up to `mcp_server/lib/`, then into `cache/cognitive/rollout-policy.ts`. Verified via filesystem: `mcp_server/lib/cache/cognitive/rollout-policy.ts` exists and contains the `isFeatureEnabled` export. Commit 13 (6c47c091) specifically reverted this path to fix CI TS6307 error. All other consumers of rollout-policy (`graph-flags.ts`, `session-boost.ts`, `search-flags.ts`, `extraction-adapter.ts`) use the same `../cache/cognitive/rollout-policy` relative path pattern, confirming consistency.
- **Note:** A second copy exists at `mcp_server/lib/cognitive/rollout-policy.ts` (used by `working-memory.ts` which is in the `cognitive/` directory). The two copies serve different import trees — `lib/cognitive/` modules import from their sibling, `lib/search/` and `lib/extraction/` modules import from `lib/cache/cognitive/`. This duplication is a pre-existing architectural pattern outside the scope of these commits.

---

#### PASS: Config values are consumed (except P2-01 orphans)

- **File:** `scripts/core/config.ts` (all constants)
- **Evidence:** Verified via grep that the following CONFIG properties have active consumers:
  - `MAX_CONTENT_PREVIEW` — used in `spec-folder-extractor.ts:228`, `semantic-summarizer.ts:338`
  - `MAX_FILES_IN_MEMORY` — used in `spec-folder-extractor.ts:283`, `file-extractor.ts:173-178`
  - `TOOL_OUTPUT_MAX_LENGTH` — used in `opencode-capture.ts:401,484`
  - `TIMESTAMP_MATCH_TOLERANCE_MS` — used in `opencode-capture.ts:475`
  - `TOOL_PREVIEW_LINES` — used in `conversation-extractor.ts:134-135`
  - All other CONFIG properties (`MAX_RESULT_PREVIEW`, `MAX_CONVERSATION_MESSAGES`, `MAX_TOOL_OUTPUT_LINES`, `TRUNCATE_FIRST_LINES`, `TRUNCATE_LAST_LINES`, `MESSAGE_TIME_WINDOW`, `TIMEZONE_OFFSET_HOURS`) are consumed in workflow.ts and other core modules.

---

### Verdict

**PASS (82/100)** — No P0 or P1 issues. Three P2 suggestions for future improvement. All five focus areas verified:

| Check | Result | Details |
|-------|--------|---------|
| Config values consumed | PASS (with caveat) | 2 orphaned constants (P2-01), all others have verified consumers |
| Contamination filter false positives | PASS (with caveat) | Broad patterns acceptable given pipeline context (P2-02) |
| HTML stripping preserves code blocks | PASS | Correct fence-aware split implementation |
| Alignment check throw | PASS | Intentional design with JSON workaround documented |
| Rollout-policy import path | PASS | Verified correct after revert; filesystem confirms target exists |
