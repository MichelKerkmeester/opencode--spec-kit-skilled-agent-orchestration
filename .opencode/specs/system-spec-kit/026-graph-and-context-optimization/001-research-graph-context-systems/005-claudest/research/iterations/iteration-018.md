# Iteration 18: verifier versus discoverer split mapped to Public signal extraction

## Focus
Convert Claudest's `memory-auditor` versus `signal-discoverer` pattern into concrete Public seams. The important question is not whether the split is philosophically good, but which current Public surfaces should own discovery, proposal building, and verification. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md:35-54] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:208-360]

## Findings
- Public already has a discovery substrate. Phase `022/.../008-signal-extraction` centralized semantic extraction, stopword filtering, n-gram scoring, and ranked signal output into one shared script-side contract, which is the natural home for a discoverer-style lane. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md:35-54]
- Public already has a verification substrate too. `reviewPostSaveQuality()` compares the saved artifact against the original payload and emits HIGH/MEDIUM/LOW issues for title, trigger phrases, tier mismatches, missing decisions, and generic descriptions. That is the right starting point for an auditor-style lane. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:208-360]
- The split should therefore be operational, not organizational:
  - discoverer lane = semantic extraction plus ranked proposal generation from session data;
  - verifier lane = post-save review plus targeted factual checks on the candidate output and its metadata;
  - writer lane = existing save workflow once both prior lanes agree. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md:37-40] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:240-360]
- Decision extraction should stay on the discovery side. `extractDecisions()` is still about candidate harvesting and precedence, not about confirming whether the rendered memory artifact truthfully reflects the input payload. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-388]
- The Public packet boundary becomes sharper: do not create a new "auditor subsystem" first. Instead, add a proposal phase above the current save path, let post-save review and narrow fact checks serve as the verifier, and keep mutation in the existing workflow. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:212-360]
- This also keeps the placement-rubric insight from Claudest. Discovery should propose candidate memory placement and wording; verification should reject noisy or contradictory proposals before they reach a writer. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md:49-54]

## Ruled Out
- Building a brand-new memory-auditor framework before using the verification machinery Public already has. The split can start as a workflow contract over existing seams. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:208-360]

## Dead Ends
- No new dead-end path occurred. The key correction was realizing that Public already owns both halves of the split, just under different names. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md:35-54]

## Sources Consulted
- `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md`
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`
- `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts`
- `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`

## Reflection
- What worked and why: comparing the signal-extraction packet with the post-save reviewer showed the split immediately, because one side is already optimized for harvesting and the other for contradiction detection. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:240-360]
- What did not work and why: the Claudest vocabulary initially suggested new agent infrastructure, but the Public code says the first leverage point is workflow ordering, not more subsystems. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md:49-54]
- What I would do next: narrow the portable observability layer to JSON contracts and metadata fields, leaving presentation out of scope. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:86-133]

## Recommended Next Focus
Lock the minimal token-insight JSON contracts Public can safely expose once the analytics reader exists. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:40-84]
