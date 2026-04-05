# Spec 130 Wave 1 Ownership Matrix (A01-A20)

| Slice | Owned files (wave scope) | Overlap flag | Resolution status |
| --- | --- | --- | --- |
| A01 | `.opencode/install_guides/README.md`, `.opencode/install_guides/install_scripts/README.md`, `.opencode/skill/README.md` | No | Closed |
| A02 | `.opencode/skill/system-spec-kit/mcp_server/lib/README.md`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md`, `.opencode/skill/system-spec-kit/mcp_server/tests/README.md` | Yes (`lib/search/README.md`) | Reconciled in closure pass |
| A03 | `.opencode/skill/system-spec-kit/mcp_server/{core,database,formatters,handlers,hooks,tools,utils,scripts,configs}/README.md` | No | Closed |
| A04 | `.opencode/skill/system-spec-kit/mcp_server/lib/{architecture,cache,cognitive,config,embeddings,errors,interfaces,providers}/README.md` | Possible (shared lib namespace) | No direct conflict found |
| A05 | `.opencode/skill/system-spec-kit/mcp_server/lib/{learning,parsing,response,scoring,search,session,storage,utils,validation}/README.md` | Yes (`lib/search/README.md`) | Reconciled in closure pass |
| A06 | `.opencode/skill/system-spec-kit/scripts/**/README.md` (slice-owned subset) | Possible (scripts docs) | No blocking conflict noted |
| A07 | `.opencode/skill/system-spec-kit/{scripts/**/README.md,shared/**/README.md}` (reference cleanup subset) | Possible (scripts docs with A06) | Coexists; no contradictory edits found |
| A08 | `.opencode/skill/system-spec-kit/templates/{README.md,level_1/README.md,level_2/README.md,level_3/README.md,level_3+/README.md,core/README.md,addendum/README.md,examples/README.md,memory/README.md}` | No | Closed |
| A09 | `.opencode/skill/{sk-documentation,workflows-code--opencode,workflows-code--web-dev,workflows-code--full-stack,workflows-git,workflows-chrome-devtools,mcp-code-mode,mcp-figma}/README.md` | No | Closed |
| A10 | `.opencode/skill/system-spec-kit/SKILL.md` | No | Closed |
| A11 | `.opencode/skill/system-spec-kit/references/memory/{memory_system.md,readme_indexing.md,save_workflow.md}` | No | Closed |
| A12 | `.opencode/skill/system-spec-kit/references/{templates/level_specifications.md,templates/template_guide.md,workflows/quick_reference.md,structure/sub_folder_versioning.md}` | No | Closed |
| A13 | `.opencode/command/memory/{context.md,learn.md,manage.md,save.md}` | Yes (`memory/learn.md` with closure fix) | Reconciled in closure pass |
| A14 | `.opencode/command/spec_kit/{complete.md,research.md,debug.md}` | No | Closed |
| A15 | `.opencode/command/spec_kit/{handover.md,implement.md,plan.md,resume.md}` | No | Closed |
| A16 | `.opencode/agent/{context.md,debug.md,handover.md,orchestrate.md,research.md,review.md,speckit.md,write.md}` | No | Closed |
| A17 | `.claude/agents/{context.md,debug.md,handover.md,orchestrate.md,research.md,review.md,speckit.md,write.md}` | No | Closed |
| A18 | `.codex/agents/{context.md,debug.md,handover.md,orchestrate.md,research.md,review.md,speckit.md,write.md}` | No | Closed |
| A19 | `.opencode/skill/system-spec-kit/{README.md,mcp_server/README.md}` | No | Closed |
| A20 | `README.md`, `.opencode/README.md`, `AGENTS.md` | No | Closed |

## Overlap Review: `mcp_server/lib/search/README.md`

- Participating slices: A02 and A05 (A04 touched adjacent `lib/` docs, but no direct contradictory block confirmed for this file).
- Closure review result: no internal contradiction found in current file for schema timeline (v13 milestone + v14 current), 7-intent set, and spec126 hardening references.
- Resolution: keep current `lib/search/README.md` content as canonical; no reconciliation edit required.
