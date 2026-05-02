# Review Iteration 2: Security - Input Validation, Path Traversal, Injection, ReDoS

## Focus
Security dimension: input validation boundaries, path traversal in V8 sibling scan, template injection vectors, and regex safety.

## Scope
- Review target: validate-memory-quality.ts (V8 sibling scan, resolveSpecFolderPath), input-normalizer.ts (validateInputData, RawInputData), collect-session-data.ts (regex patterns, data flow)
- Spec refs: Rec 1 (filesChanged), Rec 5 (V8 sibling allowlist)
- Dimension: security

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| validate-memory-quality.ts | — | 7/10 | — | — |
| input-normalizer.ts | — | 8/10 | — | — |
| collect-session-data.ts | — | 9/10 | — | — |

## Findings

### P2-001: No array-length or item-length limits on keyDecisions and filesChanged/filesModified inputs
- Dimension: security
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:893-904] -- `keyDecisions` and `filesModified`/`filesChanged` validated only for type (must be array) but individual string entries and total array length are uncapped, while `sessionSummary` has a 50,000-char cap and `triggerPhrases` entries have 200-char caps.
- Impact: A malformed or adversarial input could pass an arbitrarily large `keyDecisions` array (e.g., 10,000 decision strings of unlimited length) through validation. This flows into `transformKeyDecision` which calls `.match()` and string concatenation per item, and into observation arrays. Practical risk is low (input comes from AI-composed JSON, not external users), but inconsistent with the validation discipline applied to other fields.
- Final severity: P2

### P2-002: resolveSpecFolderPath walks entire directory tree from cwd to filesystem root
- Dimension: security
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:498-531] -- The function starts at `process.cwd()` and iterates `path.dirname(currentDir)` until root, building candidate paths via `path.resolve(currentDir, trimmedSpecFolder)`. With a crafted `specFolder` containing `../` components, resolution could reach arbitrary directories.
- Impact: The resolved path is only used for `statSync` (directory existence check) and `readdirSync` (listing directory entries matching `^\d{3}-` pattern). No file contents are read from the resolved path. The attacker would need to control the specFolder CLI argument, and the only information leaked is whether certain directory names exist. In the deployment context (local AI tooling, not a web service), this is informational only.
- Final severity: P2

### P2-003: Sibling scan adds all matching directories from parent without depth limit
- Dimension: security
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:562-583] -- The sibling scan reads `path.dirname(resolvedSpecFolder)` and adds ALL entries matching `^\d{3}-` to the allowlist. If the resolved spec folder is at a high-level directory (e.g., due to P2-002's path resolution), the sibling scan could add many unrelated directories to the allowlist.
- Impact: This would weaken cross-spec contamination detection (V8 rule) by over-populating the allowlist. However, this requires both: (a) a crafted specFolder that resolves to an unexpected parent, and (b) that parent having `\d{3}-` prefixed subdirectories. In practice, the spec folder structure is consistent and user-controlled. The risk is that false negatives in contamination detection could occur if the spec folder path is unusual.
- Final severity: P2

## Cross-Reference Results
### Core Protocols
- Confirmed: Input validation covers required fields, type checks, and string length limits for primary fields (sessionSummary, triggerPhrases, observations.narrative)
- Confirmed: Regex patterns in collect-session-data.ts use non-greedy quantifiers with clear terminators -- no ReDoS risk
- Confirmed: V8 contamination detection remains blockOnWrite=true, blockOnIndex=true (high severity rule)
- Unknowns: Template injection via Handlebars -- would need to verify triple-stache usage in templates (out of scope for these 9 files)

### Overlay Protocols
- Not applicable (no skill/agent/feature-catalog review)

## Ruled Out
- **ReDoS in collect-session-data.ts**: Examined all regex patterns (`completionKeywords`, `resolutionKeywords`, `pendingWorkKeywords`, `taskPatterns`). All use `\b` word boundaries and non-greedy `.+?` with explicit terminators `[.!?\n]|$`. No nested quantifiers or alternation-within-repetition patterns that could cause catastrophic backtracking. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:354-509]
- **JSON.parse(JSON.stringify) injection**: Deep clone pattern at line 388 strips functions and non-serializable values. Standard JSON round-trip, no code execution vector. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:388]
- **Template injection via sessionSummary**: Values are inserted into Handlebars templates. Standard Handlebars `{{ }}` auto-escapes HTML. Would only be exploitable if triple-stache `{{{ }}}` is used, which is outside this file set. Rated as non-finding pending template review.
- **Open-ended RawInputData index signature**: The `[key: string]: unknown` allows arbitrary properties but `validateInputData` warns on unknown keys. These extra fields are not processed by downstream code. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:101]

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1-904] -- RawInputData interface, validateInputData function, normalizeInputData functions
- [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:1-590] -- V8 rule metadata, resolveSpecFolderPath, extractAllowedSpecIds, sibling scan
- [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1-872] -- Regex patterns, session status detection, data flow

## Assessment
- Confirmed findings: 3 (all P2)
- New findings ratio: 1.00
- noveltyJustification: First security-focused iteration; all 3 findings are new discoveries with no prior findings to compare against.
- Dimensions addressed: [security]

## Reflection
- What worked: Targeted grep for security-sensitive patterns (readdir, path.resolve, regex, JSON.parse, sanitize, validate) efficiently identified all relevant code paths without reading entire large files.
- What did not work: N/A -- first security iteration, approach was productive.
- Next adjustment: Traceability dimension next -- cross-reference spec.md claims against actual implementation.
