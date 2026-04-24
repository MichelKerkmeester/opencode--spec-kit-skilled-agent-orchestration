# Iteration 002

## Dimension

- `contracts`

## Files Reviewed

- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/README.md`
- `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-placeholders.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-level.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-links.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-toc-policy.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-phase-links.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-graph-metadata.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-normalizer-lint.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh`
- `.opencode/skill/system-spec-kit/scripts/validation/continuity-freshness.ts`
- `.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-lint.ts`
- `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/iterations/iteration-001.md`

## Rule Catalogue

The table below follows the packet's 21-rule audit surface from iteration 1. One adjacent note matters up front: current `show_help()` in `validate.sh` still advertises `EVIDENCE_CITED`, but the packet's 21-rule target surface instead expects `TEMPLATE_HEADERS`, `LEVEL_MATCH`, `LINKS_VALID`, `CONTINUITY_FRESHNESS`, and `EVIDENCE_MARKER_LINT` to be part of the practical contract.

| Rule | Implementation | Semantics | File Scope | Severity | Dependencies |
| --- | --- | --- | --- | --- | --- |
| `FILE_EXISTS` | `check-files.sh::run_check()` | Requires `spec.md`, `plan.md`, `tasks.md`, plus `checklist.md` for L2+, `decision-record.md` for L3+, and `implementation-summary.md` once tasks or checklist items are checked off | Root packet docs | `error` | None |
| `PLACEHOLDER_FILLED` | `check-placeholders.sh::run_check()` | Scans for `[YOUR_VALUE_HERE:...]`, `[NEEDS CLARIFICATION:...]`, and `{{...}}`; strips fenced code and ignores inline-code examples | `spec.md`, `plan.md`, `tasks.md`, optional `checklist.md`, optional `decision-record.md` | `error` | Optional `should_skip_path()` helper |
| `SECTIONS_PRESENT` | `check-sections.sh::run_check()` | Keyword-greps broad section families like `Problem Statement`, `Architecture`, `Verification Protocol`, `Consequences` from headings only | `spec.md`, `plan.md`, L2 `checklist.md`, L3 `decision-record.md` | `warn` | None |
| `TEMPLATE_HEADERS` | `check-template-headers.sh::run_check()` via `template-structure.js compare ... headers` | Enforces required H1/H2 order against active template plus phase addenda; flags extra custom headers as non-blocking warnings; also hard-checks checklist H1 and `CHK-NNN [P*]` format | Core/addendum packet docs | `error` for missing/reordered headers, `warn` for extras | `node`, `scripts/utils/template-structure.js` |
| `PHASE_LINKS` | `check-phase-links.sh::run_check()` | For phased parents only, checks parent `PHASE DOCUMENTATION MAP`, child parent refs, predecessor refs, and successor refs using path/name grep heuristics | Parent `spec.md` plus child `*/spec.md` | Orchestrator class `warn` | None |
| `SPEC_DOC_INTEGRITY` | `check-spec-doc-integrity.sh::run_check()` | Resolves backticked markdown references, verifies `implementation-summary.md` Spec Folder metadata, and checks handover spec/resume targets | Top-level `*.md` in packet root | `error` | `git rev-parse`, repo-root path resolution |
| `ANCHORS_VALID` | `check-anchors.sh::run_check()` plus `template-structure.js compare ... anchors` | Validates opening/closing anchor syntax, orphaned/unclosed pairs, major-doc anchor presence, required anchor order, and extra custom anchors | `memory/*.md` plus packet docs | `error`, with `warn` for extra anchors only | `node`, `scripts/utils/template-structure.js` |
| `CROSS_ANCHOR_CONTAMINATION` | `spec-doc-structure.ts::validateCrossAnchorContamination()` | Classifies routed payload text (`task_update`, `decision_log`, `research_findings`, etc.) and rejects content routed to the wrong continuity/doc bucket | Supplied contamination payload, not template files | `error` | `SPECKIT_CONTAMINATION_JSON` / routing payload |
| `POST_SAVE_FINGERPRINT` | `spec-doc-structure.ts::validatePostSaveFingerprint()` | Confirms post-save target path, fingerprint, snapshot content, size, and mtime expectations against the live file | Supplied post-save target doc only | `error` | `SPECKIT_POST_SAVE_JSON` |
| `CONTINUITY_FRESHNESS` | `continuity-freshness.ts::validateContinuityFreshness()` | Compares `_memory.continuity.last_updated_at` against `graph-metadata.json` `derived.last_save_at`; warns if lag exceeds 10 minutes, fails only on malformed graph metadata/runtime errors | `implementation-summary.md` and `graph-metadata.json` | `warn` / infrastructure `fail` | `tsx`, `js-yaml`, strict post-pass bridge |
| `MERGE_LEGALITY` | `spec-doc-structure.ts::validateMergeLegality()` | Verifies merge-plan target doc exists, has no conflict markers, target anchor exists exactly once, merge mode matches anchor shape, and table/task updates fit the target | Supplied merge-plan target doc only | `error` | `SPECKIT_MERGE_PLAN_JSON` |
| `NORMALIZER_LINT` | `check-normalizer-lint.sh::run_check()` | Strict-only grep for local `normalizeScope*` / `getOptionalString` declarations outside allowlisted governance files | Default `.opencode/skill/system-spec-kit/mcp_server/**` | `error` | `STRICT_MODE`, grep target path |
| `EVIDENCE_MARKER_LINT` | `evidence-marker-lint.ts::lintEvidenceMarkers()` | Audits malformed or unclosed `[EVIDENCE: ...]` markers; returns `warn`, and strict mode turns that into exit code `1` so `validate.sh` surfaces it | Entire packet folder markdown set scanned by audit helper | `warn` | `tsx`, `evidence-marker-audit.js`, strict post-pass bridge |
| `TOC_POLICY` | `check-toc-policy.sh::run_check()` | Rejects `TABLE OF CONTENTS` / `TOC` headings outside research docs | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `handover.md`, `debug-delegation.md` | `error` | None |
| `FRONTMATTER_MEMORY_BLOCK` | `spec-doc-structure.ts::validateFrontmatterMemoryBlock()` | Parses YAML frontmatter, requires `_memory` and `_memory.continuity`, validates `packet_pointer`, actor/timestamp compactness, fingerprint format, byte budget, and repo-relative `key_files` | Spec docs plus optional `handover.md` / research docs | `error` with some `warning` diagnostics | `node --experimental-strip-types`, `spec-doc-structure.ts` |
| `SPEC_DOC_SUFFICIENCY` | `spec-doc-structure.ts::validateSpecDocSufficiency()` | Requires anchors to parse, rejects empty anchors, demands concrete citations in `what-built` and `verification`, and checks ADR/research anchors for minimal substance | Spec docs plus optional research docs | `error` + `warn` | `spec-doc-structure.ts` anchor parser |
| `LEVEL_DECLARED` | `check-level.sh::run_check()` | Reports whether level came from explicit metadata or inference | Packet-level level detection, centered on `spec.md` | `info` | Global `LEVEL_METHOD` from `validate.sh` |
| `LEVEL_MATCH` | `check-level-match.sh::run_check()` | Validates explicit level syntax, keeps file-level declarations aligned to `spec.md`, and checks required files implied by declared level | `spec.md`, `checklist.md`, required file presence | `error` / `warn` for missing secondary declarations | None |
| `LINKS_VALID` | `check-links.sh::run_check()` | Optional repo-wide wiki-link scan after stripping code blocks and inline code | `.opencode/skill/**/*.md` | Orchestrator class `warn` when enabled | `SPECKIT_VALIDATE_LINKS=true` |
| `GRAPH_METADATA_PRESENT` | `check-graph-metadata.sh::run_check()` | Requires root `graph-metadata.json` and validates v1 top-level shape (`schema_version`, packet ids, manual arrays, derived arrays) | `graph-metadata.json` | Orchestrator class `warn` | `node` JSON shape check |
| `PRIORITY_TAGS` | `check-priority-tags.sh::run_check()` | Requires checklist items to live under `P0/P1/P2` headers or carry inline priority tags | `checklist.md` only, L2+ | `warn` | None |

## Initial Coverage Matrix

| Template field family from iter 1 | Rules that touch it | Coverage status | Notes |
| --- | --- | --- | --- |
| Required packet files (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) | `FILE_EXISTS`, `LEVEL_MATCH` | Direct | `implementation-summary.md` is conditional on checked items, so file existence depends on task state |
| Explicit level metadata / level marker | `LEVEL_DECLARED`, `LEVEL_MATCH` | Direct | Only `spec.md` and `checklist.md` are expected to declare level consistently |
| Required section headers and order | `TEMPLATE_HEADERS`, `SECTIONS_PRESENT` | Direct + partial | `TEMPLATE_HEADERS` is structural and exact; `SECTIONS_PRESENT` is coarse keyword coverage only |
| Required anchor ids and order | `ANCHORS_VALID` | Direct | Includes template-driven required anchor ordering and extra-anchor warnings |
| Checklist task priority context | `PRIORITY_TAGS` | Direct | This is the only 21-surface rule tied to task priority semantics |
| Continuity frontmatter core (`packet_pointer`, `last_updated_*`, `recent_action`, `next_safe_action`, `blockers`, `key_files`) | `FRONTMATTER_MEMORY_BLOCK`, `CONTINUITY_FRESHNESS` | Partial | Core continuity fields are checked, but `session_dedup.*`, `completion_pct`, `open_questions`, and `answered_questions` are not |
| Verification/evidence narrative | `SPEC_DOC_SUFFICIENCY`, `EVIDENCE_MARKER_LINT` | Partial | Sufficiency checks anchor substance; marker lint checks bracket syntax only |
| Packet cross-links / markdown references | `SPEC_DOC_INTEGRITY`, `PHASE_LINKS`, `TOC_POLICY` | Indirect | These validate references and structure around docs, not template frontmatter fields |
| Generated artifact contract (`graph-metadata.json`) | `GRAPH_METADATA_PRESENT`, `CONTINUITY_FRESHNESS` | Operational | Generated save output, not a template-authored field family |
| Save/merge routing payloads | `MERGE_LEGALITY`, `CROSS_ANCHOR_CONTAMINATION`, `POST_SAVE_FINGERPRINT` | Orphan vs template catalogue | External runtime payload checks; no direct template field target |
| Repo-wide skill docs / code hygiene | `LINKS_VALID`, `NORMALIZER_LINT` | Orphan vs template catalogue | These act outside the packet templates entirely |

### Obvious Orphan Rules

- `MERGE_LEGALITY`, `CROSS_ANCHOR_CONTAMINATION`, and `POST_SAVE_FINGERPRINT` are operational save/merge guards, not template-field validators.
- `NORMALIZER_LINT` and `LINKS_VALID` inspect repo code/skill docs outside packet templates.
- `GRAPH_METADATA_PRESENT` and most of `CONTINUITY_FRESHNESS` depend on generated artifacts rather than authored template content.

### Obvious Orphan Fields

- Shared frontmatter fields with no dedicated 21-surface rule: `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`.
- Continuity fields with no dedicated 21-surface rule: `_memory.continuity.session_dedup.*`, `completion_pct`, `open_questions`, `answered_questions`.
- Level-3-only metadata with no 21-surface rule: `HVR_REFERENCE`.
- Template provenance/readme metadata from iter 1 with no 21-surface rule: `SPECKIT_TEMPLATE_SOURCE` markers and the three level README contracts.

## Findings By Severity

### P1-001 [P1] `validate.sh` dispatches undocumented rule scripts outside the advertised audit surface

- Files: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:98-102`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:375-424`, `.opencode/skill/system-spec-kit/scripts/rules/README.md:90-126`
- Evidence: `show_help()` advertises a smaller rule set, but the default `get_rule_scripts()` path emits every `check-*.sh` file in `scripts/rules/` and additionally injects five `TS_RULE:*` checks after `check-anchors.sh`. That means `AI_PROTOCOLS`, `COMPLEXITY_MATCH`, `FOLDER_NAMING`, `FRONTMATTER_VALID`, `SECTION_COUNTS`, and `TEMPLATE_SOURCE` still execute even though they are outside the packet's 21-rule contract and absent from the severity/help registry.
- Impact: Reviewers and automation cannot treat the help text or the 21-rule packet prompt as authoritative for what `validate.sh` actually runs.
- Recommendation: Replace alphabetical directory execution with a single canonical rule registry that drives help text, severity mapping, and dispatch together.

### P2-002 [P2] The 21-rule surface mixes template contracts with operational runtime guards, so several iter 1 fields remain structurally unowned

- Files: `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:467-981`, `.opencode/skill/system-spec-kit/scripts/validation/continuity-freshness.ts:1-160`, `.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-lint.ts:1-132`
- Evidence: Seven rules in the targeted surface act on merge payloads, save snapshots, repo-wide markdown/code scans, or generated graph metadata instead of authored template fields. At the same time, iter 1's shared frontmatter fields such as `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`, `session_dedup.*`, `completion_pct`, `open_questions`, `answered_questions`, and `HVR_REFERENCE` do not have dedicated validators in the 21-rule surface.
- Impact: A "full rule coverage" claim against the template catalogue would overstate enforcement; the current rule set is a hybrid of template checks and runtime hygiene checks.
- Recommendation: Split reporting into `template-structure`, `packet-document`, and `operational/save-time` rule families, then either add explicit validation for orphan frontmatter fields or document them as intentionally unchecked.

## Traceability Checks

- `rule_implementation_located`: PASS. Mapped the packet's 21-rule surface to 14 shell rules, 5 TypeScript bridge rules, and 2 strict post-pass validators.
- `help_vs_dispatch_surface`: FAIL. Current `show_help()` still lists `EVIDENCE_CITED`, while the packet's 21-rule surface depends on rules that are resolved through canonicalization and post-pass strict validators instead of the help text.
- `coverage_matrix_established`: PASS. All iter 1 field families were classified as direct, partial, indirect, or orphan relative to the rule surface.
- `orphan_surface_scan`: PASS with note. Orphan rules and orphan fields are now explicit, but no remediation has been implemented yet.
- `adjacent_help_only_rule`: NOTE. `EVIDENCE_CITED` is still implemented in `check-evidence.sh`, but it sits outside the packet's 21-rule matrix and should be reconciled in the documentation pass.

## Verdict

- `CONDITIONAL`

The rule-to-implementation map is now concrete, but the validator contract is not yet cleanly publishable because the live dispatcher, help text, and packet-level 21-rule surface disagree about what actually runs.

## Next Dimension

- `documentation`
- Planned focus: compare `validate.sh` help text, `scripts/rules/README.md`, inline rule comments, and emitted rule/status names so the documentation surface matches the actual dispatcher and the 21-rule review matrix.
