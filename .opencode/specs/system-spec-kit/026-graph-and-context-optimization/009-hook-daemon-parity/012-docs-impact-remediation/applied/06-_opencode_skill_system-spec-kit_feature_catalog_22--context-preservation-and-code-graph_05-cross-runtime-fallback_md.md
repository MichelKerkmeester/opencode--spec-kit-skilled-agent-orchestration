---
title: "Applied Change Report: 05-cross-runtime-fallback.md"
description: "Documents the packet 012 remediation applied to the cross-runtime fallback feature-catalog entry."
contextType: "applied-report"
---

# Applied: .opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md

## Source Flagging
- Sub-packets: 10
- Severity (from merged report): HIGH

## Changes Applied
- Replaced the stale Copilot runtime description in `## 1. OVERVIEW` so it no longer points to repo-scoped `.github/hooks/*.json` wiring and now names `.claude/settings.local.json` as the effective prompt/startup wrapper surface.
  - Before: `Copilot CLI uses repo-scoped \`.github/hooks/*.json\` wiring, but prompt-time context is delivered through a Spec Kit managed block...`
  - After: `Copilot CLI uses the shared \`.claude/settings.local.json\` matcher wrappers as its effective prompt/startup surface...`
  - Sub-packet(s): 10
- Updated the Copilot capability note in `## 2. CURRENT REALITY` to describe the top-level writer-backed `UserPromptSubmit` and `SessionStart` wrappers instead of generic repo-hook refresh wording.
  - Before: `For Copilot, \`enabled\` means repo hooks can refresh custom instructions and compact-cache state...`
  - After: `For Copilot, \`enabled\` means the shared \`.claude/settings.local.json\` wrappers are present in a Copilot-safe shape and can run the top-level writer commands on \`UserPromptSubmit\` and \`SessionStart\`...`
  - Sub-packet(s): 10

## Evidence Links
- Merged report: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/merged-impact-report.md:39`
- Per-sub-packet evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/10-impact.md:18-19`
- Per-sub-packet evidence detail: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/10-impact.md:39-41`
- Implementation evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/010-copilot-wrapper-schema-fix/implementation-summary.md:22-44`
- Implementation evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/011-copilot-writer-wiring/implementation-summary.md:22-89`

## Verification
- Confirmed frontmatter still parses in the target file and the applied-report file.
- Confirmed anchors are still paired: no HTML anchor blocks were present before or after the edit.
- Confirmed no unrelated content was deleted; only the Copilot sentences in `## 1. OVERVIEW` and `## 2. CURRENT REALITY` changed.

## Deferred / Unchanged
- No suggested changes were deferred. The merged report identified only the Copilot fallback wording in this file, and both flagged sections were updated.
