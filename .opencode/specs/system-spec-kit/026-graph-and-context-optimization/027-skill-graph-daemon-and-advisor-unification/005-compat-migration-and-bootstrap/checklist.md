---
title: "027/005 — Checklist"
description: "Acceptance verification for compat migration + bootstrap."
importance_tier: "high"
contextType: "implementation"
---
# 027/005 Checklist

## P0 (HARD BLOCKER)
- [ ] `skill_advisor.py` shim detects daemon + routes to native; falls back to local
- [ ] Plugin bridge detects daemon + delegates to `advisor_recommend`
- [ ] Phase 025 `--stdin` mode preserved
- [ ] Phase 026 SIGKILL escalation + workspace cache key + shared disable flag preserved
- [ ] Install guide has daemon bootstrap + native registration + rollback sections
- [ ] Manual-testing playbook has native-path scenarios
- [ ] Supersession redirect metadata renders in brief

## P1 (Required)
- [ ] `--force-local` / `--force-native` flags for testing
- [ ] Archive / future / rolled-back status surfaces render correctly
- [ ] Python-shim path preserved for scripted callers
- [ ] `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` honored across all compat paths
- [ ] Integration tests: shim + plugin both exercise corpus + match native

## P2 (Suggestion)
- [ ] Deprecation notice in Python CLI pointing at MCP tool
- [ ] CLAUDE.md Gate 2 fallback mentions native path

## Integration / Regression
- [ ] Phase 025 + Phase 026 regressions none introduced
- [ ] Full vitest suite green
- [ ] TS build clean
- [ ] Install-guide walkthrough on fresh checkout succeeds (manual)

## Research conformance
- [ ] D4 native TypeScript path primary; Python CLI as compat shim
- [ ] D7 shim preserves all existing callers + disable flags
- [ ] D8 plugin/bridge stays as adapter; backend routes native; no premature deprecation
- [ ] F2 supersession: successor default + old-name redirect
- [ ] F4 rollback: additive; authored metadata preserved
- [ ] F5 archive/future: routed-exclusion + status surface
