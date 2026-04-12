#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-GRAPH-METADATA
# ───────────────────────────────────────────────────────────────

set -euo pipefail

run_check() {
    local folder="$1"
    local _level="$2"
    local graph_file="$folder/graph-metadata.json"

    RULE_NAME="GRAPH_METADATA_PRESENT"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    if [[ ! -f "$graph_file" ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="graph-metadata.json is missing"
        RULE_DETAILS=("Expected root-level packet graph metadata at $graph_file")
        RULE_REMEDIATION="Run the graph-metadata backfill or refresh flow so the spec folder has a root graph-metadata.json file."
        return 0
    fi

    if ! node - "$graph_file" <<'EOF' >/dev/null 2>&1
const fs = require('fs');
const filePath = process.argv[2];
const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const requiredTopLevel = ['schema_version', 'packet_id', 'spec_folder', 'parent_id', 'children_ids', 'manual', 'derived'];
for (const key of requiredTopLevel) {
  if (!(key in parsed)) process.exit(2);
}
if (!Array.isArray(parsed.children_ids)) process.exit(3);
if (!parsed.manual || !Array.isArray(parsed.manual.depends_on) || !Array.isArray(parsed.manual.supersedes) || !Array.isArray(parsed.manual.related_to)) process.exit(4);
if (!parsed.derived || !Array.isArray(parsed.derived.trigger_phrases) || !Array.isArray(parsed.derived.key_files) || !Array.isArray(parsed.derived.source_docs)) process.exit(5);
process.exit(0);
EOF
    then
        RULE_STATUS="fail"
        RULE_MESSAGE="graph-metadata.json is present but malformed"
        RULE_DETAILS=("Expected schema_version, packet identity, manual arrays, and derived trigger/key/source arrays")
        RULE_REMEDIATION="Refresh graph-metadata.json through the canonical save or backfill flow so the file matches the v1 contract."
        return 0
    fi

    RULE_STATUS="pass"
    RULE_MESSAGE="graph-metadata.json is present and passes the rollout shape check"
}
