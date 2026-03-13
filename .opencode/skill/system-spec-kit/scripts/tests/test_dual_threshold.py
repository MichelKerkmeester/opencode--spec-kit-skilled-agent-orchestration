#!/usr/bin/env python3
# ---------------------------------------------------------------
# COMPONENT: Dual-Threshold Validation Tests
# ---------------------------------------------------------------
"""
Dual-Threshold Validation Tests for skill_advisor.py

Tests the three core dual-threshold functions:
- calculate_uncertainty()
- passes_dual_threshold()
- calculate_confidence()

Run with: pytest test_dual_threshold.py -v
"""
import importlib.util
from pathlib import Path
import pytest

# Load skill_advisor.py directly from .opencode/skill/scripts.
SCRIPT_DIR = Path(__file__).resolve().parent
SKILL_DIR = SCRIPT_DIR.parent.parent.parent
ADVISOR_PATH = SKILL_DIR / 'scripts' / 'skill_advisor.py'

if not ADVISOR_PATH.exists():
    raise RuntimeError(f"skill_advisor.py not found at expected path: {ADVISOR_PATH}")

advisor_spec = importlib.util.spec_from_file_location('skill_advisor', ADVISOR_PATH)
if advisor_spec is None or advisor_spec.loader is None:
    raise RuntimeError(f"Failed to load module spec from: {ADVISOR_PATH}")

skill_advisor = importlib.util.module_from_spec(advisor_spec)
advisor_spec.loader.exec_module(skill_advisor)

calculate_uncertainty = skill_advisor.calculate_uncertainty
passes_dual_threshold = skill_advisor.passes_dual_threshold
calculate_confidence = skill_advisor.calculate_confidence


# =============================================================================
# TestCalculateUncertainty: ~25 tests
# =============================================================================
class TestCalculateUncertainty:
    """Tests for calculate_uncertainty() function.

    Formula components:
    - Base uncertainty by match count: 5+=0.15, 3+=0.25, 1+=0.40, 0=0.70
    - Intent penalty: +0.15 if no boost
    - Ambiguity penalty: min(ambiguous * 0.10, 0.30)
    """

    # -------------------------------------------------------------------------
    # Base uncertainty by match count (no intent boost, no ambiguity)
    # -------------------------------------------------------------------------
    def test_zero_matches_base_uncertainty(self) -> None:
        """0 matches should give base uncertainty of 0.70"""
        result = calculate_uncertainty(num_matches=0, has_intent_boost=True, num_ambiguous_matches=0)
        assert result == 0.70

    def test_one_match_base_uncertainty(self) -> None:
        """1 match should give base uncertainty of 0.40"""
        result = calculate_uncertainty(num_matches=1, has_intent_boost=True, num_ambiguous_matches=0)
        assert result == 0.40

    def test_two_matches_base_uncertainty(self) -> None:
        """2 matches should give base uncertainty of 0.40 (still in 1-2 range)"""
        result = calculate_uncertainty(num_matches=2, has_intent_boost=True, num_ambiguous_matches=0)
        assert result == 0.40

    def test_three_matches_base_uncertainty(self) -> None:
        """3 matches should give base uncertainty of 0.25"""
        result = calculate_uncertainty(num_matches=3, has_intent_boost=True, num_ambiguous_matches=0)
        assert result == 0.25

    def test_four_matches_base_uncertainty(self) -> None:
        """4 matches should give base uncertainty of 0.25 (still in 3-4 range)"""
        result = calculate_uncertainty(num_matches=4, has_intent_boost=True, num_ambiguous_matches=0)
        assert result == 0.25

    def test_five_matches_base_uncertainty(self) -> None:
        """5 matches should give base uncertainty of 0.15"""
        result = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=0)
        assert result == 0.15

    def test_ten_matches_base_uncertainty(self) -> None:
        """10 matches should give base uncertainty of 0.15 (same as 5+)"""
        result = calculate_uncertainty(num_matches=10, has_intent_boost=True, num_ambiguous_matches=0)
        assert result == 0.15

    def test_hundred_matches_base_uncertainty(self) -> None:
        """100 matches should give base uncertainty of 0.15 (capped)"""
        result = calculate_uncertainty(num_matches=100, has_intent_boost=True, num_ambiguous_matches=0)
        assert result == 0.15

    # -------------------------------------------------------------------------
    # Intent penalty tests (+0.15 when no intent boost)
    # -------------------------------------------------------------------------
    def test_intent_penalty_with_zero_matches(self) -> None:
        """No intent boost with 0 matches: 0.70 + 0.15 = 0.85"""
        result = calculate_uncertainty(num_matches=0, has_intent_boost=False, num_ambiguous_matches=0)
        assert result == 0.85

    def test_intent_penalty_with_one_match(self) -> None:
        """No intent boost with 1 match: 0.40 + 0.15 = 0.55"""
        result = calculate_uncertainty(num_matches=1, has_intent_boost=False, num_ambiguous_matches=0)
        assert result == 0.55

    def test_intent_penalty_with_three_matches(self) -> None:
        """No intent boost with 3 matches: 0.25 + 0.15 = 0.40"""
        result = calculate_uncertainty(num_matches=3, has_intent_boost=False, num_ambiguous_matches=0)
        assert result == 0.40

    def test_intent_penalty_with_five_matches(self) -> None:
        """No intent boost with 5 matches: 0.15 + 0.15 = 0.30"""
        result = calculate_uncertainty(num_matches=5, has_intent_boost=False, num_ambiguous_matches=0)
        assert result == 0.30

    def test_intent_boost_removes_penalty(self) -> None:
        """Intent boost should not add penalty"""
        with_boost = calculate_uncertainty(num_matches=3, has_intent_boost=True, num_ambiguous_matches=0)
        without_boost = calculate_uncertainty(num_matches=3, has_intent_boost=False, num_ambiguous_matches=0)
        assert without_boost - with_boost == pytest.approx(0.15, abs=0.01)

    # -------------------------------------------------------------------------
    # Ambiguity penalty tests (min(ambiguous * 0.10, 0.30))
    # -------------------------------------------------------------------------
    def test_one_ambiguous_match(self) -> None:
        """1 ambiguous match: +0.10 penalty"""
        result = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=1)
        assert result == 0.25  # 0.15 + 0.10

    def test_two_ambiguous_matches(self) -> None:
        """2 ambiguous matches: +0.20 penalty"""
        result = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=2)
        assert result == 0.35  # 0.15 + 0.20

    def test_three_ambiguous_matches(self) -> None:
        """3 ambiguous matches: +0.30 penalty (max)"""
        result = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=3)
        assert result == 0.45  # 0.15 + 0.30

    def test_four_ambiguous_matches_capped(self) -> None:
        """4 ambiguous matches: still +0.30 penalty (capped)"""
        result = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=4)
        assert result == 0.45  # 0.15 + 0.30 (capped)

    def test_ten_ambiguous_matches_capped(self) -> None:
        """10 ambiguous matches: still +0.30 penalty (capped)"""
        result = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=10)
        assert result == 0.45  # 0.15 + 0.30 (capped)

    # -------------------------------------------------------------------------
    # Combined penalties
    # -------------------------------------------------------------------------
    def test_combined_intent_and_ambiguity(self) -> None:
        """Combined: 3 matches, no boost, 2 ambiguous: 0.25 + 0.15 + 0.20 = 0.60"""
        result = calculate_uncertainty(num_matches=3, has_intent_boost=False, num_ambiguous_matches=2)
        assert result == 0.60

    def test_worst_case_scenario(self) -> None:
        """Worst case: 0 matches, no boost, max ambiguity: 0.70 + 0.15 + 0.30 = 1.0 (capped)"""
        result = calculate_uncertainty(num_matches=0, has_intent_boost=False, num_ambiguous_matches=5)
        assert result == 1.0

    def test_best_case_scenario(self) -> None:
        """Best case: 5+ matches, boost, 0 ambiguous: 0.15"""
        result = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=0)
        assert result == 0.15

    # -------------------------------------------------------------------------
    # Boundary and edge cases
    # -------------------------------------------------------------------------
    def test_boundary_two_to_three_matches(self) -> None:
        """Boundary: 2 matches (0.40) vs 3 matches (0.25)"""
        two_matches = calculate_uncertainty(num_matches=2, has_intent_boost=True, num_ambiguous_matches=0)
        three_matches = calculate_uncertainty(num_matches=3, has_intent_boost=True, num_ambiguous_matches=0)
        assert two_matches == 0.40
        assert three_matches == 0.25
        assert two_matches > three_matches

    def test_boundary_four_to_five_matches(self) -> None:
        """Boundary: 4 matches (0.25) vs 5 matches (0.15)"""
        four_matches = calculate_uncertainty(num_matches=4, has_intent_boost=True, num_ambiguous_matches=0)
        five_matches = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=0)
        assert four_matches == 0.25
        assert five_matches == 0.15
        assert four_matches > five_matches

    def test_return_type_is_float(self) -> None:
        """Result should be a float"""
        result = calculate_uncertainty(num_matches=3, has_intent_boost=True, num_ambiguous_matches=1)
        assert isinstance(result, float)

    def test_result_is_rounded(self) -> None:
        """Result should be rounded to 2 decimal places"""
        # Any combination should produce clean 2-decimal result
        result = calculate_uncertainty(num_matches=2, has_intent_boost=False, num_ambiguous_matches=1)
        # 0.40 + 0.15 + 0.10 = 0.65
        assert result == 0.65
        assert len(str(result).split('.')[-1]) <= 2


# =============================================================================
# TestPassesDualThreshold: ~15 tests
# =============================================================================
class TestPassesDualThreshold:
    """Tests for passes_dual_threshold() function.

    Formula: (confidence >= conf_threshold) AND (uncertainty <= uncert_threshold)
    Defaults: conf_threshold=0.8, uncert_threshold=0.35
    """

    # -------------------------------------------------------------------------
    # Basic pass/fail scenarios with defaults
    # -------------------------------------------------------------------------
    def test_both_thresholds_pass(self) -> None:
        """Both thresholds met: confidence=0.85, uncertainty=0.20"""
        assert passes_dual_threshold(0.85, 0.20) is True

    def test_confidence_fails_only(self) -> None:
        """Confidence below threshold, uncertainty OK"""
        assert passes_dual_threshold(0.75, 0.20) is False

    def test_uncertainty_fails_only(self) -> None:
        """Confidence OK, uncertainty above threshold"""
        assert passes_dual_threshold(0.85, 0.50) is False

    def test_both_thresholds_fail(self) -> None:
        """Both thresholds failed"""
        assert passes_dual_threshold(0.50, 0.60) is False

    # -------------------------------------------------------------------------
    # Exact boundary tests (default thresholds)
    # -------------------------------------------------------------------------
    def test_exact_confidence_threshold(self) -> None:
        """Exactly at confidence threshold (0.8) should pass"""
        assert passes_dual_threshold(0.80, 0.20) is True

    def test_just_below_confidence_threshold(self) -> None:
        """Just below confidence threshold (0.79) should fail"""
        assert passes_dual_threshold(0.79, 0.20) is False

    def test_exact_uncertainty_threshold(self) -> None:
        """Exactly at uncertainty threshold (0.35) should pass"""
        assert passes_dual_threshold(0.85, 0.35) is True

    def test_just_above_uncertainty_threshold(self) -> None:
        """Just above uncertainty threshold (0.36) should fail"""
        assert passes_dual_threshold(0.85, 0.36) is False

    def test_both_exact_thresholds(self) -> None:
        """Both exactly at thresholds should pass"""
        assert passes_dual_threshold(0.80, 0.35) is True

    # -------------------------------------------------------------------------
    # Custom threshold tests
    # -------------------------------------------------------------------------
    def test_custom_confidence_threshold(self) -> None:
        """Custom confidence threshold of 0.7"""
        # Should pass with 0.75 when threshold is 0.7
        assert passes_dual_threshold(0.75, 0.20, conf_threshold=0.7) is True
        # Should fail with 0.65 when threshold is 0.7
        assert passes_dual_threshold(0.65, 0.20, conf_threshold=0.7) is False

    def test_custom_uncertainty_threshold(self) -> None:
        """Custom uncertainty threshold of 0.5"""
        # Should pass with 0.45 when threshold is 0.5
        assert passes_dual_threshold(0.85, 0.45, uncert_threshold=0.5) is True
        # Should fail with 0.55 when threshold is 0.5
        assert passes_dual_threshold(0.85, 0.55, uncert_threshold=0.5) is False

    def test_both_custom_thresholds(self) -> None:
        """Both custom thresholds: conf=0.7, uncert=0.4"""
        assert passes_dual_threshold(0.70, 0.40, conf_threshold=0.7, uncert_threshold=0.4) is True
        assert passes_dual_threshold(0.69, 0.40, conf_threshold=0.7, uncert_threshold=0.4) is False
        assert passes_dual_threshold(0.70, 0.41, conf_threshold=0.7, uncert_threshold=0.4) is False

    # -------------------------------------------------------------------------
    # Edge cases
    # -------------------------------------------------------------------------
    def test_perfect_scores(self) -> None:
        """Perfect scores: confidence=1.0, uncertainty=0.0"""
        assert passes_dual_threshold(1.0, 0.0) is True

    def test_worst_scores(self) -> None:
        """Worst scores: confidence=0.0, uncertainty=1.0"""
        assert passes_dual_threshold(0.0, 1.0) is False

    def test_return_type_is_bool(self) -> None:
        """Result should be a boolean"""
        result = passes_dual_threshold(0.85, 0.20)
        assert isinstance(result, bool)


# =============================================================================
# TestCalculateConfidence: ~15 tests
# =============================================================================
class TestCalculateConfidence:
    """Tests for calculate_confidence() function.

    Formula:
    - With intent boost: min(0.50 + score * 0.15, 0.95)
    - Without intent boost: min(0.25 + score * 0.15, 0.95)
    """

    # -------------------------------------------------------------------------
    # With intent boost formula tests
    # -------------------------------------------------------------------------
    def test_with_boost_score_zero(self) -> None:
        """With boost, score=0: 0.50 + 0 = 0.50"""
        result = calculate_confidence(score=0, has_intent_boost=True)
        assert result == 0.50

    def test_with_boost_score_one(self) -> None:
        """With boost, score=1: 0.50 + 0.15 = 0.65"""
        result = calculate_confidence(score=1, has_intent_boost=True)
        assert result == 0.65

    def test_with_boost_score_two(self) -> None:
        """With boost, score=2: 0.50 + 0.30 = 0.80"""
        result = calculate_confidence(score=2, has_intent_boost=True)
        assert result == 0.80

    def test_with_boost_score_three(self) -> None:
        """With boost, score=3: 0.50 + 0.45 = 0.95 (max)"""
        result = calculate_confidence(score=3, has_intent_boost=True)
        assert result == 0.95

    def test_with_boost_score_four_capped(self) -> None:
        """With boost, score=4: 0.50 + 0.60 = 1.10 -> capped to 0.95"""
        result = calculate_confidence(score=4, has_intent_boost=True)
        assert result == 0.95

    def test_with_boost_score_ten_capped(self) -> None:
        """With boost, score=10: capped to 0.95"""
        result = calculate_confidence(score=10, has_intent_boost=True)
        assert result == 0.95

    # -------------------------------------------------------------------------
    # Without intent boost formula tests
    # -------------------------------------------------------------------------
    def test_without_boost_score_zero(self) -> None:
        """Without boost, score=0: 0.25 + 0 = 0.25"""
        result = calculate_confidence(score=0, has_intent_boost=False)
        assert result == 0.25

    def test_without_boost_score_two(self) -> None:
        """Without boost, score=2: 0.25 + 0.30 = 0.55"""
        result = calculate_confidence(score=2, has_intent_boost=False)
        assert result == 0.55

    def test_without_boost_score_three(self) -> None:
        """Without boost, score=3: 0.25 + 0.45 = 0.70"""
        result = calculate_confidence(score=3, has_intent_boost=False)
        assert result == 0.70

    def test_without_boost_score_four(self) -> None:
        """Without boost, score=4: 0.25 + 0.60 = 0.85"""
        result = calculate_confidence(score=4, has_intent_boost=False)
        assert result == 0.85

    def test_without_boost_score_five_capped(self) -> None:
        """Without boost, score=5: 0.25 + 0.75 = 1.00 -> capped to 0.95"""
        result = calculate_confidence(score=5, has_intent_boost=False)
        assert result == 0.95

    # -------------------------------------------------------------------------
    # Threshold crossing tests (0.8 threshold for skill routing)
    # -------------------------------------------------------------------------
    def test_with_boost_reaches_threshold_at_score_two(self) -> None:
        """With boost, score=2 reaches 0.8 threshold"""
        result = calculate_confidence(score=2, has_intent_boost=True)
        assert result >= 0.80

    def test_without_boost_below_threshold_at_score_three(self) -> None:
        """Without boost, score=3 is still below 0.8 threshold"""
        result = calculate_confidence(score=3, has_intent_boost=False)
        assert result < 0.80

    def test_without_boost_reaches_threshold_at_score_four(self) -> None:
        """Without boost, score=4 reaches 0.8 threshold"""
        result = calculate_confidence(score=4, has_intent_boost=False)
        assert result >= 0.80

    # -------------------------------------------------------------------------
    # Weight parameter tests
    # -------------------------------------------------------------------------
    def test_weight_multiplier_basic(self) -> None:
        """Weight multiplier affects final result"""
        base = calculate_confidence(score=2, has_intent_boost=True, weight=1.0)
        weighted = calculate_confidence(score=2, has_intent_boost=True, weight=0.5)
        assert weighted == base * 0.5

    def test_weight_multiplier_capped_at_one(self) -> None:
        """Weight > 1.0 is capped at 1.0"""
        result = calculate_confidence(score=3, has_intent_boost=True, weight=2.0)
        assert result == 1.0


# =============================================================================
# TestIntegration: ~10 tests
# =============================================================================
class TestIntegration:
    """Integration tests combining multiple dual-threshold functions."""

    def test_documentation_example_low_uncertainty(self) -> None:
        """Docstring example: 5 matches, intent boost, 0 ambiguous -> 0.15"""
        uncertainty = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=0)
        assert uncertainty == 0.15
        # With high confidence, should pass
        assert passes_dual_threshold(0.85, uncertainty) is True

    def test_documentation_example_medium_uncertainty(self) -> None:
        """Docstring example: 3 matches, intent boost, 1 ambiguous -> 0.35"""
        uncertainty = calculate_uncertainty(num_matches=3, has_intent_boost=True, num_ambiguous_matches=1)
        assert uncertainty == 0.35
        # At exact threshold, should pass
        assert passes_dual_threshold(0.85, uncertainty) is True

    def test_documentation_example_high_uncertainty(self) -> None:
        """Docstring example: 1 match, no intent boost, 0 ambiguous -> 0.55"""
        uncertainty = calculate_uncertainty(num_matches=1, has_intent_boost=False, num_ambiguous_matches=0)
        assert uncertainty == 0.55
        # Above threshold, should fail
        assert passes_dual_threshold(0.85, uncertainty) is False

    def test_documentation_example_very_high_uncertainty(self) -> None:
        """Docstring example: 1 match, no intent boost, 2 ambiguous -> 0.75"""
        uncertainty = calculate_uncertainty(num_matches=1, has_intent_boost=False, num_ambiguous_matches=2)
        assert uncertainty == 0.75
        # Way above threshold, should fail
        assert passes_dual_threshold(0.85, uncertainty) is False

    def test_documentation_example_worst_case(self) -> None:
        """Docstring example: 0 matches, no intent boost, 0 ambiguous -> 0.85"""
        uncertainty = calculate_uncertainty(num_matches=0, has_intent_boost=False, num_ambiguous_matches=0)
        assert uncertainty == 0.85
        # Way above threshold, should fail
        assert passes_dual_threshold(0.85, uncertainty) is False

    def test_confidence_and_uncertainty_combined_pass(self) -> None:
        """Combined: score=2, boost -> confidence=0.80, 5 matches -> uncertainty=0.15"""
        confidence = calculate_confidence(score=2, has_intent_boost=True)
        uncertainty = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=0)

        assert confidence == 0.80
        assert uncertainty == 0.15
        assert passes_dual_threshold(confidence, uncertainty) is True

    def test_confidence_and_uncertainty_combined_fail_confidence(self) -> None:
        """Combined: score=1, no boost -> confidence=0.40, but low uncertainty"""
        confidence = calculate_confidence(score=1, has_intent_boost=False)
        uncertainty = calculate_uncertainty(num_matches=5, has_intent_boost=True, num_ambiguous_matches=0)

        assert confidence == 0.40  # 0.25 + 0.15
        assert uncertainty == 0.15
        # Fails on confidence
        assert passes_dual_threshold(confidence, uncertainty) is False

    def test_confidence_and_uncertainty_combined_fail_uncertainty(self) -> None:
        """Combined: high confidence but high uncertainty"""
        confidence = calculate_confidence(score=3, has_intent_boost=True)
        uncertainty = calculate_uncertainty(num_matches=1, has_intent_boost=False, num_ambiguous_matches=2)

        assert confidence == 0.95  # High
        assert uncertainty == 0.75  # High (0.40 + 0.15 + 0.20)
        # Fails on uncertainty
        assert passes_dual_threshold(confidence, uncertainty) is False

    def test_intent_boost_consistency(self) -> None:
        """Intent boost should affect both confidence and uncertainty consistently"""
        # With boost
        conf_with = calculate_confidence(score=2, has_intent_boost=True)
        unc_with = calculate_uncertainty(num_matches=3, has_intent_boost=True, num_ambiguous_matches=0)

        # Without boost
        conf_without = calculate_confidence(score=2, has_intent_boost=False)
        unc_without = calculate_uncertainty(num_matches=3, has_intent_boost=False, num_ambiguous_matches=0)

        # With boost should have higher confidence and lower uncertainty
        assert conf_with > conf_without
        assert unc_with < unc_without

        # With boost should pass, without should fail
        assert passes_dual_threshold(conf_with, unc_with) is True
        assert passes_dual_threshold(conf_without, unc_without) is False

    def test_realistic_skill_routing_scenario(self) -> None:
        """Realistic scenario: user asks for 'code search' with 4 corpus matches"""
        # Simulating a query that matches corpus terms but not intent boosters
        confidence = calculate_confidence(score=4, has_intent_boost=False)  # 0.85
        uncertainty = calculate_uncertainty(num_matches=4, has_intent_boost=False, num_ambiguous_matches=1)  # 0.50

        assert confidence == 0.85
        assert uncertainty == 0.50  # 0.25 + 0.15 + 0.10
        # Fails due to uncertainty above 0.35 threshold
        assert passes_dual_threshold(confidence, uncertainty) is False


# =============================================================================
# Boundary Value Tests (Additional)
# =============================================================================
class TestBoundaryValues:
    """Boundary value tests for all threshold transitions."""

    def test_confidence_formula_crossing_points_with_boost(self) -> None:
        """Test exact scores where confidence formula crosses key thresholds with boost"""
        # Score = 2.0 -> 0.50 + 0.30 = 0.80 (exactly at routing threshold)
        assert calculate_confidence(2.0, True) == 0.80
        # Score = 1.99 -> 0.50 + 0.2985 = 0.7985 (just below)
        assert calculate_confidence(1.99, True) < 0.80
        # Score = 2.01 -> 0.50 + 0.3015 = 0.8015 (just above)
        assert calculate_confidence(2.01, True) > 0.80

    def test_confidence_formula_crossing_points_without_boost(self) -> None:
        """Test exact scores where confidence formula crosses key thresholds without boost"""
        # Score = 4.0 -> 0.25 + 0.60 = 0.85 (above routing threshold)
        assert calculate_confidence(4.0, False) == 0.85
        # Score = 3.67 -> 0.25 + 0.55 = 0.80 (approximately at threshold)
        result = calculate_confidence(3.67, False)
        assert abs(result - 0.80) < 0.01  # Within 0.01 of 0.80

    def test_uncertainty_threshold_boundary(self) -> None:
        """Test exact uncertainty values at 0.35 threshold"""
        # 5 matches + boost + 2 ambiguous = 0.15 + 0.20 = 0.35 (exactly at threshold)
        result = calculate_uncertainty(5, True, 2)
        assert result == 0.35
        assert passes_dual_threshold(0.85, result) is True

        # 5 matches + boost + 3 ambiguous = 0.15 + 0.30 = 0.45 (above threshold)
        result = calculate_uncertainty(5, True, 3)
        assert result == 0.45
        assert passes_dual_threshold(0.85, result) is False

    def test_match_count_boundaries(self) -> None:
        """Test exact match count boundaries"""
        # Boundary: 0 vs 1 match
        assert calculate_uncertainty(0, True, 0) == 0.70
        assert calculate_uncertainty(1, True, 0) == 0.40

        # Boundary: 2 vs 3 matches
        assert calculate_uncertainty(2, True, 0) == 0.40
        assert calculate_uncertainty(3, True, 0) == 0.25

        # Boundary: 4 vs 5 matches
        assert calculate_uncertainty(4, True, 0) == 0.25
        assert calculate_uncertainty(5, True, 0) == 0.15

    def test_ambiguity_cap_boundary(self) -> None:
        """Test ambiguity penalty cap at 0.30"""
        # 3 ambiguous = 0.30 (at cap)
        base = calculate_uncertainty(5, True, 0)
        with_3 = calculate_uncertainty(5, True, 3)
        assert with_3 - base == pytest.approx(0.30, abs=0.01)

        # 4 ambiguous = 0.30 (still at cap)
        with_4 = calculate_uncertainty(5, True, 4)
        assert with_4 == with_3


# =============================================================================
# Run Tests
# =============================================================================
if __name__ == "__main__":
    pytest.main([__file__, "-v"])
