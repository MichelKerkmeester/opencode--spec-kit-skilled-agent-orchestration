# Focus

Consumer migration map and Phase 1 golden parity gate design.

This iteration closes the validator side of Q4 enough to plan work: the validator's hard dependency is not `check-files.sh`; it is `scripts/utils/template-structure.js`, which reads rendered `templates/level_N/*.md` to derive header and anchor contracts. It also expands Q8/Q10 with migration-class risks and concrete CI gates.

# Actions Taken

1. Read iteration 4 first and reused its four-phase ordering: byte-equivalence repair, resolver, consumer migration, optional deletion.
2. Grepped active executable/config surfaces for `templates/level_`, `level_1`, `level_2`, `level_3`, and `level_3+`.
3. Inspected the direct readers: `template-utils.sh`, `create.sh`, `template-structure.js`, `check-template-staleness.sh`, `compose.sh`, `wrap-all-templates.{ts,sh}`, `backfill-frontmatter.ts`, and active template tests.
4. Checked CI/test wiring. There are no `.github/workflows` in this repo; the current CI hook surface is the package script chain under `.opencode/skill/system-spec-kit/package.json` and `.opencode/skill/system-spec-kit/scripts/package.json`.

# Consumer Migration Map

Classification key:

- PATH-resolver: caller needs a filesystem path or directory.
- CONTENT-resolver: caller needs the template body or derived structure.
- DELETION-safe: caller can be removed, regenerated, or left as historical/snapshot data without preserving a runtime resolver contract.

| File path | Current behavior | Classification | Migration step |
| --- | --- | --- | --- |
| `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh:34-42` | Maps doc level to `$base_dir/level_1`, `level_2`, `level_3`, or `level_3+`. | PATH-resolver | Replace `get_level_templates_dir` internals with `ensure_template_level_dir "$level" "$base_dir"`; preserve printed directory contract. |
| `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh:60-78` | Copies from a level directory, falls back to base templates, then creates an empty file when missing. | PATH-resolver | Keep `copy_template` path-based, but require resolver-provided level dir; make canonical docs missing from that dir hard errors. Keep fallback only for explicit cross-cutting templates. |
| `.opencode/skill/system-spec-kit/scripts/spec/create.sh:542-549` | Subfolder mode resolves one level dir and copies every `.md` in it. | PATH-resolver | Resolve the level dir once through shell resolver before the loop; no per-file generator calls. |
| `.opencode/skill/system-spec-kit/scripts/spec/create.sh:1150-1179` | Main spec-folder creation resolves one level dir, warns/falls back when it is missing, then copies every `.md`. | PATH-resolver | Same shell resolver migration; remove the broad fallback warning after generated-cache parity is proven. |
| `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js:47-75` | Hardcodes basename-to-`level_N/file.md` map for validation contracts. | CONTENT-resolver | Replace `TEMPLATE_PATHS` with resolver metadata or `resolveTemplate({ level, name, format: 'content' })`; keep `templatePath` in returned contract for diagnostics. |
| `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js:178-187` | Returns a physical checked-in template path. | PATH-resolver | Preserve `resolveTemplatePath` API but delegate to resolver path mode. Tests already assert the returned path shape; keep `templates/level_N` layout inside cache. |
| `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js:278-295` | Reads the template file body to derive header and anchor rules. | CONTENT-resolver | Use resolver content mode so validators do not care whether content came from checked-in dirs or generated cache. |
| `.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:59-65` | Reads current template version from `templates/level_1/spec.md`. | CONTENT-resolver | Add a shell helper such as `get_template_path 1 spec.md`, or call the Node resolver once and read the returned path. |
| `.opencode/skill/system-spec-kit/scripts/templates/compose.sh:59-72` | Writes directly into checked-in `templates/level_N` output dirs. | PATH-resolver | Add output-root support, e.g. `SPECKIT_TEMPLATE_OUT_ROOT` or `--out-root`, while keeping existing checked-in output as the default during Phase 1. |
| `.opencode/skill/system-spec-kit/scripts/wrap-all-templates.ts:21-25,107-108` | Walks rendered level dirs and rewrites anchors in-place. | DELETION-safe | Do not include this in the Phase 1 cache path. Either remove after composer owns anchors, or keep as a one-off maintenance utility that accepts `--root`. |
| `.opencode/skill/system-spec-kit/scripts/wrap-all-templates.sh:8-24` | Older shell wrapper also walks rendered level dirs and rewrites anchors in-place. | DELETION-safe | Same as TS wrapper; likely retire after parity tests cover anchors. |
| `.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts:100,500-529` | Collects every file under `templates/` and applies frontmatter migration unless `--skip-templates`. | CONTENT-resolver | Stop treating generated rendered outputs as mutation targets. Run against source fragments plus explicit rendered parity fixtures, or let resolver expose the generated set read-only. |
| `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:700-715` | Classifies paths under `templatesRoot` as template documents. | CONTENT-resolver | Keep generic `templatesRoot` classification, but ensure resolver cache paths normalize as template paths or pass an explicit `templateDocument` flag. |
| `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:162-185,474-557` | Prompt/config lists concrete level template paths and canonical templates. | PATH-resolver | Replace literal paths with resolver command examples or generated manifest variables after shell resolver exists. |
| `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:168-191,512-606` | Same plan flow paths for confirm mode. | PATH-resolver | Same migration as auto mode; keep auto/confirm synchronized. |
| `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:167-190,605-979` | Lists full level template set and canonical templates for completion workflow. | PATH-resolver | Replace with resolver-backed manifest. This must wait until Phase 2 path contract is stable. |
| `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:176-199,631-1029` | Same complete flow paths for confirm mode. | PATH-resolver | Same migration as auto mode; keep auto/confirm synchronized. |
| `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:125-138,349-477` | Lists task/checklist/implementation-summary templates by level. | PATH-resolver | Replace with resolver-backed manifest or `get_template_path` examples. |
| `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml:111-124,357-515` | Same implement flow paths for confirm mode. | PATH-resolver | Same migration as auto mode. |
| `.opencode/command/create/assets/create_agent_auto.yaml:310-311` | References Level 1 `spec.md` and `plan.md` as required context for agent creation. | PATH-resolver | Replace with resolver-backed Level 1 path examples. |
| `.opencode/command/create/assets/create_agent_confirm.yaml:343-344` | Same create-agent context for confirm mode. | PATH-resolver | Same migration as auto mode. |
| `.opencode/agent/orchestrate.md:337-389` and runtime mirrors `.codex/agents/orchestrate.toml`, `.claude/agents/orchestrate.md`, `.gemini/agents/orchestrate.md` | Governance text requires agents to cite/copy from `templates/level_N/`. | PATH-resolver | Update language to "resolved Level-N template source" and show resolver examples. Do this after command YAMLs move so agent docs do not get ahead of tooling. |
| `AGENTS.md:342` and `CLAUDE.md:342` | Global/project policy says authored spec docs must use `templates/level_N/`. | PATH-resolver | Update only in Phase 3, after create/validator/command consumers can resolve generated paths. |
| `.opencode/skill/system-spec-kit/scripts/tests/template-structure.vitest.ts:24-57` | Unit tests expect `resolveTemplatePath` to return `templates/level_N` and derive header/anchor contracts from live templates. | CONTENT-resolver | Update to assert resolver source metadata plus unchanged contract arrays. Keep a path-shape assertion for cache layout. |
| `.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:23-52,203-222` | Copies checked-in level dirs into temp specs and asserts required files exist. | PATH-resolver | Convert helper to call resolver path mode; keep existence assertions against resolved dir. |
| `.opencode/skill/system-spec-kit/scripts/tests/test-template-system.js` | Legacy Node test reads all level dirs, validates counts, frontmatter, level markers, and composition. | CONTENT-resolver | Keep as legacy smoke, but add a Vitest golden parity suite for byte-level assertions. Later fold this into resolver parity or delete duplicate checks. |
| `.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js` | Legacy comprehensive test reads rendered level dirs, examples, core, addendum, and `compose.sh`. | CONTENT-resolver | Retain cross-level semantic checks; redirect level dir reads through resolver path mode. |
| `.opencode/skill/system-spec-kit/scripts/tests/test-five-checks.js:27-37,420-470,724-739` | Reads Level 3/3+ `decision-record.md` bodies to check Five Checks content. | CONTENT-resolver | Use resolver content mode for `decision-record.md`; keep examples/addendum direct. |
| `.opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh:12,58-59` | Copies only `level_1` and `addendum` into a temp repo to exercise phase creation. | PATH-resolver | Copy resolver implementation plus source templates, then call `create.sh`; or pre-generate the Level 1 cache in the temp repo. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts` | Uses spec fixtures copied from `scripts/test-fixtures`, not live level dirs. | DELETION-safe | No resolver migration needed. Keep fixture tests as behavioral parity for validator output. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/thin-continuity-record.vitest.ts:156-167` | Tests normalization of path strings like `templates/level_3+/spec.md`. | DELETION-safe | Keep as backward-compat normalization coverage; add cache path examples only if resolver emits user-visible cache paths. |
| `.opencode/skill/system-spec-kit/scripts/test-fixtures/*` and `scripts/tests/fixtures/phase-creation/*` | Snapshot fixtures contain `[template:level_N/file.md]` title markers and template-source comments. | DELETION-safe | Do not migrate as consumers. Update only when intentional fixture regeneration is part of validator parity. |
| `.github/**` | No GitHub Actions workflow consumes level templates; only hook scripts exist and grep found no direct level-template reads. | DELETION-safe | No CI workflow edit exists today. Use package-script CI hook instead. |
| `.vscode/**` | No direct level-template consumer found. | DELETION-safe | No migration needed. |

# Golden Parity Test Gate

Phase 1 must not start consumer migration until generated output is byte-equivalent to the checked-in rendered contract. The gate should live in `scripts/tests/template-rendered-parity.vitest.ts` and use Vitest's `describe/it/expect`, matching the existing `scripts/tests/*.vitest.ts` suite.

## Test 1: per-level byte diff

Generate all runtime docs into a temp output root:

```text
SPECKIT_TEMPLATE_OUT_ROOT=/tmp/speckit-template-parity-XXXX/templates \
  bash scripts/templates/compose.sh 1 2 3 3+
```

Compare generated files against checked-in goldens under `templates/level_1`, `templates/level_2`, `templates/level_3`, and `templates/level_3+`.

Scope:

- Include runtime docs: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `checklist.md`, `decision-record.md` when present.
- Exclude `README.md`; iteration 4 established README is documentation, not runtime template output.
- Assert exact UTF-8 byte equality with `Buffer.compare`.
- On failure, write a unified diff to the Vitest assertion message or a temp artifact path.

## Test 2: reducer and validator behavioral parity

Create paired temp spec folders for Level 1, Level 2, Level 3, Level 3+, and one phase parent/child sample:

- One folder copied from checked-in `templates/level_N`.
- One folder copied from generated parity output.

Run:

```text
bash scripts/spec/validate.sh <folder> --json
```

Normalize nondeterministic fields before comparing:

- absolute temp paths
- timing fields
- ordering of diagnostics only if the existing JSON report does not guarantee order

Assertions:

- Exit code class is identical.
- Rule IDs, statuses, and failure codes are identical.
- `TEMPLATE_HEADERS`, `ANCHORS_VALID`, `FRONTMATTER_VALID`, `FRONTMATTER_MEMORY_BLOCK`, `SPEC_DOC_INTEGRITY`, and `TOC_POLICY` are explicitly present in the comparison set.
- `scripts/utils/template-structure.js` contracts from generated content equal the contracts from checked-in content for headers, required anchors, optional anchors, and allowed anchors.

## Test 3: ANCHOR invariants

Parse every generated runtime doc and assert:

- Every `<!-- ANCHOR:x -->` has one matching `<!-- /ANCHOR:x -->`.
- Required anchors from `loadTemplateContract(level, basename)` appear in order.
- Level 3 and 3+ preserve the broad committed `questions` anchor span instead of wrapper-generated numeric anchors.
- Level 3+ preserves governance anchors: `approval-workflow`, `compliance-checkpoints`, `stakeholder-matrix`, `change-log`.
- No duplicate opening anchor appears in the same file.
- No wrapper-only numeric anchors such as `metadata-2` appear unless they already exist in the checked-in golden.

## Test 4: frontmatter normalization invariants

Assert on generated output before byte comparison, so failures point at the repair rule:

- Exactly one top YAML frontmatter block.
- `_memory.continuity` exists in every generated runtime doc that has it in the checked-in golden.
- Continuity values match the level-specific committed contract from iteration 4.
- Level metadata table values match the current committed quirks: Level 1 is `1`, Level 2 stays `[1/2/3/3+]`, Level 3 is `3`, Level 3+ is `3+`.
- `level_3/decision-record.md` description matches the committed architectural-choice wording, not the malformed generated string.

## CI hook

There is no `.github/workflows` target in this repo. The enforceable hook is package-script CI:

1. Add `scripts/tests/template-rendered-parity.vitest.ts`.
2. Add a targeted script in `.opencode/skill/system-spec-kit/scripts/package.json`:

```json
"test:template-parity": "vitest run tests/template-rendered-parity.vitest.ts --config ../mcp_server/vitest.config.ts --root ."
```

3. Add `npm run test:template-parity` before `test:legacy` in `@spec-kit/scripts` `test`.
4. Root `.opencode/skill/system-spec-kit/package.json` already runs `npm run test --workspace=@spec-kit/scripts`, so the root test gate picks it up.
5. Later, when a GitHub Actions workflow exists, call `npm test` from `.opencode/skill/system-spec-kit`.

# Risk Register Extension

| Risk | Class | Impact | Mitigation |
| --- | --- | --- | --- |
| Resolver returns a cache path whose relative shape does not end in `templates/level_N/file.md`. | PATH callers | Existing assertions, diagnostics, and title provenance drift. | Preserve `templates/level_N` layout inside cache and keep `resolveTemplatePath` compatibility tests. |
| `copy_template` keeps touching empty canonical docs after resolver migration. | PATH callers | Missing generated docs become silent corrupt spec folders. | Make canonical misses hard errors in Phase 2; leave fallback only for declared optional cross-cutting templates. |
| Command YAMLs migrate before resolver exists. | PATH callers | Agents receive instructions they cannot execute. | Order command/doc migration after shell and JS resolver APIs are committed and tested. |
| Validator reads generated content with subtle anchor drift. | CONTENT callers | `TEMPLATE_HEADERS` and `ANCHORS_VALID` change behavior across existing folders. | Gate Phase 2 on contract parity for `template-structure.js` plus full `validate.sh --json` comparisons. |
| Backfill mutates generated cache outputs. | CONTENT callers | Cache becomes dirty and nondeterministic. | Treat resolver cache as read-only; aim frontmatter backfill at source fragments or checked-in goldens only. |
| Wrapper utilities reintroduce numeric anchors after byte repair. | CI gate failure | Generated output is deterministic but not committed-compatible. | Remove wrapper from resolver path; composer owns exact anchor contract. |
| Byte parity test only covers `spec.md`. | CI gate failure | Non-spec docs drift unnoticed. | Enumerate all 21 runtime docs; exclude only README by policy. |
| Behavioral parity compares raw JSON with temp paths. | CI gate failure | False failures block migration. | Normalize absolute paths and timing fields before comparing semantic rule results. |
| Phase-parent samples are omitted. | CI gate failure | Resolver works for simple levels but breaks phase addenda. | Include one parent/child sample exercising `inferPhaseSpecAddenda`. |
| Generated-cache failure falls back too early. | Rollback | Phase 2 bugs masked by checked-in fallback. | Allow fallback in Phase 2 with telemetry; fail closed in Phase 3 CI and delete only in Phase 4. |

# Refactor Plan With Gates

## Phase 1: byte-equivalence repair

Scope:

- Extend `compose.sh` to support temp output root.
- Inject legacy `_memory.continuity`.
- Preserve committed Level 3/3+ anchors.
- Preserve current metadata-level quirks.
- Repair malformed decision-record metadata at source.
- Add `template-rendered-parity.vitest.ts`.

Gate:

- `npm run test:template-parity --workspace=@spec-kit/scripts`
- `bash scripts/templates/compose.sh --verify` remains useful but is not sufficient by itself.

## Phase 2: resolver introduction

Scope:

- Add Node resolver and shell wrapper.
- Keep checked-in `templates/level_N` fallback.
- Preserve cache layout.
- Add resolver path/content tests.

Gate:

- Existing `template-structure.vitest.ts` passes through resolver.
- `create.sh` temp workspace tests pass from generated cache and checked-in fallback.
- Performance budget remains near iteration 3 numbers; resolver cache should avoid repeated compose calls.

## Phase 3: consumer migration

Scope:

- Migrate `create.sh`, `template-utils.sh`, `template-structure.js`, `check-template-staleness.sh`, active template tests, command YAMLs, and runtime agent docs.
- Update `AGENTS.md` / `CLAUDE.md` policy language after tooling works.

Gate:

- Root `npm test` from `.opencode/skill/system-spec-kit`.
- `bash scripts/spec/validate.sh <sample-level-folders> --strict`.
- Targeted command prompt snapshots, if available, show resolver-backed paths.

## Phase 4: optional rendered-dir deletion

Scope:

- Delete checked-in `templates/level_N` only if resolver cache is strict and parity has been stable.
- Keep or regenerate README docs separately.

Gate:

- Golden parity can regenerate the old rendered contract from source.
- No active `rg "templates/level_"` hits remain outside historical fixtures/docs explicitly marked as legacy.
- Rollback is a one-commit revert or disabling strict cache mode to restore checked-in fallback.

# Questions Updated

Q4: Validator migration should target `scripts/utils/template-structure.js` first. `check-files.sh` validates required file presence by level, but the actual rendered-template dependency for headers and anchors is `template-structure.js`.

Q8: Full risk surface now splits into PATH callers, CONTENT callers, deletion-safe fixtures/docs, CI false positives, and rollback order. The riskiest runtime callers are `create.sh` and `template-structure.js`.

Q10: Refactor plan remains PARTIAL and four-phased. Phase 1 is now concrete enough to implement: add byte parity tests first, repair composer until they pass, then introduce resolver.

# Recommendation

PARTIAL remains the right recommendation.

Do not delete `templates/level_N` in this packet. Keep them as committed goldens and compatibility fallback while adding a resolver and proving byte/behavioral parity. Deletion is a Phase 4 option, not the consolidation objective for the current work.
