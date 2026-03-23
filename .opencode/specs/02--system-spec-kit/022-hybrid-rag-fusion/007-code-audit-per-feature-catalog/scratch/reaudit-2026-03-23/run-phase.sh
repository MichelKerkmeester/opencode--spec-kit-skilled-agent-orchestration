#!/usr/bin/env bash
set -euo pipefail

# Usage: ./run-phase.sh <phase-folder> <catalog-category> <role: analyst|verifier>
PHASE_FOLDER="$1"
CATALOG_CAT="$2"
ROLE="$3"

BASE="specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog"
CATALOG_DIR=".opencode/skill/system-spec-kit/feature_catalog/${CATALOG_CAT}"
MCP_ROOT=".opencode/skill/system-spec-kit/mcp_server"
PHASE_DIR="${BASE}/${PHASE_FOLDER}"
OUTPUT_DIR="${PHASE_DIR}/scratch/reaudit-2026-03-23"

CATEGORY_NAME=$(echo "$CATALOG_CAT" | sed 's/^[0-9]*--//' | tr '-' ' ')

if [ "$ROLE" = "analyst" ]; then
  MODEL="gpt-5.4"
  OUTPUT_FILE="${OUTPUT_DIR}/gpt54-analyst.md"
  PROMPT="You are performing a fresh code audit of the Spec Kit Memory MCP server feature category: ${CATEGORY_NAME}.

READ these files:
1. ALL feature catalog entries in ${CATALOG_DIR}/ (list the directory first)
2. The prior audit findings in ${PHASE_DIR}/implementation-summary.md
3. The source files referenced in each catalog entry under ${MCP_ROOT}/

For EACH feature, classify as MATCH (accurate), PARTIAL (minor issues), or MISMATCH (wrong).

For each feature provide: Feature number, name, Verdict, Prior verdict, Changed since prior (YES/NO), Evidence (file:line refs), Discrepancies if any.

End with a markdown summary table: #, Feature, Verdict, Prior, Changed?

Be thorough. Read every referenced source file. Verify against code."

elif [ "$ROLE" = "verifier" ]; then
  MODEL="gpt-5.3-codex"
  OUTPUT_FILE="${OUTPUT_DIR}/codex53-verifier.md"
  PROMPT="You are performing code-level verification of feature catalog entries for category: ${CATEGORY_NAME}.

READ these files:
1. ALL feature catalog entries in ${CATALOG_DIR}/ (list the directory first)
2. The prior audit findings in ${PHASE_DIR}/implementation-summary.md
3. Source files under ${MCP_ROOT}/ referenced by each catalog entry

For EACH feature verify:
1. File existence - Do all listed source files exist?
2. Function signatures - Do referenced functions exist with documented signatures?
3. Flag defaults - Are defaults correct as documented?
4. Unreferenced files - Source files implementing this feature NOT in catalog?
5. Behavioral accuracy - Does code match catalog description?

For each feature provide: Feature number, name, file verification results, function verification, flag defaults check, unreferenced files found, and verdict (MATCH/PARTIAL/MISMATCH).

End with summary table: #, Feature, Files OK?, Functions OK?, Flags OK?, Unreferenced?, Verdict

Be exhaustive. Check every file reference with exact paths and line numbers."
fi

echo "=== Phase ${PHASE_FOLDER} | ${ROLE} (${MODEL}) ===" >&2
echo "$PROMPT" | codex exec - --model "$MODEL" -c model_reasoning_effort="high" --sandbox read-only -o "$OUTPUT_FILE" 2>&1
echo "=== Done: ${OUTPUT_FILE} ===" >&2
