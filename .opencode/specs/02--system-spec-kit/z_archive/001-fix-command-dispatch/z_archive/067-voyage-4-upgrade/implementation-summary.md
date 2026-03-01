---
title: "Implementation Summary - Voyage 4 Upgrade [067-voyage-4-upgrade/implementation-summary]"
description: "Completed (Requires Restart)"
trigger_phrases:
  - "implementation"
  - "summary"
  - "voyage"
  - "upgrade"
  - "implementation summary"
  - "067"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary - Voyage 4 Upgrade

## Status
**Completed** (Requires Restart)

## Changes Applied

### Code
1. **Updated Provider Definition** (`voyage.js`):
   - Added `voyage-4`, `voyage-4-large`, `voyage-4-lite` to `MODEL_DIMENSIONS`
   - Updated pricing comments
   - Changed internal defaults

2. **Updated Factory Default** (`factory.js`):
   - Changed default fallback from `voyage-3.5` to `voyage-4`

### Documentation
1. **Install Guide**:
   - Updated recommended model table
   - Added section on Voyage 4 shared embedding space
   - Documented asymmetric retrieval capabilities

2. **System Spec Kit README**:
   - Updated recommended model to `voyage-4`

3. **Narsil Install Guide**:
   - Added note clarifying `voyage-code-2` remains recommended for code search
   - Mentioned Voyage 4 availability for testing

## Verification
- Code changes verified on disk
- `memory_health` check confirms current state (requires restart to switch)

## Next Steps
1. **Restart OpenCode** to reload the Spec Kit Memory MCP server.
2. The system will automatically:
   - Detect the new default (`voyage-4`)
   - Create a new database file: `context-index__voyage__voyage-4__1024.sqlite`
   - Start fresh (old memories preserved in `voyage-3.5` database)
3. **Optional**: Run `memory_index_scan({ force: true })` to bulk re-index existing memory files into the new database.
