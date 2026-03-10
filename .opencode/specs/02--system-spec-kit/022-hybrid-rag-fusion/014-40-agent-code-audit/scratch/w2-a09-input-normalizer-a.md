● skill(sk-code--review)

● SQL: Create audit todos
  └ 3 row(s) inserted. Last inserted row ID: 3.

● Read .agents/skills/sk-code--review/references/quick_reference.md
  └ 151 lines read

● Read .agents/skills/sk-code--review/references/security_checklist.md
  └ 206 lines read

● Read .agents/skills/sk-code--review/references/code_quality_checklist.md
  └ 162 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts lines 1-314
  └ 314 lines read

● Todo completed: review-guidance, inspect-input-normalizer, draft-audit-report

### FINDING-01: Partial normalized-shape inputs bypass normalization entirely
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:238-241`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `normalizeInputData()` returns a cloned input as soon as any one of `userPrompts`, `observations`, or `recentContext` is truthy. Inputs like `{ observations: [] }` or `{ userPrompts: {} }` skip normalization and can leave required `NormalizedData` collections missing or malformed.
- **Expected Behavior:** The fast path should run only when the full normalized shape is present and well-typed; otherwise missing fields should be normalized and manual fields should still be transformed.
- **Root Cause:** A truthiness probe is being used as a proxy for interface compliance, and the function signature permits returning `RawInputData` instead of always producing `NormalizedData`.
- **Suggested Fix:** Replace the shortcut with a structural guard such as `isNormalizedData()` that verifies array shapes for `observations`, `userPrompts`, and `recentContext`, normalizes missing collections to `[]`, and always returns `NormalizedData`.

### FINDING-02: Caller-provided `FILES` metadata is silently dropped
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:45-60,74-83,253-258`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `FILES` exists in both input and output interfaces, but normalization only populates it from `filesModified`. Inputs that already provide structured `FILES` entries lose those paths/descriptions unless the early-return path happens to trigger.
- **Expected Behavior:** Existing `FILES` entries should be preserved and validated, and `filesModified` should augment them instead of replacing them with placeholder descriptions.
- **Root Cause:** The normalizer only recognizes one file-shape source (`filesModified`) even though the declared interfaces support `FILES`.
- **Suggested Fix:** Normalize `data.FILES` with runtime guards, merge it with `filesModified`, deduplicate by path, and prefer caller-provided descriptions over placeholders.

### FINDING-03: Alternative mapping can throw and violates `string[]` guarantees
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:147-149,179-180`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `transformKeyDecision()` assumes every non-string alternative is a non-null object with `label`, `title`, or `name`. `null` entries throw on property access, and non-string values can flow into `alternatives`/`facts` despite the code declaring them as `string[]`.
- **Expected Behavior:** Unknown alternatives should be safely rejected or converted only after runtime validation.
- **Root Cause:** Type assertions (`as string`) are being treated as if they coerce runtime values, but they do not.
- **Suggested Fix:** Introduce a `normalizeAlternative(alt: unknown): string | null` helper that checks for `null`, verifies object shape, accepts only string labels, and uses a safe stringify fallback when needed.

### FINDING-04: Confidence and chosen-approach metadata are fabricated from weak heuristics
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:145-171,188-191`
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** `_manualDecision.confidence` is always set to exactly `0.50`, `0.65`, or `0.70`, and `chosenApproach` falls back to the entire `decision` or title text when no discrete option exists. That produces deterministic-looking certainty and choice metadata even when the input is only narrative prose.
- **Expected Behavior:** Confidence should be optional or explicitly sourced, and `chosenApproach` should stay unset unless a real choice can be extracted.
- **Root Cause:** The transformer synthesizes structured decision metadata from magic constants and loose string heuristics rather than from validated source fields.
- **Suggested Fix:** Make confidence optional/configurable, stop using `decision/title` as a blind `chosenApproach` fallback, and separate raw narrative storage from parsed decision metadata.

### FINDING-05: `triggerPhrases` handling is not type-safe and leaks caller-owned arrays
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:200-210,263,291-293`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `buildSessionSummaryObservation()` stores `triggerPhrases` directly in `facts`, and `normalizeInputData()` later spreads `data.triggerPhrases` without checking that it is an array of strings. Invalid runtime values can corrupt `Observation.facts` or throw at line 292, while valid arrays remain aliased to caller state.
- **Expected Behavior:** Trigger phrases should always be validated as `string[]` and copied into fresh arrays before being stored.
- **Root Cause:** The code relies on static TypeScript annotations for external input instead of doing runtime validation and cloning.
- **Suggested Fix:** Normalize with `Array.isArray(...)` plus element filtering (`typeof p === 'string'`), then use `[...triggerPhrases]` both for `facts` and `_manualTriggerPhrases`.

### FINDING-06: Technical-context serialization can crash normalization
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:214-216,275-276`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `buildTechnicalContextObservation()` calls `JSON.stringify()` on every object-valued field. Circular references or nested `BigInt` values throw and abort the whole normalization path when `technicalContext` is present.
- **Expected Behavior:** Unsupported values in one technical-context field should not crash the entire normalization step.
- **Root Cause:** Arbitrary object values are stringified without any safety guard or type-specific formatting.
- **Suggested Fix:** Use a safe stringifier for observation text or format each field via validated type-specific branches that explicitly handle cycles and unsupported types.

### FINDING-07: Technical context is persisted without any secret redaction
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:214-216`
- **Severity:** MEDIUM
- **Category:** SECURITY
- **Current Behavior:** The technical-context builder flattens the full `technicalContext` object into a persisted narrative string with no redaction. If callers include tokens, passwords, API keys, private paths, or PII, those values are copied verbatim into normalized session data.
- **Expected Behavior:** Sensitive keys and values should be redacted or omitted before being written into durable context artifacts.
- **Root Cause:** The builder assumes all technical context is safe-to-persist free text.
- **Suggested Fix:** Add redaction for sensitive key patterns (`token`, `secret`, `password`, `key`, etc.), prefer an allowlist of safe fields, and exclude raw sensitive values from `narrative`.

### FINDING-08: The `structuredClone` fallback is not equivalent and can corrupt or crash data
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:230-236,296`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** The fallback uses `JSON.parse(JSON.stringify(data))`, which silently rewrites or drops non-JSON values (`undefined`, `Date`, `Map`, `Set`, `Error`, custom instances, `NaN`, `Infinity`) and throws on circular references, `BigInt`, and top-level `undefined`. Older-runtime behavior therefore differs materially from the `structuredClone()` path.
- **Expected Behavior:** The fallback should either preserve supported types with defined semantics or fail explicitly before mutating data shape.
- **Root Cause:** JSON serialization is being used as a generic deep-clone substitute, even though it is neither type-preserving nor failure-compatible with `structuredClone`.
- **Suggested Fix:** Use a clone helper with explicit supported-type semantics, or gate the function to JSON-safe inputs and throw a targeted validation error instead of silently corrupting values.

### SUMMARY - Total: 8, Critical: 0, High: 2, Medium: 6, Low: 0


Total usage est:        1 Premium request
API time spent:         5m 27s
Total session time:     5m 37s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 142.7k in, 21.1k out, 128.4k cached (Est. 1 Premium request)
