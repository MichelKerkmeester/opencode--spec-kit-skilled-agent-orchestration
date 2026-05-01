# Independent Review of Packet 012

## Verdict
NOT READY (P0 blockers)

## P0 Findings (blockers)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl/spec.md:178` — root cross-cutting templates are declared in scope as moving from `templates/*.md` to `templates/manifest/*.md.tmpl`, but `resource-map.md` never deletes or rewrites the existing root files: `templates/handover.md`, `debug-delegation.md`, `research.md`, `resource-map.md`, `context-index.md`, or `templates/README.md`. This breaks the authoritative file ledger and the “~13 files in templates/manifest” target. Add these paths to §3 deletions or §2 modifications with explicit reasoning.

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl/spec.md:102`, `.opencode/specs/.../plan.md:108-141`, `.opencode/specs/.../tasks.md:71-79` — Phase 1 is claimed to be “purely additive” / “existing files unchanged,” but it modifies `scripts/lib/template-utils.sh` and rewrites two existing fixture directories. Recommendation: either move those changes to Phase 2, or rewrite REQ-001/Gate 1/US-001 to say Phase 1 is “non-production-path only,” not zero existing-file changes.

- `.opencode/skill/system-spec-kit/mcp_server/tests/thin-continuity-record.vitest.ts:156-167`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl:35-40` — the requested grep cross-check finds deleted-path references not covered in `resource-map.md` §2 or §3. `thin-continuity-record.vitest.ts` should likely be listed as untouched fixture-like test data or modified. The observability JSONL should be explicitly classified as historical/cited/untouched or excluded by rule.

- `.opencode/specs/.../plan.md:130`, `.opencode/specs/.../plan.md:224` — the workflow-invariance test is central, but the implementation packet only says “every public surface” generically. Packet 011’s binding addendum requires specific coverage: live script outputs, generated fixture snapshots, template sources, command docs, agent prompts, skill/root policy docs, plus explicit historical allowlists (`011/research/research.md:809`). Encode that exact surface list in Phase 1/Gate 1 so the test cannot be implemented too narrowly.

- `.opencode/specs/.../plan.md:134`, `.opencode/specs/.../tasks.md:76` — the leak replacement says `[capability]` → `[applicable]`, but packet 011 specifies `[needed behavior]` and frontmatter/keyword cleanup (`011/research/research.md:788-801`). This is inherited-design drift. Use the packet 011 wording unless a new ADR-006 intentionally changes it.

## P1 Findings (should-fix)
- `.opencode/specs/.../checklist.md:47-188` — checklist is mostly generic Level 3 boilerplate and does not mirror Gates 1-4. Add packet-specific checklist items for resource-map completeness, Phase 1 non-production-path safety, invariance scope, all-868 validation, and rollback dry-run.

- `.opencode/specs/.../plan.md:272`, `.opencode/specs/.../plan.md:352` — “Phases 2 + 3 can run in parallel” is plausible only after Phase 1’s resolver API stabilizes, but both phases modify shared shell helper behavior and depend on the same contract semantics. Keep “parallel branches” only with an explicit merge rule: no Phase 4 until a combined branch passes Gates 2 and 3 together.

- `.opencode/specs/.../plan.md:248-251`, `.opencode/specs/.../plan.md:364-368` — single-commit rollback conflicts with milestone language about Phase 1/2/3/4 PRs. Tighten this to “one final squash/atomic merge commit” or “multi-PR rollout with a coordinated revert plan.” Current wording overpromises rollback simplicity.

- `.opencode/specs/.../plan.md:282-286` — 17-27 focused hours is optimistic. Phase 1 alone includes 12 template migrations, resolver, renderer grammar, four vitest suites, fixture rewrites, and leak cleanup. I’d re-estimate Phase 1 and Phase 3 upward or label the numbers as best-case.

## P2 Findings (nice-to-have)
- `.opencode/specs/.../resource-map.md:207` — “other 14 validators” is too hand-wavy for an authoritative ledger. List the remaining validator scripts by name, especially since the review request explicitly asks every `check-*.sh` be accounted for.

- `.opencode/specs/.../decision-record.md:62` — says “86 → 15 source files,” while this packet repeatedly targets `~13` manifest files. Clarify whether “15” includes resolver/renderer infrastructure and “13” means template files only.

- `.opencode/specs/.../tasks.md:140-141` — T-412/T-413 are “DECIDE” tasks inside an implementation packet. Make the decision before implementation starts or mark them as explicit Phase 4 branch points with acceptance criteria.

## Strengths
- `resource-map.md` is the right organizing artifact and already catches most of the major blast radius.
- ADR inheritance is structurally clear: 012 does not try to re-decide 011’s design.
- The phase model is sensible: add infrastructure, switch scaffolder, switch validators, delete legacy.
- The workflow-invariance constraint is treated as a first-class risk rather than an afterthought.
- The plan correctly identifies `template-structure.js` as the riskiest validator-side refactor.

## Summary
Packet 012 is close in shape, but not ready to implement because the authoritative ledger is incomplete and Phase 1’s “purely additive” contract contradicts the listed tasks. Fix those P0s, pin the exact workflow-invariance test surface from packet 011, and this becomes a strong implementation packet rather than a risky one.
