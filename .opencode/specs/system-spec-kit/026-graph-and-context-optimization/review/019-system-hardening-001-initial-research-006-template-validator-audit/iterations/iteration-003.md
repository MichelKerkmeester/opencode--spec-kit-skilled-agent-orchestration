# Iteration 003

## Dimension

- `documentation`

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/iterations/iteration-002.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/deep-review-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/findings-registry.json`
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/README.md`
- `.opencode/skill/system-spec-kit/scripts/rules/check-template-source.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh`
- `.opencode/skill/system-spec-kit/assets/template_mapping.md`
- `.opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md`
- `.opencode/skill/system-spec-kit/templates/level_2/checklist.md`
- `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md`
- `.opencode/skill/system-spec-kit/templates/level_1/`, `level_2/`, `level_3/`, and `level_3+/` canonical template inventories via marker/frontmatter scan

## Coverage Matrix

This pass uses the live dispatcher as the source of truth, then compares its documented surfaces (`show_help()`, `scripts/rules/README.md`, packet prompt pack) against that implementation. Packet types are normalized to the canonical authored docs:

- `spec`
- `plan`
- `tasks`
- `implementation-summary`
- `checklist`
- `decision-record`
- `phase-parent-spec`
- `phase-child-spec`
- `research/handover optional`
- `generated/operational only`

| Rule | Field / invariant enforced | Packet types affected | Classification | Notes |
| --- | --- | --- | --- | --- |
| `FILE_EXISTS` | Required file set by level | `spec`, `plan`, `tasks`, `implementation-summary`, `checklist`, `decision-record` | direct | Shares the "required docs exist" invariant with `LEVEL_MATCH` |
| `PLACEHOLDER_FILLED` | Placeholder replacement (`[YOUR_VALUE_HERE]`, `{{...}}`, clarification tags) | `spec`, `plan`, `tasks`, `checklist`, `decision-record`, `implementation-summary` | direct | Template-authored content hygiene |
| `SECTIONS_PRESENT` | Coarse required heading families by keyword | `spec`, `plan`, `checklist`, `decision-record` | duplicate_coverage | Overlaps with exact header enforcement from `TEMPLATE_HEADERS` |
| `TEMPLATE_HEADERS` | Exact template H1/H2 order and checklist CHK format | `spec`, `plan`, `tasks`, `implementation-summary`, `checklist`, `decision-record` | direct | Structural template contract |
| `TEMPLATE_SOURCE` | `<!-- SPECKIT_TEMPLATE_SOURCE: ... -->` provenance marker near top of file | `spec`, `plan`, `tasks`, `implementation-summary`, `checklist`, `decision-record` | direct | Live rule, but omitted from `show_help()` and the current `scripts/rules/README.md` inventory |
| `ANCHORS_VALID` | Required anchor IDs, ordering, and well-formed open/close pairs | `spec`, `plan`, `tasks`, `implementation-summary`, `checklist`, `decision-record`, `research/handover optional` | direct | Template anchor contract plus optional continuity docs |
| `FRONTMATTER_VALID` | YAML frontmatter parses cleanly | `spec`, `plan`, `tasks`, `implementation-summary`, `checklist`, `decision-record` | direct | Syntax only, not semantic completeness |
| `FRONTMATTER_MEMORY_BLOCK` | `_memory.continuity` presence and compact schema | `spec`, `plan`, `tasks`, `implementation-summary`, `checklist`, `decision-record`, `research/handover optional` | direct | Covers packet pointer, timestamps, key files, fingerprint format, and budget |
| `CONTINUITY_FRESHNESS` | `_memory.continuity.last_updated_at` freshness relative to `graph-metadata.json` | `implementation-summary` + `generated/operational only` | hybrid | Touches one authored packet type plus generated metadata |
| `SPEC_DOC_SUFFICIENCY` | Minimum substance in key anchors (`what-built`, `verification`, ADR/research anchors) | `spec`, `plan`, `tasks`, `implementation-summary`, `checklist`, `decision-record`, `research/handover optional` | direct | Content sufficiency, not just shape |
| `EVIDENCE_CITED` | Completed-item evidence citations | `tasks`, `checklist` | direct | Adjacent rule still documented in help, but not part of the packet's earlier 21-rule review surface |
| `EVIDENCE_MARKER_LINT` | `[EVIDENCE: ...]` bracket syntax integrity | `spec`, `plan`, `tasks`, `implementation-summary`, `checklist`, `decision-record`, `research/handover optional` | partial | Marker syntax only; does not prove the evidence is semantically sufficient |
| `PRIORITY_TAGS` | Checklist priority framing (`P0/P1/P2`) | `checklist` | direct | Checklist-only contract |
| `LEVEL_DECLARED` | Explicit vs inferred level metadata | `spec`, `checklist` | duplicate_coverage | Reports declaration source but does not enforce all implied files alone |
| `LEVEL_MATCH` | Declared level consistency and implied required-file set | `spec`, `checklist`, plus required docs implied by level | duplicate_coverage | Shares required-doc invariant with `FILE_EXISTS` |
| `SECTION_COUNTS` | Section-count heuristics against expected ranges | `spec`, `plan`, `tasks`, `implementation-summary`, `checklist`, `decision-record` | duplicate_coverage | Secondary structural signal next to `TEMPLATE_HEADERS` and `SECTIONS_PRESENT` |
| `TOC_POLICY` | Forbids table-of-contents headings in core packet docs | `spec`, `plan`, `tasks`, `implementation-summary`, `checklist`, `decision-record`, `research/handover optional` | direct | Negative structural invariant |
| `SPEC_DOC_INTEGRITY` | Inline markdown references, `Spec Folder` metadata, handover resume targets | `spec`, `plan`, `tasks`, `implementation-summary`, `checklist`, `decision-record`, `research/handover optional` | direct | Packet-document cross-reference integrity |
| `PHASE_LINKS` | Parent/child phase references and predecessor/successor chaining | `phase-parent-spec`, `phase-child-spec` | direct | Phase packets only |
| `AI_PROTOCOLS` | Required AI execution protocol sections for governed packets | `spec`, `plan`, `tasks`, `checklist` in L3+ packets | direct | Governed packet addendum, not baseline L1/L2 |
| `COMPLEXITY_MATCH` | Level vs content-complexity fit | packet as a whole (`spec`-led) | indirect | Folder-level contract rather than one field |
| `FOLDER_NAMING` | `NNN-short-name` packet slug pattern | packet folder path only | indirect | Naming invariant, not doc field |
| `GRAPH_METADATA_PRESENT` | `graph-metadata.json` presence and schema shape | `generated/operational only` | orphan_rule | No authored template target |
| `LINKS_VALID` | Wiki-link validity across skill markdown trees | `generated/operational only` | orphan_rule | Repo-scope scan, not packet-template enforcement |
| `NORMALIZER_LINT` | Local forbidden normalizer/helper declarations | `generated/operational only` | orphan_rule | Code-hygiene rule outside packet docs |
| `MERGE_LEGALITY` | Merge-plan legality against target anchors and merge mode | `generated/operational only` | orphan_rule | Runtime payload validation only |
| `CROSS_ANCHOR_CONTAMINATION` | Routed payload belongs in the target continuity/doc bucket | `generated/operational only` | orphan_rule | Runtime routing payload validation only |
| `POST_SAVE_FINGERPRINT` | Post-save snapshot/fingerprint matches live target file | `generated/operational only` | orphan_rule | Save-time runtime validation only |

## Mismatch Classification

### 1. `orphan_rule` (6 rules)

These rules have no authored template target and should not be counted as template-field coverage:

- `GRAPH_METADATA_PRESENT`
- `LINKS_VALID`
- `NORMALIZER_LINT`
- `MERGE_LEGALITY`
- `CROSS_ANCHOR_CONTAMINATION`
- `POST_SAVE_FINGERPRINT`

### 2. `orphan_field` (9 field groups)

These template-authored fields still lack a dedicated live validator:

- Shared frontmatter semantics: `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`
- Continuity bookkeeping semantics in `_memory.continuity`: `completion_pct`, `open_questions`, `answered_questions`
- Comment metadata without a dedicated rule: `HVR_REFERENCE`

### 3. `duplicate_coverage` (4 invariant groups)

These invariants are enforced by more than one rule, but with different granularity:

- Required document set: `FILE_EXISTS` + `LEVEL_MATCH`
- Template structure: `TEMPLATE_HEADERS` + `SECTIONS_PRESENT` + `SECTION_COUNTS`
- Level declaration/reporting: `LEVEL_DECLARED` + `LEVEL_MATCH`
- Continuity state: `FRONTMATTER_MEMORY_BLOCK` + `CONTINUITY_FRESHNESS`

### 4. `unenforced_invariant` (3 remediation groups)

These are real, operator-visible contracts that remain under-enforced:

- Shared frontmatter semantics across all six canonical packet docs
- `_memory.continuity` bookkeeping semantics inside `implementation-summary.md`
- Human-voice reference markers such as `HVR_REFERENCE` in authored templates

### Proposed Change Impact

| Proposed change | Why it matters | Affected packet types / counts |
| --- | --- | --- |
| Document `TEMPLATE_SOURCE` as a first-class live rule in help + rule inventory + review prompts | Removes false orphan-field reporting for template provenance | 6 canonical packet types |
| Add semantic validation for shared frontmatter fields (`title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`) | Converts the most visible orphan fields into owned contract | 6 canonical packet types |
| Add semantic validation for continuity bookkeeping (`completion_pct`, `open_questions`, `answered_questions`) | Closes the remaining authored continuity gap | 1 canonical packet type (`implementation-summary`) |
| Split operational/runtime guards out of "template coverage" reporting | Prevents over-claiming template enforcement | 0 authored packet types, 6 operational rules |

## New Findings

### P2-003 [P2] `TEMPLATE_SOURCE` is a live template-contract rule but remains absent from the published validator inventory

- Files: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, `.opencode/skill/system-spec-kit/scripts/rules/README.md`, `.opencode/skill/system-spec-kit/scripts/rules/check-template-source.sh`, `.opencode/skill/system-spec-kit/assets/template_mapping.md`
- Evidence: The default dispatcher still executes every `check-*.sh` script, and `check-template-source.sh` enforces provenance markers across all six canonical packet docs. The template inventory confirms those markers exist in the shipped templates, but `show_help()` and the current rule README still describe a smaller validator inventory and therefore misstate the live documentation contract.
- Impact: Coverage reports that follow the published validator inventory undercount a real template rule, and review packets can incorrectly classify provenance enforcement as missing.
- Recommendation: Promote `TEMPLATE_SOURCE` into the canonical operator-facing rule inventory everywhere the validator surface is documented, or explicitly mark packet review prompts as using a narrower audit subset than the live dispatcher.

### No New P0 Findings

- No release-blocking documentation regressions were discovered in this pass.

### No New P1 Findings

- The existing `P1-001` help-vs-dispatch mismatch remains the highest-severity issue and is reinforced, not superseded, by this iteration.

## Traceability Checks

- `live_dispatch_surface_reconciled`: PASS. The coverage matrix now follows the live dispatcher instead of the narrower packet prompt surface.
- `template_provenance_reclassified`: PASS. `SPECKIT_TEMPLATE_SOURCE` moved from "orphan field" to "direct rule target" based on live enforcement evidence.
- `help_and_readme_semantics_gap`: FAIL. `show_help()` and `scripts/rules/README.md` still omit live rule coverage and therefore remain non-authoritative.
- `packet_type_counts_established`: PASS. Proposed changes now carry explicit packet-type counts.
- `mismatch_taxonomy_completed`: PASS. `orphan_rule`, `orphan_field`, `duplicate_coverage`, and `unenforced_invariant` are all explicit and counted.

## Verdict

- `CONDITIONAL`

The documentation-side coverage matrix is now complete enough to support remediation planning, but the validator's published contract is still not authoritative because the live dispatcher, help text, README inventory, and packet prompt pack do not describe the same rule surface.

## Next Dimension

- `traceability`
- Planned focus: reconcile the packet prompt pack, `show_help()`, `scripts/rules/README.md`, and the live dispatcher into one canonical inventory so future review packets stop drifting on rule counts and provenance coverage.
