# Deep Review Findings: 004-graph-metadata-enrichment

## Verdict

**CONDITIONAL** — no P0 findings, **5 P1** findings, **1 P2** finding.

## Validation snapshot

- Audited **21** live `.opencode/skill/*/graph-metadata.json` files: all were `schema_version: 2`, all had `derived` blocks, and all `derived.key_files` paths resolved on disk.
- `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only` passed.
- `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --health` returned `status: ok` and `skill_graph_loaded: true`.
- `skill-graph.json` is **3958 bytes**; the regression fixture file currently has **44** lines/cases.

## Iteration log

| Iteration | Dimension | Outcome |
|---|---|---|
| 1 | correctness | Live corpus is already v2/derived-complete, but the packet still describes v1 barebones metadata as the current state. |
| 2 | completeness | The packet verifies only 20 targets, while the live metadata corpus contains 21 files. |
| 3 | consistency | The packet mixes `last_save_at` and `last_updated_at` as if both were canonical. |
| 4 | evidence-quality | The schema example cites a non-existent deep-review reference path. |
| 5 | path-accuracy | Example `source_docs`/`key_files` paths do not match the real sk-deep-review metadata corpus. |
| 6 | template-compliance | Strict Level 3 validation fails: missing `decision-record.md`, missing anchors/headers, incomplete AI protocol. |
| 7 | cross-reference-integrity | The packet's example metadata cross-references a dead file while the real skill metadata points to different documents. |
| 8 | metadata-quality | The packet's own `graph-metadata.json` is malformed and uses a glob in `derived.key_files`. |
| 9 | scope-alignment | The packet is framed as forward-looking implementation work even though the described enrichment already exists live. |
| 10 | actionability | Verification gates mention regression/size requirements but do not record the exact regression command in-packet. |

## Findings registry

### P1-01 — Packet is stale relative to the live metadata corpus

`spec.md` still states that every skill metadata file is a short `schema_version: 1` document missing all derived fields, and `plan.md` repeats that the current schema is still v1-only. The live corpus no longer matches that description: the reviewed metadata already contains schema version 2 documents with populated `derived` blocks, and validator/health checks pass. This makes the packet materially inaccurate and likely to drive redundant work.

**Evidence**
- [SOURCE: spec.md:49-90]
- [SOURCE: plan.md:33-55]
- [SOURCE: .opencode/skill/skill-advisor/graph-metadata.json:2-71]

### P1-02 — Verification scope omits the 21st live metadata file

The packet's tasks and checklist are written as exhaustive verification surfaces for **20** files only, but the live workspace now contains **21** metadata files under `.opencode/skill/*/graph-metadata.json`, including `.opencode/skill/skill-advisor/graph-metadata.json`. Because the packet never distinguishes "20 routed skills" from "21 metadata files total", an operator following this packet will under-audit the current corpus.

**Evidence**
- [SOURCE: tasks.md:44-84]
- [SOURCE: checklist.md:38-62]
- [SOURCE: .opencode/skill/skill-advisor/graph-metadata.json:1-73]

### P1-03 — Canonical schema example contains dead paths and inconsistent timestamp naming

The spec's example derived block references `.opencode/skill/sk-deep-review/references/deep-review-protocol.md` and `references/deep-review-protocol.md`, but the real sk-deep-review metadata points at `references/loop_protocol.md`, `references/convergence.md`, and `references/state_format.md`. The same example also describes timestamps as `created_at` and `last_save_at`, while the plan/checklist and the live metadata use `last_updated_at`. Copying the example would therefore generate inaccurate metadata.

**Evidence**
- [SOURCE: spec.md:73-80]
- [SOURCE: spec.md:134-145]
- [SOURCE: plan.md:65-75]
- [SOURCE: checklist.md:74-77]
- [SOURCE: .opencode/skill/sk-deep-review/graph-metadata.json:59-69]
- [SOURCE: .opencode/skill/sk-deep-review/graph-metadata.json:133-140]

### P1-04 — The packet's own `graph-metadata.json` is malformed

The packet metadata file is not shaped like a valid spec-packet graph metadata document: it lacks fields such as `schema_version` and `manual`, and its `derived.key_files` array includes a glob (`.opencode/skill/*/graph-metadata.json`) instead of concrete file paths. The strict spec validator reports this file as malformed, which means the packet is not reliably consumable by metadata-driven tooling.

**Evidence**
- [SOURCE: graph-metadata.json:1-19]
- [SOURCE: strict validator output for `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .../004-graph-metadata-enrichment --strict`]

### P1-05 — Level 3 packet fails the active template contract

The packet explicitly declares **Level 3**, but `decision-record.md` is missing and the strict validator reports missing anchors, missing required template headers, and an incomplete AI protocol block. This is not cosmetic drift: it leaves the packet non-compliant with the current retrieval/template contract and weakens structured review/resume flows.

**Evidence**
- [SOURCE: spec.md:23]
- [SOURCE: checklist.md:19-77]
- [SOURCE: strict validator output for `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .../004-graph-metadata-enrichment --strict`]

### P2-01 — Verification steps are not reproducible from the packet alone

The packet requires a 44/44 regression pass and size validation, but it never records the concrete regression command needed to reproduce that gate from the packet itself. The current workspace makes those checks inferable, not explicit: the compiled graph is 3958 bytes and the regression fixture file has 44 entries, yet the packet does not tell the next operator exactly how to rerun the suite.

**Evidence**
- [SOURCE: tasks.md:99-104]
- [SOURCE: checklist.md:57-62]

## Notes with no finding

- The requested runtime checks passed cleanly: all 21 live metadata files were `schema_version: 2`, all had `derived` blocks, and all `derived.key_files` paths existed.
- The compiled graph size is below the packet's stated 8 KB ceiling.
- No P0 correctness or security issue was found in the live metadata/compiler/advisor path during this review.
