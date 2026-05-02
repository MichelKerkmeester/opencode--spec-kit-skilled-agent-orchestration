# Review Findings: Wave 5, Agent A5

## Metadata
- Dimension: maintainability
- Files Reviewed: 14 command .md files (6 memory + 8 spec_kit)
- Model: gpt-5.3-codex
- Effort: xhigh
- Wave: 5 of 5

## Findings

### [F-050] [P1] Spec_kit files do not share one structural skeleton
- **Evidence**: complete.md starts command at L29 without consolidated setup section. All others have setup-before-command pattern.
- **Impact**: No reusable section-order template across spec_kit commands.

### [F-051] [P2] Unified setup phase numbering inconsistent (0 vs 1)
- **Evidence**: plan/implement/phase/deep-research use "## 0."; debug/handover/resume use "## 1."
- **Fix**: Standardize numbering.

### [F-052] [P2] Consolidated prompt invocation phrase not standardized
- **Evidence**: Two variants: "EXECUTE THIS SINGLE CONSOLIDATED PROMPT:" vs "WITHIN YAML EXECUTION, RUN THIS SINGLE CONSOLIDATED PROMPT TEMPLATE:"
- **Fix**: Unify phrasing.

### [F-053] [P2] FIRST MESSAGE PROTOCOL guardrail only in subset
- **Evidence**: Present in plan/phase/deep-research but not implement/debug/handover/resume.
- **Fix**: Apply consistently or remove.

### [F-054] [P1] complete.md mixes execution modes with feature flags
- **Evidence**: :with-research and :auto-debug treated as modes but map differently from :auto/:confirm.
- **Impact**: Hidden mode vs flag taxonomy makes edits error-prone.

### [F-055] [P1] Internal contradiction in save.md tool usage guidance
- **Evidence**: Frontmatter excludes Write/Edit, workflow text says "use Write tool", Appendix excludes them.
- **Note**: Overlaps with F-004 (same root cause, maintainability angle).

### [F-056] [P2] Error-handling pattern consistent in memory but fragmented in spec_kit
- **Evidence**: All 6 memory commands have explicit error-handling sections. Only 2 of 8 spec_kit commands do.
- **Fix**: Add error-handling sections to all spec_kit commands.

### [F-057] [P2] Formatting conventions not uniform (minor)
- **Evidence**: Duplicate separators in debug.md, table style varies between files.

### [F-058] [P1] Markdown-to-YAML ownership contract not uniformly defined
- **Evidence**: plan.md says load YAML first, deep-research.md says markdown owns setup, handover/resume say within-YAML templates.
- **Impact**: Source-of-truth boundary differs by file.

## Summary
- Total findings: 9 (P0=0, P1=4, P2=5)
- newFindingsRatio: 0.16
