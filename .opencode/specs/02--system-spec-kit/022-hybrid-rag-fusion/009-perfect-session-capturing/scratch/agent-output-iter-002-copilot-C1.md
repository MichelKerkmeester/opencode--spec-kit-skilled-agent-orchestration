I’ll inspect the five target files plus cross-file references to `source-capabilities` in one pass, then trace contamination, quality, and mode flows end-to-end.

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ 1 line read

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ 1 line read

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ 1 line read

● Search (grep)
  │ "source-capabilities|SourceCapabilities|getSourceCapabilities|capabilit"
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 32 lines found

● Read contamination-filter.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts
  └ 199 lines read

● Read source-capabilities.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts
  └ 82 lines read

● Search (glob)
  │ "**/source-capabilities.ts"
  └ 1 file found

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L1:260 (259 lines read)

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L340:470 (130 lines read)

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L1:260 (259 lines read)

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L260:520 (261 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1:260 (259 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L1:260 (260 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L260:520 (261 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1380:1525 (146 lines read)

● Search (grep)
  │ "getSourceCapabilities\(|SOURCE_CAPABILITIES|toolTitleWithPathExpected|prefersStructuredSave|inp
  │ utMode" (.opencode/skill/system-spec-kit/scripts)
  └ 48 lines found

● Search (grep)
  │ "filterContamination\(|maxSeverity|contamination|quality|threshold|stateless|structured|mode"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 109 lines found

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L560:760 (200 lines read)

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L480:740 (105 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1240:1380 (141 lines read)

● Read quality-scorer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
  └ L1:280 (280 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1660:1765 (106 lines read)

● Read quality-scorer.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts
  └ L1:280 (235 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2010:2185 (176 lines read)

● Search (grep)
  │ "return .*_source|_source\s*=|normalizeInputData\(|transformOpencodeCapture\(|loadCollectedData\
  │ (|_isSimulation" (.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts)
  └ 13 lines found

● Search (grep)
  │ "isStatelessMode|captureSource|_source|loadCollectedData\(|inputMode|prefersStructuredSave|QUALI
  │ TY_ABORT_THRESHOLD|determineValidationDisposition\("
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 17 lines found

● Search (grep)
  │ "function transformOpencodeCapture|_source:|source:|captureSource"
  │ (.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ 5 lines found

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L780:1145 (366 lines read)

● Read quality-scorer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
  └ L280:520 (77 lines read)

● Read contamination-filter.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts
  └ L1:180 (126 lines read)

● Read validation-rule-metadata.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts
  └ L1:140 (73 lines read)

● Read quality-scorer-calibration.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts
  └ L150:260 (73 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1140:1185 (46 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1748:1795 (48 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1880:1910 (31 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2268:2338 (71 lines read)

● Search (grep)
  │ "prefersStructuredSave" (.opencode/skill/system-spec-kit/scripts)
  └ 9 lines found

● Search (grep)
  │ "getSourceCapabilities\(|sourceCapabilities|toolTitleWithPathExpected"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts)
  └ 3 lines found

● Search (grep)
  │ "export type DataSource|CaptureDataSource|transformOpencodeCapture\(|_source"
  │ (.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ 18 lines found

● Search (grep)
  │ "getSourceCapabilities\(|captureCapabilities|inputMode|determineValidationDisposition\(|captureS
  │ ource" (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

● Search (grep)
  │ "enum\s+|SourceInputMode|KnownDataSource|SourceCapabilities|isKnownDataSource\(|getSourceCapabil
  │ ities\(" (.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts)
  └ 10 lines found

● Search (grep)
  │ "ruleAppliesToSource|getSourceCapabilities\(|appliesToSources"
  │ (.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts)
  └ 19 lines found

● Search (grep)
  │ "loadCollectedData\(|attemptNativeCapture\(|_source|inferPreferredCaptureSourceFromEnv"
  │ (.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts)
  └ 12 lines found

**Q9 summary:** `source-capabilities` cleanly centralizes per-source flags for contamination handling, but it only partially drives architecture decisions.

`source-capabilities.ts` defines union types (not enums): `SourceInputMode = 'structured' | 'stateless'`, `KnownDataSource = DataSource`, and `SourceCapabilities { source, inputMode, toolTitleWithPathExpected, prefersStructuredSave }`, with a per-source record and `getSourceCapabilities()` fallback-to-`file` behavior. (`utils/source-capabilities.ts:3-11,13-76`)


**Call sites reading capabilities (runtime):**  
`extractors/contamination-filter.ts` (`getDenylistSeverity`) and `core/workflow.ts` (`captureCapabilities = getSourceCapabilities(captureSource)`). Also `memory/validate-memory-quality.ts` source applicability checks use capabilities normalization. (`contamination-filter.ts:110-113`, `workflow.ts:1421-1429,2158`, `validate-memory-quality.ts:390-399`)


**Influence trace:**  
Loader/normalizer set `_source` (`data-loader.ts:523-526,562-566`; `input-normalizer.ts:798-802,1107-1113`) → workflow resolves capabilities (`workflow.ts:1421-1422`) → contamination severity may be downgraded for Claude-style tool titles (`contamination-filter.ts:111-113`) → severity feeds quality scoring/caps (`core/quality-scorer.ts:299-313`; `extractors/quality-scorer.ts:140-151`) → quality gates abort/index decisions (`workflow.ts:2127-2134,2287-2294`).


**Mode decisions (direct vs stateless):**  
Actual stateless mode is decided by presence/absence of `dataFile`/preloaded data, not capabilities (`workflow.ts:1329`). `inputMode` only changes warning text (`workflow.ts:2158-2161`). So capabilities do **not** currently drive mode selection.


**Architecture quality:**  
Good abstraction for contamination exception removal (Claude-only hardcoding is centralized), but still leaky/incomplete: `prefersStructuredSave` is currently unused, and `inputMode` is observational rather than authoritative. No circular dependency detected; dependency direction is mostly one-way and stable.

