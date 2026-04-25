---
title: "Resource Map — Code Graph System + Skill Advisor System refinement — investigate algorithm/correctness, performance, UX, observability, and evolution (RQ-01 through RQ-10 in spec.md)"
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 90
- **By category**: READMEs=0, Documents=24, Commands=0, Agents=0, Skills=37, Specs=0, Scripts=21, Tests=5, Config=3, Meta=0
- **Missing on disk**: 57
- **Scope**: research convergence output for 015-code-graph-advisor-refinement
- **Generated**: 2026-04-25T03:21:37.689Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/settings.json (empty hooks) | Cited | MISSING | Citations=1; Iterations=1 |
| .gemini/settings.json:1-40 (no parallel hooks schema) | Cited | MISSING | Citations=1; Iterations=1 |
| absent-grep vi.resetModules\|vi.isolateModules in those test files | Cited | MISSING | Citations=1; Iterations=1 |
| bench/scorer-bench.ts schema | Cited | MISSING | Citations=1; Iterations=1 |
| code-graph/lib/readiness-contract.ts:43,103-116 | Cited | MISSING | Citations=1; Iterations=1 |
| grep runtime === across skill-advisor/lib/ | Cited | MISSING | Citations=1; Iterations=1 |
| handlers/index.ts (only 3 read-side tools) | Cited | MISSING | Citations=1; Iterations=1 |
| hooks/copilot/user-prompt-submit.ts:1-10 comment | Cited | MISSING | Citations=1; Iterations=1 |
| hooks/gemini/user-prompt-submit.ts:4-5,90-94,166-175 | Cited | MISSING | Citations=1; Iterations=1 |
| iter-001 F2/F3 | Cited | MISSING | Citations=1; Iterations=1 |
| iter-2 | Cited | MISSING | Citations=1; Iterations=1 |
| iter-002 F12/F13 | Cited | MISSING | Citations=1; Iterations=1 |
| iter-003 F15 Cat A/B/C + F17 | Cited | MISSING | Citations=1; Iterations=1 |
| iter-004 F23.1 | Cited | MISSING | Citations=1; Iterations=1 |
| iter-004 F23.1 + F25 | Cited | MISSING | Citations=1; Iterations=1 |
| iterations/iteration-008.md F37 row 1+2 | Cited | MISSING | Citations=1; Iterations=1 |
| lib/skill-advisor-brief.ts:384-387 (JSDoc literally lists 'tests AND session reset hooks' as use cases) | Cited | MISSING | Citations=1; Iterations=1 |
| ls .opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/ | Cited | MISSING | Citations=1; Iterations=1 |
| ls .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/ | Cited | MISSING | Citations=1; Iterations=1 |
| ls /.copilot/ (not found) | Cited | MISSING | Citations=1; Iterations=1 |
| metrics.ts:294,316,392,405 | Cited | MISSING | Citations=1; Iterations=1 |
| render.ts:150,156 | Cited | MISSING | Citations=1; Iterations=1 |
| skill-advisor-brief.ts:156-173,199-218,496-502 | Cited | MISSING | Citations=1; Iterations=1 |
| skill-advisor/lib/promotion/weight-delta-cap.ts:7,36-56 | Cited | MISSING | Citations=1; Iterations=1 |

---

## 5. Skills

> `.opencode/skill/**` including `SKILL.md`, `references/`, `assets/`, `feature_catalog/`, `manual_testing_playbook/`, `scripts/`, `shared/`, `mcp_server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts:350-358,416-424,436-445,451-460,520-533,555-566 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts:614,647,660,672 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/package.json | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/scorer-bench.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/cache-invalidation.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/rebuild-from-source.ts (grep lock\|mutex\|concurrent → 0 hits) | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts:49-56,123,129,135,171 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/semantic-lock.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/shadow-cycle.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/shadow-cycle.ts:124,168,189 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/ablation.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/graph-causal.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/types.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts:8-20 (iter 1 F6) | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts | Cited | OK | Citations=3; Iterations=3 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/routing-accuracy/labeled-prompts.jsonl | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-runtime-parity.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts | Cited | OK | Citations=3; Iterations=3 |
| .opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/scorer/native-scorer.vitest.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| code-graph/handlers/context.ts | Cited | MISSING | Citations=1; Iterations=1 |
| code-graph/handlers/query.ts | Cited | MISSING | Citations=1; Iterations=1 |
| code-graph/handlers/status.ts | Cited | MISSING | Citations=1; Iterations=1 |
| code-graph/lib/ensure-ready.ts | Cited | MISSING | Citations=1; Iterations=1 |
| code-graph/lib/ops-hardening.ts | Cited | MISSING | Citations=1; Iterations=1 |
| code-graph/lib/startup-brief.ts | Cited | MISSING | Citations=1; Iterations=1 |
| handlers/advisor-recommend.ts | Cited | MISSING | Citations=1; Iterations=1 |
| handlers/index.ts | Cited | MISSING | Citations=1; Iterations=1 |
| hooks/claude/user-prompt-submit.ts | Cited | MISSING | Citations=1; Iterations=1 |
| hooks/codex/user-prompt-submit.ts | Cited | MISSING | Citations=1; Iterations=1 |
| hooks/copilot/user-prompt-submit.ts | Cited | MISSING | Citations=1; Iterations=1 |
| hooks/gemini/user-prompt-submit.ts | Cited | MISSING | Citations=1; Iterations=1 |
| lib/promotion/rollback.ts | Cited | MISSING | Citations=4; Iterations=4 |
| lib/prompt-cache.ts | Cited | MISSING | Citations=1; Iterations=1 |
| mcp_server/skill-advisor/bench/safety-bench.ts | Cited | MISSING | Citations=1; Iterations=1 |
| prompt-cache.ts | Cited | MISSING | Citations=1; Iterations=1 |
| render.ts | Cited | MISSING | Citations=1; Iterations=1 |
| schemas/advisor-tool-schemas.ts | Cited | MISSING | Citations=1; Iterations=1 |
| skill-advisor/lib/promotion/rollback.ts | Cited | MISSING | Citations=1; Iterations=1 |
| skill-advisor/lib/promotion/shadow-cycle.ts | Cited | MISSING | Citations=1; Iterations=1 |
| skill-advisor/lib/promotion/two-cycle-requirement.ts | Cited | MISSING | Citations=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| skill-advisor/tests/legacy/advisor-runtime-parity.vitest.ts | Cited | MISSING | Citations=1; Iterations=1 |
| tests/handlers/advisor-recommend.vitest.ts:269-278,303-343 | Cited | MISSING | Citations=1; Iterations=1 |
| tests/legacy/advisor-brief-producer.vitest.ts | Cited | MISSING | Citations=1; Iterations=1 |
| tests/legacy/advisor-prompt-cache.vitest.ts | Cited | MISSING | Citations=1; Iterations=1 |
| tests/promotion/promotion-gates.vitest.ts:14,213,233,255 (only 3 callers, all tests) | Cited | MISSING | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/settings.local.json | Cited | OK | Citations=4; Iterations=4 |
| .gemini/settings.json | Cited | OK | Citations=1; Iterations=1 |
| mcp_server/package.json | Cited | MISSING | Citations=1; Iterations=1 |

---
