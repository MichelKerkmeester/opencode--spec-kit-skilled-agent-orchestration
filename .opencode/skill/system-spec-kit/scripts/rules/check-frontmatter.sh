#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-FRONTMATTER
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: FRONTMATTER_VALID
# Severity: error
# Description: Validates YAML frontmatter structure and required semantic values

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"
    local rule_dir
    rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local allowlist_file="${SPECKIT_FRONTMATTER_ALLOWLIST:-$rule_dir/../lib/frontmatter-grandfather-allowlist.json}"
    
    RULE_NAME="FRONTMATTER_VALID"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    local issues=()
    local grandfathered=()

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    local files_to_check=("spec.md" "plan.md" "tasks.md" "checklist.md" "decision-record.md" "implementation-summary.md")
    
    for file in "${files_to_check[@]-}"; do
        local filepath="$folder/$file"
        [[ ! -f "$filepath" ]] && continue
        
        local first_line
        first_line=$(head -n 1 "$filepath" 2>/dev/null)
        
        if [[ "$first_line" == "---" ]]; then
            local frontmatter_end
            frontmatter_end=$(awk 'NR>1 && /^---$/{print NR; exit}' "$filepath")
            
            if [[ -z "$frontmatter_end" ]]; then
                issues+=("$file: Unclosed YAML frontmatter (missing closing ---)")
            else
                local semantic_issues=()
                while IFS= read -r issue; do
                    [[ -z "$issue" ]] && continue
                    semantic_issues+=("$issue")
                done < <(node -e '
const fs = require("fs");
const file = process.argv[1];
const text = fs.readFileSync(file, "utf8");
const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
if (!match) process.exit(0);
const lines = match[1].split(/\r?\n/);
const requiredScalarFields = ["title", "description", "importance_tier", "contextType"];

function clean(value) {
  let trimmed = String(value ?? "").trim();
  const singleQuote = String.fromCharCode(39);
  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\""))
    || (trimmed.startsWith(singleQuote) && trimmed.endsWith(singleQuote))
  ) {
    trimmed = trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function scalarValue(field) {
  const prefix = `${field}:`;
  const line = lines.find((entry) => entry.startsWith(prefix));
  if (!line) return null;
  return clean(line.slice(prefix.length));
}

function triggerPhrasesHasValue() {
  const index = lines.findIndex((entry) => entry.startsWith("trigger_phrases:"));
  if (index < 0) return false;
  const line = lines[index];
  const inline = clean(line.slice("trigger_phrases:".length));
  if (inline && inline !== "[]" && inline.toLowerCase() !== "null") return true;

  for (let i = index + 1; i < lines.length; i += 1) {
    const next = lines[i];
    if (/^[A-Za-z_][A-Za-z0-9_]*:/.test(next)) break;
    const item = next.match(/^\s*-\s*(.*)$/);
    if (item && clean(item[1]) && clean(item[1]).toLowerCase() !== "null") return true;
  }
  return false;
}

for (const field of requiredScalarFields) {
  const value = scalarValue(field);
  if (value === null || value === "" || value === "[]" || value.toLowerCase() === "null") {
    process.stdout.write(`Empty required frontmatter field: ${field}\n`);
  }
}
if (!triggerPhrasesHasValue()) {
  process.stdout.write("Empty required frontmatter field: trigger_phrases\n");
}
' "$filepath")

                if [[ ${#semantic_issues[@]} -gt 0 ]]; then
                    if is_frontmatter_grandfathered "$filepath" "$allowlist_file"; then
                        grandfathered+=("$file: ${#semantic_issues[@]} empty frontmatter field issue(s) grandfathered until cutoff")
                    else
                        for issue in "${semantic_issues[@]}"; do
                            issues+=("$file: $issue")
                        done
                    fi
                fi
            fi
        fi
        
        # Check for SPECKIT_TEMPLATE_SOURCE marker (skip test fixtures)
        local skip_template_check=false
        [[ "$folder" == *"test-fixtures"* ]] && skip_template_check=true
        [[ "${SKIP_TEMPLATE_CHECK:-0}" == "1" ]] && skip_template_check=true
        
        if [[ "$skip_template_check" == "false" ]]; then
            if ! grep -q "SPECKIT_TEMPLATE_SOURCE" "$filepath" 2>/dev/null; then
                issues+=("$file: Missing SPECKIT_TEMPLATE_SOURCE marker (may not be from template)")
            fi
        fi
    done

# ───────────────────────────────────────────────────────────────
# 3. RESULTS
# ───────────────────────────────────────────────────────────────

    if [[ ${#issues[@]} -gt 0 ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="Found ${#issues[@]} frontmatter issue(s)"
        RULE_DETAILS=("${issues[@]}")
        RULE_REMEDIATION="Ensure markdown frontmatter has non-empty title, description, trigger_phrases, importance_tier, and contextType values."
    else
        RULE_MESSAGE="Frontmatter validation passed"
        if [[ ${#grandfathered[@]} -gt 0 ]]; then
            RULE_DETAILS=("${grandfathered[@]}")
        fi
    fi
}

is_frontmatter_grandfathered() {
    local filepath="$1"
    local allowlist_file="$2"

    [[ ! -f "$allowlist_file" ]] && return 1

    node -e '
const fs = require("fs");
const path = require("path");
const [file, allowlistPath] = process.argv.slice(1);
const config = JSON.parse(fs.readFileSync(allowlistPath, "utf8"));
const cutoff = Date.parse(config.cutoff || "");
if (!Number.isFinite(cutoff) || Date.now() >= cutoff) process.exit(1);

const cwd = process.cwd();
const candidates = new Set([
  file,
  path.resolve(file),
  path.relative(cwd, path.resolve(file)),
].map((entry) => entry.replace(/\\/g, "/")));

const allowed = (config.paths || []).map((entry) => String(entry).replace(/\\/g, "/"));
process.exit(allowed.some((entry) => candidates.has(entry)) ? 0 : 1);
' "$filepath" "$allowlist_file"
}

# Exit codes:
#   0 - Success
