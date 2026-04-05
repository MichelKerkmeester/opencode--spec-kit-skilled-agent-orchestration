OpenAI Codex v0.115.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d0a29-1ff5-7790-b170-124fe550e453
--------
user
# Role: Test Analyst (A2) — Iteration 004

## Mission
Analyze Memory Handback protocol success rate across CLIs and where handback JSON fails minimum payload guidance.

## Research Question
**Q15.** Memory Handback protocol success rate across CLIs — where does handback JSON fail minimum payload guidance?

## Files to Examine
- `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts` — How handback data is loaded
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` — How handback payloads are validated
- `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/` — Phase 015 spec docs
- Search for "handback", "handback-json", "outsourced" in the scripts directory
- Search for test files covering handback scenarios

## Known Context
- Phase 015 established the outsourced-agent handback contract
- 4 CLIs can generate handback JSON when an AI agent saves memory context
- Handback JSON has a minimum payload schema that CLIs must conform to
- "Live proof still thinner than desired" for phase 015

## Deliverable
1. Document the handback JSON minimum payload schema
2. For each CLI, trace how handback data flows through the pipeline
3. Identify validation gaps: What malformed handback payloads slip through?
4. Find test coverage for handback scenarios per CLI
5. Propose minimum tests needed per CLI for handback confidence
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: cocoindex_code starting
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: code_mode starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’ll analyze the handback flow end-to-end in the specified scripts and Phase 015 docs, then map CLI-by-CLI success/failure points and test coverage. First I’m running quick discovery (including skill routing and semantic search) so we can ground conclusions in concrete code paths.
exec
/bin/zsh -lc 'rg -n "handback|handback-json|outsourced" .opencode/skill/system-spec-kit/scripts .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:3:description: "External CLI handback protocol for session memory saves: hard-fail JSON input, next-step persistence, redact-and-scrub security, and post-010 awareness of sufficiency/contamination gates."
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:4:trigger_phrases: ["outsourced agent memory", "cli agent context", "memory handback", "external agent save", "generate-context json"]
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:36:| **Origin** | Evolved from `022-hybrid-rag-fusion/013-outsourced-agent-memory/` |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:56:2. **CLI handback documentation**: What the 4 CLI skill docs and prompt templates tell the calling AI to produce
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:59:The original 013 spec addressed layers 1 and 2. This rewrite adds layer 3 awareness: since 010's phases shipped, the pipeline now has post-normalization gates that can reject outsourced saves even when the JSON input is valid and normalizes successfully.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:63:Ensure the outsourced agent handback protocol produces saves that survive the full 010 pipeline as far as caller-provided evidence allows, covering not just input validation, but also sufficiency evaluation, contamination detection, and post-render quality scoring. Callers must know what minimum payload richness is required, what rejection codes they may encounter, and that file-backed saves bypass `QUALITY_GATE_ABORT` without bypassing all quality-related warnings.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:76:- Documentation of post-010 pipeline gates affecting outsourced saves
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:77:- Snake_case field acceptance in the handback protocol
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:83:- Modifying native capture extractors (outsourced saves use JSON-mode, not native capture)
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:93:| `scripts/tests/outsourced-agent-handback-docs.vitest.ts` | Create | Guard the 8 handback docs and feature catalog against post-010 drift |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:99:| `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md` | Modify | Align the catalog entry to phase `015` and the post-010 gate contract |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:113:| REQ-003 | All 8 CLI docs describe the handback protocol with redact-and-scrub | 4 SKILL.md + 4 prompt templates contain identical 7-step flow with `MEMORY_HANDBACK_START`/`END` delimiters |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:122:| REQ-007 | Callers aware that cross-spec content triggers contamination gate | CLI docs and spec document that `CONTAMINATION_GATE_ABORT` fires when handback JSON contains content about a different spec folder |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:135:- A representative manual-format JSON handback writes successfully and produces a fresh memory file for phase `015`
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:143:1. **Given** an explicit JSON path that does not exist, **when** `generate-context.js` loads the handback payload, **then** it stops with `EXPLICIT_DATA_FILE_LOAD_FAILED` and does not fall back to native capture.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:144:2. **Given** a handback payload that uses `next_steps`, **when** normalization runs, **then** the first item becomes `Next: ...`, later items become `Follow-up: ...`, and `NEXT_ACTION` reflects the first item.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:145:3. **Given** a valid-but-thin handback payload, **when** post-normalization sufficiency runs, **then** the save aborts with `INSUFFICIENT_CONTEXT_ABORT` before any new memory file is written.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:146:4. **Given** a handback payload that includes content from another spec, **when** post-render contamination checks run, **then** the save aborts with `CONTAMINATION_GATE_ABORT`.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:156:| Risk | Thin outsourced payloads silently fail post-normalization | High | REQ-006 documents minimum payload richness; CLI docs warn about `INSUFFICIENT_CONTEXT_ABORT` |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md:157:| Risk | Cross-spec content in handback data causes save rejection | Medium | REQ-007 documents contamination gate; redact-and-scrub guidance includes spec-scope awareness |
exec
/bin/zsh -lc "rg --files -g 'AGENTS.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
AGENTS.md
.opencode/specs/system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Analyze Memory Handback protocol success rate across CLIs and where handback JSON fails minimum payload guidance" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 621ms:
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.92,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !intent:memory, !memory, context, memory"
  }
]
codex
Quick status: skill routing recommended `system-spec-kit` with high confidence, and I located the key handback-related tests (`runtime-memory-inputs.vitest.ts` plus docs-alignment tests). Next I’m reading the exact loader/normalizer code and Phase 015 docs to extract the minimum payload contract and failure modes.
exec
/bin/zsh -lc 'wc -l .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     584 .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
    1157 .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
     912 .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
      76 .opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts
     237 .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md
    2966 total
exec
/bin/zsh -lc "rg -n \"MEMORY_HANDBACK_START|handback JSON|minimum payload|INSUFFICIENT_CONTEXT_ABORT|CONTAMINATION_GATE_ABORT|QUALITY_GATE_ABORT|QUALITY_GATE_FAIL\" .opencode/skill -g 'SKILL.md' -g '*prompt*'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/cli-gemini/assets/prompt_templates.md:367:<!-- MEMORY_HANDBACK_START -->
.opencode/skill/cli-gemini/assets/prompt_templates.md:392:const match = output.match(/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/);
.opencode/skill/cli-gemini/assets/prompt_templates.md:434:Valid JSON can still be rejected after normalization. File-backed handbacks skip stateless alignment and `QUALITY_GATE_ABORT`, but thin payloads fail with `INSUFFICIENT_CONTEXT_ABORT` and cross-spec payloads fail with `CONTAMINATION_GATE_ABORT`.
.opencode/skill/cli-copilot/assets/prompt_templates.md:349:<!-- MEMORY_HANDBACK_START -->
.opencode/skill/cli-copilot/assets/prompt_templates.md:374:const match = output.match(/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/);
.opencode/skill/cli-copilot/assets/prompt_templates.md:416:Valid JSON can still be rejected after normalization. File-backed handbacks skip stateless alignment and `QUALITY_GATE_ABORT`, but thin payloads fail with `INSUFFICIENT_CONTEXT_ABORT` and cross-spec payloads fail with `CONTAMINATION_GATE_ABORT`.
.opencode/skill/cli-gemini/SKILL.md:413:2. **Extract section**: After receiving agent output, extract the `MEMORY_HANDBACK` section using: `/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/`
.opencode/skill/cli-gemini/SKILL.md:424:**Post-010 save gates**: Valid JSON can still be rejected after normalization. File-backed handbacks skip the stateless alignment and `QUALITY_GATE_ABORT` checks, but they still fail with `INSUFFICIENT_CONTEXT_ABORT` when the payload is too thin and with `CONTAMINATION_GATE_ABORT` when it includes content from another spec.
.opencode/skill/cli-claude-code/assets/prompt_templates.md:461:<!-- MEMORY_HANDBACK_START -->
.opencode/skill/cli-claude-code/assets/prompt_templates.md:486:const match = output.match(/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/);
.opencode/skill/cli-claude-code/assets/prompt_templates.md:528:Valid JSON can still be rejected after normalization. File-backed handbacks skip stateless alignment and `QUALITY_GATE_ABORT`, but thin payloads fail with `INSUFFICIENT_CONTEXT_ABORT` and cross-spec payloads fail with `CONTAMINATION_GATE_ABORT`.
.opencode/skill/cli-copilot/SKILL.md:310:2. **Extract section**: After receiving agent output, extract the `MEMORY_HANDBACK` section using: `/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/`
.opencode/skill/cli-copilot/SKILL.md:321:**Post-010 save gates**: Valid JSON can still be rejected after normalization. File-backed handbacks skip the stateless alignment and `QUALITY_GATE_ABORT` checks, but they still fail with `INSUFFICIENT_CONTEXT_ABORT` when the payload is too thin and with `CONTAMINATION_GATE_ABORT` when it includes content from another spec.
.opencode/skill/cli-claude-code/SKILL.md:466:2. **Extract section**: After receiving agent output, extract the `MEMORY_HANDBACK` section using: `/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/`
.opencode/skill/cli-claude-code/SKILL.md:477:**Post-010 save gates**: Valid JSON can still be rejected after normalization. File-backed handbacks skip the stateless alignment and `QUALITY_GATE_ABORT` checks, but they still fail with `INSUFFICIENT_CONTEXT_ABORT` when the payload is too thin and with `CONTAMINATION_GATE_ABORT` when it includes content from another spec.
.opencode/skill/cli-codex/assets/prompt_templates.md:536:<!-- MEMORY_HANDBACK_START -->
.opencode/skill/cli-codex/assets/prompt_templates.md:561:const match = output.match(/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/);
.opencode/skill/cli-codex/assets/prompt_templates.md:603:Valid JSON can still be rejected after normalization. File-backed handbacks skip stateless alignment and `QUALITY_GATE_ABORT`, but thin payloads fail with `INSUFFICIENT_CONTEXT_ABORT` and cross-spec payloads fail with `CONTAMINATION_GATE_ABORT`.
.opencode/skill/cli-codex/SKILL.md:466:2. **Extract section**: After receiving agent output, extract the `MEMORY_HANDBACK` section using: `/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/`
.opencode/skill/cli-codex/SKILL.md:477:**Post-010 save gates**: Valid JSON can still be rejected after normalization. File-backed handbacks skip the stateless alignment and `QUALITY_GATE_ABORT` checks, but they still fail with `INSUFFICIENT_CONTEXT_ABORT` when the payload is too thin and with `CONTAMINATION_GATE_ABORT` when it includes content from another spec.
tool cocoindex_code.search({"query":"Where is outsourced agent handback JSON loaded and validated in system-spec-kit scripts? include loader and normalizer functions","limit":8,"refresh_index":false})
cocoindex_code.search({"query":"Where is outsourced agent handback JSON loaded and validated in system-spec-kit scripts? include loader and normalizer functions","limit":8,"refresh_index":false}) success in 6.11s:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md\",\n      \"language\": \"markdown\",\n      \"content\": \"# Outsourced agent handback protocol\\n\\n## 1. OVERVIEW\\n\\nOutsourced agent handback keeps external CLI save payloads aligned with the current `generate-context.js` contract. It enforces hard-fail validation for explicit JSON data files, persists `nextSteps` fields into memory observations, and now documents the post-010 save gates that can still reject a valid handback after normalization.\\n\\nWhen work is delegated to an external helper (like a different AI tool), the results need to come back in a clean format the memory system can understand. This feature makes sure that incoming data files are properly validated and that follow-up actions are captured, so nothing important gets lost when work passes between different tools.\\n\\n---\\n\\n## 2. CURRENT REALITY\\n\\nOutsourced-agent handback is now implemented and aligned across runtime behavior, regression tests, the 8 CLI handback docs, and the feature catalog.\\n\\nCurrent behavior is enforced in four slices:\",\n      \"start_line\": 1,\n      \"end_line\": 15,\n      \"score\": 0.6790405435642395\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md\",\n      \"language\": \"markdown\",\n      \"content\": \"# Outsourced agent handback protocol\\n\\n## 1. OVERVIEW\\n\\nOutsourced agent handback keeps external CLI save payloads aligned with the current `generate-context.js` contract. It enforces hard-fail validation for explicit JSON data files, persists `nextSteps` fields into memory observations, and now documents the post-010 save gates that can still reject a valid handback after normalization.\\n\\nWhen work is delegated to an external helper (like a different AI tool), the results need to come back in a clean format the memory system can understand. This feature makes sure that incoming data files are properly validated and that follow-up actions are captured, so nothing important gets lost when work passes between different tools.\\n\\n---\\n\\n## 2. CURRENT REALITY\\n\\nOutsourced-agent handback is now implemented and aligned across runtime behavior, regression tests, the 8 CLI handback docs, and the feature catalog.\\n\\nCurrent behavior is enforced in four slices:\",\n      \"start_line\": 1,\n      \"end_line\": 15,\n      \"score\": 0.6790405435642395\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md\",\n      \"language\": \"markdown\",\n      \"content\": \"# Feature Specification: Outsourced Agent Handback Protocol\\n\\nThis document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.\\n\\n\\n<!-- SPECKIT_LEVEL: 2 -->\\n<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->\\n\\n---\\n\\n<!-- ANCHOR:metadata -->\",\n      \"start_line\": 8,\n      \"end_line\": 18,\n      \"score\": 0.6772679149813552\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md\",\n      \"language\": \"markdown\",\n      \"content\": \"### Purpose\\n\\nEnsure the outsourced agent handback protocol produces saves that survive the full 010 pipeline as far as caller-provided evidence allows, covering not just input validation, but also sufficiency evaluation, contamination detection, and post-render quality scoring. Callers must know what minimum payload richness is required, what rejection codes they may encounter, and that file-backed saves bypass `QUALITY_GATE_ABORT` without bypassing all quality-related warnings.\\n<!-- /ANCHOR:problem -->\\n\\n---\\n\\n<!-- ANCHOR:scope -->\",\n      \"start_line\": 64,\n      \"end_line\": 71,\n      \"score\": 0.6262758805637656\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/16-03-26_22-22__next-steps.md\",\n      \"language\": \"markdown\",\n      \"content\": \"---\\ntitle: \\\"Next Steps [015-outsourced-agent-handback/16-03-26_22-22__next-steps]\\\"\\ndescription: \\\"File-backed handbacks still hit sufficiency and contamination gates after normalization, so the payload needs durable evidence and spec-local content.\\\"\\ntrigger_phrases:\\n  - \\\"system spec kit/022 hybrid rag fusion/010 perfect session capturing/015 outsourced agent handback\\\"\\n  - \\\"file backed\\\"\\n  - \\\"spec local\\\"\\n  - \\\"cli codex\\\"\\n  - \\\"tree thinning\\\"\\n  - \\\"post 010\\\"\\n  - \\\"save gate\\\"\\n  - \\\"minimum payload\\\"\\n  - \\\"outsourced agent handback docs\\\"\",\n      \"start_line\": 1,\n      \"end_line\": 13,\n      \"score\": 0.62564843059954\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/agent-11-cross-cli.md\",\n      \"language\": \"markdown\",\n      \"content\": \"- `015-outsourced-agent-handback/tasks.md:57` — hits: `.opencode/` — - [x] T012 Record current TypeScript check evidence: `npm run lint` in `.opencode/skill/system-spec-kit/scripts` passed (`tsc --noEmit`)\\n- `015-outsourced-agent-handback/tasks.md:61` — hits: `.opencode/` — - [x] T016 Run `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` on this spec folder and record the exit code\\n- `015-outsourced-agent-handback/tasks.md:85` — hits: `.opencode/` — - **Runtime loader**: `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`\\n- `015-outsourced-agent-handback/tasks.md:86` — hits: `.opencode/` — - **Normalization**: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`\\n- `015-outsourced-agent-handback/tasks.md:87` — hits: `.opencode/` — - **Next-action extraction**: `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts`\",\n      \"start_line\": 277,\n      \"end_line\": 281,\n      \"score\": 0.6175862703803432\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md\",\n      \"language\": \"markdown\",\n      \"content\": \"---\\ntitle: \\\"Outsourced Agent Handback Protocol\\\"\\ndescription: \\\"External CLI handback protocol for session memory saves: hard-fail JSON input, next-step persistence, redact-and-scrub security, and post-010 awareness of sufficiency/contamination gates.\\\"\\ntrigger_phrases: [\\\"outsourced agent memory\\\", \\\"cli agent context\\\", \\\"memory handback\\\", \\\"external agent save\\\", \\\"generate-context json\\\"]\\nimportance_tier: \\\"normal\\\"\\ncontextType: \\\"general\\\"\\n---\",\n      \"start_line\": 1,\n      \"end_line\": 7,\n      \"score\": 0.6019166208327249\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/plan.md\",\n      \"language\": \"markdown\",\n      \"content\": \"- **`outsourced-agent-handback-docs.vitest.ts`**: Keeps the 8 CLI handback docs and the feature catalog aligned on post-010 save-gate guidance.\\n- **4 `cli-*` skills + 4 prompt templates**: Tell the caller to extract handback data, redact and scrub it, include richer `FILES` metadata, and stop on explicit JSON-mode failures.\\n- **Feature catalog entry `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md`**: Tracks the handback protocol as a current phase `015` concern rather than a stale `013` snapshot.\",\n      \"start_line\": 65,\n      \"end_line\": 67,\n      \"score\": 0.5970442825839015\n    }\n  ],\n  \"total_returned\": 8,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [
      {
        "file_path": "specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md",
        "language": "markdown",
        "content": "# Outsourced agent handback protocol\n\n## 1. OVERVIEW\n\nOutsourced agent handback keeps external CLI save payloads aligned with the current `generate-context.js` contract. It enforces hard-fail validation for explicit JSON data files, persists `nextSteps` fields into memory observations, and now documents the post-010 save gates that can still reject a valid handback after normalization.\n\nWhen work is delegated to an external helper (like a different AI tool), the results need to come back in a clean format the memory system can understand. This feature makes sure that incoming data files are properly validated and that follow-up actions are captured, so nothing important gets lost when work passes between different tools.\n\n---\n\n## 2. CURRENT REALITY\n\nOutsourced-agent handback is now implemented and aligned across runtime behavior, regression tests, the 8 CLI handback docs, and the feature catalog.\n\nCurrent behavior is enforced in four slices:",
        "start_line": 1,
        "end_line": 15,
        "score": 0.6790405435642395
      },
      {
        "file_path": "specs/system-spec-kit/022-hybrid-rag-fusion/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md",
tool cocoindex_code.search({"query":"tests for runtime memory inputs handback next_steps snake_case and rejection codes","limit":8,"refresh_index":false})
cocoindex_code.search({"query":"tests for runtime memory inputs handback next_steps snake_case and rejection codes","limit":8,"refresh_index":false}) success in 66ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/078-speckit-test-suite/tasks.md\",\n      \"language\": \"markdown\",\n      \"content\": \"## L2: PHASE COMPLETION GATES\\n\\n### Gate 1: MCP Handlers Complete\\n- [ ] T001 test-session-learning.js implemented and passing\\n- [ ] T002 test-memory-handlers.js implemented and passing\\n- [ ] Handler tests cover all MCP tool entry points\\n\\n### Gate 2: Integration Complete\\n- [ ] T003 test-cognitive-integration.js implemented and passing\\n- [ ] End-to-end workflows validated\\n- [ ] Cognitive memory patterns verified\\n\\n### Gate 3: Scripts Complete\\n- [ ] T004 test-validation-system.js implemented and passing\\n- [ ] T005 test-extractors-loaders.js implemented and passing\\n- [ ] All script modules have test coverage\\n\\n### Gate 4: Framework Complete\\n- [ ] T006 test-five-checks.js implemented and passing\\n- [ ] T007 test_dual_threshold.py implemented and passing (pytest)\\n- [ ] Framework algorithms validated\",\n      \"start_line\": 159,\n      \"end_line\": 179,\n      \"score\": 0.5482022871573502\n    },\n    {\n      \"file_path\": \"specs/03--commands-and-skills/023-sk-deep-research-creation/research.md\",\n      \"language\": \"markdown\",\n      \"content\": \"## 10. TESTING & DEBUGGING\\n\\n### Test Strategies\\n\\n**Unit Testing**:\\n- Convergence detection function with various state inputs\\n- JSONL parsing and validation\\n- Strategy file update logic\\n\\n**Integration Testing**:\\n- Single iteration: dispatch @deep-research, verify state files updated correctly\\n- Multi-iteration: run 3 iterations, verify convergence detection triggers appropriately\\n- Stuck recovery: simulate 3 no-progress iterations, verify recovery behavior\\n\\n**End-to-End Testing**:\\n- Full loop on a simple research topic (e.g., \\\"What is markdown?\\\")\\n- Verify: state files created, research/research.md produced, memory saved\\n- Target: 3-5 iterations, completes in < 5 minutes\",\n      \"start_line\": 661,\n      \"end_line\": 678,\n      \"score\": 0.5424390518734707\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/16-03-26_22-23__updated-the-outsourced-agent-handback-docs-so.md\",\n      \"language\": \"markdown\",\n      \"content\": \"## 2. OVERVIEW\\n\\nUpdated the outsourced-agent handback docs so every CLI surface explains the post-010 save gates, richer FILE metadata, and the documented snake_case payload contract.\\n\\n**Key Outcomes**:\\n- Updated the outsourced-agent handback docs so every CLI surface explains the post-010 save gates,...\\n- Document the post-010 rejection codes directly in the caller-facing handback doc\\n- Use a dedicated vitest lane to keep the 8 CLI handback docs and the feature cata\\n\\n**Key Files:**\",\n      \"start_line\": 217,\n      \"end_line\": 226,\n      \"score\": 0.5399172286281271\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/016-tooling-and-scripts/plan.md\",\n      \"language\": \"markdown\",\n      \"content\": \"## 2. QUALITY GATES\\n\\n### Definition of Ready\\n- [ ] All 21 test IDs are resolved to a source prompt, command path, and evidence expectation.\\n- [ ] The playbook, review protocol, and feature catalog links are available from this phase folder.\\n- [ ] Sandbox targets exist for destructive checks (`bulk-delete`, malformed memories, generated phase folders, watcher temp files).\\n- [ ] MCP/runtime prerequisites are known for tests that require slash commands or `memory_save`.\\n- [ ] The `NEW-139` session-capturing scenario is sourced from the canonical `M-007` section, not reconstructed from memory.\",\n      \"start_line\": 39,\n      \"end_line\": 46,\n      \"score\": 0.5303982779993373\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"// ───────────────────────────────────────────────────────────────────\\n// MODULE: Runtime Memory Input Tests\\n// ───────────────────────────────────────────────────────────────────\\n// TEST: Runtime Memory Inputs\\n// Covers explicit data-file failures and next-steps normalization\\nimport fs from 'node:fs/promises';\\nimport os from 'node:os';\\nimport path from 'node:path';\\nimport { beforeEach, describe, expect, it, vi } from 'vitest';\\n\\nimport { normalizeQualityAbortThreshold } from '../core/config';\\nimport { collectSessionData } from '../extractors/collect-session-data';\\nimport { normalizeInputData, transformOpencodeCapture } from '../utils/input-normalizer';\",\n      \"start_line\": 1,\n      \"end_line\": 13,\n      \"score\": 0.5291721811918801\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/078-speckit-test-suite/spec.md\",\n      \"language\": \"markdown\",\n      \"content\": \"Without comprehensive coverage, regressions in the memory system, cognitive processing, and validation logic could go undetected.\\n\\n### Purpose\\nAchieve comprehensive test coverage by creating 8 new test files (~3,000 LOC) that validate all system-spec-kit functionality including MCP handlers, cognitive systems, validation logic, and script modules.\\n\\n---\",\n      \"start_line\": 48,\n      \"end_line\": 53,\n      \"score\": 0.527110082421693\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/001-retrieval/plan.md\",\n      \"language\": \"markdown\",\n      \"content\": \"## 4. IMPLEMENTATION PHASES\\n\\n### Phase 1: Preconditions\\n- [ ] Verify source documents are open: playbook, review protocol, and linked retrieval feature files.\\n- [ ] Confirm MCP runtime access for `memory_context`, `memory_search`, and `memory_match_triggers`.\\n- [ ] Record baseline environment flags before any fallback or rollout-state testing.\\n- [ ] Prepare disposable sandbox data for trigger edits and a graph-connected sandbox corpus for rollout diagnostics.\\n\\n### Phase 2: Non-Destructive Tests\\n- [ ] Run EX-001, EX-002, EX-003, EX-004, and EX-005 in order to cover orchestration, search, trigger, hybrid, and pipeline-baseline retrieval behavior.\\n- [ ] Run NEW-109 after baseline retrieval tests to inspect tiered degradation behavior and fallback-disabled comparison without mutating corpus content.\\n- [ ] Run NEW-142 to compare trace-enabled versus non-trace `memory_context` responses and confirm no session-transition leakage.\",\n      \"start_line\": 74,\n      \"end_line\": 85,\n      \"score\": 0.5220918021628265\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/tests/context-server.vitest.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"  describe('Group 7: Hooks Integration', () => {\\n    // T29: Source imports MEMORY_AWARE_TOOLS\\n    it('T29: Imports MEMORY_AWARE_TOOLS from hooks', () => {\\n      expect(sourceCode).toMatch(/import\\\\s*\\\\{[^}]*MEMORY_AWARE_TOOLS[^}]*\\\\}\\\\s*from\\\\s*'\\\\.\\\\/hooks'/)\\n    })\\n\\n    // T30: Source checks MEMORY_AWARE_TOOLS.has(name)\\n    it('T30: Checks MEMORY_AWARE_TOOLS.has(name)', () => {\\n      expect(sourceCode).toMatch(/MEMORY_AWARE_TOOLS\\\\.has\\\\(name\\\\)/)\\n    })\\n\\n    // T31: Hooks module direct tests\\n    it('T31: MEMORY_AWARE_TOOLS is a Set', async () => {\\n      const hooksModule = await importFirst<HooksModule>([\\n        async () => await import('../hooks/index'),\\n        async () => await import('../hooks'),\\n        async () => await import('../hooks/memory-surface'),\\n      ])\\n      expect(hooksModule?.MEMORY_AWARE_TOOLS).toBeInstanceOf(Set)\\n    })\\n\\n    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']\",\n      \"start_line\": 1327,\n      \"end_line\": 1348,\n      \"score\": 0.5144645602039191\n    }\n  ],\n  \"total_returned\": 8,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [
      {
        "file_path": "specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/078-speckit-test-suite/tasks.md",
        "language": "markdown",
        "content": "## L2: PHASE COMPLETION GATES\n\n### Gate 1: MCP Handlers Complete\n- [ ] T001 test-session-learning.js implemented and passing\n- [ ] T002 test-memory-handlers.js implemented and passing\n- [ ] Handler tests cover all MCP tool entry points\n\n### Gate 2: Integration Complete\n- [ ] T003 test-cognitive-integration.js implemented and passing\n- [ ] End-to-end workflows validated\n- [ ] Cognitive memory patterns verified\n\n### Gate 3: Scripts Complete\n- [ ] T004 test-validation-system.js implemented and passing\n- [ ] T005 test-extractors-loaders.js implemented and passing\n- [ ] All script modules have test coverage\n\n### Gate 4: Framework Complete\n- [ ] T006 test-five-checks.js implemented and passing\n- [ ] T007 test_dual_threshold.py implemented and passing (pytest)\n- [ ] Framework algorithms validated",
        "start_line": 159,
        "end_line": 179,
        "score": 0.5482022871573502
      },
      {
        "file_path": "specs/03--commands-and-skills/023-sk-deep-research-creation/research.md",
codex
I’ve confirmed where the CLI docs describe post-010 gate behavior and located the runtime handback test suite. Next I’m extracting precise line-level evidence from `data-loader.ts`, `input-normalizer.ts`, and the tests so we can quantify where malformed payloads pass vs fail.
exec
/bin/zsh -lc 'rg -n "MEMORY_HANDBACK_START|EXPLICIT_DATA_FILE_LOAD_FAILED|INSUFFICIENT_CONTEXT_ABORT|CONTAMINATION_GATE_ABORT|next_steps|nextSteps|minimum payload|FILES|payload" .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md .opencode/skill/cli-codex/SKILL.md .opencode/skill/cli-copilot/SKILL.md .opencode/skill/cli-claude-code/SKILL.md .opencode/skill/cli-gemini/SKILL.md .opencode/skill/cli-codex/assets/prompt_templates.md .opencode/skill/cli-copilot/assets/prompt_templates.md .opencode/skill/cli-claude-code/assets/prompt_templates.md .opencode/skill/cli-gemini/assets/prompt_templates.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/cli-copilot/assets/prompt_templates.md:349:<!-- MEMORY_HANDBACK_START -->
.opencode/skill/cli-copilot/assets/prompt_templates.md:374:const match = output.match(/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/);
.opencode/skill/cli-copilot/assets/prompt_templates.md:380:# Redact or scrub secrets before writing the JSON payload
.opencode/skill/cli-copilot/assets/prompt_templates.md:386:  "FILES": [
.opencode/skill/cli-copilot/assets/prompt_templates.md:402:  "nextSteps": ["<extracted remaining work>"],
.opencode/skill/cli-copilot/assets/prompt_templates.md:412:Accepted field names include camelCase and the documented snake_case equivalents such as `session_summary`, `files_modified`, `trigger_phrases`, `recent_context`, and `next_steps`. Persistence behavior for next-step fields: the first item becomes `Next: ...` and sets `NEXT_ACTION`; additional items become `Follow-up: ...`.
.opencode/skill/cli-copilot/assets/prompt_templates.md:414:If `/tmp/save-context-data.json` is passed explicitly and cannot be loaded, `generate-context.js` fails with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...`. Do not fall back to OpenCode capture for that error.
.opencode/skill/cli-copilot/assets/prompt_templates.md:416:Valid JSON can still be rejected after normalization. File-backed handbacks skip stateless alignment and `QUALITY_GATE_ABORT`, but thin payloads fail with `INSUFFICIENT_CONTEXT_ABORT` and cross-spec payloads fail with `CONTAMINATION_GATE_ABORT`.
.opencode/skill/cli-copilot/assets/prompt_templates.md:418:Minimum viable payload: include a specific summary, at least one meaningful `recentContext` entry or equivalent observation, and `FILES` entries with a descriptive `DESCRIPTION`. Add `ACTION`, `MODIFICATION_MAGNITUDE`, and `_provenance` when known.
.opencode/skill/cli-claude-code/assets/prompt_templates.md:461:<!-- MEMORY_HANDBACK_START -->
.opencode/skill/cli-claude-code/assets/prompt_templates.md:486:const match = output.match(/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/);
.opencode/skill/cli-claude-code/assets/prompt_templates.md:492:# Redact or scrub secrets before writing the JSON payload
.opencode/skill/cli-claude-code/assets/prompt_templates.md:498:  "FILES": [
.opencode/skill/cli-claude-code/assets/prompt_templates.md:514:  "nextSteps": ["<extracted remaining work>"],
.opencode/skill/cli-claude-code/assets/prompt_templates.md:524:Accepted field names include camelCase and the documented snake_case equivalents such as `session_summary`, `files_modified`, `trigger_phrases`, `recent_context`, and `next_steps`. Persistence behavior for next-step fields: the first item becomes `Next: ...` and sets `NEXT_ACTION`; additional items become `Follow-up: ...`.
.opencode/skill/cli-claude-code/assets/prompt_templates.md:526:If `/tmp/save-context-data.json` is passed explicitly and cannot be loaded, `generate-context.js` fails with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...`. Do not fall back to OpenCode capture for that error.
.opencode/skill/cli-claude-code/assets/prompt_templates.md:528:Valid JSON can still be rejected after normalization. File-backed handbacks skip stateless alignment and `QUALITY_GATE_ABORT`, but thin payloads fail with `INSUFFICIENT_CONTEXT_ABORT` and cross-spec payloads fail with `CONTAMINATION_GATE_ABORT`.
.opencode/skill/cli-claude-code/assets/prompt_templates.md:530:Minimum viable payload: include a specific summary, at least one meaningful `recentContext` entry or equivalent observation, and `FILES` entries with a descriptive `DESCRIPTION`. Add `ACTION`, `MODIFICATION_MAGNITUDE`, and `_provenance` when known.
.opencode/skill/cli-claude-code/SKILL.md:466:2. **Extract section**: After receiving agent output, extract the `MEMORY_HANDBACK` section using: `/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/`
.opencode/skill/cli-claude-code/SKILL.md:467:3. **Parse to JSON**: Map extracted fields to `{ sessionSummary, filesModified, keyDecisions, specFolder, triggerPhrases, nextSteps }` (the save flow also accepts documented snake_case keys such as `session_summary`, `files_modified`, `trigger_phrases`, `recent_context`, and `next_steps`)
exec
/bin/zsh -lc 'rg -n "handback|explicit data|EXPLICIT_DATA_FILE_LOAD_FAILED|nextSteps|next_steps|data file|JSON|outsourced|collectSessionData|normalizeInputData|quality|contamination|INSUFFICIENT_CONTEXT_ABORT|QUALITY_GATE_ABORT" .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:22:  normalizeInputData,
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:510:        structuredLog('error', 'Invalid data file path - security validation failed', {
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:514:        throw new Error(`Security: Invalid data file path: ${pathErrMsg}`);
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:518:      const rawData: RawInputData = JSON.parse(dataContent) as RawInputData;
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:523:      const data: NormalizedData | RawInputData = normalizeInputData(rawData);
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:524:      console.log(`   \u2713 Loaded data from data file`);
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:532:        throw new Error(`EXPLICIT_DATA_FILE_LOAD_FAILED: Data file not found: ${dataFile}`);
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:534:        structuredLog('error', 'Permission denied reading data file', {
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:538:        throw new Error(`EXPLICIT_DATA_FILE_LOAD_FAILED: Permission denied: ${dataFile}`);
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:540:        structuredLog('error', 'Invalid JSON in data file', {
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:545:        throw new Error(`EXPLICIT_DATA_FILE_LOAD_FAILED: Invalid JSON in data file ${dataFile}: ${error.message}`);
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:548:        structuredLog('error', 'Failed to load data file', {
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:552:        throw new Error(`EXPLICIT_DATA_FILE_LOAD_FAILED: Failed to load data file ${dataFile}: ${errMsg}`);
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:571:    'NO_DATA_AVAILABLE: No session data found. Neither JSON data file, OpenCode session capture, Claude Code session capture, Codex CLI session capture, Copilot CLI session capture, nor Gemini CLI session capture provided usable content. ' +
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:572:    'External CLI agents must provide data via JSON mode: ' +
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:82:  nextSteps?: string[];
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:83:  next_steps?: string[];
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:182:  return JSON.stringify(alt);
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:282:    .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:302:      VALUE: typeof value === 'object' ? JSON.stringify(value) : String(value),
codex
I’ve now pinpointed the exact lines where CLI docs encode the same handback contract and where runtime tests cover explicit-file failures plus `nextSteps` behavior. I’m pulling the core validation and gate code next (including sufficiency/contamination abort paths) so we can report true success-rate implications, not just docs claims.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts | sed -n '280,560p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   280	function buildTechnicalContextObservation(techContext: Record<string, unknown>): Observation {
   281	  const techDetails: string = Object.entries(techContext)
   282	    .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
   283	    .join('; ');
   284	
   285	  return {
   286	    type: 'implementation',
   287	    title: 'Technical Implementation Details',
   288	    narrative: techDetails,
   289	    facts: []
   290	  };
   291	}
   292	
   293	/**
   294	 * Maps a technicalContext record to the structured TECHNICAL_CONTEXT array format.
   295	 * @param techContext - A record of technical details (e.g., stack, config, dependencies).
   296	 * @returns An array of {KEY, VALUE} objects for the dedicated template section.
   297	 */
   298	function mapTechnicalContext(techContext: Record<string, unknown>): Array<{ KEY: string; VALUE: string }> {
   299	  return Object.entries(techContext)
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts | sed -n '470,590p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   470	        return null;
   471	      } catch (captureError: unknown) {
   472	        const captureErrMsg = captureError instanceof Error ? captureError.message : String(captureError);
   473	        structuredLog('debug', 'Gemini CLI capture failed', { projectRoot, error: captureErrMsg });
   474	        console.log(`   ⚠️  Gemini CLI capture unavailable: ${captureErrMsg}`);
   475	        return null;
   476	      }
   477	    }
   478	  }
   479	}
   480	
   481	async function loadCollectedData(options?: LoadOptions): Promise<LoadedData> {
   482	  const dataFile = options?.dataFile !== undefined ? options.dataFile : CONFIG.DATA_FILE;
   483	  const specFolderArg = options?.specFolderArg !== undefined ? options.specFolderArg : CONFIG.SPEC_FOLDER_ARG;
   484	  const preferredCaptureSource = options?.preferredCaptureSource !== undefined
   485	    ? options.preferredCaptureSource
   486	    : inferPreferredCaptureSourceFromEnv();
   487	  const sessionId = options?.sessionId ?? null;
   488	
   489	  // Priority 1: Data file provided via command line
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts | sed -n '560,760p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   560	      errors.push('Missing required field: specFolder (or use CLI argument)');
   561	    }
   562	  }
   563	
   564	  if (data.triggerPhrases !== undefined && !Array.isArray(data.triggerPhrases)) {
   565	    errors.push('triggerPhrases must be an array');
   566	  }
   567	  if (data.trigger_phrases !== undefined && !Array.isArray(data.trigger_phrases)) {
   568	    errors.push('trigger_phrases must be an array');
   569	  }
   570	
   571	  if (data.keyDecisions !== undefined && !Array.isArray(data.keyDecisions)) {
   572	    errors.push('keyDecisions must be an array');
   573	  }
   574	  if (data.key_decisions !== undefined && !Array.isArray(data.key_decisions)) {
   575	    errors.push('key_decisions must be an array');
   576	  }
   577	
   578	  if (data.filesModified !== undefined && !Array.isArray(data.filesModified)) {
   579	    errors.push('filesModified must be an array');
exec
/bin/zsh -lc 'rg -n "INSUFFICIENT_CONTEXT_ABORT|CONTAMINATION_GATE_ABORT|QUALITY_GATE_ABORT|QUALITY_GATE_FAIL|sufficiency|contamination|file-backed|isFileBacked" .opencode/skill/system-spec-kit/scripts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:21:import type { MemorySufficiencyResult } from '@spec-kit/shared/parsing/memory-sufficiency';
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:23:import type { ContaminationSeverity } from '../extractors/contamination-filter';
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:46:  | 'has_contamination'
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:73:export interface QualityInsufficiencySummary {
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:90:  insufficiency: QualityInsufficiencySummary | null;
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:170:  sufficiencyResult?: MemorySufficiencyResult,
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:172:  contaminationSeverity: ContaminationSeverity | null = null,
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:297:  const effectiveSeverity: ContaminationSeverity = contaminationSeverity || 'medium';
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:300:    qualityFlags.add('has_contamination');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:304:      warnings.push('Low-severity contamination detected (preamble only) — minor penalty applied');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:308:      warnings.push('Medium-severity contamination detected (orchestration chatter) — capped at 0.85');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:312:      warnings.push('High-severity contamination detected (AI self-reference/tool leaks) — capped at 0.60');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:316:  if (sufficiencyResult && !sufficiencyResult.pass) {
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:318:    scoreCap = Math.min(scoreCap ?? 1, clamp01(sufficiencyResult.score * 0.4));
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:320:      `Insufficient context for a durable memory: ${sufficiencyResult.reasons.join(' ')}`
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:337:    { id: 'contamination', score01: hadContamination ? (effectiveSeverity === 'low' ? 0.95 : effectiveSeverity === 'medium' ? 0.85 : 0.60) : 1, score100: hadContamination ? (effectiveSeverity === 'low' ? 95 : effectiveSeverity === 'medium' ? 85 : 60) : 100, maxScore100: 100, passed: !hadContamination },
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:350:    insufficiency: sufficiencyResult ? {
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:351:      pass: sufficiencyResult.pass,
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:352:      score01: clamp01(sufficiencyResult.score),
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:353:      reasons: [...sufficiencyResult.reasons],
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Data Loader
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. DATA LOADER
     7	// ───────────────────────────────────────────────────────────────
     8	// Loads session data from file, native CLI capture, or hard-fail
     9	
    10	// ───────────────────────────────────────────────────────────────
    11	// 2. IMPORTS
    12	// ───────────────────────────────────────────────────────────────
    13	import fs from 'node:fs/promises';
    14	import path from 'node:path';
    15	import os from 'node:os';
    16	
    17	import { CONFIG } from '../core';
    18	import { structuredLog, sanitizePath } from '../utils';
    19	
    20	import {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts | sed -n '260,470p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   260	
   261	  const normalized = rawValue.trim().toLowerCase();
   262	  if (normalized.length === 0) {
   263	    return null;
   264	  }
   265	
   266	  const resolved = NATIVE_CAPTURE_ENV_ALIASES[normalized] || null;
   267	  if (!resolved) {
   268	    console.warn(
   269	      `   Warning: SYSTEM_SPEC_KIT_CAPTURE_SOURCE="${rawValue}" is not a recognized capture source. ` +
   270	      `Valid values: ${Object.keys(NATIVE_CAPTURE_ENV_ALIASES).join(', ')}. Ignoring override.`
   271	    );
   272	  }
   273	  return resolved;
   274	}
   275	
   276	function hasTruthyEnvKey(env: NodeJS.ProcessEnv, keys: readonly string[]): boolean {
   277	  return keys.some((key) => {
   278	    const value = env[key];
   279	    return typeof value === 'string' && value.trim().length > 0;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1120,1188p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '2140,2245p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  2140	  // Step 8.5b: Spec document health annotation (non-blocking)
  2141	  let specDocHealth: SpecDocHealthResult | null = null;
  2142	  try {
  2143	    const specFolderAbsForHealth = path.resolve(specFolder);
  2144	    specDocHealth = evaluateSpecDocHealth(specFolderAbsForHealth);
  2145	    if (!specDocHealth.pass) {
  2146	      log(`   Spec doc health: ${specDocHealth.errors} errors, ${specDocHealth.warnings} warnings (score: ${specDocHealth.score})`);
  2147	    }
  2148	    files[ctxFilename] = injectSpecDocHealthMetadata(files[ctxFilename], specDocHealth);
  2149	  } catch (e: unknown) {
  2150	    // Non-blocking — health annotation failure must not prevent memory save
  2151	    log(`   Spec doc health check skipped: ${e instanceof Error ? e.message : String(e)}`);
  2152	  }
  2153	
  2154	  // CG-07b: Validate template contract BEFORE any banner/warning is prepended.
  2155	  // Banners prepended after this point (low-quality, simulation, medium-quality)
  2156	  // would shift the frontmatter away from position 0, causing false
  2157	  // missing_frontmatter violations when the contract is checked later.
  2158	  const templateContractEarly = validateMemoryTemplateContract(files[ctxFilename]);
  2159	  if (!templateContractEarly.valid) {
 succeeded in 0ms:
  1120	    })),
  1121	    decisions: decisions.map((decision) => (
  1122	      [
  1123	        typeof decision.TITLE === 'string' ? decision.TITLE : '',
  1124	        typeof decision.CHOSEN === 'string' ? decision.CHOSEN : '',
  1125	        typeof decision.RATIONALE === 'string' ? decision.RATIONALE : '',
  1126	        typeof decision.CONTEXT === 'string' ? decision.CONTEXT : '',
  1127	      ].filter(Boolean).join(' ')
  1128	    )).filter(Boolean),
  1129	    nextActions: typeof nextAction === 'string' && nextAction.trim().length > 0 ? [nextAction.trim()] : [],
  1130	    blockers: meaningfulBlockers,
  1131	    outcomes: outcomes
  1132	      .map((outcome) => (typeof outcome.OUTCOME === 'string' ? outcome.OUTCOME.trim() : ''))
  1133	      .filter(Boolean),
  1134	    recentContext: (recentContext || []).map((context) => ({
  1135	      request: context.request,
  1136	      learning: context.learning,
  1137	    })),
  1138	    anchors: extractAnchorIds(content),
  1139	  };
exec
/bin/zsh -lc 'rg -n "determineValidationDisposition|captureCapabilities|inputMode|file-backed|stateless|QUALITY_GATE_ABORT" .opencode/skill/system-spec-kit/scripts/core/workflow.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
45:  determineValidationDisposition,
1151: * Selective enrichment for file-backed (JSON-mode) data.
1425:        const alignMsg = `ALIGNMENT_WARNING: Captured stateless content matched the workspace but not the target spec folder "${activeSpecFolderArg}". ` +
1508:    const captureCapabilities = getSourceCapabilities(captureSource);
1514:        captureSource ? { captureSource: captureCapabilities.source, sourceCapabilities: captureCapabilities } : undefined,
1587:    // Step 3.5: Enrich stateless data with spec folder and git context
1589:      log('Step 3.5: Enriching stateless data...');
1761:  // Patch TOOL_COUNT for enriched stateless saves so V7 does not flag
1980:      // Which overwrites the patched value from stateless enrichment.
1981:      // Non-stateless flows should keep conversations.TOOL_COUNT as-is.
2163:    const contractAbortMsg = `QUALITY_GATE_ABORT: Rendered memory violated template contract: ${contractDetails}`;
2215:    const abortMsg = `QUALITY_GATE_ABORT: Memory quality score ${qualityResult.score100}/100 (${qualityResult.score01.toFixed(2)}) ` +
2218:      `To force save, pass data via JSON file instead of stateless mode.`;
2223:  const validationDisposition = determineValidationDisposition(qualityValidation.failedRules, captureSource);
2233:    const validationAbortMsg = `QUALITY_GATE_ABORT: Save blocked due to failed validation rules: ${validationDisposition.blockingRuleIds.join(', ')}`;
2244:    } else if (captureCapabilities.inputMode === 'stateless') {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '120,245p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   120	  contextFilename: string;
   121	  /** List of absolute paths for all files written during this run. */
   122	  writtenFiles: string[];
   123	  /** Numeric memory ID from indexing, or null if indexing was skipped. */
   124	  memoryId: number | null;
   125	  /** Explicit indexing outcome for this workflow run. */
   126	  indexingStatus: WorkflowIndexingStatus;
   127	  /** Summary statistics for the generated memory. */
   128	  stats: {
   129	    /** Number of conversation messages processed. */
   130	    messageCount: number;
   131	    /** Number of decisions extracted. */
   132	    decisionCount: number;
   133	    /** Number of diagrams extracted. */
   134	    diagramCount: number;
   135	    /** Quality score (0-100) from the quality scorer. */
   136	    qualityScore: number;
   137	    /** Whether the data originated from a simulation rather than a live session. */
   138	    isSimulation: boolean;
   139	  };
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '247,420p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   247	    return 'trigger_phrases: []';
   248	  }
   249	
   250	  const escapedPhrases = triggerPhrases.map((phrase) => {
   251	    const normalized = String(phrase).trim();
   252	    return `  - "${normalized.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
   253	  });
   254	
   255	  return ['trigger_phrases:', ...escapedPhrases].join('\n');
   256	}
   257	
   258	function stripWorkflowHtmlOutsideCodeFences(rawContent: string): string {
   259	  const segments = rawContent.split(CODE_FENCE_SEGMENT_RE);
   260	
   261	  return segments.map((segment) => {
   262	    if (segment.startsWith('```')) {
   263	      return segment;
   264	    }
   265	
   266	    const preservedAnchorIds: string[] = [];
codex
I now have the loader/normalizer internals and the exact gate checkpoints in `workflow.ts`. I’m tracing the source-capability policy next (`determineValidationDisposition`) plus handback-specific tests to separate documented behavior from actually enforced behavior.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/source-capabilities.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
nl: .opencode/skill/system-spec-kit/scripts/core/source-capabilities.ts: No such file or directory
exec
/bin/zsh -lc 'rg -n "determineValidationDisposition|getSourceCapabilities|quality gate|V8|V9|file-backed|stateless" .opencode/skill/system-spec-kit/scripts/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/copilot-cli-capture.vitest.ts:102:          content: 'Use the Copilot transcript as a stateless fallback.',
.opencode/skill/system-spec-kit/scripts/tests/copilot-cli-capture.vitest.ts:177:        userInput: 'Use the Copilot transcript as a stateless fallback.',
.opencode/skill/system-spec-kit/scripts/tests/spec-affinity.vitest.ts:32:      triggerPhrases: ['perfect session capturing', 'stateless capture quality'],
.opencode/skill/system-spec-kit/scripts/tests/spec-affinity.vitest.ts:60:      'stateless capture quality',
.opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts:34:      ['claude capture', 'stateless fallback', 'quality scoring', 'transcript parser', 'history matching', 'memory save', 'alignment blocking', 'provenance'],
.opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts:37:        { DESCRIPTION: 'Integrates Claude transcript fallback into the stateless data loader with exact session matching.', _provenance: 'git' as const },
.opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts:147:    const richTriggers = ['claude capture', 'stateless fallback', 'quality scoring', 'transcript parser', 'history matching', 'memory save', 'alignment blocking', 'provenance'];
.opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts:149:    const richFiles = [{ DESCRIPTION: 'Integrates Claude transcript fallback into the stateless data loader.', _provenance: 'git' as const }];
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:4:  determineValidationDisposition,
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:9:import { getSourceCapabilities } from '../utils/source-capabilities';
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:20:    expect(determineValidationDisposition(['V10'], 'opencode-capture')).toMatchObject({
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:28:  it('keeps V8 as a hard write and index blocker', () => {
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:29:    const metadata = getRuleMetadata('V8');
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:33:    expect(shouldBlockWrite('V8', 'codex-cli-capture')).toBe(true);
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:34:    expect(shouldBlockIndex('V8', 'codex-cli-capture')).toBe(true);
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:35:    expect(determineValidationDisposition(['V8'], 'codex-cli-capture')).toMatchObject({
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:37:      blockingRuleIds: ['V8'],
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:38:      indexBlockingRuleIds: ['V8'],
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:48:    expect(determineValidationDisposition(['V2'], 'file')).toMatchObject({
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:59:    expect(getSourceCapabilities('file')).toMatchObject({
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/source-capabilities.ts | sed -n '260,420p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
nl: .opencode/skill/system-spec-kit/scripts/core/source-capabilities.ts: No such file or directory
exec
/bin/zsh -lc 'rg -n "function determineValidationDisposition|const determineValidationDisposition|getSourceCapabilities|inputMode" .opencode/skill/system-spec-kit/scripts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:8:  inputMode: SourceInputMode;
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:16:    inputMode: 'structured',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:22:    inputMode: 'stateless',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:28:    inputMode: 'stateless',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:34:    inputMode: 'stateless',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:40:    inputMode: 'stateless',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:46:    inputMode: 'stateless',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:52:    inputMode: 'structured',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:62:function getSourceCapabilities(source: DataSource | string | null | undefined): SourceCapabilities {
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:80:  getSourceCapabilities,
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:9:import { getSourceCapabilities } from '../utils/source-capabilities';
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:59:    expect(getSourceCapabilities('file')).toMatchObject({
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:60:      inputMode: 'structured',
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:67:    expect(getSourceCapabilities('claude-code-capture').toolTitleWithPathExpected).toBe(true);
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:68:    expect(getSourceCapabilities('opencode-capture').toolTitleWithPathExpected).toBe(false);
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:69:    expect(getSourceCapabilities('codex-cli-capture').toolTitleWithPathExpected).toBe(false);
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:70:    expect(getSourceCapabilities('copilot-cli-capture').toolTitleWithPathExpected).toBe(false);
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:71:    expect(getSourceCapabilities('gemini-cli-capture').toolTitleWithPathExpected).toBe(false);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:86:import { getSourceCapabilities } from '../utils/source-capabilities';
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1508:    const captureCapabilities = getSourceCapabilities(captureSource);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts | sed -n '360,490p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	import type { DataSource } from './input-normalizer';
     2	
     3	export type SourceInputMode = 'structured' | 'stateless';
     4	export type KnownDataSource = DataSource;
     5	
     6	export interface SourceCapabilities {
     7	  source: DataSource;
     8	  inputMode: SourceInputMode;
     9	  toolTitleWithPathExpected: boolean;
    10	  prefersStructuredSave: boolean;
    11	}
    12	
    13	const SOURCE_CAPABILITIES: Record<DataSource, SourceCapabilities> = {
    14	  file: {
    15	    source: 'file',
    16	    inputMode: 'structured',
    17	    toolTitleWithPathExpected: false,
    18	    prefersStructuredSave: true,
    19	  },
    20	  'opencode-capture': {
 succeeded in 0ms:
   360	
   361	  return counts;
   362	}
   363	
   364	function countSpecIdsInValues(values: string[]): Map<string, number> {
   365	  return countDistinctSpecIds(values.join('\n'));
   366	}
   367	
   368	function extractCurrentSpecId(specFolder: string): string | null {
   369	  const matches = specFolder.match(SPEC_ID_REGEX);
   370	  return matches ? matches[matches.length - 1] : null;
   371	}
   372	
   373	/**
   374	 * CG-07c: Extract all spec IDs from the full spec folder path.
   375	 * Child specs (nested paths) legitimately reference parent spec IDs,
   376	 * so all ancestor IDs must be treated as "allowed" rather than foreign.
   377	 * Example: "009-perfect-session-capturing/012-template-compliance"
   378	 *   → allowed = { "009-perfect-session-capturing", "012-template-compliance" }
   379	 */
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	import { describe, expect, it } from 'vitest';
     2	
     3	import {
     4	  determineValidationDisposition,
     5	  getRuleMetadata,
     6	  shouldBlockIndex,
     7	  shouldBlockWrite,
     8	} from '../memory/validate-memory-quality';
     9	import { getSourceCapabilities } from '../utils/source-capabilities';
    10	
    11	describe('validation rule metadata', () => {
    12	  it('marks V10 as a soft rule that still allows write and index', () => {
    13	    const metadata = getRuleMetadata('V10');
    14	
    15	    expect(metadata.severity).toBe('low');
    16	    expect(metadata.blockOnWrite).toBe(false);
    17	    expect(metadata.blockOnIndex).toBe(false);
    18	    expect(shouldBlockWrite('V10', 'opencode-capture')).toBe(false);
    19	    expect(shouldBlockIndex('V10', 'opencode-capture')).toBe(false);
    20	    expect(determineValidationDisposition(['V10'], 'opencode-capture')).toMatchObject({
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	#!/usr/bin/env node
     2	// ---------------------------------------------------------------
     3	// MODULE: Validate Memory Quality
     4	// ---------------------------------------------------------------
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. VALIDATE MEMORY QUALITY
     7	// ───────────────────────────────────────────────────────────────
     8	// Post-render quality gate for generated memory files
     9	
    10	import fs from 'fs';
    11	import path from 'path';
    12	import { structuredLog } from '../utils/logger';
    13	import type { ContaminationAuditRecord } from '../lib/content-filter';
    14	import type { DataSource } from '../utils/input-normalizer';
    15	import { getSourceCapabilities, type KnownDataSource } from '../utils/source-capabilities';
    16	
    17	type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9' | 'V10' | 'V11' | 'V12';
    18	
    19	type ValidationRuleSeverity = 'low' | 'medium' | 'high';
    20	type ValidationDisposition = 'abort_write' | 'write_skip_index' | 'write_and_index';
exec
/bin/zsh -lc 'rg -n "VALIDATION_RULE_METADATA|V8:|V9:|V10:|V2:|appliesToSources|blockOnWrite|blockOnIndex" .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
25:  blockOnWrite: boolean;
26:  blockOnIndex: boolean;
27:  appliesToSources: 'all' | readonly KnownDataSource[];
38:const VALIDATION_RULE_METADATA: Record<QualityRuleId, ValidationRuleMetadata> = {
42:    blockOnWrite: true,
43:    blockOnIndex: true,
44:    appliesToSources: 'all',
47:  V2: {
50:    blockOnWrite: false,
51:    blockOnIndex: true,
52:    appliesToSources: 'all',
58:    blockOnWrite: true,
59:    blockOnIndex: true,
60:    appliesToSources: 'all',
66:    blockOnWrite: false,
67:    blockOnIndex: false,
68:    appliesToSources: 'all',
74:    blockOnWrite: false,
75:    blockOnIndex: false,
76:    appliesToSources: 'all',
exec
/bin/zsh -lc 'ls -la .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
total 112
drwxr-xr-x@ 10 michelkerkmeester  staff    320 Mar 19 16:45 .
drwxr-xr-x@ 36 michelkerkmeester  staff   1152 Mar 20 08:30 ..
-rw-r--r--@  1 michelkerkmeester  staff   7801 Mar 18 21:45 checklist.md
-rw-r--r--@  1 michelkerkmeester  staff    983 Mar 19 16:45 description.json
-rw-r--r--@  1 michelkerkmeester  staff   6215 Mar 18 21:45 implementation-summary.md
drwxr-xr-x@ 10 michelkerkmeester  staff    320 Mar 18 21:45 memory
-rw-r--r--@  1 michelkerkmeester  staff   9417 Mar 18 21:45 plan.md
drwxr-xr-x@  3 michelkerkmeester  staff     96 Mar 17 10:25 scratch
-rw-r--r--@  1 michelkerkmeester  staff  14309 Mar 18 21:45 spec.md
-rw-r--r--@  1 michelkerkmeester  staff   5451 Mar 18 21:45 tasks.md
codex
I’ve confirmed the enforcement split: JSON handbacks enter as `source=file` (structured mode), while all CLI transcript captures are stateless and follow stricter quality abort behavior. I’m now reading Phase 015 implementation/checklist evidence and handback-focused tests to quantify what’s proven per CLI versus what remains unproven.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	---
     2	title: "Implementation Summary: Outsourced Agent Handback Protocol"
     3	description: "External CLI handback protocol: hard-fail JSON input, next-step persistence, richer caller guidance, and post-010 save-gate awareness."
     4	trigger_phrases: ["outsourced agent summary", "memory handback summary", "runtime memory inputs"]
     5	importance_tier: "normal"
     6	contextType: "general"
     7	---
     8	# Implementation Summary: Outsourced Agent Handback Protocol
     9	
    10	This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.
    11	
    12	
    13	<!-- SPECKIT_LEVEL: 2 -->
    14	<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->
    15	<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->
    16	
    17	---
    18	
    19	<!-- ANCHOR:metadata -->
    20	## 1. METADATA
exec
/bin/zsh -lc 'rg -n "REQ-|minimum|payload|thin|live proof|proof|CLI|codex|copilot|claude|gemini|INSUFFICIENT_CONTEXT_ABORT|CONTAMINATION_GATE_ABORT|EXPLICIT_DATA_FILE_LOAD_FAILED|tests|coverage|risk|open question|unknown" .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/plan.md .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/tasks.md .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/checklist.md .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md:3:description: "External CLI handback protocol: hard-fail JSON input, next-step persistence, richer caller guidance, and post-010 save-gate awareness."
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md:28:| **Total LOC** | ~700 (runtime ~60, tests ~470, CLI docs + catalog ~620) |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md:38:Three-branch `EXPLICIT_DATA_FILE_LOAD_FAILED` error contract: ENOENT, bad JSON, validation failure. No fallback to native capture. Path security via `sanitizePath()` against the fixed allowlist.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md:44:### 3. CLI Handback Documentation (4 skills + 4 templates)
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md:46:All 8 caller-facing handback docs now explain the same post-010 contract: extract `MEMORY_HANDBACK`, redact and scrub it, write `/tmp/save-context-data.json`, accept the documented snake_case fields, and expect `INSUFFICIENT_CONTEXT_ABORT` or `CONTAMINATION_GATE_ABORT` when the payload is too thin or cross-spec.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md:50:The feature-catalog entry for outsourced handbacks now points at phase `015-outsourced-agent-handback`, and `scripts/tests/outsourced-agent-handback-docs.vitest.ts` locks the 8 CLI docs plus the catalog to the same rejection-code and payload-richness guidance.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md:54:File-backed saves bypass stateless alignment and `QUALITY_GATE_ABORT`, but they still hit sufficiency and contamination gates and can still log non-blocking `QUALITY_GATE_FAIL` warnings that skip production indexing. Minimum viable payload guidance now documents that nuance explicitly for callers.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md:64:2. **CLI handback documentation**: Update the 4 SKILL files and 4 prompt templates with post-010 rejection codes, snake_case guidance, and richer `FILES` examples. Align the feature catalog and add a dedicated Vitest lane so the caller-facing contract does not drift silently.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md:75:3. **Sufficiency gate not bypassed for file-backed saves**: Thin outsourced payloads should fail rather than index low-value context.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md:77:5. **Identical protocol across all 4 CLIs**: Same delimiter, same rejection-code guidance, and same minimum payload expectations. This prevents drift.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md:84:| Input validation | Yes | N/A | `EXPLICIT_DATA_FILE_LOAD_FAILED` |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md:86:| Sufficiency | **Yes** | Yes | `INSUFFICIENT_CONTEXT_ABORT` |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md:87:| Contamination | **Yes** | Yes | `CONTAMINATION_GATE_ABORT` |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md:98:| `npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/runtime-memory-inputs.vitest.ts tests/outsourced-agent-handback-docs.vitest.ts` | PASS (`2` files, `32` tests) |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md:102:| Thin JSON-mode handback | Rejected with `INSUFFICIENT_CONTEXT_ABORT` before file write |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md:114:2. **L2**: Native capture mode for external CLIs (same workspace) is still outside this protocol’s scope.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md:115:3. **L3**: Structured payloads that arrive pre-populated with `user_prompts`, `recent_context`, or `observations` need equivalent durable evidence because they bypass part of the manual-format synthesis path.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/checklist.md:33:- [x] CHK-002 [P0] Technical approach defined in `plan.md` - runtime, CLI-doc, catalog/test, and reconciliation phases documented [Evidence: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/plan.md`]
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/checklist.md:34:- [x] CHK-003 [P1] Dependencies identified and available - runtime files, 8 CLI docs, the feature catalog, `scratch/`, and the phase `memory/` directory verified in repo [Evidence: runtime sources plus spec folder directories read during reconciliation]
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/checklist.md:42:- [x] CHK-010 [P0] Explicit missing-file failures hard-fail with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...` [Evidence: `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`]
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/checklist.md | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	---
     2	title: "Verification Checklist: Outsourced Agent Handback Protocol"
     3	description: "Verification checklist for the outsourced agent handback protocol"
     4	trigger_phrases: ["outsourced agent checklist", "memory handback checklist"]
     5	importance_tier: "normal"
     6	contextType: "general"
     7	---
     8	# Verification Checklist: Outsourced Agent Handback Protocol
     9	
    10	This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.
    11	
    12	<!-- SPECKIT_LEVEL: 2 -->
    13	<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
    14	
    15	---
    16	
    17	<!-- ANCHOR:protocol -->
    18	## 1. VERIFICATION PROTOCOL
    19	
    20	| Priority | Handling | Completion Impact |
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts | sed -n '560,840p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────────
     2	// MODULE: Runtime Memory Input Tests
     3	// ───────────────────────────────────────────────────────────────────
     4	// TEST: Runtime Memory Inputs
     5	// Covers explicit data-file failures and next-steps normalization
     6	import fs from 'node:fs/promises';
     7	import os from 'node:os';
     8	import path from 'node:path';
     9	import { beforeEach, describe, expect, it, vi } from 'vitest';
    10	
    11	import { normalizeQualityAbortThreshold } from '../core/config';
    12	import { collectSessionData } from '../extractors/collect-session-data';
    13	import { normalizeInputData, transformOpencodeCapture } from '../utils/input-normalizer';
    14	
    15	const captureConversation = vi.fn(async () => null);
    16	const captureClaudeConversation = vi.fn(async () => null);
    17	const captureCodexConversation = vi.fn(async () => null);
    18	const captureCopilotConversation = vi.fn(async () => null);
    19	const captureGeminiConversation = vi.fn(async () => null);
    20	
 succeeded in 0ms:
   560	
   561	    expect(transformed.observations).toEqual(expect.arrayContaining([
   562	      expect.objectContaining({
   563	        title: 'Read loaders/data-loader.ts',
   564	        facts: expect.arrayContaining(['Tool: view']),
   565	      }),
   566	    ]));
   567	
   568	    expect(transformed.FILES).toEqual([
   569	      {
   570	        FILE_PATH: '/tmp/spec-kit-project/scripts/utils/input-normalizer.ts',
   571	        DESCRIPTION: 'Apply parity hardening to the input normalizer.',
   572	        _provenance: 'tool',
   573	      },
   574	    ]);
   575	  });
   576	
   577	  it('preserves FILES metadata in structured payloads when present', () => {
   578	    const normalized = normalizeInputData({
   579	      specFolder: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts | sed -n '840,920p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   840	    // so with 5 observations and MAX_OBSERVATIONS=3, it would be truncated
   841	    // without the priority sort fix.
   842	    const normalized = normalizeInputData({
   843	      specFolder: '022-hybrid-rag-fusion/009-perfect-session-capturing',
   844	      observations: [
   845	        { type: 'implementation', title: 'Obs 1', narrative: 'First observation', facts: [] },
   846	        { type: 'implementation', title: 'Obs 2', narrative: 'Second observation', facts: [] },
   847	        { type: 'feature', title: 'Obs 3', narrative: 'Third observation', facts: [] },
   848	        { type: 'bugfix', title: 'Obs 4', narrative: 'Fourth observation', facts: [] },
   849	      ],
   850	      nextSteps: [
   851	        'Fix bug X',
   852	        'Deploy Y',
   853	        'Validate Z',
   854	      ],
   855	      userPrompts: [{
   856	        prompt: 'Trigger truncation test',
   857	        timestamp: '2026-03-17T16:00:00.000Z',
   858	      }],
   859	      recentContext: [{
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	import fs from 'node:fs';
     2	import path from 'node:path';
     3	import { fileURLToPath } from 'node:url';
     4	
     5	import { describe, expect, it } from 'vitest';
     6	
     7	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
     8	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
     9	
    10	function readWorkspaceFile(relativePath: string): string {
    11	  return fs.readFileSync(path.join(WORKSPACE_ROOT, relativePath), 'utf8');
    12	}
    13	
    14	describe('outsourced agent handback docs', () => {
    15	  const skillDocs = [
    16	    '.opencode/skill/cli-codex/SKILL.md',
    17	    '.opencode/skill/cli-copilot/SKILL.md',
    18	    '.opencode/skill/cli-claude-code/SKILL.md',
    19	    '.opencode/skill/cli-gemini/SKILL.md',
    20	  ];
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Input Normalizer
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. INPUT NORMALIZER
     7	// ───────────────────────────────────────────────────────────────
     8	// Validates, normalizes, and transforms raw input data into structured session format
     9	import { structuredLog } from './logger';
    10	import {
    11	  buildSpecAffinityTargets,
    12	  evaluateSpecAffinityText,
    13	  matchesSpecAffinityFilePath,
    14	  matchesSpecAffinityText,
    15	  normalizeText,
    16	} from './spec-affinity';
    17	
    18	// ───────────────────────────────────────────────────────────────
    19	// 2. TYPES
    20	// ───────────────────────────────────────────────────────────────
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '2088,2160p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  2088	  log(`   Template populated (quality: ${filterStats.qualityScore}/100)\n`);
  2089	
  2090	  // Step 8.5: Content cleaning — strip leaked HTML tags from rendered content
  2091	  // Preserves HTML inside fenced code blocks (```...```) which is legitimate code.
  2092	  log('Step 8.5: Content cleaning...');
  2093	  const rawContent = files[ctxFilename];
  2094	  const cleanedContent = stripWorkflowHtmlOutsideCodeFences(rawContent);
  2095	  // Only update if cleaning made changes
  2096	  if (cleanedContent !== rawContent) {
  2097	    files[ctxFilename] = cleanedContent;
  2098	    log('   Stripped leaked HTML tags from content (code blocks preserved)');
  2099	  } else {
  2100	    log('   No HTML cleaning needed');
  2101	  }
  2102	
  2103	  // Step 8.6: Quality validation + scoring
  2104	  log('Step 8.6: Quality scoring...');
  2105	  const qualityValidation = validateMemoryQualityContent(files[ctxFilename]);
  2106	  contaminationAuditTrail.push(qualityValidation.contaminationAudit);
  2107	  const metadataJson = JSON.parse(files['metadata.json']) as Record<string, unknown>;
exec
/bin/zsh -lc "rg -n \"MEMORY_SUFFICIENCY_REJECTION_CODE|evaluateMemorySufficiency|memory-sufficiency|buildWorkflowMemoryEvidenceSnapshot|evidenceCounts|primary|support|semanticChars|uniqueWords\" .opencode/skill/system-spec-kit/scripts .opencode/skill/system-spec-kit -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:221:// Don't support. If index changes significantly, restart the server to refresh instructions.
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:92:  'supports',
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:493:      // Use os.tmpdir() for cross-platform temp directory support
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:305:        primaryPhase: 'Research',
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:315:        primaryPhase: 'Planning',
.opencode/skill/system-spec-kit/mcp_server/cli.ts:437:    console.error('ERROR: Only --to 15 is supported (targeted v16 -> v15 downgrade).');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:113:  const primarySource = result.sources[0] ?? 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:120:    source: typeof sourceCandidate === 'string' ? sourceCandidate : primarySource,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1071: * fallback — primary at minSimilarity=0.3, retry at 0.17.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1089:  // Where no result exceeds the primary threshold — chosen empirically via eval.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1095:  const primaryOptions = { ...options, minSimilarity: options.minSimilarity ?? PRIMARY_THRESHOLD };
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1096:  let results = await hybridSearchEnhanced(query, embedding, primaryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1099:  if (results.length === 0 && (primaryOptions.minSimilarity ?? PRIMARY_THRESHOLD) >= FALLBACK_THRESHOLD) {
.opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts:106:  it('supports ngram depth 1 through 4 without changing the public contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:404:  description: '[L6:Analysis] Trace causal chain for a memory to answer "why was this decision made?" Traverses causal edges up to maxDepth hops, grouping results by relationship type (caused, enabled, supersedes, contradicts, derived_from, supports). Use to understand decision lineage and memory relationships. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:405:  inputSchema: { type: 'object', additionalProperties: false, properties: { memoryId: { oneOf: [{ type: 'number' }, { type: 'string', minLength: 1 }], description: 'Memory ID to trace causal lineage for (required)' }, maxDepth: { type: 'number', default: 3, description: 'Maximum traversal depth (default: 3, max: 10)' }, direction: { type: 'string', enum: ['outgoing', 'incoming', 'both'], default: 'both', description: 'Traversal direction: outgoing (what this caused), incoming (what caused this), or both' }, relations: { type: 'array', items: { type: 'string', enum: ['caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'] }, description: 'Filter to specific relationship types' }, includeMemoryDetails: { type: 'boolean', default: true, description: 'Include full memory details in results' } }, required: ['memoryId'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:410:  description: '[L6:Analysis] Create a causal relationship between two memories. Links represent decision lineage (caused, enabled), versioning (supersedes), contradictions, derivation, or support. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:411:  inputSchema: { type: 'object', additionalProperties: false, properties: { sourceId: { oneOf: [{ type: 'number' }, { type: 'string', minLength: 1 }], description: 'Source memory ID (the cause/enabler/superseder)' }, targetId: { oneOf: [{ type: 'number' }, { type: 'string', minLength: 1 }], description: 'Target memory ID (the effect/superseded)' }, relation: { type: 'string', enum: ['caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'], description: 'Relationship type' }, strength: { type: 'number', default: 1.0, description: 'Relationship strength (0.0-1.0)' }, evidence: { type: 'string', description: 'Evidence or reason for this relationship' } }, required: ['sourceId', 'targetId', 'relation'] },
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:45:  primarySignal: SessionTransitionSignal | undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:48:  switch (primarySignal) {
exec
/bin/zsh -lc 'rg --files | rg "memory-sufficiency"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts | sed -n '280,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   280	function collectSupportContexts(snapshot: MemoryEvidenceSnapshot): string[] {
   281	  const results: string[] = [];
   282	
   283	  for (const context of snapshot.recentContext || []) {
   284	    const text = normalizeWhitespace([context.request || '', context.learning || ''].join(' '));
   285	    if (hasSemanticSubstance(text, 40, 8)) {
   286	      results.push(text);
   287	    }
   288	  }
   289	
   290	  const meaningfulTriggers = (snapshot.triggerPhrases || [])
   291	    .map((phrase) => normalizeWhitespace(phrase))
   292	    .filter((phrase) => phrase.length >= 4 && !isGenericText(phrase));
   293	  if (meaningfulTriggers.length >= 2) {
   294	    results.push(meaningfulTriggers.join(' '));
   295	  }
   296	
   297	  if ((snapshot.anchors || extractAnchorsFromContent(snapshot.content || '')).length > 0) {
   298	    results.push('Anchored document structure present.');
   299	  }
 succeeded in 0ms:
     1	import { describe, expect, it } from 'vitest';
     2	
     3	import { evaluateMemorySufficiency } from '@spec-kit/shared/parsing/memory-sufficiency';
     4	
     5	describe('evaluateMemorySufficiency', () => {
     6	  it('passes rich specific evidence', () => {
     7	    const result = evaluateMemorySufficiency({
     8	      title: 'Perfect Session Capturing Sufficiency Hardening',
     9	      content: [
    10	        '# Perfect Session Capturing Sufficiency Hardening',
    11	        '',
    12	        '## Overview',
    13	        'Implemented a shared insufficiency gate across workflow and memory_save so thin saves fail explicitly.',
    14	        '',
    15	        '## Decisions',
    16	        '- Chosen approach: reject thin memories before indexing because synthetic metadata should not count as durable context.',
    17	        '- Rationale: the prior path could index generic sessions that matched workspace identity but not the real task.',
    18	      ].join('\n'),
    19	      triggerPhrases: ['perfect session capturing', 'memory sufficiency', 'memory save', 'alignment block'],
    20	      files: [
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Sufficiency
     3	// ---------------------------------------------------------------
     4	
     5	const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/;
     6	const COMMENT_RE = /<!--[\s\S]*?-->/g;
     7	const CODE_FENCE_RE = /```[\s\S]*?```/g;
     8	const WORD_RE = /\b[a-z][a-z0-9_-]{2,}\b/gi;
     9	const FILE_REF_RE = /`?[^`\s]+\.(ts|tsx|js|jsx|py|sh|md|json|jsonc|yml|yaml|toml|css|html|sql)`?/i;
    10	const DECISION_SIGNAL_RE = /\b(decided|decision|chosen|selected|because|rationale|tradeoff|next\b|follow-up|blocker|outcome|fixed|implemented|verified|tested|failed|error)\b/i;
    11	const TOOL_SIGNAL_RE = /\b(tool|bash|grep|glob|read|write|edit|search|query|command|result)\b/i;
    12	const SECTION_HEADING_RE = /^#{1,6}\s+(.+)$/;
    13	const GENERIC_TITLE_PATTERNS = [
    14	  /^memory$/i,
    15	  /^session$/i,
    16	  /^development session$/i,
    17	  /^work session$/i,
    18	  /^session summary$/i,
    19	  /^session context$/i,
    20	  /^implementation$/i,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts | sed -n '520,780p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts | sed -n '1160,1398p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   520	    expect(result.writtenFiles.length).toBeGreaterThan(0);
   521	    expect(result.memoryId).not.toBeNull();
   522	    expect(result.indexingStatus).toMatchObject({
   523	      status: 'indexed',
   524	      reason: expect.stringContaining('Indexed despite soft validation failures: V10'),
   525	    });
   526	    expect(metadata.embedding?.status).toBe('indexed');
   527	    expect(metadata.embedding?.reason).toContain('V10');
   528	    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('QUALITY_GATE_WARN: Stateless save continuing despite soft validation failures: V10'));
   529	    expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining('QUALITY_GATE_ABORT'));
   530	  });
   531	
   532	  it('writes but skips indexing when validation metadata marks a failure as index-blocking only', async () => {
   533	    const harness = createHarness();
   534	    configureHarnessEnvironment(harness);
   535	    const dataFile = writeInputFile(harness, 'write-skip-index.json', createExplicitJsonInput({
   536	      session_summary: 'Exercise the write-only indexing disposition for an index-blocking rule.',
   537	    }));
   538	    const workflowModule = await importWorkflowForHarness(harness, {
   539	      validationOverride: createValidationOverride(['V2']),
 succeeded in 0ms:
  1160	      userPrompts: [{ prompt: 'Route to the media editor and convert images to webp.', timestamp: '2026-03-15T11:20:00Z' }],
  1161	      observations: [
  1162	        {
  1163	          title: 'Prepare media editor flow',
  1164	          narrative: 'Queued the image conversion workflow for hero assets.',
  1165	          files: ['.opencode/skill/system-spec-kit/scripts/core/config.ts'],
  1166	        },
  1167	      ],
  1168	      FILES: [
  1169	        {
  1170	          FILE_PATH: '.opencode/skill/system-spec-kit/scripts/core/config.ts',
  1171	          DESCRIPTION: 'Generic infrastructure path touched during unrelated media workflow.',
  1172	        },
  1173	      ],
  1174	    };
  1175	
  1176	    const { runWorkflow } = await import('../core/workflow');
  1177	
  1178	    try {
  1179	      // Q1: Block A now warns instead of throwing for explicit CLI args,
exec
/bin/zsh -lc 'rg -n "_source !== '"'file'|captureSource "'!== '"'file'|captureSource === 'file'|QUALITY_ABORT_THRESHOLD|quality abort\" .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
2213:  const QUALITY_ABORT_THRESHOLD = CONFIG.QUALITY_ABORT_THRESHOLD;
2214:  if (qualityResult.score01 < QUALITY_ABORT_THRESHOLD) {
2216:      `is below minimum threshold (${QUALITY_ABORT_THRESHOLD.toFixed(2)}). ` +
2252:  if (qualityResult.score01 < 0.6 && qualityResult.score01 >= QUALITY_ABORT_THRESHOLD) {
2379:        qualityAbortThreshold: QUALITY_ABORT_THRESHOLD,
codex
I found an important contradiction: current runtime code appears to apply `QUALITY_GATE_ABORT` to file-backed JSON saves too, despite Phase 015 docs claiming file-backed handbacks bypass it. I’m verifying this against tests now and then I’ll include it as a concrete gap with exact references.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts | sed -n '260,560p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   260	  });
   261	});
   262	
   263	describe('native CLI fallback handling', () => {
   264	  beforeEach(() => {
   265	    vi.resetModules();
   266	    resetCaptureMocks();
   267	    clearNativeCaptureHintEnv();
   268	  });
   269	
   270	  it('falls back to Claude Code capture when OpenCode capture returns no usable content', async () => {
   271	    captureConversation.mockResolvedValueOnce(null);
   272	    captureClaudeConversation.mockResolvedValueOnce({
   273	      exchanges: [
   274	        {
   275	          userInput: 'Use Claude transcript for 009-perfect-session-capturing hybrid rag fusion work',
   276	          assistantResponse: 'Loaded the Claude session for 009-perfect-session-capturing successfully.',
   277	          timestamp: '2026-03-15T10:00:00.000Z',
   278	        },
   279	      ],
exec
/bin/zsh -lc "nl -ba .opencode/skill/cli-codex/SKILL.md | sed -n '430,510p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   430	   - Codex CLI transmits prompts to OpenAI's API
   431	
   432	4. **NEVER hammer the API** with rapid sequential calls
   433	   - Respect rate limits; use batch operations or background execution
   434	
   435	5. **NEVER use Codex for tasks where context is already loaded**
   436	   - If the current agent already understands the code, direct action is faster
   437	
   438	6. **NEVER assume Codex output is correct** without verification
   439	   - Cross-reference with the codebase and project standards
   440	
   441	7. **NEVER invoke this skill from within Codex CLI itself**
   442	   - If you ARE Codex CLI, you already have native access to all capabilities — do not self-delegate via CLI
   443	   - Self-invocation creates a circular, wasteful loop; use your native tools directly instead
   444	
   445	### ⚠️ ESCALATE IF
   446	
   447	**Ask user when:**
   448	
   449	1. **ESCALATE IF Codex CLI is not installed** and user has not acknowledged
exec
/bin/zsh -lc "nl -ba .opencode/skill/cli-codex/assets/prompt_templates.md | sed -n '540,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   540	[1-3 sentences: what was accomplished]
   541	
   542	### Files Modified
   543	- path/to/file.ts
   544	
   545	### Decisions
   546	- Decision and rationale
   547	
   548	### Next Steps
   549	- Remaining work
   550	
   551	### Spec Folder
   552	[spec-folder-name, e.g. 015-outsourced-agent-handback]
   553	<!-- MEMORY_HANDBACK_END -->
   554	```
   555	
   556	### Extraction by Calling AI
   557	
   558	After receiving agent output, the calling AI extracts the handback section:
   559	
exec
/bin/zsh -lc "nl -ba .opencode/skill/cli-gemini/SKILL.md | sed -n '395,438p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/cli-copilot/SKILL.md | sed -n '292,334p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   292	3. **NEVER assume Autopilot is perfect**; always verify the structural integrity of generated code.
   293	4. **NEVER ignore repository memory**; check for existing conventions before overriding.
   294	5. **NEVER invoke this skill from within Copilot CLI itself**
   295	   - If you ARE Copilot CLI, you already have native access to all capabilities — do not self-delegate via CLI
   296	   - Self-invocation creates a circular, wasteful loop; use your native tools directly instead
   297	
   298	### ESCALATE IF
   299	
   300	1. **ESCALATE IF `copilot login` is required** (authentication failure).
   301	2. **ESCALATE IF a model conflict occurs** (requested model not available in current plan).
   302	3. **ESCALATE IF Autopilot hits a safety block** or tool execution failure that it cannot resolve.
   303	4. **ESCALATE IF cloud delegation times out** or returns a service error.
   304	
   305	### Memory Handback Protocol
   306	
   307	When the calling AI needs to preserve session context from a Copilot CLI delegation:
   308	
   309	1. **Include epilogue**: Append the Memory Epilogue template (see `assets/prompt_templates.md` §12) to the delegated prompt
   310	2. **Extract section**: After receiving agent output, extract the `MEMORY_HANDBACK` section using: `/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/`
   311	3. **Parse to JSON**: Map extracted fields to `{ sessionSummary, filesModified, keyDecisions, specFolder, triggerPhrases, nextSteps }` (the save flow also accepts documented snake_case keys such as `session_summary`, `files_modified`, `trigger_phrases`, `recent_context`, and `next_steps`)
 succeeded in 0ms:
   395	
   396	1. **ESCALATE IF Gemini CLI is not installed** and user has not acknowledged
   397	   - Provide installation command: `npm install -g @google/gemini-cli`
   398	
   399	2. **ESCALATE IF rate limits are persistently exceeded**
   400	   - Suggest API key setup or model fallback strategy
   401	
   402	3. **ESCALATE IF Gemini output conflicts with existing code patterns**
   403	   - Present both perspectives and let user decide
   404	
   405	4. **ESCALATE IF task requires `--yolo` on sensitive files**
   406	   - Describe risks and get explicit user approval
   407	
   408	### Memory Handback Protocol
   409	
   410	When the calling AI needs to preserve session context from a Gemini CLI delegation:
   411	
   412	1. **Include epilogue**: Append the Memory Epilogue template (see `assets/prompt_templates.md` §13) to the delegated prompt
   413	2. **Extract section**: After receiving agent output, extract the `MEMORY_HANDBACK` section using: `/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/`
   414	3. **Parse to JSON**: Map extracted fields to `{ sessionSummary, filesModified, keyDecisions, specFolder, triggerPhrases, nextSteps }` (the save flow also accepts documented snake_case keys such as `session_summary`, `files_modified`, `trigger_phrases`, `recent_context`, and `next_steps`)
exec
/bin/zsh -lc 'rg -n "parseStructuredModeArguments|dataFile|runWorkflow|loadCollectedData|/tmp/save-context-data.json|JSON mode|explicit" .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
25:import { runWorkflow } from '../core/workflow';
26:import { loadCollectedData } from '../loaders';
32:  dataFile: string | null;
56:                    - JSON mode: node generate-context.js data.json [spec-folder]
89:  - Explicit JSON mode remains authoritative and ignores native capture preference.
97:  - When a spec folder is passed on the CLI, that explicit target is authoritative.
248:  const explicitProjectScopedPath = !rawArg.endsWith('.json') && (
278:    if (!resolvedNestedPath && explicitProjectScopedPath && fsSync.existsSync(explicitProjectScopedPath)) {
279:      resolvedNestedPath = explicitProjectScopedPath;
356:async function parseStructuredModeArguments(
370:  const explicitSpecFolderArg = args[mode === '--stdin' ? 1 : 2];
371:  const explicitTarget = explicitSpecFolderArg ? resolveCliSpecFolderReference(explicitSpecFolderArg) || explicitSpecFolderArg : null;
374:  const specFolderArg = explicitTarget || payloadTarget;
377:    throw new Error(`${mode} requires a target spec folder via an explicit CLI override or payload specFolder`);
381:    dataFile: null,
412:    return { dataFile: null, specFolderArg: null, collectedData: null, sessionId };
416:    const structured = await parseStructuredModeArguments(primaryArg, filteredArgv, stdinReader);
428:      dataFile: null,
436:    dataFile: primaryArg,
561:    CONFIG.DATA_FILE = parsed.dataFile;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | sed -n '380,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | sed -n '520,660p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   380	  return {
   381	    dataFile: null,
   382	    specFolderArg,
   383	    collectedData: {
   384	      ...payload,
   385	      _source: 'file',
   386	    },
   387	    sessionId: null,
   388	  };
   389	}
   390	
   391	// ───────────────────────────────────────────────────────────────
   392	// 5. CLI ARGUMENT PARSING
   393	// ───────────────────────────────────────────────────────────────
   394	async function parseArguments(
   395	  argv: string[] = process.argv.slice(2),
   396	  stdinReader: (stdin?: NodeJS.ReadStream) => Promise<string> = readAllStdin,
   397	): Promise<ParsedCliArguments> {
   398	  // Extract --session-id <uuid> from argv before positional parsing
   399	  let sessionId: string | null = null;
 succeeded in 0ms:
   520	              }
   521	            }
   522	          } catch (_error: unknown) {
   523	            if (_error instanceof Error) {
   524	              /* skip unreadable dirs */
   525	            }
   526	          }
   527	        }
   528	
   529	        if (deepMatches.length > 0) {
   530	          console.error('Did you mean (in subfolders):');
   531	          deepMatches.forEach((m) => console.error(`  - ${m}`));
   532	        } else {
   533	          const allSpecs = available.filter((n) => SPEC_FOLDER_PATTERN.test(n) && !n.match(/^z_|archive/i))
   534	                                    .sort().reverse().slice(0, 5);
   535	          if (allSpecs.length) {
   536	            console.error('Available spec folders:');
   537	            allSpecs.forEach((f) => console.error(`  - ${f}`));
   538	          }
   539	        }
codex
I confirmed the CLI entrypoint path as well: JSON handback mode (`/tmp/save-context-data.json` or `--json/--stdin`) is routed into `runWorkflow` as `_source: "file"`. I’m now compiling the final CLI-by-CLI success matrix and the malformed payload gaps that are currently not blocked by validation.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1468,1628p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1468	
  1469	    let specFolderName = '';
  1470	    for (const candidateRoot of candidateSpecsDirs) {
  1471	      const normalizedRoot = path.resolve(candidateRoot).replace(/\\/g, '/');
  1472	      const relative = path.relative(normalizedRoot, normalizedSpecFolder).replace(/\\/g, '/');
  1473	      if (
  1474	        relative &&
  1475	        relative !== '.' &&
  1476	        relative !== '..' &&
  1477	        !relative.startsWith('../') &&
  1478	        !path.isAbsolute(relative)
  1479	      ) {
  1480	        specFolderName = relative;
  1481	        break;
  1482	      }
  1483	    }
  1484	
  1485	    if (!specFolderName) {
  1486	      const marker = '/specs/';
  1487	      const markerIndex = normalizedSpecFolder.lastIndexOf(marker);
exec
/bin/zsh -lc 'rg -n "isStatelessMode" .opencode/skill/system-spec-kit/scripts/core/workflow.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
1415:    const isStatelessMode = !activeDataFile && !preloadedData;
1416:    if (isStatelessMode && activeSpecFolderArg && (collectedData.observations || collectedData.FILES)) {
1588:    if (isStatelessMode) {
1773:  if (isStatelessMode && sessionData.TOOL_COUNT === 0 && inferredToolCount > 0) {
1982:      ...(isStatelessMode ? { TOOL_COUNT: sessionData.TOOL_COUNT } : {}),
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1388,1448p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1388	    const warn = silent ? (): void => {} : console.warn.bind(console);
  1389	
  1390	    log('Starting memory skill workflow...\n');
  1391	    // Step 1: Load collected data
  1392	    log('Step 1: Loading collected data...');
  1393	
  1394	    let collectedData: CollectedDataFull | null;
  1395	    if (preloadedData) {
  1396	      collectedData = preloadedData;
  1397	      log('   Using pre-loaded data');
  1398	    } else if (loadDataFn) {
  1399	      // F-22: Guard loadDataFn result with explicit null check
  1400	      collectedData = (await loadDataFn()) || null;
  1401	      log('   Loaded via custom function');
  1402	    } else {
  1403	      collectedData = await loadCollectedDataFromLoader({ dataFile: activeDataFile, specFolderArg: activeSpecFolderArg });
  1404	      log(`   Loaded from ${collectedData?._isSimulation ? 'simulation' : 'data source'}`);
  1405	    }
  1406	
  1407	    if (!collectedData) {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	---
     2	title: "Outsourced agent handback protocol"
     3	description: "Outsourced agent handback keeps external CLI save payloads aligned with the current `generate-context.js` contract. It enforces hard-fail validation for explicit JSON data files, persists `nextSteps` fields into memory observations, and now documents the post-010 save gates that can still reject a valid handback after normalization."
     4	---
     5	
     6	# Outsourced agent handback protocol
     7	
     8	## 1. OVERVIEW
     9	
    10	Outsourced agent handback keeps external CLI save payloads aligned with the current `generate-context.js` contract. It enforces hard-fail validation for explicit JSON data files, persists `nextSteps` fields into memory observations, and now documents the post-010 save gates that can still reject a valid handback after normalization.
    11	
    12	When work is delegated to an external helper (like a different AI tool), the results need to come back in a clean format the memory system can understand. This feature makes sure that incoming data files are properly validated and that follow-up actions are captured, so nothing important gets lost when work passes between different tools.
    13	
    14	---
    15	
    16	## 2. CURRENT REALITY
    17	
    18	Outsourced-agent handback is now implemented and aligned across runtime behavior, regression tests, the 8 CLI handback docs, and the feature catalog.
    19	
    20	Current behavior is enforced in four slices:
codex
I have enough evidence to deliver the full analysis. The key outcome is a split between “docs-level success” (all 4 CLIs aligned) and “runtime-proof success” (shared JSON path tested, but no per-CLI handback round-trip tests), plus a concrete mismatch where docs say file-backed skips `QUALITY_GATE_ABORT` while workflow/tests show file-backed can still hit it.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md | sed -n '56,78p'; nl -ba .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md | sed -n '118,148p'; nl -ba .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md | sed -n '228,236p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    56	2. **CLI handback documentation**: What the 4 CLI skill docs and prompt templates tell the calling AI to produce
    57	3. **Post-010 pipeline gates**: How the sufficiency, contamination, and quality gates affect file-backed saves *after* normalization succeeds
    58	
    59	The original 013 spec addressed layers 1 and 2. This rewrite adds layer 3 awareness: since 010's phases shipped, the pipeline now has post-normalization gates that can reject outsourced saves even when the JSON input is valid and normalizes successfully.
    60	
    61	### Purpose
    62	
    63	Ensure the outsourced agent handback protocol produces saves that survive the full 010 pipeline as far as caller-provided evidence allows, covering not just input validation, but also sufficiency evaluation, contamination detection, and post-render quality scoring. Callers must know what minimum payload richness is required, what rejection codes they may encounter, and that file-backed saves bypass `QUALITY_GATE_ABORT` without bypassing all quality-related warnings.
    64	<!-- /ANCHOR:problem -->
    65	
    66	---
    67	
    68	<!-- ANCHOR:scope -->
    69	## 3. SCOPE
    70	
    71	### In Scope
    72	
    73	- Runtime hard-fail for explicit JSON-mode input errors (`EXPLICIT_DATA_FILE_LOAD_FAILED`)
    74	- `nextSteps`/`next_steps` normalization through to `NEXT_ACTION`
    75	- Redact-and-scrub security guidance in all 4 CLI skill docs and prompt templates
codex
**Q15 Answer: Handback Success Across CLIs**

**Observed success rate**
1. **Contract parity across CLIs: 4/4 (100%)**  
All four CLI skill docs and all four prompt templates are enforced for the same handback contract in test coverage ([outsourced-agent-handback-docs.vitest.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts#L14)).
2. **Runtime handback proof per CLI: not directly measured (0/4 dedicated E2E tests)**  
Runtime tests validate the shared JSON path and failures, but not “CLI output -> extract handback -> save -> run pipeline” separately per CLI ([runtime-memory-inputs.vitest.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts#L67)).

**1) Minimum handback JSON payload schema**
1. **What the runtime accepts (syntactic minimum):** object + valid field types ([input-normalizer.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L551)).  
`specFolder` is only required when no CLI spec arg and no structured arrays are present ([input-normalizer.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L558)).
2. **What docs define as “minimum viable” for durable saves:** specific summary, meaningful `recentContext` (or equivalent observation), and rich `FILES` descriptions (+ optional `ACTION`, `MODIFICATION_MAGNITUDE`, `_provenance`) ([cli-codex prompt template](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/cli-codex/assets/prompt_templates.md#L605), [cli-codex SKILL](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/cli-codex/SKILL.md#L479)).
3. **What actually gates durability:** sufficiency rules require primary evidence, enough total evidence, and semantic substance; thin payloads abort with `INSUFFICIENT_CONTEXT_ABORT` ([memory-sufficiency.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts#L371), [workflow.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2207)).

**2) CLI-by-CLI pipeline flow**
1. **Codex, Copilot, Claude Code, Gemini all follow the same JSON handback pattern**: emit delimiter block, extract, redact/scrub, write `/tmp/save-context-data.json`, run `generate-context.js` ([cli-codex SKILL](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/cli-codex/SKILL.md#L461), [cli-copilot SKILL](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/cli-copilot/SKILL.md#L305), [cli-gemini SKILL](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/cli-gemini/SKILL.md#L408)).
2. **Runtime path is source-agnostic once JSON is provided**: `generate-context` passes file/preloaded data into workflow as `_source: "file"` ([generate-context.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L383), [generate-context.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L565), [data-loader.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L490)).  
Inference: JSON handback success/failure behavior is effectively the same for all 4 CLIs after extraction.

**3) Validation gaps (malformed/thin payloads that slip through early validation)**
1. `validateInputData` checks array-ness but not deep item quality for many fields; low-value arrays can pass then fail later at sufficiency ([input-normalizer.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L564)).
2. `nextSteps`/`next_steps` element content is not validated; empty first step persists as `Next: ` ([runtime-memory-inputs.vitest.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts#L765)).
3. `FILES` only enforces `FILE_PATH/path` presence; weak descriptions pass input validation and are filtered only by sufficiency semantics ([input-normalizer.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L609), [memory-sufficiency.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts#L181)).
4. **Important mismatch**: docs/spec claim file-backed handbacks skip `QUALITY_GATE_ABORT`, but workflow and tests show file-backed runs can still hit `QUALITY_GATE_ABORT` ([spec.md](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md#L63), [workflow.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2213), [task-enrichment.vitest.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts#L1289)).

**4) Current test coverage for handback scenarios per CLI**
1. **Per-CLI docs/templates contract coverage:** yes, 4/4 CLIs via shared regression test ([outsourced-agent-handback-docs.vitest.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts#L29)).
2. **Shared JSON ingestion/failure coverage:** yes (missing file, invalid JSON, invalid shape, snake_case, next steps) ([runtime-memory-inputs.vitest.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts#L73)).
3. **Per-CLI native capture fallback coverage:** yes, but this is stateless capture, not handback JSON extraction ([runtime-memory-inputs.vitest.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts#L263)).
4. **Per-CLI handback E2E coverage:** no dedicated tests (gap).

**5) Minimum tests needed per CLI for strong confidence**
1. **Happy-path handback E2E**: real CLI output with `MEMORY_HANDBACK` delimiters -> extractor -> JSON -> `generate-context` writes memory.
2. **Thin payload reject**: same CLI flow but minimal/thin handback -> expect `INSUFFICIENT_CONTEXT_ABORT`.
3. **Cross-spec reject**: payload includes foreign spec evidence -> expect `CONTAMINATION_GATE_ABORT`.
4. **Explicit JSON failure propagation**: corrupted/missing JSON file path -> expect `EXPLICIT_DATA_FILE_LOAD_FAILED`.
5. **Docs/runtime contract check**: enforce whether file-backed should or should not `QUALITY_GATE_ABORT` (resolve current contradiction, then test that behavior per CLI flow).
tokens used
224,911
**Q15 Answer: Handback Success Across CLIs**

**Observed success rate**
1. **Contract parity across CLIs: 4/4 (100%)**  
All four CLI skill docs and all four prompt templates are enforced for the same handback contract in test coverage ([outsourced-agent-handback-docs.vitest.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts#L14)).
2. **Runtime handback proof per CLI: not directly measured (0/4 dedicated E2E tests)**  
Runtime tests validate the shared JSON path and failures, but not “CLI output -> extract handback -> save -> run pipeline” separately per CLI ([runtime-memory-inputs.vitest.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts#L67)).

**1) Minimum handback JSON payload schema**
1. **What the runtime accepts (syntactic minimum):** object + valid field types ([input-normalizer.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L551)).  
`specFolder` is only required when no CLI spec arg and no structured arrays are present ([input-normalizer.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L558)).
2. **What docs define as “minimum viable” for durable saves:** specific summary, meaningful `recentContext` (or equivalent observation), and rich `FILES` descriptions (+ optional `ACTION`, `MODIFICATION_MAGNITUDE`, `_provenance`) ([cli-codex prompt template](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/cli-codex/assets/prompt_templates.md#L605), [cli-codex SKILL](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/cli-codex/SKILL.md#L479)).
3. **What actually gates durability:** sufficiency rules require primary evidence, enough total evidence, and semantic substance; thin payloads abort with `INSUFFICIENT_CONTEXT_ABORT` ([memory-sufficiency.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts#L371), [workflow.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2207)).

**2) CLI-by-CLI pipeline flow**
1. **Codex, Copilot, Claude Code, Gemini all follow the same JSON handback pattern**: emit delimiter block, extract, redact/scrub, write `/tmp/save-context-data.json`, run `generate-context.js` ([cli-codex SKILL](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/cli-codex/SKILL.md#L461), [cli-copilot SKILL](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/cli-copilot/SKILL.md#L305), [cli-gemini SKILL](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/cli-gemini/SKILL.md#L408)).
2. **Runtime path is source-agnostic once JSON is provided**: `generate-context` passes file/preloaded data into workflow as `_source: "file"` ([generate-context.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L383), [generate-context.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L565), [data-loader.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L490)).  
Inference: JSON handback success/failure behavior is effectively the same for all 4 CLIs after extraction.

**3) Validation gaps (malformed/thin payloads that slip through early validation)**
1. `validateInputData` checks array-ness but not deep item quality for many fields; low-value arrays can pass then fail later at sufficiency ([input-normalizer.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L564)).
2. `nextSteps`/`next_steps` element content is not validated; empty first step persists as `Next: ` ([runtime-memory-inputs.vitest.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts#L765)).
3. `FILES` only enforces `FILE_PATH/path` presence; weak descriptions pass input validation and are filtered only by sufficiency semantics ([input-normalizer.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L609), [memory-sufficiency.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts#L181)).
4. **Important mismatch**: docs/spec claim file-backed handbacks skip `QUALITY_GATE_ABORT`, but workflow and tests show file-backed runs can still hit `QUALITY_GATE_ABORT` ([spec.md](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md#L63), [workflow.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2213), [task-enrichment.vitest.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts#L1289)).

**4) Current test coverage for handback scenarios per CLI**
1. **Per-CLI docs/templates contract coverage:** yes, 4/4 CLIs via shared regression test ([outsourced-agent-handback-docs.vitest.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts#L29)).
2. **Shared JSON ingestion/failure coverage:** yes (missing file, invalid JSON, invalid shape, snake_case, next steps) ([runtime-memory-inputs.vitest.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts#L73)).
3. **Per-CLI native capture fallback coverage:** yes, but this is stateless capture, not handback JSON extraction ([runtime-memory-inputs.vitest.ts](/Users/michelkerkmeester/MEGA/Development%20Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts#L263)).
4. **Per-CLI handback E2E coverage:** no dedicated tests (gap).

**5) Minimum tests needed per CLI for strong confidence**
1. **Happy-path handback E2E**: real CLI output with `MEMORY_HANDBACK` delimiters -> extractor -> JSON -> `generate-context` writes memory.
2. **Thin payload reject**: same CLI flow but minimal/thin handback -> expect `INSUFFICIENT_CONTEXT_ABORT`.
3. **Cross-spec reject**: payload includes foreign spec evidence -> expect `CONTAMINATION_GATE_ABORT`.
4. **Explicit JSON failure propagation**: corrupted/missing JSON file path -> expect `EXPLICIT_DATA_FILE_LOAD_FAILED`.
5. **Docs/runtime contract check**: enforce whether file-backed should or should not `QUALITY_GATE_ABORT` (resolve current contradiction, then test that behavior per CLI flow).
