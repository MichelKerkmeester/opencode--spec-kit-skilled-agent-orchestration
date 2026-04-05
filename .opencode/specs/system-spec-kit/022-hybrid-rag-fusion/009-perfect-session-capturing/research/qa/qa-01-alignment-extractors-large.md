● SQL: Create review todos
  └ 2 row(s) inserted. Last inserted row ID: 2.

● Read .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts lines 1-240
  └ 240 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts lines 241-478
  └ 233 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts lines 1-280
  └ 280 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts lines 281-539
  └ 243 lines read

● Grep "P0|P1|P2|rules|RULES" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/sk-code-opencode/SKILL.md)
  └ 26 lines found

● Read .opencode/skill/sk-code-opencode/SKILL.md lines 336-455
  └ 119 lines read

● Todo started: read-target-files

● Grep "^import " (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts)
  └ 6 lines found

● Grep "^import " (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts)
  └ 5 lines found

● Grep "catch\s*\(" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts)
  └ No matches found

● Grep "catch\s*\(" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts)
  └ 2 lines found

● Grep "^export (async )?function|^export const|^export interface|^export type|^export \{"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts)
  └ 12 lines found

● Grep "^export (async )?function|^export const|^export interface|^export type|^export \{"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts)
  └ 8 lines found

● Grep "\bany\b" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts)
  └ No matches found

● Grep "\bany\b" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts)
  └ No matches found

● Grep "^(async )?function\s+[A-Za-z0-9_]+" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts)
  └ 16 lines found

● Grep "^(async )?function\s+[A-Za-z0-9_]+" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts)
  └ 15 lines found

● Grep "^\s*\}\s*catch" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts)
  └ 8 lines found

● Grep "^\s*\}\s*catch" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts)
  └ 2 lines found

● Todo completed: audit-rules

### FINDING-01: Module header is not PascalCase `// MODULE <Name>` (session-extractor)
- **File:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:1-4`
- **Severity:** CRITICAL
- **Category:** ALIGNMENT
- **Current Behavior:** Header uses `// MODULE: Session Extractor` (colon + spaced words), not PascalCase module token.
- **Expected Behavior:** Header should follow PascalCase module name style (e.g., `// MODULE SessionExtractor`) per the stated P0 rule.
- **Root Cause:** File header format drift from enforced local convention.
- **Suggested Fix:** Replace top header line with PascalCase module identifier and remove colon style.
- **Effort:** TRIVIAL (<5 min)

### FINDING-02: `catch` blocks do not use `catch (error: unknown)` + guard (session-extractor)
- **File:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:131-140,318-324`
- **Severity:** HIGH
- **Category:** ALIGNMENT
- **Current Behavior:** Uses bare `catch { ... }` in `getChannel` and local `fileExists`.
- **Expected Behavior:** Use `catch (error: unknown)` and narrow via `instanceof Error` before reading error details.
- **Root Cause:** Error-handling pattern not aligned with required P1 catch convention.
- **Suggested Fix:** Convert both catches to typed unknown catches and add guard-based handling/logging path.
- **Effort:** SMALL (<30 min)

### FINDING-03: Exported functions are undocumented with TSDoc (session-extractor)
- **File:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:125-450,456-473`
- **Severity:** HIGH
- **Category:** QUALITY
- **Current Behavior:** Exported API functions are re-exported at bottom but function declarations do not have `/** ... */` TSDoc blocks.
- **Expected Behavior:** All public exports should carry TSDoc comments (summary + params/returns where relevant).
- **Root Cause:** Interfaces are documented, but function-level public API docs were not added.
- **Suggested Fix:** Add TSDoc above all exported functions (`generateSessionId`, `getChannel`, `detectContextType`, etc.) before export aggregation.
- **Effort:** MEDIUM (<2 hr)

### FINDING-04: Module header is not PascalCase `// MODULE <Name>` (opencode-capture)
- **File:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:1-4`
- **Severity:** CRITICAL
- **Category:** ALIGNMENT
- **Current Behavior:** Header uses `// MODULE: Opencode Capture`, which is not PascalCase module naming.
- **Expected Behavior:** Header should be PascalCase module form (e.g., `// MODULE OpencodeCapture`).
- **Root Cause:** Header formatting and naming do not match required P0 variant.
- **Suggested Fix:** Update the module header comment to PascalCase module token format.
- **Effort:** TRIVIAL (<5 min)

### FINDING-05: Multiple `catch` blocks violate unknown+guard pattern (opencode-capture)
- **File:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:119,128,219,256,303,339`
- **Severity:** HIGH
- **Category:** ALIGNMENT
- **Current Behavior:** Several functions use bare `catch { ... }` (`pathExists`, `readJsonSafe`, `getProjectId`, `getRecentSessions`, `getSessionMessages`, `getMessageParts`), while only two catches are compliant (`157`, `167`).
- **Expected Behavior:** All catches should use `catch (error: unknown)` with `instanceof Error` guard handling.
- **Root Cause:** Inconsistent error-handling style across utility/retrieval functions.
- **Suggested Fix:** Normalize all bare catches to typed unknown catches and guard-narrowing.
- **Effort:** SMALL (<30 min)

### FINDING-06: Exported functions/constants are missing TSDoc (opencode-capture)
- **File:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:101-109,115-501,507-523`
- **Severity:** HIGH
- **Category:** QUALITY
- **Current Behavior:** Exported interfaces have TSDoc, but exported functions and exported constants (`OPENCODE_STORAGE`, `PROMPT_HISTORY`) do not.
- **Expected Behavior:** Public API exports should have `/** ... */` documentation blocks.
- **Root Cause:** Documentation coverage is interface-focused; function/constant exports were omitted.
- **Suggested Fix:** Add TSDoc comments to all exported functions and exported constants before export block.
- **Effort:** MEDIUM (<2 hr)

### FINDING-07: P2 opportunity — immutable API shapes are not marked `readonly` (session-extractor)
- **File:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:25-117`
- **Severity:** LOW
- **Category:** DESIGN
- **Current Behavior:** Exported interfaces expose mutable fields even for snapshot-like data structures.
- **Expected Behavior:** Immutable/public snapshot structures should prefer `readonly` fields where mutation is not intended.
- **Root Cause:** Types were modeled as mutable defaults without immutability intent encoding.
- **Suggested Fix:** Add `readonly` to stable metadata fields (e.g., `ProjectStateSnapshot`, `RelatedDoc`, `FileProgressEntry`) where safe.
- **Effort:** SMALL (<30 min)

### FINDING-08: P2 opportunity — immutable API shapes are not marked `readonly` (opencode-capture)
- **File:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:17-95`
- **Severity:** LOW
- **Category:** DESIGN
- **Current Behavior:** Exported capture DTO interfaces are fully mutable by type.
- **Expected Behavior:** Capture payload and metadata DTOs should use `readonly` for fields not intended to mutate post-construction.
- **Root Cause:** Type definitions prioritize convenience over immutability guarantees.
- **Suggested Fix:** Apply `readonly` (and `ReadonlyArray` where suitable) on DTO interfaces like `ConversationCapture`, `Exchange`, `ToolExecution`.
- **Effort:** SMALL (<30 min)

### SUMMARY
- Total findings: 8
- Critical: 2, High: 4, Medium: 0, Low: 2
- Top 3 recommendations: (1) Fix both P0 module headers to PascalCase format first, (2) normalize all bare catches to `catch (error: unknown)` + `instanceof Error` guards, (3) add TSDoc to all exported functions/constants (both files).


Total usage est:        1 Premium request
API time spent:         1m 56s
Total session time:     2m 5s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex           289.6k in, 6.0k out, 247.4k cached (Est. 1 Premium request)
