---
title: "Checklist: Gemini CLI Hook Porting [024/022]"
description: "8 items across P1/P2 for phase 022."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Verification Checklist: Phase 022 — Gemini CLI Hook Porting

<!-- SPECKIT_LEVEL: 2 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Verification Protocol
Template compliance shim section. Legacy phase content continues below.

## Pre-Implementation
Template compliance shim section. Legacy phase content continues below.

## Code Quality
Template compliance shim section. Legacy phase content continues below.

## Testing
Template compliance shim section. Legacy phase content continues below.

## Security
Template compliance shim section. Legacy phase content continues below.

## Documentation
Template compliance shim section. Legacy phase content continues below.

## File Organization
Template compliance shim section. Legacy phase content continues below.

## Verification Summary
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:protocol -->
Template compliance shim anchor for protocol.
<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
Template compliance shim anchor for pre-impl.
<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
Template compliance shim anchor for code-quality.
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:security -->
Template compliance shim anchor for security.
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
Template compliance shim anchor for docs.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
Template compliance shim anchor for file-org.
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

#### P1 — Must Pass

- [x] [P1] GeminiHookInput/Output types defined [Code: hooks/gemini/shared.ts] [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] SessionStart hook detects startup/resume/clear and outputs context [Code: hooks/gemini/session-prime.ts] [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] PreCompress hook caches critical context to temp file [Code: hooks/gemini/compact-cache.ts] [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] BeforeAgent hook injects cached context with sanitized payload [Code: hooks/gemini/compact-inject.ts, F055 fixed] [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] SessionEnd hook saves session state on Gemini's single `SessionEnd` lifecycle event [Code: hooks/gemini/session-stop.ts] [EVIDENCE: verified in implementation-summary.md]
- [ ] [P1] `.gemini/settings.json` registration verified for the active workspace [Known limitation: no checked-in repo file; local workspace path must be verified]

### P2 — Should Pass

- [x] Shared parseGeminiStdin and formatGeminiOutput utilities [Code: hooks/gemini/shared.ts] [EVIDENCE: verified in implementation-summary.md]
- [ ] SessionEnd token tracking parses Gemini transcript token usage [Limitation: current implementation does not parse Gemini transcript token usage]
- [ ] Nested spec-folder detection preserves deep phase paths [Limitation: regex-based detection truncates deeper paths]
- [ ] F056: transcript-size hardening is complete [Open: `session-stop.ts` has `MAX_TRANSCRIPT_BYTES`, but `compact-cache.ts` still uses unbounded `readFileSync`]