---
title: "Root Review Report: 002-content-routing-accuracy"
description: "10-iteration deep review of 002-content-routing-accuracy and child phases 001-004. Verdict CONDITIONAL with 0 P0 / 3 P1 / 1 P2 findings."
importance_tier: "important"
contextType: "review-report"
---

# Root Review Report: 002-content-routing-accuracy

## 1. Overview

Ten iterations covered the live router/save runtime, Tier-3 end-to-end behavior, merge-mode handling, tests, doc/config mirrors, agent mirrors, and child-phase packet traceability. Verdict `CONDITIONAL`: the core phase-003 runtime fixes are present, but the current packet family still has one correctness regression in metadata-only continuity routing, one broad doc-alignment regression around removed Tier-3 flag wording, and one packet-verification regression where `001` to `003` still fail strict validation.

## 2. Findings

### P1-001 [P1] Metadata-only continuity can be written to a non-canonical host doc
- File: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1054`
- Evidence: `resolveMetadataHostDocPath()` prefers the current non-memory document when `spec-frontmatter` is targeted, but the canonical continuity contract says the primary `_memory.continuity` block lives in `implementation-summary.md` and the resume ladder reads that file first. Because `handleMemorySave()` accepts spec docs as direct inputs, a routed `metadata_only` save on `spec.md` or `tasks.md` can update continuity on a document the recovery ladder does not treat as canonical.
- Recommendation: Always target `implementation-summary.md` for `spec-frontmatter` when that file exists, and add a focused regression that saves metadata-only content through a non-memory spec doc input.

### P1-002 [P1] Removed Tier-3 flag wording still ships across the doc-alignment surfaces
- File: `.opencode/command/memory/save.md:93`
- Evidence: The runtime/config mirrors now describe Tier 3 as always on and the feature-flag reference marks `SPECKIT_TIER3_ROUTING` as removed, but `save.md`, `save_workflow.md`, the skill surface, the phase-004 packet docs, and the canonical save playbook still describe an opt-in/disabled-state path. That directly contradicts the stated post-flag-removal review scope and the current config notes.
- Recommendation: Remove the opt-in/default-off story everywhere it survives, then re-run the doc sweep against the primary docs, packet-local `004` docs, and the playbook mirror together.

### P1-003 [P1] Child phases 001-003 are still not strict-clean despite verified-looking closeout state
- File: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/001-fix-delivery-progress-confusion/tasks.md:6`
- Evidence: `001`, `002`, and `003` mark their task lists complete and record `completion_pct: 100`, but rerunning `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <phase> --strict` on 2026-04-13 fails all three phases with the same structural problems: missing required anchors, missing `_memory` frontmatter blocks, missing template-source headers, and missing Level-2 template headers. That means the packet docs are not actually verified to the standard their closeout artifacts imply.
- Recommendation: Re-open the child packet docs, bring them onto the current Level-2 template contract, and only then restate completion/verification status.

### P2-001 [P2] The phase-004 verification sweep did not actually guard the removed-flag semantics it claimed to cover
- File: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/004-doc-surface-alignment/implementation-summary.md:116`
- Evidence: The recorded `rg` sweep checked routing tokens like `routeAs`, `8-category`, and `packet_kind`, but it did not directly assert the removed-flag/always-on wording. The playbook still contains `SPECKIT_TIER3_ROUTING=true`, so the sweep was too weak to prove the contract it claimed to verify.
- Recommendation: Add an explicit verification token for removed-flag/always-on wording or a targeted doc test that fails if `SPECKIT_TIER3_ROUTING` reappears in canonical save docs.

## 3. Traceability

- `.claude`, `.codex`, and `.gemini` agent mirrors did not show stale routing guidance in this sweep.
- The MCP config mirrors are aligned on the always-on Tier-3 note, so the current drift is concentrated in the primary save docs, the `004` packet-local docs, and the playbook mirror.
- The older phase-003 prompt-context findings recorded in its child review packet are no longer live in the current code; the present open issues are different and narrower.

## 4. Recommended Remediation

- Fix `spec-frontmatter` host selection so metadata-only continuity always lands on `implementation-summary.md` when available.
- Remove the `SPECKIT_TIER3_ROUTING` opt-in/default-off story from the surviving primary docs, packet-local `004` docs, and the canonical save playbook.
- Rework child phases `001` to `003` onto the current Level-2 template/anchor contract and re-run strict validation before claiming those packet docs are verified.

## 5. Cross-References

- Config mirrors correctly say always on: `.mcp.json:24`, `opencode.json:33`, `.claude/mcp.json:23`, `.vscode/mcp.json:24`, `.gemini/settings.json:40`.
- Feature-flag reference correctly says removed: `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:130`.
- Child validation reruns on 2026-04-13: `validate.sh --strict` returned `RESULT: FAILED` for `001`, `002`, and `003`, and `RESULT: PASSED` for `004`.
