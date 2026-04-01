# Changelog: 024/006-documentation-alignment

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 006-documentation-alignment — 2026-03-31

Phases 1 through 5 built a hook-based context preservation system -- a mechanism that automatically saves and restores an AI agent's working memory when the conversation history gets too long and must be compressed. But the project's documentation still described the old approach. Anyone reading the feature catalog, testing playbook, SKILL.md, or ARCHITECTURE.md would find no mention of hooks, runtime detection, or the three-system architecture (CocoIndex for semantic search, Code Graph for structural navigation, Memory for session continuity). This phase brought every documentation surface up to date: creating new reference material for the hook system, adding testable scenarios for each hook type, and removing all stale references to the pre-hook approach. The result is that documentation now accurately reflects how the system actually works, so both humans and AI agents can rely on it.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/006-documentation-alignment/`

---

## What Changed

### Documentation (11 changes)

---

### Feature catalog entries for the hook system

**Problem:** The feature catalog -- a browsable directory of all system capabilities -- had no entries for hooks, runtime detection, or CocoIndex integration. These features were invisible to anyone discovering the system through the catalog. A developer or AI agent looking up "what can this system do?" would never learn about context preservation hooks.

**Fix:** Created six new feature catalog entries covering PreCompact Hook (saves context before compression), SessionStart Priming (restores context when a session begins), Stop Token Tracking (monitors how much of the conversation window has been used), Cross-Runtime Fallback (provides context recovery for AI tools that lack hook support), Runtime Detection (identifies which AI tool is running and what it supports), and CocoIndex Integration (semantic code search that complements the structural code graph). Developers and AI agents can now discover these features through the standard catalog interface.

---

### Manual testing playbook for hooks

**Problem:** There were no documented test scenarios for verifying hook behavior. A tester wanting to confirm that context is properly saved before compression, or that it is correctly restored afterward, had no checklist to follow. This made systematic quality assurance of the hook system impossible.

**Fix:** Enhanced all 11 playbook files in category 22 (the context preservation test group) with prerequisites, sub-scenarios, and explicit pass/fail criteria. The scenarios cover six paths: PreCompact firing on compaction, SessionStart injecting post-compact context, SessionStart priming on a fresh startup, Stop hook saving session context, Codex CLI recovery without hooks (using the tool-based fallback), and cross-runtime consistency (verifying the same context surfaces regardless of which AI tool is used). Testers now have a repeatable, structured checklist for validating every hook path.

---

### SKILL.md hook system section

**Problem:** SKILL.md is the primary reference document for the system-spec-kit -- the first place someone reads to understand what the system does and how to use it. It did not mention hooks at all. There was a gap between what the system actually does (automatically preserving context via hooks) and what the documentation described.

**Fix:** Added a Hook System section documenting the lifecycle: PreCompact caches critical context before compression, then SessionStart injects that cached context when the session resumes. The section also covers registration via `.claude/settings.local.json` (the configuration file where hooks are declared), hook script locations and compilation, and a key design principle -- hooks are transport mechanisms that move data, not separate business logic. Anyone reading SKILL.md now understands how hooks fit into the overall system.

---

### SKILL.md Code Graph section

**Problem:** The system uses three complementary subsystems for different kinds of knowledge retrieval, but this architecture was undocumented. CocoIndex handles semantic search (finding code by meaning, like "authentication logic"), Code Graph handles structural navigation (finding code by relationships, like "what calls this function"), and Memory handles session continuity (remembering what was discussed in previous conversations). Without documentation, users had no way to know which system to reach for.

**Fix:** Added a Code Graph section to SKILL.md explaining the three-system architecture and when to use each. Users now understand why three separate systems exist and can choose the right one depending on whether they need meaning-based search, structure-based navigation, or session history.

---

### ARCHITECTURE.md hook lifecycle diagram

**Problem:** ARCHITECTURE.md had no visual representation of how hooks interact during the compaction-and-recovery cycle. The system's flow -- from detecting that context needs compression, to caching critical state, to restoring it in a new session -- was only describable by reading multiple source files.

**Fix:** Added a Mermaid diagram (a text-based format that renders as a visual flowchart in GitHub and most documentation viewers) showing the full hook lifecycle. The diagram covers the runtime adapter pattern -- hooks for Claude Code versus tool-based fallback for Codex, Copilot, and Gemini -- and the token tracking data flow from transcript parsing through snapshot storage. The system's architecture is now visually documented for quick comprehension.

---

### Hook reference documentation

**Problem:** Information about the hook system was scattered across multiple files. A reader trying to understand hooks in full had to piece together fragments from SKILL.md, ARCHITECTURE.md, source code comments, and configuration files. This fragmentation made it easy for documents to drift out of sync with each other.

**Fix:** Created `hook_system.md` in the references directory as the single source of truth for the hook system. SKILL.md and ARCHITECTURE.md now cross-reference this document rather than duplicating content. This centralized approach prevents information drift -- when hook behavior changes, only one document needs updating, and the cross-references remain valid.

---

### Freshness strategy in search patterns

**Problem:** The search patterns reference document did not cover temporal freshness -- the concept that some context has a limited shelf life. Hook-injected context, for example, has a TTL (time-to-live): context cached during a compaction event becomes less relevant as the session progresses and new work begins. Search results that surface stale cached context could mislead an AI agent.

**Fix:** Added a freshness strategy section to `search_patterns.md` that documents how time-sensitive context should be weighted in search results. Search-related documentation now accounts for the decay of cached context over time.

---

### Hook-aware prompt templates

**Problem:** The prompt templates in the assets directory -- reusable patterns that AI agents use to structure their responses -- did not include patterns for working with hook-injected context. When a hook injects prior session state at startup, the AI agent needs a structured way to incorporate that information.

**Fix:** Updated `prompt_templates.md` with hook-aware patterns that show how to handle hook-provided context. Template users can now see the expected format for incorporating automatically injected session state.

---

### README updates across the project

**Problem:** The root README, the system-spec-kit README, and the skills README all described the system without mentioning hooks or the three-system architecture (CocoIndex, Code Graph, Memory). A first-time reader arriving at any of these entry points would get an outdated picture of the system's capabilities.

**Fix:** Updated all three READMEs with the new context preservation capabilities and the three-system architecture description. First-time readers now get an accurate picture of the system regardless of which README they encounter first.

---

### AGENTS.md alignment

**Problem:** Agent definitions -- the descriptions of what each specialized AI agent can do -- changed during Phase 5, but `AGENTS.md` and the enterprise example file `AGENTS_example_fs_enterprises.md` still reflected the old definitions. Agent routing (the process of directing a task to the right specialized agent) relies on these definitions being accurate.

**Fix:** Updated both files to match the current agent capabilities established in Phase 5. Agent routing documentation is now consistent with the actual agent definitions, preventing tasks from being misrouted.

---

### Stale reference cleanup

**Problem:** Documentation still contained references to the pre-hook compaction approach -- instructions and descriptions for a system that no longer exists. Readers following these outdated instructions would encounter behavior that does not match what the documentation describes.

**Fix:** Searched all updated files and removed every stale reference to the old compaction approach. Readers will not encounter outdated instructions that contradict the current system behavior.

---

<details>
<summary><strong>Files Changed (12 targets)</strong></summary>

| File | What changed |
|------|-------------|
| `.opencode/skill/system-spec-kit/feature_catalog/*.md` | Six new feature catalog entries for hooks and CocoIndex integration |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/*.md` | 11 playbook files enhanced with hook test scenarios, prereqs, and pass/fail criteria |
| `.opencode/skill/system-spec-kit/SKILL.md` | Added Hook System and Code Graph sections |
| `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | Added Mermaid hook lifecycle diagram, runtime adapter pattern, token tracking flow |
| `.opencode/skill/system-spec-kit/README.md` | Hook features added to feature list |
| `.opencode/skill/README.md` | Updated system-spec-kit description |
| `README.md` (root) | Context preservation capabilities added |
| `AGENTS.md` | Updated to reflect Phase 5 agent definition changes |
| `AGENTS_example_fs_enterprises.md` | Updated where relevant |
| `.opencode/skill/system-spec-kit/references/hook_system.md` | New centralized hook system reference |
| `.opencode/skill/system-spec-kit/references/search_patterns.md` | Freshness strategy section added |
| `.opencode/skill/system-spec-kit/assets/prompt_templates.md` | Hook-aware prompt patterns added |

</details>

---

## Upgrade

No migration required.
