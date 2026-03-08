OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019ccd03-d16e-75d3-bb50-832da22f0b27
--------
user
You are a completeness gap reviewer. Analyze this spec folder for missing elements and inconsistencies:

1. @.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md
2. @.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md
3. @.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/checklist.md

CHECKS:
1. MISSING tasks.md: The CLAUDE.md documentation levels table says Level 1+ requires: spec.md, plan.md, tasks.md, implementation-summary.md. This spec folder has NO tasks.md. Is this a gap?
2. MISSING implementation-summary.md: Required at all levels but created AFTER implementation. Since this is pre-implementation, it should NOT exist yet. Verify this is correct.
3. SPEC STATUS INCONSISTENCY: spec.md says Status: "Draft". But plan.md has completed Definition of Ready items ([x] marks). Should spec status be "Approved" or "Ready" since the plan is finalized?
4. BRANCH EXISTENCE: spec.md says Branch: "010-spec-descriptions". Does this branch exist? This is pre-implementation, so it may not yet. Note for awareness.
5. FILES IN PLAN NOT IN SPEC: (a) file-writer.ts appears in plan Phase 3 line 158 but is NOT listed in spec.md Files-to-Change. (b) scripts/spec-folder/generate-description.ts is a new file created in plan Phase 2 line 143 but not in spec scope. These are scope discrepancies.
6. TEMPLATE VERSION: Both docs reference "v2.2" template. Is this the current template version? Check for consistency.
7. SECURITY CHECKLIST PREMATURE COMPLETION: checklist.md marks CHK-030, CHK-031, CHK-032 as [x] (verified). These are security items about the IMPLEMENTATION. Since no code exists yet, how can they be verified? This may be premature marking.
8. OPEN QUESTIONS STILL OPEN: spec.md Section 10 lists Q1 (memory name history) and Q2 (deprecate vs keep descriptions.json). The plan.md appears to have made decisions on both (memoryNameHistory included, centralized file kept as build artifact). But spec.md still shows them as "open". This is inconsistent.

LEAF CONSTRAINT: Do not delegate. Complete this analysis yourself. Depth 1 LEAF only.

OUTPUT FORMAT: For each finding use: [Severity] [Tag] Description (line refs from relevant docs). Severities: P0/P1/P2/P3. Tag: [GAP]. End with 3-line summary.
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: spec_kit_memory starting
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: code_mode ready
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m reviewing the three spec documents directly and checking each of the eight claimed gaps against the actual file contents and nearby project context. I’ll pull the relevant line references first, then I’ll return a findings-first review in the exact format you asked for.
exec
/bin/zsh -lc 'nl -ba ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'nl -ba ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/checklist.md"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'nl -ba ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	---
     2	title: "Feature Specification: Spec Folder Description System Refactor"
     3	description: "Refactor the centralized descriptions.json into per-folder description.json files, improve memory filename uniqueness, and integrate description generation into spec folder creation automation."
     4	trigger_phrases:
     5	  - "descriptions.json"
     6	  - "description system"
     7	  - "spec folder descriptions"
     8	  - "per-folder description"
     9	  - "memory uniqueness"
    10	importance_tier: "normal"
    11	contextType: "general"
    12	---
    13	# Feature Specification: Spec Folder Description System Refactor
    14	
    15	<!-- SPECKIT_LEVEL: 2 -->
    16	<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
    17	
    18	---
    19	
    20	<!-- ANCHOR:metadata -->
 succeeded in 52ms:
     1	---
     2	title: "Implementation Plan: Spec Folder Description System Refactor"
     3	description: "Refactor centralized descriptions.json into per-folder description.json files with collision-resistant memory naming, integrated into spec folder creation automation."
     4	trigger_phrases:
     5	  - "description system refactor"
     6	  - "per-folder description"
     7	  - "memory uniqueness"
     8	  - "descriptions.json"
     9	  - "spec folder description"
    10	importance_tier: "normal"
    11	contextType: "general"
    12	---
    13	# Implementation Plan: Spec Folder Description System Refactor
    14	
    15	<!-- SPECKIT_LEVEL: 2 -->
    16	<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
    17	
    18	---
    19	
    20	<!-- ANCHOR:summary -->
 succeeded in 52ms:
     1	---
     2	title: "Verification Checklist: Spec Folder Description System Refactor"
     3	description: "Verification Date: 2026-03-08"
     4	trigger_phrases:
     5	  - "description verification"
     6	  - "checklist"
     7	  - "description system"
     8	importance_tier: "normal"
     9	contextType: "general"
    10	---
    11	# Verification Checklist: Spec Folder Description System Refactor
    12	
    13	<!-- SPECKIT_LEVEL: 2 -->
    14	<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
    15	
    16	---
    17	
    18	<!-- ANCHOR:protocol -->
    19	## Verification Protocol
    20	
codex
I’ve got the three target docs loaded. I’m checking the adjacent source of truth now: folder contents, the template/version references, and whether the branch name in metadata actually exists yet, so the findings can distinguish real gaps from pre-implementation placeholders.
exec
/bin/zsh -lc 'ls -la ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
total 64
drwxr-xr-x   7 michelkerkmeester  staff    224 Mar  8 10:24 .
drwxr-xr-x@ 28 michelkerkmeester  staff    896 Mar  8 11:18 ..
-rw-r--r--@  1 michelkerkmeester  staff   3801 Mar  8 10:24 checklist.md
drwxr-xr-x   5 michelkerkmeester  staff    160 Mar  8 10:24 memory
-rw-r--r--@  1 michelkerkmeester  staff  14448 Mar  8 10:23 plan.md
drwxr-xr-x  13 michelkerkmeester  staff    416 Mar  8 11:35 scratch
-rw-r--r--@  1 michelkerkmeester  staff   8575 Mar  8 10:20 spec.md
exec
/bin/zsh -lc 'git branch --list "010-spec-descriptions"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"implementation-summary\\.md|tasks\\.md|Level 1|Level 2|v2\\.2|template\" \".opencode/skill/system-spec-kit\" \".opencode\" --glob \"CLAUDE.md\" --glob \"SKILL.md\" --glob \"*.md\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
Total output lines: 5696

.opencode/install_guides/README.md:35:- [12. CONFIGURATION TEMPLATES](#12--configuration-templates)
.opencode/install_guides/README.md:78:| **Install Guide Template** | Template maintained in sk-doc: `.opencode/skill/sk-doc/assets/documentation/install_guide_template.md` | Maintainers and guide authors |
.opencode/install_guides/README.md:815:| system-spec-kit            | v2.2.9.0   | Spec folder + template system + context preservation |
.opencode/install_guides/README.md:895:<!-- ANCHOR:configuration-templates -->
.opencode/install_guides/README.md:966:<!-- /ANCHOR:configuration-templates -->
.opencode/install_guides/README.md:1067:| Config invalid JSON          | Restore from backup or regenerate from Section 12 templates |
.opencode/install_guides/README.md:1119:The `AGENTS (Universal).md` file is a template for AI agent behavior. Customize it for your project:
.opencode/install_guides/README.md:1176:| **speckit**     | Spec folder creation            | Level 1-3+ documentation, templates  |
.opencode/install_guides/README.md:1436:| [sk-doc SKILL.md](../skill/sk-doc/SKILL.md) | Document creation standards and templates |
.opencode/install_guides/install_scripts/README.md:191:| `.env.example` | API key templates | Code Mode |
.opencode/install_guides/install_scripts/README.md:388:A: Follow the template pattern:
.opencode/install_guides/install_scripts/README.md:398:See the Contributing section in the source for the full template.
.opencode/skill/system-spec-kit/config/README.md:35:| `config.jsonc`             | Main configuration for memory, search, decay, tiers and templates   |
.opencode/skill/system-spec-kit/config/README.md:66:- `templates.path: "templates"` - Path to spec templates
.opencode/skill/system-spec-kit/config/README.md:70:> **DEPRECATED:** This file is not read by any runtime code. Retained for reference only. Use `--level N` with `scripts/spec/create.sh` to select a level directly. See the deprecation header in the file itself and [level_selection_guide.md](../references/templates/level_selection_guide.md) for current guidance.
.opencode/skill/system-spec-kit/config/README.md:82:- **Level 1 (Baseline)**: 0-25 points
.opencode/skill/system-spec-kit/config/README.md:83:- **Level 2 (Verification)**: 26-55 points
.opencode/skill/system-spec-kit/config/README.md:94:- User stories: 1-2 (Level 1) to 8-15 (Level 3+)
 succeeded in 886ms:
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-UXy1fCZL' (errno=Operation not permitted)
codex
I found the folder only contains `spec.md`, `plan.md`, `checklist.md`, `memory/`, and `scratch/`, which is already enough to confirm the missing-doc question. I’m tightening the last few source-of-truth checks now: the spec-kit README lines that define required files and the branch metadata, where the git CLI is partly blocked by this sandbox.
exec
/bin/zsh -lc "nl -ba \".opencode/skill/system-spec-kit/README.md\" | sed -n '150,170p;266,305p;310,320p;574,585p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "if [ -d .git/refs/heads ]; then find .git/refs/heads -type f | sed 's#"'^'"\\.git/refs/heads/##' | sort; fi" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg --files -g "CLAUDE.md" -g "**/CLAUDE.md"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
   150	
   151	# Planning only
   152	/spec_kit:plan refactor database layer :confirm
   153	
   154	# Research first
   155	/spec_kit:research evaluate GraphQL vs REST
   156	```
   157	
   158	### Level Selection
   159	
   160	| LOC Estimate | Level | What You Get |
   161	| --- | --- | --- |
   162	| <100 | 1 | spec.md + plan.md + tasks.md + implementation-summary.md |
   163	| 100-499 | 2 | Level 1 + checklist.md |
   164	| >=500 | 3 | Level 2 + decision-record.md |
   165	| Complex | 3+ | Level 3 + extended governance |
   166	
   167	When in doubt, choose the higher level.
   168	
   169	---
 succeeded in 52ms:
main
 exited 1 in 51ms:

codex
[P1] [GAP] `tasks.md` is a real completeness gap. I did not find a repo-local `CLAUDE.md`, but the local Spec Kit source of truth says Level 1 requires `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md`, and Level 2 adds `checklist.md`; this folder has Level 2 markers but no `tasks.md`, so the packet is incomplete ([README:162](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/README.md#L162), [README:163](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/README.md#L163), [README:292](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/README.md#L292), [README:293](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/README.md#L293), [README:315](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/README.md#L315), [spec.md:15](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L15), [plan.md:15](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L15), [checklist.md:13](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/checklist.md#L13)).

[P1] [GAP] The spec scope is missing `file-writer.ts` even though the plan explicitly schedules code changes there; that is a scope-control mismatch between planned implementation and declared Files-to-Change ([spec.md:63](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L63), [spec.md:67](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L67), [spec.md:73](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L73), [plan.md:90](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L90), [plan.md:158](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L158)).

[P2] [GAP] The spec scope also omits the new helper script `scripts/spec-folder/generate-description.ts`, but the plan treats it as a concrete deliverable in Phase 2. Because this is a new file, it should be declared in scope before implementation starts ([spec.md:63](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L63), [spec.md:67](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L67), [spec.md:73](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L73), [plan.md:142](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L142), [plan.md:143](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L143)).

[P1] [GAP] The docs disagree on unresolved design decisions: `spec.md` still lists Q1 and Q2 as open, while `plan.md` already bakes in answers by including `memoryNameHistory` in the schema and keeping centralized `descriptions.json` as an aggregation artifact. Those choices need to be reflected back into the spec or reopened in the plan ([spec.md:181](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L181), [spec.md:183](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L183), [spec.md:184](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L184), [plan.md:33](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L33), [plan.md:109](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L109), [plan.md:110](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L110)).

[P1] [GAP] The security section is marked verified too early. `CHK-030`, `CHK-031`, and `CHK-032` are framed as verification assertions about the implementation, but the same packet still shows the feature as `Draft` and the implementation Definition of Done unchecked, so those `[x]` marks overstate the current evidence ([spec.md:27](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L27), [plan.md:66](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L66), [plan.md:67](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L67), [checklist.md:69](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/checklist.md#L69), [checklist.md:71](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/checklist.md#L71), [checklist.md:72](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/checklist.md#L72), [checklist.md:73](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/checklist.md#L73)).

[P2] [GAP] The readiness signal is internally mixed. `spec.md` says `Status: Draft`, while `plan.md` marks all Definition of Ready items complete; by itself that does not require switching to `Approved`, but it does mean the docs should align on whether this packet is still drafting or actually ready to implement. With open questions still unresolved in `spec.md`, moving straight to `Approved` would be premature ([spec.md:27](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L27), [spec.md:183](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L183), [spec.md:184](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L184), [plan.md:61](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L61), [plan.md:62](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L62), [plan.md:63](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L63), [plan.md:64](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L64)).

[P3] [GAP] The `Branch` metadata currently reads more like an intended branch name than a verified current branch. `spec.md` declares `010-spec-descriptions`, but local repo refs available in this sandbox only showed `main`; that is not a blocker pre-implementation, but it is stale if the metadata is meant to describe present reality ([spec.md:29](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L29)).

Summary: 7 findings: missing `tasks.md`, two scope mismatches, stale open questions, premature security verification, mixed readiness/status signaling, and branch metadata that looks aspirational rather than current.
Non-gaps: missing `implementation-summary.md` is correct at this pre-implementation stage, and the `v2.2` template marker is consistent with the current local Spec Kit docs ([README:268](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/README.md#L268), [spec.md:16](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L16), [plan.md:16](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L16), [checklist.md:14](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/checklist.md#L14)).
Highest-value cleanup before implementation: add `tasks.md`, reconcile spec scope with the plan, resolve Q1/Q2 in `spec.md`, and uncheck security items until there is implementation evidence.
tokens used
42,824
[P1] [GAP] `tasks.md` is a real completeness gap. I did not find a repo-local `CLAUDE.md`, but the local Spec Kit source of truth says Level 1 requires `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md`, and Level 2 adds `checklist.md`; this folder has Level 2 markers but no `tasks.md`, so the packet is incomplete ([README:162](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/README.md#L162), [README:163](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/README.md#L163), [README:292](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/README.md#L292), [README:293](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/README.md#L293), [README:315](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/README.md#L315), [spec.md:15](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L15), [plan.md:15](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L15), [checklist.md:13](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/checklist.md#L13)).

[P1] [GAP] The spec scope is missing `file-writer.ts` even though the plan explicitly schedules code changes there; that is a scope-control mismatch between planned implementation and declared Files-to-Change ([spec.md:63](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L63), [spec.md:67](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L67), [spec.md:73](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L73), [plan.md:90](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L90), [plan.md:158](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L158)).

[P2] [GAP] The spec scope also omits the new helper script `scripts/spec-folder/generate-description.ts`, but the plan treats it as a concrete deliverable in Phase 2. Because this is a new file, it should be declared in scope before implementation starts ([spec.md:63](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L63), [spec.md:67](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L67), [spec.md:73](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L73), [plan.md:142](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L142), [plan.md:143](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L143)).

[P1] [GAP] The docs disagree on unresolved design decisions: `spec.md` still lists Q1 and Q2 as open, while `plan.md` already bakes in answers by including `memoryNameHistory` in the schema and keeping centralized `descriptions.json` as an aggregation artifact. Those choices need to be reflected back into the spec or reopened in the plan ([spec.md:181](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L181), [spec.md:183](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L183), [spec.md:184](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L184), [plan.md:33](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L33), [plan.md:109](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L109), [plan.md:110](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L110)).

[P1] [GAP] The security section is marked verified too early. `CHK-030`, `CHK-031`, and `CHK-032` are framed as verification assertions about the implementation, but the same packet still shows the feature as `Draft` and the implementation Definition of Done unchecked, so those `[x]` marks overstate the current evidence ([spec.md:27](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L27), [plan.md:66](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L66), [plan.md:67](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L67), [checklist.md:69](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/checklist.md#L69), [checklist.md:71](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/checklist.md#L71), [checklist.md:72](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/checklist.md#L72), [checklist.md:73](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/checklist.md#L73)).

[P2] [GAP] The readiness signal is internally mixed. `spec.md` says `Status: Draft`, while `plan.md` marks all Definition of Ready items complete; by itself that does not require switching to `Approved`, but it does mean the docs should align on whether this packet is still drafting or actually ready to implement. With open questions still unresolved in `spec.md`, moving straight to `Approved` would be premature ([spec.md:27](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L27), [spec.md:183](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L183), [spec.md:184](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L184), [plan.md:61](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L61), [plan.md:62](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L62), [plan.md:63](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L63), [plan.md:64](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L64)).

[P3] [GAP] The `Branch` metadata currently reads more like an intended branch name than a verified current branch. `spec.md` declares `010-spec-descriptions`, but local repo refs available in this sandbox only showed `main`; that is not a blocker pre-implementation, but it is stale if the metadata is meant to describe present reality ([spec.md:29](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L29)).

Summary: 7 findings: missing `tasks.md`, two scope mismatches, stale open questions, premature security verification, mixed readiness/status signaling, and branch metadata that looks aspirational rather than current.
Non-gaps: missing `implementation-summary.md` is correct at this pre-implementation stage, and the `v2.2` template marker is consistent with the current local Spec Kit docs ([README:268](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/README.md#L268), [spec.md:16](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L16), [plan.md:16](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L16), [checklist.md:14](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/checklist.md#L14)).
Highest-value cleanup before implementation: add `tasks.md`, reconcile spec scope with the plan, resolve Q1/Q2 in `spec.md`, and uncheck security items until there is implementation evidence.
