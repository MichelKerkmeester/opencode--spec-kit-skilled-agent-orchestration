● Todo added: Review collect-session-data.ts against sk-code-opencode rules

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 1-300
  └ 300 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 301-600
  └ 300 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 601-838
  └ 238 lines read

● Todo completed: review-collect-session-data

### FINDING-01: Module header is not PascalCase and does not match required style
- **File:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1-3`
- **Severity:** CRITICAL
- **Category:** ALIGNMENT
- **Current Behavior:** Header is `// MODULE: Collect Session Data` with spaces/colon format, not PascalCase module token.
- **Expected Behavior:** Use PascalCase module header comment format (e.g., `// MODULE SessionExtractor`).
- **Root Cause:** File header convention diverges from sk-code-opencode P0 rule.
- **Suggested Fix:** Replace top header with a single-line PascalCase module marker, e.g. `// MODULE CollectSessionData`.
- **Effort:** TRIVIAL (<5 min)

### FINDING-02: Section headers do not follow required numbered ALL-CAPS single-line style
- **File:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:49-51,150-152,361-363,595-597,604-606,612-614,820-822`
- **Severity:** HIGH
- **Category:** ALIGNMENT
- **Current Behavior:** Uses multi-line block separators (`/* --- */`) and mixed numbering scheme (`1.5`, `2.5`) instead of required `// N. SECTION` style.
- **Expected Behavior:** Use numbered ALL-CAPS section headers in canonical form (e.g., `// 1. IMPORTS`, `// 2. TYPES`, `// 3. IMPLEMENTATION`).
- **Root Cause:** Legacy section-comment style retained after standards migration.
- **Suggested Fix:** Convert block-style headers to single-line numbered ALL-CAPS headers and normalize numbering sequence.
- **Effort:** SMALL (<30 min)

### FINDING-03: Exported functions are missing TSDoc blocks
- **File:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:154,172,186,198,306,365,391,415,483,519,561,608,616,824-838`
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Functions exported via the bottom export list have explicit types but no `/** ... */` TSDoc on declarations.
- **Expected Behavior:** All public API exports should have TSDoc comments describing purpose/params/returns.
- **Root Cause:** Export surface is centralized at file end, but function-level docs were not added.
- **Suggested Fix:** Add TSDoc blocks above each exported function declaration (at minimum summary + `@param`/`@returns` where relevant).
- **Effort:** MEDIUM (<2 hr)

### FINDING-04: Limited use of `readonly` for immutable collections (P2)
- **File:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:421-425,531,545-559`
- **Severity:** LOW
- **Category:** DESIGN
- **Current Behavior:** Immutable intent arrays/config-like structures are declared mutable (`RegExp[]`, `string[]`, mutable interface properties).
- **Expected Behavior:** Prefer `readonly` on immutable arrays/structures for stronger type-safety and mutation prevention.
- **Root Cause:** Defensive immutability was not consistently applied.
- **Suggested Fix:** Use `readonly RegExp[]`, `readonly string[]`, and `readonly` interface fields where mutation is not intended.
- **Effort:** SMALL (<30 min)

### SUMMARY
- Total findings: 4
- Critical: 1, High: 1, Medium: 1, Low: 1
- Top 3 recommendations: (1) Fix MODULE header to PascalCase format, (2) normalize all section headers to numbered ALL-CAPS single-line style, (3) add TSDoc to every exported function in the public API surface.


Total usage est:        1 Premium request
API time spent:         51s
Total session time:     59s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex           99.6k in, 3.0k out, 89.1k cached (Est. 1 Premium request)
