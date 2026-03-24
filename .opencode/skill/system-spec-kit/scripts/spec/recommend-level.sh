#!/usr/bin/env bash
set -euo pipefail
# ───────────────────────────────────────────────────────────────
# SPEC-KIT: RECOMMEND LEVEL
# ───────────────────────────────────────────────────────────────
#
# SpecKit Level Recommendation Algorithm
#
# PURPOSE:
#   Automated level recommendation that replaces soft LOC guidance with
#   Deterministic scoring. Analyzes task complexity factors and recommends
#   The appropriate SpecKit level (0-3).
#
# USAGE:
#   Recommend-level.sh [OPTIONS]
#
# OPTIONS:
#   --loc <number>       Lines of code estimate
#   --files <number>     Number of files to modify
#   --auth               Task involves authentication/authorization changes
#   --api                Task involves API changes
#   --db                 Task involves database changes
#   --architectural      Task involves architectural changes
#   --recommend-phases   Include phase scoring in output (default behavior)
#   --no-recommend-phases  Disable phase scoring output
#   --phase-threshold <N> Override phase score threshold (default 25)
#   --json, -j           Output in JSON format
#   --help, -h           Show this help message
#
# EXAMPLES:
#   Recommend-level.sh --loc 50 --files 2
#   Recommend-level.sh --loc 200 --files 5 --api --db
#   Recommend-level.sh --loc 500 --files 15 --auth --api --db --architectural
#   Recommend-level.sh --loc 100 --files 3 --json
#   Recommend-level.sh --loc 1000 --files 20 --architectural --api --db --recommend-phases
#
# SCORING ALGORITHM:
#   LOC Factor:        35% weight (0-35 points)
#   File Count:        20% weight (0-20 points)
#   Risk Factors:      25% weight (auth +10, api +8, db +7)
#   Complexity:        20% weight (architectural +20)
#
# LEVEL MAPPING:
#   <25 points  -> Level 0 (Quick)
#   25-44       -> Level 1 (Baseline)
#   45-69       -> Level 2 (Verification)
#   70+         -> Level 3 (Full)
#
# PHASE SCORING (separate from level, enabled by default):
#   Architectural flag:     +15 points
#   Files > 15:             +10 points
#   LOC > 800:              +10 points
#   Risk flags >= 2:        +10 points
#   Extreme scale bonus:    +5 points (Files > 30 OR LOC > 2000)
#   Max phase score: 50
#
# PHASE RECOMMENDATION:
#   Score >= 25 AND Level >= 3 -> phases recommended
#   Score 25-34: 2 phases suggested
#   Score 35-44: 3 phases suggested
#   Score 45+:   4+ phases suggested
#

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

# Weight configuration (percentages)
readonly WEIGHT_LOC=35
readonly WEIGHT_FILES=20
readonly WEIGHT_RISK=25
readonly WEIGHT_COMPLEXITY=20

# Risk factor points (within WEIGHT_RISK budget)
readonly POINTS_AUTH=10
readonly POINTS_API=8
readonly POINTS_DB=7

# Complexity points (within WEIGHT_COMPLEXITY budget)
readonly POINTS_ARCHITECTURAL=20

# Phase signal scoring (separate from level scoring)
# Max phase score = 50 (10+10+10+10+10)
readonly PHASE_POINTS_ARCHITECTURAL=10
readonly PHASE_POINTS_MANY_FILES=10      # Files > 15
readonly PHASE_POINTS_LARGE_LOC=10       # LOC > 800
readonly PHASE_POINTS_MULTI_RISK=10      # Risk flags >= 2
readonly PHASE_POINTS_EXTREME_SCALE=10   # Files > 30 OR LOC > 2000 (concrete thresholds for "exceeds any dimension by 2x+")
readonly PHASE_MAX_SCORE=50
readonly PHASE_DEFAULT_THRESHOLD=25

# LOC thresholds for scoring
readonly LOC_THRESHOLD_LOW=50
readonly LOC_THRESHOLD_MED=150
readonly LOC_THRESHOLD_HIGH=400
readonly LOC_THRESHOLD_MAX=1000

# File count thresholds
readonly FILES_THRESHOLD_LOW=3
readonly FILES_THRESHOLD_MED=8
readonly FILES_THRESHOLD_HIGH=15
readonly FILES_THRESHOLD_MAX=30

# Level thresholds
readonly LEVEL_0_MAX=24
readonly LEVEL_1_MAX=44
readonly LEVEL_2_MAX=69
# 70+ = Level 3

# ───────────────────────────────────────────────────────────────
# 2. GLOBALS
# ───────────────────────────────────────────────────────────────

LOC=0
FILES=0
HAS_AUTH=false
HAS_API=false
HAS_DB=false
HAS_ARCHITECTURAL=false
JSON_OUTPUT=false

# Phase recommendation flags
RECOMMEND_PHASES=true
PHASE_THRESHOLD=$PHASE_DEFAULT_THRESHOLD

# Calculated scores
SCORE_LOC=0
SCORE_FILES=0
SCORE_RISK=0
SCORE_COMPLEXITY=0
TOTAL_SCORE=0
RECOMMENDED_LEVEL=0
LEVEL_NAME=""
CONFIDENCE=0

# Phase scoring results
PHASE_SCORE=0
PHASE_RECOMMENDED=false
PHASE_REASON=""
SUGGESTED_PHASE_COUNT=0

# ───────────────────────────────────────────────────────────────
# 3. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

# _json_escape(string)
# Escape characters that would break JSON string values
_json_escape() {
  local s="$1"
  s="${s//\\/\\\\}"
  s="${s//\"/\\\"}"
  s="${s//$'\n'/\\n}"
  s="${s//$'\r'/\\r}"
  s="${s//$'\t'/\\t}"
  printf '%s' "$s"
}

# Show_help()
# Display usage information
show_help() {
  cat << 'EOF'
SpecKit Level Recommendation Algorithm

Analyzes task complexity factors and recommends the appropriate SpecKit level.

USAGE:
  recommend-level.sh [OPTIONS]

OPTIONS:
  --loc <number>       Lines of code estimate (required)
  --files <number>     Number of files to modify (required)
  --auth               Task involves authentication/authorization changes
  --api                Task involves API changes
  --db                 Task involves database changes
  --architectural      Task involves architectural changes
  --recommend-phases   Include phase scoring in output (default)
  --no-recommend-phases Disable phase scoring output
  --phase-threshold <N> Override phase score threshold (default 25)
  --json, -j           Output in JSON format
  --help, -h           Show this help message

EXAMPLES:
  # Simple task
  recommend-level.sh --loc 50 --files 2

  # Medium complexity with API
  recommend-level.sh --loc 200 --files 5 --api

  # Complex full-stack feature
  recommend-level.sh --loc 500 --files 15 --auth --api --db --architectural

  # With phase recommendation (default behavior)
  recommend-level.sh --loc 1000 --files 20 --architectural --api --db --recommend-phases

  # Disable phase recommendation fields
  recommend-level.sh --loc 1000 --files 20 --architectural --no-recommend-phases

  # JSON output for scripting
  recommend-level.sh --loc 100 --files 3 --json

LEVELS:
  Level 0 (Quick):        <25 points  - Trivial changes, no formal spec needed
  Level 1 (Baseline):     25-44       - Standard tasks, basic documentation
  Level 2 (Verification): 45-69       - Complex tasks, full verification needed
  Level 3 (Full):         70+         - Critical/architectural, comprehensive docs

EOF
  exit 0
}

# Calculate_loc_score()
# Calculate points for LOC factor (0-35 points)
# Uses linear interpolation between thresholds
calculate_loc_score() {
  local loc=$1
  local score=0

  if [[ "$loc" -le "$LOC_THRESHOLD_LOW" ]]; then
    # 0-50 LOC: 0-8 points (linear)
    score=$((loc * 8 / LOC_THRESHOLD_LOW))
  elif [[ "$loc" -le "$LOC_THRESHOLD_MED" ]]; then
    # 51-150 LOC: 8-18 points
    local range=$((LOC_THRESHOLD_MED - LOC_THRESHOLD_LOW))
    local offset=$((loc - LOC_THRESHOLD_LOW))
    score=$((8 + (offset * 10 / range)))
  elif [[ "$loc" -le "$LOC_THRESHOLD_HIGH" ]]; then
    # 151-400 LOC: 18-28 points
    local range=$((LOC_THRESHOLD_HIGH - LOC_THRESHOLD_MED))
    local offset=$((loc - LOC_THRESHOLD_MED))
    score=$((18 + (offset * 10 / range)))
  elif [[ "$loc" -le "$LOC_THRESHOLD_MAX" ]]; then
    # 401-1000 LOC: 28-35 points
    local range=$((LOC_THRESHOLD_MAX - LOC_THRESHOLD_HIGH))
    local offset=$((loc - LOC_THRESHOLD_HIGH))
    score=$((28 + (offset * 7 / range)))
  else
    # >1000 LOC: max points
    score=$WEIGHT_LOC
  fi

  # Ensure score doesn't exceed weight
  if [[ "$score" -gt "$WEIGHT_LOC" ]]; then
    score=$WEIGHT_LOC
  fi

  echo "$score"
}

# Calculate_files_score()
# Calculate points for file count factor (0-20 points)
calculate_files_score() {
  local files=$1
  local score=0

  if [[ "$files" -le "$FILES_THRESHOLD_LOW" ]]; then
    # 1-3 files: 0-5 points
    score=$((files * 5 / FILES_THRESHOLD_LOW))
  elif [[ "$files" -le "$FILES_THRESHOLD_MED" ]]; then
    # 4-8 files: 5-10 points
    local range=$((FILES_THRESHOLD_MED - FILES_THRESHOLD_LOW))
    local offset=$((files - FILES_THRESHOLD_LOW))
    score=$((5 + (offset * 5 / range)))
  elif [[ "$files" -le "$FILES_THRESHOLD_HIGH" ]]; then
    # 9-15 files: 10-16 points
    local range=$((FILES_THRESHOLD_HIGH - FILES_THRESHOLD_MED))
    local offset=$((files - FILES_THRESHOLD_MED))
    score=$((10 + (offset * 6 / range)))
  elif [[ "$files" -le "$FILES_THRESHOLD_MAX" ]]; then
    # 16-30 files: 16-20 points
    local range=$((FILES_THRESHOLD_MAX - FILES_THRESHOLD_HIGH))
    local offset=$((files - FILES_THRESHOLD_HIGH))
    score=$((16 + (offset * 4 / range)))
  else
    # >30 files: max points
    score=$WEIGHT_FILES
  fi

  # Ensure score doesn't exceed weight
  if [[ "$score" -gt "$WEIGHT_FILES" ]]; then
    score=$WEIGHT_FILES
  fi

  echo "$score"
}

# Calculate_risk_score()
# Calculate points for risk factors (0-25 points)
calculate_risk_score() {
  local score=0

  if [[ "$HAS_AUTH" = true ]]; then
    score=$((score + POINTS_AUTH))
  fi

  if [[ "$HAS_API" = true ]]; then
    score=$((score + POINTS_API))
  fi

  if [[ "$HAS_DB" = true ]]; then
    score=$((score + POINTS_DB))
  fi

  # Cap at WEIGHT_RISK
  if [[ "$score" -gt "$WEIGHT_RISK" ]]; then
    score=$WEIGHT_RISK
  fi

  echo "$score"
}

# Calculate_complexity_score()
# Calculate points for complexity factors (0-20 points)
calculate_complexity_score() {
  local score=0

  if [[ "$HAS_ARCHITECTURAL" = true ]]; then
    score=$((score + POINTS_ARCHITECTURAL))
  fi

  # Cap at WEIGHT_COMPLEXITY
  if [[ "$score" -gt "$WEIGHT_COMPLEXITY" ]]; then
    score=$WEIGHT_COMPLEXITY
  fi

  echo "$score"
}

# Determine_level()
# Map total score to recommended level
determine_level() {
  local score=$1

  if [[ "$score" -le "$LEVEL_0_MAX" ]]; then
    RECOMMENDED_LEVEL=0
    LEVEL_NAME="Quick"
  elif [[ "$score" -le "$LEVEL_1_MAX" ]]; then
    RECOMMENDED_LEVEL=1
    LEVEL_NAME="Baseline"
  elif [[ "$score" -le "$LEVEL_2_MAX" ]]; then
    RECOMMENDED_LEVEL=2
    LEVEL_NAME="Verification"
  else
    RECOMMENDED_LEVEL=3
    LEVEL_NAME="Full"
  fi
}

# Determine_phasing()
# Calculate phase recommendation score and suggested phase count.
# Phase scoring is SEPARATE from level scoring — uses its own 5 signal
# Dimensions (max 50 points). Phase is recommended when:
#   - Phase score >= PHASE_THRESHOLD (default 25)
#   - AND RECOMMENDED_LEVEL >= 3
# Must be called AFTER determine_level() since it references RECOMMENDED_LEVEL.
determine_phasing() {
  PHASE_SCORE=0
  PHASE_REASON=""
  PHASE_RECOMMENDED=false
  SUGGESTED_PHASE_COUNT=0

  local reasons=""
  local risk_flag_count=0

  # Signal 1: Architectural flag (+10)
  if [[ "$HAS_ARCHITECTURAL" = true ]]; then
    PHASE_SCORE=$((PHASE_SCORE + PHASE_POINTS_ARCHITECTURAL))
    reasons="Architectural change"
  fi

  # Signal 2: Many files (+10) — Files > 15
  if [[ "$FILES" -gt 15 ]]; then
    PHASE_SCORE=$((PHASE_SCORE + PHASE_POINTS_MANY_FILES))
    if [[ -n "$reasons" ]]; then
      reasons="${reasons} + ${FILES} files"
    else
      reasons="${FILES} files"
    fi
  fi

  # Signal 3: Large LOC (+10) — LOC > 800
  if [[ "$LOC" -gt 800 ]]; then
    PHASE_SCORE=$((PHASE_SCORE + PHASE_POINTS_LARGE_LOC))
    if [[ -n "$reasons" ]]; then
      reasons="${reasons} + ${LOC} LOC"
    else
      reasons="${LOC} LOC"
    fi
  fi

  # Signal 4: Multi-domain risk (+10) — 2+ risk flags
  if [[ "$HAS_AUTH" = true ]]; then risk_flag_count=$((risk_flag_count + 1)); fi
  if [[ "$HAS_API" = true ]]; then risk_flag_count=$((risk_flag_count + 1)); fi
  if [[ "$HAS_DB" = true ]]; then risk_flag_count=$((risk_flag_count + 1)); fi

  if [[ "$risk_flag_count" -ge 2 ]]; then
    PHASE_SCORE=$((PHASE_SCORE + PHASE_POINTS_MULTI_RISK))
    # Build risk factor description
    local risk_names=""
    if [[ "$HAS_AUTH" = true ]]; then risk_names="Auth"; fi
    if [[ "$HAS_API" = true ]]; then
      if [[ -n "$risk_names" ]]; then risk_names="${risk_names} + API"; else risk_names="API"; fi
    fi
    if [[ "$HAS_DB" = true ]]; then
      if [[ -n "$risk_names" ]]; then risk_names="${risk_names} + DB"; else risk_names="DB"; fi
    fi
    if [[ -n "$reasons" ]]; then
      reasons="${reasons} + ${risk_names} risk factors"
    else
      reasons="${risk_names} risk factors"
    fi
  fi

  # Signal 5: Extreme scale bonus (+10) — Files > 30 OR LOC > 2000 (concrete thresholds for "exceeds any dimension by 2x+")
  if [[ "$FILES" -gt 30 ]] || [[ "$LOC" -gt 2000 ]]; then
    PHASE_SCORE=$((PHASE_SCORE + PHASE_POINTS_EXTREME_SCALE))
    if [[ -n "$reasons" ]]; then
      reasons="${reasons} + extreme scale"
    else
      reasons="Extreme scale"
    fi
  fi

  # Cap at max score
  if [[ "$PHASE_SCORE" -gt "$PHASE_MAX_SCORE" ]]; then
    PHASE_SCORE=$PHASE_MAX_SCORE
  fi

  PHASE_REASON="$reasons"

  # Phase recommendation requires BOTH score threshold AND level >= 3
  if [[ "$PHASE_SCORE" -ge "$PHASE_THRESHOLD" ]] && [[ "$RECOMMENDED_LEVEL" -ge 3 ]]; then
    PHASE_RECOMMENDED=true

    # Determine suggested phase count based on score ranges
    if [[ "$PHASE_SCORE" -ge 45 ]]; then
      SUGGESTED_PHASE_COUNT=4
    elif [[ "$PHASE_SCORE" -ge 35 ]]; then
      SUGGESTED_PHASE_COUNT=3
    else
      # Score 25-34
      SUGGESTED_PHASE_COUNT=2
    fi
  fi
}

# Calculate_confidence()
# Calculate confidence percentage based on input completeness
calculate_confidence() {
  local base_confidence=60
  local bonus=0

  # More inputs = higher confidence
  if [[ "$LOC" -gt 0 ]]; then
    bonus=$((bonus + 15))
  fi

  if [[ "$FILES" -gt 0 ]]; then
    bonus=$((bonus + 15))
  fi

  # Risk factors add confidence when specified
  local risk_factors=0
  if [[ "$HAS_AUTH" = true ]]; then risk_factors=$((risk_factors + 1)); fi
  if [[ "$HAS_API" = true ]]; then risk_factors=$((risk_factors + 1)); fi
  if [[ "$HAS_DB" = true ]]; then risk_factors=$((risk_factors + 1)); fi
  if [[ "$HAS_ARCHITECTURAL" = true ]]; then risk_factors=$((risk_factors + 1)); fi

  # Each risk factor adds some confidence (shows thoroughness)
  bonus=$((bonus + risk_factors * 2))

  # If score is near threshold boundaries, reduce confidence
  local distance_to_boundary=100
  local boundaries=("$LEVEL_0_MAX" "$LEVEL_1_MAX" "$LEVEL_2_MAX")
  for boundary in "${boundaries[@]}"; do
    local diff=$((TOTAL_SCORE - boundary))
    if [[ "$diff" -lt 0 ]]; then diff=$((-diff)); fi
    if [[ "$diff" -lt "$distance_to_boundary" ]]; then
      distance_to_boundary=$diff
    fi
  done

  # Reduce confidence if very close to a boundary (within 5 points)
  if [[ "$distance_to_boundary" -le 5 ]]; then
    bonus=$((bonus - 10))
  fi

  CONFIDENCE=$((base_confidence + bonus))

  # Cap at 95% (never 100% certain)
  if [[ "$CONFIDENCE" -gt 95 ]]; then
    CONFIDENCE=95
  fi

  # Minimum 50%
  if [[ "$CONFIDENCE" -lt 50 ]]; then
    CONFIDENCE=50
  fi
}

# ───────────────────────────────────────────────────────────────
# 4. OUTPUT FUNCTIONS
# ───────────────────────────────────────────────────────────────

# Output_text()
# Output results in human-readable text format
output_text() {
  echo ""
  echo "Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})"
  echo "Score: ${TOTAL_SCORE}/100 | Confidence: ${CONFIDENCE}%"
  echo ""
  echo "Breakdown:"
  echo "- LOC (${LOC}): +${SCORE_LOC} points"
  echo "- Files (${FILES}): +${SCORE_FILES} points"
  echo -n "- API changes: "
  if [[ "$HAS_API" = true ]]; then
    echo "+${POINTS_API} points"
  else
    echo "+0 points"
  fi
  echo -n "- Auth changes: "
  if [[ "$HAS_AUTH" = true ]]; then
    echo "+${POINTS_AUTH} points"
  else
    echo "+0 points"
  fi
  echo -n "- DB changes: "
  if [[ "$HAS_DB" = true ]]; then
    echo "+${POINTS_DB} points"
  else
    echo "+0 points"
  fi
  echo -n "- Architectural: "
  if [[ "$HAS_ARCHITECTURAL" = true ]]; then
    echo "+${POINTS_ARCHITECTURAL} points"
  else
    echo "+0 points"
  fi
  echo ""

  # Phase recommendation section (default on; can be disabled with --no-recommend-phases)
  if [[ "$RECOMMEND_PHASES" = true ]]; then
    echo "Phase Recommendation:"
    echo "- Phase Score: ${PHASE_SCORE}/${PHASE_MAX_SCORE} (threshold: ${PHASE_THRESHOLD})"
    if [[ "$PHASE_RECOMMENDED" = true ]]; then
      echo "- Recommended: YES"
      echo "- Suggested Phases: ${SUGGESTED_PHASE_COUNT}"
      echo "- Reason: ${PHASE_REASON}"
    else
      echo "- Recommended: NO"
      if [[ -n "$PHASE_REASON" ]]; then
        echo "- Factors: ${PHASE_REASON}"
      fi
    fi
    echo ""
  fi
}

# Output_json()
# Output results in JSON format
output_json() {
  local auth_points=0
  local api_points=0
  local db_points=0
  local arch_points=0

  if [[ "$HAS_AUTH" = true ]]; then auth_points=$POINTS_AUTH; fi
  if [[ "$HAS_API" = true ]]; then api_points=$POINTS_API; fi
  if [[ "$HAS_DB" = true ]]; then db_points=$POINTS_DB; fi
  if [[ "$HAS_ARCHITECTURAL" = true ]]; then arch_points=$POINTS_ARCHITECTURAL; fi

  # Build JSON output — phase fields conditionally included
  if [[ "$RECOMMEND_PHASES" = true ]]; then
    cat << EOF
{
  "recommended_level": ${RECOMMENDED_LEVEL},
  "level_name": "${LEVEL_NAME}",
  "total_score": ${TOTAL_SCORE},
  "max_score": 100,
  "confidence": ${CONFIDENCE},
  "recommended_phases": ${PHASE_RECOMMENDED},
  "phase_score": ${PHASE_SCORE},
  "phase_reason": "$(_json_escape "${PHASE_REASON}")",
  "suggested_phase_count": ${SUGGESTED_PHASE_COUNT},
  "inputs": {
    "loc": ${LOC},
    "files": ${FILES},
    "auth": ${HAS_AUTH},
    "api": ${HAS_API},
    "db": ${HAS_DB},
    "architectural": ${HAS_ARCHITECTURAL}
  },
  "breakdown": {
    "loc_score": ${SCORE_LOC},
    "files_score": ${SCORE_FILES},
    "risk_score": ${SCORE_RISK},
    "complexity_score": ${SCORE_COMPLEXITY},
    "details": {
      "auth_points": ${auth_points},
      "api_points": ${api_points},
      "db_points": ${db_points},
      "architectural_points": ${arch_points}
    }
  },
  "thresholds": {
    "level_0_max": ${LEVEL_0_MAX},
    "level_1_max": ${LEVEL_1_MAX},
    "level_2_max": ${LEVEL_2_MAX}
  }
}
EOF
  else
    cat << EOF
{
  "recommended_level": ${RECOMMENDED_LEVEL},
  "level_name": "${LEVEL_NAME}",
  "total_score": ${TOTAL_SCORE},
  "max_score": 100,
  "confidence": ${CONFIDENCE},
  "inputs": {
    "loc": ${LOC},
    "files": ${FILES},
    "auth": ${HAS_AUTH},
    "api": ${HAS_API},
    "db": ${HAS_DB},
    "architectural": ${HAS_ARCHITECTURAL}
  },
  "breakdown": {
    "loc_score": ${SCORE_LOC},
    "files_score": ${SCORE_FILES},
    "risk_score": ${SCORE_RISK},
    "complexity_score": ${SCORE_COMPLEXITY},
    "details": {
      "auth_points": ${auth_points},
      "api_points": ${api_points},
      "db_points": ${db_points},
      "architectural_points": ${arch_points}
    }
  },
  "thresholds": {
    "level_0_max": ${LEVEL_0_MAX},
    "level_1_max": ${LEVEL_1_MAX},
    "level_2_max": ${LEVEL_2_MAX}
  }
}
EOF
  fi
}

# ───────────────────────────────────────────────────────────────
# 5. MAIN SCRIPT
# ───────────────────────────────────────────────────────────────

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --loc)
      if [[ -z "${2:-}" ]] || [[ "$2" =~ ^-- ]]; then
        echo "ERROR: --loc requires a numeric value" >&2
        exit 1
      fi
      LOC="$2"
      shift 2
      ;;
    --files)
      if [[ -z "${2:-}" ]] || [[ "$2" =~ ^-- ]]; then
        echo "ERROR: --files requires a numeric value" >&2
        exit 1
      fi
      FILES="$2"
      shift 2
      ;;
    --auth)
      HAS_AUTH=true
      shift
      ;;
    --api)
      HAS_API=true
      shift
      ;;
    --db)
      HAS_DB=true
      shift
      ;;
    --architectural)
      HAS_ARCHITECTURAL=true
      shift
      ;;
    --recommend-phases)
      RECOMMEND_PHASES=true
      shift
      ;;
    --no-recommend-phases)
      RECOMMEND_PHASES=false
      shift
      ;;
    --phase-threshold)
      if [[ -z "${2:-}" ]] || [[ "$2" =~ ^-- ]]; then
        echo "ERROR: --phase-threshold requires a numeric value" >&2
        exit 1
      fi
      PHASE_THRESHOLD="$2"
      shift 2
      ;;
    --json|-j)
      JSON_OUTPUT=true
      shift
      ;;
    --help|-h)
      show_help
      ;;
    *)
      echo "ERROR: Unknown option: $1" >&2
      echo "Use --help for usage information" >&2
      exit 1
      ;;
  esac
done

# Validate numeric inputs first (before numeric comparison)
if ! [[ "$LOC" =~ ^[0-9]+$ ]]; then
  echo "ERROR: --loc must be a positive integer" >&2
  exit 1
fi

if ! [[ "$FILES" =~ ^[0-9]+$ ]]; then
  echo "ERROR: --files must be a positive integer" >&2
  exit 1
fi

if ! [[ "$PHASE_THRESHOLD" =~ ^[0-9]+$ ]]; then
  echo "ERROR: --phase-threshold must be a positive integer" >&2
  exit 1
fi

# Validate required inputs
if [[ "$LOC" -eq 0 ]] && [[ "$FILES" -eq 0 ]]; then
  echo "ERROR: At least --loc or --files must be provided" >&2
  echo "Use --help for usage information" >&2
  exit 1
fi

# ───────────────────────────────────────────────────────────────
# 6. CALCULATE SCORES
# ───────────────────────────────────────────────────────────────

SCORE_LOC=$(calculate_loc_score "$LOC")
SCORE_FILES=$(calculate_files_score "$FILES")
SCORE_RISK=$(calculate_risk_score)
SCORE_COMPLEXITY=$(calculate_complexity_score)

TOTAL_SCORE=$((SCORE_LOC + SCORE_FILES + SCORE_RISK + SCORE_COMPLEXITY))

# Determine recommended level
determine_level "$TOTAL_SCORE"

# Calculate confidence
calculate_confidence

# Calculate phase recommendation (default on; opt-out via --no-recommend-phases)
if [[ "$RECOMMEND_PHASES" = true ]]; then
  determine_phasing
fi

# ───────────────────────────────────────────────────────────────
# 7. OUTPUT RESULTS
# ───────────────────────────────────────────────────────────────

if [[ "$JSON_OUTPUT" = true ]]; then
  output_json
else
  output_text
fi

exit 0

# Exit codes:
#   0 - Success
#   1 - ERROR: --loc requires a numeric value
