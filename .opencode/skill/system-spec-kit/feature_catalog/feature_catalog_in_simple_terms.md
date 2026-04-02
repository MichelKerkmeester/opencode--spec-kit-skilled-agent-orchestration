---
title: "Spec Kit Memory: Feature Catalog (In Simple Terms)"
description: "In-simple-terms-only version of the feature catalog."
---

# Spec Kit Memory: Feature Catalog (In Simple Terms)

This document combines two complementary views of the Spec Kit Memory MCP server into a single reference. The **System Reference** section describes what the system is today: every tool, pipeline stage and capability organized by MCP layer. The **Refinement Program** section describes what was changed and why: every improvement delivered across the refinement program, with ticket IDs and implementation details.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. RETRIEVAL](#2-retrieval)
- [3. MUTATION](#3-mutation)
- [4. DISCOVERY](#4-discovery)
- [5. MAINTENANCE](#5-maintenance)
- [6. LIFECYCLE](#6-lifecycle)
- [7. ANALYSIS](#7-analysis)
- [8. EVALUATION](#8-evaluation)
- [9. BUG FIXES AND DATA INTEGRITY](#9-bug-fixes-and-data-integrity)
- [10. EVALUATION AND MEASUREMENT](#10-evaluation-and-measurement)
- [11. GRAPH SIGNAL ACTIVATION](#11-graph-signal-activation)
- [12. SCORING AND CALIBRATION](#12-scoring-and-calibration)
- [13. QUERY INTELLIGENCE](#13-query-intelligence)
- [14. MEMORY QUALITY AND INDEXING](#14-memory-quality-and-indexing)
- [15. PIPELINE ARCHITECTURE](#15-pipeline-architecture)
- [16. RETRIEVAL ENHANCEMENTS](#16-retrieval-enhancements)
- [17. TOOLING AND SCRIPTS](#17-tooling-and-scripts)
- [18. GOVERNANCE](#18-governance)
- [19. UX HOOKS](#19-ux-hooks)
- [20. SPEC KIT PHASE WORKFLOWS](#20-spec-kit-phase-workflows)
- [21. FEATURE FLAG REFERENCE](#21-feature-flag-reference)
- [22. CONTEXT PRESERVATION AND CODE GRAPH](#22-context-preservation-and-code-graph)

---

## 1. OVERVIEW

Use this simplified catalog as the plain-language companion to the full feature catalog. The numbered sections below keep the same capability grouping as the canonical reference, but explain the system in operator-friendly terms so readers can understand what each part does before diving into implementation details.

### Audit Phase Coverage Notes (020-022)

The last three code-audit phases map to existing catalog categories rather than having their own dedicated sections:

| Audit phase | Where to find it |
|---|---|
| `020-feature-flag-reference` | [`19--feature-flag-reference/08-audit-phase-020-mapping-note.md`](./19--feature-flag-reference/08-audit-phase-020-mapping-note.md) |
| `021-remediation-revalidation` | [`20--remediation-revalidation/01-category-stub.md`](./20--remediation-revalidation/01-category-stub.md) plus the linked bug-fix, pipeline-safety, and code-standards records |
| `022-implement-and-remove-deprecated-features` | [`21--implement-and-remove-deprecated-features/01-category-stub.md`](./21--implement-and-remove-deprecated-features/01-category-stub.md) plus the linked dead-code-removal and feature-flag-sunset records |

### Command-Surface Contract

The memory system exposes **43 tools** overall, while the day-to-day command layer uses **4 main memory slash commands**, the `/memory:manage shared` subcommand area, and `/spec_kit:resume` for session recovery. Think of commands as doors into the system: the full MCP server has more rooms than the command layer exposes directly. Each door only opens access to the tools it needs. The source of truth for primary ownership is the coverage matrix in `.opencode/command/memory/README.txt`, while each command file's `allowed-tools` frontmatter shows the full operational surface. The recovery contract lives in `.opencode/command/spec_kit/resume.md`.

| Command | What It Does | Tools It Can Use |
|---------|-------------|-----------------|
| `/memory:search` | Search, retrieve, and analyze knowledge (13 tools) | `memory_context`, `memory_quick_search`, `memory_search`, `memory_match_triggers`, `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `eval_run_ablation`, `eval_reporting_dashboard`, `memory_get_learning_history` |
| `/memory:learn` | Create and manage always-surface rules (6 tools, borrowed) | `memory_save`, `memory_search`, `memory_stats`, `memory_list`, `memory_delete`, `memory_index_scan` |
| `/memory:manage` | Database maintenance, checkpoints, and bulk ingestion (19 primary tools plus `memory_search` helper access) | Primary home: `memory_stats`, `memory_list`, `memory_index_scan`, `memory_validate`, `memory_update`, `memory_delete`, `memory_bulk_delete`, `memory_health`, `checkpoint_create`, `checkpoint_restore`, `checkpoint_list`, `checkpoint_delete`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`; helper access: `memory_search` |
| `/memory:save` | Save conversation context (4 tools, borrowed) | `memory_save`, `memory_index_scan`, `memory_stats`, `memory_update` |
| `/memory:manage shared` | Shared-memory subcommand area under `/memory:manage` (4 tools) | `shared_space_upsert`, `shared_space_membership_set`, `shared_memory_status`, `shared_memory_enable` |
| `/spec_kit:resume` | Continue or recover prior work (primary chain uses 3 shared tools, with extra helpers behind the scenes) | `memory_context`, `memory_search`, `memory_list` plus `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, and health, indexing, validation, checkpoint, and CocoIndex helpers in the wrapper |

Some commands own their tools (they are the primary home) while others borrow tools from `/memory:search` or `/memory:manage`. A borrowed tool works the same way; it is just administered somewhere else.

---

## 2. RETRIEVAL

### Unified context retrieval (memory_context)

When you ask the system a question, it figures out what kind of help you need and automatically picks the best way to find the answer. Think of it like a smart librarian who reads your request, decides whether you need a quick lookup or a deep research session and then fetches the right materials for you. Without this, you would have to manually tell the system how to search every time. Resume notes are now added before the size limit is enforced, so the final reply does not grow past the promised budget after those notes are attached.

### Semantic and lexical search (memory_search)

This is the main search tool. You type what you are looking for in plain language and the system searches through all stored knowledge to find the best matches. It understands meaning (not just keywords), so searching for "login problems" can find a document titled "authentication troubleshooting." Without it, you would have no way to find relevant information in the knowledge base.

Recent hardening closed three confusing edge cases. Expired memories no longer slip into multi-concept searches, malformed embeddings now fail with a clear validation error instead of a low-level sqlite-vec crash, and constitutional memories no longer overflow the requested limit when they already fill the result set.

### Fast delegated search (memory_quick_search)

This is the lightweight search entry point for callers that want the main semantic search behavior without having to set a large option surface themselves. It works like a preset: you provide a query and optional governed-scope boundaries, and the server forwards the request to the full search tool using sensible retrieval defaults.

### Trigger phrase matching (memory_match_triggers)

This is the speed-first search option. Instead of doing a deep analysis of your question, it matches specific phrases you type against a list of known keywords, like a phone's autocomplete. It returns results almost instantly, which makes it great for quick lookups where you already know roughly what you are looking for. Frequently used memories show up with full details while older ones appear as lightweight pointers. It now also checks tenant, user, agent, and shared-space boundaries after matching so one tenant's trigger phrases do not leak into another tenant's results.

### Hybrid search pipeline

When you search for something, the system looks in several places at once, like checking both the index and the shelves in a library. It then combines all the results and ranks them by relevance so the best match shows up first. If the first search comes back empty, the system automatically widens its net and tries again with looser criteria so you almost never get zero results. That widening no longer ignores your explicit routing choices: if you turned graph signals off, the fallback path keeps them off instead of quietly turning them back on. The last-resort SQL fallback also keeps archived memories out unless you explicitly ask for them, and score boosts from co-activation and session memory stay in sync so later ranking code sees the same boosted values.

### 4-stage pipeline architecture

Every search goes through four steps, like an assembly line. First, gather candidates. Second, score and rank them. Third, re-check the ranking for accuracy. Fourth, filter out anything that does not belong. Each step has one clear job and is not allowed to change results from earlier steps. This structure keeps searches predictable and prevents bugs from sneaking in between stages. Deep-mode helper branches now go through the same scope, context and quality filters as normal results, constitutional inserts obey global scope rules, and chunk reassembly now understands both `snake_case` and `camelCase` field names.

### BM25 trigger phrase re-index gate

When you change the keywords associated with a memory, the search index now updates itself to reflect those changes. Previously it only refreshed when you changed the title, so updated keywords were invisible to searches until a full rebuild. This fix makes sure the system stays in sync with your edits.

### AST-level section retrieval tool

This planned feature would let you pull out a single section from a large document by its heading, like opening a book directly to the chapter you need instead of flipping through the whole thing. It is not built yet because current documents are small enough that fetching the whole file works fine.

### Quality-aware 3-tier search fallback

If your search does not find good results on the first try, the system automatically tries again with wider criteria instead of giving up. Think of it like asking a store clerk for a specific item. If they cannot find it on the first shelf, they check the back room and then the warehouse. You almost never walk away empty-handed. The important refinement is that the wider search now stays inside the channels you still allowed, so a fallback run does not quietly re-enable graph or degree signals you explicitly turned off.

### Tool-result extraction to working memory

When the system finds something useful during a search, it keeps a mental note of it for the rest of your session. That way, if you ask a follow-up question a few turns later, the system still remembers what it found earlier. These notes gradually fade over time so the most recent findings stay prominent while older ones quietly step aside.

### Session recovery (/spec_kit:resume)

When a session is interrupted by a crash, context compaction, timeout, or an ordinary cross-session handoff, this command figures out where you left off and helps you pick up again. It checks fresh handover state first, then the memory system for your most recent work, looks for crash-recovery breadcrumbs, and presents what it found. Think of it like reopening your laptop after it went to sleep and having your browser restore all the tabs you had open. Its primary recovery chain uses 3 borrowed tools: `memory_context`, `memory_search`, and `memory_list`, while the live wrapper also keeps `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, and extra health, indexing, checkpoint, validation, and CocoIndex helpers available for resume workflows. Two modes are available: auto (resolves the best candidate with minimal prompting) and confirm (presents alternatives when it is not sure which session you want). After recovery, it keeps you inside the same resume workflow for structured work or points you to broader history when needed.

---

## 3. MUTATION

### Memory indexing (memory_save)

This is how you add new knowledge to the system. You point it at a file and it reads, understands and stores the content so it becomes searchable. Before storing, it checks whether the same information already exists and decides whether to add it fresh, update an older version or skip it entirely. Quality checks catch low-value content before it clutters up the knowledge base.

Today that save path has two extra safety checks before storage. First, memories that are too thin or lack enough supporting context are rejected outright so the system does not fill up with low-value entries. Second, files that are missing required structure (like headings, labels or metadata fields) are caught and rejected before they enter the index. You can also do a practice run to preview these checks without actually saving anything.

Another fix makes fresh saves show up reliably in repeat searches. After a successful insert, the search cache is cleared right away, so asking the same question again does not replay stale results that were computed before the new memory existed.

### Memory metadata update (memory_update)

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

### Namespace management CRUD tools (shared-memory lifecycle)

Shared-memory spaces let multiple users or agents access the same pool of knowledge. Four shipped tools live under `/memory:manage shared`: `shared_space_upsert` creates or updates a space with tenant and actor identity, `shared_space_membership_set` controls who gets access using a deny-by-default model (nobody gets in unless explicitly granted `owner`, `editor`, or `viewer` access), `shared_memory_status` reports what is enabled and who has access, and `shared_memory_enable` turns on the subsystem for the first time. The first create auto-grants the acting caller owner access so the space is not locked out from the start. Think of it like a shared office with a keycard lock: you must first turn on the lock system, then add names to the access list. The original plan for full workspace management (list/create/switch/delete) is still deferred since the shared-memory tools cover the current need.

### Prediction-error save arbitration

When you save new information, the system checks whether it already knows something similar. If it does, it decides the smartest action: strengthen the existing memory, update it in place, replace it with the new version or store both as related but different items. This prevents the knowledge base from filling up with near-identical copies while still capturing genuinely new information. When a session ID is present, it now compares only against memories from that same session, so one session does not accidentally suppress or replace another.

### Correction tracking with undo

When a newer memory replaces or refines an older one, the system records what changed and why. The old memory gets a lower confidence score while the new one gets a boost. This creates a paper trail of corrections so you can see how your knowledge evolved over time and understand why older information was updated.

### Per-memory history log

Every time a memory is created, changed or deleted, the system writes a log entry recording what happened, when and who did it. This is like a change history on a shared document. If something looks wrong later, you can trace back to exactly what changed and when it happened.

---

## 4. DISCOVERY

### Memory browser (memory_list)

This lets you browse through all stored memories page by page, like scrolling through a list of saved notes. You can sort by date or importance to find what you need. It is the simplest way to see what the system has stored without running a search query.

### System statistics (memory_stats)

This is the dashboard for your knowledge base. It tells you how many memories you have, how they are organized, which folders are most active and how large the database is. Think of it like the storage settings page on your phone that shows you how much space each app is using.

The stats dashboard now counts partially indexed memories explicitly instead of silently leaving them out of the totals. That matters for chunked or in-progress indexing jobs because the headline numbers now match what is really in the database.

### Health diagnostics (memory_health)

This is the system's self-check tool. It tells you whether the database is connected, whether the search engine is ready and whether anything looks out of place. If it finds problems, it can suggest or even perform automatic repairs. Think of it like running a diagnostic on your car to see if everything is working properly.

---

## 5. MAINTENANCE

### Workspace scanning and indexing (memory_index_scan)

This tool scans your project folders for new or changed files and adds them to the searchable knowledge base. It is like a librarian walking through the stacks every day to catalog new arrivals and update records for books that have been revised. Files that have not changed are skipped to save time. If a file fails to process, the system remembers and retries it next time. It now has two extra safeguards: it can catch content changes even when file timestamps did not move, and if someone requests an oversized batch it clamps to a safe maximum instead of trying to process an unbounded queue.

Spec documents are still part of that indexing flow by default. When one has validation issues, the scan keeps it searchable and reports the problem as a warning instead of pretending the document does not exist.

### Startup runtime compatibility guards

When the system starts up, it checks that the software environment has not changed since it was last installed. If you updated your system or switched computers, some internal components might not be compatible anymore. This check warns you about mismatches early instead of letting them cause a mysterious crash later.

---

## 6. LIFECYCLE

### Checkpoint creation (checkpoint_create)

This takes a snapshot of your entire knowledge base at a point in time, like a save point in a video game. If something goes wrong later (an accidental deletion or a bad import), you can restore back to this snapshot. The system keeps up to 10 snapshots and automatically removes the oldest one when you create a new one.

### Checkpoint listing (checkpoint_list)

This shows you all available snapshots so you can see when each one was taken and what it covers. Think of it like looking at a list of backup dates on your phone before deciding which one to restore from.

### Checkpoint restore (checkpoint_restore)

This brings your knowledge base back to a previous snapshot, like using the undo button on a massive scale. If the restore fails partway through, nothing changes and your current data stays safe. Restored memories are immediately searchable without any extra steps.

### Checkpoint deletion (checkpoint_delete)

This permanently removes a saved snapshot. You have to type the snapshot name to confirm, which prevents accidental deletions. Once deleted, that snapshot cannot be recovered, so make sure you pick the right one.

### Async ingestion job lifecycle

When you need to import a large batch of files, this feature queues them up and processes them one at a time in the background. Three tools handle the lifecycle: `memory_ingest_start` queues file paths for processing, `memory_ingest_status` checks how far along a job is, and `memory_ingest_cancel` stops a running job. All three live under `/memory:manage ingest`. It works like a print queue: you submit the jobs and the system works through them at its own pace while you continue doing other things. If you accidentally submit the same file path twice, the queue now removes the duplicate up front and tells you how many duplicates it skipped.

### Startup pending-file recovery

If the system crashed or lost power while saving a file, it might leave behind a partially written copy. On the next startup, this feature automatically finds those orphaned files and finishes saving them. You do not have to do anything. It is like your word processor recovering unsaved documents after a crash.

### Automatic archival subsystem

Memories that nobody has used for a long time get automatically moved to a storage-saving archive, like moving old files to a basement filing cabinet. They are still there if you need them but they do not take up space in the active search results. Important memories are protected and never get archived automatically.

---

## 7. ANALYSIS

### Causal edge creation (memory_causal_link)

This lets you draw a line between two memories to show they are related, like connecting pins on a corkboard with string. You can say one memory caused another, replaced another or contradicts another. These connections help the search system understand how ideas relate to each other and surface better results when you are tracing the history of a decision.

### Causal graph statistics (memory_causal_stats)

This gives you a health report on the web of connections between your memories. It tells you how many connections exist, how strong they are and whether enough memories are linked together. If too many memories are isolated with no connections, the system warns you because it means the relationship network is too thin to be useful for tracing decisions.

### Causal edge deletion (memory_causal_unlink)

This removes a connection between two memories. If you delete a memory entirely, all its connections are cleaned up automatically. You only need this tool when you want to remove a specific connection while keeping both memories intact, like cutting one thread on a corkboard without taking down the pins.

### Causal chain tracing (memory_drift_why)

This answers the question "why was this decision made?" by following the chain of connections backward through related memories. It is like tracing a family tree to understand how you got from a problem to a solution. If two memories in the chain contradict each other, the system flags the conflict so you can resolve it.

### Epistemic baseline capture (task_preflight)

Before starting a task, this tool records how much you know, how uncertain you are and how complete your context is. It is like taking a "before" photo at the start of a home renovation. Later, you can compare against the "after" to measure how much progress you made and what you learned along the way.

### Post-task learning measurement (task_postflight)

After finishing a task, this tool takes the "after" measurement and compares it against the "before" baseline. It calculates a score that tells you how much you learned. A high score means you gained real new understanding. A low score means you mostly applied what you already knew. A negative score means you discovered that what you thought was true turned out to be wrong.

### Learning history (memory_get_learning_history)

This shows you a report card of learning across all completed tasks in a project. You can see the average learning score, which tasks produced the biggest breakthroughs and whether your understanding is trending up or down over time. It is like a fitness tracker for knowledge growth. Behind the scenes, it now initializes its schema per database connection and rejects `NaN` scores, so swapped databases and malformed inputs do not quietly corrupt the results.

---

## 8. EVALUATION

### Ablation studies (eval_run_ablation)

This tool tests how important each part of the search system is by turning off one piece at a time and measuring the difference. It is like removing one ingredient from a recipe to see if the dish still tastes good. The results tell you which components are critical and which ones you could remove without hurting search quality. Token-usage summaries now skip fake zeroes when a run did not actually collect token data, and the report now calls out which requested query IDs were resolved versus missing before you trust the benchmark.

### Reporting dashboard (eval_reporting_dashboard)

This is a performance report that shows how well the search system has been working over time. It tracks metrics across different work periods and search channels so you can see whether things are getting better or worse. It only reads data and never changes anything, making it safe to run at any time. It also keeps using the evaluation database you already pointed the server at, its `limit` setting counts sprint groups rather than raw runs, and it picks the most recently updated sprint groups while still displaying them in chronological order.

---

## 9. BUG FIXES AND DATA INTEGRITY

### Graph channel ID fix

One of the search channels that was supposed to find related memories through their connections was completely broken because of a simple label mismatch. It was comparing apples to oranges internally, so it never found anything. The fix corrected the labels so that channel now works as intended and actually contributes useful results.

### Chunk collapse deduplication

Search results were showing duplicate entries because the system only removed duplicates in certain modes. This fix makes deduplication run on every search so you always get clean results without repeated items, no matter how you run the query.

### Co-activation fan-effect divisor

Some highly connected memories kept showing up in every search result regardless of what you were looking for, like a popular student who gets invited to every party. This fix reduces the influence of overly connected memories so they do not crowd out more relevant results.

### SHA-256 content-hash deduplication

When you save the same file again without changing it, the system now recognizes it instantly and skips the expensive processing step. It is like a postal worker who recognizes a letter they already delivered and sends it straight back instead of processing it again. This saves time and resources without any risk of missing actual changes.

### Database and schema safety

Five separate bugs in the database layer were fixed to prevent data corruption. These ranged from referencing a column that did not exist to running operations in the wrong order. Each fix makes sure that database writes happen safely and predictably so your stored data stays accurate and complete.

Another fix stopped different database files from sharing one accidental global connection. The system now keeps a separate connection per resolved path, closes all of them cleanly and keeps archived-inclusive constitutional cache results from leaking into archived-exclusive reads.

### Guards and edge cases

Six subtle bugs were fixed. Some inflated scores, some linked data to the wrong place and several only appeared on uncommon retrieval paths. Together these fixes make sure the system produces accurate results, respects caller limits and never quietly reports the wrong state.

Four more protections were added in the vector query layer. Multi-concept search now hides expired memories, vector search refuses malformed embeddings with a clear validation error, constitutional-only results cannot exceed the requested limit, and `partial` indexing state is now counted instead of disappearing from stats.

### Canonical ID dedup hardening

The same memory was sometimes listed multiple times in search results because different parts of the system referred to it using slightly different labels. This fix standardizes how memories are identified internally so duplicates are correctly detected and merged in the results every time.

### Math.max/min stack overflow elimination

A common way of finding the largest or smallest number in a list was crashing the system when the list got too big. Seven places in the code used this risky approach. All were replaced with a safer method that works no matter how large the list grows, preventing crashes on big knowledge bases.

### Session-manager transaction gap fixes

When two requests arrived at the same time, they could both slip past a size limit check and add more data than allowed. This fix bundles the check and the write into a single step so they cannot be split apart, preventing the system from exceeding its own limits.

### Chunking Orchestrator Safe Swap

When a large document gets re-split into smaller pieces, the system used to delete the old pieces before creating the new ones. If creating the new pieces failed, you lost both old and new. Now it creates the new pieces first and only swaps them in once everything is ready, like building a new fence before tearing down the old one.

### Working Memory Session Cleanup Timestamp Fix

The system was accidentally deleting active sessions because it compared timestamps written in two different formats. It is like comparing "March 14" to "14/03" and getting confused about which date is newer. The fix makes both sides use the same format so active sessions are kept and only truly expired ones are cleaned up.

---

## 10. EVALUATION AND MEASUREMENT

### Evaluation database and schema

When you want to know how well your search results are performing, you need a safe place to store that measurement data. This feature keeps all quality-tracking records in a separate storage area so they never mix with or interfere with the actual search results you rely on. If the measurement process ever hits a problem, your searches keep working normally as if nothing happened.

### Core metric computation

Think of this like a report card for search quality, but with twelve different grades instead of just one pass/fail. Some grades tell you whether the best answer shows up first, others tell you whether all the right answers are found at all. Together they pinpoint exactly where search is struggling, like a doctor running multiple tests to find the real problem instead of just asking "do you feel sick?" The rank-based grades now count positions 1, 2, 3 in the returned list instead of reusing skipped internal rank labels, so MRR, NDCG, and MAP match standard IR math.

### Observer effect mitigation

Measuring performance can sometimes slow down the thing you are measuring, like how stepping on a scale while running would trip you up. This feature makes sure that all the quality-checking work happens quietly in the background. If the measurement process breaks, your searches keep running at full speed without noticing.

### Quality proxy formula

You cannot have a person hand-check every search result after every change. This feature creates a single "quality score" from 0 to 1 that runs automatically and flags when results are getting worse. Think of it like an automated smoke detector for search quality: it watches for problems around the clock so you do not have to.

### Synthetic ground truth corpus

To know if search results are right, you need an answer key. This is a collection of 110 test questions with known correct answers, written in everyday language rather than system keywords. It also includes trick questions designed to catch the system returning wrong results. Without this answer key, there would be no reliable way to measure whether changes actually improve or hurt search quality.

Those answer-key links point at live parent-memory IDs, not old placeholder IDs. If you rebuild or replace the production memory database, rerun `scripts/evals/map-ground-truth-ids.ts` before treating new ablation or dashboard numbers as comparable to older runs.

### BM25-only baseline

This test answered a simple question: "Would basic keyword search be good enough on its own?" By running just keyword matching against 110 test questions and measuring how poorly it performed, the team proved that the more advanced multi-method search approach is worth the extra effort. Without this baseline measurement, you would be guessing whether the added complexity actually helps.

### Agent consumption instrumentation

This is the wiring that lets the system record how AI agents actually use search results in practice. It is currently turned off but kept in place so it can be switched back on later. The earlier data it collected helped shape better test questions by showing real usage patterns instead of guessed ones.

### Scoring observability

This is like a security camera for how scores change. It randomly samples a small percentage of scoring events and saves a before-and-after snapshot. If scores start behaving strangely, you can look at these recordings to understand what happened. The sampling keeps it lightweight so it does not slow anything down.

### Full reporting and ablation study framework

Imagine a car with five engines and you want to know which ones actually help. This feature turns off one engine at a time and measures whether the car goes slower or faster. If removing an engine makes things worse, it is pulling its weight. If removing it makes things better, it was actually hurting. A dashboard then shows trends over time so you can spot problems early. The ablation side now avoids fake zero token-usage numbers, and the dashboard keeps using the active eval database instead of quietly switching back to the default one.

### Test quality improvements

Tests are supposed to catch bugs, but some of these tests had their own problems. A few would pass even when the thing they tested was broken, others would leak resources and some were testing the wrong thing entirely. This round of fixes made the tests themselves more trustworthy, because a test suite you cannot trust is worse than no tests at all.

### Evaluation and housekeeping fixes

These are six small but important fixes for the testing and bookkeeping systems. They address issues like counters that reset when the system restarts, clean-up routines that did not run properly and safety guards for unexpected input. Think of it as tightening loose bolts: none were causing a breakdown yet, but leaving them loose would eventually cause trouble.

### Cross-AI validation fixes

Three different AI reviewers independently checked the codebase and found 14 issues that the original review missed. This is like getting a second and third opinion from different doctors: each one catches things the others overlooked. The fixes addressed problems ranging from tests that secretly passed when they should have failed to errors that were silently swallowed instead of reported.

### Memory roadmap baseline snapshot

Before rolling out a big upgrade, you want to take a "before" photo so you can compare it with the "after." This feature captures a snapshot of how the memory system is performing right now, including how many searches are happening and whether the storage is set up correctly. That snapshot becomes the baseline you measure progress against during the rollout. If switching to the target eval database fails halfway through, the code now restores the previous eval database handle so later tools do not get stuck on the wrong DB state.

### INT8 quantization evaluation

This evaluated whether compressing stored data to save space was worth the trade-off in search accuracy. The answer was no: the storage saved was tiny and the risk of slightly worse results was not justified. Think of it like deciding whether to photocopy your photos at lower quality to save a filing cabinet drawer. When the drawer is mostly empty anyway, the savings are not worth the blur.

---

## 11. GRAPH SIGNAL ACTIVATION

### Typed-weighted degree channel

This gives a search bonus to memories that are well-connected to other memories, like how a person who knows many people in a community is often a good source of information. Different types of connections count for different amounts, and there is a cap to prevent any single well-connected memory from dominating all search results just because it links to everything. Its degree cache is now kept separately for each database connection, so scores from one DB cannot leak into another.

### Co-activation boost strength increase

When two memories are connected in the knowledge graph, finding one should help surface the other. The original boost from these connections was too weak to make a noticeable difference. This change turned up the volume so that graph connections actually influence what shows up in your search results, making the relationship map between memories useful rather than decorative.

### Edge density measurement

This measures how richly connected the knowledge graph is by counting the average number of links per memory. If there are too few connections, graph-based features would not add much value. If there are too many, the system holds off on creating new links to avoid a tangled mess. It is like a city planner checking road density before building more highways.

### Weight history audit tracking

Every connection between memories now keeps a paper trail: who created it, when it was last used and every time its strength changed. This works like a change log for relationships. If a connection goes wrong, you can trace exactly what happened and roll it back. There are also limits on automatically created connections so the system cannot overwhelm itself with too many links.

### Graph momentum scoring

This tracks how quickly a piece of knowledge is gaining connections to other knowledge. Think of it like a trending topic: the faster something connects to related ideas, the more likely it is to be relevant right now. A memory that gained three new links this week gets a small search boost compared to one whose connections have not changed in months.

### Causal depth signal

Not all knowledge sits at the same level. A big decision that led to five smaller tasks is a "root" while those tasks are "leaves." This feature measures how deep each memory sits in that tree of cause-and-effect relationships. It gives a small search boost based on that depth, acting as a tiebreaker when two results are otherwise equally relevant.

### Community detection

Memories naturally form clusters around related topics, like how books on a shelf group by subject. This feature identifies those clusters automatically. When you find one useful memory, the system can pull in its neighbors from the same cluster because they are likely related to what you are looking for. It is like finding one helpful book and having the librarian hand you the two sitting next to it.

### Graph and cognitive memory fixes

This is a collection of seven bug fixes for the relationship graph and memory scoring systems. Problems included a memory linking to itself (a loop that makes no sense), cluster detection that could not tell when links were deleted and replaced, and scores that could climb higher than they should. Without these fixes, the graph connections and scoring would slowly drift into unreliable territory.

### ANCHOR tags as graph nodes

Anchor markers are labels placed inside memories to highlight important sections. This planned feature would turn those labels into connection points in the knowledge graph, letting the system link specific parts of different memories together instead of just linking whole memories. It has been put on hold pending further investigation into whether the added complexity is worthwhile.

### Causal neighbor boost and injection

When a search result scores highly, this feature follows its cause-and-effect links to find related memories nearby in the graph. Those neighbors get a score bump because if Memory A is relevant and it caused or enabled Memory B, there is a good chance Memory B matters too. There is a ceiling on how much boost any result can receive so that highly connected clusters do not take over all the top spots.

### Temporal contiguity layer

Memories created around the same time are often about the same topic, like notes taken during the same meeting. This feature gives a search boost to results that were stored close together in time. If one memory from a Tuesday afternoon session is relevant, the others from that same session probably are too. The boost fades as the time gap between memories grows larger.

### Unified graph retrieval, deterministic ranking, explainability, and rollback

This brings all the graph-based search features together into one reliable path. The same query will always return results in the same order, and you can see exactly why each result ranked where it did. If anything goes wrong with the graph features, a single switch turns them off and search falls back to working without them. Think of it as a well-labeled control panel with an emergency off switch.

### Typed traversal

When the system follows connections between memories, it now pays attention to what type of connection it is following and what kind of question you asked. A "what caused this bug?" query prioritizes cause-and-effect links while a "what supports this decision?" query prioritizes evidence links. In smaller knowledge bases with fewer connections, the system takes shorter, more targeted steps instead of trying to traverse the entire web.

### Graph lifecycle refresh

When you save or change a memory, the connections around it might need updating. This feature keeps track of which parts of the connection network have changed and recalculates the affected area. For small changes, this happens instantly. For larger updates, it queues the work for a background refresh so saving stays fast.

### Async LLM graph backfill

Some documents have relationships that are obvious to a human reader but not detected by simple pattern matching. This feature uses an AI to read important documents after they are saved and suggest additional connections that the automatic extraction missed. It runs in the background after the initial save so it does not slow down the normal workflow.

### Graph calibration profiles and community thresholds

The connection-based search features need guardrails to prevent any single feature from overwhelming the results. This sets limits on how much influence graph connections can have on rankings, how large a cluster of related memories needs to be before it is treated as a meaningful group, and provides named presets so operators can switch between conservative and aggressive tuning without adjusting individual knobs.

---

## 12. SCORING AND CALIBRATION

### Score normalization

Different search methods produce scores on different scales, like comparing grades from different schools. This feature puts all scores on the same 0-to-1 scale so they can be compared fairly before picking the best results. Without it, one method might always win just because its numbers happen to be bigger, not because its results are actually better.

### Cold-start novelty boost

Brand-new memories start with a disadvantage because the scoring system has not had time to learn how useful they are. This feature gives freshly saved memories a temporary boost that fades over two days, like a "new arrival" spotlight at a bookstore. It has since been turned off because testing showed it was not making a practical difference, but the logic is kept around in case it is needed later.

### Interference scoring

If you have five nearly identical memories about the same thing, they can all crowd into the top results and push out something different that might actually be more helpful. This feature penalizes memories that look too similar to their neighbors, making room for a wider variety of results. It is like a rule that says "no more than one song per artist on a playlist" to keep things diverse. Only live peer memories count toward that penalty now, so archived or deprecated copies do not unfairly drag down active search results.

### Classification-based decay

Not all memories should fade at the same speed. A key decision made months ago is still important, but a quick scratch note from last week probably is not. This feature adjusts how fast memories lose relevance based on what kind of memory they are and how important they were marked. Critical decisions never fade. Temporary notes fade quickly. Everything else falls somewhere in between. The setup checker also refuses a zero half-life, so nobody can accidentally define a memory type with a "positive" timer that is actually zero days long.

### Folder-level relevance scoring

Instead of searching through every memory equally, this feature first ranks the folders they live in. Recent, important and actively used folders rise to the top while archived folders sink to the bottom. The system then searches within the top folders first. It is like checking the most promising filing cabinets before digging through the dusty ones in the back.

### Embedding cache

Converting text into the numerical format the search engine understands is the slowest and most expensive step. This feature saves those conversions so the system does not have to redo them when the same content is indexed again. It is like keeping a translated copy of a document instead of hiring the translator every time you need it. If the content has not changed, the saved version is used instantly.

### Double intent weighting investigation

This investigation checked whether the system was accidentally applying the same scoring adjustment twice, which would be like getting double-taxed. It turns out the two adjustments work at different levels on purpose: one controls which search methods contribute to results and the other controls how result qualities are weighed afterward. They do not overlap, so no fix was needed.

### RRF K-value sensitivity analysis

When combining results from different search methods, a single tuning knob controls how much "being ranked first" matters versus "appearing in multiple lists." This analysis tested five different settings for that knob and measured which one produced the best results. Before this work, the setting was chosen by gut feeling. Now it is chosen by data.

### Negative feedback confidence signal

When you tell the system a result was not helpful, it remembers that feedback and pushes that memory lower in future searches. The more times you say "not useful," the further it drops, but it can never be completely hidden. Over time the penalty fades, giving the memory a chance to recover. This way the system learns from your feedback without permanently burying anything.

### Auto-promotion on validation

When a memory keeps proving useful over and over, it earns a promotion. After five thumbs-up reviews, a regular memory becomes "important." After ten, it becomes "critical." This happens automatically so you do not have to manually tag your most valuable knowledge. A speed limit prevents too many promotions from happening at once during a busy session.

### Scoring and ranking corrections

These are four bug fixes for the scoring math. Scores could climb above their allowed maximum, a fallback was using the wrong data to guess relevance, circular relationships in the graph could multiply scores endlessly, and a statistics calculation could break with large numbers. Each fix is small on its own, but together they keep the ranking numbers honest and reliable. A follow-up hardening pass also stops ablation reports from showing fake zero token-usage values when no token data was captured.

### Stage 3 effectiveScore fallback chain

A search result can carry several different scores from different stages of processing. The final ranking step was only looking at two of them and skipping the most refined ones. This fix teaches it to check the best available score first and fall back through less precise options only when needed, like reading the final exam grade before the midterm before the homework score.

### Scoring and fusion corrections

These nine fixes address problems in how scores are calculated and combined. Issues ranged from weights that did not add up to 100% to a method that crashed when processing large batches and a filter that compared apples to oranges. The latest fix also cleans up leftover RSF compatibility code so the retired shadow/test path treats `42` and `"42"` as the same result instead of duplicating them.

### Local GGUF reranker via node-llama-cpp

After the initial search finds candidate results, this feature uses a small AI model running on your own computer to re-sort them for better accuracy. It works entirely offline with no network calls, so it is both private and free to use. If the model file is missing or the computer does not have enough memory, the system quietly skips this step and keeps the original order. Its shared reranker cache now separates providers and option settings correctly, and its p95 latency reading no longer overstates small samples.

### Tool-level TTL cache

When you ask the same question twice within a short time, the system should not redo all the expensive work. This feature remembers recent results for up to 60 seconds so repeat requests get instant answers from the cache. When you save, update or delete a memory, the cache for affected searches is cleared automatically so you never see stale results.

### Access-driven popularity scoring

Memories that get looked up frequently are probably more useful than ones that sit untouched. This feature counts how often each memory is retrieved and gives frequently accessed ones a higher score, like how a popular library book gets a front-of-shelf display. It also helps identify neglected memories that might be candidates for archiving.

### Temporal-structural coherence scoring

This checks whether a memory's claims make sense in the order things actually happened. If a memory says it was caused by something that did not exist yet at the time, that is a red flag. Think of it like a fact-checker catching a biography that references events before the person was born. Memories that fail this time-logic check get a lower quality score and may be rejected from the index.

### Adaptive shadow ranking, bounded proposals, and rollback

This feature lets the system experiment with new ranking ideas without changing what you actually see. It runs alternative rankings in the background and records what would have changed, like a flight simulator for search results. The experiments have strict limits on how big a change they can propose, and a single switch turns the whole thing off if anything looks wrong. Only after a deliberate decision would any of these proposals go live.

### Calibrated overlap bonus

When a result is found by multiple search methods at once, the system gives it an extra ranking boost because agreement across methods is a strong signal of relevance. The old version applied a fixed bonus regardless of how many methods agreed or how strong the match was. The new version scales the bonus based on how many methods found the result and how confidently they scored it, making the boost more accurate and less likely to over-promote weak results.

### RRF K experimental tuning

When combining ranked lists from different search methods, a tuning knob controls the balance between "ranked first in one list" and "appeared in many lists." This feature tests different settings for that knob and picks the best one based on your question type, because what works well for a bug-hunt query might not work well for a decision-tracing query.

### Learned Stage 2 weight combiner

Instead of using hand-tuned rules to combine all the different scoring signals (graph connections, recency, importance and so on), this feature learns the best combination from actual usage data. It runs in the background only, watching how its learned weights would have ranked results compared to the current rules, without affecting what you actually see.

### Shadow scoring with holdout evaluation

This feature tests whether proposed ranking improvements actually make things better before they go live. It keeps a fixed set of test queries aside, runs both the current and proposed ranking on those queries each week and compares the results. A new approach only gets promoted to production after it proves itself on this test set, preventing changes that look good in theory but hurt quality in practice.

---

## 13. QUERY INTELLIGENCE

### Query complexity router

Not every question needs the same amount of effort to answer. This feature sizes up your question first, like a triage nurse, and routes simple lookups through a fast path while sending complex research questions through a deeper search. Without it, every question would get the full heavy-duty treatment, wasting time and resources on things that could be answered in seconds.

### Relative score fusion in shadow mode

When you search for something, multiple search methods each return their own ranked lists of results. This used to be an alternative way to merge those lists into one final ranking. Today it is retired runtime code kept only as a shadow/test artifact for compatibility and evaluation work. The live ranking system does not use it.

### Channel min-representation

Imagine you ask a librarian for book recommendations and they only check one shelf, ignoring everything else in the library. This feature makes sure that every search method that found something useful gets at least one result in the final answer. That way you see a diverse set of results instead of one dominant source drowning out everything else.

### Confidence-based result truncation

Search results often include a long tail of irrelevant items tacked onto the end. This feature detects the point where results stop being useful and cuts off the rest, like a reader who stops scrolling once the answers clearly run out. Without it, you would get padded results that waste your attention on things that do not actually match your question.

### Dynamic token budget allocation

Every answer the system gives takes up space in a limited response window. This feature gives simple questions a small response budget and saves the big budget for complex questions that genuinely need more room. Think of it like packing a lunch bag versus a suitcase: you match the container to what you actually need to carry.

### Query expansion

Sometimes the words you use in a question do not match the words stored in the system, even though they mean the same thing. This feature automatically adds related terms to your search so you find relevant results even when the exact wording differs. It only kicks in for complex questions because simple lookups do not benefit from the extra breadth.

### Query decomposition

When your question covers multiple topics at once, this feature splits it into separate focused sub-questions and searches for each one individually. It is like asking a librarian three things at once and having them check three different sections of the library instead of trying to find one book that covers everything. This runs automatically for complex questions without needing an AI to do the splitting.

### Graph concept routing

When your question mentions a specific concept by name, the system checks its catalog of known topics and records matched concepts in trace metadata for downstream observability. This way, if you ask about "embedding cache" and that topic has known relationships in the knowledge graph, the system notes the match for diagnostics, but does not currently activate graph-based retrieval directly.

### LLM query reformulation

For deep searches where the initial results are not confident enough, this feature asks an AI to rephrase your question in a broader, more abstract way while grounding it in actual content from the knowledge base. It is like asking a subject matter expert to translate your specific question into the terms that the reference library actually uses. Those reformulated hits now pass through the same scope, context and quality checks as ordinary results before they are merged back in.

### HyDE (Hypothetical Document Embeddings)

When a deep search produces low-confidence results, this feature writes a short imaginary answer to your question and then searches for real documents that look like that imaginary answer. It is like describing the book you wish existed and then finding real books that match that description, which can surface relevant content that your original wording missed entirely. It now checks the whole baseline set before deciding confidence is low, and the extra hits go through the same scope, context and quality checks as the main search.

### Index-time query surrogates

When a memory is first saved, the system pre-generates alternative names, summaries and likely questions someone might ask about it. These extras are stored alongside the original content so future searches can match against them. It is like a library cataloger adding subject headings and cross-references to a new book so it can be found by readers who use different terminology.

---

## 14. MEMORY QUALITY AND INDEXING

### Verify-fix-verify memory quality loop

Before saving a new memory, the system checks whether it meets quality standards. If it falls short, the system tries to fix the problems automatically and checks again. Think of it like a spell checker that runs before you hit send: it catches obvious issues and corrects them so you do not store sloppy notes that will be hard to find later.

### Signal vocabulary expansion

The system listens for clues in your language to understand what you really mean. This feature taught it to recognize two new types of clues: when you are correcting a past mistake (words like "actually" or "wait") and when you are expressing a preference (words like "prefer" or "want"). Recognizing these patterns helps the system pull up the right memories for the situation.

### Pre-flight token budget validation

Before the system stores a new memory, it checks whether the content is too large to process. Think of it like a mailbox with a size limit: if your package is too big, you get told right away instead of wasting time trying to stuff it in. This prevents expensive processing work on content that would fail anyway.

### Spec folder description discovery

Each project folder now has a short identity card describing what it contains. When you ask the system a question, it can check these identity cards first to figure out which folder holds the answer, skipping the need to search through everything. It is like reading the labels on filing cabinet drawers instead of opening every drawer to find what you need.

### Pre-storage quality gate

This is the bouncer at the door before a memory enters the system. It checks three things: is the memory properly structured, is the content actually useful and is it different enough from what is already stored? If a memory fails any of these checks, it gets turned away. Without this gate, the system would fill up with junk and near-duplicates that pollute future search results.

### Reconsolidation-on-save

When you save a new memory that is very similar to one already stored, the system decides what to do with the overlap. If the two are nearly identical, it merges them into one stronger memory. If the new one contradicts the old one, the old one is retired and the new one takes over. If they are different enough, both are kept side by side. This keeps your memory collection clean and up to date instead of cluttered with redundant notes.

### Smarter memory content generation

Raw notes are full of formatting clutter like bullet markers, code fences and header symbols that have nothing to do with the actual meaning. This feature strips that clutter away before the system creates a searchable fingerprint of your content. The result is cleaner fingerprints that match your questions more accurately, like removing the wrapping paper so you can see what is actually inside the box. It also keeps batch type inference from merging multiple pathless drafts into one result during the preparation stage.

### Anchor-aware chunk thinning

When a large file is split into smaller pieces for indexing, not every piece carries useful information. Some are mostly whitespace or boilerplate. This feature scores each piece and drops the ones that add little value, keeping only the meaningful parts. It is like trimming the fat off a steak so you only store the good cuts.

### Encoding-intent capture at index time

When a memory is saved, the system labels it as regular text, code or structured data. Right now this label is stored but not used for search ranking. It is groundwork for the future: once the system knows what type of content it is looking at, it can treat a code snippet differently from a meeting note. Think of it as sorting your files into labeled folders before you need to search them.

### Auto entity extraction

Your notes mention tools, projects and concepts by name, but those names were never formally cataloged. This feature automatically spots those names when you save a memory and adds them to a shared catalog. Later, the system can use that catalog to connect memories that mention the same things, even if the surrounding text is completely different. It is like an automatic index at the back of a book that builds itself as you write.

### Content-aware memory filename generation

Previously, every saved memory in the same folder got nearly the same filename, making it impossible to tell them apart at a glance. This feature names each file based on what the memory is actually about, like labeling your photo albums by vacation instead of just numbering them. You can now scan a folder and instantly see what each file contains. When several draft memories have no file path yet, the system now gives each one its own temporary key so they do not overwrite each other's type guess behind the scenes.

### Generation-time duplicate and empty content prevention

This feature catches two common mistakes before a memory file is even written to disk: saving a file that is basically empty (just a template with no real content) and saving an exact copy of something already stored. It is like your email client warning you that you are about to send a blank message or a duplicate of something you already sent.

### Entity normalization consolidation

Two parts of the system were cleaning up entity names in different ways, which meant the same name could look different depending on where it was processed. This fix unified them so there is only one way to clean up a name, ensuring "Claude Code" always looks the same everywhere. Without this, the system could fail to recognize that two mentions refer to the same thing.

### Quality gate timer persistence

The quality gate has a two-week warm-up period where it warns about problems without blocking saves. Previously, every time the server restarted, the countdown clock reset and the warm-up never finished. This fix saves the clock to the database so restarts do not reset it. Think of it like writing your gym start date on a calendar instead of just remembering it in your head.

### Deferred lexical-only indexing

Sometimes the system cannot create a full searchable fingerprint for a memory because the fingerprinting service is temporarily down. Instead of losing the memory entirely, this feature saves it in a simpler text-searchable form so you can still find it by keywords. When the fingerprinting service comes back, the system automatically retries and upgrades the memory to full searchability.

### Dry-run preflight for memory_save

Before committing a memory to storage, you can do a practice run to see if it would pass all the checks. Nothing gets saved or changed. It is like using the "print preview" button before printing: you catch problems before they become permanent, without wasting paper.

That preview is no longer limited to token and duplicate checks. It can now tell you if the memory is too thin to stand on its own later or if the rendered markdown shape itself is invalid.

### Outsourced agent memory capture

When work is delegated to an external helper (like a different AI tool), the results need to come back in a clean format the memory system can understand. This feature makes sure that incoming data files are properly validated and that follow-up actions are captured, so nothing important gets lost when work passes between different tools.

### Stateless enrichment and alignment guards

When a memory is saved with minimal context, the system fills in the gaps by pulling relevant details from the project folder and recent changes. At the same time, it checks that the memory actually belongs to the project it claims to be part of and blocks saves that clearly belong somewhere else. Think of it as an assistant who fills out missing form fields for you but refuses to file the form in the wrong cabinet.

The session-capture flow now also refuses to keep malformed output around as “good enough.” The same structural contract used by the save tool and the context generation script is also used to audit and clean active historical memories.

### Post-save quality review

After the system saves a memory file, it runs a quick proof-reading step to check that nothing was lost in transcription. It compares the saved file against the original JSON payload to catch cases where the rendering pipeline silently dropped or degraded caller-supplied fields — like a generic title replacing a meaningful one, or trigger phrases that are file paths instead of natural-language keywords. Think of it as a proof-reader who checks the printed form against the original application before it goes into the filing cabinet.

### Implicit feedback log

The system quietly watches how you interact with search results and saves without you having to give explicit feedback. Actions like citing a result, following up with a related question or reformulating a search all get recorded as background signals. These signals are stored separately so they can be analyzed later without affecting your current search results. Think of it as a silent observer taking notes on what works and what does not.

### Hybrid decay policy

Some memories are permanent records that should never lose relevance over time, like key decisions or fundamental rules. This feature protects those types of memories from the normal fading process while letting everyday notes and temporary context decay on their usual schedule. It is like a library where reference books stay on the shelf permanently while newspapers get recycled after a set time.

### Save quality gate exceptions

The quality gate normally rejects memories that are too short, but some types of content are naturally brief. A decision record might be only a few sentences but still be extremely valuable. This feature recognizes that short documents with strong structural signals (like a clear title and proper labels) are worth keeping, so they are not falsely rejected by the length check.

### Weekly batch feedback learning

Once a week, the system reviews all the quiet usage signals it has collected and calculates which memories are performing well and which are underperforming. It only promotes a memory's score after enough independent sessions have confirmed its value, and it caps how much any single memory can be boosted in one cycle. These adjustments run in the background and do not affect live rankings until they are deliberately approved.

### Assistive reconsolidation

When two memories look very similar, the system automatically classifies them into one of three categories: near-identical (shadow-archived: the older record is marked archived while the new one saves normally — no content merging occurs), borderline similar (flagged for your review with a recommendation) or clearly different (kept separate). This helps prevent duplicate clutter while making sure genuinely distinct memories are not accidentally combined. No content is deleted without clear justification.

---

## 15. PIPELINE ARCHITECTURE

### 4-stage pipeline refactor

When you ask the system a question, your search goes through four clear steps: gather candidates, combine and score them, rerank the best ones and finally filter the results. This is like an assembly line where each station has one job and passes its work to the next. The old system tried to do everything in one messy step, which made it hard to find and fix problems. The new structure makes each step predictable and testable. A later improvement tightened this further by making all four steps use the same scoring method, so results are evaluated consistently across the entire pipeline and scoring weights stay balanced automatically.

### MPAB chunk-to-memory aggregation

A long document gets split into smaller pieces for searching, but you want to see the whole document in your results, not a list of fragments. This feature combines the scores from all the pieces back into a single score for the whole document. The best piece counts the most, and the other pieces add a small bonus. That way a document with several good matches ranks higher than one with just a single lucky hit.

### Chunk ordering preservation

When a document is reassembled from its search-result pieces, the pieces need to appear in the order they were written, not in the order they scored. This feature makes sure you read the content from top to bottom, just like the original document. Without it, you would get a scrambled version where paragraph three appears before paragraph one. The reassembly step now understands both `parent_id` and `parentId` style field names, so chunk collapse still works when callers send camelCase metadata.

### Template anchor optimization

Memory files contain hidden markers that label sections as things like "decision" or "summary." This feature reads those markers and attaches the labels to search results as extra information. It does not change how results are ranked. It just adds useful tags so that later steps in the pipeline know what kind of content they are looking at.

### Validation signals as retrieval metadata

Well-maintained documents should rank slightly higher than neglected ones when both are equally relevant to your question. This feature gives a small ranking nudge to documents that have been reviewed, validated and kept up to date. The nudge is small enough that a truly relevant but less polished document still wins over a well-polished but less relevant one.

### Learned relevance feedback

When you mark a search result as useful, the system remembers which search terms led you to it. Next time similar terms appear in a question, the system gives that memory a small boost. Over time, the system learns which results are genuinely helpful based on your actual selections, like a music app that gets better at recommending songs the more you use it. Ten safeguards protect against noise, including a denylist of common words, rate limits, 30-day score decay and separation from the main search index. A one-week trial period logs learned triggers without applying them, giving the system time to verify quality before boosts go live.

### Search pipeline safety

Three bugs were quietly making search results worse. One let low-quality summaries sneak past the quality filter. Another caused search terms to be processed differently at search time versus index time, so exact matches were missed. A third was accidentally throwing away almost all results from one search method because the quality bar was set too high for that method's scoring range. Fixing these three issues made search results noticeably more accurate.

### Performance improvements

Thirteen small speed improvements were made across the system. Some replaced slow scanning operations with faster lookups. Others fixed places where the same question was asked many times when once would do. The result is a system that responds more quickly, especially as the amount of stored data grows. Think of it as replacing a hand-cranked search with a power tool.

### Activation window persistence

The quality gate needs a two-week trial period before it starts blocking bad saves. Previously, restarting the server reset the trial clock back to zero, so the gate never graduated. This fix remembers the start date in the database so restarts do not affect the countdown. Without it, the quality gate would stay in warning-only mode forever.

### Legacy V1 pipeline removal

The system used to have two different search paths: an old one and a new one. The old path was causing bugs and was no longer needed because the new one was already the default. This cleanup removed the old path entirely so there is only one way searches run, eliminating a whole class of bugs that came from the two paths disagreeing with each other.

### Pipeline and mutation hardening

Ten small but important fixes were applied to make the system more robust. Some exposed missing options that were supposed to be available. Others fixed cleanup problems where deleting a memory left orphaned records behind. A few improved how the system handles word variations in searches. Together, these fixes close gaps that could have caused subtle data inconsistencies or missed search results over time. A follow-up audit also made deep-mode helper branches follow the same filters as the main search, made constitutional injection respect global scope enforcement, and let chunk reassembly read camelCase metadata.

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

### Cross-process DB hot rebinding

When another process changes the database while the server is running, the server needs to notice and reconnect. This feature watches for a signal file that says "the database changed" and automatically refreshes the connection. Without it, the server would keep using stale data until someone manually restarted it.

### Atomic write-then-index API

When saving a memory, the system first writes the file safely to a temporary location and only moves it to the final spot once the write is confirmed complete. If a crash happens mid-save, the half-written file can be recovered on the next startup. This prevents data loss the same way a word processor auto-saves a draft before overwriting your real document.

### Embedding retry orchestrator

Creating a numerical fingerprint for each memory requires calling an external service that can sometimes be unavailable. When that service fails, the memory is saved without a fingerprint and queued for a retry. A background worker periodically picks up these queued items and tries again. This way, a temporary service outage does not permanently prevent your memories from being fully searchable.

### 7-layer tool architecture metadata

The system has many different tools, and each one needs to know how much response space it is allowed to use and what kind of task it is best suited for. This feature organizes all tools into seven layers with budgets and guidance, like assigning departments in a company. It does not control how tools are called at runtime but helps recommend the right tool for the job.

### Atomic pending-file recovery

If the system crashes in the middle of saving a memory, the file might be left in a half-finished state on disk. When the server starts back up, this feature scans for those half-finished files and completes the save if the database already recorded it. It is like a delivery service checking for undelivered packages each morning and finishing the route from where it left off.

### Lineage state active projection and asOf resolution

Every time a memory is saved, the system adds a timestamped record of that change to a history log. When you need to know what a memory looked like at a specific point in the past, the system can look up the history and give you the exact version from that moment. Think of it as a timeline for each memory that you can rewind to any date, useful for understanding what changed and when. The time comparison now converts both timestamps to real date values first, so different timezone formats do not get sorted incorrectly just because the text looks different.

---

## 16. RETRIEVAL ENHANCEMENTS

### Dual-scope memory auto-surface

When you are working on something, this feature automatically brings up important memories you might need without you having to ask for them. It watches for two key moments: when you use a tool and when a long conversation gets compressed. Think of it like a helpful assistant who notices what you are doing and quietly slides the right reference notes onto your desk.

### Constitutional memory as expert knowledge injection

Some memories are fundamental rules that should always come up when relevant, like "never delete production data." This feature tags those high-priority memories with instructions about when to surface them. It works like sticky notes on a filing cabinet that say "pull this file whenever someone asks about X." Those injected constitutional rows now obey global scope-enforcement rules, not just caller-supplied scope fields.

### Spec folder hierarchy as retrieval structure

The way you organize your project folders directly influences what the system finds when you search. If you are looking at a child folder, the system also checks the parent and sibling folders for related information. It is like browsing one section of a bookstore and getting recommendations from nearby shelves because they cover related topics.

### Lightweight consolidation

Over time, stored memories can contradict each other or grow stale. This feature runs periodic housekeeping to spot conflicts, strengthen connections that get used often and flag relationships that have not been touched in months. Think of it as a librarian who regularly walks the shelves to catch duplicate entries and retire outdated references.

### Memory summary search channel

Long documents can bury their key points in paragraphs of detail. This feature creates a short summary of each memory when it is saved and searches against those summaries instead of the full text. It is like reading the back-cover blurb of a book rather than skimming every page to decide if it is relevant.

### Cross-document entity linking

Different documents in different folders sometimes talk about the same thing without knowing about each other. This feature connects them automatically when it notices they reference the same concept. It is like a researcher who reads two separate reports, notices both mention the same topic and staples a note between them saying "these are related."

### Tier-2 fallback channel forcing

Normally the search system skips some search methods when a question seems simple. But when results come back poor, this fallback kicks in and forces every search method to run. It is a safety net that says "the shortcut did not work, so try everything before giving up."

### Provenance-rich response envelopes

When you search for something, the system normally just gives you the answer. With this feature turned on, it also shows you how it found the answer: which search methods it used, how it scored each result and where the information came from. It is like getting a receipt with your purchase that shows every step of the transaction.

### Contextual tree injection

When search results come back, each piece of information now carries a short label showing where it belongs in the project, like "Project > Feature > Detail." Without this, you would see raw content with no clue about its context. It is like seeing a chapter heading at the top of a photocopied page so you know which part of the book it came from.

---

## 17. TOOLING AND SCRIPTS

### Tree thinning for spec folder consolidation

Before the system processes a project folder, it trims down the content to a manageable size. Large files stay as they are, medium ones get condensed and small ones get merged together. Think of it like packing a suitcase: you keep the big items, fold the medium ones and bundle the small items into one bag so everything fits.

### Architecture boundary enforcement

The codebase has clear boundaries between its major sections, and this tool automatically checks that nobody accidentally crosses them. It is like having walls between departments in an office building: you can communicate through proper channels, but you cannot just reach through the wall and grab something from another department's desk.

### Progressive validation for spec documents

This tool checks your project documents for problems in four steps: find issues, fix the easy ones automatically, suggest fixes for the harder ones and write up a report. It works like a spell-checker that also auto-corrects obvious typos and highlights the rest for you to review.

### Dead code removal

Over time, some parts of the code stopped being used but were never cleaned up. This effort identified and removed roughly 360 lines of unused code: old switches that were always off, variables that were set but never read and functions that nothing called anymore. It is like clearing out a storage closet of things nobody has touched in years so the space stays organized.

### Code standards alignment

This was a cleanup pass that made the code follow a consistent style across the project. It fixed 45 places where comments, file headers, naming patterns or import ordering did not match the agreed-upon rules. Think of it like an editor going through a document to make sure every chapter uses the same formatting and citation style.

### Real-time filesystem watching with chokidar

Instead of waiting for you to ask the system to re-scan your files, this feature watches your project folder in real time. When you save, rename or delete a memory file, the system notices and updates its index automatically. It works like how your email app shows new messages as they arrive rather than making you hit refresh.

### Standalone admin CLI

This is a command-line maintenance tool for the memory database that you can run directly without going through the normal system. It lets you check database statistics, delete old records in bulk, rebuild the search index or roll back a database upgrade. Think of it as the "service panel" for the system that only operators use when routine maintenance or emergency recovery is needed.

### Constitutional memory manager command

This is the operator-facing slash command for creating and managing constitutional memories: the durable rules that always surface at the top of search results. Think of it as the system's rulebook editor rather than a generic note-taking command.

### Source-dist alignment enforcement

When source code files are deleted or renamed, their compiled output files should be removed too. But sometimes the old output files get left behind like ghosts. This tool checks that every compiled file has a matching source file and flags any orphans so they can be cleaned up, preventing stale code from lingering in the build output.

### Module boundary map

A reference document that lists every major section of the codebase, who owns it, what it depends on and which features it implements. It is like a building floor plan that shows which department sits where and which hallways connect them. This map makes it easier to find where things live and prevents accidental cross-boundary dependencies during refactoring.

### JSON mode structured summary hardening

When saving session context to memory, the system now accepts richer structured data including tool usage details, conversation exchanges and decision records. This improvement also hardened how the system handles edge cases like truncated titles, missing confidence scores and unstable file counts, so saved memories are more complete and reliable regardless of how the data arrives.

### JSON-primary deprecation posture

The system used to have two ways to save session context: a structured data format and a looser automatic capture. The automatic capture proved unreliable and was removed. Now there is only one way to save, which is through structured data. This simplification prevents a class of subtle bugs that came from the two paths producing slightly different results.

### Migration checkpoint scripts

Before the system upgrades its database structure, these scripts take a full backup of the database file so you can roll back if something goes wrong. It is like making a photocopy of an important form before you fill it in: if you make a mistake, you can start over from the clean copy.

### Schema compatibility validation

This feature checks whether the database has the right structure before the system tries to use it. If required tables or columns are missing, it reports the problem clearly instead of crashing. It is like checking that a form has all the expected fields before you start filling it out, so you catch formatting problems early rather than halfway through.

### Watcher delete/rename cleanup

When you delete or rename a file on your computer, the search index needs to clean up the old entry so it does not show stale results. This feature handles that cleanup automatically. Without it, you could search and find references to files that no longer exist, like a phone book that still lists people who have moved away.

### Feature catalog code references

Approximately 74% of source code files (191 of 257 non-test TypeScript files) now carry a label saying which features from this catalog they implement, like labeling warehouse boxes by product name instead of aisle number. If you want to find all the files involved in a particular feature, you can search for its name and immediately see every file that contributes to it. This makes it much easier to understand the impact of changes and track down where features are actually built.

### Session capturing pipeline quality

When you save a conversation's context to memory, this feature ensures the entire capture process is robust and trustworthy. It filters out contamination, blocks saves that are not properly aligned with their project, rejects memories that are too thin to be useful later, catches malformed output before it enters the index and calibrates quality scores so rich saves rank higher than shallow ones. Think of it as a complete quality control line for the session-to-memory pipeline, making sure every saved memory is clean, well-formed and genuinely useful.

---

## 18. GOVERNANCE

### Feature flag governance

Feature flags let you turn new features on or off without changing the code itself, like light switches for functionality. This governance process tracks which switches exist, who controls them and when old ones should be retired so the collection does not grow out of control.

### Feature flag sunset audit

This audit went through all 79 feature switches in the system and decided the fate of each one. Most were ready to become permanent (switch removed, feature stays on). Some were dead and got deleted. A few remain as active controls. A comprehensive cleanup pass acted on these findings by removing a large amount of unused code: old switches that were always off, variables that were set but never read and functions that nothing called anymore. Without this kind of periodic cleanup, the system would accumulate unused switches that confuse anyone trying to understand what is actually running.

### Hierarchical scope governance, governed ingest, retention, and audit

This feature controls who can save and read memories and keeps a record of every decision it makes. When someone tries to save information, the system checks their identity and requires proof of where the information came from. It is like a secure document room where you must show your badge, sign in and explain what you are filing before you are allowed to add or retrieve anything. Ephemeral memories now must include an expiration time, and if the governance metadata step fails after a save, the new row is deleted so a half-governed record is not left behind.

### Shared-memory rollout, deny-by-default membership, and kill switch

Shared memory spaces let multiple users or agents access the same pool of knowledge. Four shipped tools handle the lifecycle under `/memory:manage shared`: `shared_memory_enable` turns on the subsystem, `shared_space_upsert` creates or updates spaces, `shared_space_membership_set` controls who gets in, and `shared_memory_status` reports the current state. The subsystem is disabled by default and requires explicit opt-in: either set the appropriate environment variable or run the first-time enablement flow via `/memory:manage shared enable`. Once enabled, access is deny-by-default: nobody gets in unless they are explicitly granted membership with a role (`owner`, `editor`, or `viewer`). An emergency kill switch immediately blocks everyone if something goes wrong. It is like a shared office with a keycard lock that starts powered off: you must first turn on the lock system, then add names to the access list, and building management can lock it down instantly in an emergency. Shared members can now see each other's shared memories without needing an exact actor or session match, and partial space updates no longer erase saved cohort or metadata fields.

---

## 19. UX HOOKS

### Shared post-mutation hook wiring

After the system saves or changes any piece of knowledge, it runs a standard set of follow-up tasks automatically. Think of it like a checklist that runs every time you file a document: update the index, notify anyone watching and log the change. Before this feature, each type of save had its own checklist, so some steps could get missed.

### Memory health autoRepair metadata

When you run a health check on the memory system and ask it to fix problems, it now tells you exactly what it tried to repair, what succeeded and what failed. Before this, you would only get a pass or fail result. Now you get a detailed report, like a car mechanic who hands you an itemized list showing which parts were replaced and which still need attention.

### Checkpoint delete confirmName safety

Deleting a saved checkpoint is permanent, so this feature adds a safety step: you must type the exact name of the checkpoint you want to delete before the system will proceed. It works like those confirmation dialogs that ask you to type "DELETE" before erasing something important, preventing accidental data loss from a careless click.

### Schema and type contract synchronization

This feature makes sure every layer of the system agrees on the shape of data being passed around. When one layer expects a certain field to be required, every other layer enforces the same rule. Without this alignment, a change in one place could silently break another, like two departments using different versions of the same form.

### Dedicated UX hook modules

The logic for generating user-facing feedback after a save or change used to be scattered across many files. This feature moved all that feedback logic into its own dedicated modules. It is like a restaurant separating the kitchen from the serving area: the food still reaches your table, but the responsibilities are clearly divided so nothing falls through the cracks.

### Mutation hook result contract expansion

After the system finishes its follow-up tasks on a save, it now reports how long those tasks took and whether any caches were cleared. This gives you a clearer picture of what happened behind the scenes, like a shipping notification that tells you not just "delivered" but also the delivery time and which steps were completed.

### Mutation response UX payload exposure

When you save a memory, the system now includes helpful follow-up information right in the response, like whether caches were refreshed or if any hints are available. Previously that information existed internally but was not shown to you. It is like a bank transaction that now prints a full receipt instead of just saying "transaction complete."

### Context-server success-path hint append

When the system successfully retrieves context for you, it now attaches short guidance hints to the response without changing the main content. Think of it like a librarian who hands you the book you asked for along with a sticky note saying "you might also want to check chapter 5." The original content stays the same, but you get a helpful nudge.

### Duplicate-save no-op feedback hardening

When you try to save something that is already stored exactly as-is, the system now tells you honestly that nothing changed instead of pretending it did work. Previously it could report misleading cache-clearing activity even when nothing happened. It is like a vending machine that returns your coin and says "already dispensed" instead of making clunking sounds and giving you nothing.

### Atomic-save parity and partial-indexing hints

The system has two ways to save memories: a standard path and a faster "atomic" path. This feature made them return the same kind of feedback so you do not get different information depending on which path ran. It is like making sure both the express and regular checkout lanes at a store give you the same receipt format. The normal governed-save path now also cleans up a new row if the follow-up governance write fails, so callers do not get a half-finished success.

### Final token metadata recomputation

After the system adds hints and adjusts a response, it recalculates the size count to match what is actually being sent. Without this step, the reported size could be wrong because it was measured before the final changes were made. It is like weighing a package after you have finished packing it, not before you add the last item. The same rule now applies when resume context is attached in `memory_context`: add the extra context first, then enforce the size limit.

### Hooks README and export alignment

The documentation and the published list of available hook modules had drifted out of sync with the actual code. This fix updated both so they accurately reflect what hooks exist and how to use them. It is like updating a building directory after new offices move in so visitors can actually find what is listed.

### End-to-end success-envelope verification

This is a set of automated tests that checks the entire response from start to finish: hints are included, previously surfaced context is preserved and the size count is correct. It acts as a final quality check before a response leaves the system, like a shipping inspector who opens the box, verifies everything is inside and confirms the label is accurate before it goes out the door.

### Empty result recovery

When a search comes back empty or with weak results, the system does not just shrug and say "nothing found." Instead, it diagnoses what went wrong (too narrow a filter, unclear question, or genuinely missing knowledge) and suggests what to do next, like broadening the search, switching modes, or saving new information. It is like a helpful shop assistant who says "we do not have that, but try the store down the street" instead of just shaking their head.

### Result confidence scoring

Each search result now carries a confidence label (high, medium or low) that tells you how sure the system is about the match. This score is calculated by checking multiple factors: how far ahead the result is from the next one, how many search methods agreed on it, whether additional quality checks confirmed it and how well-structured the source document is. No AI calls are needed for this, so it runs instantly.

### Two-tier result explainability

Each search result can now tell you why it ranked where it did, in plain language. The basic explanation says something like "matched strongly on meaning and was boosted by graph connections." If you need more detail, a debug mode shows exactly which search methods contributed and by how much. This helps you understand and trust the results instead of treating the ranking as a black box.

### Mode-aware response profiles

Different situations call for different response styles. A quick lookup needs just the top answer. A research session needs full results with evidence. Resuming previous work needs state and next steps. Debugging needs the full technical trace. This feature formats the same search results differently depending on the situation, like a waiter who adjusts their description of the menu based on whether you are in a rush or settling in for a long meal.

### Progressive disclosure with cursor pagination

Instead of cutting off results abruptly when the response gets too long, the system now gives you a summary of all results first, shows previews of the top ones and provides a "show me more" option to page through the rest. It is like a search engine that shows ten results per page instead of dumping everything at once or hiding results beyond an arbitrary limit.

### Retrieval session state

The system remembers what it already showed you during this conversation so it does not repeat itself. If you already saw a result three turns ago, it gets pushed down in future results so you see something new. It also tracks what you seem to be looking for and gives a small boost to results that align with your apparent goal. These notes last for the duration of your session and are cleaned up automatically when you are done.

---

## 20. SPEC KIT PHASE WORKFLOWS

### Phase detection and scoring (recommend-level.sh --recommend-phases)

Before splitting a large specification into phases, the system evaluates whether phasing is actually worthwhile. It scores the specification across four dimensions of complexity. High scores on multiple dimensions produce a strong recommendation to split into phases, while specifications that score low across the board get a recommendation to stay as a single unit. The scoring breakdown can also be exported in a machine-readable format for use in automated workflows.

### Phase folder creation (create.sh --phase)

When a specification is large enough to benefit from phasing, this tool creates a parent folder with child phase folders inside it. You can specify how many phases to create and give each one a descriptive name, or let the system number them automatically. The parent folder gets the standard template files, and each child phase folder gets its own independent set so they can be worked on separately. A documentation map in the parent links everything together.

### Recursive phase validation (validate.sh --recursive)

When you validate a parent phase folder, this tool automatically discovers and validates every child phase folder beneath it. The results are aggregated into a single report showing which phases passed, which have warnings and which have errors that must be fixed. The overall result reflects the worst outcome across all children, so one failing phase means the whole tree reports a failure. This lets you check an entire phase structure with a single command.

### Phase link validation (check-phase-links.sh)

Phase folders are supposed to link to each other: each child links back to its parent, and adjacent phases link to their predecessor and successor. This tool checks that all those cross-references are correct and that every phase listed in the parent's documentation map actually exists on disk. Missing or broken links are reported as warnings rather than errors, since they represent a documentation gap rather than a structural failure.

---

## 21. FEATURE FLAG REFERENCE

### 1. Search Pipeline Features (SPECKIT_*)

These flags are the main control panel for how search works. They turn major retrieval behaviors on or off, like fallback logic, reranking, telemetry, and rollout gates, so you can tune quality, speed, and safety without changing code. The graph-walk rollout ladder now has only three real states (`off`, `trace_only`, `bounded_runtime`), and the roadmap-related flags in this family are resolved live from the environment rather than frozen at import time.

### 2. Session and Cache

These settings control short-term memory and caching behavior. They decide how long the system remembers what it already returned, how cache entries expire, and whether duplicate results are filtered across a session.

### 3. MCP Configuration

These are guardrail settings for save-time validation. They define size limits, token estimates, duplicate thresholds, and anchor strictness so problematic files can be caught before indexing. The characters-per-token ratio serves double duty: it is used both by preflight validation to estimate whether a memory exceeds the token budget and by the quality loop when trimming content to fit its default token budget.

### 4. Memory and Storage

These variables define where memory files and databases live and how indexing batches are processed. In practice, they control storage location, path safety boundaries, and scan throughput.

### 5. Embedding and API

These settings pick which embedding and reranking providers the system uses and which credentials unlock them. They let you switch between cloud and local options without changing application logic.

### 6. Debug and Telemetry

These settings control diagnostic visibility. They adjust log verbosity and optional telemetry so you can inspect runtime behavior during debugging while keeping production output stable by default. This group also contains several legacy compatibility settings that are consumed by internal metadata snapshots and backward-compatibility paths, not just log and telemetry settings. Those roadmap flags are resolved live each time the helper runs, canonical `SPECKIT_MEMORY_*` keys override the older `SPECKIT_HYDRA_*` aliases, and shared memory stays off in roadmap snapshots until rollout is explicitly enabled so telemetry does not claim sharing is live before runtime access allows it.

### 7. CI and Build (informational)

These are informational CI metadata variables, not feature toggles. They annotate records with branch context for traceability but do not change retrieval, scoring, or storage behavior.
