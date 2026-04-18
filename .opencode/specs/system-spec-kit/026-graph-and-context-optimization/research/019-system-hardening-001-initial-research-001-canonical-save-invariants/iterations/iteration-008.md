# Focus

Consolidate iterations 001 through 007 into a near-final `research.md` draft, lock the P0 framing, and leave only minor rollout-polish questions for any later synthesis or implementation hand-off.

# Actions

1. Re-read the session strategy, findings registry, and all seven prior iteration notes to extract stable answers for Q1 through Q5.
2. Re-verified the source and built runtime line ranges that matter for the final draft, especially the H-56-1 workflow block, `refreshGraphMetadata()` wrapper, source parser/schema, built parser/schema, and the 026 parent packet contract.
3. Wrote `research.md` as a draft with eight sections: executive summary, invariant catalogue, observed divergences, two P0 findings, H-56-1 scope verification, validator assertions, remediation plan, and open questions/out-of-scope.
4. Tightened the synthesis so it distinguishes three different categories cleanly:
   - H-56-1 fixes already delivered
   - defects H-56-1 did not and could not close
   - validator rules that must wait for runtime parity plus targeted backfill

# Synthesis Summary

- Q1 is now stable enough for implementation: the write surfaces across frontmatter, `description.json`, `graph-metadata.json`, and the memory index are catalogued and cross-linked to the save workflow.
- Q2 converged into seven practical invariants, including packet-root source-doc parity and refresh-option round-trip preservation.
- Q3 stayed unchanged during synthesis: H-56-1 fixed description/graph freshness parity for `plan-only` vs `full-auto`, but not `save_lineage` persistence.
- Q4 stayed stable and is now summarized as one real structural defect class (`007-010` missing root docs), one live runtime defect (`save_lineage` parity failure), and a smaller latent-risk set (identity drift, desc-newer-than-graph skew).
- Q5 is draft-complete: five validator assertions now have trigger logic, severity, grandfathering, and migration paths.

# Gaps Discovered

- The lineage validator still needs an explicit release/backfill cutoff constant before it can be promoted from warning to hard error.
- The implementation child still needs to choose the exact coordination-parent root-doc shape for `007-010`, but that is a remediation-design choice, not a research blocker.
- No new technical unknowns surfaced that would justify reopening broad discovery. The remaining gaps are rollout-policy details.

# Next Focus

If iteration 009 is used, keep it to polish only:

1. tighten wording in `research.md`
2. choose the recommended child implementation slug/path
3. convert the validator table into direct implementation task language

No further discovery pass is currently justified unless implementation uncovers contradictory runtime evidence.
