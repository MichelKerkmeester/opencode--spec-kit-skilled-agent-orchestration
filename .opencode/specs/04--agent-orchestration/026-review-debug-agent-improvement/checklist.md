---
title: "Checklist"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Checklist

<!-- ANCHOR:protocol -->
## P0 - Must Pass
- [x] All 15 files modified with correct adversarial protocol content
- [x] No broken markdown/TOML syntax — TOML validated via `tomli`, markdown structure verified
- [x] Section numbering consistent within each file
- [x] Cross-references resolve (e.g., "Section 9.1" exists)
- [x] TOML string escaping correct in .codex files — all 3 parse successfully

<!-- /ANCHOR:protocol -->
## P1 - Should Pass
- [x] Same behavioral content across all 5 runtime directories per agent — grep confirmed 70 occurrences (consistent per-agent, per-directory counts)
- [x] Tool name adaptations correct for Gemini (grep_search, read_file, etc.)
- [x] Fast Path skip behavior documented for adversarial protocols
- [x] No changes to agents outside review/debug/ultra-think

## P2 - Nice to Have
- [x] Summary tables use consistent formatting
- [x] New sections follow existing heading level conventions
