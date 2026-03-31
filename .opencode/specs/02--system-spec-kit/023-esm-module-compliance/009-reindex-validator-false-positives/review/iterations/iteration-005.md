# Iteration 005 — Maintainability: Code Quality

## P0

None.

## P1

### 1. Context-type policy is duplicated and already inconsistent across code paths

- **File:** `scripts/lib/frontmatter-migration.ts`, `scripts/extractors/session-extractor.ts`, `mcp_server/lib/parsing/memory-parser.ts`, `mcp_server/lib/search/intent-classifier.ts`, `mcp_server/lib/cognitive/fsrs-scheduler.ts`, `mcp_server/lib/validation/save-quality-gate.ts`
- **Lines:** `frontmatter-migration.ts:135-145, 824-845`; `session-extractor.ts:120-134`; `memory-parser.ts:108-124`; `intent-classifier.ts:197-205`; `fsrs-scheduler.ts:271-276, 383-397`; `save-quality-gate.ts:345-360`
- **Evidence:** The same `contextType` domain is encoded independently in at least six places, and the mappings have already drifted. The clearest mismatch is alias normalization: `frontmatter-migration.ts` maps `bug -> discovery`, while `memory-parser.ts` maps `bug -> implementation`. Other modules then layer their own hard-coded policy on top of that same domain: `session-extractor.ts` infers only `planning/research/implementation/general`, `intent-classifier.ts` hard-codes per-intent target context types, `fsrs-scheduler.ts` hard-codes decay behavior by context type, and `save-quality-gate.ts` hard-codes its planning-only exception check.
- **Impact:** This is no longer just theoretical duplication: the same semantic input can already normalize differently depending on whether it passes through migration code or MCP parsing code. The next context-type change now requires synchronized edits across multiple modules with different responsibilities, so missing one location will create subtle retrieval, decay, or validation regressions.
- **Recommendation:** Introduce one shared context-type policy module that owns canonical values, legacy alias normalization, document-type defaults, and helper predicates such as "planning-like" / "no-decay". Make all six call sites import that module, and add a parity test that asserts alias normalization and policy lookups stay consistent across ingestion, search, decay, and validation paths.

## P2

### 1. The legacy `decision` alias is only comment-documented and remains live in downstream policy code

- **File:** `scripts/lib/frontmatter-migration.ts`, `mcp_server/lib/parsing/memory-parser.ts`, `mcp_server/lib/cognitive/fsrs-scheduler.ts`, `mcp_server/lib/validation/save-quality-gate.ts`
- **Lines:** `frontmatter-migration.ts:1032-1046`; `memory-parser.ts:113-114`; `fsrs-scheduler.ts:272-273, 384-385`; `save-quality-gate.ts:351-353`
- **Evidence:** `frontmatter-migration.ts` explicitly says `"decision"` is a previous default and "is not a valid consumer value", but the parser still accepts `decision -> planning`, the decay scheduler still treats `decision` as a permanent no-decay context, and the save quality gate still allows `decision` to qualify for the planning-only exception path.
- **Impact:** The codebase has no single deprecation contract explaining whether `decision` is a temporary migration alias, a forever-supported synonym, or something scheduled for removal. That makes future maintenance error-prone because every new context-type policy branch has to remember to decide what to do with `decision` again.
- **Recommendation:** Document the alias lifecycle in one shared source of truth and normalize `decision` at ingress only. Downstream policy code should consume canonical `planning` values, with one explicit compatibility boundary and a regression test covering the alias until removal.

### 2. Spec-doc recognition is hard-coded to eight filenames, so new doc types silently fall back to `unknown`

- **File:** `scripts/lib/frontmatter-migration.ts`
- **Lines:** `110-119`, `646-665`
- **Evidence:** `SPEC_DOC_BASENAMES` contains exactly eight recognized spec-doc basenames, and `mapSpecDocType()` repeats the same list in a `switch`. Any new spec doc such as `architecture.md` will miss both lists and be classified as `unknown`.
- **Impact:** Adding a new spec-doc type requires remember-to-update maintenance in multiple places. If one list is missed, the new file quietly loses spec-doc-specific defaults like document type and default context inference, which is a classic maintainability trap.
- **Recommendation:** Replace the duplicated filename lists with a single spec-doc registry that drives basename detection, document-type mapping, and any validator/indexing exceptions. Back it with one test that fails whenever a new supported spec doc is added in only part of the pipeline.

## Checked items with no finding

### Force reindex warn-only

- **Finding:** None in the current workspace.
- **Evidence:** `validate-memory-quality.ts` still derives disposition solely from rule metadata and failed rules, returning `abort_write`, `write_skip_index`, or `write_and_index`. I did not find any `forceReindex`-specific path that downgrades failures to warn-only. See `scripts/lib/validate-memory-quality.ts:133-140, 588-609`.
- **Impact:** I could not verify the reported "force reindex uses warn-only for ALL files" behavior in the source snapshot I reviewed.
- **Recommendation:** If that behavior exists on another branch or in unstaged changes, review it separately; it is not present in the checked-in code I inspected here.

### V12 skip for unrecognized spec docs

- **Finding:** No direct V12 blocker was demonstrated in current code.
- **Evidence:** V12 is defined as index-blocking but not write-blocking (`blockOnWrite: false`, `blockOnIndex: true`), and the tests explicitly document that when the validator cannot resolve a backing `spec.md`, V12 passes rather than failing. See `scripts/lib/validate-memory-quality.ts:133-140, 588-609` and `scripts/tests/validation-rule-metadata.vitest.ts:57-100`.
- **Impact:** The demonstrated maintainability risk is the hard-coded spec-doc registry above, not a proven "new doc type will be silently blocked by V12" behavior in the current implementation.
- **Recommendation:** Keep the P2 registry fix above as the preventive measure; it reduces the chance of future validator/indexing drift when new spec-doc filenames are introduced.
