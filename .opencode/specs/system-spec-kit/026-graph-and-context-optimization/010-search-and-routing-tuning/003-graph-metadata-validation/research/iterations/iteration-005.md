# Iteration 5: Key File Existence

## Focus
Answer RQ-4 by checking whether every `derived.key_files` entry resolves to a real file.

## Findings
1. `deriveKeyFiles()` merges backticked file references from packet docs with canonical packet-doc filenames and then truncates to 20 entries. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:463-471]
2. Across the corpus, 3,172 of 5,298 `key_files` entries resolve under a three-base heuristic (`repo root`, `spec-relative`, `skill-relative`), which yields a 59.87% existence rate. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. Repo-root-only resolution would drop the success rate to 21.78%, which shows the current metadata stores path strings that depend heavily on contextual interpretation. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. Missing entries are dominated by bare tokens (1,203), path-like misses (628), and cross-root or dot-relative references (193), with representative examples including `v0.200`, `validate.sh`, and `.opencode/specs/00--ai-systems-non-dev/...`. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

## Ruled Out
- Treating repo-root existence as the only meaningful quality bar.

## Dead Ends
- None beyond the strict repo-root-only assumption.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:463-471`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.7`
- Questions addressed: `RQ-4`
- Questions answered: none

## Reflection
- What worked and why: Classifying misses by token shape exposed where the extractor is pulling non-path content.
- What did not work and why: A single resolution base undercounts files that are intentionally packet-local or skill-local.
- What I would do differently: Separate "path is syntactically plausible" from "path resolves canonically" in the remediation proposal.

## Recommended Next Focus
Inspect how noisy `key_files` cascades into `entities`, duplicate basenames, and entity-cap saturation.
