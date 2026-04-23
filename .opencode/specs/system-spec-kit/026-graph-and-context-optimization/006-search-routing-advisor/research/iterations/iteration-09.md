## Iteration 09

### Focus
Cross-phase correctness after remediation: whether the later measurement packet shows that routing accuracy problems are actually closed.

### Findings
- The initial smart-router context-efficacy research already found 80 corpus-label mismatches and said a dedicated accuracy harness was still needed. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/004-smart-router-context-efficacy/001-initial-research/research/research.md:31-34`
- The follow-on `SKILL.md` intent-router efficacy research still reached only 17 non-`UNKNOWN` routes out of 26 labeled sample prompts and separately confirmed that no runtime enforcement mechanism had been found. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy/research/research.md:37-40`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy/research/research.md:67-76`
- The Phase 024 implementation summary reports the new static harness processed all 200 prompts but only matched the corpus top-1 label on 112/200 prompts, and it explicitly says the report is about predicted routes rather than live AI behavior. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/007-deferred-remediation-and-telemetry-run/implementation-summary.md:48-56`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/007-deferred-remediation-and-telemetry-run/implementation-summary.md:117-118`
- The packet index still marks Phase 007 as `Partial` with one unchecked item remaining, so the track itself still describes this measurement work as incomplete. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/context-index.md:55-56`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/context-index.md:75-76`

### New Questions
- How much of the remaining 88/200 mismatch gap is caused by known correctness bugs versus corpus-label ambiguity?
- Which prompts fail because of skill selection, and which fail later because of route/resource selection inside the chosen skill?
- Should routing accuracy be blocked on fixing the threshold and hybrid-fusion issues before collecting more telemetry?
- Is the remaining unchecked Phase 007 work operational setup, or another unresolved measurement-quality issue?

### Status
converging
