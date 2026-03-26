OpenAI Codex v0.116.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d23db-0d4d-79f0-aaac-b5b15f534996
--------
user
You are a documentation alignment agent. Verify FEATURE_CATALOG_IN_SIMPLE_TERMS.md against the master FEATURE_CATALOG.md.

CONTEXT: There are two catalog files:
- FEATURE_CATALOG.md (~395KB, technical, detailed)
- FEATURE_CATALOG_IN_SIMPLE_TERMS.md (~103KB, simplified, user-facing)
They must be aligned — same features, same categories, same statuses.

TASKS:
1. Read .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md
2. Read .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md (sample sections)
3. Check:
   a. Same number of categories?
   b. Same features listed per category?
   c. Same status flags (implemented/planned)?
   d. Any features in one but not the other?
   e. Are the "simple terms" descriptions accurate simplifications of the technical versions?

OUTPUT FORMAT:
# Iteration 013: Simple Terms vs Master Catalog Alignment
## Agent: codex / gpt-5.4 / high
## Dimension: traceability
## Files Reviewed
(list files)
## Alignment Check
### Category Counts
- Master: N categories
- Simple: N categories
- Match: YES | NO
### Per-Category Feature Count Comparison
| Category | Master Features | Simple Features | Match |
|----------|----------------|-----------------|-------|
...
### Content Accuracy Spot-Checks
(3-5 spot checks of simplified descriptions vs technical originals)
## Findings
### [SEVERITY]-[NNN]: [Title]
...
## Summary
- Categories compared: N
- Fully aligned: N, Drifted: N
- Total findings: N (P0: N, P1: N, P2: N)
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: spec_kit_memory starting
mcp: sequential_thinking starting
mcp: code_mode starting
mcp: cocoindex_code starting
mcp: code_mode ready
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a traceability review between the master and simplified catalogs. I’ll load the relevant review guidance first, then compare category structure, feature lists, statuses, and a few description spot-checks before I write up findings in your requested format.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
name: sk-code--review
description: "Stack-agnostic code review baseline skill with findings-first severity analysis, mandatory security/correctness minimums, and adaptive overlay compatibility with sk-code--opencode, sk-code--web, and sk-code--full-stack standards."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.0.0
---

<!-- Keywords: sk-code--review, code-review, pull-request, findings-first, security-review, quality-gate, stack-agnostic, baseline-overlay -->

# Code Review Baseline - Stack-Agnostic Findings-First Review

Universal `sk-code` review baseline for any codebase, implemented by `sk-code--review` and paired with one `sk-code--*` overlay skill for stack-specific rules.

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

Use this skill when:
- A user asks for code review, PR review, quality gate, or merge readiness.
 succeeded in 0ms:
---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 2.2.26.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.


<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `specs/007-auth-feature/`) that contains all documentation for a single feature or task:
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Verify FEATURE_CATALOG_IN_SIMPLE_TERMS.md against the master FEATURE_CATALOG.md for category, feature, status, and description alignment" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 1.52s:
2026-03-25 08:17:53.616 xcodebuild[80503:13839886]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:17:53.735 xcodebuild[80503:13839885] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-Z3vpShC7' (errno=Operation not permitted)
2026-03-25 08:17:54.119 xcodebuild[80958:13840563]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:17:54.282 xcodebuild[80958:13840548] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
[]
codex
I’ve loaded the review baseline and the spec-kit context. The skill advisor command hit a sandbox cache/temp limitation, so I’m proceeding with the clearly relevant skills directly: `sk-code--review` for findings-first review behavior, and `system-spec-kit` only as local context for this catalog area.
exec
/bin/zsh -lc "rg -n '"'^## '"' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
12:## TABLE OF CONTENTS
38:## 1. OVERVIEW
59:## 2. RETRIEVAL
109:## 3. MUTATION
159:## 4. DISCOVERY
177:## 5. MAINTENANCE
189:## 6. LIFECYCLE
221:## 7. ANALYSIS
253:## 8. EVALUATION
265:## 9. BUG FIXES AND DATA INTEGRITY
317:## 10. EVALUATION AND MEASUREMENT
377:## 11. GRAPH SIGNAL ACTIVATION
445:## 12. SCORING AND CALIBRATION
537:## 13. QUERY INTELLIGENCE
585:## 14. MEMORY QUALITY AND INDEXING
689:## 15. PIPELINE ARCHITECTURE
781:## 16. RETRIEVAL ENHANCEMENTS
821:## 17. TOOLING AND SCRIPTS
893:## 18. GOVERNANCE
913:## 19. UX HOOKS
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n '"'^## '"' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
12:## TABLE OF CONTENTS
38:## 1. OVERVIEW
67:## 2. RETRIEVAL
312:## 3. MUTATION
545:## 4. DISCOVERY
613:## 5. MAINTENANCE
663:## 6. LIFECYCLE
793:## 7. ANALYSIS
941:## 8. EVALUATION
983:## 9. BUG FIXES AND DATA INTEGRITY
1197:## 10. EVALUATION AND MEASUREMENT
1495:## 11. GRAPH SIGNAL ACTIVATION
1801:## 12. SCORING AND CALIBRATION
2227:## 13. QUERY INTELLIGENCE
2427:## 14. MEMORY QUALITY AND INDEXING
2939:## 15. PIPELINE ARCHITECTURE
3366:## 16. RETRIEVAL ENHANCEMENTS
3544:## 17. TOOLING AND SCRIPTS
3887:## 18. GOVERNANCE
3985:## 19. UX HOOKS
 succeeded in 0ms:
---
title: "Spec Kit Memory: Feature Catalog"
description: "Unified reference combining the complete system feature inventory and the refinement program changelog for the Spec Kit Memory MCP server."
---

# Spec Kit Memory: Feature Catalog

This document combines two complementary views of the Spec Kit Memory system into a single reference. The **System Reference** sections describe what the runtime and adjacent Spec Kit workflows are today: live MCP tools, pipeline stages, verification surfaces, and the supporting phase-workflow scripts that ship with the same skill package. The **Refinement Program** section describes what was changed and why: every improvement delivered across the refinement program, with ticket IDs and implementation details.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. RETRIEVAL](#2--retrieval)
- [3. MUTATION](#3--mutation)
- [4. DISCOVERY](#4--discovery)
- [5. MAINTENANCE](#5--maintenance)
- [6. LIFECYCLE](#6--lifecycle)
- [7. ANALYSIS](#7--analysis)
 succeeded in 0ms:
---
title: "Spec Kit Memory: Feature Catalog (In Simple Terms)"
description: "In-simple-terms-only version of the feature catalog."
---

# Spec Kit Memory: Feature Catalog (In Simple Terms)

This document combines two complementary views of the Spec Kit Memory MCP server into a single reference. The **System Reference** section describes what the system is today: every tool, pipeline stage and capability organized by MCP layer. The **Refinement Program** section describes what was changed and why: every improvement delivered across the refinement program, with ticket IDs and implementation details.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. RETRIEVAL](#2--retrieval)
- [3. MUTATION](#3--mutation)
- [4. DISCOVERY](#4--discovery)
- [5. MAINTENANCE](#5--maintenance)
- [6. LIFECYCLE](#6--lifecycle)
- [7. ANALYSIS](#7--analysis)
codex
I’ve confirmed both catalogs use the same top-level section list. Next I’m parsing every feature heading under those sections so I can compare feature sets and infer planned vs implemented status consistently instead of relying on spot reads.
codex
The sandbox blocks here-doc temp files, so I’m switching to inline one-shot scripts for the structural comparison. That won’t affect the review itself; it just changes how I extract the catalog data.
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path; import re, json; base=Path(\".opencode/skill/system-spec-kit/feature_catalog\"); files={\"master\": base/\"FEATURE_CATALOG.md\", \"simple\": base/\"FEATURE_CATALOG_IN_SIMPLE_TERMS.md\"};

def parse(path):
    text=path.read_text(); lines=text.splitlines(); cats=[]; current=None; feat=None; buf=[]
    def flush():
        nonlocal feat, buf, current
        if feat is not None:
            current[\"features\"].append({\"name\": feat, \"body\": \"\\n\".join(buf).strip()}); feat=None; buf=[]
    for line in lines:
        if re.match(r\""'^## (?!TABLE OF CONTENTS)('"\\\\d+\\\\.|\\\\d+ )\", line):
            flush(); m=re.match(r\""'^##'"\\\\s+\\\\d+\\\\.\\\\s+(.*)"'$", line); name=m.group(1).strip() if m else line[3:].strip(); current={"name": name, "features": []}; cats.append(current)
        elif current and line.startswith("### "):
            flush(); feat=line[4:].strip()
        elif feat is not None:
            buf.append(line)
    flush(); return cats
parsed={k: parse(v) for k,v in files.items()};
print("CATEGORY_COUNTS", {k: len(v) for k,v in parsed.items()});
for which, cats in parsed.items():
    print("FILE", which)
    for c in cats:
        print(c["name"], len(c["features"]))
master_map={c["name"]:[f["name"] for f in c["features"]] for c in parsed["master"]}; simple_map={c["name"]:[f["name"] for f in c["features"]] for c in parsed["simple"]};
all_cats=[]
for c in master_map:
    sm=simple_map.get(c, []); mm=master_map[c]; all_cats.append({"category": c, "master_count": len(mm), "simple_count": len(sm), "missing_in_simple": [x for x in mm if x not in sm], "extra_in_simple": [x for x in sm if x not in mm]})
print("JSON_COMPARE_START")
print(json.dumps(all_cats, indent=2))'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 1.65s:
2026-03-25 08:18:57.913 xcodebuild[53572:13960639]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:18:58.129 xcodebuild[53572:13960623] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-azvWT51r' (errno=Operation not permitted)
2026-03-25 08:18:58.553 xcodebuild[54516:13962162]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:18:58.690 xcodebuild[54516:13962159] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
CATEGORY_COUNTS {'master': 0, 'simple': 0}
FILE master
FILE simple
JSON_COMPARE_START
[]
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"); const path=require(\"path\"); const base=path.join(\".opencode\",\"skill\",\"system-spec-kit\",\"feature_catalog\"); const files={master:path.join(base,\"FEATURE_CATALOG.md\"),simple:path.join(base,\"FEATURE_CATALOG_IN_SIMPLE_TERMS.md\")}; function parse(file){ const lines=fs.readFileSync(file,\"utf8\").split(/\\r?\\n/); const cats=[]; let current=null, feat=null, buf=[]; const flush=()=>{ if(feat"'!==null){ current.features.push({name:feat, body:buf.join("'"\\n\").trim()}); feat=null; buf=[]; } }; for(const line of lines){ if(/"'^## (?!TABLE OF CONTENTS)('"\\d+\\.|\\d+ )/.test(line)){ flush(); const m=line.match(/"'^##'"\\s+\\d+\\.\\s+(.*)"'$/); const name=(m?m[1]:line.slice(3)).trim(); current={name, features:[]}; cats.push(current); } else if(current && line.startsWith("### ")){ flush(); feat=line.slice(4).trim(); } else if(feat!==null){ buf.push(line); } } flush(); return cats; } const parsed={master:parse(files.master), simple:parse(files.simple)}; console.log("CATEGORY_COUNTS", JSON.stringify({master:parsed.master.length,simple:parsed.simple.length})); for(const which of ["master","simple"]){ console.log("FILE", which); for(const c of parsed[which]) console.log(`${c.name}'"\\t"'${c.features.length}`); } const rows=parsed.master.map(c=>{ const simple=(parsed.simple.find(x=>x.name===c.name)||{features:[]}).features.map(f=>f.name); const master=c.features.map(f=>f.name); return {category:c.name, master_count:master.length, simple_count:simple.length, missing_in_simple:master.filter(x=>!simple.includes(x)), extra_in_simple:simple.filter(x=>!master.includes(x))}; }); console.log("JSON_COMPARE_START"); console.log(JSON.stringify(rows,null,2));'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
CATEGORY_COUNTS {"master":21,"simple":21}
FILE master
OVERVIEW	2
RETRIEVAL	11
MUTATION	10
DISCOVERY	3
MAINTENANCE	2
LIFECYCLE	7
ANALYSIS	7
EVALUATION	2
BUG FIXES AND DATA INTEGRITY	11
EVALUATION AND MEASUREMENT	14
GRAPH SIGNAL ACTIVATION	16
SCORING AND CALIBRATION	22
QUERY INTELLIGENCE	11
MEMORY QUALITY AND INDEXING	24
PIPELINE ARCHITECTURE	22
RETRIEVAL ENHANCEMENTS	9
TOOLING AND SCRIPTS	17
GOVERNANCE	4
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"), path=require(\"path\"); const base=path.join(\".opencode\",\"skill\",\"system-spec-kit\",\"feature_catalog\"); const files={master:path.join(base,\"FEATURE_CATALOG.md\"),simple:path.join(base,\"FEATURE_CATALOG_IN_SIMPLE_TERMS.md\")}; function parse(file){ const lines=fs.readFileSync(file,\"utf8\").split(/\\r?\\n/); const cats=[]; let current=null, feat=null, buf=[]; const flush=()=>{ if(feat"'!==null){ const body=buf.join("'"\\n\").trim(); const lower=body.toLowerCase(); const planned = lower.includes(\"roadmap only\") || lower.includes(\"planned feature\") || lower.includes(\"planned but not yet implemented\") || lower.includes(\"not built yet\") || lower.includes(\"not yet implemented\") || lower.includes(\"still deferred\") || lower.includes(\"is still deferred\") || lower.includes(\"planned but\") || lower.includes(\"remains deferred until\") || lower.includes(\"future enhancement\") || lower.includes(\"would let you\"); current.features.push({name:feat,status:planned?\"planned\":\"implemented\",body}); feat=null; buf=[]; } }; for(const line of lines){ if(/"'^## (?!TABLE OF CONTENTS)('"\\d+\\.|\\d+ )/.test(line)){ flush(); const m=line.match(/"'^##'"\\s+\\d+\\.\\s+(.*)"'$/); current={name:(m?m[1]:line.slice(3)).trim(),features:[]}; cats.push(current); } else if(current && line.startsWith("### ")){ flush(); feat=line.slice(4).trim(); } else if(feat!==null){ buf.push(line); } } flush(); return cats; } const parsed={master:parse(files.master), simple:parse(files.simple)}; const mismatches=[]; for(const mc of parsed.master){ const sc=parsed.simple.find(x=>x.name===mc.name); for(const mf of mc.features){ const sf=(sc?.features||[]).find(x=> x.name===mf.name || x.name===mf.name.replace("via /memory:continue","(/memory:continue)") || mf.name===x.name.replace("(/memory:continue)","via /memory:continue")); if(!sf){ mismatches.push({category:mc.name,feature:mf.name,master:mf.status,simple:"missing"}); } else if(sf.status!==mf.status){ mismatches.push({category:mc.name,feature:mf.name,master:mf.status,simple:sf.status}); } } } console.log(JSON.stringify(mismatches,null,2));'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
[
  {
    "category": "OVERVIEW",
    "feature": "Audit Phase Coverage Notes (020-022)",
    "master": "implemented",
    "simple": "missing"
  },
  {
    "category": "MUTATION",
    "feature": "Namespace management CRUD tools (shared-memory lifecycle)",
    "master": "implemented",
    "simple": "planned"
  }
]
exec
/bin/zsh -lc "sed -n '240,340p' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

Before starting a task, this tool records how much you know, how uncertain you are and how complete your context is. It is like taking a "before" photo at the start of a home renovation. Later, you can compare against the "after" to measure how much progress you made and what you learned along the way.

### Post-task learning measurement (task_postflight)

After finishing a task, this tool takes the "after" measurement and compares it against the "before" baseline. It calculates a score that tells you how much you learned. A high score means you gained real new understanding. A low score means you mostly applied what you already knew. A negative score means you discovered that what you thought was true turned out to be wrong.

### Learning history (memory_get_learning_history)

This shows you a report card of learning across all completed tasks in a project. You can see the average learning score, which tasks produced the biggest breakthroughs and whether your understanding is trending up or down over time. It is like a fitness tracker for knowledge growth. Behind the scenes, it now initializes its schema per database connection and rejects `NaN` scores, so swapped databases and malformed inputs do not quietly corrupt the results.

---

## 8. EVALUATION

### Ablation studies (eval_run_ablation)

This tool tests how important each part of the search system is by turning off one piece at a time and measuring the difference. It is like removing one ingredient from a recipe to see if the dish still tastes good. The results tell you which components are critical and which ones you could remove without hurting search quality. Token-usage summaries now skip fake zeroes when a run did not actually collect token data.

### Reporting dashboard (eval_reporting_dashboard)
exec
/bin/zsh -lc 'rg -n "''^### Namespace management CRUD tools '"\\(shared-memory lifecycle\\)|"'^### Audit Phase Coverage Notes '"\\(020-022\\)|"'^### Session recovery" .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md:103:### Session recovery (/memory:continue)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md:141:### Namespace management CRUD tools (shared-memory lifecycle)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:42:### Audit Phase Coverage Notes (020-022)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:284:### Session recovery via /memory:continue
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:468:### Namespace management CRUD tools (shared-memory lifecycle)
exec
/bin/zsh -lc "sed -n '300,380p' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
After recovery, the command routes to `/spec_kit:resume` for structured spec-folder work or `/memory:analyze history` for broader historical analysis, depending on user intent.

#### Source Files

| File | Role |
|------|------|
| `.opencode/command/memory/continue.md` | `/memory:continue` command definition with auto/manual workflows |

See [`01--retrieval/11-session-recovery-memory-continue.md`](01--retrieval/11-session-recovery-memory-continue.md) for full details.

---

## 3. MUTATION

This section documents 10 mutation features.

### Memory indexing (memory_save)

#### Description

exec
/bin/zsh -lc "sed -n '120,170p' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

You can rename a memory or change its priority without deleting and re-creating it. When you change the title, the system automatically updates its internal search index to match. If the update fails partway through, everything rolls back to the way it was before so you never end up with a half-changed record.

When an update includes a new embedding, the system now marks that embedding as pending until the new vector row is actually written. This means a failed sqlite-vec write cannot leave the memory pretending its embedding update succeeded. Successful updates also clear the search cache immediately, so renamed memories and new trigger phrases show up right away.

### Single and folder delete (memory_delete)

You can remove one memory at a time or clear out an entire folder at once. Before a big deletion, the system takes a snapshot so you can undo it if you change your mind. Deletions are all-or-nothing: either everything you asked to remove is gone or nothing changes at all. This prevents situations where only half the data gets deleted and the rest is left in a messy state.

### Tier-based bulk deletion (memory_bulk_delete)

This is the cleanup tool for large-scale housekeeping. You can delete all outdated or temporary memories in one go based on their importance level, like clearing out the recycling bin. The most important memories get extra protection so they cannot be accidentally wiped. A safety snapshot is taken first so you can restore if needed.

### Validation feedback (memory_validate)

After a search result is shown to you, you can tell the system whether it was helpful or not. Helpful results get a confidence boost so they show up more often in the future. Unhelpful results get demoted so they appear less. Over time, the system learns which memories are genuinely useful and which ones keep missing the mark, like training a recommendation engine with your thumbs-up and thumbs-down.

### Transaction wrappers on mutation handlers

Every time the system saves or changes your data, it wraps the operation in a safety net. If anything goes wrong mid-save, all changes roll back so you never end up with half-written or corrupted information. This is like a bank transfer that either completes fully or does not happen at all.
exec
/bin/zsh -lc "sed -n '455,495p' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

Every time the system saves or changes your data, it wraps the operation in a safety net. If anything goes wrong mid-save, all changes roll back so you never end up with half-written or corrupted information. This is like a bank transfer that either completes fully or does not happen at all.

#### Current Reality

`memory-crud-update.ts` wraps its mutation steps in a transaction (`runInTransaction`) so the DB update, embedding status write, BM25 re-index and mutation ledger append either commit together or roll back together. `memory-crud-delete.ts` wraps both the single-delete and bulk-folder delete paths in database transactions so confirmed deletes, history rows, causal-edge cleanup and mutation-ledger entries stay aligned. Cache invalidation and post-mutation hooks remain outside the transaction as in-memory/post-commit work. Unlike update, delete no longer falls back when the DB handle is missing: it aborts early to avoid orphaned causal edges or missing audit/history writes. The reconsolidation bridge `storeMemory` callback also wraps index, metadata, BM25 and history writes in a transaction for atomicity. Lifecycle `recordHistory()` writes now run inside mutation transactions across ADD/UPDATE/DELETE paths, and update BM25 handling distinguishes infrastructure failures (warn and continue) from data failures (roll back).

#### Source Files

See [`02--mutation/06-transaction-wrappers-on-mutation-handlers.md`](02--mutation/06-transaction-wrappers-on-mutation-handlers.md) for full implementation and test file listings.

---

### Namespace management CRUD tools (shared-memory lifecycle)

#### Description

Shared-memory spaces let multiple users or agents access the same pool of knowledge under a deny-by-default membership model. Four shipped tools provide workspace-level scoping beyond per-spec-folder filtering: create or update spaces, control user/agent access, inspect rollout status, and enable the subsystem. All four tools are live under the `/memory:shared` command.

#### Current Reality
exec
/bin/zsh -lc 'rg -n "ROADMAP ONLY|not yet implemented|still deferred|remains deferred|planned but|planned feature|No source files yet|deferred until|future enhancement" .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md:93:This planned feature would let you pull out a single section from a large document by its heading, like opening a book directly to the chapter you need instead of flipping through the whole thing. It is not built yet because current documents are small enough that fetching the whole file works fine.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md:143:Shared-memory spaces let multiple users or agents access the same pool of knowledge. Four shipped tools live under `/memory:shared`: `shared_space_upsert` creates or updates a space with tenant and actor identity, `shared_space_membership_set` controls who gets access using a deny-by-default model (nobody gets in unless explicitly granted `owner`, `editor`, or `viewer` access), `shared_memory_status` reports what is enabled and who has access, and `shared_memory_enable` turns on the subsystem for the first time. The first create auto-grants the acting caller owner access so the space is not locked out from the start. Think of it like a shared office with a keycard lock: you must first turn on the lock system, then add names to the access list. The original plan for full workspace management (list/create/switch/delete) is still deferred since the shared-memory tools cover the current need.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md:413:Anchor markers are labels placed inside memories to highlight important sections. This planned feature would turn those labels into connection points in the knowledge graph, letting the system link specific parts of different memories together instead of just linking whole memories. It has been put on hold pending further investigation into whether the added complexity is worthwhile.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md:749:Right now, the memory server starts fresh every time it is called and shuts down when the conversation ends. This planned feature would keep the server running in the background so it is always warm and ready, like leaving your car engine idling instead of restarting it every time you need to drive. It is deferred until the underlying connection standards settle down.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:234:This planned feature would let you pull out a single section from a large document by its heading, like opening a book directly to the chapter you need instead of flipping through the whole thing. It is not built yet because current documents are small enough that fetching the whole file works fine.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:238:**ROADMAP ONLY.** `read_spec_section(filePath, heading)` via Markdown AST parsing (`remark`) is still deferred until spec docs routinely exceed ~1000 lines. Existing anchor-aware thinning remains the current approach, so this is not part of the current runtime surface.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:242:No source files yet. This feature is planned but not yet implemented.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:483:The original full namespace CRUD (`list/create/switch/delete`) for complete multi-tenant isolation remains deferred. Current scoping relies on logical `specFolder` filtering augmented by the shared-memory tools above.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1665:Anchor markers are labels placed inside memories to highlight important sections. This planned feature would turn those labels into connection points in the knowledge graph, letting the system link specific parts of different memories together instead of just linking whole memories. It has been put on hold pending further investigation into whether the added complexity is worthwhile.
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:3226:Right now, the memory server starts fresh every time it is called and shuts down when the conversation ends. This planned feature would keep the server running in the background so it is always warm and ready, like leaving your car engine idling instead of restarting it every time you need to drive. It is deferred until the underlying connection standards settle down.
codex
The structural diff is mostly clean: both files have 21 top-level categories, and every category after `OVERVIEW` matches feature-for-feature. I’m now validating the only real drift point and doing a few spot checks where status wording could be easy to oversimplify.
exec
/bin/zsh -lc "sed -n '65,110p' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
### Semantic and lexical search (memory_search)

This is the main search tool. You type what you are looking for in plain language and the system searches through all stored knowledge to find the best matches. It understands meaning (not just keywords), so searching for "login problems" can find a document titled "authentication troubleshooting." Without it, you would have no way to find relevant information in the knowledge base.

Recent hardening closed three confusing edge cases. Expired memories no longer slip into multi-concept searches, malformed embeddings now fail with a clear validation error instead of a low-level sqlite-vec crash, and constitutional memories no longer overflow the requested limit when they already fill the result set.

### Fast delegated search (memory_quick_search)

This is the lightweight search entry point for callers that want the main semantic search behavior without having to set a large option surface themselves. It works like a preset: you provide a query and optional governed-scope boundaries, and the server forwards the request to the full search tool using sensible retrieval defaults.

### Trigger phrase matching (memory_match_triggers)

This is the speed-first search option. Instead of doing a deep analysis of your question, it matches specific phrases you type against a list of known keywords, like a phone's autocomplete. It returns results almost instantly, which makes it great for quick lookups where you already know roughly what you are looking for. Frequently used memories show up with full details while older ones appear as lightweight pointers. It now also checks tenant, user, agent, and shared-space boundaries after matching so one tenant's trigger phrases do not leak into another tenant's results.

### Hybrid search pipeline

When you search for something, the system looks in several places at once, like checking both the index and the shelves in a library. It then combines all the results and ranks them by relevance so the best match shows up first. If the first search comes back empty, the system automatically widens its net and tries again with looser criteria so you almost never get zero results. The last-resort SQL fallback now keeps archived memories out unless you explicitly ask for them, and score boosts from co-activation and session memory stay in sync so later ranking code sees the same boosted values.

### 4-stage pipeline architecture

exec
/bin/zsh -lc 'rg -n "''^### (Unified context retrieval '"\\(memory_context\\)|AST-level section retrieval tool|Namespace management CRUD tools \\(shared-memory lifecycle\\)|Persistent MCP server|Feature flag sunset audit)\" .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md:61:### Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md:91:### AST-level section retrieval tool
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md:141:### Namespace management CRUD tools (shared-memory lifecycle)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md:899:### Feature flag sunset audit
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:69:### Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:230:### AST-level section retrieval tool
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:468:### Namespace management CRUD tools (shared-memory lifecycle)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:3911:### Feature flag sunset audit
exec
/bin/zsh -lc "sed -n '3205,3255p' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

### Dynamic server instructions at MCP initialization

#### Description

When the memory server starts up, it now tells the calling AI how many memories are stored, how many folders exist and which search methods are available. This is like a librarian greeting you at the door with a summary of what the library has today. It helps the AI make smarter decisions about how to search right from the start.

#### Current Reality

**IMPLEMENTED (Sprint 019).** Startup in `context-server.ts` uses `server.setInstructions()` to inject a dynamic memory-system overview (total memories, spec folder count, channels, stale count) into the MCP instruction payload. Reuses existing `memory_stats` logic. Gated by `SPECKIT_DYNAMIC_INIT` (default `true`).

#### Source Files

See [`14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md`](14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md) for full implementation and test file listings.

---

### Warm server / daemon mode

#### Description
exec
/bin/zsh -lc "sed -n '735,770p' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
### DB_PATH extraction and import standardization

Multiple parts of the system were figuring out where the database lives in their own way, each with its own hardcoded path. This fix created one shared place that knows the database location, and everyone else just asks it. It is like giving the whole team the same address book instead of each person keeping their own copy that might go out of date.

### Strict Zod schema validation

AI assistants sometimes invent parameters that do not exist when calling tools. This feature checks every incoming request against a strict rulebook and rejects anything that does not match. It is like a bouncer who checks your ID against the guest list: if your name is not on the list, you do not get in. This prevents made-up inputs from causing unexpected behavior.

### Dynamic server instructions at MCP initialization

When the memory server starts up, it now tells the calling AI how many memories are stored, how many folders exist and which search methods are available. This is like a librarian greeting you at the door with a summary of what the library has today. It helps the AI make smarter decisions about how to search right from the start.

### Warm server / daemon mode

Right now, the memory server starts fresh every time it is called and shuts down when the conversation ends. This planned feature would keep the server running in the background so it is always warm and ready, like leaving your car engine idling instead of restarting it every time you need to drive. It is deferred until the underlying connection standards settle down.

### Backend storage adapter abstraction

The system is still backed by the same database, but the search storage layer now connects through a standardized adapter instead of being hard-wired directly. It is like changing from plugging appliances straight into the wall to using a standardized socket adapter first. You still use the same power source today, but the coupling point is cleaner and easier to replace later if scale ever demands it. Note that only the search storage uses this adapter. The connection graph and document storage still talk directly to the database, so those boundaries remain tightly coupled until a real need appears to swap them out.

exec
/bin/zsh -lc "sed -n '60,115p' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
| `/memory:save` | 4 | shared | `memory_save`, `memory_index_scan`, `memory_stats`, `memory_update` |
| `/memory:shared` | 4 | owns | `shared_space_upsert`, `shared_space_membership_set`, `shared_memory_status`, `shared_memory_enable` |

**Owns** means the command is the primary home for those tools. **Shared** means the command borrows tools whose primary home is another command (typically `/memory:analyze` or `/memory:manage`).

---

## 2. RETRIEVAL

### Unified context retrieval (memory_context)

#### Description

When you ask the system a question, it figures out what kind of help you need and automatically picks the best way to find the answer. Think of it like a smart librarian who reads your request, decides whether you need a quick lookup or a deep research session and then fetches the right materials for you. Without this, you would have to manually tell the system how to search every time.

#### Current Reality

You send a query or prompt. The system figures out what you need. That is the core idea behind `memory_context`: an L1 orchestration layer that auto-detects your task intent and routes to the best retrieval strategy without you having to pick one.

Intent detection classifies your input into one of seven types (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and maps it to a retrieval mode. Five modes are available: auto (default, intent-detected routing), quick (trigger matching for fast lookups), deep (comprehensive semantic search across the full corpus), focused (intent-optimized with tighter filtering) and resume (session recovery targeting state, next-steps, summary and blocker anchors with full content included).
exec
/bin/zsh -lc "sed -n '1608,1688p' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

See [`10--graph-signal-activation/06-causal-depth-signal.md`](10--graph-signal-activation/06-causal-depth-signal.md) for full implementation and test file listings.

---

### Community detection

#### Description

Memories naturally form clusters around related topics, like how books on a shelf group by subject. This feature identifies those clusters automatically. When you find one useful memory, the system can pull in its neighbors from the same cluster because they are likely related to what you are looking for. It is like finding one helpful book and having the librarian hand you the two sitting next to it.

#### Current Reality

Individual memories are retrieved based on query similarity, but they exist within communities of related knowledge. Community detection identifies these clusters so that when one member surfaces, its neighbors get a retrieval boost.

The primary algorithm is BFS connected components over the causal edge adjacency list. This is fast and sufficient when the graph has natural cluster boundaries. When the largest connected component exceeds 50% of all nodes (meaning the graph is too densely connected for BFS to produce meaningful clusters), the system escalates to a simplified pure-TypeScript Louvain modularity optimization. The Louvain implementation performs iterative node moves between communities to maximize modularity score Q, converging when no single move improves Q.

Community assignments are stored in the `community_assignments` table with a UNIQUE constraint on `memory_id`. Detection and persistence helpers (`detectCommunities*`, `storeCommunityAssignments`) include debounce logic, but they are not auto-invoked in the Stage 2 hot path.

The `applyCommunityBoost()` function in the pipeline injects up to 3 community co-members into the result set at 0.3x the source memory's score, using whatever assignments already exist in `community_assignments`. Community injection runs in Stage 2 at position 2b (between causal boost and graph signals) so that injected rows also receive N2a+N2b momentum and depth adjustments. Runs behind the `SPECKIT_COMMUNITY_DETECTION` flag (default ON).
exec
/bin/zsh -lc 'rg -n "''^### Anchor-level graph edges|''^### Warm server / daemon mode|''^### Dynamic server instructions at MCP initialization|''^### Fast delegated search '"\\(memory_quick_search\\)\" .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md:71:### Fast delegated search (memory_quick_search)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md:743:### Dynamic server instructions at MCP initialization
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md:747:### Warm server / daemon mode
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:119:### Fast delegated search (memory_quick_search)
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:3206:### Dynamic server instructions at MCP initialization
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:3222:### Warm server / daemon mode
exec
/bin/zsh -lc "sed -n '402,420p' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

### Community detection

Memories naturally form clusters around related topics, like how books on a shelf group by subject. This feature identifies those clusters automatically. When you find one useful memory, the system can pull in its neighbors from the same cluster because they are likely related to what you are looking for. It is like finding one helpful book and having the librarian hand you the two sitting next to it.

### Graph and cognitive memory fixes

This is a collection of seven bug fixes for the relationship graph and memory scoring systems. Problems included a memory linking to itself (a loop that makes no sense), cluster detection that could not tell when links were deleted and replaced, and scores that could climb higher than they should. Without these fixes, the graph connections and scoring would slowly drift into unreliable territory.

### ANCHOR tags as graph nodes

Anchor markers are labels placed inside memories to highlight important sections. This planned feature would turn those labels into connection points in the knowledge graph, letting the system link specific parts of different memories together instead of just linking whole memories. It has been put on hold pending further investigation into whether the added complexity is worthwhile.

### Causal neighbor boost and injection

When a search result scores highly, this feature follows its cause-and-effect links to find related memories nearby in the graph. Those neighbors get a score bump because if Memory A is relevant and it caused or enabled Memory B, there is a good chance Memory B matters too. There is a ceiling on how much boost any result can receive so that highly connected clusters do not take over all the top spots.

### Temporal contiguity layer

exec
/bin/zsh -lc "sed -n '150,190p' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
Where this tool gets interesting is the cognitive pipeline. When you provide a session ID with `include_cognitive=true`, the system applies FSRS-based attention decay (scores degrade each turn via `0.98^(turn-1)` exponential decay), memory activation (matched memories get their attention score set to 1.0), co-activation spreading (each activated memory spreads activation to related memories through the co-occurrence graph), tier classification (maps effective retrievability to HOT, WARM, COLD, DORMANT or ARCHIVED) and tiered content injection.

Tiered content injection is the most visible effect. HOT memories return their full file content read from disk. WARM memories return the first 150 characters as a summary. COLD memories and below return no content at all. This tiering means recently active and highly relevant memories arrive with full context while dormant ones arrive as lightweight pointers.

The cognitive path fetches 2x the requested limit from the trigger matcher to give the cognitive pipeline headroom for filtering. If you request 3 results, 6 candidates enter the cognitive pipeline and the top 3 survivors are returned.

#### Source Files

See [`01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md`](01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md) for full implementation and test file listings.

---

### Hybrid search pipeline

#### Description

When you search for something, the system looks in several places at once, like checking both the index and the shelves in a library. It then combines all the results and ranks them by relevance so the best match shows up first. If the first search comes back empty, the system automatically widens its net and tries again with looser criteria so you almost never get zero results.

#### Current Reality

exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"), path=require(\"path\"); const base=path.join(\".opencode\",\"skill\",\"system-spec-kit\",\"feature_catalog\"); function parse(file){ const lines=fs.readFileSync(file,\"utf8\").split(/\\r?\\n/); const cats=[]; let current=null, feat=null; for(const line of lines){ if(/"'^## (?!TABLE OF CONTENTS)('"\\d+\\.|\\d+ )/.test(line)){ const m=line.match(/"'^##'"\\s+\\d+\\.\\s+(.*)"'$/); current={name:(m?m[1]:line.slice(3)).trim(), features:[]}; cats.push(current); } else if(current && line.startsWith("### ")){ current.features.push(line.slice(4).trim()); } } return cats; } const m=parse(path.join(base,"FEATURE_CATALOG.md")); const s=parse(path.join(base,"FEATURE_CATALOG_IN_SIMPLE_TERMS.md")); const normalized=x=>x.replace("via /memory:continue","(/memory:continue)"); const rows=m.map(mc=>{ const sc=s.find(x=>x.name===mc.name)||{features:[]}; const mm=mc.features.map(normalized), sm=sc.features.map(normalized); const same=mm.length===sm.length && mm.every((f,i)=>sm.includes(f)); return {category:mc.name, master:mm.length, simple:sm.length, match:same}; }); const totals={master_categories:m.length,simple_categories:s.length,master_features:m.reduce((a,c)=>a+c.features.length,0),simple_features:s.reduce((a,c)=>a+c.features.length,0),fully_aligned:rows.filter(r=>r.match).length,drifted:rows.filter(r=>!r.match).length}; console.log(JSON.stringify({rows, totals}, null, 2));'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
{
  "rows": [
    {
      "category": "OVERVIEW",
      "master": 2,
      "simple": 1,
      "match": false
    },
    {
      "category": "RETRIEVAL",
      "master": 11,
      "simple": 11,
      "match": true
    },
    {
      "category": "MUTATION",
      "master": 10,
      "simple": 10,
      "match": true
    },
exec
/bin/zsh -lc "sed -n '119,145p' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
### Fast delegated search (memory_quick_search)

#### Description

This is the lightweight search entry point for callers that want the main semantic search behavior without having to set a large option surface themselves. It works like a preset: you provide a query and optional governed-scope boundaries, and the server forwards the request to the full search tool using sensible retrieval defaults.

#### Current Reality

`memory_quick_search` is a live MCP tool, not just a README alias. The dispatcher in `tools/memory-tools.ts` validates the tool's narrowed input schema and forwards the call to `memory_search` with a fixed profile: `autoDetectIntent=true`, `enableDedup=true`, `includeContent=true`, `includeConstitutional=true`, and `rerank=true`. The public arguments are intentionally narrow: `query`, `limit`, `specFolder`, `tenantId`, `userId`, `agentId`, and `sharedSpaceId`. That makes it useful for fast governed retrieval while keeping the heavyweight search configuration surface on `memory_search`.

#### Source Files

- `mcp_server/tools/memory-tools.ts`
- `mcp_server/tool-schemas.ts`
- `mcp_server/schemas/tool-input-schemas.ts`
- `mcp_server/README.md`

---

### Trigger phrase matching (memory_match_triggers)
exec
/bin/zsh -lc "sed -n '3911,3935p' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '899,909p' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
### Feature flag sunset audit

#### Description

This audit went through all 79 feature switches in the system and decided the fate of each one. Most were ready to become permanent (switch removed, feature stays on). Some were dead and got deleted. A few remain as active controls. Without this cleanup, the system would accumulate unused switches that confuse anyone trying to understand what is actually running.

#### Current Reality

A comprehensive audit at Sprint 7 exit found 79 unique `SPECKIT_` flags across the codebase. Disposition: 27 flags are ready to graduate to permanent-ON defaults (removing the flag check), 9 flags are identified as dead code for removal and 3 flags remain as active operational knobs (`ADAPTIVE_FUSION`, `COACTIVATION_STRENGTH`, `PRESSURE_POLICY`).

The current active flag-helper inventory in `search-flags.ts` is 24 exported `is*` functions (including the deprecated `isPipelineV2Enabled()` compatibility shim and the newly added `isQualityLoopEnabled()`). Sprint 0 core flags remain default ON, sprint-graduated flags from Sprints 3-6 remain default ON and deferred-feature flags (including GRAPH_SIGNALS, COMMUNITY_DETECTION, MEMORY_SUMMARIES, AUTO_ENTITIES and ENTITY_LINKING) are now default ON. `SPECKIT_ABLATION` remains default OFF as an opt-in evaluation tool.

**Phase 017 update:** The legacy V1 pipeline code was removed, leaving the 4-stage pipeline as the only supported path. `SPECKIT_PIPELINE_V2` remains part of historical audit context but is no longer consumed by runtime code.

**Sprint 8 update:** Flag graduation and dead code removal have been completed. The Sprint 8 comprehensive remediation removed a large dead-code slice including: dead feature flag branches in `hybrid-search.ts` (RSF and shadow-scoring), dead feature flag functions (`isShadowScoringEnabled`, `isRsfEnabled`), dead module-level state (`stmtCache`, `lastComputedAt`, `activeProvider`, `flushCount`, 3 dead config fields in `working-memory.ts`) and dead functions/exports (`computeCausalDepth` single-node variant, `getSubgraphWeights`, `RECOVERY_HALF_LIFE_DAYS`, `logCoActivationEvent`). `isInShadowPeriod` in learned feedback remains active as Safeguard #6. See [Comprehensive remediation (Sprint 8)](#comprehensive-remediation-sprint-8) for the full accounting.

#### Source Files

No dedicated source files. This describes governance process controls.

 succeeded in 0ms:
### Feature flag sunset audit

This audit went through all 79 feature switches in the system and decided the fate of each one. Most were ready to become permanent (switch removed, feature stays on). Some were dead and got deleted. A few remain as active controls. A comprehensive cleanup pass acted on these findings by removing a large amount of unused code: old switches that were always off, variables that were set but never read and functions that nothing called anymore. Without this kind of periodic cleanup, the system would accumulate unused switches that confuse anyone trying to understand what is actually running.

### Hierarchical scope governance, governed ingest, retention, and audit

This feature controls who can save and read memories and keeps a record of every decision it makes. When someone tries to save information, the system checks their identity and requires proof of where the information came from. It is like a secure document room where you must show your badge, sign in and explain what you are filing before you are allowed to add or retrieve anything. Ephemeral memories now must include an expiration time, and if the governance metadata step fails after a save, the new row is deleted so a half-governed record is not left behind.

### Shared-memory rollout, deny-by-default membership, and kill switch

Shared memory spaces let multiple users or agents access the same pool of knowledge. Four shipped tools handle the lifecycle under `/memory:shared`: `shared_memory_enable` turns on the subsystem, `shared_space_upsert` creates or updates spaces, `shared_space_membership_set` controls who gets in, and `shared_memory_status` reports the current state. The subsystem is disabled by default and requires explicit opt-in: either set the appropriate environment variable or run the first-time enablement flow via `/memory:shared enable`. Once enabled, access is deny-by-default: nobody gets in unless they are explicitly granted membership with a role (`owner`, `editor`, or `viewer`). An emergency kill switch immediately blocks everyone if something goes wrong. It is like a shared office with a keycard lock that starts powered off: you must first turn on the lock system, then add names to the access list, and building management can lock it down instantly in an emergency. Shared members can now see each other's shared memories without needing an exact actor or session match, and partial space updates no longer erase saved cohort or metadata fields.
exec
/bin/zsh -lc "sed -n '38,58p' .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
## 1. OVERVIEW

Use this simplified catalog as the plain-language companion to the full feature catalog. The numbered sections below keep the same capability grouping as the canonical reference, but explain the system in operator-friendly terms so readers can understand what each part does before diving into implementation details.

### Command-Surface Contract

The memory system exposes **33 tools** through **6 slash commands**. Think of commands as doors into the system. Each door only opens access to the tools it needs. The source of truth for which tools each command can use is the `allowed-tools` field in each command file under `.opencode/command/memory/`.

| Command | What It Does | Tools It Can Use |
|---------|-------------|-----------------|
| `/memory:analyze` | Search, retrieve, and analyze knowledge (13 tools) | `memory_context`, `memory_quick_search`, `memory_search`, `memory_match_triggers`, `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `eval_run_ablation`, `eval_reporting_dashboard`, `memory_get_learning_history` |
| `/memory:continue` | Recover an interrupted session (4 tools, borrowed) | `memory_context`, `memory_search`, `memory_list`, `memory_stats` |
| `/memory:learn` | Create and manage always-surface rules (6 tools, borrowed) | `memory_save`, `memory_search`, `memory_stats`, `memory_list`, `memory_delete`, `memory_index_scan` |
| `/memory:manage` | Database maintenance, checkpoints, and bulk ingestion (16 tools) | `memory_stats`, `memory_list`, `memory_search`, `memory_index_scan`, `memory_validate`, `memory_update`, `memory_delete`, `memory_bulk_delete`, `memory_health`, `checkpoint_create`, `checkpoint_restore`, `checkpoint_list`, `checkpoint_delete`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel` |
| `/memory:save` | Save conversation context (4 tools, borrowed) | `memory_save`, `memory_index_scan`, `memory_stats`, `memory_update` |
| `/memory:shared` | Manage shared-memory spaces and memberships (4 tools) | `shared_space_upsert`, `shared_space_membership_set`, `shared_memory_status`, `shared_memory_enable` |

Some commands own their tools (they are the primary home) while others borrow tools from `/memory:analyze` or `/memory:manage`. A borrowed tool works the same way; it is just administered somewhere else.

---
codex
# Iteration 013: Simple Terms vs Master Catalog Alignment
## Agent: codex / gpt-5.4 / high
## Dimension: traceability
## Files Reviewed
- [FEATURE_CATALOG.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
- [FEATURE_CATALOG_IN_SIMPLE_TERMS.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md)

## Alignment Check
### Category Counts
- Master: 21 categories
- Simple: 21 categories
- Match: YES

### Per-Category Feature Count Comparison
| Category | Master Features | Simple Features | Match |
|----------|-----------------|-----------------|-------|
| OVERVIEW | 2 | 1 | NO |
| RETRIEVAL | 11 | 11 | YES |
| MUTATION | 10 | 10 | YES |
| DISCOVERY | 3 | 3 | YES |
| MAINTENANCE | 2 | 2 | YES |
| LIFECYCLE | 7 | 7 | YES |
| ANALYSIS | 7 | 7 | YES |
| EVALUATION | 2 | 2 | YES |
| BUG FIXES AND DATA INTEGRITY | 11 | 11 | YES |
| EVALUATION AND MEASUREMENT | 14 | 14 | YES |
| GRAPH SIGNAL ACTIVATION | 16 | 16 | YES |
| SCORING AND CALIBRATION | 22 | 22 | YES |
| QUERY INTELLIGENCE | 11 | 11 | YES |
| MEMORY QUALITY AND INDEXING | 24 | 24 | YES |
| PIPELINE ARCHITECTURE | 22 | 22 | YES |
| RETRIEVAL ENHANCEMENTS | 9 | 9 | YES |
| TOOLING AND SCRIPTS | 17 | 17 | YES |
| GOVERNANCE | 4 | 4 | YES |
| UX HOOKS | 19 | 19 | YES |
| SPEC KIT PHASE WORKFLOWS | 4 | 4 | YES |
| FEATURE FLAG REFERENCE | 7 | 7 | YES |

### Status Flags
- Explicit planned/deferred items checked in both docs: 3
- Status drift found: 0
- Verified aligned as planned/deferred:
  - `AST-level section retrieval tool`
  - `ANCHOR tags as graph nodes`
  - `Warm server / daemon mode`
- Verified aligned as implemented despite deferred sub-scope:
  - `Namespace management CRUD tools (shared-memory lifecycle)`

### Features Present In One But Not The Other
- Present in master only:
  - `Audit Phase Coverage Notes (020-022)` in `OVERVIEW`
- Present in simple only:
  - None
- Title wording variation only, not treated as drift:
  - `Session recovery via /memory:continue` vs `Session recovery (/memory:continue)`

### Content Accuracy Spot-Checks
- `Unified context retrieval (memory_context)` is a faithful simplification: the simple doc preserves the intent-routing behavior and operator framing while dropping token-budget and rollout-flag internals. See [FEATURE_CATALOG.md#L69](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md#L69) and [FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L61](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L61).
- `Fast delegated search (memory_quick_search)` is accurate: the simple doc correctly describes it as a narrow wrapper/preset over `memory_search` without overstating capability. See [FEATURE_CATALOG.md#L119](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md#L119) and [FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L71](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L71).
- `AST-level section retrieval tool` keeps the roadmap-only status intact and accurately says it is not built yet. See [FEATURE_CATALOG.md#L230](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md#L230) and [FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L91](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L91).
- `Namespace management CRUD tools (shared-memory lifecycle)` is accurately simplified: the simple doc correctly says the four `/memory:shared` tools are shipped, while only the broader full namespace CRUD idea remains deferred. See [FEATURE_CATALOG.md#L468](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md#L468) and [FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L141](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L141).
- `Warm server / daemon mode` is accurately marked as planned/deferred in simple terms and does not imply it already ships. See [FEATURE_CATALOG.md#L3222](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md#L3222) and [FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L747](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L747).

## Findings
### P2-001: `OVERVIEW` is missing the master’s audit-coverage subsection
The master catalog includes `### Audit Phase Coverage Notes (020-022)` in [FEATURE_CATALOG.md#L42](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md#L42), but the simple catalog’s `OVERVIEW` only contains `### Command-Surface Contract` in [FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L38](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L38). That leaves the simple catalog one subsection short overall, so the docs are not strictly one-to-one traceable even though the rest of the catalog is aligned.

## Summary
- Categories compared: 21
- Fully aligned: 20, Drifted: 1
- Total findings: 1 (P0: 0, P1: 0, P2: 1)
tokens used
104,821
# Iteration 013: Simple Terms vs Master Catalog Alignment
## Agent: codex / gpt-5.4 / high
## Dimension: traceability
## Files Reviewed
- [FEATURE_CATALOG.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
- [FEATURE_CATALOG_IN_SIMPLE_TERMS.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md)

## Alignment Check
### Category Counts
- Master: 21 categories
- Simple: 21 categories
- Match: YES

### Per-Category Feature Count Comparison
| Category | Master Features | Simple Features | Match |
|----------|-----------------|-----------------|-------|
| OVERVIEW | 2 | 1 | NO |
| RETRIEVAL | 11 | 11 | YES |
| MUTATION | 10 | 10 | YES |
| DISCOVERY | 3 | 3 | YES |
| MAINTENANCE | 2 | 2 | YES |
| LIFECYCLE | 7 | 7 | YES |
| ANALYSIS | 7 | 7 | YES |
| EVALUATION | 2 | 2 | YES |
| BUG FIXES AND DATA INTEGRITY | 11 | 11 | YES |
| EVALUATION AND MEASUREMENT | 14 | 14 | YES |
| GRAPH SIGNAL ACTIVATION | 16 | 16 | YES |
| SCORING AND CALIBRATION | 22 | 22 | YES |
| QUERY INTELLIGENCE | 11 | 11 | YES |
| MEMORY QUALITY AND INDEXING | 24 | 24 | YES |
| PIPELINE ARCHITECTURE | 22 | 22 | YES |
| RETRIEVAL ENHANCEMENTS | 9 | 9 | YES |
| TOOLING AND SCRIPTS | 17 | 17 | YES |
| GOVERNANCE | 4 | 4 | YES |
| UX HOOKS | 19 | 19 | YES |
| SPEC KIT PHASE WORKFLOWS | 4 | 4 | YES |
| FEATURE FLAG REFERENCE | 7 | 7 | YES |

### Status Flags
- Explicit planned/deferred items checked in both docs: 3
- Status drift found: 0
- Verified aligned as planned/deferred:
  - `AST-level section retrieval tool`
  - `ANCHOR tags as graph nodes`
  - `Warm server / daemon mode`
- Verified aligned as implemented despite deferred sub-scope:
  - `Namespace management CRUD tools (shared-memory lifecycle)`

### Features Present In One But Not The Other
- Present in master only:
  - `Audit Phase Coverage Notes (020-022)` in `OVERVIEW`
- Present in simple only:
  - None
- Title wording variation only, not treated as drift:
  - `Session recovery via /memory:continue` vs `Session recovery (/memory:continue)`

### Content Accuracy Spot-Checks
- `Unified context retrieval (memory_context)` is a faithful simplification: the simple doc preserves the intent-routing behavior and operator framing while dropping token-budget and rollout-flag internals. See [FEATURE_CATALOG.md#L69](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md#L69) and [FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L61](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L61).
- `Fast delegated search (memory_quick_search)` is accurate: the simple doc correctly describes it as a narrow wrapper/preset over `memory_search` without overstating capability. See [FEATURE_CATALOG.md#L119](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md#L119) and [FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L71](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L71).
- `AST-level section retrieval tool` keeps the roadmap-only status intact and accurately says it is not built yet. See [FEATURE_CATALOG.md#L230](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md#L230) and [FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L91](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L91).
- `Namespace management CRUD tools (shared-memory lifecycle)` is accurately simplified: the simple doc correctly says the four `/memory:shared` tools are shipped, while only the broader full namespace CRUD idea remains deferred. See [FEATURE_CATALOG.md#L468](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md#L468) and [FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L141](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L141).
- `Warm server / daemon mode` is accurately marked as planned/deferred in simple terms and does not imply it already ships. See [FEATURE_CATALOG.md#L3222](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md#L3222) and [FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L747](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L747).

## Findings
### P2-001: `OVERVIEW` is missing the master’s audit-coverage subsection
The master catalog includes `### Audit Phase Coverage Notes (020-022)` in [FEATURE_CATALOG.md#L42](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md#L42), but the simple catalog’s `OVERVIEW` only contains `### Command-Surface Contract` in [FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L38](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md#L38). That leaves the simple catalog one subsection short overall, so the docs are not strictly one-to-one traceable even though the rest of the catalog is aligned.

## Summary
- Categories compared: 21
- Fully aligned: 20, Drifted: 1
- Total findings: 1 (P0: 0, P1: 0, P2: 1)
