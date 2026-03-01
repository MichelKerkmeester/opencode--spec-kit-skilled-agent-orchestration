# Spec 069 Test Files Scan

**Spec**: 069-speckit-template-complexity (Dynamic Complexity-Based Template Scaling)
**Scan Date**: 2026-01-16
**Scan Purpose**: Identify all test files related to Spec 069 for potential reuse in Spec 072

---

## Test Files in Spec 069 Folder

### Core Test Suite Files

FILE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/069-speckit-template-complexity/tests/test-detector.js
TESTS: Complexity detection, dimension scoring, weight verification, level mapping
LAST MODIFIED: 2026-01-16 12:22
STATUS: relevant
REASON: Tests complexity scoring system (31 tests). Directly relevant because memory ranking in 072 will need similar scoring logic for context importance classification.

FILE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/069-speckit-template-complexity/tests/test-classifier.js
TESTS: Level boundary thresholds, distance calculations, feature availability, gate expressions
LAST MODIFIED: 2026-01-16 12:22
STATUS: relevant
REASON: Tests level classification boundaries (49 tests). Relevant because 072's tier classification (HOT/WARM/COLD) follows similar boundary logic.

FILE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/069-speckit-template-complexity/tests/test-marker-parser.js
TESTS: COMPLEXITY_GATE parsing, condition evaluation, auto-enable features
LAST MODIFIED: 2026-01-16 12:22
STATUS: partially-relevant
REASON: Tests marker parsing (49 tests). Only relevant if 072 uses similar conditional markers in memory templates.

FILE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/069-speckit-template-complexity/tests/test-preprocessor.js
TESTS: Template loading, preprocessing, metadata injection, expansion
LAST MODIFIED: 2026-01-16 11:21
STATUS: partially-relevant
REASON: Tests template processing (26 tests). Relevant patterns for 072's memory template handling but may need adaptation.

FILE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/069-speckit-template-complexity/tests/test-cli.sh
TESTS: CLI scripts (detect-complexity.js, expand-template.js)
LAST MODIFIED: 2026-01-16 12:23
STATUS: partially-relevant
REASON: Shell-based CLI tests (16 tests). Pattern may be reusable for testing 072's memory ranking CLI tools.

FILE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/069-speckit-template-complexity/tests/run-tests.sh
TESTS: Test suite runner with colored output, aggregation, and reporting
LAST MODIFIED: 2026-01-16 12:23
STATUS: relevant
REASON: Test harness for running all tests. Excellent reusable pattern for 072's test suite.

---

## Test Files in System-Spec-Kit (MCP Server)

FILE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.test.js
TESTS: HOT/WARM/COLD tier classification
STATUS: highly-relevant
REASON: DIRECTLY tests the tier classification system that 072 is built on. This is the existing test file for the tier classification logic.

FILE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.test.js
TESTS: Attention decay scoring (time-based decay)
STATUS: highly-relevant
REASON: Tests attention decay mechanism used in tier ranking. Core component of 072's memory ranking system.

FILE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.test.js
TESTS: Co-activation scoring (semantic relationships)
STATUS: highly-relevant
REASON: Tests co-activation mechanism for related memories. Core component of 072's ranking system.

FILE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.test.js
TESTS: Working memory management (capacity, eviction, priority)
STATUS: highly-relevant
REASON: Tests the working memory system that 072 integrates with. Essential for integration testing.

FILE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/summary-generator.test.js
TESTS: Memory summary generation
STATUS: relevant
REASON: Tests summary generation logic. May be useful for testing 072's memory content processing.

FILE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.test.js
TESTS: Modularization and module structure
STATUS: needs-review
REASON: Tests module structure. May contain organizational patterns useful for 072.

---

## Test Files in System-Spec-Kit (Scripts)

FILE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-bug-fixes.js
TESTS: Bug fixes verification
STATUS: needs-review
REASON: Tests specific bug fixes. Review to see if any relate to tier classification or memory ranking.

FILE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-factory.js
TESTS: Embeddings factory creation and configuration
STATUS: relevant
REASON: Tests embedding provider setup. Relevant for 072's semantic similarity calculations.

FILE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation.sh
TESTS: Spec folder validation
STATUS: partially-relevant
REASON: Shell-based validation tests. Pattern may be useful for 072's validation needs.

---

## Summary by Relevance

### Highly Relevant (MUST REVIEW)
- tier-classifier.test.js - Core tier classification tests
- attention-decay.test.js - Decay scoring tests
- co-activation.test.js - Co-activation scoring tests
- working-memory.test.js - Working memory integration tests

### Relevant (SHOULD REVIEW)
- test-detector.js - Complexity scoring patterns
- test-classifier.js - Boundary threshold patterns
- run-tests.sh - Test harness pattern
- test-embeddings-factory.js - Embedding provider tests
- summary-generator.test.js - Summary generation tests

### Partially Relevant (MAY REVIEW)
- test-marker-parser.js - Conditional marker patterns
- test-preprocessor.js - Template processing patterns
- test-cli.sh - CLI testing patterns
- test-validation.sh - Validation testing patterns

### Needs Review (UNKNOWN RELEVANCE)
- modularization.test.js - Module structure tests
- test-bug-fixes.js - Bug fix verification tests

---

## Test Coverage Summary

| Location | Test Files | Total Tests | Status |
|----------|-----------|-------------|--------|
| Spec 069 tests/ | 6 files | 171 tests | All passing |
| MCP Server tests/ | 6 files | Unknown | Need to run |
| Scripts tests/ | 3 files | Unknown | Need to run |
| **Total** | **15 files** | **171+ tests** | - |

---

## Recommendations for Spec 072

1. **Reuse Test Patterns**:
   - Copy run-tests.sh harness structure
   - Adapt test-detector.js patterns for importance scoring
   - Use test-classifier.js boundary testing approach

2. **Extend Existing Tests**:
   - Add 072-specific tests to tier-classifier.test.js
   - Extend attention-decay.test.js for new decay functions
   - Add integration tests with working-memory.test.js

3. **Create New Tests**:
   - Test memory_search() with tier filtering
   - Test template ranking insertion
   - Test boundary conditions for HOT/WARM/COLD tiers
   - Test decay + co-activation scoring combination

4. **Test Organization**:
   - Keep 072 tests in spec folder during development
   - Move to system-spec-kit after verification
   - Maintain backward compatibility with existing tests

---

## Next Steps

1. Run existing MCP server tests to establish baseline
2. Review tier-classifier.test.js for current coverage
3. Identify gaps between 069 patterns and 072 needs
4. Create 072 test plan based on findings
5. Implement new tests following 069 patterns
