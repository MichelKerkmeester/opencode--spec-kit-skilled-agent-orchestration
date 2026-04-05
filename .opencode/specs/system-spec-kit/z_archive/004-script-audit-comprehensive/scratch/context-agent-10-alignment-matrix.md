# Context Agent 10 - Alignment Matrix (C10)

## Audit Scope
- Compared `.opencode/skill/system-spec-kit` vs `.opencode/skill/workflows-code--opencode`.
- Focused on: language standards (JS/TS/Python/Shell/JSON), verification claims, command contracts, and documentation promises vs scripts.
- Excluded node_modules move-only mismatch noise.

## Method
- This report captures the previously completed C10 evidence-based read-only scan (task `ses_39f8e0126ffeK5R1CF2ni6lGMa`).
- Findings and counts are preserved from that completed analysis to keep scope unchanged.

## Explicit Alignment Matrix

| Category | system-spec-kit | workflows-code--opencode | Alignment | Notes |
|---|---|---|---|---|
| JS/TS language standards | Present in validation rules and examples | Present in standards references | Partial | Both cover JS/TS, but citation quality differs (line-level consistency). |
| Python standards | Indirect/limited integration in spec validation docs | Explicit language-standard coverage | Partial | workflows docs are clearer than spec-kit integration promises. |
| Shell standards | Indirect/limited integration in spec validation docs | Explicit language-standard coverage | Partial | Shell contract guidance is stronger in workflows docs. |
| JSON/JSONC standards | Indirect/limited integration in spec validation docs | Explicit language-standard coverage | Partial | JSON handling not equally reflected in spec validation promises. |
| Verification claims | Promises automated validation/indexing flow | Defines verification expectations by standard | Partial | Claim/implementation gap around immediate index visibility. |
| Command contracts | `generate-context.js` documented as unified context save/index | Standards docs do not document learning-delta contract parity | Misaligned | Learning-delta behavior is documented in one side only. |
| Documentation promises vs scripts | Some promises overstate one-step outcomes | Standards docs generally match static references | Partial | Strongest mismatch occurs in memory indexing expectations. |

## Findings

### Critical
1. **C10-F001 [CRITICAL]** - `generate-context.js` command contract promises Learning Delta Calculation (Knowledge/Uncertainty/Context weighted 0.4/0.35/0.25), while `workflows-code--opencode` does not provide equivalent learning-delta contract guidance, causing execution ambiguity.
2. **C10-F002 [CRITICAL]** - `system-spec-kit` documentation implies one-step "generate context -> indexed/available" behavior, but practical immediate visibility can require separate MCP index scan/server conditions; automation is overstated.

### High/Important
3. **C10-F003** - `workflows-code--opencode` documents five language standards (JS/TS/Python/Shell/JSON), while `system-spec-kit` spec-validation integration appears disproportionately JS/TS-oriented.
4. **C10-F004** - Both claim evidence-based conventions, but citation granularity differs: workflows references are more often tied to concrete script locations, while spec-kit validation references are less consistently line-precise.
5. **C10-F005** - `system-spec-kit` memory-tier model is richer (constitutional->deprecated), while cross-skill integration expectations are not equally explicit in workflows docs, creating discoverability/contract drift.

## Count Preservation (from completed C10 scan)
- Total findings: **85**
- Critical findings: **5**
- Top issues: **C10-F001, C10-F002, C10-F003**

## Conclusion
Primary misalignments are contract-level (what users are told will happen) rather than pure implementation defects. Highest-risk gaps are around memory indexing immediacy and learning-delta expectation parity across skills.
