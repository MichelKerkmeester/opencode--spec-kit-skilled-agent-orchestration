# Iteration 037: ARCHITECTURE EVOLUTION MAP

## Focus
ARCHITECTURE EVOLUTION MAP: Draw the before/after architecture showing exactly what changes in our memory system with all adoptions applied.

## Findings
### Finding 1: The **before** architecture already has three distinct authority planes: retrieval, recovery/routing, and explicit maintenance
- **Source**: `README.md`, `opencode.json`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts` [SOURCE: `README.md:522-547,657-698`; `opencode.json:19-59`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-44,623-706,739-776`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:700-815,891-927`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:94-124,143-156,163-209`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:426-440`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1187-1262,1273-1394`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:123-267`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:15-58`]
- **What it does**: Public already separates concerns cleanly:

  ```text
  BEFORE

  User / agent
      |
      +--> memory_context()
      |      +--> quick -> trigger matcher
      |      +--> focused/deep -> memory_search hybrid index
      |      +--> resume -> anchored continuity retrieval
      |
      +--> session_bootstrap() / session_resume()
      |      +--> health + structural readiness + next-action nudges
      |
      +--> code_graph_query/context + CocoIndex search
      |
      `--> explicit maintenance tools
             +--> memory_health (confirmation-gated repair)
             +--> memory_save / generate-context.js
             +--> code_graph_scan
             +--> ccc_reindex
  ```

  Retrieval is handled by `memory_context` and its routed strategies; session startup and routing guidance are handled by `session_bootstrap`; structural and semantic code discovery are separate tools; mutation and repair stay explicit, dry-run aware, or confirmation-gated.
- **Why it matters**: The architecture evolution cannot be understood as “replace memory with Mex ideas.” The starting point is already a layered indexed system with explicit authority boundaries, so every adoption must wrap or annotate those planes rather than collapsing them.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: The **after** architecture adds one new advisory integrity lane, not a new retrieval or indexing subsystem
- **Source**: `external/README.md`, `external/src/drift/checkers/path.ts`, `external/src/drift/checkers/edges.ts`, `external/src/drift/checkers/index-sync.ts`, `research/iterations/iteration-031.md`, `research/iterations/iteration-032.md`, `research/iterations/iteration-035.md` [SOURCE: `external/README.md:72-87`; `external/src/drift/checkers/path.ts:8-67`; `external/src/drift/checkers/edges.ts:5-34`; `external/src/drift/checkers/index-sync.ts:6-68`; `research/iterations/iteration-031.md:7-16`; `research/iterations/iteration-032.md:8-27`; `research/iterations/iteration-035.md:7-13`]
- **What it does**: The adopted Mex slice is lexical, markdown-scoped, and cheap: referenced-path checks, frontmatter-edge checks, and index/file consistency checks. Applied to Public, that becomes a fourth lane beside retrieval, graph/semantic code search, and explicit maintenance:

  ```text
  AFTER (new core delta)

  User / agent
      |
      +--> integrity lane (NEW, advisory)
      |      +--> path checker
      |      +--> edge checker
      |      +--> index-sync checker
      |      `--> optional later freshness metadata
      |
      +--> existing retrieval plane (UNCHANGED)
      |      +--> memory_context -> trigger / hybrid memory_search / resume
      |
      +--> existing structural + semantic code plane (UNCHANGED)
      |      +--> code_graph_* + CocoIndex
      |
      `--> existing maintenance authorities (UNCHANGED)
             +--> memory_health / memory_save / generate-context.js
             +--> code_graph_scan / ccc_reindex
  ```

  The integrity lane reports markdown truthfulness; it does not answer semantic questions, re-rank search results, or create a second discovery index.
- **Why it matters**: This is the central architecture change from the Mex research. Public gains the missing “documentation truthfulness” plane without touching hybrid retrieval, causal memory, session continuity, or code intelligence.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 3: The main new control-plane element is a thin planner surface that sits **above** existing authorities
- **Source**: `external/src/cli.ts`, `external/src/sync/index.ts`, `research/iterations/iteration-031.md`, `research/iterations/iteration-032.md`, `research/iterations/iteration-035.md`, `research/iterations/iteration-036.md`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` [SOURCE: `external/src/cli.ts:28-161`; `external/src/sync/index.ts:29-210`; `research/iterations/iteration-031.md:18-37`; `research/iterations/iteration-032.md:50-91`; `research/iterations/iteration-035.md:15-21`; `research/iterations/iteration-036.md:7-27,39-45`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:101-124,163-209`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:426-440`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1187-1262,1301-1394`]
- **What it does**: The operator-facing evolution is not “integrity checker only.” It is a planner/wrapper surface that can run integrity checks, summarize readiness, emit repair briefs, and route operators to the correct existing tool without taking over mutation authority itself.

  ```text
  AFTER (new control plane)

  thin integrity surface / future spec-kit doctor
      |
      +--> run integrity lane
      +--> collect bootstrap + health + maintenance hints
      +--> emit JSON / plan / routing matrix
      `--> hand off to explicit tools:
             - session_bootstrap
             - memory_health
             - memory_save(dry-run or explicit write)
             - code_graph_scan
             - ccc_reindex
  ```

  This layer owns diagnosis and guidance, not hidden writes.
- **Why it matters**: This is how Public gets Mex’s small mental model without losing its stronger safety model. The UX becomes simpler, but the underlying authority remains distributed and explicit.
- **Recommendation**: NEW FEATURE
- **Impact**: high
- **Source strength**: primary

### Finding 4: Session startup and recovery stay canonical; integrity only adds advisory context and routing hints
- **Source**: `README.md`, `.opencode/command/spec_kit/resume.md`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`, `research/iterations/iteration-035.md`, `research/iterations/iteration-036.md` [SOURCE: `README.md:522-547,657-665`; `.opencode/command/spec_kit/resume.md:202-223,248-280`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:739-776`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:113-124,143-156,163-209`; `research/iterations/iteration-035.md:15-21`; `research/iterations/iteration-036.md:15-20`]
- **What it does**: The after-map does **not** move startup authority to a markdown router. `session_bootstrap` and `/spec_kit:resume` still own recovery, structural readiness, and next actions. The new integrity lane can annotate those flows with “docs look stale” or “integrity check recommended” hints, but it does not become the entry point for session continuity.
- **Why it matters**: This preserves the strongest existing Public capability that Mex does not have: structured, merged session recovery. The new lane improves observability without regressing the recovery contract agents already depend on.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 5: The final target architecture changes **less** than it first appears: optional freshness and scaffold-growth remain sidecars, while score-first health and markdown-first memory replacement stay out
- **Source**: `external/README.md`, `research/iterations/iteration-031.md`, `research/iterations/iteration-032.md`, `research/iterations/iteration-034.md`, `research/iterations/iteration-036.md` [SOURCE: `external/README.md:81-87,178-198`; `research/iterations/iteration-031.md:29-59,93-97`; `research/iterations/iteration-032.md:8-27`; `research/iterations/iteration-034.md:8-20,24-38`; `research/iterations/iteration-036.md:31-45`]
- **What it does**: The end-state architecture includes only two core additions to the current system: the advisory integrity lane and the thin planner surface. Everything else is constrained:
  - **prototype later / sidecar only**: freshness metadata, optional scaffold-growth companion docs
  - **reject**: score-first health as the main status contract, markdown-first memory replacement, mandatory Mex-style post-task pattern growth, integrity folded into hot retrieval paths
- **Why it matters**: The most accurate “after” map is conservative. The research outcome is a bounded extension of Spec Kit Memory, not a new memory stack. That boundedness is what keeps the migration feasible.
- **Recommendation**: prototype later
- **Impact**: medium
- **Source strength**: primary

## Sources Consulted
- `README.md:522-547,657-698`
- `opencode.json:19-59`
- `.opencode/command/spec_kit/resume.md:202-223,248-280`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-44,623-706,739-776`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:700-815,891-927`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:94-209`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:426-440`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1187-1262,1273-1394`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:123-267`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:15-58`
- `external/README.md:72-87,81-87,178-198`
- `external/src/cli.ts:28-161`
- `external/src/sync/index.ts:29-210`
- `external/src/drift/checkers/path.ts:8-67`
- `external/src/drift/checkers/edges.ts:5-34`
- `external/src/drift/checkers/index-sync.ts:6-68`
- `research/iterations/iteration-031.md:7-37,40-59,93-97`
- `research/iterations/iteration-032.md:8-27,29-91`
- `research/iterations/iteration-034.md:8-20,24-45`
- `research/iterations/iteration-035.md:7-21`
- `research/iterations/iteration-036.md:7-45`

## Assessment
- **New information ratio**: 0.12
- **Questions addressed**: what the current architecture already is; which new lane is actually being added; where the planner surface sits; whether startup/recovery authority moves; which candidate additions are truly part of the final architecture versus sidecars or rejections
- **Questions answered**: the current system already has distinct retrieval, routing, and maintenance planes; the adopted architecture adds one advisory integrity lane and one thin planner surface; recovery authority stays with `session_bootstrap` and `/spec_kit:resume`; repair authority stays with existing explicit tools; freshness and scaffold-growth remain optional sidecars rather than core memory authority
- **Novelty justification**: earlier iterations chose individual patterns and rollout constraints; this pass turns those scattered decisions into one before/after ownership map that shows exactly what changes, what stays fixed, and what remains deliberately excluded

## Ruled Out
- Replacing `memory_context`, `memory_search`, CocoIndex, or code graph with a markdown-first scaffold
- Folding integrity findings into `memory_context`, `memory_search`, or `code_graph_query` as if they were retrieval relevance signals
- Making the integrity surface a new write authority that bypasses `memory_health` confirmation or `memory_save` dry-run semantics
- Replacing `session_bootstrap` or `/spec_kit:resume` with a markdown-router-first startup path
- Using one Mex-style drift score as the main health contract for Public

## Reflection
- **What worked**: starting from the existing Public authority planes, then layering only the already-adopted Mex slices on top, produced a cleaner architecture map than trying to redraw the whole system from Mex outward
- **What did not work**: the canonical deep-research reducer state files were not present in this phase folder, and both shell validation and `memory_context` access were permission-denied in this runtime, so continuity had to come from primary source files plus prior iteration packets
- **What I would do differently**: in the next pass, turn this architecture map into a subsystem-by-subsystem acceptance matrix with one command surface, one authority owner, one allowed side effect, and one forbidden side effect per box in the diagram

## Recommended Next Focus
Turn the evolution map into an implementation contract:
1. freeze the command/routing names for the integrity surface and future `spec-kit doctor`
2. define the exact output envelopes for integrity findings, repair plans, and advisory startup hints
3. map each new box in the after-diagram to one owner (`memory_context`, `session_bootstrap`, `memory_health`, `memory_save`, `code_graph_scan`, `ccc_reindex`)
4. specify which prototype-later sidecars stay outside the first implementation slice
```


Total usage est:        1 Premium request
API time spent:         5m 33s
Total session time:     5m 51s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.1m in, 26.0k out, 1.0m cached, 8.8k reasoning (Est. 1 Premium request)
