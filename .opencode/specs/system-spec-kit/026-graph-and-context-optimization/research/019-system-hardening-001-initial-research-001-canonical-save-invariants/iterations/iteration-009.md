# Focus

Polish `research.md` to near-final quality by tightening the executive summary, hardening the validator assertion table, and converting the remediation section into an implementation-ready sibling-child handoff.

# Polish Summary

1. Rewrote the executive summary into a four-paragraph handoff that now cleanly covers scope, the two P0 defects, validator intent, and the recommended implementation waves.
2. Normalized the validator table so every rule now has a pseudocode trigger, uppercase severity, explicit grandfathering logic, and a one-sentence migration path.
3. Added explicit non-overlap notes showing why the proposed rules do not duplicate `CONTINUITY_FRESHNESS`, `POST_SAVE_FINGERPRINT`, `SPEC_DOC_INTEGRITY`, or `GRAPH_METADATA_PRESENT`.
4. Reshaped the remediation plan around a sibling implementation child proposal, Wave A/B/C sequencing, per-wave day estimates, dependencies, and concrete success criteria.

# Any Gaps Found

- No new defect class surfaced during polish.
- The only remaining policy choice is the exact release cutoff timestamp for promoting lineage validation from warning to error after Wave A and the active-packet backfill complete.
- The coordination-parent root-doc template can still be finalized during implementation, but that is no longer a research blocker.

# Synthesis Readiness

The research artifact is ready for synthesis. Q1 through Q5 remain answered, the validator set is now rollout-shaped, and the low polish-pass novelty confirms convergence rather than a need for another discovery round.

# Next Focus

Move to workflow synthesis and implementation handoff. If a follow-up iteration is still required, it should only verify wording drift after synthesis rather than reopen technical discovery.
