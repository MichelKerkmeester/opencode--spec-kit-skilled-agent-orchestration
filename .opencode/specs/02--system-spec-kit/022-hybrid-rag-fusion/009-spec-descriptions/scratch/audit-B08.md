# Audit B-08: Type Definitions
## Summary
| Metric | Result |
|--------|--------|
| Type files reviewed | 80 (1 source type file in `scripts/types/` + 79 project-owned `.d.ts` files under `scripts/dist/`; `node_modules` excluded) |
| Interfaces defined | 15 canonical interfaces in `scripts/types/session-types.ts` |
| any usage | 5 actual `any` declarations in generated `scripts/dist/evals/run-chk210-quality-backfill.d.ts`; 0 in `scripts/types/session-types.ts` |
| Unused exports | 82 potentially unused exported types/interfaces elsewhere in `scripts/`; 0 in `scripts/types/session-types.ts` |

## Per-File Findings

### `scripts/types/session-types.ts`
- This is the only authored source type-definition file in `scripts/types/`, and it acts as the canonical session schema consumed by extractors, tests, and the simulation factory (`scripts/types/session-types.ts:15-216`; `scripts/lib/simulation-factory.ts:8-36`; `scripts/extractors/decision-extractor.ts:12-15`; `scripts/extractors/conversation-extractor.ts:11-24`; `scripts/extractors/collect-session-data.ts:44-47`).
- Interface completeness is strong: the file defines 15 exported interfaces covering decision, conversation, diagram, and session data, and `SessionData` composes `FileChange`, `ObservationDetailed`, `ToolCounts`, and `SpecFileEntry` rather than duplicating those shapes (`scripts/types/session-types.ts:15-216`).
- JSDoc coverage is good at the interface level: every exported interface has a short purpose comment immediately above it (`scripts/types/session-types.ts:14-15`, `25-26`, `52-53`, `66-67`, `74-75`, `84-85`, `92-93`, `99-100`, `116-117`, `133-134`, `140-141`, `146-147`, `152-153`, `170-171`, `176-177`).
- `any` is not used here; permissive escape hatches use `unknown` index signatures instead, which meets the checklist requirement (`scripts/types/session-types.ts:22`, `49`, `71`, `81`, `96`, `130`, `215`).
- All 15 exported interfaces are referenced elsewhere in the scripts tree, either directly or through backward-compatibility re-exports, so there are no unused exports in this canonical file (`scripts/lib/simulation-factory.ts:8-36`; `scripts/extractors/decision-extractor.ts:12-15`; `scripts/extractors/conversation-extractor.ts:11-24`; `scripts/extractors/diagram-extractor.ts:16-31`; `scripts/extractors/collect-session-data.ts:44-47`; `scripts/tests/task-enrichment.vitest.ts:13`; `scripts/tests/memory-render-fixture.vitest.ts:13`).
- The main standards drift is naming: properties are uniformly `UPPER_SNAKE_CASE` instead of camelCase, which conflicts with the stated sk-code--opencode naming rule for type properties. This affects essentially the whole schema, including `DecisionOption`, `DecisionRecord`, `ConversationData`, `DiagramData`, and `SessionData` (`scripts/types/session-types.ts:16-21`, `27-48`, `67-109`, `117-164`, `177-215`).
- No discriminated unions or generics are defined in this file. That is not inherently wrong, but it means checklist items 6 and 7 are effectively not exercised here.

### `scripts/dist/types/session-types.d.ts`
- The generated declaration file mirrors the source canonical interfaces accurately and preserves the same property names and shapes (`scripts/dist/types/session-types.d.ts:1-198`).
- No `any` appears in this declaration output; the generated file keeps the `unknown`-based escape hatches from the source type file (`scripts/dist/types/session-types.d.ts:15`, `51`, `67`, `76`, `89`, `119`, `197`).
- Because it is generated from the source file, its main audit value is confirmation that the published declaration surface matches the authored type definitions.

### Exported type definitions elsewhere in `scripts/`
- Several non-`types/` source files export interfaces and type aliases directly. Representative examples include `FileChange`/`ObservationDetailed` in `scripts/extractors/file-extractor.ts`, `ToolCounts`/`SpecFileEntry` in `scripts/extractors/session-extractor.ts`, and backward-compatibility re-exports in `scripts/lib/simulation-factory.ts` (`scripts/extractors/file-extractor.ts:24-61`; `scripts/extractors/session-extractor.ts:23-105`; `scripts/lib/simulation-factory.ts:23-36`).
- These exported types are mixed quality: they generally avoid `any`, but many lack JSDoc entirely even when exported from public modules (`scripts/extractors/file-extractor.ts:24-61`; `scripts/extractors/session-extractor.ts:23-105`; `scripts/spec-folder/alignment-validator.ts:17-61`).
- The scripts tree also exposes broad barrel surfaces (`scripts/extractors/index.ts:6-34`; `scripts/loaders/index.ts:6-7`), which increases the chance that internal helper types become part of the apparent public API without clear intent.
- A repo-wide search found 82 exported interfaces/type aliases in non-test source files that have no in-repo TypeScript references under `scripts/`. Examples include `AlignmentConfig`, `AlignmentResult`, and `TelemetrySchemaDocsValidationOptions` in `scripts/spec-folder/alignment-validator.ts`, plus `SessionConfig` and `FullSimulation` in `scripts/lib/simulation-factory.ts` (`scripts/spec-folder/alignment-validator.ts:17-61`; `scripts/lib/simulation-factory.ts:42-80`). These may exist for external consumers, but they are unused within the local scripts tree and should be reviewed.

### `.d.ts` coverage outside `scripts/types/`
- There are no authored `.d.ts` files outside generated output; all project-owned declarations found by this audit live under `scripts/dist/`.
- Most generated declarations are clean, but `scripts/dist/evals/run-chk210-quality-backfill.d.ts` contains five explicit `any` declarations at the top of the file (`scripts/dist/evals/run-chk210-quality-backfill.d.ts:1-5`). This is the only actual `any` usage found in project-owned declaration files during the scan.

## Issues [ISS-B08-NNN]

### ISS-B08-001 — Canonical session type properties violate camelCase naming rules
The canonical schema in `scripts/types/session-types.ts` uses `UPPER_SNAKE_CASE` property names throughout instead of camelCase. If sk-code--opencode standards are meant to apply literally to exported type properties, this file is out of alignment across nearly every interface (`scripts/types/session-types.ts:16-21`, `27-48`, `67-109`, `117-164`, `177-215`).

### ISS-B08-002 — Generated declaration output still contains `any`
`scripts/dist/evals/run-chk210-quality-backfill.d.ts` declares five top-level symbols as `any`, violating the “no any” rule for declaration files (`scripts/dist/evals/run-chk210-quality-backfill.d.ts:1-5`). Even though this is generated output, it is still part of the shipped type surface under `scripts/dist/`.

### ISS-B08-003 — Exported interfaces elsewhere in `scripts/` are often undocumented
While `scripts/types/session-types.ts` is consistently documented, exported types in files such as `file-extractor.ts`, `session-extractor.ts`, and `alignment-validator.ts` are exposed without JSDoc comments (`scripts/extractors/file-extractor.ts:24-61`; `scripts/extractors/session-extractor.ts:23-105`; `scripts/spec-folder/alignment-validator.ts:17-61`). That weakens discoverability and makes the exported surface inconsistent.

### ISS-B08-004 — `scripts/` likely exports more types than it actually uses internally
The in-repo search surfaced 82 exported interfaces/type aliases with no matching references elsewhere under `scripts/`. Some may be intentionally public, but the current export surface looks broader than usage demands, especially with barrel files re-exporting entire modules (`scripts/extractors/index.ts:6-34`; `scripts/loaders/index.ts:6-7`; `scripts/spec-folder/alignment-validator.ts:17-61`; `scripts/lib/simulation-factory.ts:42-80`).

## Recommendations
1. Decide whether the `UPPER_SNAKE_CASE` property convention in `session-types.ts` is an intentional wire-format/schema contract. If it is, document the exception explicitly; if it is not, normalize the canonical interfaces to camelCase and map to uppercase only at serialization boundaries.
2. Fix the generator or source for `run-chk210-quality-backfill` so the emitted `.d.ts` no longer falls back to `any` for imported/runtime symbols.
3. Add JSDoc to exported types outside `scripts/types/`, starting with the modules that define shared dependency types (`file-extractor.ts`, `session-extractor.ts`, `alignment-validator.ts`).
4. Review the 82 potentially unused exported types/interfaces and either (a) make them internal, (b) document them as intentional public API, or (c) remove redundant barrel re-exports.
5. Keep `scripts/types/session-types.ts` as the canonical source of truth; its interface coverage, `unknown` usage, and in-repo adoption are already solid and should be preserved while tightening standards alignment.
