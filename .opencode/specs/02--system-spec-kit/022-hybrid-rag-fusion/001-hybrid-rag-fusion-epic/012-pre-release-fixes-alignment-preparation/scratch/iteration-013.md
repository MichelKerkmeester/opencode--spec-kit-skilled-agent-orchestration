# Iteration 013: Checklist Evidence Verification

## Findings

1. **Two checked items are not supported by the current tree and should be reopened.**
   - `CHK-353` is still marked `[x]` in the release checklist, but its own verifier now fails. Strict validation of `009-perfect-session-capturing/016-json-mode-hybrid-enrichment` exits `2` with missing anchors, missing template markers, missing required section headers, and level inference drift. The packet itself still lacks template markers/anchors in the live `spec.md` (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/spec.md:1-17`), so the current evidence does **not** support a completed state for `CHK-353` (`checklist.md:210-211`).
   - `CHK-357` is also marked `[x]`, but recursive strict validation of `015-manual-testing-per-playbook` exits `2` and reports **40 completed items without evidence**. The umbrella checklist still has many checked rows with no `[EVIDENCE: ...]` backing at all (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/checklist.md:33-50`, `60-116`), so the current tree does **not** justify keeping `CHK-357` checked (`checklist.md:218-219`).

2. **Several checked items are substantively aligned with current files, but their cited verify commands are stale or mis-scoped.**
   - `CHK-011`, `CHK-020`, `CHK-381`, `CHK-396`, `CHK-397`, and the code-fix checks `CHK-360` through `CHK-371` all rely on bare `npm run check` / `npm run test` verifiers. Those commands fail from the repository root because the repo root has no scripts at all (`package.json:1-5`), and the `system-spec-kit` workspace root defines `test` but not `check` (`.opencode/skill/system-spec-kit/package.json:14-25`). The live check surface is now split across workspace packages: `@spec-kit/mcp-server` exposes `check` and `test` (`.opencode/skill/system-spec-kit/mcp_server/package.json:16-24`), while `@spec-kit/scripts` exposes `check` and `test` separately (`.opencode/skill/system-spec-kit/scripts/package.json:10-16`).
   - Current spot checks show `@spec-kit/mcp-server` check passing, `@spec-kit/scripts` check passing, `@spec-kit/mcp-server` tests passing, and the embeddings smoke test passing, so the underlying remediation still looks healthy. But the checklist’s literal command citations are no longer executable as written, and the dated `"267/267 pass"` evidence language on `CHK-360`-`CHK-371` is stale relative to the current suite shape.
   - `CHK-352` is another command-surface problem: its verifier still references nonexistent `019-feature-flag-reference`, while the live umbrella traceability table uses `019-decisions-and-deferrals` plus `020-feature-flag-reference` (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/spec.md:154-174`). The claim appears substantively true, but the cited verifier is outdated.
   - `CHK-391` likewise points at removed files (`mcp_server/lib/search/rsf-fusion.ts` and `mcp_server/lib/governance/retention.ts`). That missing-path result is consistent with cleanup/removal, but the verifier itself is obsolete and should be refreshed before being used as evidence.

3. **A small set of checked items are process claims, not independently reproducible file/line evidence.**
   - `CHK-001`, `CHK-002`, `CHK-050`, and `CHK-354` describe prior operator actions such as “read before rewrite,” “only two files were edited,” or “tree-wide sweep completed.” The current packet structure is broadly consistent with those claims (`review-report.md:5-21`; `tasks.md:22-25`; `checklist.md:292-333`), but the cited evidence is narrative rather than file:line traceability, so those items are only weakly evidenced.
   - `CHK-003`, `CHK-052`, and `CHK-H01` through `CHK-H33` are different: they are historical-preservation claims, and the superseded historical section is still present and clearly marked non-authoritative (`checklist.md:292-333`). Those historical items remain adequately supported for their stated purpose.

4. **No unchecked item should currently be promoted to `[x]`.**
   - The release review still says **“CONDITIONAL (not release-ready)”** and names recursive `007-code-audit-per-feature-catalog` child-packet validation as the remaining blocker (`review-report.md:7-21`, `68-84`).
   - Recursive strict validation of the `022-hybrid-rag-fusion` tree still exits `2`, so the currently open release-gate items (`CHK-012`, `CHK-021`, `CHK-022`, `CHK-040`, `CHK-041`, `CHK-042`, `CHK-051`, `CHK-330`, `CHK-394`, `CHK-395`, `CHK-398`) should stay unchecked. I did **not** find any `[ ]` item in this checklist that should be flipped to `[x]` based on the current repository state.

5. **Negative-match verifiers behaved as expected and should not be treated as failures.**
   - `CHK-351` uses an `rg` sweep for inline markdown links in the affected packets and returns no matches; in this case the `rg` exit `1` is consistent with “broken links repaired or removed.”
   - `CHK-382` uses an `rg` sweep for `TODO(vector-index)` and returns no matches; that negative result supports the current checked state.

## Summary

- Reviewed all **93** checked items and all **11** unchecked items in `checklist.md`.
- **Should be reopened:** `CHK-353`, `CHK-357`.
- **Still unchecked correctly:** `CHK-012`, `CHK-021`, `CHK-022`, `CHK-040`, `CHK-041`, `CHK-042`, `CHK-051`, `CHK-330`, `CHK-394`, `CHK-395`, `CHK-398`.
- **Stale evidence/command surface (claim may still be true, verifier is not current):** `CHK-011`, `CHK-020`, `CHK-352`, `CHK-360`-`CHK-371`, `CHK-381`, `CHK-383`, `CHK-391`, `CHK-396`, `CHK-397`.
- **Process-only / weakly reproducible evidence:** `CHK-001`, `CHK-002`, `CHK-050`, `CHK-354`.
- All other checked items were consistent with the current files or with the packet’s clearly marked historical/superseded sections.

## JSONL (type:iteration, run:13, dimensions:[traceability])

{"type":"iteration","run":13,"dimensions":["traceability"],"result":"needs_update","checked_items_reviewed":93,"unchecked_items_reviewed":11,"reopen":["CHK-353","CHK-357"],"no_promotions":[],"stale_verify_commands":["CHK-011","CHK-020","CHK-352","CHK-360","CHK-361","CHK-362","CHK-363","CHK-364","CHK-365","CHK-366","CHK-367","CHK-368","CHK-369","CHK-370","CHK-371","CHK-381","CHK-383","CHK-391","CHK-396","CHK-397"],"weak_process_evidence":["CHK-001","CHK-002","CHK-050","CHK-354"],"still_open":["CHK-012","CHK-021","CHK-022","CHK-040","CHK-041","CHK-042","CHK-051","CHK-330","CHK-394","CHK-395","CHK-398"]}
