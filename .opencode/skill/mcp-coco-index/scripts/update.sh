#!/usr/bin/env bash
# Upstream sync helper for the cocoindex-code soft-fork.
#
# This script does NOT auto-overwrite vendored source. It downloads the latest
# upstream cocoindex-code release into a temp dir, diffs against our vendored
# copy, and surfaces conflicts for manual resolution. The 009 patch summary is
# printed so the operator can re-apply patches on top of upstream changes.
#
# Workflow:
#   1. Run this script.
#   2. Review the diff output. If clean (no conflicts on patched files),
#      apply via `cp` from $TEMP_UPSTREAM/$file to mcp_server/cocoindex_code/$file.
#   3. Re-apply 009 patches (REQ-001..006) on the updated files.
#   4. Bump version in _version.py and pyproject.toml.
#   5. Add a changelog/CHANGELOG.md entry under the new version.
#   6. Update NOTICE with the new sync date.
#   7. Reinstall via install.sh and reindex via `ccc reset && ccc index`.
#   8. Verify acceptance probes (see plan §Verification).

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
VENDORED_DIR="$SKILL_DIR/mcp_server/cocoindex_code"
TEMP_UPSTREAM=$(mktemp -d -t cocoindex-upstream-XXXXX)
trap 'rm -rf "$TEMP_UPSTREAM"' EXIT

echo "=== CocoIndex upstream-sync helper ==="
echo "Vendored: $VENDORED_DIR"
echo "Temp upstream: $TEMP_UPSTREAM"
echo ""

# Discover current pinned versions
CURRENT_FORK_VERSION=$(grep -E "^__version__|^version" "$VENDORED_DIR/_version.py" | head -1 | sed 's/.*= *//;s/["'"'"']//g' || echo "unknown")
echo "Current fork version: $CURRENT_FORK_VERSION"

# Fetch latest upstream
LATEST_VERSION="${1:-}"
if [[ -z "$LATEST_VERSION" ]]; then
  echo "Tip: pass a version arg to pin (e.g. ./update.sh 0.2.4). Resolving 'latest' from PyPI..."
  LATEST_VERSION=$(pip index versions cocoindex-code 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || echo "")
  if [[ -z "$LATEST_VERSION" ]]; then
    echo "ERROR: could not resolve latest cocoindex-code version. Pass it explicitly: ./update.sh <version>" >&2
    exit 1
  fi
fi
echo "Target upstream version: $LATEST_VERSION"
echo ""

# Download upstream tarball + extract
echo "=== Fetching upstream cocoindex-code==$LATEST_VERSION ==="
pip download --no-deps --no-binary :all: --dest "$TEMP_UPSTREAM" "cocoindex-code==$LATEST_VERSION" >/dev/null
TARBALL=$(ls "$TEMP_UPSTREAM"/cocoindex_code-*.tar.gz 2>/dev/null | head -1)
if [[ -z "$TARBALL" ]]; then
  TARBALL=$(ls "$TEMP_UPSTREAM"/cocoindex-code-*.tar.gz 2>/dev/null | head -1)
fi
if [[ -z "$TARBALL" ]]; then
  echo "ERROR: tarball not found in $TEMP_UPSTREAM" >&2
  exit 1
fi
tar -xzf "$TARBALL" -C "$TEMP_UPSTREAM"
UPSTREAM_SRC=$(find "$TEMP_UPSTREAM" -type d -name "cocoindex_code" | grep -v '\.dist-info' | head -1)
if [[ -z "$UPSTREAM_SRC" ]]; then
  echo "ERROR: cocoindex_code source dir not found in extracted tarball" >&2
  exit 1
fi
echo "Upstream source: $UPSTREAM_SRC"
echo ""

# Diff every file
echo "=== Diff: vendored vs upstream $LATEST_VERSION ==="
PATCHED_FILES=("indexer.py" "query.py" "schema.py")
echo ""
for f in $(ls "$UPSTREAM_SRC"/*.py); do
  base=$(basename "$f")
  if [[ -f "$VENDORED_DIR/$base" ]]; then
    if diff -q "$VENDORED_DIR/$base" "$f" >/dev/null 2>&1; then
      echo "  unchanged: $base"
    else
      is_patched="false"
      for p in "${PATCHED_FILES[@]}"; do
        [[ "$base" == "$p" ]] && is_patched="true"
      done
      if [[ "$is_patched" == "true" ]]; then
        echo "  ⚠ PATCHED FILE WITH UPSTREAM CHANGES: $base — manual merge required"
      else
        echo "  ⓘ updated upstream: $base"
      fi
    fi
  else
    echo "  + new upstream file: $base (would be added)"
  fi
done
echo ""

# Print 009 patch summary
echo "=== 009 patches that must be re-applied if you accept the diff ==="
cat <<'PATCHES'
REQ-001 — settings.yml: exclude .gemini/.codex/.claude/.agents/specs/** mirror roots
REQ-002 — indexer.py: add source_realpath (via os.path.realpath) + content_hash (SHA256 of normalized content) per chunk
REQ-003 — query.py: over-fetch limit*4, dedup by (source_realpath, start_line, end_line) with content_hash fallback, expose dedupedAliases + uniqueResultCount
REQ-004 — indexer.py + schema.py: path_class taxonomy (implementation/tests/docs/spec_research/generated/vendor)
REQ-005 — query.py: bounded reranking +0.05 implementation, -0.05 docs/spec_research for implementation-intent queries
REQ-006 — query.py: rankingSignals telemetry list per result row
PATCHES
echo ""
echo "=== Next steps ==="
echo "1. Review the diff output above. For non-patched files, run:"
echo "     cp $UPSTREAM_SRC/<file>.py $VENDORED_DIR/<file>.py"
echo "2. For patched files (indexer.py, query.py, schema.py), manually merge upstream changes preserving 009 patches"
echo "3. Bump version in _version.py + pyproject.toml (e.g. $LATEST_VERSION+spec-kit-fork.0.1.0)"
echo "4. Update NOTICE + CHANGELOG.md with the new sync entry"
echo "5. Reinstall: bash $SKILL_DIR/scripts/install.sh"
echo "6. Reindex: $SKILL_DIR/mcp_server/.venv/bin/ccc reset && $SKILL_DIR/mcp_server/.venv/bin/ccc index"
echo "7. Verify: $SKILL_DIR/mcp_server/.venv/bin/ccc --version"
echo ""
echo "Done. Temp dir cleaned up on exit."
