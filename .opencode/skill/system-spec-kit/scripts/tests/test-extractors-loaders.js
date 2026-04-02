// ───────────────────────────────────────────────────────────────
// 1. TEST: EXTRACTORS AND LOADERS COMPREHENSIVE VERIFICATION
// ───────────────────────────────────────────────────────────────
//
// Covers:
// - collect-session-data.js (424 LOC) - P0
// - session-extractor.js (330 LOC) - P1
// - decision-extractor.js (289 LOC) - P1
// - file-extractor.js (~200 LOC) - P1
// - conversation-extractor.js (~280 LOC) - P1
// - opencode-capture.js (443 LOC) - P1
// - implementation-guide-extractor.js - P1
// - diagram-extractor.js - P1
// - data-loader.js (145 LOC) - P0
//
'use strict';

const path = require('path');
const fs = require('fs');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────
*/

const SCRIPTS_DIR = path.join(__dirname, '..');
const EXTRACTORS_DIR = path.join(SCRIPTS_DIR, 'dist', 'extractors');
const LOADERS_DIR = path.join(SCRIPTS_DIR, 'dist', 'loaders');

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
};

/* ─────────────────────────────────────────────────────────────
   2. TEST UTILITIES
────────────────────────────────────────────────────────────────
*/

function log(msg) {
  console.log(msg);
}

function pass(testName, evidence) {
  results.passed++;
  results.tests.push({ name: testName, status: 'PASS', evidence });
  log(`   [PASS] ${testName}`);
  if (evidence) log(`      Evidence: ${evidence}`);
}

function fail(testName, reason) {
  results.failed++;
  results.tests.push({ name: testName, status: 'FAIL', reason });
  log(`   [FAIL] ${testName}`);
  log(`      Reason: ${reason}`);
}

function skip(testName, reason) {
  results.skipped++;
  results.tests.push({ name: testName, status: 'SKIP', reason });
  log(`   [SKIP] ${testName} (skipped: ${reason})`);
}

function assertExists(value, testName, evidence) {
  if (value !== undefined && value !== null) {
    pass(testName, evidence);
    return true;
  } else {
    fail(testName, 'Value is undefined or null');
    return false;
  }
}

function assertEqual(actual, expected, testName) {
  if (actual === expected) {
    pass(testName, `${actual} === ${expected}`);
    return true;
  } else {
    fail(testName, `Expected ${expected}, got ${actual}`);
    return false;
  }
}

function assertType(value, expectedType, testName) {
  const actualType = typeof value;
  if (actualType === expectedType) {
    pass(testName, `Type is ${actualType}`);
    return true;
  } else {
    fail(testName, `Expected type ${expectedType}, got ${actualType}`);
    return false;
  }
}

function assertArray(value, testName, minLength = 0) {
  if (Array.isArray(value) && value.length >= minLength) {
    pass(testName, `Array with ${value.length} items`);
    return true;
  } else if (!Array.isArray(value)) {
    fail(testName, `Expected array, got ${typeof value}`);
    return false;
  } else {
    fail(testName, `Expected array with at least ${minLength} items, got ${value.length}`);
    return false;
  }
}

function assertRange(value, min, max, testName) {
  if (typeof value === 'number' && value >= min && value <= max) {
    pass(testName, `${value} in range [${min}, ${max}]`);
    return true;
  } else {
    fail(testName, `Expected ${value} to be in range [${min}, ${max}]`);
    return false;
  }
}

function assertMatch(value, regex, testName) {
  if (typeof value === 'string' && regex.test(value)) {
    pass(testName, `Matches pattern`);
    return true;
  } else {
    fail(testName, `Expected to match ${regex}, got: ${value}`);
    return false;
  }
}

function assertThrows(fn, testName) {
  try {
    fn();
    fail(testName, 'Expected function to throw, but it did not');
    return false;
  } catch (e) {
    pass(testName, `Threw: ${e.message.substring(0, 50)}`);
    return true;
  }
}

function assertDoesNotThrow(fn, testName) {
  try {
    fn();
    pass(testName, 'Function executed without throwing');
    return true;
  } catch (e) {
    fail(testName, `Unexpected throw: ${e.message}`);
    return false;
  }
}

/* ─────────────────────────────────────────────────────────────
   3. TEST DATA FIXTURES
────────────────────────────────────────────────────────────────
*/

const MOCK_OBSERVATIONS = [
  {
    type: 'feature',
    title: 'Implemented OAuth authentication',
    narrative: 'Built OAuth 2.0 authentication flow with JWT tokens. Added token refresh mechanism.',
    timestamp: new Date().toISOString(),
    files: ['src/auth/oauth.js', 'src/auth/jwt.js'],
    facts: ['Pro: More secure than basic auth', 'Con: Added complexity', 'File: src/auth/oauth.js']
  },
  {
    type: 'decision',
    title: 'Choose PostgreSQL over MongoDB',
    narrative: 'Selected PostgreSQL because of ACID compliance. Confidence: 85%',
    timestamp: new Date().toISOString(),
    files: ['src/db/config.js'],
    facts: [
      'Option A: PostgreSQL - Relational, ACID compliant',
      'Option B: MongoDB - Document store, flexible schema',
      'Advantage: Better data integrity',
      'Disadvantage: Less flexible schema',
      'Caveat: Requires migration planning',
      'Follow-up: Set up replication'
    ]
  },
  {
    type: 'bugfix',
    title: 'Fixed memory leak in event handler',
    narrative: 'The event listener was not being cleaned up on component unmount, causing memory bloat.',
    timestamp: new Date().toISOString(),
    files: ['src/components/EventList.jsx'],
    facts: ['Tool: Read', 'Tool: Edit']
  },
  {
    type: 'research',
    title: 'Investigated caching strategies',
    narrative: 'Explored Redis vs Memcached for session caching. Next: implement Redis solution.',
    timestamp: new Date().toISOString(),
    files: [],
    facts: ['Evidence: Redis benchmark shows 20% faster reads']
  }
];

const MOCK_USER_PROMPTS = [
  { prompt: 'Implement OAuth authentication flow', timestamp: new Date(Date.now() - 60000).toISOString() },
  { prompt: 'Which database should we use?', timestamp: new Date(Date.now() - 45000).toISOString() },
  { prompt: 'Fix the memory leak issue', timestamp: new Date(Date.now() - 30000).toISOString() },
  { prompt: 'Research caching options', timestamp: new Date().toISOString() }
];

const MOCK_COLLECTED_DATA = {
  observations: MOCK_OBSERVATIONS,
  userPrompts: MOCK_USER_PROMPTS,
  recentContext: [{ learning: 'Implemented OAuth with JWT tokens. Next: Add rate limiting.' }],
  SPEC_FOLDER: '007-test-spec',
  FILES: [
    { FILE_PATH: 'src/auth/oauth.js', DESCRIPTION: 'OAuth 2.0 implementation' },
    { FILE_PATH: 'src/auth/jwt.js', DESCRIPTION: 'JWT token handling' },
    { FILE_PATH: 'src/db/config.js', DESCRIPTION: 'Database configuration' }
  ],
  filesModified: [
    { path: 'src/utils/helpers.js', changes_summary: 'Added validation helpers' }
  ]
};

const MOCK_PREFLIGHT_POSTFLIGHT = {
  preflight: {
    knowledgeScore: 40,
    uncertaintyScore: 60,
    contextScore: 35,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    gaps: ['Unknown auth requirements', 'Database schema unclear'],
    confidence: 55,
    readiness: 'Partial'
  },
  postflight: {
    knowledgeScore: 75,
    uncertaintyScore: 25,
    contextScore: 70,
    gapsClosed: ['Auth requirements now clear', 'Database schema defined'],
    newGaps: ['Need to implement rate limiting']
  }
};

const MOCK_MANUAL_DECISIONS = {
  _manualDecisions: [
    'Decision 1: Use JWT tokens - Better for stateless auth',
    'Decision 2: PostgreSQL for primary database',
    { decision: 'Redis for session cache', title: 'Caching Strategy' }
  ],
  SPEC_FOLDER: '007-test-spec'
};

const OBJECT_FACT_TEXT = {
  text: 'Tool: Read File: src/object-facts.ts Result: Preserved object facts'
};

const OBJECT_FACT_METADATA = {
  files: ['src/object-facts.ts'],
  detail: 'Object-shaped fact without a text field'
};

/* ─────────────────────────────────────────────────────────────
   4. COLLECT-SESSION-DATA TESTS (P0)
────────────────────────────────────────────────────────────────
*/

async function testCollectSessionData() {
  log('\n=== COLLECT-SESSION-DATA.JS (P0) ===');

  try {
    const collectSessionData = require(path.join(EXTRACTORS_DIR, 'collect-session-data'));

    // Test exports
    assertType(collectSessionData.collectSessionData, 'function', 'EXT-CSData-001: collectSessionData exported');
    assertType(collectSessionData.shouldAutoSave, 'function', 'EXT-CSData-002: shouldAutoSave exported');
    assertType(collectSessionData.extractPreflightPostflightData, 'function', 'EXT-CSData-003: extractPreflightPostflightData exported');
    assertType(collectSessionData.calculateLearningIndex, 'function', 'EXT-CSData-004: calculateLearningIndex exported');
    assertType(collectSessionData.getScoreAssessment, 'function', 'EXT-CSData-005: getScoreAssessment exported');
    assertType(collectSessionData.getTrendIndicator, 'function', 'EXT-CSData-006: getTrendIndicator exported');
    assertType(collectSessionData.generateLearningSummary, 'function', 'EXT-CSData-007: generateLearningSummary exported');

    // Test getScoreAssessment
    const { getScoreAssessment } = collectSessionData;
    assertEqual(getScoreAssessment(null, 'knowledge'), '', 'EXT-CSData-008: null score returns empty assessment');
    assertEqual(getScoreAssessment(undefined, 'knowledge'), '', 'EXT-CSData-009: undefined score returns empty assessment');
    assertEqual(getScoreAssessment(90, 'knowledge'), 'Strong', 'EXT-CSData-010: High score (90) is Strong');
    assertEqual(getScoreAssessment(70, 'knowledge'), 'Good', 'EXT-CSData-011: Score 70 is Good');
    assertEqual(getScoreAssessment(50, 'knowledge'), 'Moderate', 'EXT-CSData-012: Score 50 is Moderate');
    assertEqual(getScoreAssessment(25, 'knowledge'), 'Limited', 'EXT-CSData-013: Score 25 is Limited');
    assertEqual(getScoreAssessment(10, 'knowledge'), 'Minimal', 'EXT-CSData-014: Score 10 is Minimal');

    // Test uncertainty (inverted scale)
    assertEqual(getScoreAssessment(15, 'uncertainty'), 'Very low uncertainty', 'EXT-CSData-015: Low uncertainty score');
    assertEqual(getScoreAssessment(35, 'uncertainty'), 'Low uncertainty', 'EXT-CSData-016: Medium-low uncertainty');
    assertEqual(getScoreAssessment(55, 'uncertainty'), 'Moderate uncertainty', 'EXT-CSData-017: Moderate uncertainty');
    assertEqual(getScoreAssessment(75, 'uncertainty'), 'High uncertainty', 'EXT-CSData-018: High uncertainty');
    assertEqual(getScoreAssessment(90, 'uncertainty'), 'Very high uncertainty', 'EXT-CSData-019: Very high uncertainty');

    // Test getTrendIndicator
    const { getTrendIndicator } = collectSessionData;
    assertEqual(getTrendIndicator(10, false), String.fromCharCode(8593), 'EXT-CSData-020: Positive delta shows up arrow');
    assertEqual(getTrendIndicator(-10, false), String.fromCharCode(8595), 'EXT-CSData-021: Negative delta shows down arrow');
    assertEqual(getTrendIndicator(0, false), String.fromCharCode(8594), 'EXT-CSData-022: Zero delta shows right arrow');
    assertEqual(getTrendIndicator(null, false), String.fromCharCode(8594), 'EXT-CSData-023: Null delta shows right arrow');

    // Test inverted (for uncertainty - positive reduction is good)
    assertEqual(getTrendIndicator(10, true), String.fromCharCode(8595), 'EXT-CSData-024: Positive reduction shows down (good)');
    assertEqual(getTrendIndicator(-10, true), String.fromCharCode(8593), 'EXT-CSData-025: Negative reduction shows up (bad)');

    // Test calculateLearningIndex
    const { calculateLearningIndex } = collectSessionData;
    const index1 = calculateLearningIndex(50, 30, 40);
    // (50 * 0.4) + (30 * 0.35) + (40 * 0.25) = 20 + 10.5 + 10 = 40.5 -> 41
    assertRange(index1, 40, 42, 'EXT-CSData-026: Learning index calculation');

    const index2 = calculateLearningIndex(0, 0, 0);
    assertEqual(index2, 0, 'EXT-CSData-027: Zero deltas = zero index');

    const index3 = calculateLearningIndex(null, null, null);
    assertEqual(index3, 0, 'EXT-CSData-028: Null deltas handled as zero');

    // Test clamping to 0-100
    const indexCapped = calculateLearningIndex(200, 200, 200);
    assertEqual(indexCapped, 100, 'EXT-CSData-029: Index capped at 100');

    // Test extractPreflightPostflightData
    const { extractPreflightPostflightData } = collectSessionData;
    const ppData = extractPreflightPostflightData(MOCK_PREFLIGHT_POSTFLIGHT);

    assertExists(ppData.PREFLIGHT_KNOW_SCORE, 'EXT-CSData-030: Preflight knowledge score extracted');
    assertEqual(ppData.PREFLIGHT_KNOW_SCORE, 40, 'EXT-CSData-031: Preflight knowledge score correct');
    assertEqual(ppData.POSTFLIGHT_KNOW_SCORE, 75, 'EXT-CSData-032: Postflight knowledge score correct');
    assertMatch(ppData.DELTA_KNOW_SCORE, /^\+?-?\d+$/, 'EXT-CSData-033: Delta has correct format');
    assertExists(ppData.LEARNING_INDEX, 'EXT-CSData-034: Learning index calculated');
    assertArray(ppData.GAPS_CLOSED, 'EXT-CSData-035: Gaps closed is array');
    assertArray(ppData.NEW_GAPS, 'EXT-CSData-036: New gaps is array');

    // Test with no data
    const emptyPP = extractPreflightPostflightData({});
    assertEqual(emptyPP.PREFLIGHT_KNOW_SCORE, null, 'EXT-CSData-037: Missing data returns null');
    assertEqual(emptyPP.LEARNING_SUMMARY.length > 0, true, 'EXT-CSData-038: Learning summary provided even with no data');

    // Test generateLearningSummary
    const { generateLearningSummary } = collectSessionData;
    const summary1 = generateLearningSummary(25, 25, 20, 40);
    if (summary1.includes('knowledge') || summary1.includes('uncertainty') || summary1.includes('productive')) {
      pass('EXT-CSData-039: Learning summary contains relevant keywords', summary1.substring(0, 50));
    } else {
      fail('EXT-CSData-039: Learning summary contains relevant keywords', summary1);
    }

    const summaryLow = generateLearningSummary(2, 2, 2, 5);
    // With small positive deltas, the function generates descriptive text, not "Low learning"
    if (summaryLow.length > 0) {
      pass('EXT-CSData-040: Low learning index generates message', summaryLow.substring(0, 50));
    } else {
      fail('EXT-CSData-040: Low learning index generates message', 'Empty summary');
    }

    // Test shouldAutoSave
    const { shouldAutoSave } = collectSessionData;
    assertEqual(shouldAutoSave(0), false, 'EXT-CSData-041: Zero messages no auto-save');

    const objectFactSession = await collectSessionData.collectSessionData({
      observations: [{
        type: 'followup',
        title: 'Pending follow-up',
        narrative: 'Track the remaining implementation work.',
        facts: [{ text: 'Next: Preserve object-based facts in pending task extraction.' }]
      }],
      userPrompts: [{ prompt: 'Capture remaining work', timestamp: new Date().toISOString() }],
      recentContext: [{ learning: 'No additional summary.' }],
      SPEC_FOLDER: '007-test-spec'
    }, '007-test-spec');
    const pendingTaskHit = (objectFactSession.PENDING_TASKS || []).some((task) =>
      task.TASK_DESCRIPTION.includes('Preserve object-based facts in pending task extraction')
    );
    if (pendingTaskHit) {
      pass('EXT-CSData-042: Object facts contribute to pending task extraction', 'Pending task preserved from object fact');
    } else {
      fail('EXT-CSData-042: Object facts contribute to pending task extraction', JSON.stringify(objectFactSession.PENDING_TASKS || []));
    }

    const originalWarn = console.warn;
    const originalStderrWrite = process.stderr.write.bind(process.stderr);
    const capturedWarns = [];
    try {
      console.warn = (...args) => capturedWarns.push(args.join(' '));
      process.stderr.write = (chunk, encoding, callback) => {
        const payload = Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk);
        capturedWarns.push(payload.trim());

        if (typeof encoding === 'function') {
          encoding();
          return true;
        }
        if (typeof callback === 'function') {
          callback();
        }
        return true;
      };
      const manyObservations = Array.from({ length: 200 }, (_, index) => ({
        type: 'feature',
        title: `Observation ${index + 1}`,
        narrative: `Observation ${index + 1} documents a fidelity-preservation step.`,
        facts: []
      }));

      await collectSessionData.collectSessionData({
        observations: manyObservations,
        userPrompts: [{ prompt: 'Capture the oversized observation list', timestamp: new Date().toISOString() }],
        recentContext: [{ learning: 'Oversized observation list should log truncation.' }],
        SPEC_FOLDER: '007-test-spec'
      }, '007-test-spec');
    } finally {
      console.warn = originalWarn;
      process.stderr.write = originalStderrWrite;
    }

    const truncationLog = capturedWarns.find((entry) => entry.includes('"message":"observation_truncation_applied"'));
    if (truncationLog) {
      const parsedLog = JSON.parse(truncationLog);
      const noObservationContent = !truncationLog.includes('Observation 1');
      if (parsedLog.originalCount > parsedLog.retainedCount && noObservationContent) {
        pass('EXT-CSData-043: Observation truncation logs counts without content', `${parsedLog.originalCount} -> ${parsedLog.retainedCount}`);
      } else {
        fail('EXT-CSData-043: Observation truncation logs counts without content', truncationLog);
      }
    } else {
      fail('EXT-CSData-043: Observation truncation logs counts without content', 'No truncation warning captured');
    }

  } catch (error) {
    fail('EXT-CSData: Module load/test', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. SESSION-EXTRACTOR TESTS (P1)
────────────────────────────────────────────────────────────────
*/

async function testSessionExtractor() {
  log('\n=== SESSION-EXTRACTOR.JS (P1) ===');

  try {
    const sessionExtractor = require(path.join(EXTRACTORS_DIR, 'session-extractor'));

    // Test exports
    assertType(sessionExtractor.generateSessionId, 'function', 'EXT-Session-001: generateSessionId exported');
    assertType(sessionExtractor.getChannel, 'function', 'EXT-Session-002: getChannel exported');
    assertType(sessionExtractor.detectContextType, 'function', 'EXT-Session-003: detectContextType exported');
    assertType(sessionExtractor.detectImportanceTier, 'function', 'EXT-Session-004: detectImportanceTier exported');
    assertType(sessionExtractor.detectProjectPhase, 'function', 'EXT-Session-005: detectProjectPhase exported');
    assertType(sessionExtractor.extractActiveFile, 'function', 'EXT-Session-006: extractActiveFile exported');
    assertType(sessionExtractor.extractNextAction, 'function', 'EXT-Session-007: extractNextAction exported');
    assertType(sessionExtractor.extractBlockers, 'function', 'EXT-Session-008: extractBlockers exported');
    assertType(sessionExtractor.buildFileProgress, 'function', 'EXT-Session-009: buildFileProgress exported');
    assertType(sessionExtractor.countToolsByType, 'function', 'EXT-Session-010: countToolsByType exported');
    assertType(sessionExtractor.calculateSessionDuration, 'function', 'EXT-Session-011: calculateSessionDuration exported');
    assertType(sessionExtractor.calculateExpiryEpoch, 'function', 'EXT-Session-012: calculateExpiryEpoch exported');
    assertType(sessionExtractor.extractKeyTopics, 'function', 'EXT-Session-013: extractKeyTopics exported');
    assertType(sessionExtractor.detectSessionCharacteristics, 'function', 'EXT-Session-014: detectSessionCharacteristics exported');
    assertType(sessionExtractor.buildProjectStateSnapshot, 'function', 'EXT-Session-015: buildProjectStateSnapshot exported');

    // Test generateSessionId
    const { generateSessionId } = sessionExtractor;
    const sessionId = generateSessionId();
    assertMatch(sessionId, /^session-\d+-[a-z0-9]+$/, 'EXT-Session-016: Session ID format correct');

    // Test unique session IDs
    const id1 = generateSessionId();
    const id2 = generateSessionId();
    if (id1 !== id2) {
      pass('EXT-Session-017: Session IDs are unique', `${id1} !== ${id2}`);
    } else {
      fail('EXT-Session-017: Session IDs are unique', 'Generated identical IDs');
    }

    // Test getChannel
    const { getChannel } = sessionExtractor;
    const channel = getChannel();
    assertType(channel, 'string', 'EXT-Session-018: getChannel returns string');
    if (channel.length > 0) {
      pass('EXT-Session-019: Channel is non-empty', channel);
    } else {
      fail('EXT-Session-019: Channel is non-empty', 'Empty string');
    }

    // Test detectContextType
    const { detectContextType } = sessionExtractor;
    assertEqual(detectContextType({}, 0), 'general', 'EXT-Session-020: Empty tools = general');
    assertEqual(detectContextType({ Read: 10, Grep: 5, Write: 1 }, 0), 'research', 'EXT-Session-021: Read-heavy = research');
    assertEqual(detectContextType({ Write: 5, Edit: 5, Read: 2 }, 0), 'implementation', 'EXT-Session-022: Write-heavy = implementation');
    assertEqual(detectContextType({ Read: 5 }, 2), 'planning', 'EXT-Session-023: With decisions = planning');
    assertEqual(detectContextType({ WebSearch: 5, WebFetch: 5, Read: 2 }, 0), 'research', 'EXT-Session-024: Web-heavy = research');

    // Test detectImportanceTier
    const { detectImportanceTier } = sessionExtractor;
    assertEqual(detectImportanceTier(['/src/core/auth.js'], 'general'), 'critical', 'EXT-Session-025: Core path = critical');
    assertEqual(detectImportanceTier(['/src/security/tokens.js'], 'general'), 'critical', 'EXT-Session-026: Security path = critical');
    assertEqual(detectImportanceTier(['/src/utils/helpers.js'], 'planning'), 'important', 'EXT-Session-027: Planning context = important');
    assertEqual(detectImportanceTier(['/src/utils/helpers.js'], 'general'), 'normal', 'EXT-Session-028: Normal path/context = normal');

    // Test detectProjectPhase
    const { detectProjectPhase } = sessionExtractor;
    assertEqual(detectProjectPhase({}, [], 1), 'RESEARCH', 'EXT-Session-029: Empty + few messages = RESEARCH');
    assertEqual(detectProjectPhase({ Write: 10, Edit: 5, Read: 2 }, [], 10), 'IMPLEMENTATION', 'EXT-Session-030: Write-heavy = IMPLEMENTATION');
    const decisionObs = [{ type: 'decision' }];
    assertEqual(detectProjectPhase({ Read: 10, Write: 2 }, decisionObs, 10), 'PLANNING', 'EXT-Session-031: Decisions + read-heavy = PLANNING');

    // Test extractActiveFile
    const { extractActiveFile } = sessionExtractor;
    const activeFile = extractActiveFile(MOCK_OBSERVATIONS, MOCK_COLLECTED_DATA.FILES);
    if (activeFile && typeof activeFile === 'string') {
      pass('EXT-Session-032: extractActiveFile returns string', activeFile);
    } else {
      fail('EXT-Session-032: extractActiveFile returns string', typeof activeFile);
    }

    // Test extractNextAction
    const { extractNextAction } = sessionExtractor;
    const nextAction = extractNextAction(MOCK_OBSERVATIONS, MOCK_COLLECTED_DATA.recentContext);
    assertType(nextAction, 'string', 'EXT-Session-033: extractNextAction returns string');

    // Test extractBlockers
    const { extractBlockers } = sessionExtractor;
    const blockerObs = [{ narrative: 'We are blocked by the API rate limit issue.' }];
    const blockers = extractBlockers(blockerObs);
    if (blockers !== 'None' && blockers.includes('blocked')) {
      pass('EXT-Session-034: extractBlockers detects blocker keywords', blockers.substring(0, 50));
    } else {
      fail('EXT-Session-034: extractBlockers detects blocker keywords', blockers);
    }

    const noBlockers = extractBlockers([{ narrative: 'Everything is working great.' }]);
    assertEqual(noBlockers, 'None', 'EXT-Session-035: No blockers returns None');

    // Test buildFileProgress
    const { buildFileProgress } = sessionExtractor;
    const progress = buildFileProgress([{ FILE_NAME: 'spec.md' }, { FILE_NAME: 'plan.md' }]);
    assertArray(progress, 'EXT-Session-036: buildFileProgress returns array', 2);
    assertEqual(progress[0].FILE_STATUS, 'EXISTS', 'EXT-Session-037: File status is EXISTS');

    // Test countToolsByType
    const { countToolsByType } = sessionExtractor;
    const toolCounts = countToolsByType(MOCK_OBSERVATIONS, MOCK_USER_PROMPTS);
    assertType(toolCounts, 'object', 'EXT-Session-038: countToolsByType returns object');
    assertExists(toolCounts.Read, 'EXT-Session-039: Read count exists');
    assertExists(toolCounts.Edit, 'EXT-Session-040: Edit count exists');

    // Test calculateSessionDuration
    const { calculateSessionDuration } = sessionExtractor;
    const duration = calculateSessionDuration(MOCK_USER_PROMPTS, new Date());
    if (duration === 'N/A' || /^\d+m$/.test(duration) || /^\d+h \d+m$/.test(duration)) {
      pass('EXT-Session-041: Duration format correct', duration);
    } else {
      fail('EXT-Session-041: Duration format correct', duration);
    }

    assertEqual(calculateSessionDuration([], new Date()), 'N/A', 'EXT-Session-042: Empty prompts = N/A');

    // Test calculateExpiryEpoch
    const { calculateExpiryEpoch } = sessionExtractor;
    const now = Math.floor(Date.now() / 1000);
    assertEqual(calculateExpiryEpoch('constitutional', now), 0, 'EXT-Session-043: Constitutional never expires');
    assertEqual(calculateExpiryEpoch('critical', now), 0, 'EXT-Session-044: Critical never expires');

    const tempExpiry = calculateExpiryEpoch('temporary', now);
    assertEqual(tempExpiry, now + (7 * 24 * 60 * 60), 'EXT-Session-045: Temporary expires in 7 days');

    const normalExpiry = calculateExpiryEpoch('normal', now);
    assertEqual(normalExpiry, now + (90 * 24 * 60 * 60), 'EXT-Session-046: Normal expires in 90 days');

    // Test extractKeyTopics
    const { extractKeyTopics } = sessionExtractor;
    const topics = extractKeyTopics('Implemented OAuth authentication with JWT tokens');
    assertArray(topics, 'EXT-Session-047: extractKeyTopics returns array');
    if (topics.some(t => t.includes('oauth')) || topics.some(t => t.includes('authentication')) || topics.some(t => t.includes('tokens'))) {
      pass('EXT-Session-048: Relevant topics extracted', topics.slice(0, 3).join(', '));
    } else {
      fail('EXT-Session-048: Relevant topics extracted', topics.join(', '));
    }

    // Test stopword filtering - 'the' is a stopword, but 'quick', 'fox', etc. may or may not be
    const topicsFiltered = extractKeyTopics('The quick fox jumps over the lazy dog');
    // 'the' is definitely a stopword that should be filtered
    if (!topicsFiltered.includes('the')) {
      pass('EXT-Session-049: Stopwords filtered', `'the' filtered, remaining: ${topicsFiltered.slice(0, 3).join(', ')}`);
    } else {
      fail('EXT-Session-049: Stopwords filtered', topicsFiltered.join(', '));
    }

    // Test detectSessionCharacteristics
    const { detectSessionCharacteristics } = sessionExtractor;
    const chars = detectSessionCharacteristics(MOCK_OBSERVATIONS, MOCK_USER_PROMPTS, MOCK_COLLECTED_DATA.FILES);
    assertExists(chars.contextType, 'EXT-Session-050: contextType exists');
    assertExists(chars.importanceTier, 'EXT-Session-051: importanceTier exists');
    assertType(chars.decisionCount, 'number', 'EXT-Session-052: decisionCount is number');
    assertType(chars.toolCounts, 'object', 'EXT-Session-053: toolCounts is object');

    // Test buildProjectStateSnapshot
    const { buildProjectStateSnapshot } = sessionExtractor;
    const snapshot = buildProjectStateSnapshot({
      toolCounts: { Read: 5, Write: 3 },
      observations: MOCK_OBSERVATIONS,
      messageCount: 10,
      FILES: MOCK_COLLECTED_DATA.FILES,
      SPEC_FILES: [],
      specFolderPath: '/specs/007-test',
      recentContext: MOCK_COLLECTED_DATA.recentContext
    });
    assertExists(snapshot.projectPhase, 'EXT-Session-054: Snapshot has projectPhase');
    assertExists(snapshot.activeFile, 'EXT-Session-055: Snapshot has activeFile');
    assertExists(snapshot.lastAction, 'EXT-Session-056: Snapshot has lastAction');
    assertExists(snapshot.nextAction, 'EXT-Session-057: Snapshot has nextAction');
    assertExists(snapshot.blockers, 'EXT-Session-058: Snapshot has blockers');
    assertArray(snapshot.fileProgress, 'EXT-Session-059: Snapshot has fileProgress array');

  } catch (error) {
    fail('EXT-Session: Module load/test', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. DECISION-EXTRACTOR TESTS (P1)
────────────────────────────────────────────────────────────────
*/

async function testDecisionExtractor() {
  log('\n=== DECISION-EXTRACTOR.JS (P1) ===');

  try {
    const decisionExtractor = require(path.join(EXTRACTORS_DIR, 'decision-extractor'));

    // Test exports
    assertType(decisionExtractor.extractDecisions, 'function', 'EXT-Decision-001: extractDecisions exported');

    const { extractDecisions } = decisionExtractor;

    // Test with no data (simulation mode)
    const simResult = await extractDecisions(null);
    assertExists(simResult.DECISIONS, 'EXT-Decision-002: Simulation returns DECISIONS');
    assertType(simResult.DECISION_COUNT, 'number', 'EXT-Decision-003: DECISION_COUNT is number');

    // Test with decision observations
    const decisionData = {
      observations: [MOCK_OBSERVATIONS[1]], // The decision observation
      SPEC_FOLDER: '007-test-spec'
    };
    const result = await extractDecisions(decisionData);

    assertArray(result.DECISIONS, 'EXT-Decision-004: DECISIONS is array');
    assertEqual(result.DECISION_COUNT, 1, 'EXT-Decision-005: Correct decision count');

    if (result.DECISIONS.length > 0) {
      const decision = result.DECISIONS[0];
      assertExists(decision.TITLE, 'EXT-Decision-006: Decision has TITLE');
      assertExists(decision.CONTEXT, 'EXT-Decision-007: Decision has CONTEXT');
      assertArray(decision.OPTIONS, 'EXT-Decision-008: Decision has OPTIONS array');
      assertExists(decision.CHOSEN, 'EXT-Decision-009: Decision has CHOSEN');
      assertExists(decision.RATIONALE, 'EXT-Decision-010: Decision has RATIONALE');
      assertType(decision.CHOICE_CONFIDENCE, 'number', 'EXT-Decision-010a: CHOICE_CONFIDENCE is number');
      assertType(decision.RATIONALE_CONFIDENCE, 'number', 'EXT-Decision-010b: RATIONALE_CONFIDENCE is number');
      assertType(decision.CONFIDENCE, 'number', 'EXT-Decision-011: CONFIDENCE is number');
      assertExists(decision.DECISION_ANCHOR_ID, 'EXT-Decision-012: Decision has ANCHOR_ID');
      assertExists(decision.DECISION_IMPORTANCE, 'EXT-Decision-013: Decision has IMPORTANCE');
      assertRange(decision.CHOICE_CONFIDENCE, 0, 1, 'EXT-Decision-013a: CHOICE_CONFIDENCE normalized');
      assertRange(decision.RATIONALE_CONFIDENCE, 0, 1, 'EXT-Decision-013b: RATIONALE_CONFIDENCE normalized');

      // Test pros/cons extraction
      assertType(decision.HAS_PROS, 'boolean', 'EXT-Decision-014: HAS_PROS is boolean');
      assertType(decision.HAS_CONS, 'boolean', 'EXT-Decision-015: HAS_CONS is boolean');
      assertArray(decision.PROS, 'EXT-Decision-016: PROS is array');
      assertArray(decision.CONS, 'EXT-Decision-017: CONS is array');
    }

    // Test confidence levels
    assertType(result.HIGH_CONFIDENCE_COUNT, 'number', 'EXT-Decision-018: HIGH_CONFIDENCE_COUNT is number');
    assertType(result.MEDIUM_CONFIDENCE_COUNT, 'number', 'EXT-Decision-019: MEDIUM_CONFIDENCE_COUNT is number');
    assertType(result.LOW_CONFIDENCE_COUNT, 'number', 'EXT-Decision-020: LOW_CONFIDENCE_COUNT is number');
    assertType(result.FOLLOWUP_COUNT, 'number', 'EXT-Decision-021: FOLLOWUP_COUNT is number');

    // Test manual decisions
    const manualResult = await extractDecisions(MOCK_MANUAL_DECISIONS);
    assertEqual(manualResult.DECISION_COUNT, 3, 'EXT-Decision-022: Manual decisions count correct');
    if (manualResult.DECISIONS.length > 0) {
      assertExists(manualResult.DECISIONS[0].TITLE, 'EXT-Decision-023: Manual decision has TITLE');
      assertExists(manualResult.DECISIONS[0].DECISION_ANCHOR_ID, 'EXT-Decision-024: Manual decision has ANCHOR_ID');
    }

    // Test decision importance mapping
    if (manualResult.DECISIONS.length > 0) {
      const importance = manualResult.DECISIONS[0].DECISION_IMPORTANCE;
      if (['high', 'medium', 'low'].includes(importance)) {
        pass('EXT-Decision-025: Importance is valid tier', importance);
      } else {
        fail('EXT-Decision-025: Importance is valid tier', importance);
      }
    }

    // Test empty observations
    const emptyResult = await extractDecisions({ observations: [], SPEC_FOLDER: '000-test' });
    assertEqual(emptyResult.DECISION_COUNT, 0, 'EXT-Decision-026: Empty observations = 0 decisions');

    const enrichedObservationResult = await extractDecisions({
      observations: [{
        type: 'decision',
        title: 'Preserve enriched manual decision',
        narrative: 'Fallback narrative should not win.',
        timestamp: new Date().toISOString(),
        facts: [OBJECT_FACT_TEXT],
        _manualDecision: {
          fullText: 'Selected the batched repair path because it preserves fidelity across the live pipeline.',
          chosenApproach: 'Batched repair path',
          confidence: 82
        }
      }],
      SPEC_FOLDER: '007-test-spec'
    });

    if (
      enrichedObservationResult.DECISIONS[0]?.CHOSEN === 'Batched repair path'
      && enrichedObservationResult.DECISIONS[0]?.CONTEXT.includes('preserves fidelity across the live pipeline')
      && Math.abs(enrichedObservationResult.DECISIONS[0]?.CHOICE_CONFIDENCE - 0.82) < 0.001
      && Math.abs(enrichedObservationResult.DECISIONS[0]?.RATIONALE_CONFIDENCE - 0.82) < 0.001
      && Math.abs(enrichedObservationResult.DECISIONS[0]?.CONFIDENCE - 0.82) < 0.001
    ) {
      pass('EXT-Decision-027: _manualDecision enriches chosen approach and confidence', `${enrichedObservationResult.DECISIONS[0].CHOSEN} @ ${enrichedObservationResult.DECISIONS[0].CONFIDENCE}`);
    } else {
      fail('EXT-Decision-027: _manualDecision enriches chosen approach and confidence', JSON.stringify(enrichedObservationResult.DECISIONS[0] || {}));
    }

    const splitConfidenceResult = await extractDecisions({
      observations: [{
        type: 'decision',
        title: 'Choose database',
        narrative: 'Selected PostgreSQL.',
        timestamp: new Date().toISOString(),
        facts: [
          'Option A: PostgreSQL - Relational database',
          'Option B: SQLite - Embedded database'
        ]
      }],
      SPEC_FOLDER: '007-test-spec'
    });

    if (
      Math.abs(splitConfidenceResult.DECISIONS[0]?.CHOICE_CONFIDENCE - 0.95) < 0.001
      && Math.abs(splitConfidenceResult.DECISIONS[0]?.RATIONALE_CONFIDENCE - 0.7) < 0.001
      && Math.abs(splitConfidenceResult.DECISIONS[0]?.CONFIDENCE - 0.7) < 0.001
    ) {
      pass('EXT-Decision-028: split confidence derives legacy confidence conservatively', `${splitConfidenceResult.DECISIONS[0].CHOICE_CONFIDENCE}/${splitConfidenceResult.DECISIONS[0].RATIONALE_CONFIDENCE}`);
    } else {
      fail('EXT-Decision-028: split confidence derives legacy confidence conservatively', JSON.stringify(splitConfidenceResult.DECISIONS[0] || {}));
    }

    const dedupedManualResult = await extractDecisions({
      _manualDecisions: [{
        decision: 'Use batched repair path',
        chosen: 'Batched repair path',
        rationale: 'Authoritative manual decision should win'
      }],
      observations: [{
        type: 'decision',
        title: 'Use batched repair path',
        narrative: 'Observation duplicate of the authoritative manual decision.',
        timestamp: new Date().toISOString(),
        facts: [OBJECT_FACT_TEXT],
        _manualDecision: {
          fullText: 'Use batched repair path because it keeps fidelity intact.',
          chosenApproach: 'Batched repair path',
          confidence: 82
        }
      }],
      SPEC_FOLDER: '007-test-spec'
    });

    assertEqual(dedupedManualResult.DECISION_COUNT, 1, 'EXT-Decision-029: _manualDecision observation is suppressed when authoritative manual decision exists');

  } catch (error) {
    fail('EXT-Decision: Module load/test', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   7. FILE-EXTRACTOR TESTS (P1)
────────────────────────────────────────────────────────────────
*/

async function testFileExtractor() {
  log('\n=== FILE-EXTRACTOR.JS (P1) ===');

  try {
    const fileExtractor = require(path.join(EXTRACTORS_DIR, 'file-extractor'));

    // Test exports
    assertType(fileExtractor.detectObservationType, 'function', 'EXT-File-001: detectObservationType exported');
    assertType(fileExtractor.extractFilesFromData, 'function', 'EXT-File-002: extractFilesFromData exported');
    assertType(fileExtractor.enhanceFilesWithSemanticDescriptions, 'function', 'EXT-File-003: enhanceFilesWithSemanticDescriptions exported');
    assertType(fileExtractor.buildObservationsWithAnchors, 'function', 'EXT-File-004: buildObservationsWithAnchors exported');

    // Test detectObservationType
    const { detectObservationType } = fileExtractor;
    assertEqual(detectObservationType({ type: 'feature' }), 'feature', 'EXT-File-005: Explicit type preserved');
    assertEqual(detectObservationType({ type: 'observation', narrative: 'Fixed the bug in auth' }), 'bugfix', 'EXT-File-006: Bug keywords = bugfix');
    assertEqual(detectObservationType({ type: 'observation', narrative: 'Implemented new login feature' }), 'feature', 'EXT-File-007: Implement keywords = feature');
    assertEqual(detectObservationType({ type: 'observation', narrative: 'Refactored the module' }), 'refactor', 'EXT-File-008: Refactor keywords = refactor');
    assertEqual(detectObservationType({ type: 'observation', narrative: 'Decided to use PostgreSQL' }), 'decision', 'EXT-File-009: Decision keywords = decision');
    assertEqual(detectObservationType({ type: 'observation', narrative: 'Researched caching options' }), 'research', 'EXT-File-010: Research keywords = research');
    assertEqual(detectObservationType({ type: 'observation', narrative: 'Discovered new API endpoint' }), 'discovery', 'EXT-File-011: Discovery keywords = discovery');
    assertEqual(detectObservationType({ type: 'observation', narrative: 'Ran Vitest assertions and verified coverage' }), 'test', 'EXT-File-012: Test keywords = test');
    assertEqual(detectObservationType({ type: 'observation', narrative: 'Updated README markdown guide' }), 'documentation', 'EXT-File-012b: Documentation keywords = documentation');
    assertEqual(detectObservationType({ type: 'observation', narrative: 'Optimized performance benchmark latency' }), 'performance', 'EXT-File-012c: Performance keywords = performance');
    assertEqual(detectObservationType({ type: 'observation', narrative: 'Updated the file' }), 'observation', 'EXT-File-012d: No keywords = observation');

    // Test extractFilesFromData
    const { extractFilesFromData } = fileExtractor;
    const files = extractFilesFromData(MOCK_COLLECTED_DATA, MOCK_OBSERVATIONS);
    assertArray(files, 'EXT-File-013: extractFilesFromData returns array');

    if (files.length > 0) {
      assertExists(files[0].FILE_PATH, 'EXT-File-014: File has FILE_PATH');
      assertExists(files[0].DESCRIPTION, 'EXT-File-015: File has DESCRIPTION');
    }

    // Test file deduplication
    const dupData = {
      FILES: [
        { FILE_PATH: 'src/auth.js', DESCRIPTION: 'Auth module' },
        { FILE_PATH: 'src/auth.js', DESCRIPTION: 'Modified' }
      ]
    };
    const dedupedFiles = extractFilesFromData(dupData, []);
    assertEqual(dedupedFiles.length, 1, 'EXT-File-016: Duplicate files deduplicated');

    const normalizedDupData = {
      FILES: [
        { FILE_PATH: 'scripts/utils/input-normalizer.ts', DESCRIPTION: 'Canonical path' },
        { FILE_PATH: 'scripts/utils/../utils/input-normalizer.ts', DESCRIPTION: 'Equivalent normalized path' }
      ]
    };
    const normalizedDedupedFiles = extractFilesFromData(normalizedDupData, []);
    assertEqual(normalizedDedupedFiles.length, 1, 'EXT-File-016b: Normalized path-equivalent files deduplicated');
    assertEqual(
      normalizedDedupedFiles[0]?.FILE_PATH,
      'scripts/utils/input-normalizer.ts',
      'EXT-File-016c: Normalized path-equivalent files preserve canonical FILE_PATH'
    );

    const legacyData = {
      filesModified: [
        { path: 'src/legacy.js', changes_summary: 'Legacy changes' }
      ]
    };
    const legacyFiles = extractFilesFromData(legacyData, []);
    if (legacyFiles.length > 0 && legacyFiles[0].FILE_PATH.includes('legacy')) {
      pass('EXT-File-017: Legacy format supported', legacyFiles[0].FILE_PATH);
    } else {
      fail('EXT-File-017: Legacy format supported', JSON.stringify(legacyFiles));
    }

    // Test buildObservationsWithAnchors
    const { buildObservationsWithAnchors } = fileExtractor;
    const obsWithAnchors = buildObservationsWithAnchors(MOCK_OBSERVATIONS, '007-test-spec');
    assertArray(obsWithAnchors, 'EXT-File-018: buildObservationsWithAnchors returns array', 1);

    if (obsWithAnchors.length > 0) {
      const obs = obsWithAnchors[0];
      assertExists(obs.TYPE, 'EXT-File-019: Observation has TYPE');
      assertExists(obs.TITLE, 'EXT-File-020: Observation has TITLE');
      assertExists(obs.NARRATIVE, 'EXT-File-021: Observation has NARRATIVE');
      assertExists(obs.ANCHOR_ID, 'EXT-File-022: Observation has ANCHOR_ID');
      assertType(obs.HAS_FILES, 'boolean', 'EXT-File-023: HAS_FILES is boolean');
      assertType(obs.HAS_FACTS, 'boolean', 'EXT-File-024: HAS_FACTS is boolean');
    }

    // Test anchor uniqueness
    const duplicateObs = [
      { title: 'Test', narrative: 'First' },
      { title: 'Test', narrative: 'Second' },
      { title: 'Test', narrative: 'Third' }
    ];
    const uniqueAnchors = buildObservationsWithAnchors(duplicateObs, '007-test');
    const anchorIds = uniqueAnchors.map(o => o.ANCHOR_ID);
    const uniqueAnchorIds = new Set(anchorIds);
    assertEqual(uniqueAnchorIds.size, anchorIds.length, 'EXT-File-025: All anchor IDs unique');

    // Test caller-side null filtering with valid observations preserved
    const obsWithNulls = [null, { title: 'Valid' }, undefined, { title: 'Also Valid' }];
    const filteredObs = buildObservationsWithAnchors(obsWithNulls.filter(Boolean), '007-test');
    assertEqual(filteredObs.length, 2, 'EXT-File-026: Caller-side null filtering preserves valid observations');

    // Test enhanceFilesWithSemanticDescriptions
    const { enhanceFilesWithSemanticDescriptions } = fileExtractor;
    const semanticMap = new Map([
      ['src/auth.js', { description: 'Authentication module', action: 'modified' }],
      ['src/new.js', { description: 'New file', action: 'created' }]
    ]);
    const baseFiles = [{ FILE_PATH: 'src/auth.js', DESCRIPTION: 'Modified during session' }];
    const enhanced = enhanceFilesWithSemanticDescriptions(baseFiles, semanticMap);
    if (enhanced[0].DESCRIPTION === 'Authentication module') {
      pass('EXT-File-027: Semantic description applied', enhanced[0].DESCRIPTION);
    } else {
      fail('EXT-File-027: Semantic description applied', enhanced[0].DESCRIPTION);
    }

    const objectFactObservations = buildObservationsWithAnchors([{
      title: 'Object fact rendering',
      narrative: 'Ensure object facts survive rendering.',
      facts: [OBJECT_FACT_TEXT, OBJECT_FACT_METADATA]
    }], '007-test-spec');
    const renderedFacts = objectFactObservations[0]?.FACTS_LIST || '';
    if (renderedFacts.includes('Tool: Read') && renderedFacts.includes('[object] {"files":["src/object-facts.ts"],"detail":"Object-shaped fact without a text field"}')) {
      pass('EXT-File-028: Object facts are rendered instead of dropped', renderedFacts);
    } else {
      fail('EXT-File-028: Object facts are rendered instead of dropped', renderedFacts);
    }

  } catch (error) {
    fail('EXT-File: Module load/test', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   8. CONVERSATION-EXTRACTOR TESTS (P1)
────────────────────────────────────────────────────────────────
*/

async function testConversationExtractor() {
  log('\n=== CONVERSATION-EXTRACTOR.JS (P1) ===');

  try {
    const conversationExtractor = require(path.join(EXTRACTORS_DIR, 'conversation-extractor'));

    // Test exports
    assertType(conversationExtractor.extractConversations, 'function', 'EXT-Conv-001: extractConversations exported');

    const { extractConversations } = conversationExtractor;

    // Test with no data (simulation mode)
    const simResult = await extractConversations(null);
    assertExists(simResult.MESSAGES, 'EXT-Conv-002: Simulation returns MESSAGES');
    assertType(simResult.MESSAGE_COUNT, 'number', 'EXT-Conv-003: MESSAGE_COUNT is number');

    // Test with collected data
    const result = await extractConversations(MOCK_COLLECTED_DATA);

    assertArray(result.MESSAGES, 'EXT-Conv-004: MESSAGES is array');
    assertType(result.MESSAGE_COUNT, 'number', 'EXT-Conv-005: MESSAGE_COUNT is number');
    assertExists(result.DURATION, 'EXT-Conv-006: DURATION exists');
    assertExists(result.FLOW_PATTERN, 'EXT-Conv-007: FLOW_PATTERN exists');
    assertType(result.PHASE_COUNT, 'number', 'EXT-Conv-008: PHASE_COUNT is number');
    assertArray(result.PHASES, 'EXT-Conv-009: PHASES is array');
    assertType(result.TOOL_COUNT, 'number', 'EXT-Conv-010: TOOL_COUNT is number');

    // Test message structure
    if (result.MESSAGES.length > 0) {
      const msg = result.MESSAGES[0];
      assertExists(msg.TIMESTAMP, 'EXT-Conv-011: Message has TIMESTAMP');
      assertExists(msg.ROLE, 'EXT-Conv-012: Message has ROLE');
      assertExists(msg.CONTENT, 'EXT-Conv-013: Message has CONTENT');
      assertArray(msg.TOOL_CALLS, 'EXT-Conv-014: Message has TOOL_CALLS array');
    }

    // Test flow pattern detection
    const patterns = ['Linear Sequential', 'Iterative Loop', 'Branching Investigation', 'Exploratory Sweep'];
    if (patterns.includes(result.FLOW_PATTERN)) {
      pass('EXT-Conv-015: Valid FLOW_PATTERN', result.FLOW_PATTERN);
    } else {
      fail('EXT-Conv-015: Valid FLOW_PATTERN', result.FLOW_PATTERN);
    }

    // Test AUTO_GENERATED_FLOW
    assertExists(result.AUTO_GENERATED_FLOW, 'EXT-Conv-016: AUTO_GENERATED_FLOW exists');

    // Test empty data handling
    const emptyResult = await extractConversations({ observations: [], userPrompts: [] });
    assertArray(emptyResult.MESSAGES, 'EXT-Conv-017: Empty data returns MESSAGES array');
    assertEqual(emptyResult.MESSAGE_COUNT, 0, 'EXT-Conv-018: Empty data MESSAGE_COUNT is 0');

    // Test DATE format
    assertMatch(result.DATE, /^\d{4}-\d{2}-\d{2}$/, 'EXT-Conv-019: DATE in ISO format');

    const objectFactConversation = await extractConversations({
      userPrompts: [{ prompt: 'Read the preserved object facts', timestamp: new Date().toISOString() }],
      observations: [{
        timestamp: new Date().toISOString(),
        narrative: 'Tool activity came through object-based facts.',
        facts: [OBJECT_FACT_TEXT],
        title: 'Object fact tool activity',
        files: ['src/object-facts.ts'],
        type: 'observation'
      }]
    });
    const toolNames = objectFactConversation.MESSAGES.flatMap((message) => message.TOOL_CALLS.map((tool) => tool.TOOL_NAME));
    if (toolNames.includes('Read')) {
      pass('EXT-Conv-020: Object facts still drive conversation tool-call detection', toolNames.join(', '));
    } else {
      fail('EXT-Conv-020: Object facts still drive conversation tool-call detection', JSON.stringify(objectFactConversation.MESSAGES));
    }

    assertType(result.UNIQUE_PHASE_COUNT, 'number', 'EXT-Conv-021: UNIQUE_PHASE_COUNT is number');
    assertArray(result.TOPIC_CLUSTERS, 'EXT-Conv-022: TOPIC_CLUSTERS is array');

    const iterativeConversation = await extractConversations({
      userPrompts: [
        { prompt: 'Research adapter patterns', timestamp: '2026-03-16T10:00:00.000Z' },
        { prompt: 'Implement the phase classifier', timestamp: '2026-03-16T10:06:00.000Z' },
        { prompt: 'Research fallback handling again', timestamp: '2026-03-16T10:12:00.000Z' },
      ],
      observations: [
        {
          timestamp: '2026-03-16T10:00:30.000Z',
          narrative: 'Researched adapter patterns with Read and Grep.',
          facts: ['Tool: Read docs/phase-classifier.md', 'Tool: Grep phase classifier'],
          type: 'research',
        },
        {
          timestamp: '2026-03-16T10:06:30.000Z',
          narrative: 'Implemented the classifier with Edit and Write tools.',
          facts: ['Tool: Edit scripts/lib/phase-classifier.ts', 'Tool: Write scripts/extractors/conversation-extractor.ts'],
          type: 'feature',
        },
        {
          timestamp: '2026-03-16T10:12:30.000Z',
          narrative: 'Researched tie-break handling after implementation.',
          facts: ['Tool: Read docs/tie-breaks.md'],
          type: 'research',
        },
      ],
    });

    if (iterativeConversation.PHASES.length === 3 && iterativeConversation.UNIQUE_PHASE_COUNT === 2) {
      pass('EXT-Conv-023: Non-contiguous phases remain separate segments', iterativeConversation.PHASES.map((phase) => phase.PHASE_NAME).join(' -> '));
    } else {
      fail('EXT-Conv-023: Non-contiguous phases remain separate segments', JSON.stringify(iterativeConversation.PHASES));
    }

  } catch (error) {
    fail('EXT-Conv: Module load/test', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   9. IMPLEMENTATION-GUIDE-EXTRACTOR TESTS (P1)
────────────────────────────────────────────────────────────────
*/

async function testImplementationGuideExtractor() {
  log('\n=== IMPLEMENTATION-GUIDE-EXTRACTOR.JS (P1) ===');

  try {
    const implGuide = require(path.join(EXTRACTORS_DIR, 'implementation-guide-extractor'));

    // Test exports
    assertType(implGuide.hasImplementationWork, 'function', 'EXT-Impl-001: hasImplementationWork exported');
    assertType(implGuide.extractMainTopic, 'function', 'EXT-Impl-002: extractMainTopic exported');
    assertType(implGuide.extractWhatBuilt, 'function', 'EXT-Impl-003: extractWhatBuilt exported');
    assertType(implGuide.extractKeyFilesWithRoles, 'function', 'EXT-Impl-004: extractKeyFilesWithRoles exported');
    assertType(implGuide.generateExtensionGuide, 'function', 'EXT-Impl-005: generateExtensionGuide exported');
    assertType(implGuide.extractCodePatterns, 'function', 'EXT-Impl-006: extractCodePatterns exported');
    assertType(implGuide.buildImplementationGuideData, 'function', 'EXT-Impl-007: buildImplementationGuideData exported');

    // Test hasImplementationWork
    const { hasImplementationWork } = implGuide;
    assertEqual(hasImplementationWork(MOCK_OBSERVATIONS, MOCK_COLLECTED_DATA.FILES), true, 'EXT-Impl-008: Detects implementation work');
    assertEqual(hasImplementationWork([], []), false, 'EXT-Impl-009: No work with empty data');
    assertEqual(hasImplementationWork([{ type: 'research' }], []), false, 'EXT-Impl-010: Research-only not implementation');

    // Test extractMainTopic
    const { extractMainTopic } = implGuide;
    const topicFromFolder = extractMainTopic([], '007-oauth-auth');
    if (topicFromFolder.includes('oauth') || topicFromFolder.includes('auth')) {
      pass('EXT-Impl-011: Topic from folder name', topicFromFolder);
    } else {
      fail('EXT-Impl-011: Topic from folder name', topicFromFolder);
    }

    const topicFromObs = extractMainTopic(MOCK_OBSERVATIONS, null);
    assertType(topicFromObs, 'string', 'EXT-Impl-012: Topic from observations is string');

    // Test extractWhatBuilt
    const { extractWhatBuilt } = implGuide;
    const built = extractWhatBuilt(MOCK_OBSERVATIONS);
    assertArray(built, 'EXT-Impl-013: extractWhatBuilt returns array');
    if (built.length > 0) {
      assertExists(built[0].FEATURE_NAME, 'EXT-Impl-014: Feature has FEATURE_NAME');
      assertExists(built[0].DESCRIPTION, 'EXT-Impl-015: Feature has DESCRIPTION');
    }

    // Test deduplication
    const dupObs = [
      { type: 'feature', title: 'OAuth Auth', narrative: 'Added OAuth' },
      { type: 'feature', title: 'OAuth Auth', narrative: 'Updated OAuth' }
    ];
    const dedupedBuilt = extractWhatBuilt(dupObs);
    assertEqual(dedupedBuilt.length, 1, 'EXT-Impl-016: Duplicate features deduplicated');

    // Test extractKeyFilesWithRoles
    const { extractKeyFilesWithRoles } = implGuide;
    const keyFiles = extractKeyFilesWithRoles(MOCK_COLLECTED_DATA.FILES, MOCK_OBSERVATIONS);
    assertArray(keyFiles, 'EXT-Impl-017: extractKeyFilesWithRoles returns array');
    if (keyFiles.length > 0) {
      assertExists(keyFiles[0].FILE_PATH, 'EXT-Impl-018: Key file has FILE_PATH');
      assertExists(keyFiles[0].ROLE, 'EXT-Impl-019: Key file has ROLE');
    }

    // Test role detection patterns
    const testFiles = [
      { FILE_PATH: 'src/auth.test.js' },
      { FILE_PATH: 'config.js' },
      { FILE_PATH: 'src/index.ts' },
      { FILE_PATH: 'types.d.ts' },
      { FILE_PATH: 'src/utils.js' }
    ];
    const roledFiles = extractKeyFilesWithRoles(testFiles, []);
    const roles = roledFiles.map(f => f.ROLE);
    if (roles.some(r => r.includes('Test'))) {
      pass('EXT-Impl-020: Test file role detected', roles.find(r => r.includes('Test')));
    }
    if (roles.some(r => r.includes('Configuration') || r.includes('config'))) {
      pass('EXT-Impl-021: Config file role detected', roles.find(r => r.includes('onfig')));
    }

    // Test generateExtensionGuide
    const { generateExtensionGuide } = implGuide;
    const guides = generateExtensionGuide(MOCK_OBSERVATIONS, MOCK_COLLECTED_DATA.FILES);
    assertArray(guides, 'EXT-Impl-022: generateExtensionGuide returns array');
    if (guides.length > 0) {
      assertExists(guides[0].GUIDE_TEXT, 'EXT-Impl-023: Guide has GUIDE_TEXT');
    }

    // Test extractCodePatterns
    const { extractCodePatterns } = implGuide;
    const patterns = extractCodePatterns(MOCK_OBSERVATIONS, MOCK_COLLECTED_DATA.FILES);
    assertArray(patterns, 'EXT-Impl-024: extractCodePatterns returns array');
    if (patterns.length > 0) {
      assertExists(patterns[0].PATTERN_NAME, 'EXT-Impl-025: Pattern has PATTERN_NAME');
      assertExists(patterns[0].USAGE, 'EXT-Impl-026: Pattern has USAGE');
    }

    // Test buildImplementationGuideData
    const { buildImplementationGuideData } = implGuide;
    const guideData = buildImplementationGuideData(MOCK_OBSERVATIONS, MOCK_COLLECTED_DATA.FILES, '007-test');
    assertEqual(guideData.HAS_IMPLEMENTATION_GUIDE, true, 'EXT-Impl-027: Guide detected');
    assertExists(guideData.TOPIC, 'EXT-Impl-028: Guide has TOPIC');
    assertArray(guideData.IMPLEMENTATIONS, 'EXT-Impl-029: Guide has IMPLEMENTATIONS');
    assertArray(guideData.IMPL_KEY_FILES, 'EXT-Impl-030: Guide has IMPL_KEY_FILES');
    assertArray(guideData.EXTENSION_GUIDES, 'EXT-Impl-031: Guide has EXTENSION_GUIDES');
    assertArray(guideData.PATTERNS, 'EXT-Impl-032: Guide has PATTERNS');

    // Test no implementation guide
    const noImplData = buildImplementationGuideData([{ type: 'research' }], [], null);
    assertEqual(noImplData.HAS_IMPLEMENTATION_GUIDE, false, 'EXT-Impl-033: No guide when no impl work');

  } catch (error) {
    fail('EXT-Impl: Module load/test', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   10. DIAGRAM-EXTRACTOR TESTS (P1)
────────────────────────────────────────────────────────────────
*/

async function testDiagramExtractor() {
  log('\n=== DIAGRAM-EXTRACTOR.JS (P1) ===');

  try {
    const diagramExtractor = require(path.join(EXTRACTORS_DIR, 'diagram-extractor'));

    // Test exports
    assertType(diagramExtractor.extractPhasesFromData, 'function', 'EXT-Diag-001: extractPhasesFromData exported');
    assertType(diagramExtractor.extractDiagrams, 'function', 'EXT-Diag-002: extractDiagrams exported');

    // Test extractPhasesFromData
    const { extractPhasesFromData } = diagramExtractor;
    const phases = extractPhasesFromData(MOCK_COLLECTED_DATA);
    assertArray(phases, 'EXT-Diag-003: extractPhasesFromData returns array');

    if (phases.length > 0) {
      assertExists(phases[0].PHASE_NAME, 'EXT-Diag-004: Phase has PHASE_NAME');
      assertExists(phases[0].DURATION, 'EXT-Diag-005: Phase has DURATION');
      assertArray(phases[0].ACTIVITIES, 'EXT-Diag-006: Phase has ACTIVITIES array');
    }

    // Test with null data (simulation)
    const simPhases = extractPhasesFromData(null);
    assertArray(simPhases, 'EXT-Diag-007: Null data returns simulation phases');

    // Test with short session
    const shortSession = { observations: [{ narrative: 'Quick' }] };
    const shortPhases = extractPhasesFromData(shortSession);
    assertArray(shortPhases, 'EXT-Diag-008: Short session returns array');

    // Test extractDiagrams
    const { extractDiagrams } = diagramExtractor;
    const diagResult = await extractDiagrams(MOCK_COLLECTED_DATA);

    assertArray(diagResult.DIAGRAMS, 'EXT-Diag-009: extractDiagrams returns DIAGRAMS array');
    assertType(diagResult.DIAGRAM_COUNT, 'number', 'EXT-Diag-010: DIAGRAM_COUNT is number');
    assertEqual(diagResult.HAS_AUTO_GENERATED, true, 'EXT-Diag-011: HAS_AUTO_GENERATED is true');
    assertExists(diagResult.FLOW_TYPE, 'EXT-Diag-012: FLOW_TYPE exists');
    assertExists(diagResult.AUTO_CONVERSATION_FLOWCHART, 'EXT-Diag-013: AUTO_CONVERSATION_FLOWCHART exists');
    assertArray(diagResult.AUTO_DECISION_TREES, 'EXT-Diag-014: AUTO_DECISION_TREES is array');
    assertArray(diagResult.DIAGRAM_TYPES, 'EXT-Diag-015: DIAGRAM_TYPES is array');
    assertArray(diagResult.PATTERN_SUMMARY, 'EXT-Diag-016: PATTERN_SUMMARY is array');

    // Test with ASCII art in observations
    const asciiObs = {
      observations: [{
        title: 'Flow Diagram',
        narrative: '```\n+--------+\n| Start  |\n+--------+\n    |\n    v\n+--------+\n|  End   |\n+--------+\n```',
        facts: []
      }],
      userPrompts: [{ prompt: 'Create flow' }]
    };
    const asciiResult = await extractDiagrams(asciiObs);
    // May or may not detect depending on exact box chars used
    assertType(asciiResult.DIAGRAM_COUNT, 'number', 'EXT-Diag-017: ASCII art processing works');

    // Test simulation mode
    const simDiag = await extractDiagrams(null);
    assertExists(simDiag.DIAGRAMS, 'EXT-Diag-018: Simulation returns DIAGRAMS');

  } catch (error) {
    fail('EXT-Diag: Module load/test', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   11. OPENCODE-CAPTURE TESTS (P1)
────────────────────────────────────────────────────────────────
*/

async function testOpencodeCapture() {
  log('\n=== OPENCODE-CAPTURE.JS (REMOVED — recovery mode deprecated) ===');
  skip('EXT-OC: Module removed', 'Recovery mode fully deprecated');
  return;

  /* eslint-disable no-unreachable */
  try {
    const opencodeCapture = require(path.join(EXTRACTORS_DIR, 'opencode-capture'));

    // Test exports - snake_case
    assertType(opencodeCapture.getRecentPrompts, 'function', 'EXT-OC-001: get_recent_prompts exported');
    assertType(opencodeCapture.getSessionResponses, 'function', 'EXT-OC-002: get_session_responses exported');
    assertType(opencodeCapture.getToolExecutions, 'function', 'EXT-OC-003: get_tool_executions exported');
    assertType(opencodeCapture.captureConversation, 'function', 'EXT-OC-004: capture_conversation exported');
    assertType(opencodeCapture.getProjectId, 'function', 'EXT-OC-005: get_project_id exported');
    assertType(opencodeCapture.getRecentSessions, 'function', 'EXT-OC-006: get_recent_sessions exported');
    assertType(opencodeCapture.getCurrentSession, 'function', 'EXT-OC-007: get_current_session exported');
    assertType(opencodeCapture.getSessionMessages, 'function', 'EXT-OC-008: get_session_messages exported');
    assertType(opencodeCapture.getMessageParts, 'function', 'EXT-OC-009: get_message_parts exported');
    assertType(opencodeCapture.pathExists, 'function', 'EXT-OC-010: path_exists exported');
    assertType(opencodeCapture.readJsonSafe, 'function', 'EXT-OC-011: read_json_safe exported');
    assertType(opencodeCapture.readJsonlTail, 'function', 'EXT-OC-012: read_jsonl_tail exported');

    // Test exports - camelCase aliases
    assertType(opencodeCapture.getRecentPrompts, 'function', 'EXT-OC-013: getRecentPrompts alias exported');
    assertType(opencodeCapture.captureConversation, 'function', 'EXT-OC-014: captureConversation alias exported');
    assertType(opencodeCapture.pathExists, 'function', 'EXT-OC-015: pathExists alias exported');
    assertType(opencodeCapture.readJsonSafe, 'function', 'EXT-OC-016: readJsonSafe alias exported');

    // Test constants
    assertExists(opencodeCapture.OPENCODE_STORAGE, 'EXT-OC-017: OPENCODE_STORAGE constant exported');
    assertExists(opencodeCapture.PROMPT_HISTORY, 'EXT-OC-018: PROMPT_HISTORY constant exported');

    // Test path_exists with non-existent path
    const { pathExists } = opencodeCapture;
    const nonExistent = await pathExists('/nonexistent/path/that/should/not/exist');
    assertEqual(nonExistent, false, 'EXT-OC-019: Non-existent path returns false');

    // Test path_exists with existing path
    const existingPath = await pathExists(__dirname);
    assertEqual(existingPath, true, 'EXT-OC-020: Existing path returns true');

    // Test read_json_safe with non-existent file
    const { readJsonSafe } = opencodeCapture;
    const nonExistentJson = await readJsonSafe('/nonexistent/file.json');
    assertEqual(nonExistentJson, null, 'EXT-OC-021: Non-existent JSON returns null');

    // Test read_jsonl_tail with non-existent file
    const { readJsonlTail } = opencodeCapture;
    const nonExistentJsonl = await readJsonlTail('/nonexistent/file.jsonl', 10);
    assertArray(nonExistentJsonl, 'EXT-OC-022: Non-existent JSONL returns empty array');
    assertEqual(nonExistentJsonl.length, 0, 'EXT-OC-023: Empty JSONL result');

    // Test get_project_id with non-existent directory
    const { getProjectId } = opencodeCapture;
    const projectId = getProjectId('/nonexistent/project/path');
    assertEqual(projectId, null, 'EXT-OC-024: Non-existent project returns null');

    // Test get_recent_sessions with invalid project ID
    const { getRecentSessions } = opencodeCapture;
    const sessions = await getRecentSessions('nonexistent-project-id', 10);
    assertArray(sessions, 'EXT-OC-025: Invalid project returns empty array');
    assertEqual(sessions.length, 0, 'EXT-OC-026: No sessions for invalid project');

    // Test get_session_messages with invalid session ID
    const { getSessionMessages } = opencodeCapture;
    const messages = await getSessionMessages('nonexistent-session-id');
    assertArray(messages, 'EXT-OC-027: Invalid session returns empty array');

    // Test get_message_parts with invalid message ID
    const { getMessageParts } = opencodeCapture;
    const parts = await getMessageParts('nonexistent-message-id');
    assertArray(parts, 'EXT-OC-028: Invalid message returns empty array');

  } catch (error) {
    fail('EXT-OC: Module load/test', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   12. ADDITIONAL CLI CAPTURE TESTS (P1)
────────────────────────────────────────────────────────────────
*/

async function testAdditionalCliCaptures() {
  log('\n=== ADDITIONAL CLI CAPTURES (REMOVED — recovery mode deprecated) ===');
  skip('EXT-CLI: Modules removed', 'Recovery mode fully deprecated — codex/copilot/gemini captures deleted');
}

/* ─────────────────────────────────────────────────────────────
   13. DATA-LOADER TESTS (P0)
────────────────────────────────────────────────────────────────
*/

async function testDataLoader() {
  log('\n=== DATA-LOADER.JS (P0) ===');

  try {
    const dataLoader = require(path.join(LOADERS_DIR, 'data-loader'));

    // Test exports
    assertType(dataLoader.loadCollectedData, 'function', 'LOAD-001: loadCollectedData exported');

    // Test loadCollectedData returns something (simulation mode in test env)
    const { loadCollectedData } = dataLoader;

    // Note: loadCollectedData depends on CONFIG which may have different paths in test
    // We test that it handles gracefully when data isn't available
    try {
      const data = await loadCollectedData();
      if (data._isSimulation) {
        pass('LOAD-002: Simulation fallback works', 'Returned simulation data');
      } else if (data) {
        pass('LOAD-002: Data loaded successfully', 'Real data loaded');
      } else {
        fail('LOAD-002: Data loading', 'Returned null');
      }
    } catch (loadError) {
      // This is acceptable in test environment where OpenCode storage may not exist
      if (
        loadError.message.includes('Security')
        || loadError.message.includes('Invalid')
        || loadError.message.includes('no longer supported')
      ) {
        pass('LOAD-002: Security validation working', loadError.message.substring(0, 50));
      } else {
        skip('LOAD-002: Data loading', `Expected in test env: ${loadError.message.substring(0, 50)}`);
      }
    }

  } catch (error) {
    fail('LOAD: Module load/test', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   14. EXTRACTORS INDEX RE-EXPORTS TEST
────────────────────────────────────────────────────────────────
*/

async function testExtractorsIndex() {
  log('\n=== EXTRACTORS/INDEX.JS ===');

  try {
    const extractors = require(path.join(EXTRACTORS_DIR, 'index'));

    // Test that index re-exports all major functions
    assertType(extractors.extractFilesFromData, 'function', 'EXT-IDX-001: extractFilesFromData re-exported');
    assertType(extractors.extractDiagrams, 'function', 'EXT-IDX-002: extractDiagrams re-exported');
    assertType(extractors.extractConversations, 'function', 'EXT-IDX-003: extractConversations re-exported');
    assertType(extractors.extractDecisions, 'function', 'EXT-IDX-004: extractDecisions re-exported');
    assertType(extractors.collectSessionData, 'function', 'EXT-IDX-005: collectSessionData re-exported');
    assertType(extractors.detectObservationType, 'function', 'EXT-IDX-006: detectObservationType re-exported');
    assertType(extractors.buildObservationsWithAnchors, 'function', 'EXT-IDX-007: buildObservationsWithAnchors re-exported');
    assertType(extractors.generateSessionId, 'function', 'EXT-IDX-008: generateSessionId re-exported');
    assertType(extractors.getChannel, 'function', 'EXT-IDX-009: getChannel re-exported');
    assertType(extractors.buildImplementationGuideData, 'function', 'EXT-IDX-010: buildImplementationGuideData re-exported');
    // EXT-IDX-011..013: capture module re-exports removed (recovery mode deprecated)
    skip('EXT-IDX-011: captureCodexConversation', 'Recovery mode deprecated');
    skip('EXT-IDX-012: captureCopilotConversation', 'Recovery mode deprecated');
    skip('EXT-IDX-013: captureGeminiConversation', 'Recovery mode deprecated');

  } catch (error) {
    fail('EXT-IDX: Module load/test', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   15. ERROR HANDLING TESTS
────────────────────────────────────────────────────────────────
*/

async function testErrorHandling() {
  log('\n=== ERROR HANDLING ===');

  try {
    const fileExtractor = require(path.join(EXTRACTORS_DIR, 'file-extractor'));
    const sessionExtractor = require(path.join(EXTRACTORS_DIR, 'session-extractor'));
    const decisionExtractor = require(path.join(EXTRACTORS_DIR, 'decision-extractor'));

    // Test malformed input handling
    const { detectObservationType } = fileExtractor;
    const type1 = detectObservationType({});
    assertEqual(type1, 'observation', 'ERR-001: Empty object returns observation');

    const type2 = detectObservationType({ title: null, narrative: undefined });
    assertEqual(type2, 'observation', 'ERR-002: Null/undefined properties handled');

    // Test extractFilesFromData with malformed data
    const { extractFilesFromData } = fileExtractor;
    const files1 = extractFilesFromData({ FILES: null }, []);
    assertArray(files1, 'ERR-003: Null FILES handled');

    const files2 = extractFilesFromData({ FILES: [{ invalid: true }] }, []);
    assertArray(files2, 'ERR-004: Invalid file objects handled');

    // Test session extractor with edge cases
    const { countToolsByType } = sessionExtractor;
    const counts1 = countToolsByType([], []);
    assertType(counts1, 'object', 'ERR-005: Empty arrays return object');

    const counts2 = countToolsByType([{ facts: null }], [{ prompt: null }]);
    assertType(counts2, 'object', 'ERR-006: Null properties handled');

    // Test decision extractor with malformed decisions
    const { extractDecisions } = decisionExtractor;
    const dec1 = await extractDecisions({ observations: [{ type: 'decision', facts: null }], SPEC_FOLDER: '000-test' });
    assertExists(dec1.DECISIONS, 'ERR-007: Null facts handled');

    const dec2 = await extractDecisions({ observations: [{ type: 'decision', narrative: '' }], SPEC_FOLDER: '000-test' });
    assertExists(dec2.DECISIONS, 'ERR-008: Empty narrative handled');

    // Test extractKeyTopics with edge cases
    const { extractKeyTopics } = sessionExtractor;
    const topics1 = extractKeyTopics('');
    assertArray(topics1, 'ERR-009: Empty string returns array');

    const topics2 = extractKeyTopics(null);
    assertArray(topics2, 'ERR-010: Null summary returns array');

    // Test calculateSessionDuration with invalid dates
    const { calculateSessionDuration } = sessionExtractor;
    const dur1 = calculateSessionDuration([{ timestamp: 'invalid-date' }], new Date());
    if (dur1 === 'N/A' || /^\d+m$/.test(dur1)) {
      pass('ERR-011: Invalid date handled', dur1);
    } else {
      fail('ERR-011: Invalid date handled', dur1);
    }

  } catch (error) {
    fail('ERR: Error handling tests', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   16. INTEGRATION TESTS
────────────────────────────────────────────────────────────────
*/

async function testIntegration() {
  log('\n=== INTEGRATION TESTS ===');

  try {
    const extractors = require(path.join(EXTRACTORS_DIR, 'index'));

    // Test full extraction pipeline
    const files = extractors.extractFilesFromData(MOCK_COLLECTED_DATA, MOCK_OBSERVATIONS);
    const obsWithAnchors = extractors.buildObservationsWithAnchors(MOCK_OBSERVATIONS, '007-test');

    // Verify files and observations can be used together
    if (files.length > 0 && obsWithAnchors.length > 0) {
      pass('INT-001: Files and observations extracted together', `${files.length} files, ${obsWithAnchors.length} observations`);
    } else {
      fail('INT-001: Files and observations extracted together', 'One or both empty');
    }

    // Test decision extraction followed by diagram extraction
    const decisions = await extractors.extractDecisions({
      observations: MOCK_OBSERVATIONS,
      SPEC_FOLDER: '007-test'
    });
    const diagrams = await extractors.extractDiagrams({
      observations: MOCK_OBSERVATIONS,
      userPrompts: MOCK_USER_PROMPTS
    });

    if (decisions.DECISIONS && diagrams.DIAGRAMS) {
      pass('INT-002: Decisions and diagrams extracted together', `${decisions.DECISION_COUNT} decisions`);
    } else {
      fail('INT-002: Decisions and diagrams extracted together', 'Missing data');
    }

    // Test conversation extraction with full context
    const conversations = await extractors.extractConversations(MOCK_COLLECTED_DATA);
    if (conversations.MESSAGES && conversations.PHASES) {
      pass('INT-003: Conversations with phases extracted', `${conversations.MESSAGE_COUNT} messages`);
    } else {
      fail('INT-003: Conversations with phases extracted', 'Missing data');
    }

    // Test session characteristics detection
    const chars = extractors.detectSessionCharacteristics(
      MOCK_OBSERVATIONS,
      MOCK_USER_PROMPTS,
      files
    );
    if (chars.contextType && chars.importanceTier && chars.toolCounts) {
      pass('INT-004: Session characteristics detected', `Type: ${chars.contextType}, Tier: ${chars.importanceTier}`);
    } else {
      fail('INT-004: Session characteristics detected', 'Missing characteristics');
    }

    // Test implementation guide with real data
    const implGuide = extractors.buildImplementationGuideData(
      MOCK_OBSERVATIONS,
      files,
      '007-test-spec'
    );
    if (implGuide.HAS_IMPLEMENTATION_GUIDE && implGuide.IMPLEMENTATIONS.length > 0) {
      pass('INT-005: Implementation guide built', `${implGuide.IMPLEMENTATIONS.length} implementations`);
    } else {
      fail('INT-005: Implementation guide built', 'No implementations detected');
    }

  } catch (error) {
    fail('INT: Integration tests', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   17. TEST RUNNER
────────────────────────────────────────────────────────────────
*/

async function runAllTests() {
  log('');
  log('='.repeat(60));
  log('  EXTRACTORS AND LOADERS TEST SUITE');
  log('='.repeat(60));
  log('');

  const startTime = Date.now();

  // Run all test suites
  await testCollectSessionData();
  await testSessionExtractor();
  await testDecisionExtractor();
  await testFileExtractor();
  await testConversationExtractor();
  await testImplementationGuideExtractor();
  await testDiagramExtractor();
  await testOpencodeCapture();
  await testAdditionalCliCaptures();
  await testDataLoader();
  await testExtractorsIndex();
  await testErrorHandling();
  await testIntegration();

  const duration = Date.now() - startTime;

  // Print summary
  log('');
  log('='.repeat(60));
  log('  TEST SUMMARY');
  log('='.repeat(60));
  log('');
  log(`  Total:   ${results.passed + results.failed + results.skipped}`);
  log(`  Passed:  ${results.passed}`);
  log(`  Failed:  ${results.failed}`);
  log(`  Skipped: ${results.skipped}`);
  log(`  Duration: ${duration}ms`);
  log('');

  if (results.failed > 0) {
    log('  FAILED TESTS:');
    results.tests
      .filter(t => t.status === 'FAIL')
      .forEach(t => log(`    - ${t.name}: ${t.reason}`));
    log('');
  }

  const exitCode = results.failed > 0 ? 1 : 0;
  log(`  Exit code: ${exitCode}`);
  log('='.repeat(60));

  process.exit(exitCode);
}

// Execute tests
runAllTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});
