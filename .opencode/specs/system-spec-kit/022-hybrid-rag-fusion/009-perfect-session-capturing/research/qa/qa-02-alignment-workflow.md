● Todo added: Review workflow.ts against sk-code-opencode rules

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1-300
  └ 299 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 300-600
  └ 301 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 600-end
  └ 396 lines read

● Todo completed: review-workflow-file

### FINDING-01: Section headers do not follow required numbered `// ALL-CAPS` style
- **File:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:59-61,394-398,989-991`
- **Severity:** CRITICAL
- **Category:** ALIGNMENT
- **Current Behavior:** File uses block-style section banners (`/* ... */`) instead of `// 1. ...` numbered ALL-CAPS line headers.
- **Expected Behavior:** Use explicit numbered line headers like `// 1. IMPORTS`, `// 2. TYPES`, `// 3. IMPLEMENTATION`, `// 4. EXPORTS`.
- **Root Cause:** Header format diverged from sk-code-opencode P0 convention.
- **Suggested Fix:** Replace section banners with single-line numbered ALL-CAPS `//` headers and add a `// 1. IMPORTS` section near the import block.
- **Effort:** SMALL (<30 min)

### FINDING-02: Bare catch block violates `catch (error: unknown)` pattern
- **File:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:896-910`
- **Severity:** HIGH
- **Category:** QUALITY
- **Current Behavior:** Uses `catch { ... }` without typed error variable or guard.
- **Expected Behavior:** Use `catch (error: unknown)` and guard with `error instanceof Error` before reading error data.
- **Root Cause:** Legacy best-effort error handling path was left in shorthand catch form.
- **Suggested Fix:** Change to `catch (error: unknown) { ... }` and add explicit guarded logging/message handling.
- **Effort:** TRIVIAL (<5 min)

### FINDING-03: Exported `runWorkflow` lacks TSDoc on public API
- **File:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:400-401,993-995`
- **Severity:** MEDIUM
- **Category:** ALIGNMENT
- **Current Behavior:** `runWorkflow` is exported but has no `/** ... */` TSDoc block.
- **Expected Behavior:** All public exports should have TSDoc describing params, behavior, and return type.
- **Root Cause:** Function was documented with section prose/comments, not API-level TSDoc.
- **Suggested Fix:** Add a TSDoc block directly above `runWorkflow(...)` with `@param options` and `@returns Promise<WorkflowResult>`.
- **Effort:** TRIVIAL (<5 min)

### FINDING-04: Module header format is close but not exact to required style
- **File:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1-3`
- **Severity:** LOW
- **Category:** ALIGNMENT
- **Current Behavior:** Header is `// MODULE: Workflow` (with colon).
- **Expected Behavior:** Canonical format requested is `// MODULE PascalCaseName` (example: `// MODULE SessionExtractor`).
- **Root Cause:** Slight formatting drift from strict header template.
- **Suggested Fix:** Normalize to exact style, e.g. `// MODULE Workflow`.
- **Effort:** TRIVIAL (<5 min)

### SUMMARY
- Total findings: 4
- Critical: 1, High: 1, Medium: 1, Low: 1
- Top 3 recommendations: (1) Normalize section headers to numbered `// ALL-CAPS` format, (2) replace bare catch at line ~910 with `catch (error: unknown)` + guard, (3) add TSDoc for exported `runWorkflow`.


Total usage est:        1 Premium request
API time spent:         44s
Total session time:     52s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex           104.7k in, 2.3k out, 52.2k cached (Est. 1 Premium request)
