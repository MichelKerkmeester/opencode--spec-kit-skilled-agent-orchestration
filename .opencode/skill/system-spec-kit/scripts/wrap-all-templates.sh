#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Wrap All Templates
# ───────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_BASE="${SCRIPT_DIR}/../templates"

echo "ANCHOR Template Wrapper"
echo "======================"
echo ""

total_files=0
total_success=0
total_anchors_added=0
total_errors=0

# Process each level folder and template file
for level in level_1 level_2 level_3 "level_3+"; do
  echo "## Processing ${level}/"
  
  for template in spec.md plan.md tasks.md checklist.md decision-record.md implementation-summary.md; do
    filepath="${TEMPLATE_BASE}/${level}/${template}"
    total_files=$((total_files + 1))
    
    if [ ! -f "${filepath}" ]; then
      echo "  - ${template}: File not found (skipped)" >&2
      continue
    fi
    
    # Create a temporary Node.js script to wrap this file
    node -e "
      const fs = require('fs');
      const { wrapSectionsWithAnchors } = require('${SCRIPT_DIR}/dist/lib/anchor-generator.js');
      
      try {
        const content = fs.readFileSync('${filepath}', 'utf-8');
        const result = wrapSectionsWithAnchors(content);
        
        if (result.anchorsAdded > 0) {
          fs.writeFileSync('${filepath}', result.content, 'utf-8');
          console.log('SUCCESS|' + result.anchorsAdded + '|' + result.anchorsPreserved);
        } else {
          console.log('NOCHANGE|0|' + result.anchorsPreserved);
        }
      } catch (error) {
        console.error('ERROR|' + error.message);
        process.exit(1);
      }
    " 2>&1 | while IFS='|' read -r status added preserved; do
      case "${status}" in
        SUCCESS)
          echo "  ✓ ${template}: +${added} anchors (${preserved} preserved)"
          total_success=$((total_success + 1))
          total_anchors_added=$((total_anchors_added + added))
          ;;
        NOCHANGE)
          echo "  - ${template}: No changes needed (${preserved} existing)"
          total_success=$((total_success + 1))
          ;;
        ERROR)
          echo "  ✗ ${template}: ${added}"
          total_errors=$((total_errors + 1))
          ;;
      esac
    done
  done
  echo ""
done

echo "## Summary"
echo "Total files processed: ${total_files}"
echo "Success: ${total_success}"
echo "Failed: ${total_errors}" >&2
echo "Total anchors added: ${total_anchors_added}"

if [ "${total_errors}" -gt 0 ]; then
  exit 1
fi

exit 0

# Exit codes:
#   0 - Success
#   1 - Failed: ${total_errors}
