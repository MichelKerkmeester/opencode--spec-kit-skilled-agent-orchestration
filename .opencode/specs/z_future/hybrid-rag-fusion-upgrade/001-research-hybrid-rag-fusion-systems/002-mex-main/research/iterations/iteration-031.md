# Iteration 031: ADOPTION ROADMAP DRAFT

## Focus
ADOPTION ROADMAP DRAFT: Based on all 30 prior iterations, create a phased adoption roadmap with Q1/Q2/Q3 milestones. Include dependencies between adopted patterns.

## Findings
### Finding 1: Q1 should start with a separate markdown integrity lane
- **Source**: `external/README.md`, `external/src/drift/checkers/path.ts`, `external/src/drift/checkers/edges.ts`, `external/src/drift/checkers/index-sync.ts`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `research/iterations/iteration-030.md` [SOURCE: external/README.md:72-87; external/src/drift/checkers/path.ts:8-67; external/src/drift/checkers/edges.ts:5-34; external/src/drift/checkers/index-sync.ts:6-68; .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-44,755-776,623-640; research/iterations/iteration-030.md:8383-8391]
- **What it does**: Mex’s cheapest durable pattern is a zero-token lexical integrity pass that checks missing paths, dead frontmatter edges, and index drift before any repair flow starts.
- **Why it matters**: Spec Kit Memory already has retrieval and recovery authority through `memory_context`, `session_bootstrap`, and `code_graph_scan`; the missing adopt-now capability is markdown truthfulness, not another search layer.
- **Recommendation**: adopt now, Q1 milestone
- **Affected subsystem**: spec-doc integrity and validation
- **Dependencies**: none
- **Migration risk**: false-positive calibration; ship as advisory-only before considering any blocking mode
- **Impact**: high
- **Source strength**: primary

### Finding 2: Q1 should also standardize a tiny guided maintenance surface
- **Source**: `external/src/cli.ts`, `external/src/sync/index.ts`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`, `research/iterations/iteration-030.md` [SOURCE: external/src/cli.ts:28-161; external/src/sync/index.ts:60-105,136-188; .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-44,217-220,236-269,623-640,755-776; .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:113-124; research/iterations/iteration-030.md:8393-8401]
- **What it does**: Mex keeps the public verbs small (`check`, `sync`, `init`, `pattern add`, `watch`, `commands`) and always exposes clear next steps, dry-run behavior, and manual fallback paths.
- **Why it matters**: Public’s primitives are already stronger than Mex’s, but they are fragmented. The Q1 opportunity is a thin operator-facing surface that points to existing tools with stable hints, not a new backend.
- **Recommendation**: adopt now, Q1 milestone
- **Affected subsystem**: operator UX and maintenance workflow
- **Dependencies**: Finding 1, so the surface can point at real integrity outputs
- **Migration risk**: must stay a thin wrapper over current authority; no silent repair and no default auto-mutation
- **Impact**: high
- **Source strength**: primary

### Finding 3: Q2 should introduce a provider-neutral `spec-kit doctor`
- **Source**: `external/src/sync/index.ts`, `external/src/sync/brief-builder.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `research/iterations/iteration-030.md` [SOURCE: external/src/sync/index.ts:79-205; external/src/sync/brief-builder.ts:7-97; .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163-199; .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1187-1262,1273-1385; .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-44,217-220,236-269,623-640,755-776; research/iterations/iteration-030.md:8403-8411]
- **What it does**: Mex’s strongest reusable pattern is a closure-owning loop: detect issues, build a scoped repair brief, apply only necessary fixes, then recheck and repeat until the error set shrinks or stops moving.
- **Why it matters**: Spec Kit already has the needed primitives (`session_bootstrap`, `memory_health`, `memory_save(dryRun)`, `code_graph_scan`); what it lacks is one workflow that owns diagnosis, suggested repair, and rerun.
- **Recommendation**: NEW FEATURE, Q2 milestone
- **Affected subsystem**: guided repair orchestration
- **Dependencies**: Findings 1 and 2
- **Migration risk**: planner-only first, execution later; bundling this into Q1 would compound routing and repair risk
- **Impact**: high
- **Source strength**: primary

### Finding 4: Q2 should prototype freshness as advisory trust metadata
- **Source**: `external/README.md`, `external/src/drift/checkers/staleness.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts`, `research/iterations/iteration-030.md`, `research/iterations/iteration-034.md` [SOURCE: external/README.md:81-87; external/src/drift/checkers/staleness.ts:4-56; .opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:117-130; research/iterations/iteration-030.md:8413-8421; research/iterations/iteration-034.md:141-150]
- **What it does**: Mex uses fixed day and commit thresholds to label scaffold files as stale, then folds that result into health reporting.
- **Why it matters**: The dual-signal idea is useful for trust and operator hints, but prior synthesis already rejected using it as truth. In Spec Kit, freshness belongs as metadata that augments verified integrity, not as a hard gate.
- **Recommendation**: prototype later, Q2 milestone
- **Affected subsystem**: freshness/provenance signaling
- **Dependencies**: Finding 1 for integrity context; integrates best through Finding 3 rather than as a standalone lane
- **Migration risk**: threshold fit will vary by repo and activity level, so start as advisory only
- **Impact**: medium
- **Source strength**: primary

### Finding 5: Q3 should treat scaffold growth as an optional companion layer
- **Source**: `external/AGENTS.md`, `external/ROUTER.md`, `external/README.md`, `external/src/pattern/index.ts`, `research/iterations/iteration-030.md` [SOURCE: external/AGENTS.md:37-42; external/ROUTER.md:58-68; external/README.md:178-195; external/src/pattern/index.ts:6-67; research/iterations/iteration-030.md:8423-8431]
- **What it does**: Mex keeps the scaffold alive by adding patterns, updating context files, and refreshing current project state after real work through the `GROW` loop.
- **Why it matters**: That is useful for repeatable operator playbooks, but prior research consistently treated it as a companion-doc layer rather than a replacement for Spec Kit Memory’s durable authority.
- **Recommendation**: prototype later, Q3 milestone
- **Affected subsystem**: companion docs and task playbooks
- **Dependencies**: Findings 1 and 3; benefits from Finding 4 but should not wait on it
- **Migration risk**: uncontrolled doc churn unless ownership and integrity checks are already in place
- **Impact**: medium
- **Source strength**: primary

## Sources Consulted
- `research/research.md` [SOURCE: research/research.md:268598-268678]
- `research/iterations/iteration-030.md` [SOURCE: research/iterations/iteration-030.md:8383-8463]
- `research/iterations/iteration-034.md` [SOURCE: research/iterations/iteration-034.md:100-117,141-158]
- `external/README.md` [SOURCE: external/README.md:72-87,178-195]
- `external/src/cli.ts` [SOURCE: external/src/cli.ts:28-161]
- `external/src/sync/index.ts` [SOURCE: external/src/sync/index.ts:60-205]
- `external/src/sync/brief-builder.ts` [SOURCE: external/src/sync/brief-builder.ts:7-97]
- `external/src/drift/checkers/path.ts` [SOURCE: external/src/drift/checkers/path.ts:8-67]
- `external/src/drift/checkers/edges.ts` [SOURCE: external/src/drift/checkers/edges.ts:5-34]
- `external/src/drift/checkers/index-sync.ts` [SOURCE: external/src/drift/checkers/index-sync.ts:6-68]
- `external/src/drift/checkers/staleness.ts` [SOURCE: external/src/drift/checkers/staleness.ts:4-56]
- `external/AGENTS.md` [SOURCE: external/AGENTS.md:37-42]
- `external/ROUTER.md` [SOURCE: external/ROUTER.md:58-68]
- `external/src/pattern/index.ts` [SOURCE: external/src/pattern/index.ts:6-67]
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-44,217-220,236-269,623-640,755-776]
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:113-124,163-199]
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:117-130]
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1187-1262,1273-1385]

## Assessment
- New information ratio: 0.16
- Questions addressed: quarter sequencing, dependency ordering, where `spec-kit doctor` fits, whether freshness precedes or follows integrity, when scaffold growth becomes safe
- Questions answered: Q1 = integrity lane plus guided maintenance surface; Q2 = `spec-kit doctor` plus advisory freshness metadata; Q3 = optional scaffold-growth companion after integrity and doctor exist
- Novelty justification: the adopt-now and prototype-later mechanisms were already settled by iteration 030; this pass adds the missing quarter map, dependency ordering, and milestone guardrails
- Dependency chain: `integrity lane -> guided maintenance surface -> spec-kit doctor -> advisory freshness metadata -> optional scaffold-growth companion`
- Milestones:
  - **Q1**: ship advisory markdown-integrity checks and a minimal operator-facing maintenance surface
  - **Q2**: ship planner-first `spec-kit doctor`, then layer freshness/provenance hints into that flow
  - **Q3**: prototype opt-in scaffold growth as a companion-doc system, not as durable memory authority

## Ruled Out
- markdown-first memory replacement, because prior synthesis concluded it would regress hybrid retrieval, session recovery, causal links, and structural graph tooling
- single blended drift score as the main health surface, because subsystem evidence matters more than one aggregate number
- Q1 adoption of command/dependency/script-coverage audits, because iteration 030 already recommended waiting for a provider-neutral inventory model
- bundling `spec-kit doctor` into the same release as the first two Q1 slices, because it compounds routing and repair risk before integrity outputs stabilize

## Reflection
- What worked: anchoring on the locked iteration-030 synthesis, then validating each quarter against primary Mex source files and current Spec Kit tool contracts, made the roadmap concrete instead of speculative
- What did not work: the original `iteration-031.md` had duplicated template noise, so the roadmap had to be reconstructed from the clean tail plus the later synthesis anchors
- What I would do differently: define the Q1 acceptance matrix immediately after this pass, so later implementation work can validate explicit promotion criteria instead of re-arguing quarter boundaries

## Recommended Next Focus
Turn Q1 into implementation-ready slices: define the markdown-integrity issue schema, the operator-facing command/hint contract, the advisory-to-blocking promotion criteria, and the exact handoff payload that `spec-kit doctor` will consume in Q2.


Total usage est:        1 Premium request
API time spent:         4m 11s
Total session time:     4m 31s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.6m in, 18.8k out, 1.5m cached, 7.7k reasoning (Est. 1 Premium request)
