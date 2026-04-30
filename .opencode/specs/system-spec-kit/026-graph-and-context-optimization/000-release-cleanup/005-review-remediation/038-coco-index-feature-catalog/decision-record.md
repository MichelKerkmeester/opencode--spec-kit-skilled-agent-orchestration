---
title: "Decision Record: 051 CocoIndex Feature Catalog"
description: "Category, naming and exclusion decisions for the mcp-coco-index feature catalog."
template_source: "SPECKIT_TEMPLATE_SOURCE: level_2"
trigger_phrases:
  - "038-coco-index-feature-catalog"
  - "mcp-coco-index feature catalog"
  - "cocoindex catalog"
  - "semantic search catalog"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/038-coco-index-feature-catalog"
    last_updated_at: "2026-04-30T09:30:00+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Decisions recorded"
    next_safe_action: "Orchestrator commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "audit-findings.md"
      - "remediation-log.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:051-coco-index-feature-catalog-decision"
      session_id: "038-coco-index-feature-catalog"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: 051 CocoIndex Feature Catalog

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:decisions -->
## 1. DECISIONS

| Decision | Outcome | Rationale |
|----------|---------|-----------|
| Use nine category folders | Accepted | The skill surface naturally splits by CLI, MCP, indexing, daemon, search, fork extensions, tooling, configuration and validation. |
| Use lowercase `feature_catalog.md` root | Accepted | The user requested that exact path and the current sk-doc template uses lowercase. |
| Use four-section per-feature snippets | Accepted | The packet explicitly requires `OVERVIEW`, `CURRENT REALITY`, `SOURCE FILES`, `SOURCE METADATA` as the canonical snippet shape. |
| Include references and manual playbook files as validation anchors where no pytest exists | Accepted | Some behaviors are documented validation contracts rather than runtime unit tests. |
| Keep catalog evergreen | Accepted | Feature files describe current behavior and avoid packet-history wording. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:category-model -->
## 2. CATEGORY MODEL

| Category | Purpose |
|----------|---------|
| `01--cli-commands` | User-facing `ccc` command surface |
| `02--mcp-server` | stdio MCP server and one-tool contract |
| `03--indexing-pipeline` | Project environment, discovery, chunking, embedding and persistence |
| `04--daemon-and-readiness` | Background process lifecycle and readiness behavior |
| `05--search-and-ranking` | Query execution, filtering, scoring and result handling |
| `06--patches-and-extensions` | Fork-specific dedup and reranking extensions |
| `07--installation-tooling` | Installer, doctor, bootstrap and update helper scripts |
| `08--configuration` | Settings, root discovery, env overrides and downstream wiring |
| `09--validation-and-tests` | Automated and manual coverage surfaces |
<!-- /ANCHOR:category-model -->

---

<!-- ANCHOR:exclusions -->
## 3. EXCLUSIONS

| Exclusion | Reason |
|-----------|--------|
| Runtime code changes | Packet is doc-only. |
| Vendored upstream source edits | User explicitly prohibited touching upstream source. |
| Unsupported daemon start command | Current CLI auto-starts daemons but does not expose `ccc daemon start`. |
| Spec packet history in evergreen catalog | Evergreen content must survive packet renumbering. |
| Exhaustive upstream license cataloging | License and notice files are attribution docs, not runtime features. |
<!-- /ANCHOR:exclusions -->
