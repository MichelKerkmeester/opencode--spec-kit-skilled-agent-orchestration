# Audit of review-report.md

Sampled **19 iterations** across early/mid/late review passes (11 doc-layer, 8 code/ops-layer).

## Missing P0/P1 Findings

1. **Iteration 001 code-layer: `deep_loop_graph_status` missing promised `schemaVersion` / DB-size fields is not represented as its own P1.**
   - The iteration logged two separate P1s: the dead `deep_loop_graph_*` runtime surface and the narrower `deep_loop_graph_status` response-contract mismatch (`iteration-001.md:45-80`).
   - The report only preserves one slot in Section 3.7, and that slot is internally inconsistent: the title is the second finding, but the body/evidence text is the first finding (`review-report.md:874-877`).

2. **Iteration 008 code-layer: folder-scoped spec-doc validators accepting arbitrary absolute paths is missing.**
   - `validateMergeLegality()` / `validatePostSaveFingerprint()` can be steered at unrelated absolute paths, so a folder-scoped validation can succeed or fail on the wrong file entirely (`iteration-008.md:41-58`).
   - The report contains adjacent path-boundary issues (`review-report.md:505-525`, `984-997`, `1103-1115`), but no entry for this validator-specific out-of-folder absolute-path bug.

3. **Iteration 015 code-layer: compact recovery can clear cached state before stdout flush is missing.**
   - The hook can clear `pendingCompactPrime` and exit before the recovered payload is durably written, which risks losing post-compaction recovery context (`iteration-015.md:24-40`).
   - I found no corresponding report entry covering `session-prime`, compact-prime cache clearing, or stdout-flush durability.

## Missing Themes or Patterns

1. **Published contract vs live runtime drift** is a recurring pattern that the report scatters across multiple sections but never names directly.
   - Examples from the sample: dead `deep_loop_graph_*` MCP tools and the missing `deep_loop_graph_status` fields (`iteration-001.md:45-80`), wrong Claude custom-agent runtime directory in `cli-claude-code` (`iteration-060.md:27-42`), overstated Code Mode inventory (`iteration-060.md:44-60`), and the root docs' non-existent `generate-context.js` entrypoint (`iteration-070.md:39-55`).

2. **Path/scope-boundary hardening** should be called out as a cross-cutting theme.
   - The sample shows the same class of bug recurring in different surfaces: out-of-folder absolute-path validation (`iteration-008.md:41-58`) and symlink-based DB-directory escape in `resolveDatabasePaths()` (`iteration-015.md:44-59`).
   - The report already contains related path-boundary findings in command/workflow, error-handling, and other buckets (`review-report.md:72-79`, `984-997`, `1103-1115`), but it never treats them as one systemic pattern.

## Recommendation Gaps

1. **There is no dedicated workstream for the sole P0 blocker.**
   - Section 2 identifies governed save-time reconsolidation as the only P0 (`review-report.md:41-46`), but Section 4 never creates a governance/reconsolidation remediation stream for it (`review-report.md:1321-1400`).

2. **Add a path-boundary hardening workstream.**
   - Current Workstream 7 is too generic; it does not explicitly cover folder-scoped validator escapes, absolute-path acceptance, symlink escapes, or cross-root path handling (`review-report.md:1384-1393`).

3. **Add a public-contract verification workstream.**
   - The current recommendations split this class across command workflow, agent docs, and stale references, but there should be one explicit pass that compares tool schemas, READMEs, root runtime docs, and shipped entrypoints against actual runtime behavior.

4. **Workstream 8 should explicitly cover its P1 items, not present itself as a P2-only cleanup pass.**
   - The underlying stale-reference and placeholder sections include multiple P1s (`review-report.md:870-892`, `1049-1072`), but Workstream 8 is framed as low-priority cleanup (`review-report.md:1396-1400`).

## Priority Matrix Issues

1. **A workstream addressing the sole P0 should be Priority 1.**
   - The matrix currently ranks Packet 014 identity fix first and Error handling & security fourth (`review-report.md:1408-1416`), even though the report's only blocker is the governed reconsolidation bug (`review-report.md:41-46`).

2. **Packet identity/status cleanup is over-ranked relative to production-safety and boundary-validation work.**
   - Those cleanup streams are worthwhile, but they should not outrank scope-crossing persistence bugs, path-boundary escapes, and public-contract/runtime breakage.

3. **Stale reference / placeholder work should rank higher than a pure P2 bucket.**
   - In this report, that bucket includes user-facing/runtime-facing P1 problems such as wrong agent directories, wrong filenames, malformed copy-paste commands, and bad entrypoints (`review-report.md:870-892`, `1049-1072`).

## Factual Errors

1. **Section 3.7 item 1 conflates two different findings from iteration 001.**
   - The title is the `deep_loop_graph_status` field-contract bug, but the evidence/body describe the broader dead-`deep_loop_graph_*` runtime surface (`iteration-001.md:45-80`; `review-report.md:874-877`).

2. **Workstream 8 is mislabeled as `P2`.**
   - The sections it aggregates contain at least 12 P1 findings total: 8 in Stale References and 4 in Placeholder Residue (`review-report.md:870-892`, `1049-1072`, `1396-1400`).

## Verdict

**INCOMPLETE**

Add the three missing sampled P1s, split/fix the conflated iteration-001 entry, create a dedicated remediation stream for the sole P0 blocker, and re-rank the priority matrix so governance/boundary failures come before release-hygiene cleanup.
