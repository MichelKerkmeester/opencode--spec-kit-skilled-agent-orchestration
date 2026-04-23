# Applied: .opencode/README.md

## Source Flagging
- Sub-packets: 01, 02, 07
- Severity (from merged report): HIGH

## Changes Applied
- Replaced the directory-structure reference to `skill/scripts/` with the native Skill Advisor package path and description.
  Before: `.opencode/README.md:76,86` described `skill/scripts/` as the skill-routing engine and setup location.
  After: `.opencode/README.md:76,86` now points to `skill/system-spec-kit/mcp_server/skill-advisor/` and describes hook-first/runtime-adapter delivery plus `advisor_recommend`, while keeping `skill_advisor.py` as a compatibility caller.
  Flagged by: 02
- Rewrote the agent-routing summary so Gate 2 no longer presents `skill_advisor.py` as the primary automatic path.
  Before: `.opencode/README.md:113` said `Automatic via Gate 2 (skill_advisor.py)`.
  After: `.opencode/README.md:113` says Gate 2 uses runtime hook briefs first, with native advisor tools and `skill_advisor.py` as fallbacks.
  Flagged by: 01, 02
- Rewrote the Gate 2 action text to make the automatic Skill Advisor hook brief primary and the native/CLI paths fallback.
  Before: `.opencode/README.md:275` said `Run skill_advisor.py "[request]" --threshold 0.8`.
  After: `.opencode/README.md:275` says to use the automatic hook brief first, then `advisor_recommend` or `skill_advisor.py` as compatibility/scripted fallback.
  Flagged by: 01, 02, 07
- Rewrote the quick-start "Invoking Skills" automatic bullet to match hook-first runtime behavior.
  Before: `.opencode/README.md:305` said Gate 2 auto-routes based on `skill_advisor.py` confidence scores.
  After: `.opencode/README.md:305` says Gate 2 uses runtime hook briefs first and falls back to the native advisor surface or `skill_advisor.py`.
  Flagged by: 01, 07

## Evidence Links
- Merged report row: `impact-analysis/merged-impact-report.md:34`, expanded section `impact-analysis/merged-impact-report.md:52-64`
- Per-sub-packet evidence: `impact-analysis/01-impact.md:22,35-38`
- Per-sub-packet evidence: `impact-analysis/02-impact.md:18,29-32`
- Per-sub-packet evidence: `impact-analysis/07-impact.md:19,28-31`

## Verification
- Frontmatter parses: confirmed with `ruby` YAML parse against `.opencode/README.md`
- Anchors are still paired: confirmed by matching `<!-- ANCHOR:* -->` and `<!-- /ANCHOR:* -->` tags
- No unrelated content was deleted: confirmed via `git diff -- .opencode/README.md`, which only shows the four flagged README passages changing

## Deferred / Unchanged
- None. All suggested changes for `.opencode/README.md` from sub-packets 01, 02, and 07 were applied within the scoped sections.
