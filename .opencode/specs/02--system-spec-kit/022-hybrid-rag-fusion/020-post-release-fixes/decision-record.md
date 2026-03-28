---
title: "Decision Record: 020 Pre-Release Remediation"
description: "Architecture decisions for the consolidated pre-release remediation packet"
importance_tier: "normal"
contextType: "general"
---
# Decision Record: 020 Pre-Release Remediation
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use one live control packet with explicit historical lineage

**Status**: Accepted

<!-- ANCHOR:adr-001-context -->
### Context

The old 012, 013, and 014 packets each describe part of the same release-control story.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Use 020-post-release-fixes as the live control packet while preserving 012, 013, and 014 only as historical lineage.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

Active remediation tracked from one backlog and one merged review report. Historical lineage stays visible without being mistaken for live dependencies.

**Alternatives Rejected**: Keep all three predecessor packets active in parallel.
<!-- /ANCHOR:adr-001-consequences -->
<!-- /ANCHOR:adr-001 -->
