# Phase 016-tooling-and-scripts — Tooling and Scripts Code Audit

## Overview

Feature-centric code audit of the **Tooling and Scripts** category from the Spec Kit Memory MCP feature catalog.

## Scope

- **Feature catalog:** `feature_catalog/16--tooling-and-scripts/`
- **Features:** 8
- **Complexity:** MEDIUM
- **Agent:** C9

## Features

1. tree thinning for spec folder consolidation
2. architecture boundary enforcement
3. progressive validation for spec documents
4. dead code removal
5. code standards alignment
6. real time filesystem watching with chokidar
7. standalone admin cli
8. watcher delete rename cleanup

## Audit Criteria

1. Code correctness — logic bugs, off-by-one, null/undefined, error paths
2. Standards alignment — sk-code--opencode TypeScript checklist
3. Behavior match — code matches feature catalog "Current Reality"
4. Test coverage — tests exist and cover described behavior
5. Playbook mapping — NEW-090+

## Acceptance Criteria

- [ ] All 8 features audited with structured findings
- [ ] Each feature has Status (PASS/WARN/FAIL), code issues, standards violations
- [ ] Test gaps documented
- [ ] Playbook scenarios mapped or gaps noted
