# Iteration 014: Inventory Count Verification

## Findings

1. **The exact raw directory-count command returns `400`, not `399`**
   - Ran exactly: `find .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion -type d | wc -l`
   - Live result: `400`
   - Root packet claims a point-in-time snapshot of `399 total directories under the 022 subtree` and repeats that value in the executive summary, metadata, requirements, success criteria, and acceptance scenarios.
   - Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md:3,20,38,121,141,218,238`
   - Reconciliation: `399` matches the descendants-only command `find ... -mindepth 1 -type d | wc -l`. So the written claim is consistent only if "under/beneath the subtree" excludes the root directory itself. It does **not** match the exact raw command requested here.

2. **Root direct-child inventory splits into `20` immediate directories vs `19` numbered child specs**
   - Live counts:
     - Immediate child directories under `022-hybrid-rag-fusion`: `20`
     - Numbered direct child spec folders/phases: `19`
   - Root packet's `19 direct phases` claim is correct.
   - Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md:20,53,89-109`
   - Root packet's `21 top-level directories at the root` claim only works if the `find ... -maxdepth 1 -type d` result includes the root directory itself. Literal direct children are `20`, not `21`.
   - Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md:3,20,38`
   - Direct children of root:
     - `.github`
     - `001-hybrid-rag-fusion-epic`
     - `002-indexing-normalization`
     - `003-constitutional-learn-refactor`
     - `004-ux-hooks-automation`
     - `005-architecture-audit`
     - `006-feature-catalog`
     - `007-code-audit-per-feature-catalog`
     - `008-hydra-db-based-features`
     - `009-perfect-session-capturing`
     - `010-template-compliance-enforcement`
     - `011-skill-alignment`
     - `012-command-alignment`
     - `013-agents-alignment`
     - `014-agents-md-alignment`
     - `015-manual-testing-per-playbook`
     - `016-rewrite-memory-mcp-readme`
     - `017-update-install-guide`
     - `018-rewrite-system-speckit-readme`
     - `019-rewrite-repo-readme`

3. **Epic direct-child inventory splits into `15` immediate directories vs `12` numbered child specs**
   - Live counts:
     - Immediate child directories under `001-hybrid-rag-fusion-epic`: `15`
     - Numbered direct child spec folders: `12`
   - Epic packet's `12 numbered child folders` claim is correct for child specs.
   - Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/spec.md:3,20,41,54,93-104,116,136,213,233`
   - It is not a count of all literal immediate directories, because `memory`, `research`, and `scratch` also exist at epic root.
   - Direct children of epic:
     - `001-sprint-0-measurement-foundation`
     - `002-sprint-1-graph-signal-activation`
     - `003-sprint-2-scoring-calibration`
     - `004-sprint-3-query-intelligence`
     - `005-sprint-4-feedback-and-quality`
     - `006-sprint-5-pipeline-refactor`
     - `007-sprint-6-indexing-and-graph`
     - `008-sprint-7-long-horizon`
     - `009-sprint-8-deferred-features`
     - `010-sprint-9-extra-features`
     - `011-research-based-refinement`
     - `012-pre-release-fixes-alignment-preparation`
     - `memory`
     - `research`
     - `scratch`

4. **The 012 packet's `119 spec directories` claim is stale**
   - 012 claims: `Live Review Scope | 119 spec directories, 19 direct phases`
   - Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/spec.md:27`
   - Live counts:
     - Direct root phases: `19` (matches)
     - Numbered directories anywhere in the `022` tree: `123`
     - `spec.md` files in the `022` tree: `124`
   - Conclusion: the `119 spec directories` inventory claim does not match live reality under either common counting method.

## Summary

- Exact raw command result: `400` directories.
- Descendants-only result: `399` directories.
- Root immediate children: `20` directories total, `19` numbered child specs.
- Epic immediate children: `15` directories total, `12` numbered child specs.
- Claims that still match live reality:
  - Root: `19 direct phases`
  - Epic: `12 numbered child folders`
  - 012: `19 direct phases`
- Claims that do not cleanly match live reality:
  - Root: raw `find ... -type d | wc -l` does not equal `399`; it equals `400`
  - Root: `21 top-level directories` is only true if the root directory itself is included
  - 012: `119 spec directories` is stale versus the live `123` numbered dirs / `124` `spec.md` files

## JSONL (type:iteration, run:14, dimensions:[traceability])

{"type":"iteration","run":14,"dimensions":["traceability"],"result":"partial_alignment","counts":{"root_total_find":400,"root_descendants_only":399,"root_direct_children":20,"root_direct_numbered_children":19,"epic_direct_children":15,"epic_direct_numbered_children":12,"tree_numbered_dirs":123,"tree_spec_md_files":124},"matches":["Root claim of 19 direct phases matches live reality.","Epic claim of 12 numbered child folders matches live reality.","012 claim of 19 direct phases matches live reality."],"mismatches":["Exact raw find count is 400, not 399.","Root claim of 21 top-level directories only works if the root directory itself is counted.","012 claim of 119 spec directories is stale."],"evidence":{"root_spec":".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md:3,20,38,89-109,121,141,218,238","epic_spec":".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/spec.md:3,20,41,54,93-104,116,136,213,233","phase_012_spec":".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/spec.md:27"}}
