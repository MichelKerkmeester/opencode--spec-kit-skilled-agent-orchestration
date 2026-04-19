# Iteration 003 - V3 Hidden dependency cycles

## Summary

The `002 -> 009` scaffold is still **acyclic**. This pass found **no true bidirectional import/type cycle** that forces an architecture change, but it did surface two real forward-reference / ownership hazards and one lower-severity sanitization seam. The highest-risk seam is `004 <-> 005`: `005` explicitly consumes the `AdvisorHookResult` type defined by `004`, while `004` simultaneously reserves metrics-emission and hard-cap enforcement concerns for `005`. That is still implementable, but only if `004` remains the sole owner of result-shape types and `005` stays a pure consumer. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md:87-145] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md:88-212]

## Dependency graph

```text
002 shared-payload contract
  └─type→ 004 producer/cache policy (`AdvisorEnvelopeMetadata`)

003 freshness/source cache
  └─cache-key+freshness→ 004 producer/cache policy
      (`getAdvisorFreshness()`, `sourceSignature`, `skillFingerprints`)

004 producer/cache policy
  └─type+harness input→ 005 renderer/harness
      (`AdvisorHookResult`, producer timing/parity inputs)

005 renderer/harness
  ├─renderer/comparator→ 006 Claude hook wiring
  ├─renderer/comparator→ 007 Gemini+Copilot hook wiring
  └─renderer/comparator→ 008 Codex integration

006 Claude hook wiring
  └─parity baseline→ 007 runtime parity suite

007 Gemini+Copilot hook wiring
  └─test-file ownership→ 008 Codex parity extension

006 + 007 + 008
  └─release evidence→ 009 documentation/release contract
```

### Hidden non-linear edges

1. `002 -> 004`: `004/spec.md §3` wraps producer output through 002's advisor envelope contract, so the producer cannot finalize before `AdvisorEnvelopeMetadata` is stable. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md:135-137]
2. `003 -> 004`: 004's exact prompt-cache key includes the `sourceSignature` and deleted-skill suppression depends on 003's fingerprint map, which makes freshness output part of cache correctness rather than a simple optional helper. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md:103-109] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md:121-128]
3. `007 -> 008`: although `008/spec.md` says it can run in parallel after `006`, it also extends `advisor-runtime-parity.vitest.ts`, a file that `007/spec.md §3.3` creates. That makes `008` depend on `007`'s test ownership in practice. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/spec.md:103-131] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/008-codex-integration-and-hook-policy/spec.md:118-143]

## Hidden cycles / inverted-import risks

### P0

- **None.** No actual bidirectional dependency cycle is specified in the current scaffold. The implementation train can remain `002 -> 003 -> 004 -> 005 -> 006 -> 007 -> 008 -> 009`. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/002-shared-payload-advisor-contract/spec.md:35-39] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/009-documentation-and-release-contract/spec.md:35-37]

### P1

1. **`005` requires a type defined only in `004`, and the ownership seam is easy to invert.** `005/spec.md §3.1` defines `renderAdvisorBrief(result: AdvisorHookResult, options: RenderOptions)`, so the renderer already depends on the `AdvisorHookResult` interface introduced by `004/spec.md §3`. At the same time, `004/spec.md §3` and `§4.2 REQ-023` keep `metrics: AdvisorHookMetrics` inside that result shape, while `004/spec.md §3 Out of Scope` explicitly says metrics emission and the `session_health` hook belong to `005`. That means the safe direction is **004 owns `AdvisorHookResult`/`AdvisorHookMetrics`; 005 consumes them**. If implementation instead moves metric-shape ownership into `005/metrics.ts` and imports it back into `004`, a real `004 <-> 005` cycle appears. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md:87-97] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md:123-145] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md:187-190] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md:90-103] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md:157-189]
2. **`007` and `008` are not actually parallel-safe because parity-harness ownership is one-way but hidden.** `007/spec.md §3.3` creates `mcp_server/tests/advisor-runtime-parity.vitest.ts`, while `008/spec.md §3.5` modifies that same file to add Codex as the fourth runtime. This is not a type cycle, but it is an inverted-import / ownership risk: the plan text suggests `008` can proceed in parallel after `006`, while the file-level contract makes `008` effectively downstream of `007`. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/spec.md:103-131] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/008-codex-integration-and-hook-policy/spec.md:120-143]

### P2

1. **`002` and `005` have a sanitization seam that stays acyclic only if their boundaries remain strict.** `002/spec.md §3` requires `AdvisorEnvelopeMetadata.skillLabel` to be sanitized and single-line at the envelope boundary, but `005/spec.md §3.1` owns the stronger visible-label pipeline, including instruction-shaped deny logic. This is fine as long as `002` only performs structural validation (`single-line`, no control chars) and `005` alone owns semantic/injection sanitization. If `002` tries to import 005's renderer sanitization to satisfy its own contract, a back-edge from shared-payload into renderer code would be introduced. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/002-shared-payload-advisor-contract/spec.md:81-89] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md:90-103]

## Direct answer to the 004/005 forward-reference check

- **Does the renderer (005) require types defined only in 004?** **Yes.** `renderAdvisorBrief(result: AdvisorHookResult, ...)` makes `005` directly dependent on `004`'s exported result contract. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md:90-90] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md:88-97]
- **Does 004's producer require shapes defined in 005?** **Not yet, if the scaffold is implemented literally.** `004/spec.md` references 005-owned concerns (renderer hard-cap enforcement, metrics emission, `session_health` integration), but it does not currently require any 005-defined type in its own signature. The forward reference is therefore an **ownership hazard**, not an already-specified cycle. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md:123-145] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md:157-163]

## Ruled-out directions

- No architecture re-open is justified from V3. The scaffold's dependency train still holds.
- No new child phases are warranted. The dependency issues here are ownership and file-boundary clarifications inside `002/004/005/007/008`, not missing decomposition.
