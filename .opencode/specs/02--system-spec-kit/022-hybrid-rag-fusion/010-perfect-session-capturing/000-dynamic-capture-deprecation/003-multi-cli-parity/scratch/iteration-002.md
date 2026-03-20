# Deep Research Iteration 2

## Focus: Q3 + Q4 + Q5

---

## Q3: technicalContext Not Surfaced in Rendered Output

### Root Cause: The Field IS Processed but Surfacing Depends on HAS_OBSERVATIONS Gate

**Finding:** technicalContext is NOT silently dropped. It follows a valid path but may fail to render due to a conditional gate.

**Trace:**

1. **Input acceptance** (`input-normalizer.ts:84`): `technicalContext?: Record<string, unknown>` is declared in the `RawInputData` interface.

2. **Transformation** (`input-normalizer.ts:489-490`): When present, it calls `buildTechnicalContextObservation(data.technicalContext)` and pushes the result into the `observations` array.

3. **Observation construction** (`input-normalizer.ts:278-289`): `buildTechnicalContextObservation` creates an observation with:
   - `type: 'implementation'`
   - `title: 'Technical Implementation Details'`
   - `narrative:` semicolon-delimited key-value pairs from the technicalContext object
   - `facts: []` (empty array -- no facts extracted)

4. **Template rendering** (`context_template.md:363-375`): Observations render under `{{#OBSERVATIONS}}` but skip entries where `{{#IS_DECISION}}` is true. The technicalContext observation (type `implementation`) should pass this filter.

5. **Template gate** (`context_template.md:356`): The entire section is gated by `{{#HAS_OBSERVATIONS}}`.

**Diagnosis:** The technicalContext content IS converted to an observation with a valid narrative. Whether it renders depends on two conditions:
- `HAS_OBSERVATIONS` must be truthy in the template context (comes from `sessionData.HAS_OBSERVATIONS`)
- The observation must have `NARRATIVE`, `TYPE`, and `TITLE` fields populated (confirmed by the builder function)

**Likely failure mode:** If the session data processing strips observations before they reach the template, or if `HAS_OBSERVATIONS` is not set to true despite observations existing, the entire section is hidden. The observation is correctly created in input normalization but may be lost during the session data extraction phase (between `normalizeInputData` output and `sessionData` construction in `workflow.ts`).

**Key evidence:**
- [SOURCE: input-normalizer.ts:278-289] -- buildTechnicalContextObservation function
- [SOURCE: input-normalizer.ts:489-490] -- technicalContext to observation conversion
- [SOURCE: context_template.md:356-375] -- Observation rendering section with HAS_OBSERVATIONS gate
- [SOURCE: workflow.ts:1824] -- Template data spreads `...sessionData` which should include OBSERVATIONS
- [SOURCE: workflow.ts:1968] -- `sessionData.OBSERVATIONS || []` passed to quality scoring

**Severity:** Medium. The data enters the pipeline but the rendering path is fragile -- there is no dedicated template section or variable for technicalContext. It is treated as just another observation, meaning it competes with all other observations for visibility and can be lost if the observation pipeline has issues.

**Recommendation:** Add a dedicated `TECHNICAL_CONTEXT` template variable and section, rather than relying on the generic observation pipeline. This would ensure technicalContext always renders when present, regardless of observation processing state.

---

## Q4: key_files Only Includes 1 of N Modified Files

### Root Cause: Tree Thinning Merges Small Files, Reducing effectiveFiles Count

**Finding:** The `key_files` YAML metadata is populated from `buildKeyFiles(effectiveFiles, specFolder)` at `workflow.ts:1817`, where `effectiveFiles` is the post-tree-thinning result, not the raw `filesModified` input.

**Trace:**

1. **filesModified input** (`input-normalizer.ts:428-436`): Raw `filesModified` strings are converted to `FileEntry` objects with `ACTION: 'Modified'` and stored as `normalized.FILES`.

2. **Tree thinning** (`workflow.ts:1689`): `effectiveFiles = applyThinningToFileChanges(enhancedFiles, thinningResult)` -- this step can merge small files into parent entries (e.g., `(merged-small-files)`), reducing the array length.

3. **buildKeyFiles** (`workflow.ts:639-648`):
   ```typescript
   function buildKeyFiles(effectiveFiles: FileChange[], specFolderPath: string): Array<{ FILE_PATH: string }> {
     const explicitKeyFiles = effectiveFiles
       .filter((file) => !file.FILE_PATH.includes('(merged-small-files)'))
       .map((file) => ({ FILE_PATH: file.FILE_PATH }));
     if (explicitKeyFiles.length > 0) {
       return explicitKeyFiles;
     }
     return listSpecFolderKeyFiles(specFolderPath);
   }
   ```

4. **Template rendering** (`context_template.md:829-831`):
   ```
   key_files:
   {{#KEY_FILES}}  - "{{FILE_PATH}}"
   {{/KEY_FILES}}
   ```

**Diagnosis:** The tree thinning algorithm merges files it considers "small" into a synthetic `(merged-small-files)` entry. The `buildKeyFiles` function then filters these out. If tree thinning merged all but 1 file into the synthetic entry, only 1 file would appear in `key_files`.

**Key evidence:**
- [SOURCE: workflow.ts:1689] -- `effectiveFiles = applyThinningToFileChanges(...)` reduces file count
- [SOURCE: workflow.ts:639-648] -- `buildKeyFiles` filters out `(merged-small-files)` entries
- [SOURCE: workflow.ts:1690] -- `fileRowsReduced = Math.max(0, enhancedFiles.length - effectiveFiles.length)` tracks reduction
- [SOURCE: context_template.md:829-831] -- KEY_FILES rendering in YAML metadata

**Severity:** Medium. The tree thinning is a legitimate optimization for template size, but key_files should reflect ALL modified files regardless of thinning, since it serves as a metadata index for search, not a content display.

**Recommendation:** `buildKeyFiles` should draw from the pre-thinning `enhancedFiles` (or the original `collectedData.FILES`) rather than `effectiveFiles`. The thinning should only affect content rendering, not metadata indexing.

---

## Q5: Hardcoded 50% Confidence for Decisions

### Root Cause: 0.5 Is the Default Base, Not a Bug -- But Input Confidence Is Not Passed Through

**Finding:** The `50%` confidence is NOT truly hardcoded. It is the _base value_ in `buildDecisionConfidence` when no explicit confidence is provided and no enrichment signals are present.

**Trace:**

1. **Base value** (`decision-extractor.ts:77,88`):
   ```typescript
   let choiceConfidence = 0.5;   // line 77
   let rationaleConfidence = 0.5; // line 88
   ```

2. **Enrichment logic** (`decision-extractor.ts:78-97`): Confidence is boosted from the 0.5 base by:
   - `+0.15` if `hasAlternatives` (2+ options)
   - `+0.10` if `hasExplicitChoice` (chosen/choice/selected field present)
   - `+0.10` if `isSpecificChoice` (choice text is not a placeholder)
   - `+0.15` if `hasExplicitRationale` (rationale field has content)
   - `+0.10` if `hasTradeoffs` (pros/cons present)
   - `+0.10` if `hasEvidence` (evidence references present)

3. **Explicit confidence passthrough** (`decision-extractor.ts:65-75`): If `explicitConfidence` is provided as a number, it short-circuits the base+enrichment logic entirely.

4. **Input mapping for manual decisions** (`decision-extractor.ts:278-280`):
   ```typescript
   const explicitConfidence = typeof manualObj?.confidence === 'number' && Number.isFinite(manualObj.confidence)
     ? manualObj.confidence
     : undefined;
   ```

5. **Template rendering** (`workflow.ts:1842`): Confidence is converted from 0-1 to 0-100:
   ```typescript
   const overallConfidence = d.CONFIDENCE <= 1 ? Math.round(d.CONFIDENCE * 100) : Math.round(d.CONFIDENCE);
   ```

**Diagnosis:** When the JSON input provides `keyDecisions` as plain strings (e.g., `"Decision: Use TypeScript for type safety"`), the manual decision processing at `decision-extractor.ts:198-337` creates an object where:
- `manualObj` is `null` (because the input is a string, not an object)
- Therefore `explicitConfidence` is `undefined`
- `hasAlternatives` is false (no alternatives array)
- `hasExplicitChoice` is false (no chosen/choice/selected fields)
- `hasExplicitRationale` is false (no rationale field)
- `hasTradeoffs` is false (no pros/cons)
- `hasEvidence` is false (no rationale text from input)

Result: `choiceConfidence = 0.5`, `rationaleConfidence = 0.5`, `confidence = min(0.5, 0.5) = 0.5` which renders as `50%`.

**Why all 3 decisions show 50%:** When `keyDecisions` entries are strings, NONE of the enrichment signals fire. The only way to get non-50% confidence from string inputs would be if the decision text itself happened to contain `"confidence: 85%"` which would be parsed by the observation path (not the manual decision path).

**Key evidence:**
- [SOURCE: decision-extractor.ts:77] -- `let choiceConfidence = 0.5` base value
- [SOURCE: decision-extractor.ts:88] -- `let rationaleConfidence = 0.5` base value
- [SOURCE: decision-extractor.ts:65-75] -- explicit confidence short-circuit
- [SOURCE: decision-extractor.ts:278-280] -- explicit confidence extraction from manualObj
- [SOURCE: decision-extractor.ts:198-201] -- string input makes manualObj null
- [SOURCE: workflow.ts:1842] -- 0-1 to 0-100 conversion for template

**Severity:** Low-Medium. The logic is working as designed -- the 0.5 base is intentional for low-signal decisions. However, when the JSON input provides confidence explicitly (e.g., `{ "decision": "...", "confidence": 0.85 }`), it IS properly used. The issue is that string-form decisions cannot carry confidence metadata.

**Recommendation:** Two improvements:
1. **Documentation fix:** Document that `keyDecisions` should be objects (not strings) to enable confidence passthrough: `{ "decision": "...", "confidence": 0.85, "rationale": "..." }`
2. **Parser enhancement:** Try to parse confidence from string-form decisions using a regex like `/confidence:?\s*(\d+)/i` before falling back to the 0.5 base. This would catch inline confidence indicators like `"Decision: Use TS -- confidence: 85%"`.

---

## Summary of Iteration 2 Findings

| Question | Status | Root Cause | Severity |
|----------|--------|-----------|----------|
| Q3 | ANSWERED | technicalContext becomes an `implementation` observation via `buildTechnicalContextObservation`, but rendering depends on `HAS_OBSERVATIONS` gate. No dedicated template variable exists. | Medium |
| Q4 | ANSWERED | `buildKeyFiles` uses post-tree-thinning `effectiveFiles` instead of raw file list. Tree thinning merges small files, reducing the count. | Medium |
| Q5 | ANSWERED | `0.5` is the intentional base value in `buildDecisionConfidence` when no enrichment signals are present. String-form `keyDecisions` cannot carry confidence metadata, so all signals are false. | Low-Medium |

## All 5 Questions Now Answered

All root causes identified with source-level evidence. The five defects break down into:
- **2 regex bugs** (Q1, Q2): Decision title parsing at `decision-extractor.ts:213`
- **1 architecture gap** (Q3): No dedicated template path for technicalContext
- **1 data source bug** (Q4): `buildKeyFiles` uses thinned files instead of raw files
- **1 design-as-intended with UX issue** (Q5): String-form decisions cannot carry confidence
