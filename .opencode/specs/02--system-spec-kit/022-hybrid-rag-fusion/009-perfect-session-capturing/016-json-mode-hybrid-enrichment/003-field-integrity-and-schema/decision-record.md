---
title: "...-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/003-field-integrity-and-schema/decision-record]"
description: "Four architecture decisions: unknown-field handling strategy, YAML parser approach, content density threshold, and string length limit values."
trigger_phrases:
  - "field integrity decisions"
  - "schema validation adr"
  - "unknown-field warn vs error"
  - "yaml parser decision"
  - "content density threshold"
  - "string length limits decision"
importance_tier: "important"
contextType: "planning"
---
# Decision Record: Field Integrity and Schema Validation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Warn-Not-Error for Unknown Fields

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-21 |
| **Deciders** | System Spec Kit maintainer |

---

<!-- ANCHOR:adr-001-context -->
### Context

`RawInputData` carries a `[key: string]: unknown` index signature that accepts any field name without complaint. When an AI sends a typo'd field like `sesionSummary`, the pipeline accepts it, silently drops it, and stores a memory missing the intended data. The TODO comment at `input-normalizer.ts` line 602 (TODO(O3-12)) acknowledges this debt but prescribes no solution. We needed to choose a handling strategy that surfaces the problem without breaking existing callers.

### Constraints

- Some callers may legitimately use undocumented extension fields to pass data through the pipeline.
- The change must not break any working caller; only typo'd fields should be affected.
- The fix should be detectable in console output so AIs operating the pipeline can self-correct.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Emit a `console.warn` for each field key not present in the `KNOWN_RAW_INPUT_FIELDS` constant. The payload continues to be processed; nothing is rejected.

**How it works**: After the existing field validation guards in `validateInputData`, iterate `Object.keys(input)`. For each key not in `KNOWN_RAW_INPUT_FIELDS`, emit `WARN: unknown field "[key]" in RawInputData — possible typo`. The validation function returns no error; the pipeline proceeds normally.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Warn-not-error (chosen)** | Zero breakage; typos surfaced; self-correctable | Unknown fields still silently dropped after warning | 8/10 |
| Hard error on unknown fields | Forces clean payloads immediately | Breaks any caller using extension fields; disruptive | 4/10 |
| Silent drop (current behavior) | No change required | Typos never detected; data loss continues | 1/10 |
| Coerce to closest known field | Helpful for single-char typos | Complex fuzzy-match logic; error-prone; unmaintainable | 3/10 |

**Why this one**: Warn-not-error threads the needle between correctness and backward compatibility. The primary audience (AI assistants) can read console output and self-correct on the next save attempt. A hard error would require coordinated changes across all callers to whitelist extension fields before the guard could be enabled.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Typo'd field names are now detectable in CI logs and interactive sessions.
- The TODO(O3-12) debt is partially resolved without a breaking change.
- Establishes the pattern used by ADR-003's `contextType` enum check.

**What it costs**:
- Unknown fields are still silently dropped after the warning. Mitigation: document the warning behavior in schema comments; a future pass can promote to error once all callers are audited.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Extension-field callers now see warnings | L | Warnings are informational; behavior unchanged |
| `KNOWN_RAW_INPUT_FIELDS` drifts from actual type definition | M | Add a unit test that compares the constant to the TypeScript interface |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | TODO(O3-12) confirms acknowledged debt; typo data loss documented in research Round 2 |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives evaluated; hard error rejected as too disruptive |
| 3 | **Sufficient?** | PASS | Warn-not-error is the simplest change that surfaces the problem |
| 4 | **Fits Goal?** | PASS | Goal is "surface diagnostics"; warn satisfies that without regression |
| 5 | **Open Horizons?** | PASS | Warn can be promoted to error in a future pass once callers are audited |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `input-normalizer.ts`: Add `KNOWN_RAW_INPUT_FIELDS` constant, add `Object.keys` iteration in `validateInputData`

**How to roll back**: Remove the constant and the `Object.keys` loop. The change is additive; revert is a clean delete with no refactoring needed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Real YAML Parser for Frontmatter Extraction

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-21 |
| **Deciders** | System Spec Kit maintainer |

---

### Context

`extractFrontMatter` in `validate-memory-quality.ts` (lines 183-191) used a regex to parse YAML frontmatter blocks. YAML is not a regular language; the regex accepted malformed YAML (unclosed quotes, bad indentation, duplicate keys) without error and produced silently incorrect parsed values. This meant V-rules operating on frontmatter data could be making decisions on corrupted input. The `js-yaml` package is already a transitive dependency of the project.

### Constraints

- The replacement must handle the subset of YAML actually used in memory file frontmatter (string scalars, arrays of strings, simple key-value).
- Parse errors must not propagate as thrown exceptions; they must become structured V-rule failures so the caller can handle them without crashing.
- Performance must be acceptable for typical frontmatter size (<50 lines).

---

### Decision

**We chose**: Replace the regex with `yaml.load()` from `js-yaml`, wrapped in a try/catch. Any `YAMLException` is caught and converted to a structured V-rule failure object with `ruleId: "V-FRONTMATTER-PARSE"` and the original error message included. The caller receives either a parsed object or a failure; it never receives silently-corrupt data.

**How it works**: Import `* as yaml from 'js-yaml'` at the top of `validate-memory-quality.ts`. In `extractFrontMatter`, strip the `---` delimiters, pass the body to `yaml.load({ schema: yaml.DEFAULT_SAFE_SCHEMA })`, and return the result. Wrap the call in try/catch; on `YAMLException`, return a structured failure object instead of rethrowing.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`js-yaml` (chosen)** | Handles all valid YAML; already a dependency; fast | Adds a `require` call to the file | 9/10 |
| Extended regex | No new import | Cannot handle all valid YAML syntax; brittle | 2/10 |
| Async YAML parser | Future-proof | Requires function signature change; async parse of <50 lines is unnecessary | 4/10 |
| Custom YAML subset parser | No dependency | Significant implementation effort; likely to be a worse YAML regex | 1/10 |

**Why this one**: `js-yaml` is already present, covers all valid frontmatter syntax, and the synchronous API matches the existing function signature. There is no engineering cost beyond adding the import and the try/catch.

---

### Consequences

**What improves**:
- Malformed YAML in memory files now surfaces a detectable V-rule failure.
- V-rules operating on frontmatter data receive correct parsed values.
- The implementation is simpler than the regex it replaces.

**What it costs**:
- Memories with previously-accepted malformed YAML will now fail the frontmatter V-rule. Mitigation: this is the correct behavior; those memories were silently storing incorrect metadata.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| `yaml.DEFAULT_SAFE_SCHEMA` rejects YAML features used in existing memories | M | Audit existing memory files for non-scalar YAML features before merging |
| `js-yaml` parse is slower than regex for very large frontmatter | L | Benchmark; typical frontmatter (<50 lines) parses in <2 ms |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Research Round 2 documents malformed YAML silently passing; confirmed at lines 183-191 |
| 2 | **Beyond Local Maxima?** | PASS | Four options evaluated; regex extension rejected as fundamentally insufficient |
| 3 | **Sufficient?** | PASS | `js-yaml` handles all YAML used in memory files; no over-engineering |
| 4 | **Fits Goal?** | PASS | Goal is correct frontmatter parsing; `js-yaml` is the standard solution |
| 5 | **Open Horizons?** | PASS | Does not constrain future frontmatter schema changes |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `validate-memory-quality.ts`: Add `import * as yaml from 'js-yaml'`; replace regex body in `extractFrontMatter` with `yaml.load()` + try/catch

**How to roll back**: Remove the import, restore the original regex block. The original regex is preserved in git history; revert is a clean restore.

---

### ADR-003: Strict Enum Validation for contextType (Error Not Warn)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-21 |
| **Deciders** | System Spec Kit maintainer |

---

### Context

`importanceTier` is correctly validated against its enum values in `validateInputData`. `contextType` is defined as an enum type in the TypeScript source but receives no runtime validation — any string passes. Memories tagged with invalid `contextType` values corrupt the search index's faceting behavior and make retrieval filtering unreliable. Unlike unknown field names (ADR-001), an invalid `contextType` is not an ambiguous extension field; it is unambiguously wrong data.

### Constraints

- Must match the existing `importanceTier` validation pattern for consistency.
- Must not break callers that omit `contextType` (the field is optional).

---

### Decision

**We chose**: Validate `contextType` as a hard error (return a validation error object) when the field is present and the value is not in `VALID_CONTEXT_TYPES`. This matches the behavior of `importanceTier` validation and treats invalid enum values as unambiguously incorrect, not as extension field candidates.

**How it works**: Define `VALID_CONTEXT_TYPES` as a `const` array mirroring the TypeScript `contextType` union. In `validateInputData`, after the existing `importanceTier` check, add: `if (input.contextType && !VALID_CONTEXT_TYPES.includes(input.contextType)) return { error: "invalid contextType", value: input.contextType, accepted: VALID_CONTEXT_TYPES }`.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hard error (chosen)** | Consistent with importanceTier; prevents index corruption | Breaks callers sending invalid values | 9/10 |
| Warn and coerce to "general" | Non-breaking | Silently changes caller's intent; masks the bug | 3/10 |
| Warn-not-error | Non-breaking | Invalid values still reach storage; index corruption continues | 2/10 |

**Why this one**: `contextType` is a closed enum, not an extension point. An invalid value is categorically different from an unknown field name; it will corrupt downstream behavior. The `importanceTier` precedent in the same file establishes the correct pattern.

---

### Consequences

**What improves**:
- Search index facets receive only valid `contextType` values.
- Validation behavior is consistent between `contextType` and `importanceTier`.

**What it costs**:
- Any caller currently sending an invalid `contextType` will start receiving errors. Mitigation: document valid values in the schema JSDoc comment.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| `VALID_CONTEXT_TYPES` constant drifts from TypeScript union definition | M | Add lint rule or unit test comparing constant to type |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Research Round 2 documents `contextType` accepts any string; `importanceTier` inconsistency confirmed |
| 2 | **Beyond Local Maxima?** | PASS | Three options evaluated; warn-and-coerce rejected for silently changing intent |
| 3 | **Sufficient?** | PASS | Enum array check is the simplest correct solution |
| 4 | **Fits Goal?** | PASS | Goal is valid enum values in storage; hard error achieves that |
| 5 | **Open Horizons?** | PASS | `VALID_CONTEXT_TYPES` constant can be extended when new values are added to the type |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `input-normalizer.ts`: Add `VALID_CONTEXT_TYPES` constant; add enum check in `validateInputData` mirroring `importanceTier` pattern

**How to roll back**: Remove the constant and the check block. Clean additive revert.

---

### ADR-004: Content Density Threshold of 50 Non-Whitespace Characters

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-21 |
| **Deciders** | System Spec Kit maintainer |

---

### Context

The quality flag `short_content` exists in the codebase but no V-rule enforces a minimum content requirement. An empty payload `{}` combined with a CLI `spec-folder` argument produces a valid but useless memory: a frontmatter block with no body. These degenerate saves pollute the search index and consume storage without providing retrieval value. We needed to choose a threshold value that rejects genuinely trivial content without rejecting legitimate short memories such as tag collections or single-line decision records.

### Constraints

- The threshold must not reject valid short memories (e.g., a brief decision record with 2-3 sentences).
- The threshold must reject degenerate saves: empty body, title-only body, whitespace-only body.
- Measurement must be taken after frontmatter is stripped (frontmatter itself is not content).

---

### Decision

**We chose**: Reject memories whose body (after frontmatter strip) contains fewer than 50 non-whitespace characters, measured by removing all whitespace and counting remaining characters. Whitespace includes spaces, tabs, and newlines.

**How it works**: In the content density V-rule in `validate-memory-quality.ts`, after calling `extractFrontMatter`, take the body string, apply `.replace(/\s/g, '')`, count `.length`. If < 50, emit V-rule failure `{ ruleId: "V-CONTENT-DENSITY", message: "body has X non-whitespace characters; minimum is 50" }`.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **50 non-whitespace chars (chosen)** | Rejects degenerate saves; passes all realistic content | Arbitrary threshold | 8/10 |
| 200 chars | Safer margin | Rejects legitimate short records (e.g., 3-word tag list) | 5/10 |
| 10 chars | Rejects only completely empty | Does not reject title-only saves | 4/10 |
| Configurable via env var | Flexible | Adds config surface; premature for a first pass | 6/10 |

**Why this one**: 50 non-whitespace characters is roughly 8-10 words — enough for a one-sentence observation. A `# Title` heading contains 5 non-whitespace chars (the title text without the hash and space); any real content sentence adds well over 50. The threshold is intentionally conservative to avoid false positives.

---

### Consequences

**What improves**:
- Degenerate saves are rejected before reaching storage.
- The `short_content` quality flag now has a corresponding enforcement rule.

**What it costs**:
- Memories with extremely sparse bodies (tags-only with fewer than 50 chars) may be rejected. Mitigation: tag collections typically have multiple entries and exceed 50 chars; if edge cases emerge, add a `contextType: "tags"` exemption.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Legitimate short memories rejected | M | Threshold 50 is deliberately low; monitor for false positives in first week |
| Unicode multi-byte characters counted incorrectly | L | `.length` counts code units, not graphemes; acceptable for this use case |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Research Round 2 documents empty `{}` payloads producing valid but empty memories |
| 2 | **Beyond Local Maxima?** | PASS | Four threshold values evaluated |
| 3 | **Sufficient?** | PASS | 50-char threshold with non-whitespace measurement is minimal and correct |
| 4 | **Fits Goal?** | PASS | Goal is to reject degenerate saves; 50-char threshold achieves that |
| 5 | **Open Horizons?** | PASS | Threshold is a named constant; easy to adjust or make configurable later |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `validate-memory-quality.ts`: Add content density V-rule using `CONTENT_DENSITY_MIN = 50` constant; compute non-whitespace length after frontmatter strip

**How to roll back**: Remove the V-rule function and its call site. Clean additive revert.
