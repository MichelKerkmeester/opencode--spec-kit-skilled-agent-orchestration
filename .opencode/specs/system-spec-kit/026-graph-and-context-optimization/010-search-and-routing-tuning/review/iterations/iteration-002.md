# Iteration 002

- Dimension: traceability
- Focus: check whether the promoted 002 deep-research prompt still targets the retired 006 path
- Files reviewed: `002-content-routing-accuracy/prompts/deep-research-prompt.md`, `002-content-routing-accuracy/spec.md`
- Tool log (8 calls): read config, read state, read strategy, read prompt file, read 002 spec, grep for old 006 path across packet, reread prompt for exact command line, update strategy summary

## Findings

- P1 `R010-F001`: The active operator prompt for `002-content-routing-accuracy` still invokes `--spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/002-content-routing-accuracy`, so launching the promoted prompt reopens the retired 006 lineage instead of the 010 packet. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/002-content-routing-accuracy/prompts/deep-research-prompt.md:8] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/002-content-routing-accuracy/spec.md:6]

## Ruled Out

- The path drift is not limited to an archived note; it is still present in the live prompt surface.
