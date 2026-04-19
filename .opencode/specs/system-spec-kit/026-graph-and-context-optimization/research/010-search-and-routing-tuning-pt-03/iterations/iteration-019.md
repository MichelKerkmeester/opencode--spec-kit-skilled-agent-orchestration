# Iteration 19: Follow-On Phase Alignment and Implementation Order

## Focus
Reconcile the live code findings with the four child implementation phases under the current research packet.

## Findings
1. `001-fix-status-derivation`, `002-sanitize-key-files`, and `003-deduplicate-entities` still map cleanly onto the current parser hotspots and remain justified by live corpus measurements. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/001-fix-status-derivation/spec.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/002-sanitize-key-files/spec.md] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/003-deduplicate-entities/spec.md]
2. `004-normalize-legacy-files` is now stale against the active branch because the live corpus no longer contains legacy text metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/004-normalize-legacy-files/spec.md] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. The risk-ranked implementation order is: status derivation first, key-file sanitization second, entity de-duplication third, and legacy normalization only if another branch reintroduces legacy files. [INFERENCE: based on live mismatch volume plus patch isolation]
4. If phase 001 adopts the safer checklist-aware fallback instead of the literal one-line implementation-summary rule, its packet docs should note that checklist precedence is intentional and not a scope accident. [INFERENCE: from iteration-012 evidence]

## Ruled Out
- Treating all four child phases as equally urgent after the live-corpus recheck.

## Dead Ends
- Assuming legacy normalization still belonged in the active critical path.

## Sources Consulted
- `001-fix-status-derivation/spec.md`
- `002-sanitize-key-files/spec.md`
- `003-deduplicate-entities/spec.md`
- `004-normalize-legacy-files/spec.md`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.40`
- Questions addressed: `FQ-1` through `FQ-5`
- Questions answered: none newly answered

## Reflection
- What worked and why: checking the child packet specs after the code audit kept the recommendations aligned with real follow-on scope.
- What did not work and why: phase ordering based only on the original discovery wave would have kept phase 004 too prominent.
- What I would do differently: re-validate child packet assumptions every time a resumed wave changes the live corpus picture.

## Recommended Next Focus
Write the final wave-2 synthesis so the packet can hand implementation straight into phases 001-003 without another discovery pass.
