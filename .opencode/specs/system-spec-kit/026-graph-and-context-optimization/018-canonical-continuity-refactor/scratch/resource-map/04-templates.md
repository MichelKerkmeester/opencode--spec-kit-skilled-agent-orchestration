---
title: "Phase 018 Resource Map — Templates & Validator Rules"
surface: templates
agent: resmap-D
worker: cli-codex gpt-5.4 high fast
timestamp: 2026-04-11T14:09:35Z
scan_roots:
  - .opencode/skill/system-spec-kit/templates/
  - .opencode/skill/system-spec-kit/scripts/spec/validate.sh
rows: 30
---

Scope note: this map stays inside template and validator surfaces. Where phase 018 depends on `create.sh`, save handlers, or runtime merge logic, those are called out only as dependencies, not audited targets here.

| # | path | kind | level | purpose | phase_018_action | verb | effort | depends_on |
|---|---|---|---|---|---|---|---|---|
| 1 | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | validator-script | N/A | Public validator orchestrator and rule surface | Register `FRONTMATTER_MEMORY_BLOCK`, `MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `CROSS_ANCHOR_CONTAMINATION`, `POST_SAVE_FINGERPRINT`; expand `ANCHORS_VALID` expectations | `validate` | L | Node validator bridge, rule help text, JSON output |
| 2 | `.opencode/skill/system-spec-kit/templates/core/{spec-core.md,plan-core.md,tasks-core.md,impl-summary-core.md}` | template | core | Base anchor contracts inherited by all final level templates | Add `_memory.continuity` frontmatter skeleton to core files and keep canonical anchor order authoritative | `add-frontmatter-field` | L | validate.sh, composed level templates |
| 3 | `.opencode/skill/system-spec-kit/templates/addendum/level2-verify/{spec-level2.md,plan-level2.md}` | addendum | 2 | Level 2 additions for NFR, edge-case, and rollback/effort content | Preserve current anchors and make addendum output legal merge destinations once composed into final templates | `sync` | M | core templates, level_2 templates |
| 4 | `.opencode/skill/system-spec-kit/templates/addendum/level2-verify/checklist.md` | addendum | 2 | Source checklist anchor contract for verification flow | Keep current checklist anchors stable and add frontmatter memory block at template level | `add-frontmatter-field` | S | level_2/3/3+ checklist outputs |
| 5 | `.opencode/skill/system-spec-kit/templates/addendum/level3-arch/{spec-level3.md,plan-level3.md}` | addendum | 3 | Architecture and planning extensions for Level 3 | Preserve executive-summary / plan anchors and ensure composed Level 3 merge targets remain legal | `sync` | M | core templates, level_3 templates |
| 6 | `.opencode/skill/system-spec-kit/templates/addendum/level3-arch/decision-record.md` | addendum | 3 | Canonical ADR anchor skeleton | Add frontmatter memory block without breaking `adr-NNN-*` anchor family | `add-frontmatter-field` | S | level_3 and level_3+ decision-record outputs |
| 7 | `.opencode/skill/system-spec-kit/templates/addendum/level3plus-govern/{spec-level3plus.md,plan-level3plus.md}` | addendum | 3+ | Governance and coordination sections for Level 3+ | Preserve governance sections but promote them to explicit mergeable anchors in final 3+ outputs | `add-anchor` | M | level_3+/spec.md, level_3+/plan.md |
| 8 | `.opencode/skill/system-spec-kit/templates/addendum/level3plus-govern/checklist-extended.md` | addendum | 3+ | Governance checklist extension | Keep current sign-off/compliance anchors stable and add frontmatter memory block at template level | `add-frontmatter-field` | S | level_3+/checklist.md |
| 9 | `.opencode/skill/system-spec-kit/templates/level_1/spec.md` | template | 1 | Final Level 1 spec contract | Add `_memory.continuity` block and keep existing spec anchor order as merge targets | `add-frontmatter-field` | M | core/spec-core.md, `ANCHORS_VALID`, `MERGE_LEGALITY` |
| 10 | `.opencode/skill/system-spec-kit/templates/level_1/plan.md` | template | 1 | Final Level 1 plan contract | Add `_memory.continuity` block and protect phase/testing/dependency anchors for merge-time writes | `add-frontmatter-field` | M | core/plan-core.md, `MERGE_LEGALITY` |
| 11 | `.opencode/skill/system-spec-kit/templates/level_1/tasks.md` | template | 1 | Final Level 1 task contract | Add `_memory.continuity` block and preserve `notation/phase-1/phase-2/phase-3/completion/cross-refs` targetability | `add-frontmatter-field` | M | core/tasks-core.md, `MERGE_LEGALITY` |
| 12 | `.opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md` | template | 1 | Final Level 1 canonical closeout doc | Keep the existing 6-anchor contract and make packet creation treat this file as required up front | `add-frontmatter-field` | M | core/impl-summary-core.md, packet creation flow |
| 13 | `.opencode/skill/system-spec-kit/templates/level_2/spec.md` | template | 2 | Final Level 2 spec contract | Add continuity block and preserve `nfr/edge-cases/complexity` anchors as legal destinations | `add-frontmatter-field` | M | addendum/level2-verify/spec-level2.md |
| 14 | `.opencode/skill/system-spec-kit/templates/level_2/plan.md` | template | 2 | Final Level 2 plan contract | Add continuity block and keep L2 phase/effort/rollback anchors merge-safe | `add-frontmatter-field` | M | addendum/level2-verify/plan-level2.md |
| 15 | `.opencode/skill/system-spec-kit/templates/level_2/tasks.md` | template | 2 | Final Level 2 task contract | Add continuity block only; anchor family already matches Level 1 task contract | `add-frontmatter-field` | S | core/tasks-core.md |
| 16 | `.opencode/skill/system-spec-kit/templates/level_2/checklist.md` | template | 2 | Final Level 2 checklist contract | Add continuity block and keep 8 checklist anchors as save-time legal targets | `add-frontmatter-field` | M | addendum/level2-verify/checklist.md |
| 17 | `.opencode/skill/system-spec-kit/templates/level_2/implementation-summary.md` | template | 2 | Final Level 2 closeout doc | Keep the 6-anchor implementation-summary contract and enforce creation-time existence | `add-frontmatter-field` | M | core/impl-summary-core.md, packet creation flow |
| 18 | `.opencode/skill/system-spec-kit/templates/level_3/spec.md` | template | 3 | Final Level 3 spec contract | Repair the missing opening `metadata` anchor, add continuity block, and keep L3 anchor set merge-safe | `fix` | M | core/addendum composition, `ANCHORS_VALID` |
| 19 | `.opencode/skill/system-spec-kit/templates/level_3/plan.md` | template | 3 | Final Level 3 plan contract | Add continuity block; anchor family is already rich enough for merge legality | `add-frontmatter-field` | M | addendum/level3-arch/plan-level3.md |
| 20 | `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md` | template | 3 | Final Level 3 ADR contract | Add continuity block while preserving nested `adr-001-*` anchors and ADR insertion semantics | `add-frontmatter-field` | M | addendum/level3-arch/decision-record.md, `MERGE_LEGALITY` |
| 21 | `.opencode/skill/system-spec-kit/templates/level_3/checklist.md` | template | 3 | Final Level 3 checklist contract | Add continuity block; current checklist anchor inventory is already phase-018-ready | `add-frontmatter-field` | S | addendum/level2-verify/checklist.md, extended checklist sections |
| 22 | `.opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md` | template | 3 | Final Level 3 canonical closeout doc | Keep the 6-anchor invariant and add continuity block only | `add-frontmatter-field` | S | core/impl-summary-core.md |
| 23 | `.opencode/skill/system-spec-kit/templates/level_3+/spec.md` | template | 3+ | Final Level 3+ governance spec contract | Repair missing opening `metadata` anchor, split governance sections into explicit anchors, add continuity block | `add-anchor` | L | addendum/level3plus-govern/spec-level3plus.md, `ANCHORS_VALID` |
| 24 | `.opencode/skill/system-spec-kit/templates/level_3+/plan.md` | template | 3+ | Final Level 3+ orchestration plan contract | Add continuity block; current AI/workstream/communication anchors are already mergeable | `add-frontmatter-field` | M | addendum/level3plus-govern/plan-level3plus.md |
| 25 | `.opencode/skill/system-spec-kit/templates/level_3+/decision-record.md` | template | 3+ | Final Level 3+ ADR contract | Add continuity block while preserving nested ADR anchor family | `add-frontmatter-field` | M | addendum/level3-arch/decision-record.md |
| 26 | `.opencode/skill/system-spec-kit/templates/level_3+/checklist.md` | template | 3+ | Final Level 3+ verification/governance checklist | Add continuity block only; anchor coverage is already explicit | `add-frontmatter-field` | S | addendum/level3plus-govern/checklist-extended.md |
| 27 | `.opencode/skill/system-spec-kit/templates/level_3+/implementation-summary.md` | template | 3+ | Final Level 3+ canonical closeout doc | Keep the 6-anchor invariant and add continuity block only | `add-frontmatter-field` | S | core/impl-summary-core.md |
| 28 | `.opencode/skill/system-spec-kit/templates/{handover.md,research.md,debug-delegation.md}` | template | N/A | Continuation, research, and escalation docs used outside the numbered level folders | Add frontmatter memory block and introduce explicit anchors before merge-time writes are allowed | `add-anchor` | L | `ANCHORS_VALID`, `MERGE_LEGALITY`, save router policy |
| 29 | `.opencode/skill/system-spec-kit/templates/context_template.md` | template | N/A | Existing compact continuity wrapper for saved memory context | Cross-check field naming against `_memory.continuity`; reuse compact language rules, not the full schema | `sync` | M | iteration 005, iteration 024, save pipeline |
| 30 | `.opencode/skill/system-spec-kit/templates/changelog/{root.md,phase.md}` | changelog-template | N/A | Packet and phase changelog outputs | Decide whether changelog templates are continuity-enabled or explicitly exempt from `FRONTMATTER_MEMORY_BLOCK` | `validate` | S | validator scope boundary, nested changelog workflow |

## Anchor Inventory

| name | ID | level | owner |
|---|---|---|---|
| `core/spec-core.md` | `metadata`, `problem`, `scope`, `requirements`, `success-criteria`, `risks`, `questions` | core | core |
| `core/plan-core.md` | `summary`, `quality-gates`, `architecture`, `phases`, `testing`, `dependencies`, `rollback` | core | core |
| `core/tasks-core.md` | `notation`, `phase-1`, `phase-2`, `phase-3`, `completion`, `cross-refs` | core | core |
| `core/impl-summary-core.md` | `metadata`, `what-built`, `how-delivered`, `decisions`, `verification`, `limitations` | core | core |
| `level_1/spec.md` | `metadata`, `problem`, `scope`, `requirements`, `success-criteria`, `risks`, `questions` | 1 | final-template |
| `level_1/plan.md` | `summary`, `quality-gates`, `architecture`, `phases`, `testing`, `dependencies`, `rollback` | 1 | final-template |
| `level_1/tasks.md` | `notation`, `phase-1`, `phase-2`, `phase-3`, `completion`, `cross-refs` | 1 | final-template |
| `level_1/implementation-summary.md` | `metadata`, `what-built`, `how-delivered`, `decisions`, `verification`, `limitations` | 1 | final-template |
| `level_2/spec.md` | `metadata`, `problem`, `scope`, `requirements`, `success-criteria`, `risks`, `questions`, `nfr`, `edge-cases`, `complexity` | 2 | final-template |
| `level_2/plan.md` | `summary`, `quality-gates`, `architecture`, `phases`, `testing`, `dependencies`, `rollback`, `phase-deps`, `effort`, `enhanced-rollback` | 2 | final-template |
| `level_2/tasks.md` | `notation`, `phase-1`, `phase-2`, `phase-3`, `completion`, `cross-refs` | 2 | final-template |
| `level_2/checklist.md` | `protocol`, `pre-impl`, `code-quality`, `testing`, `security`, `docs`, `file-org`, `summary` | 2 | final-template |
| `level_2/implementation-summary.md` | `metadata`, `what-built`, `how-delivered`, `decisions`, `verification`, `limitations` | 2 | final-template |
| `level_3/spec.md` | `problem`, `scope`, `requirements`, `success-criteria`, `risks`, `questions` plus orphan closing `metadata` anchor | 3 | final-template |
| `level_3/plan.md` | `summary`, `quality-gates`, `architecture`, `phases`, `testing`, `dependencies`, `rollback`, `phase-deps`, `effort`, `enhanced-rollback`, `dependency-graph`, `critical-path`, `milestones` | 3 | final-template |
| `level_3/decision-record.md` | `adr-001`, `adr-001-context`, `adr-001-decision`, `adr-001-alternatives`, `adr-001-consequences`, `adr-001-five-checks`, `adr-001-impl` | 3 | final-template |
| `level_3/checklist.md` | `protocol`, `pre-impl`, `code-quality`, `testing`, `security`, `docs`, `file-org`, `summary`, `arch-verify`, `perf-verify`, `deploy-ready`, `compliance-verify`, `docs-verify`, `sign-off` | 3 | final-template |
| `level_3/implementation-summary.md` | `metadata`, `what-built`, `how-delivered`, `decisions`, `verification`, `limitations` | 3 | final-template |
| `level_3+/spec.md` | `problem`, `scope`, `requirements`, `success-criteria`, `risks`, `questions` plus orphan closing `metadata` anchor; governance sections are currently unanchored inside `questions` | 3+ | final-template |
| `level_3+/plan.md` | `summary`, `quality-gates`, `architecture`, `phases`, `testing`, `dependencies`, `rollback`, `phase-deps`, `effort`, `enhanced-rollback`, `dependency-graph`, `critical-path`, `milestones`, `ai-execution`, `workstreams`, `communication` | 3+ | final-template |
| `level_3+/decision-record.md` | `adr-001`, `adr-001-context`, `adr-001-decision`, `adr-001-alternatives`, `adr-001-consequences`, `adr-001-five-checks`, `adr-001-impl` | 3+ | final-template |
| `level_3+/checklist.md` | `protocol`, `pre-impl`, `code-quality`, `testing`, `security`, `docs`, `file-org`, `summary`, `arch-verify`, `perf-verify`, `deploy-ready`, `compliance-verify`, `docs-verify`, `sign-off` | 3+ | final-template |
| `level_3+/implementation-summary.md` | `metadata`, `what-built`, `how-delivered`, `decisions`, `verification`, `limitations` | 3+ | final-template |
| `handover.md` | `(none)` | N/A | special-template |
| `research.md` | `(none)` | N/A | special-template |
| `debug-delegation.md` | `(none)` | N/A | special-template |
| `context_template.md` | `preflight`, `continue-session`, `canonical-docs`, `overview`, `evidence`, `recovery-hints`, `postflight`, `metadata` | N/A | memory-template |
| `changelog/root.md` | `(none)` | N/A | changelog-template |
| `changelog/phase.md` | `(none)` | N/A | changelog-template |
| `sharded/spec-index.md` | `(none)` | N/A | sharded-template |
| `sharded/01-overview.md` | `(none)` | N/A | sharded-template |
| `sharded/02-requirements.md` | `(none)` | N/A | sharded-template |
| `sharded/03-architecture.md` | `(none)` | N/A | sharded-template |
| `sharded/04-testing.md` | `(none)` | N/A | sharded-template |
| `examples/level_1/*.md` | Mirrors Level 1 anchor families with filled example content | 1 | example |
| `examples/level_2/*.md` | Mirrors Level 2 anchor families with filled example content | 2 | example |
| `examples/level_3/*.md` | Uses richer filled anchors such as `executive-summary`, `risk-matrix`, `user-stories`, plus extra impl-summary anchors beyond the canonical 6 | 3 | example |
| `examples/level_3+/*.md` | Uses richer governance anchors such as `executive-summary`, `metadata`, `nfr`, `edge-cases`, `complexity`, approval/compliance/stakeholder sections | 3+ | example |

## Observed Frontmatter Baseline

| surface | current frontmatter keys | phase 018 delta |
|---|---|---|
| `level_1/2/3/3+/*.md` | `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType` | Add reserved `_memory` block with `_memory.continuity` sub-block |
| `core/*.md` | `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType` | Same `_memory` block so composed outputs inherit it cleanly |
| `addendum/**/*.md` | `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType` | Decide whether addenda carry `_memory` directly or remain source-only helpers |
| `context_template.md` | Current memory-specific metadata plus source/session counters | Map wording and compactness constraints into `_memory.continuity` validation |
| `handover.md` / `research.md` / `debug-delegation.md` | Same 5-key baseline as numbered templates | Add `_memory` plus explicit anchors before merge-time writes are safe |
| `changelog/*.md` | Same 5-key baseline as numbered templates | Either add `_memory` or exempt changelog outputs from memory-block validation |
| `sharded/*.md` | Same 5-key baseline as numbered templates | If sharded specs join merge flows, they need anchors plus `_memory` |

## New Frontmatter Fields Required

The `_memory.continuity` sub-block should carry this phase-018 schema:

| field | required | rule summary |
|---|---|---|
| `packet_pointer` | yes | Relative packet path only; no absolute paths, `..`, or backslashes |
| `last_updated_at` | yes | ISO-8601 timestamp normalized to `YYYY-MM-DDTHH:MM:SSZ` |
| `last_updated_by` | yes | Actor slug matching `^[a-z0-9][a-z0-9._-]{1,63}$` |
| `recent_action` | yes | Single-line compact status phrase, 1-96 chars, non-narrative |
| `next_safe_action` | yes | Single-line imperative or status-verb phrase, 1-96 chars |
| `blockers` | no | Up to 5 unique compact strings; blanks normalize to `[]` |
| `key_files` | no | Up to 5 repo-relative paths; no absolute paths or `..` |
| `session_dedup` | no | Object present only when dedup state is needed |
| `session_dedup.fingerprint` | conditional | `sha256:<64-hex>` |
| `session_dedup.session_id` | conditional | Session identifier slug |
| `session_dedup.parent_session_id` | no | Null or prior session id; may not exist without `session_id` |
| `completion_pct` | no | Integer `0..100`; strict mode rejects incoherent `100` values |
| `open_questions` | no | Up to 12 `QNNN` tokens, sorted numerically |
| `answered_questions` | no | Up to 12 `QNNN` tokens, sorted numerically and disjoint from `open_questions` |

Guardrails from iteration 005 and iteration 024:

- Serialized `_memory.continuity` must stay at or below 2048 UTF-8 bytes after normalization.
- The block is a compact wrapper, not a narrative surface.
- Missing legacy fields may hydrate defaults during backfill, but malformed new writes fail closed.

## New Validator Rules

| rule | status in phase 018 | what it enforces |
|---|---|---|
| `ANCHORS_VALID` | existing, expanded | Syntax, pairing, order, and required-anchor coverage; now explicitly includes the 6 implementation-summary anchors |
| `FRONTMATTER_MEMORY_BLOCK` | new | `_memory` presence/shape, required subkeys, continuity completeness, and size budget warnings |
| `MERGE_LEGALITY` | new | Only legal merge modes can write to a given anchor, table, checklist block, ADR region, or `_memory.*` field |
| `SPEC_DOC_SUFFICIENCY` | new spec-doc-structure rule | Anchor-body sufficiency and evidence minimums |
| `CROSS_ANCHOR_CONTAMINATION` | new spec-doc-structure rule | Detects content routed to the wrong anchor or a `drop` outcome |
| `POST_SAVE_FINGERPRINT` | new | Re-read-after-write fingerprint verification with rollback on mismatch |

## validate.sh Baseline Today

- Help text currently advertises `FILE_EXISTS`, `PLACEHOLDER_FILLED`, `SECTIONS_PRESENT`, `LEVEL_DECLARED`, `PRIORITY_TAGS`, `EVIDENCE_CITED`, `ANCHORS_VALID`, `TOC_POLICY`, `PHASE_LINKS`, and `SPEC_DOC_INTEGRITY`.
- Severity aliases already exist for `FILE_EXISTS`, `PLACEHOLDER_FILLED`, `SECTIONS_PRESENT`, `LEVEL_DECLARED`, `PRIORITY_TAGS`, `EVIDENCE_CITED`, and `ANCHORS_VALID`.
- `ANCHORS_VALID` is already treated as an error-class rule in the shell surface.
- `SPECKIT_RULES` already supports rule-subset execution, so the new phase-018 rules can plug into an existing selective-validation path.
- `RULE_ORDER` already exists, but it is empty by default and config/env-driven; phase 018 can use that hook for the new spec-doc ordering from iteration 022.
- `validate.sh` is still the public orchestrator, not the structural parser; iteration 022 points to a Node/TS implementation layer behind it.
- No current shell help or rule alias mentions `FRONTMATTER_MEMORY_BLOCK`, `MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `CROSS_ANCHOR_CONTAMINATION`, or `POST_SAVE_FINGERPRINT`.
- The phase-018 validator work therefore needs both implementation and shell-surface exposure, not just hidden rule internals.

## Validator Cross-Reference Matrix

| surface | high-risk validator coverage |
|---|---|
| `implementation-summary.md` | `ANCHORS_VALID`, `MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `POST_SAVE_FINGERPRINT` |
| `decision-record.md` | `ANCHORS_VALID`, `MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `POST_SAVE_FINGERPRINT` |
| `tasks.md` | `ANCHORS_VALID`, `MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `CROSS_ANCHOR_CONTAMINATION` |
| `checklist.md` | `ANCHORS_VALID`, `MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `CROSS_ANCHOR_CONTAMINATION` |
| `spec.md` | `ANCHORS_VALID`, `MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `FRONTMATTER_MEMORY_BLOCK` |
| `plan.md` | `ANCHORS_VALID`, `MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `FRONTMATTER_MEMORY_BLOCK` |
| `handover.md` | `ANCHORS_VALID`, `MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `FRONTMATTER_MEMORY_BLOCK` |
| `research.md` | `ANCHORS_VALID`, `MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `FRONTMATTER_MEMORY_BLOCK` |
| `debug-delegation.md` | `ANCHORS_VALID`, `MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `FRONTMATTER_MEMORY_BLOCK` |
| `context_template.md` | `FRONTMATTER_MEMORY_BLOCK`, `POST_SAVE_FINGERPRINT` reference surface only |
| `changelog/*.md` | Scope decision required: either `FRONTMATTER_MEMORY_BLOCK` exempt or anchorless output must remain out of merge/save targets |
| `sharded/*.md` | Scope decision required: if sharded specs join merge flows, they first need anchors and legal target definitions |

## Current Gaps Needing Anchor Additions

- `level_3/spec.md` has a closing `metadata` anchor without an opening anchor.
- `level_3+/spec.md` has the same missing opening `metadata` anchor.
- `level_3+/spec.md` currently leaves approval/compliance/stakeholder/changelog sections unanchored.
- `handover.md` has no anchors today, so merge-time writes would have no legal target.
- `research.md` has no anchors today, despite being a likely target for routed research content.
- `debug-delegation.md` has no anchors today, despite being a structured escalation artifact.
- `changelog/root.md` and `changelog/phase.md` are anchorless and need either explicit exemption or explicit anchors.
- `sharded/spec-index.md` and `sharded/0*.md` files are anchorless and would need a separate legality contract before inclusion.
- Example templates already show richer anchor vocabularies than the canonical level templates, so example sync will be required after contract changes.

## Template Contract Impact Per Level

**Level 1**
Level 1 is the cleanest starting point because its canonical anchor families already exist in all four required files. Phase 018 mainly adds the `_memory.continuity` block to `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md`, then treats `implementation-summary.md` as required at packet creation time instead of a late closeout artifact. The merge contract stays simple because all write targets already map to distinct anchors.

**Level 2**
Level 2 inherits the Level 1 continuity block changes and extends merge legality into the added `nfr`, `edge-cases`, `complexity`, `phase-deps`, `effort`, `enhanced-rollback`, and checklist anchors. This level is where the validator starts needing sharper shape checks for tables, checklists, and rollback sections, but the existing anchor inventory is already explicit enough to support that work.

**Level 3**
Level 3 is where the phase-018 contract stops being purely additive. The final `spec.md` currently has an anchor defect around `metadata`, so that needs repair before the new rules can safely treat the file as a merge target. After that fix, Level 3 mostly needs continuity block insertion plus ADR-aware merge legality so `insert-new-adr` and related writes stay bounded to `adr-NNN-*` regions.

**Level 3+**
Level 3+ needs the most template work. In addition to the same missing `metadata` opening anchor seen in Level 3, the governance sections in `spec.md` are currently unanchored, which means phase 018 cannot legally route writes into approval, compliance, stakeholder, or changelog areas without adding anchors first. The plan and checklist surfaces are already better prepared, so most of the incremental work is concentrated in `spec.md` plus the continuity block and validator policy decisions for governance-heavy flows.

## UNCERTAIN

- Whether `addendum/**/*.md` should receive `_memory` blocks directly or remain source-only composition inputs with the memory block added only in final level templates.
- Whether changelog templates should be continuity-enabled or explicitly exempt from `FRONTMATTER_MEMORY_BLOCK`.
- Whether sharded spec templates are in scope for phase-018 merge routing, or just need a documented exemption.
- Whether `handover.md`, `research.md`, and `debug-delegation.md` should adopt the same anchor vocabulary as numbered templates or get smaller specialized anchor sets.
- Whether example templates are validator-scoped fixtures that must stay in strict sync, or illustrative references that can lag one phase behind.
- Whether implementation-summary creation-time invariance will be enforced only through validator/create tooling or also through template metadata checks.
