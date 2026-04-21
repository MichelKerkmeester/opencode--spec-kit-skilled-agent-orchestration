# Iteration 003 - Traceability

## Scope

Compared packet requirements and checked checklist claims against the live skill-advisor catalog.

## Findings

### P1-001 - Catalog count and snippet-section claims are stale against the shipped catalog

- Severity: P1
- Dimension: traceability
- Evidence: `spec.md:119`, `spec.md:218`, `checklist.md:83`, `decision-record.md:109`, `decision-record.md:132`, `decision-record.md:134`, `decision-record.md:171`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/feature_catalog.md:31`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/01--daemon-and-freshness/01-watcher.md:13`
- Claim: The packet says the catalog has 18 per-feature files using a 4-section snippet contract, but the live root catalog describes 42 features across 8 groups and a sampled feature file includes a table of contents plus five numbered sections.
- Impact: The packet's checked completion evidence no longer matches the shipped package. This weakens checklist evidence and can mislead future reviewers about the catalog contract.
- Recommendation: Update `spec.md`, `checklist.md`, `tasks.md`, and ADR-002 to describe the current 42-feature catalog and its current section structure.

## Claim Adjudication

```json
{
  "findingId": "P1-001",
  "claim": "The packet's 18-file and 4-section catalog claims contradict the current shipped skill-advisor catalog.",
  "evidenceRefs": [
    "spec.md:119",
    "checklist.md:83",
    "decision-record.md:109",
    ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/feature_catalog.md:31",
    ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/01--daemon-and-freshness/01-watcher.md:13"
  ],
  "counterevidenceSought": "Checked strict packet validation, packet markdown references, root feature catalog, and a sampled per-feature file.",
  "alternativeExplanation": "The 18-file language may describe an older historical package state rather than the current package.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if ADR-002 is explicitly documented as historical-only and current catalog requirements are stated elsewhere in the packet."
}
```

## Traceability Checks

- `spec_code`: partial. Most claims resolve, but REQ-007 is stale.
- `checklist_evidence`: partial. CHK-040 is checked but its evidence conflicts with the live catalog.

## Delta

- New findings: P1-001
- New findings ratio: 0.34
