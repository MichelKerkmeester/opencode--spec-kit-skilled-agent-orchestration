---
title: "Doc Surface Alignment: Search Fusion Changes"
status: planned
level: 2
type: implementation
parent: 017-research-search-fusion-tuning
created: 2026-04-13
---

# Doc Surface Alignment: Search Fusion Changes

Update all documentation surfaces affected by the 017 search fusion implementation:
- Length penalty removed (no-op in cross-encoder.ts)
- Reranker cache telemetry added (hits/misses/staleHits/evictions)
- Continuity search profile added (semantic 0.52, keyword 0.18, recency 0.07, graph 0.23)
- MIN_RESULTS_FOR_RERANK raised from 2 to 4

## Surfaces to Check

### README.md / ARCHITECTURE.md
- Does the repo README mention search configuration or ranking behavior?
- Does ARCHITECTURE.md describe the search pipeline stages? Update if it mentions length penalties or rerank thresholds.

### Commands
- `.opencode/command/memory/search.md` - does it describe ranking behavior, reranking thresholds, or search profiles?
- `.opencode/command/memory/manage.md` - does it mention reranker status or telemetry?

### Agent definitions
- `.opencode/agent/context.md` - does it reference search behavior?
- `AGENTS.md` - does it describe search capabilities?

### Skill files
- `.opencode/skill/system-spec-kit/SKILL.md` - does it describe search configuration?
- `.opencode/skill/system-spec-kit/references/` - any search-related reference docs?

### Skill assets
- `.opencode/skill/system-spec-kit/mcp_server/configs/README.md` - describes search-weights.json, needs update about continuity profile
- `.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json` - does it need a continuity section?

### Templates
- Any spec-kit templates that reference search behavior?

### Feature catalog / Manual testing playbook
- Search-related scenarios that reference old thresholds or length penalty behavior

## Rules
- Only update docs that actually reference changed behavior
- Don't add new documentation where none exists
- Keep changes minimal and accurate
