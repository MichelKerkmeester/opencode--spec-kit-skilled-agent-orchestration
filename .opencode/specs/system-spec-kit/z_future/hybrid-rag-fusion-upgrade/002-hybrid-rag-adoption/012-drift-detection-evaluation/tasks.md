---
title: "Tasks [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/012-drift-detection-evaluation/tasks]"
description: "1. Document the current advisory integrity boundary using .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts, .opencode/skill/system-spec-kit/mcp_server/t..."
trigger_phrases:
  - "tasks"
  - "012"
  - "drift"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: 012-drift-detection-evaluation

1. Document the current advisory integrity boundary using `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, and `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`.
2. Create an applicability matrix for the remaining Mex checker families against Public spec and memory surfaces.
3. Define fixture, false-positive, and promotion-gate evidence needed before any checker expansion is approved.
4. Verify the packet with `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/012-drift-detection-evaluation --strict`.
