---
title: "README Staleness Audit: Storage, Extraction, Validation"
date: 2026-02-21
scope: "Specs 136-139 Integration Verification"
---

# README Staleness Audit: Storage, Extraction, Validation

## Scope

Audit three core README files for staleness from recent spec implementations (specs 136-139):

- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md`

Checked against:
- Spec 136: Working Memory + Hybrid RAG Automation (Phase 0-2, extraction, redaction, session-boost)
- Spec 137: Human Voice Rules Template Integration (HVR asset creation)
- Spec 138: Intelligent Context Architecture (Hybrid RAG Fusion, Skill Graphs, v15 schema)
- Spec 139: SpecKit Phase System (phase detection, parent/child folders, recursive validation)

---

## File 1: Storage Layer README.md (398 lines)

### Issue 1.1: Missing Schema Version Reference [HIGH]

**Line:** 398 (footer)

**Current:** `*Documentation version: 1.7.2 | Last updated: 2026-02-16 | Storage layer v1.2.0*`

**Should be:** `*Documentation version: 1.7.2 | Last updated: 2026-02-16 | Storage layer v1.2.0 | Database schema v15*`

**Evidence:** Spec 138 Executive Summary states: "establish a zero-external-dependency, <120ms context delivery architecture on the existing v15 SQLite schema". Storage layer is the persistence backend; schema version is critical infrastructure metadata.

**Severity:** HIGH (wrong/incomplete information)

---

### Issue 1.2: No Skill Graph Node Storage Documentation [HIGH]

**Lines:** Entire file (missing section)

**Current:** No mention of skill graph nodes, SGQS storage, wikilinks, or graph node persistence.

**Should include:** New section after §3.1 "Checkpoints" documenting:
- Skill Graph node table structure (id, title, type, tags, links)
- YAML frontmatter persistence in `skill_graph_nodes` table (or similar)
- Wikilink resolution (`[[node]]` syntax) in storage layer
- SGQS graph traversal queries against stored nodes

**Evidence:** Spec 138 Workstream B (lines 70-76): "Decomposition of all 9 monolithic SKILL.md files into wikilink-connected Skill Graph nodes" with "YAML frontmatter on all node files". This requires new storage infrastructure.

**Severity:** HIGH (missing critical subsystem)

---

### Issue 1.3: Missing BM25/FTS5 Index References [MEDIUM]

**Lines:** 36-53 (overview) and 91-212 (features)

**Current:** No mention of BM25 or FTS5 indexes, which are created in v15 schema for hybrid search.

**Should include:** Reference to BM25 and FTS5 virtual tables:
```
| **BM25 Indexing** | Keyword-based ranking via SQLite FTS5 BM25 function |
| **FTS5 Full-Text Index** | Content-based ranking via SQLite FTS5 |
```

**Evidence:** Spec 136 (lines 60-87) modifies `scripts/dist/memory/search.js` to "Activate tri-hybrid retrieval channels" (Vector + BM25 + FTS5). These indexes must be created and maintained by the storage layer.

**Severity:** MEDIUM (missing feature clarification)

---

### Issue 1.4: Missing Phase System Metadata Storage [MEDIUM]

**Lines:** Entire file (missing section)

**Current:** No mention of phase metadata, parent spec folder references, or phase-aware memory scoping.

**Should include:** New subsection after §3.0 "Incremental Indexing" documenting:
- Phase metadata storage (parent_spec_folder, phase_number, phase_name columns in memory_index table)
- Phase-aware queries (filter memories by parent spec folder)
- Phase boundary enforcement in causal edges (edges must not cross phase boundaries)

**Evidence:** Spec 139 (lines 67-91) defines "Phase Detection Scoring" and "Parent/Child Spec Folder Structure". Storage layer must support phase-scoped memory isolation.

**Severity:** MEDIUM (missing infrastructure)

---

### Issue 1.5: Missing HVR Documentation [LOW]

**Lines:** N/A (entire file absence)

**Assessment:** CORRECTLY ABSENT. Spec 137 (Human Voice Rules) is a documentation template feature, not a storage infrastructure concern. Storage README correctly omits HVR.

**Severity:** N/A (not applicable)

---

## File 2: Extraction README.md (180 lines)

### Issue 2.1: Missing SPECKIT_EXTRACTION Feature Flag [HIGH]

**Lines:** Entire file (missing section)

**Current:** No mention of the `SPECKIT_EXTRACTION` environment variable that controls when extraction is active.

**Should include:** New section after §1 "Overview" documenting:
```
### Feature Flag Control

The extraction pipeline is controlled by the `SPECKIT_EXTRACTION` environment variable:

| Setting | Default | Behavior |
|---------|---------|----------|
| SPECKIT_EXTRACTION=true | true | Extraction pipeline active; `afterToolCallbacks` fire post-dispatch |
| SPECKIT_EXTRACTION=false | false | Extraction disabled; manual memory_save required |

**Note:** When enabled, extraction runs asynchronously in background queues per Spec 136 Phase 0.
```

**Evidence:** Spec 136 (lines 49-50): "non-blocking queued callbacks, per-callback error isolation, no await in dispatch response path". This is a feature flag controlled behavior.

**Severity:** HIGH (missing operational control)

---

### Issue 2.2: Missing SPECKIT_REDACTION_GATE Feature Flag [HIGH]

**Lines:** 89-106 (Redaction Gate section)

**Current:** Documents "Gate Behaviour" but does not mention `SPECKIT_REDACTION_GATE` environment variable controlling the gate.

**Should modify:**
```
### Redaction Gate (`redaction-gate.ts`) - REVISED

**Purpose:** Block PII and secret content before it enters the memory store.

**Feature Flag:** Controlled by `SPECKIT_REDACTION_GATE` (default: true).
When false, PII/secret patterns are logged but content is NOT blocked.

| Aspect | Details |
|--------|---------|
| **Gate Controlled** | SPECKIT_REDACTION_GATE environment variable (true/false) |
| **PII Patterns** | Email addresses, phone numbers, national IDs, full names in structured fields |
| **Secret Patterns** | API keys, bearer tokens, private keys, connection strings, `.env`-style assignments |
| **Gate Behaviour** | Returns `{ allowed: boolean, reasons: string[] }` — content is blocked if `allowed === false` AND SPECKIT_REDACTION_GATE=true |
```

**Evidence:** Spec 136 (line 49): "PII redaction gate (spec 136, SPECKIT_REDACTION_GATE flag)". Gate status is operator-configurable.

**Severity:** HIGH (missing operational control)

---

### Issue 2.3: Missing Pre-implementation Calibration Documentation [HIGH]

**Lines:** 89-106, 111-129

**Current:** No reference to empirical validation baseline (50 real Bash outputs, ≤15% false-positive rate) required before Phase 2 rollout.

**Should include:** New subsection after "Gate Behaviour" documenting:
```
### Calibration & False-Positive Baseline

Before Phase 2 deployment, the redaction gate must be calibrated on real tool outputs:

| Calibration Requirement | Baseline | Status |
|------------------------|----------|--------|
| Real Bash outputs tested | 50 | Phase 1.5 hardening gate (Spec 136) |
| Maximum false-positive rate | ≤15% | Required before Phase 2 |
| Test harness | `lib/extraction/__tests__/redaction-gate.calibration.ts` | TBD |

**Note:** Phase 1.5 hardening gate (Spec 136, line 51) requires redaction calibration completion before Phase 2 extraction pipeline deployment.
```

**Evidence:** Spec 136 (lines 51-52): "Phase 1.5 hardening gate: ... complete redaction calibration on 50 real Bash outputs (false-positive rate <= 15%) before Phase 2".

**Severity:** HIGH (missing critical acceptance criteria)

---

### Issue 2.4: Missing Provenance Metadata Fields [MEDIUM]

**Lines:** 79-106

**Current:** "Memory ID Resolution" and "Redaction Gate" documented, but provenance metadata fields are NOT listed.

**Should add:** New subsection after "Extraction Adapter" documenting:
```
### Provenance Metadata

Each extracted memory carries provenance metadata for audit and reproducibility:

| Field | Type | Description |
|-------|------|-------------|
| `source_tool` | string | Tool class that triggered extraction (Bash, Grep, Read, etc.) |
| `source_call_id` | string | Unique ID of the tool call that produced the memory |
| `extraction_rule_id` | string | ID of the extraction rule applied (e.g., "read-spec-attention-0.9") |
| `redaction_applied` | boolean | Whether PII redaction modified the content before insert |

**Example:**
```json
{
  "memory_id": "mem-12345",
  "content": "Feature XYZ specification",
  "source_tool": "Read",
  "source_call_id": "call-abc-789",
  "extraction_rule_id": "read-spec-0.9",
  "redaction_applied": false
}
```
```

**Evidence:** Spec 136 (line 52): "provenance metadata (`source_tool`, `source_call_id`, `extraction_rule_id`, `redaction_applied`)".

**Severity:** MEDIUM (missing schema documentation)

---

### Issue 2.5: Missing Tool-Class Extraction Rules [MEDIUM]

**Lines:** 79-88

**Current:** "Memory ID Resolution" and "Deterministic Fallback" documented, but no mention of tool-class extraction rules or attention scoring.

**Should add:** New subsection after "Memory ID Resolution" documenting:
```
### Tool-Class Extraction Rules

Extraction is triggered based on the tool class and matches extraction rules to assign attention weight:

| Tool Class | Extraction Trigger | Attention Weight | Context |
|-----------|-------------------|------------------|---------|
| **Read** | Successfully reads spec.md-like files | 0.9 | High-signal specification content |
| **Grep** | Error matching on patterns (e.g., NOT_FOUND) | 0.8 | Search failure indicates missing context |
| **Bash** | Git commit, git diff, git log outputs | 0.7 | Version control operations have reproducible semantics |
| **Other** | Generic tool output | 0.5 | Lower confidence unless matched by custom rule |

**Note:** Each rule is configured in `configs/cognitive.ts` via `EXTRACTION_RULES` schema (Spec 136, line 76).
```

**Evidence:** Spec 136 (line 52): "tool-class rules (Read spec.md -> attention 0.9, Grep error -> 0.8, Bash git commit -> 0.7)".

**Severity:** MEDIUM (missing rule specification)

---

### Issue 2.6: Missing Tool-Class Trigger Mapping [MEDIUM]

**Lines:** Entire file (missing section)

**Current:** No table or documentation of WHICH tool classes trigger extraction vs. which are excluded.

**Should include:** New section documenting extraction trigger logic:
```
### Extraction Triggers by Tool Class

| Tool Class | Extraction Enabled | Notes |
|-----------|-------------------|-------|
| Bash | Yes | Filtered: git ops, stat output, ls result (high signal) |
| Grep | Yes | Filtered: match context, errors (failures trigger extraction) |
| Read | Yes | Always (spec.md content is high signal) |
| WebFetch | Yes | If contains structured data / decision content |
| Other MCP Tools | No | Unless explicitly registered via `afterToolCallbacks` |

**Gate:** All extractions pass through `checkRedactionGate()` before memory insert.
```

**Evidence:** Spec 136 (lines 49-50, 84): "Register post-dispatch `afterToolCallbacks` hook array" and "tool-class rules".

**Severity:** MEDIUM (missing operator guidance)

---

## File 3: Validation README.md (260 lines)

### Issue 3.1: Missing Phase-Aware Recursive Validation [HIGH]

**Lines:** Entire file (missing section)

**Current:** Documents preflight checks but no mention of phase validation or `--recursive` mode for parent/child spec folders.

**Should include:** New subsection after §3.1 "Anchor Format Validation" documenting:
```
### Phase-Aware Validation (v1.8.0+)

The validation system supports recursive validation for parent and child phase folders:

| Mode | Flag | Behavior |
|------|------|----------|
| **Single folder** | (default) | Validates spec folder anchors, duplicates, tokens, size |
| **Phase recursive** | `--recursive` | Validates parent folder AND all child phases as a unit; checks parent/child linking metadata |

**Phase Linkage Checks (--recursive mode):**

| Check | Description | Error Code |
|-------|-------------|-----------|
| Parent back-references | Child folders must reference parent_spec_folder | PF040 |
| Phase sequence | Child phases numbered sequentially (001, 002, ...) | PF041 |
| Causal edge boundaries | Causal edges do not cross phase boundaries | PF042 |
| Anchor uniqueness | No duplicate anchor IDs across phase hierarchy | PF043 |

**Example:**
```bash
validate.sh --recursive specs/02--system-spec-kit/022-hybrid-rag-fusion
# Validates 138 parent + all children (138/001-*, 138/002-*, 138/003-*)
```

**Evidence:** Spec 139 (lines 99-100): "Enhanced `create.sh` with `--phase` mode ... Recursive validation via `validate.sh --recursive`".

**Severity:** HIGH (missing operational feature)

---

### Issue 3.2: Missing Skill Graph Node Anchor Validation [MEDIUM]

**Lines:** 72-82 (Anchor Format Validation section)

**Current:** Documents HTML anchor validation but not YAML frontmatter anchor validation for skill graph nodes.

**Should modify:** Section to include skill graph node anchors:
```
### Anchor Format Validation - REVISED

Validates two types of anchor patterns:

#### Type 1: Memory File Anchors (existing)

Validates memory file anchor tags:

| Check | Description |
|-------|-------------|
| Format | Must match `<!-- ANCHOR:id -->` pattern |
| ID Pattern | Alphanumeric start, allows hyphens and slashes |
| Closure | Each opening tag needs `<!-- /ANCHOR: id -->` |
| Uniqueness | No duplicate anchor IDs in same file |

#### Type 2: Skill Graph Node Anchors (Spec 138, Workstream B)

Validates YAML frontmatter on skill graph node files:

| Check | Description |
|-------|-------------|
| YAML format | Valid YAML frontmatter: `id`, `title`, `type`, `tags`, `links` |
| Node ID uniqueness | No duplicate node IDs in same skill graph |
| Wikilink validity | `[[node]]` references point to valid nodes |
| Tag compliance | Tags match skill graph taxonomy (TBD) |

**Example Skill Graph Node with Anchors:**
```yaml
---
id: "sgn-memory-search"
title: "Memory Search Pipeline"
type: "component"
tags: ["retrieval", "hybrid-search"]
links:
  - "sgn-bm25-index"
  - "sgn-vector-search"
---

<!-- ANCHOR:memory-search-pipeline -->
## Memory Search Pipeline

Implements tri-hybrid retrieval...

<!-- /ANCHOR:memory-search-pipeline -->
```
```

**Evidence:** Spec 138 (lines 70-76) Workstream B: "YAML frontmatter on all node files (id, title, type, tags, links)" and "Progressive disclosure traversal via `[[node]]` wikilinks".

**Severity:** MEDIUM (missing schema validation)

---

### Issue 3.3: Missing HVR Validation [MEDIUM]

**Lines:** Entire file (missing section)

**Current:** No validation rules for Human Voice Rule compliance in generated documentation.

**Assessment:** DEFER. Spec 137 (HVR) is guidance-based, not enforcement-based (lines 63-64: "Automated HVR enforcement scripts or linters — this is guidance-based, not enforcement-based"). Validation README correctly does NOT include HVR checks.

**Severity:** N/A (correctly absent per spec design)

---

### Issue 3.4: PII Redaction Validation Cross-Reference [LOW]

**Lines:** Entire file (missing reference)

**Current:** No cross-reference to Spec 136 redaction calibration (50 real Bash outputs, ≤15% false-positive rate).

**Should add:** Brief reference in "Related Modules" section:
```
### Related Modules

| Module | Purpose |
|--------|---------|
| `extraction/redaction-gate` | PII/secret blocking; validation coordinates with redaction calibration (Spec 136 Phase 1.5) |
```

**Evidence:** Spec 136 (line 51): "Phase 1.5 hardening gate: ... complete redaction calibration on 50 real Bash outputs".

**Severity:** LOW (cosmetic, already covered by extraction README)

---

## Summary Table

| File | Issue | Line(s) | Severity | Category |
|------|-------|---------|----------|----------|
| **storage/README.md** | 1.1: Missing schema v15 ref | 398 | HIGH | Wrong/Incomplete |
| | 1.2: No Skill Graph storage docs | entire | HIGH | Missing subsystem |
| | 1.3: Missing BM25/FTS5 index refs | 36-53, 91-212 | MEDIUM | Missing feature |
| | 1.4: Missing Phase metadata storage | entire | MEDIUM | Missing infra |
| | 1.5: HVR (correctly absent) | N/A | N/A | N/A |
| **extraction/README.md** | 2.1: Missing SPECKIT_EXTRACTION flag | entire | HIGH | Missing control |
| | 2.2: Missing SPECKIT_REDACTION_GATE flag | 89-106 | HIGH | Missing control |
| | 2.3: Missing redaction calibration docs | 89-106, 111-129 | HIGH | Missing criteria |
| | 2.4: Missing provenance metadata fields | 79-106 | MEDIUM | Missing schema |
| | 2.5: Missing tool-class extraction rules | 79-88 | MEDIUM | Missing rules |
| | 2.6: Missing tool trigger mapping | entire | MEDIUM | Missing guidance |
| **validation/README.md** | 3.1: Missing phase-aware recursive validation | entire | HIGH | Missing feature |
| | 3.2: Missing skill graph node anchor validation | 72-82 | MEDIUM | Missing schema |
| | 3.3: HVR validation (correctly absent) | N/A | N/A | N/A |
| | 3.4: PII redaction x-ref (low priority) | entire | LOW | Low priority |

---

## Issue Summary

**Total issues:** 15 (across 3 files)
- **HIGH (Wrong/Incomplete):** 6 issues
  - Storage: 2 (missing schema v15, missing skill graph storage)
  - Extraction: 3 (missing feature flags, missing calibration docs)
  - Validation: 1 (missing recursive phase validation)
- **MEDIUM (Missing features):** 7 issues
  - Storage: 2 (missing BM25/FTS5, missing phase metadata)
  - Extraction: 3 (missing provenance, missing rules, missing trigger map)
  - Validation: 2 (missing skill graph anchors, PII redaction x-ref)
- **LOW (Cosmetic):** 2 issues (both correctly absent per spec design)

---

## Most Critical Issues (Rank Order)

1. **Extraction README missing feature flags** (Issues 2.1, 2.2): Operators cannot control extraction or redaction without documentation
2. **Storage README missing schema v15 reference** (Issue 1.1): Persistence layer identity incomplete
3. **Validation README missing recursive phase validation** (Issue 3.1): Phase system documentation gap prevents adoption
4. **Extraction README missing redaction calibration docs** (Issue 2.3): Acceptance criteria for Phase 2 rollout undocumented

---

## Recommendations

### Immediate (P0 - Before any Phase 1-2 rollout)

1. Add `SPECKIT_EXTRACTION` and `SPECKIT_REDACTION_GATE` feature flag documentation to extraction/README.md
2. Add schema v15 reference to storage/README.md footer
3. Add Phase-aware recursive validation section to validation/README.md
4. Add redaction calibration baseline documentation to extraction/README.md

### Short-term (P1 - During Phase implementation)

5. Add Skill Graph node storage documentation to storage/README.md
6. Add Tool-Class Extraction Rules and Trigger Mapping to extraction/README.md
7. Add Provenance Metadata documentation to extraction/README.md
8. Add Skill Graph Node Anchor Validation to validation/README.md
9. Add Phase Metadata Storage to storage/README.md

### Cosmetic (P2 - Before Phase 1 stabilization)

10. Update version timestamps to reflect 2026-02-21 audit date

---

**Audit Date:** 2026-02-21  
**Auditor:** Spec Kit Memory Audit Task  
**Specs Referenced:** 136 (Working Memory), 137 (HVR), 138 (Hybrid RAG), 139 (Phase System)
