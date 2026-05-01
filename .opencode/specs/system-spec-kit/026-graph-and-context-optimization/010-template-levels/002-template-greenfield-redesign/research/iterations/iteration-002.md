# Iteration 2: Addon Lifecycle Classification And Level-Validator Survey

## Focus

ADDON-DOC LIFECYCLE CLASSIFICATION (Q3 + Q7), plus the iteration-1 gap around remaining level-encoding validators. This pass classifies the five cross-cutting addon docs by writer owner and absence behavior, then maps the current Level 1/2/3/3+/phase-parent file requirements into capability traits.

## Actions Taken

- Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-001.md` first to preserve the parser-contract baseline.
- Searched `.opencode/skill/`, `.opencode/command/`, and `.opencode/agent/` for writes and lifecycle references to `handover.md`, `debug-delegation.md`, `research.md`, `resource-map.md`, and `context-index.md`.
- Read addon writer and routing surfaces: `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`, `.opencode/agent/deep-research.md`, `.opencode/command/spec_kit/deep-research.md`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`, `.opencode/skill/system-spec-kit/templates/README.md`, `.opencode/skill/system-spec-kit/templates/context-index.md`, and `.opencode/skill/system-spec-kit/templates/resource-map.md`.
- Read the requested level-encoding validators: `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh`, `.opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh`, `.opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh`, `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh`, `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts`, `.opencode/skill/system-spec-kit/scripts/rules/check-canonical-save.sh`, and `.opencode/skill/system-spec-kit/scripts/rules/check-canonical-save-helper.cjs`.
- Re-read `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh` and `.opencode/skill/system-spec-kit/templates/README.md` to verify the trait-to-file matrix captures every current required-file rule.

## Findings

### Addon Lifecycle Table

| Addon | Writer (author/command/agent/workflow) | Trigger to create | Author-edited after creation? | Validator behavior on absence |
|---|---|---|---|---|
| `handover.md` | `command-owned-lazy`, via canonical save routing. `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` maps `handover_state` to `handover.md`; `.opencode/command/spec_kit/complete.md` says save context must use `generate-context.js`, not manual writes. | `/memory:save` or command save phase when the content router classifies a chunk as `handover_state`; resume commands read it if present. | Normally no. Operators may review generated continuity, but canonical continuity writes should route through `generate-context.js` / memory-save, not hand-authored edits. | Absence is accepted. `/spec_kit:resume` falls back to `_memory.continuity` in `implementation-summary.md`, then spec docs. `check-spec-doc-integrity.sh` validates handover metadata only when a `handover*.md` file exists. |
| `debug-delegation.md` | `command-owned-lazy` scaffold plus `@debug` agent-owned report. `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh` writes `debug-delegation.md` or versioned `debug-delegation-NNN.md`; `.opencode/agent/orchestrate.md` assigns exclusive ownership to `@debug`. | Same-error/failure threshold after 3+ failed attempts in `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` or complete workflow, and only after the operator answers yes to the debug prompt. | Limited. The scaffold explicitly says the operator must review/fill missing handoff fields before dispatching `@debug`; after dispatch, `@debug` owns the debug pass. | Absence is accepted. Ordinary validators do not require it. Style rules such as `.opencode/skill/system-spec-kit/scripts/rules/check-toc-policy.sh` only inspect it if present. |
| `research.md` | `workflow-owned-packet`. In live deep-research root packets this is `research/research.md`: `.opencode/command/spec_kit/deep-research.md` synthesizes `{artifact_dir}/research.md`, and `.opencode/agent/deep-research.md` may progressively update it only when `progressiveSynthesis` is enabled. Memory-save routing also maps `research_finding` to `research/research.md`. | `/spec_kit:deep-research` or `/spec_kit:deep-review` synthesis; optionally progressive updates during iterations when enabled by config. | No for ordinary authors. The loop/reducer/synthesis workflow owns the canonical research output; manual edits risk fighting the reducer and final synthesis. | Absence is accepted for ordinary spec folders. `spec-doc-structure.ts`, memory parsing, graph metadata parsing, and indexing validate/index research docs only if present. |
| `resource-map.md` | Dual lifecycle. Root `resource-map.md` is `author-scaffolded` optional; research/review packet `research/resource-map.md` or `review/resource-map.md` is `workflow-owned-packet`. | Root: author chooses the template when a path ledger helps, especially broad packets. Workflow packet: deep-research/deep-review convergence runs reducer emission unless `config.resource_map.emit == false` / `--no-resource-map`. | Root map: yes, it is an author-maintained path catalog. Workflow map: no, it is emitted from converged delta evidence by `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`. | Absence is accepted. Deep-research init records `resource_map_present: false` and writes "resource-map.md not present; skipping coverage gate" into Known Context. Resume reads it as supporting context only when present. |
| `context-index.md` | `author-scaffolded` optional migration bridge. `.opencode/skill/system-spec-kit/templates/README.md` says it is never auto-scaffolded. | Only when a phase parent has been reorganized, renamed, gap-renumbered, split, joined, or archived after prior work existed. `.opencode/skill/system-spec-kit/scripts/rules/check-phase-parent-content.sh` recommends moving migration history there. | Yes. It is a human navigation bridge for phase-folder movement and should stay brief. | Absence is accepted. `check-phase-parent-content.sh` warns about migration-history tokens in phase-parent `spec.md` and suggests `context-index.md`, but does not require the file. |

Lifecycle classification:

| Class | Docs |
|---|---|
| `author-scaffolded` | Root `resource-map.md`, `context-index.md` |
| `command-owned-lazy` | `handover.md`, `debug-delegation.md` scaffold |
| `workflow-owned-packet` | `research/research.md`, `research/resource-map.md`, `review/resource-map.md` |

Design implication: addon docs should not be scaffolded by default in the greenfield manifest. The manifest needs lifecycle ownership, not only `required: true/false`, because absence semantics differ by owner. `handover.md` and `debug-delegation.md` are lazy command outputs, `research/research.md` is packet-workflow output, and `context-index.md` is explicitly never auto-scaffolded.

### Level-Encoding Validator Survey

| File | Hardcoded level constants | Hardcoded level-to-file or level-to-section mapping | Refactor difficulty |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh` | Numeric comparison after stripping suffix from `1`, `2`, `3`, `3+`. | Always checks `spec.md:Problem Statement,Requirements,Scope` and `plan.md:Technical Context,Architecture,Implementation`; level >= 2 adds `checklist.md:Verification Protocol,Code Quality`; level >= 3 adds `decision-record.md:Context,Decision,Consequences`. Warning-only. | EASY/MEDIUM. A manifest can replace the `file_sections` array with per-doc required/recommended section sets. |
| `.opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh` | Regexes accept only `[123]\+?` across `SPECKIT_LEVEL`, bullets, tables, YAML `level:`, and inline fallback. Invalid declarations outside 1/2/3/3+ fail. | Required files are hardcoded: Level 1 `spec.md`, `plan.md`, `tasks.md`; Level 2/3/3+ add `checklist.md`; Level 3/3+ add `decision-record.md`. It also only expects level declarations in `spec.md` and `checklist.md`. | HARD. This combines taxonomy parsing, consistency checks, and required-file enforcement. In a capability model it should probably split into `capability-manifest-valid` and `required-docs-present`. |
| `.opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh` | Case switch over `1`, `2`, `3`, `3+`; falls back to Level 1 thresholds. | Minimum H2/requirement/scenario counts are hardcoded per level; Level 2+ requires `checklist.md`; Level 3+ warns if `decision-record.md` is absent. | MEDIUM/HARD. Counts are not just files; they encode quality heuristics. Manifest traits need threshold fields or this rule should become advisory and doc-type based. |
| `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh` | Receives `$level` and passes it directly into `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js compare`. Phase parents are skipped. | Checks fixed doc basenames: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`; expected headers come from level-specific templates. Checklist H1 and CHK formatting are hardcoded. | HARD. The shell wrapper is small, but it depends on level-directory template structure. Manifest-driven headers require replacing `compare "$level" "$basename"` with doc-type/capability template lookup. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts` | Accepts a `level` CLI option but does not branch on Level 1/2/3/3+ for required docs. It does contain route aliases and fixed doc basenames. | Collects fixed core docs plus optional `handover.md`, `research.md`, `research/research.md`, and `resource-map.md` if present. It validates frontmatter memory blocks, merge legality, sufficiency, contamination, and fingerprints for existing docs. | EASY for level removal. It is already mostly doc-presence agnostic. Refactor only the fixed document registry into a manifest/doc-type registry if doc names change. |
| `.opencode/skill/system-spec-kit/scripts/rules/check-canonical-save.sh` and `.opencode/skill/system-spec-kit/scripts/rules/check-canonical-save-helper.cjs` | No Level 1/2/3/3+ constants. | No level-to-file mapping. It enforces canonical-save root metadata conditions: live packet roots with child packets and metadata need `spec.md`, source docs, graph lineage, and normalized packet identity. | EASY/no-op for level taxonomy. It should remain a packet-root metadata rule, not an authored-doc level rule. |

Additional adjacent validator finding:

- `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh` is still the simplest hard file-presence source: Level 1 requires `spec.md`, `plan.md`, `tasks.md`; Level 2 adds `checklist.md`; Level 3 and `3+` add `decision-record.md`; `implementation-summary.md` is required after tasks/checklist show completion. Phase parents skip the ordinary level set and require only `spec.md` in this shell rule.
- The "lean trio" phase-parent contract is distributed: `check-files.sh` requires only `spec.md`, while metadata expectations come from `description.json`, `graph-metadata.json`, canonical-save rules, memory indexing, and the project-level contract.

Refactor cost model:

1. Hard file presence is duplicated in at least `check-files.sh`, `check-level-match.sh`, and partly `check-section-counts.sh`.
2. Hard section/header expectations are duplicated across `check-sections.sh`, `check-section-counts.sh`, `check-template-headers.sh`, and `template-structure.js`.
3. `spec-doc-structure.ts` is the least coupled to levels and can probably consume a manifest early.
4. Canonical-save checks should stay outside the capability matrix; they guard packet identity and graph/resume provenance, not authored-doc capability.

### Trait→Required-Files Matrix Sketch

Current behavior can be represented with these traits:

| Trait | Files required by current behavior | Source evidence |
|---|---|---|
| `kind=ordinary-authored-packet` | `spec.md`, `plan.md`, `tasks.md` | `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh`; `.opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh`; `.opencode/skill/system-spec-kit/templates/README.md` |
| `capability=qa-verification` | `checklist.md` | Level >= 2 in `check-files.sh`, `check-level-match.sh`, `check-section-counts.sh`; Level 2+ template directory |
| `capability=architecture-decisions` | `decision-record.md` | Level >= 3 in `check-files.sh` and `check-level-match.sh`; warning in `check-section-counts.sh`; Level 3/3+ template directories |
| `lifecycle=implementation-started-or-completed` | `implementation-summary.md` after completed checklist/tasks evidence; template README says all levels include/finalize it after implementation | `check-files.sh`; `.opencode/skill/system-spec-kit/templates/README.md` |
| `kind=phase-parent` | `spec.md`, plus runtime metadata `description.json` and `graph-metadata.json` by packet contract | `check-files.sh` phase-parent branch; `check-canonical-save-helper.cjs`; carry-over parser contract from iteration 1 |
| `capability=governance-expanded` | No extra file beyond Level 3; expands section/header/content expectations inside existing files | Level 3+ template directory contains the same core file names as Level 3 |

Current levels as trait products:

| Current taxonomy | Trait expression | Required files |
|---|---|---|
| Level 1 | `kind=ordinary-authored-packet` | `spec.md`, `plan.md`, `tasks.md`; `implementation-summary.md` after completion evidence |
| Level 2 | `kind=ordinary-authored-packet` + `capability=qa-verification` | Level 1 set + `checklist.md`; `implementation-summary.md` after completion evidence |
| Level 3 | `kind=ordinary-authored-packet` + `capability=qa-verification` + `capability=architecture-decisions` | Level 2 set + `decision-record.md`; `implementation-summary.md` after completion evidence |
| Level 3+ | Level 3 traits + `capability=governance-expanded` | Same file set as Level 3; stricter/expanded sections and headers inside the files |
| Phase parent | `kind=phase-parent` | `spec.md`, `description.json`, `graph-metadata.json`; heavy docs live in child phases |

Totality check:

- Captured every current ordinary required file: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`.
- Captured every current phase-parent core file from the greenfield parser contract: `spec.md`, `description.json`, `graph-metadata.json`.
- Captured the Level 3+ difference without inventing a new file: the distinction is section/governance expansion, not a separate required document.

Minimality check:

- Excluded `handover.md`, `debug-delegation.md`, `research/research.md`, `resource-map.md`, and `context-index.md` from default required files because every inspected writer/validator treats them as absent-ok addon or workflow outputs.
- Excluded `research/resource-map.md` and `review/resource-map.md` from authored scaffold requirements because they are convergence-time workflow outputs.
- Excluded canonical-save source-doc and graph lineage requirements from authored-doc traits because those rules validate metadata provenance, not human scaffold capability.

## Questions Answered

- Q3/Q7 are answered for the five addon docs. The lifecycle split is: root `resource-map.md` and `context-index.md` are author-scaffolded optional docs; `handover.md` and `debug-delegation.md` are command-owned lazy outputs; `research/research.md` plus packet-local workflow maps are workflow-owned outputs.
- Q4 is deepened. The strongest level-encoding files are `check-files.sh`, `check-level-match.sh`, `check-section-counts.sh`, `check-sections.sh`, and `check-template-headers.sh` through `template-structure.js`. `spec-doc-structure.ts` is mostly level-agnostic. Canonical-save checks do not encode the Level taxonomy.
- Q2 readiness improved. The current Level taxonomy can be expressed as a small trait matrix: ordinary authored packet, QA verification, architecture decisions, implementation completion, governance-expanded sections, and phase parent.

## Questions Remaining

- Whether the greenfield manifest should preserve separate traits for `qa-verification` and `completion-verification`, or collapse them into a single `verification` capability with lifecycle states.
- Whether Level 3+ governance expansion belongs in a file-manifest capability, a section-profile capability, or a separate policy profile. It has no unique file requirement today, so treating it as a file trait would be misleading.
- Whether command-owned lazy docs should be declared in the same manifest as authored docs or in a sibling `outputs`/`lifecycle` registry. A single manifest can cover both, but it should keep owner and absence semantics explicit.

## Next Focus

Iteration 3 should score the five candidate designs against the parser-contract and lifecycle reality before detailed refactor planning. The fastest elimination test is: can the design express owner, trigger, absence behavior, section/header expectations, and runtime metadata separately?

Likely early reads for iteration 3:

- `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`
- `.opencode/skill/system-spec-kit/templates/README.md`
- `.opencode/skill/system-spec-kit/assets/template_mapping.md`
- `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh`
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts`
