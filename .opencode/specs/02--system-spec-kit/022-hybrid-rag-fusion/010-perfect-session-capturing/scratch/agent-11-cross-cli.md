# Agent 11: Cross-CLI Compatibility Audit

## Summary

| Check | Instances Found | Severity | Notes |
| --- | ---: | --- | --- |
| A. CLI-Specific Tool References | 108 raw hits | Medium | Materially CLI-specific usage is concentrated in phase 016 `view`/`View`; the rest are mostly generic `Task` or `shell` wording rather than cross-CLI tool API names. |
| B. Hardcoded Paths | 145 unique lines | Medium | `.opencode/` dominates and appears to be the repo-canonical path; CLI-specific runtime paths still appear for `.claude/`, `.gemini/`, and absolute `/.codex`. No `.copilot/` path references were found. |
| C. CLI-Specific Agent References | 0 | Low | No `@context` / `@research` / `@write`-style agent tags appear in canonical docs. Agent coupling shows up indirectly through runtime-path examples, not direct agent invocation syntax. |
| D. Phase 016 Claims Validation | 5 phase docs reviewed | Medium | Phase 016 is accurate about the specific parity seams it hardened, but it does not enumerate all five supported CLIs or clearly separate fixture-backed proof from live-proof status inside the phase docs themselves. |
| E. Universal Compatibility | 4 substantive gaps | Medium | Most commands are CLI-agnostic repo commands, but several docs still assume runtime-specific path layouts and phase 016 is not fully self-contained as a five-CLI reference. |

Audit scope: `86` canonical markdown files under `010-perfect-session-capturing`, excluding `scratch/`, `research/`, and `memory/`.

## CLI-Specific Tool References

### Read / View family

Observed naming is almost entirely Copilot-specific `view`/`View` language inside `016-multi-cli-parity`, usually paired with the canonical `Read ...` behavior. No `read_file` references were found.

- `016-multi-cli-parity/checklist.md:42` — hits: `view` — - [x] CHK-010 [P0] Parity regression coverage added for the intended public/runtime behavior [EVIDENCE: `phase-classification.vitest.ts`, `content-filter-parity.vitest.ts`, and `runtime-memory-inputs.vitest.ts` now assert aliasing, noise filtering, provenance, and `view` title behavior.]
- `016-multi-cli-parity/checklist.md:55` — hits: `view` — - [x] CHK-022 [P1] Edge cases tested [EVIDENCE: Content-filter parity tests cover Copilot lifecycle markers, Codex reasoning markers, and empty XML wrappers; runtime-memory inputs cover `view` title shortening and CLI-derived provenance.]
- `016-multi-cli-parity/implementation-summary.md:33` — hits: `view` — Phase 016 now proves the parity behavior that was already present in the runtime. You can point at a direct regression for each reopened question: Copilot `view` aliases score as canonical `read`, shared noise filtering catches Copilot and Codex artifacts without a side path, and CLI-derived `FILES` keep the `_provenance: 'tool'` metadata that earlier scoring work now depends on. The phase folder itself also moved from a validator-failing "assumed complete" state to a real Level 2 completion record.
- `016-multi-cli-parity/implementation-summary.md:47` — hits: `View` — | `.opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts` | Modified | Prove Copilot `View` aliases to canonical research scoring. |
- `016-multi-cli-parity/implementation-summary.md:49` — hits: `view` — | `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts` | Modified | Prove CLI-derived `FILES` keep `_provenance: 'tool'` and `view` titles render as `Read ...`. |
- `016-multi-cli-parity/implementation-summary.md:74` — hits: `view` — | Prove `view` behavior through public classifier and transform APIs. | Public-surface tests show the aliasing matters downstream, not just inside a local helper. |
- `016-multi-cli-parity/plan.md:61` — hits: `view` — - **`input-normalizer.ts` parity seam**: CLI-derived file provenance and `view` observation title rendering.
- `016-multi-cli-parity/plan.md:78` — hits: `view` — - [x] Add a classifier regression proving Copilot `view` aliases to canonical `read` scoring.
- `016-multi-cli-parity/plan.md:80` — hits: `view` — - [x] Extend runtime-memory input tests to prove CLI-derived `FILES` keep `_provenance: 'tool'` and `view` renders `Read ...` titles.
- `016-multi-cli-parity/spec.md:6` — hits: `view` —   - "copilot view alias"
- `016-multi-cli-parity/spec.md:45` — hits: `view` — Phase 016 had already landed its runtime behavior in the live code, but the phase folder still claimed completion without direct parity-specific proof. The missing coverage left three real questions open: whether Copilot `view` aliases drive research scoring, whether Codex/Copilot/XML noise markers are filtered through the shared `NOISE_PATTERNS` path, and whether CLI-derived `FILES` keep the `_provenance: 'tool'` metadata that earlier scoring phases now consume.
- `016-multi-cli-parity/spec.md:62` — hits: `view` x2 — - Add direct regression coverage for Copilot `view` alias scoring, built-in multi-CLI noise filtering, CLI-derived file provenance, and `view` observation titles.
- `016-multi-cli-parity/spec.md:75` — hits: `view` — | `.opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts` | Modify | Add direct proof that Copilot `view` aliases to canonical `read` scoring. |
- `016-multi-cli-parity/spec.md:77` — hits: `view` — | `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts` | Modify | Prove CLI-derived `FILES` keep `_provenance: 'tool'` and Copilot `view` titles render as `Read ...`. |
- `016-multi-cli-parity/spec.md:90` — hits: `View`, `view` — | REQ-001 | Copilot `view` aliases must drive canonical research scoring. | `phase-classification.vitest.ts` proves `View` classifies as `Research` through the public classifier APIs. |
- `016-multi-cli-parity/spec.md:92` — hits: `view` x2 — | REQ-003 | CLI-derived file entries must retain tool provenance and `view` titles. | `runtime-memory-inputs.vitest.ts` proves `transformOpencodeCapture()` emits `Read loaders/data-loader.ts` for `view` and applies `_provenance: 'tool'` to CLI-derived `FILES`. |
- `016-multi-cli-parity/spec.md:108` — hits: `View` — - **SC-001**: **Given** a low-signal exchange that only uses Copilot `View`, **Then** the classifier resolves the phase as `Research` instead of `Discussion`.
- `016-multi-cli-parity/spec.md:110` — hits: `view` — - **SC-003**: **Given** a CLI capture with `view` and `edit` tool calls, **Then** `transformOpencodeCapture()` renders `Read ...` titles and stores CLI-derived `FILES` with `_provenance: 'tool'`.
- `016-multi-cli-parity/tasks.md:45` — hits: `View` — - [x] T004 Add a direct `View -> Research` regression in `.opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts`.

### Write family

No `Write tool`, `write_file`, or `Insert` references were found in the canonical corpus.

- None found.

### Bash / shell family

These are generic shell-command or shell-test references, not evidence of a canonical cross-CLI `Bash tool` naming convention. No `Bash tool` or `run_command` strings were found.

- `010-integration-testing/spec.md:39` — hits: `shell` — 22 Vitest + 25 legacy JS + 4 shell + 1 Python tests exist, but the real gate chain runs under heavy mocks. Post-write orchestration (description tracking, indexing, retry) has no end-to-end coverage. `task-enrichment.vitest.ts` mocks the file writer, both scorers, sufficiency, the indexer, and the retry manager. `test-integration.js` checks cleanup helpers and export presence, not live orchestration. There is no test that exercises the full save pipeline with real file I/O and real gate evaluation.
- `012-template-compliance/checklist.md:58` — hits: `shell` — - [x] CHK-024 [P1] Targeted shell suite categories pass for positive/template-header/evidence/placeholder lanes [EVIDENCE: targeted `test-validation.sh` and `test-validation-extended.sh` category runs passed]
- `012-template-compliance/implementation-summary.md:93` — hits: `shell` — 2. The broader historical shell suites still contain many legacy minimalist fixtures. This phase updated the targeted template-compliance categories to the new compliant/mutation lane rather than rewriting every older fixture family in one pass.
- `012-template-compliance/plan.md:46` — hits: `shell` — - [x] Targeted fixture, shell, and Vitest coverage added
- `012-template-compliance/plan.md:96` — hits: `shell` — - [x] Update shell test suites to use the compliant/mutation fixture set for template-compliance paths
- `012-template-compliance/plan.md:109` — hits: `shell` — | Integration | Warning/failure fixtures and targeted shell suite categories | `test-validation.sh`, `test-validation-extended.sh` targeted categories |
- `012-template-compliance/spec.md:59` — hits: `shell` — - Add template-compliant fixtures and targeted shell/Vitest coverage for compliant, warning, and failure cases
- `012-template-compliance/tasks.md:61` — hits: `shell` — - [x] T014 Update targeted shell validation categories to use the new compliant/mutation fixture lane in the `scripts/tests/test-validation*` runners
- `012-template-compliance/tasks.md:62` — hits: `shell` — - [x] T015 Validate the compliant fixture and targeted shell/Vitest commands, then align this phase’s docs and summary with the shipped implementation
- `013-auto-detection-fixes/spec.md:125` — hits: `shell` — | Risk | Git-status signal adds shell execution to detection hot path | Medium | Cache `git status` output per detection run; filter to spec paths only to minimize output size |
- `plan.md:27` — hits: `shell` — | **Language/Stack** | Markdown documentation, shell validation commands |

### Agent / Task family

Every raw hit is generic task-template wording (`Task Notation`, `Task Format`, etc.) rather than a real cross-CLI `Agent tool` or subagent API reference.

- `001-quality-scorer-unification/tasks.md:12` — hits: `Task` — ## Task Notation
- `001-quality-scorer-unification/tasks.md:21` — hits: `Task` — **Task Format**: `T### [P?] Description (file path)`
- `002-contamination-detection/tasks.md:12` — hits: `Task` — ## Task Notation
- `002-contamination-detection/tasks.md:21` — hits: `Task` — **Task Format**: `T### [P?] Description (file path)`
- `003-data-fidelity/tasks.md:12` — hits: `Task` — ## Task Notation
- `003-data-fidelity/tasks.md:21` — hits: `Task` — **Task Format**: `T### [P?] Description (file path)`
- `004-type-consolidation/tasks.md:12` — hits: `Task` — ## Task Notation
- `004-type-consolidation/tasks.md:21` — hits: `Task` — **Task Format**: `T### [P?] Description (file path)`
- `005-confidence-calibration/tasks.md:12` — hits: `Task` — ## Task Notation
- `005-confidence-calibration/tasks.md:21` — hits: `Task` — **Task Format**: `T### [P?] Description (file path)`
- `006-description-enrichment/tasks.md:12` — hits: `Task` — ## Task Notation
- `006-description-enrichment/tasks.md:21` — hits: `Task` — **Task Format**: `T### [P?] Description (file path)`
- `007-phase-classification/tasks.md:12` — hits: `Task` — ## Task Notation
- `007-phase-classification/tasks.md:21` — hits: `Task` — **Task Format**: `T### [P?] Description (file path)`
- `008-signal-extraction/tasks.md:12` — hits: `Task` — ## Task Notation
- `008-signal-extraction/tasks.md:21` — hits: `Task` — **Task Format**: `T### [P?] Description (file path)`
- `009-embedding-optimization/tasks.md:12` — hits: `Task` — ## Task Notation
- `009-embedding-optimization/tasks.md:21` — hits: `Task` — **Task Format**: `T### [P?] Description (file path)`
- `010-integration-testing/tasks.md:12` — hits: `Task` — ## Task Notation
- `010-integration-testing/tasks.md:21` — hits: `Task` — **Task Format**: `T### [P?] Description (file path)`
- `011-session-source-validation/tasks.md:12` — hits: `Task` — ## Task Notation
- `011-session-source-validation/tasks.md:21` — hits: `Task` — **Task Format**: `T### [P?] Description (file path)`
- `012-template-compliance/tasks.md:3` — hits: `Task` — description: "Task Format: T### [P?] Description (file path)"
- `012-template-compliance/tasks.md:17` — hits: `Task` — ## Task Notation
- `012-template-compliance/tasks.md:26` — hits: `Task` — **Task Format**: `T### [P?] Description (file path)`
- `013-auto-detection-fixes/tasks.md:12` — hits: `Task` — ## Task Notation
- `013-auto-detection-fixes/tasks.md:21` — hits: `Task` — **Task Format**: `T### [P?] Description (file path)`
- `014-spec-descriptions/tasks.md:18` — hits: `Task` — ## Task Notation
- `014-spec-descriptions/tasks.md:24` — hits: `TASK` — | `TASK-###` | Phase-local task identifier preserved from the original implementation campaign |
- `014-spec-descriptions/tasks.md:26` — hits: `TASK`, `Task` — **Task Format**: `TASK-###: Description (primary file or seam)`
- `014-spec-descriptions/tasks.md:36` — hits: `TASK` — - [x] TASK-001: Define the per-folder description data model in `folder-discovery.ts`
- `014-spec-descriptions/tasks.md:39` — hits: `TASK` — - [x] TASK-002: Implement per-folder description generation logic
- `014-spec-descriptions/tasks.md:42` — hits: `TASK` — - [x] TASK-003: Implement per-folder description loading and persistence helpers
- `014-spec-descriptions/tasks.md:45` — hits: `TASK` — - [x] TASK-004: Add safe write and freshness checks for per-folder description files
- `014-spec-descriptions/tasks.md:48` — hits: `TASK` — - [x] TASK-005: Add unit coverage for the new per-folder description helpers
- `014-spec-descriptions/tasks.md:60` — hits: `TASK` — - [x] TASK-006: Add spec folder description generation to `create.sh`
- `014-spec-descriptions/tasks.md:63` — hits: `TASK` — - [x] TASK-007: Add a Node CLI wrapper for description generation
- `014-spec-descriptions/tasks.md:66` — hits: `TASK` — - [x] TASK-008: Wire the Bash and Node paths together for automated folder creation
- `014-spec-descriptions/tasks.md:69` — hits: `TASK` — - [x] TASK-009: Extend creation-time generation to phased spec folders
- `014-spec-descriptions/tasks.md:72` — hits: `TASK` — - [x] TASK-010: Add integration coverage for creation-time description generation
- `014-spec-descriptions/tasks.md:78` — hits: `TASK` — - [x] TASK-011: Add collision-resistant slug generation in `slug-utils.ts`
- `014-spec-descriptions/tasks.md:81` — hits: `TASK` — - [x] TASK-012: Add guardrails for repeated collision attempts
- `014-spec-descriptions/tasks.md:84` — hits: `TASK` — - [x] TASK-013: Integrate unique slug generation into the memory save workflow
- `014-spec-descriptions/tasks.md:87` — hits: `TASK` — - [x] TASK-014: Persist memory naming state in per-folder description metadata
- `014-spec-descriptions/tasks.md:90` — hits: `TASK` — - [x] TASK-015: Add defense-in-depth to the atomic file writer
- `014-spec-descriptions/tasks.md:93` — hits: `TASK` — - [x] TASK-016: Add tests for rapid-save and same-timestamp collision scenarios
- `014-spec-descriptions/tasks.md:99` — hits: `TASK` — - [x] TASK-017: Refactor centralized description aggregation to prefer per-folder files
- `014-spec-descriptions/tasks.md:102` — hits: `TASK` — - [x] TASK-018: Preserve consumer-facing cache behavior
- `014-spec-descriptions/tasks.md:105` — hits: `TASK` — - [x] TASK-019: Extend cache staleness detection for the new architecture
- `014-spec-descriptions/tasks.md:108` — hits: `TASK` — - [x] TASK-020: Protect backward compatibility when no per-folder files exist
- `014-spec-descriptions/tasks.md:111` — hits: `TASK` — - [x] TASK-021: Add integration coverage for mixed per-folder and legacy discovery
- `014-spec-descriptions/tasks.md:123` — hits: `TASK` — - [x] TASK-022: Update the feature catalog documentation for the refactored description system
- `014-spec-descriptions/tasks.md:126` — hits: `TASK` — - [x] TASK-023: Expand the testing playbook for the new description workflow
- `014-spec-descriptions/tasks.md:129` — hits: `TASK` — - [x] TASK-024: Extend integration tests to cover the new description system behavior
- `014-spec-descriptions/tasks.md:132` — hits: `TASK` — - [x] TASK-025: Run regression verification for the full description system refactor
- `015-outsourced-agent-handback/tasks.md:3` — hits: `Task` — description: "Task Format: T### [P?] Description (file path)"
- `015-outsourced-agent-handback/tasks.md:15` — hits: `Task` — ## Task Notation
- `015-outsourced-agent-handback/tasks.md:24` — hits: `Task` — **Task Format**: `T### [P?] Description (file path)`
- `016-multi-cli-parity/tasks.md:3` — hits: `Task` — description: "Task Format: T### [P?] Description (file path)"
- `016-multi-cli-parity/tasks.md:18` — hits: `Task` — ## Task Notation
- `016-multi-cli-parity/tasks.md:27` — hits: `Task` — **Task Format**: `T### [P?] Description (file path)`
- `plan.md:58` — hits: `Task` — ### Pre-Task Checklist
- `plan.md:76` — hits: `Task` — ### Blocked Task Protocol
- `spec.md:280` — hits: `Task` — - **Task Breakdown**: See `tasks.md`
- `tasks.md:3` — hits: `Task` — description: "Task Format: T### [P?] Description (file path)"
- `tasks.md:20` — hits: `Task` — ## Task Notation
- `tasks.md:29` — hits: `Task` — **Task Format**: `T### [P?] Description (file path)`
- `tasks.md:87` — hits: `Task` — ### Pre-Task Checklist
- `tasks.md:96` — hits: `TASK` — | TASK-SCOPE | Stay inside the root spec pack and the minimum child-link metadata needed for recursive compliance |
- `tasks.md:97` — hits: `TASK` — | TASK-EVIDENCE | Do not mark a task done without fresh command or file evidence |
- `tasks.md:98` — hits: `TASK` — | TASK-TRUTH | Distinguish live CLI proof, fixture-backed proof, and blocked cases explicitly |
- `tasks.md:99` — hits: `TASK` — | TASK-VERIFY | Re-run the authoritative validators before closing the task |
- `tasks.md:108` — hits: `Task` — ### Blocked Task Protocol

### Edit / patch family

No `apply_diff` references were found. The only genuinely tool-shaped phrasing is phase 016 `edit tool calls`; the rest are generic uses of the verb `patch`.

- `012-template-compliance/implementation-summary.md:92` — hits: `patched` — 1. No separate Codex runtime speckit agent document exists under the workspace or `/Users/michelkerkmeester/.codex`, so Codex parity is documented as an absence rather than patched as a file.
- `012-template-compliance/tasks.md:36` — hits: `patch` — - [x] T003 Confirm no repo-local or home-directory Codex speckit runtime file exists to patch (`/Users/michelkerkmeester/.codex`)
- `decision-record.md:95` — hits: `patches` — | 3 | **Sufficient?** | PASS | Minimal test and documentation patches resolve the known blockers without widening scope |
- `plan.md:79` — hits: `Patch` — 3. Patch only the minimum scope needed to restore truthful completion.
- `tasks.md:112` — hits: `patched` — 3. Resume only after the blocker is patched or explicitly documented as unresolved.

## Hardcoded Paths

Path-prefix counts (raw hits, deduped by line below): `.opencode/`=160, `.claude/`=2, `.gemini/`=2, `.codex`=4, `.copilot/`=0.

### Prefix `.claude/`

These are runtime-specific agent-path examples and should be labeled as such when used in canonical docs.

- `012-template-compliance/implementation-summary.md:46` — hits: `.claude/` — | `.claude/agents/speckit.md` | Modified | Inline scaffold and strict post-write validation guidance |
- `012-template-compliance/tasks.md:35` — hits: `.claude/`, `.gemini/`, `.opencode/` x2 — - [x] T002 Locate the actual runtime prompt surfaces that replace the stale draft references (`.opencode/agent/`, `.claude/agents/`, `.gemini/agents/`, `.opencode/command/spec_kit/assets/`)

### Prefix `.copilot/`

No `.copilot/` path references were found.

- None found.

### Prefix `.codex`

All `.codex` hits are absolute user-home examples (`/Users/.../.codex`), which are the least portable references in scope.

- `012-template-compliance/checklist.md:33` — hits: `.codex` — - [x] CHK-003 [P1] Codex runtime path checked explicitly [EVIDENCE: no separate Codex speckit agent document found under `/Users/michelkerkmeester/.codex`]
- `012-template-compliance/implementation-summary.md:92` — hits: `.codex` — 1. No separate Codex runtime speckit agent document exists under the workspace or `/Users/michelkerkmeester/.codex`, so Codex parity is documented as an absence rather than patched as a file.
- `012-template-compliance/spec.md:129` — hits: `.codex` — | Risk | Codex runtime parity is assumed without a file on disk | Low | Explicitly record that no separate Codex speckit file exists in the repo or `/Users/michelkerkmeester/.codex` |
- `012-template-compliance/tasks.md:36` — hits: `.codex` — - [x] T003 Confirm no repo-local or home-directory Codex speckit runtime file exists to patch (`/Users/michelkerkmeester/.codex`)

### Prefix `.gemini/`

These are runtime-specific agent-path examples and should be labeled as such when used in canonical docs.

- `012-template-compliance/implementation-summary.md:47` — hits: `.gemini/` — | `.gemini/agents/speckit.md` | Modified | Inline scaffold and strict post-write validation guidance |
- `012-template-compliance/tasks.md:35` — hits: `.claude/`, `.gemini/`, `.opencode/` x2 — - [x] T002 Locate the actual runtime prompt surfaces that replace the stale draft references (`.opencode/agent/`, `.claude/agents/`, `.gemini/agents/`, `.opencode/command/spec_kit/assets/`)

### Prefix `.opencode/`

This is the dominant project-local path convention and appears to be universal for this repository, but it is still runtime-specific documentation rather than CLI-neutral prose.

- `002-contamination-detection/checklist.md:85` — hits: `.opencode/` — - [x] CHK-052 [P2] Findings saved to memory/ [Evidence: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <phase-folder>` created `memory/16-03-26_18-23__contamination-detection.md` and refreshed `metadata.json`.]
- `002-contamination-detection/implementation-summary.md:72` — hits: `.opencode/` — | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <phase-folder>` | Passed — saved `memory/16-03-26_18-23__contamination-detection.md` and refreshed `metadata.json` |
- `005-confidence-calibration/checklist.md:82` — hits: `.opencode/` — - [x] CHK-052 [P2] Findings saved to memory/ — Evidence: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <phase-folder>` completed and indexed memory #4362 on 2026-03-16. [Evidence: Verified in this phase's documented implementation and validation outputs.]
- `005-confidence-calibration/implementation-summary.md:30` — hits: `.opencode/` — - Updated decision rendering in `decision-tree-generator.ts`, `ascii-boxes.ts`, `workflow.ts`, and `.opencode/skill/system-spec-kit/templates/context_template.md` so divergent confidence values surface as split choice/rationale labels.
- `005-confidence-calibration/implementation-summary.md:72` — hits: `.opencode/` — | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <phase-folder>` | Passed and indexed memory #4362 |
- `005-confidence-calibration/plan.md:60` — hits: `.opencode/` — - **Template renderers (`.opencode/skill/system-spec-kit/templates/context_template.md`)**: Display split confidence in decision sections
- `005-confidence-calibration/plan.md:96` — hits: `.opencode/` — - [x] Update renderer surfaces (`ascii-boxes.ts`, `.opencode/skill/system-spec-kit/templates/context_template.md`) to include split labels when dual values are present
- `005-confidence-calibration/spec.md:73` — hits: `.opencode/` — | `.opencode/skill/system-spec-kit/templates/context_template.md` | Modify | Display dual confidence values in decision-related template sections |
- `005-confidence-calibration/tasks.md:49` — hits: `.opencode/` — - [x] T011 [P] Update renderer templates to include `Choice: X% / Rationale: Y%` labels when dual values are present (REQ-004) (`.opencode/skill/system-spec-kit/templates/context_template.md`) — Evidence: decision sections render split confidence only when the values materially diverge.
- `005-confidence-calibration/tasks.md:52` — hits: `.opencode/` — - [x] T014 [P] Add dual confidence display placeholders for decision sections (`.opencode/skill/system-spec-kit/templates/context_template.md`) — Evidence: added `HAS_SPLIT_CONFIDENCE` branch with choice/rationale formatting.
- `007-phase-classification/checklist.md:95` — hits: `.opencode/` — - [x] CHK-052 [P2] Findings saved to memory/ [Evidence: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js '<phase-folder>'` created `memory/16-03-26_20-18__phase-classification.md` and refreshed `memory/metadata.json`.]
- `008-signal-extraction/checklist.md:88` — hits: `.opencode/` — - [x] CHK-052 [P2] Findings saved to memory/ [Evidence: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js '<phase-folder>'` created `memory/16-03-26_19-54__signal-extraction.md` and refreshed `metadata.json`.]
- `009-embedding-optimization/checklist.md:49` — hits: `.opencode/` — - [x] CHK-020 [P0] Unit tests pass for weighted payload builder (concatenation, multipliers, truncation order) [Evidence: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/embedding-weighting.vitest.ts` passed.]
- `009-embedding-optimization/implementation-summary.md:67` — hits: `.opencode/` — | `cd .opencode/skill/system-spec-kit/scripts && npm run check` | Passed |
- `009-embedding-optimization/implementation-summary.md:68` — hits: `.opencode/` — | `cd .opencode/skill/system-spec-kit/scripts && npm run build` | Passed |
- `009-embedding-optimization/implementation-summary.md:70` — hits: `.opencode/` — | `cd .opencode/skill/system-spec-kit/mcp_server && npm run lint` | Passed |
- `009-embedding-optimization/implementation-summary.md:71` — hits: `.opencode/` — | `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` | Passed |
- `009-embedding-optimization/implementation-summary.md:72` — hits: `.opencode/` — | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/embedding-weighting.vitest.ts tests/embedding-pipeline-weighting.vitest.ts tests/embeddings.vitest.ts tests/handler-memory-save.vitest.ts` | Passed — 4 files, 49 tests |
- `009-embedding-optimization/implementation-summary.md:73` — hits: `.opencode/` x2 — | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/009-embedding-optimization` | Passed — wrote `memory/16-03-26_20-38__implemented-weighted-document-embedding-input-for.md` and `memory/metadata.json`; production indexing remained pending after a memory quality gate warning |
- `010-integration-testing/plan.md:80` — hits: `.opencode/` — - [ ] Factory creates: temp dir, `.opencode/` marker, spec folder with `spec.md`, seed `description.json`
- `010-integration-testing/tasks.md:42` — hits: `.opencode/` — - [ ] T005 Factory creates: temp dir, `.opencode/` marker, spec folder with `spec.md`, seed `description.json` (`scripts/tests/workflow-e2e.vitest.ts`)
- `012-template-compliance/checklist.md:41` — hits: `.opencode/` — - [x] CHK-010 [P0] Shared live template contract helper shipped [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`]
- `012-template-compliance/checklist.md:54` — hits: `.opencode/` — - [x] CHK-020 [P0] Template contract Vitest coverage passes [EVIDENCE: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/template-structure.vitest.ts`]
- `012-template-compliance/checklist.md:55` — hits: `.opencode/` — - [x] CHK-021 [P0] Runtime prompt/workflow assertion script passes [EVIDENCE: `node .opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js`]
- `012-template-compliance/checklist.md:56` — hits: `.opencode/` x2 — - [x] CHK-022 [P0] Compliant fixture passes strict validation [EVIDENCE: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2 --strict`]
- `012-template-compliance/implementation-summary.md:39` — hits: `.opencode/` — | .opencode/skill/system-spec-kit/scripts/utils/template-structure.js | Created | Shared live template contract parsing/comparison |
- `012-template-compliance/implementation-summary.md:40` — hits: `.opencode/` — | .opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh | Modified | Enforce required header presence/order and checklist format |
- `012-template-compliance/implementation-summary.md:41` — hits: `.opencode/` — | .opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh | Modified | Enforce required anchor presence/order from live templates |
- `012-template-compliance/implementation-summary.md:42` — hits: `.opencode/` — | .opencode/skill/system-spec-kit/scripts/spec/validate.sh | Modified | Promote `TEMPLATE_HEADERS` structural failures to errors |
- `012-template-compliance/implementation-summary.md:44` — hits: `.opencode/` — | `.opencode/agent/speckit.md` | Modified | Inline scaffold and strict post-write validation guidance |
- `012-template-compliance/implementation-summary.md:45` — hits: `.opencode/` — | `.opencode/agent/chatgpt/speckit.md` | Modified | Inline scaffold and strict post-write validation guidance |
- `012-template-compliance/implementation-summary.md:48` — hits: `.opencode/` — | .opencode/command/spec_kit/assets/spec_kit_{plan,implement,complete}_{auto,confirm}.yaml | Modified | Embed scaffold contracts and strict validation steps |
- `012-template-compliance/implementation-summary.md:49` — hits: `.opencode/` — | System-spec-kit fixture and test lanes under `.opencode/skill/system-spec-kit/scripts/` | Created/Modified | Add compliant/mutation fixture lanes and targeted coverage |
- `012-template-compliance/implementation-summary.md:79` — hits: `.opencode/` — | `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/template-structure.vitest.ts` | PASS |
- `012-template-compliance/implementation-summary.md:80` — hits: `.opencode/` — | `node .opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js` | PASS |
- `012-template-compliance/implementation-summary.md:81` — hits: `.opencode/` x2 — | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2 --strict` | PASS |
- `012-template-compliance/implementation-summary.md:82` — hits: `.opencode/` x2 — | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/054-template-extra-header` | PASS with warnings |
- `012-template-compliance/implementation-summary.md:83` — hits: `.opencode/` — | `bash .opencode/skill/system-spec-kit/scripts/tests/test-validation.sh -c "Positive Tests"` | PASS |
- `012-template-compliance/implementation-summary.md:84` — hits: `.opencode/` — | `bash .opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh -c "Individual Rule: TEMPLATE_HEADERS"` | PASS |
- `012-template-compliance/plan.md:88` — hits: `.opencode/` — - [x] Update the shared/OpenCode runtime speckit agent docs under `.agents/agents/` and `.opencode/agent/`
- `012-template-compliance/plan.md:106` — hits: `.opencode/` — | Unit | Template path resolution, required header/anchor extraction, optional-template allowance, dynamic decision-record handling | `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/template-structure.vitest.ts` |
- `012-template-compliance/plan.md:107` — hits: `.opencode/` — | Integration | Runtime agent and workflow prompt assertions | `node .opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js` |
- `012-template-compliance/plan.md:108` — hits: `.opencode/` — | Integration | Compliant fixture strict validation | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .../053-template-compliant-level2 --strict` |
- `012-template-compliance/spec.md:71` — hits: `.opencode/` — | .opencode/skill/system-spec-kit/scripts/utils/template-structure.js | Create | Shared live template contract parser/comparator |
- `012-template-compliance/spec.md:72` — hits: `.opencode/` — | .opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh | Modify | Fail on missing/out-of-order required headers, warn on extra custom headers |
- `012-template-compliance/spec.md:73` — hits: `.opencode/` — | .opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh | Modify | Compare ordered required anchors against live template contracts |
- `012-template-compliance/spec.md:74` — hits: `.opencode/` — | .opencode/skill/system-spec-kit/scripts/spec/validate.sh | Modify | Treat `TEMPLATE_HEADERS` as an error in normal validation |
- `012-template-compliance/spec.md:75` — hits: `.opencode/` — | OpenCode runtime speckit agent docs in `.opencode/agent/` plus `.agents/agents/` | Modify | Inline scaffold and strict post-write validation rules |
- `012-template-compliance/spec.md:77` — hits: `.opencode/` — | .opencode/command/spec_kit/assets/spec_kit_{plan,implement,complete}_{auto,confirm}.yaml | Modify | Embed scaffold contracts and `validate.sh --strict` post-write steps |
- `012-template-compliance/spec.md:78` — hits: `.opencode/` — | System-spec-kit fixture and test lanes under `.opencode/skill/system-spec-kit/scripts/` | Create/Modify | Add compliant and mutated fixtures plus targeted test coverage |
- `012-template-compliance/tasks.md:34` — hits: `.opencode/` — - [x] T001 Review parent `010` docs and prior child phases for repo-aligned context (`.opencode/specs/.../010-perfect-session-capturing/`)
- `012-template-compliance/tasks.md:35` — hits: `.claude/`, `.gemini/`, `.opencode/` x2 — - [x] T002 Locate the actual runtime prompt surfaces that replace the stale draft references (`.opencode/agent/`, `.claude/agents/`, `.gemini/agents/`, `.opencode/command/spec_kit/assets/`)
- `012-template-compliance/tasks.md:44` — hits: `.opencode/` — - [x] T004 Create the shared live template contract helper at `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`
- `012-template-compliance/tasks.md:48` — hits: `.opencode/` — - [x] T008 [P] Update the shared/OpenCode runtime speckit agent docs under `.agents/agents/` and `.opencode/agent/`
- `014-spec-descriptions/checklist.md:90` — hits: `.opencode/` — - [x] CHK-040 [P1] Feature catalog `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md` updated — backfill note added, `generate-description.js` referenced [EVIDENCE: The feature catalog entry documents per-folder architecture, backfill behavior, and the generator CLI path.]
- `014-spec-descriptions/plan.md:145` — hits: `.opencode/` — - [ ] Call Node.js helper script: `node .opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js <folder-path>`
- `014-spec-descriptions/plan.md:184` — hits: `.opencode/` — - [ ] Update feature catalog `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md`
- `014-spec-descriptions/tasks.md:67` — hits: `.opencode/` —   - [x] Call `node .opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js <folder-path>` from `create.sh`.
- `014-spec-descriptions/tasks.md:124` — hits: `.opencode/` —   - [x] Revise `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md` with the per-folder architecture flow.
- `014-spec-descriptions/tasks.md:155` — hits: `.opencode/` — - **Feature Catalog**: See `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md`
- `015-outsourced-agent-handback/checklist.md:29` — hits: `.opencode/` — - [x] CHK-001 [P0] Requirements documented in `spec.md` - explicit hard-fail, next-step persistence, post-010 gate awareness, and evidence reconciliation captured [Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/015-outsourced-agent-handback/spec.md`]
- `015-outsourced-agent-handback/checklist.md:30` — hits: `.opencode/` — - [x] CHK-002 [P0] Technical approach defined in `plan.md` - runtime, CLI-doc, catalog/test, and reconciliation phases documented [Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/015-outsourced-agent-handback/plan.md`]
- `015-outsourced-agent-handback/checklist.md:39` — hits: `.opencode/` — - [x] CHK-010 [P0] Explicit missing-file failures hard-fail with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...` [Evidence: `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`]
- `015-outsourced-agent-handback/checklist.md:40` — hits: `.opencode/` x2 — - [x] CHK-011 [P0] Explicit invalid JSON and invalid-shape payloads do not fall back to OpenCode capture [Evidence: `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`, `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`]
- `015-outsourced-agent-handback/checklist.md:41` — hits: `.opencode/` — - [x] CHK-012 [P0] `nextSteps` and `next_steps` are both accepted [Evidence: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`]
- `015-outsourced-agent-handback/checklist.md:42` — hits: `.opencode/` x3 — - [x] CHK-013 [P1] First next step persists as `Next: ...`, remaining steps persist as `Follow-up: ...`, `NEXT_ACTION` reads the first step, and mixed structured payloads preserve missing next-step facts without duplicate `Next:` / `Follow-up:` observations [Evidence: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`, `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts`, `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`]
- `015-outsourced-agent-handback/checklist.md:50` — hits: `.opencode/` x2 — - [x] CHK-020 [P0] All 4 `cli-*` SKILL files include handback guidance with redact-and-scrub, rejection-code, and minimum-payload wording [Evidence: `.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts` plus repo reads of `.opencode/skill/cli-*/SKILL.md`]
- `015-outsourced-agent-handback/checklist.md:51` — hits: `.opencode/` x2 — - [x] CHK-021 [P0] All 4 `cli-*` prompt templates include richer `FILES` examples, accepted snake_case field names, and explicit failure wording [Evidence: `.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts` plus repo reads of `.opencode/skill/cli-*/assets/prompt_templates.md`]
- `015-outsourced-agent-handback/checklist.md:52` — hits: `.opencode/` x2 — - [x] CHK-022 [P0] Feature-catalog entry reflects phase `015` rather than stale `013` wording [Evidence: `.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts`, `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md`]
- `015-outsourced-agent-handback/checklist.md:54` — hits: `.opencode/` x2 — - [x] CHK-024 [P1] Alignment drift passes for the scripts root - `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts` returned `244` scanned files, `0` findings, and `0` warnings [Evidence: current rerun output in this task]
- `015-outsourced-agent-handback/checklist.md:55` — hits: `.opencode/` — - [x] CHK-025 [P1] TypeScript verification is presented as current acceptance proof only with a reproducible rerun artifact - `npm run lint` in `.opencode/skill/system-spec-kit/scripts` passed (`tsc --noEmit`) [Evidence: current rerun output in this task]
- `015-outsourced-agent-handback/checklist.md:67` — hits: `.opencode/` x2 — - [x] CHK-032 [P1] Path wording uses `.opencode/skill/cli-*` rather than `.opencode/skill/sk-cli/` in the reconciled spec docs [Evidence: reconciled spec artifacts]
- `015-outsourced-agent-handback/checklist.md:87` — hits: `.opencode/` — - [x] CHK-050 [P1] Temp files remain in `scratch/` only - `scratch/` contains `.gitkeep` [Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/015-outsourced-agent-handback/scratch`]
- `015-outsourced-agent-handback/plan.md:64` — hits: `.opencode/` — - **Feature catalog entry `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md`**: Tracks the handback protocol as a current phase `015` concern rather than a stale `013` snapshot.
- `015-outsourced-agent-handback/plan.md:115` — hits: `.opencode/` x2 — | Alignment verification | Drift between implementation and aligned standards | `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts` |
- `015-outsourced-agent-handback/plan.md:116` — hits: `.opencode/` — | Spec validation | Completeness and checklist consistency inside this folder | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` |
- `015-outsourced-agent-handback/spec.md:84` — hits: `.opencode/` — | `.opencode/skill/cli-codex/SKILL.md` | Modify | Memory Handback Protocol with redact-and-scrub guidance |
- `015-outsourced-agent-handback/spec.md:85` — hits: `.opencode/` — | `.opencode/skill/cli-copilot/SKILL.md` | Modify | Same |
- `015-outsourced-agent-handback/spec.md:86` — hits: `.opencode/` — | `.opencode/skill/cli-gemini/SKILL.md` | Modify | Same |
- `015-outsourced-agent-handback/spec.md:87` — hits: `.opencode/` — | `.opencode/skill/cli-claude-code/SKILL.md` | Modify | Same |
- `015-outsourced-agent-handback/spec.md:89` — hits: `.opencode/` — | `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md` | Modify | Align the catalog entry to phase `015` and the post-010 gate contract |
- `015-outsourced-agent-handback/tasks.md:32` — hits: `.opencode/` — - [x] T001 Hard-fail missing explicit data files with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...` (`.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`)
- `015-outsourced-agent-handback/tasks.md:33` — hits: `.opencode/` — - [x] T002 Hard-fail invalid JSON and invalid-shape explicit payloads without falling back to OpenCode capture (`.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`)
- `015-outsourced-agent-handback/tasks.md:34` — hits: `.opencode/` — - [x] T003 Accept `nextSteps` and `next_steps`, then persist the first entry as `Next: ...` and later entries as `Follow-up: ...`, including mixed structured payload preservation when next-step facts are missing (`.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`)
- `015-outsourced-agent-handback/tasks.md:35` — hits: `.opencode/` — - [x] T004 Drive `NEXT_ACTION` from the first persisted `Next: ...` fact (`.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts`)
- `015-outsourced-agent-handback/tasks.md:36` — hits: `.opencode/` — - [x] T005 Add regression coverage for explicit JSON-mode failures and next-step persistence, including mixed structured payload behavior (`.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`)
- `015-outsourced-agent-handback/tasks.md:46` — hits: `.opencode/` — - [x] T008 Align feature-catalog entry `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md` to phase `015` and the post-010 gate contract
- `015-outsourced-agent-handback/tasks.md:47` — hits: `.opencode/` — - [x] T009 Add doc-regression coverage for the 8 handback docs and the feature catalog (`.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts`)
- `015-outsourced-agent-handback/tasks.md:56` — hits: `.opencode/` x2 — - [x] T011 Record current alignment-drift evidence: `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts` passed with `244` scanned files, `0` findings, and `0` warnings
- `015-outsourced-agent-handback/tasks.md:57` — hits: `.opencode/` — - [x] T012 Record current TypeScript check evidence: `npm run lint` in `.opencode/skill/system-spec-kit/scripts` passed (`tsc --noEmit`)
- `015-outsourced-agent-handback/tasks.md:61` — hits: `.opencode/` — - [x] T016 Run `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` on this spec folder and record the exit code
- `015-outsourced-agent-handback/tasks.md:85` — hits: `.opencode/` — - **Runtime loader**: `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`
- `015-outsourced-agent-handback/tasks.md:86` — hits: `.opencode/` — - **Normalization**: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`
- `015-outsourced-agent-handback/tasks.md:87` — hits: `.opencode/` — - **Next-action extraction**: `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts`
- `015-outsourced-agent-handback/tasks.md:88` — hits: `.opencode/` x2 — - **Regression coverage**: `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts`
- `015-outsourced-agent-handback/tasks.md:89` — hits: `.opencode/` x4 — - **CLI docs**: `.opencode/skill/cli-codex/`, `.opencode/skill/cli-copilot/`, `.opencode/skill/cli-gemini/`, `.opencode/skill/cli-claude-code/`
- `016-multi-cli-parity/implementation-summary.md:47` — hits: `.opencode/` — | `.opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts` | Modified | Prove Copilot `View` aliases to canonical research scoring. |
- `016-multi-cli-parity/implementation-summary.md:48` — hits: `.opencode/` — | `.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts` | Created | Lock Copilot lifecycle, Codex reasoning, and XML wrapper markers to the shared noise filter. |
- `016-multi-cli-parity/implementation-summary.md:49` — hits: `.opencode/` — | `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts` | Modified | Prove CLI-derived `FILES` keep `_provenance: 'tool'` and `view` titles render as `Read ...`. |
- `016-multi-cli-parity/implementation-summary.md:50` — hits: `.opencode/` — | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/016-multi-cli-parity/spec.md` | Modified | Reconcile scope, requirements, success criteria, and final status. |
- `016-multi-cli-parity/implementation-summary.md:51` — hits: `.opencode/` — | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/016-multi-cli-parity/plan.md` | Modified | Add technical context and the reopened hardening delivery plan. |
- `016-multi-cli-parity/implementation-summary.md:52` — hits: `.opencode/` — | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/016-multi-cli-parity/tasks.md` | Modified | Return the phase to the standard Setup / Implementation / Verification structure. |
- `016-multi-cli-parity/implementation-summary.md:53` — hits: `.opencode/` — | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/016-multi-cli-parity/checklist.md` | Modified | Record current evidence tags for completion. |
- `016-multi-cli-parity/implementation-summary.md:54` — hits: `.opencode/` — | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/016-multi-cli-parity/implementation-summary.md` | Modified | Restore the required anchored summary sections and final verification report. |
- `016-multi-cli-parity/spec.md:75` — hits: `.opencode/` — | `.opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts` | Modify | Add direct proof that Copilot `view` aliases to canonical `read` scoring. |
- `016-multi-cli-parity/spec.md:76` — hits: `.opencode/` — | `.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts` | Create | Lock Copilot lifecycle, Codex reasoning, and XML wrapper markers to the shared noise filter. |
- `016-multi-cli-parity/spec.md:77` — hits: `.opencode/` — | `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts` | Modify | Prove CLI-derived `FILES` keep `_provenance: 'tool'` and Copilot `view` titles render as `Read ...`. |
- `016-multi-cli-parity/spec.md:78` — hits: `.opencode/` — | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/016-multi-cli-parity/*.md` | Modify | Bring the phase-016 spec artifacts back into Level 2 template compliance with current evidence. |
- `016-multi-cli-parity/tasks.md:45` — hits: `.opencode/` — - [x] T004 Add a direct `View -> Research` regression in `.opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts`.
- `016-multi-cli-parity/tasks.md:46` — hits: `.opencode/` — - [x] T005 Create `.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts` for Copilot lifecycle noise, Codex reasoning markers, and empty XML wrappers.
- `016-multi-cli-parity/tasks.md:47` — hits: `.opencode/` — - [x] T006 Extend `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts` to prove `Read ...` titles and `_provenance: 'tool'` on CLI-derived `FILES`.
- `016-multi-cli-parity/tasks.md:57` — hits: `.opencode/` — - [x] T009 Run `.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js` and record the final totals.
- `016-multi-cli-parity/tasks.md:58` — hits: `.opencode/` — - [x] T010 Run `npm run typecheck` and `npm run build` from `.opencode/skill/system-spec-kit`.
- `016-multi-cli-parity/tasks.md:59` — hits: `.opencode/` — - [x] T011 Run `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` on the phase-016 folder and reconcile the remaining template/evidence findings.
- `016-multi-cli-parity/tasks.md:80` — hits: `.opencode/` x3 — - **Parity tests**: `.opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`
- `checklist.md:43` — hits: `.opencode/` — - [x] CHK-010 [P0] Code and test-boundary fixes preserve intended module boundaries [Evidence: `node .opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js` -> 384 passed, 0 failed, 5 skipped, 389 total.]
- `checklist.md:57` — hits: `.opencode/` — - [x] CHK-023 [P1] Workspace typecheck/build prerequisites pass [Evidence: `.opencode/skill/system-spec-kit`: `npm run typecheck` PASS; `scripts`: `npm run check` PASS, `npm run build` PASS; `mcp_server`: `npm run lint` PASS, `npm run build` PASS.]
- `decision-record.md:15` — hits: `.opencode/` — <!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->
- `implementation-summary.md:15` — hits: `.opencode/` — <!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->
- `implementation-summary.md:61` — hits: `.opencode/` — | Treat `mcp_server/lib/providers/retry-manager` as canonical | `.opencode/skill/system-spec-kit/scripts/lib/README.md` already records that move, so reintroducing the old path would create fake compatibility |
- `implementation-summary.md:72` — hits: `.opencode/` — | `node .opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js` | PASS: 384 passed, 0 failed, 5 skipped, 389 total |
- `implementation-summary.md:73` — hits: `.opencode/` — | `.opencode/skill/system-spec-kit`: `npm run typecheck` | PASS |
- `implementation-summary.md:74` — hits: `.opencode/` — | `.opencode/skill/system-spec-kit/scripts`: `npm run check` and `npm run build` | PASS |
- `implementation-summary.md:75` — hits: `.opencode/` — | `.opencode/skill/system-spec-kit/mcp_server`: `npm run lint` and `npm run build` | PASS |
- `implementation-summary.md:77` — hits: `.opencode/` — | `node .opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js` | PASS: 305 tests |
- `plan.md:29` — hits: `.opencode/` — | **Storage** | Spec folder markdown under `.opencode/specs/.../010-perfect-session-capturing` |
- `plan.md:140` — hits: `.opencode/` — | `.opencode/skill/system-spec-kit/templates/level_3` | Internal | Green | Root docs cannot be rewritten to canonical structure |
- `spec.md:77` — hits: `.opencode/` — | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/spec.md` | Modify | Level 3 template-compliant root specification with current evidence truth |
- `spec.md:78` — hits: `.opencode/` — | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/plan.md` | Modify | Template-compliant implementation plan with verified gates and dependencies |
- `spec.md:79` — hits: `.opencode/` — | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/tasks.md` | Modify | Template-compliant task tracking and closure criteria |
- `spec.md:80` — hits: `.opencode/` — | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/checklist.md` | Modify | Template-compliant verification checklist with valid priority/evidence context |
- `spec.md:81` — hits: `.opencode/` — | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/decision-record.md` | Modify | Template-compliant ADR with rationale and rollback |
- `spec.md:82` — hits: `.opencode/` — | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/implementation-summary.md` | Create | Post-implementation closure summary and verified results |
- `tasks.md:37` — hits: `.opencode/` — - [x] T001 Read active Level 3 templates and validator expectations (`.opencode/skill/system-spec-kit/templates/level_3/`)
- `tasks.md:38` — hits: `.opencode/` — - [x] T002 Capture current verification evidence for scripts, MCP, and CLI proof lanes (`.opencode/skill/system-spec-kit/`)
- `tasks.md:47` — hits: `.opencode/` — - [x] T004 Repair stale module-contract expectations without widening public boundaries (`.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js`)
- `tasks.md:59` — hits: `.opencode/` — - [x] T009 Rerun root and recursive spec validation until the folder is clean (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh`)
- `tasks.md:60` — hits: `.opencode/` — - [x] T010 Rerun completion checks and targeted root claims (`.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh`)
- `tasks.md:61` — hits: `.opencode/` — - [x] T011 Reconfirm targeted scripts, extractor, and MCP verification lanes after doc and test-lane remediation (`.opencode/skill/system-spec-kit/`)

## Agent Reference Issues

- No direct `@context`, `@research`, `@general`, `@write`, `@debug`, `@handover`, `@ultra-think`, or `@speckit` references were found in the canonical markdown files.

Related indirect coupling still exists through runtime-path references, especially in `012-template-compliance`, where docs discuss `.opencode/agent/`, `.claude/agents/`, and `.gemini/agents/` as concrete runtime surfaces instead of presenting them as CLI-specific examples.

## Phase 016 Validation

1. **Phase 016 was read in full**: `016-multi-cli-parity/spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.

2. **Accuracy of the specific parity claims**: The phase is accurate about the seams it actually hardened: Copilot `view` aliasing (`016-multi-cli-parity/spec.md:45`, `:90`, `:108`), Copilot/Codex/XML noise filtering (`016-multi-cli-parity/spec.md:45`, `:91`, `:109`; `plan.md:60`, `:79`), and CLI-derived file provenance / `Read ...` titles (`016-multi-cli-parity/spec.md:45`, `:92`, `:110`; `plan.md:61`, `:80`).

3. **Five supported CLIs coverage**: Phase 016 does **not** enumerate all five supported CLIs inside the phase docs. The only explicit five-backend phrasing is `016-multi-cli-parity/spec.md:67` (`five-backend capture matrix`). The explicit five-CLI list appears instead in the root checklist at `checklist.md:78` (`Claude, OpenCode, Codex, Gemini, and Copilot`).

4. **Fixture-backed vs live-proof separation**: This separation is clear in the root docs (`spec.md:24`, `checklist.md:69`, `checklist.md:78`, `implementation-summary.md:42-50`), but phase 016 itself is written as regression-proof documentation and does not restate the live-vs-fixture split. That means phase 016 is accurate, but incomplete if a reader treats it as the standalone parity source of truth.

5. **Native support matrix accuracy**: Phase 016 contains no explicit native-support matrix to validate. The root implementation summary provides the closest authoritative matrix-like status: Claude, Gemini, and Copilot produced live same-workspace artifacts; Codex was partial/blocked by standalone usage limits; OpenCode remained live-answering but blocked for local artifact capture (`implementation-summary.md:42-50`). Nothing in phase 016 contradicts that, but phase 016 also does not surface it.

6. **Net assessment**: Phase 016 is **accurate but narrowly scoped**. It should be treated as proof of selected parity seams, not as the complete five-CLI compatibility matrix.

## Recommendations

- Add one explicit sentence near `016-multi-cli-parity/spec.md:45-67` stating that phase 016 validates only selected parity seams, while the root docs carry the full five-CLI live/fixture compatibility status.
- Replace absolute user-home Codex examples like `/Users/michelkerkmeester/.codex` with portable forms such as ``~/.codex`` or `$HOME/.codex`.
- Whenever `.claude/agents/`, `.gemini/agents/`, or `.opencode/agent/` are referenced in canonical docs, label them as runtime-specific examples rather than universal paths.
- Standardize tool wording around canonical concepts (`read`, `write`, `edit`, `shell`, `agent`) and then mention CLI aliases in parentheses, e.g. `read (Copilot: view)` instead of assuming the alias is universally understood.
- If phase 016 is meant to stand alone for auditors, add a small support note enumerating `Claude, OpenCode, Codex, Gemini, Copilot` and cross-link the root proof-separation notes.

