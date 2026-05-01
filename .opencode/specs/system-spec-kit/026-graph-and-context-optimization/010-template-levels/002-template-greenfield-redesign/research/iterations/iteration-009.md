# Iteration 9: Final Synthesis

## Focus

FINAL SYNTHESIS PASS. This iteration consolidates iterations 1 through 8 into the canonical research synthesis, emits the packet resource map, resolves the final three open design items, and declares convergence for the greenfield template-system redesign.

## Findings

The recommendation is stable: implement the C+F hybrid manifest-driven greenfield design.

- C+F means capability-based authored docs plus F-style lazy command/workflow addons.
- The level taxonomy should be removed from the template source model. Current Level 1/2/3/3+ behavior is reproduced by `kind + capabilities + sectionProfiles`, not by level folders.
- The functional source-file surface drops from the 86-file current template-system baseline to 15 manifest-era source files. The earlier 010 partial framing reduced 86 to 83 plus one resolver; this greenfield framing is the larger cut.
- The single manifest drives scaffolding, validation, lifecycle ownership, preset resolution, directories, and active section profiles.
- Inline gates are the section-variance mechanism. Fragment libraries and schema-first rendering were rejected because they add composition complexity or reduce markdown authoring ergonomics.

The final three open items are resolved as follows:

1. Only `spec.md` carries template-contract frontmatter. The same resolved contract is also written to `graph-metadata.json.derived.template_contract` and optionally mirrored in `description.json.templateContract`. Duplicating it across every authored doc creates drift without improving resume or validation.
2. Current-manifest validation requires an exact `manifestVersion` match for greenfield v1. Adapters are future work and should be introduced only with the first real migration.
3. `phase-parent --name X` creates only the parent. Child phases are created by subsequent `create.sh --subfolder` or explicit phase-child invocations.

## Convergence

`newInfoRatio` for iteration 9 is `0.06`. The pass added no new design direction; it only resolved the remaining synthesis decisions and assembled the final artifacts. Status is `converged`.

The canonical synthesis is `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md`.

The resource map is `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/resource-map.md`.

## Sources Consulted

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-002.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-003.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-004.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-005.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-006.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-007.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-008.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/cross-validation/copilot-response.md`

## Recommended Next Focus

Start the follow-on implementation packet. Phase 1 should add the manifest loader, manifest JSON, and inline-gate renderer behind tests before touching `create.sh` or validator rules.
