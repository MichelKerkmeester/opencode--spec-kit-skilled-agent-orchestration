"use strict";
// ---------------------------------------------------------------
// MODULE: Alignment Validator
// ---------------------------------------------------------------
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALIGNMENT_CONFIG = void 0;
exports.isArchiveFolder = isArchiveFolder;
exports.extractConversationTopics = extractConversationTopics;
exports.extractObservationKeywords = extractObservationKeywords;
exports.parseSpecFolderTopic = parseSpecFolderTopic;
exports.calculateAlignmentScore = calculateAlignmentScore;
exports.computeTelemetrySchemaDocsFieldDiffs = computeTelemetrySchemaDocsFieldDiffs;
exports.formatTelemetrySchemaDocsDriftDiffs = formatTelemetrySchemaDocsDriftDiffs;
exports.validateTelemetrySchemaDocsDrift = validateTelemetrySchemaDocsDrift;
exports.validateContentAlignment = validateContentAlignment;
exports.validateFolderAlignment = validateFolderAlignment;
// ───────────────────────────────────────────────────────────────
// 1. ALIGNMENT VALIDATOR
// ───────────────────────────────────────────────────────────────
// Validates conversation-to-spec-folder alignment using topic and keyword matching
// Node stdlib
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
// Internal modules
const prompt_utils_1 = require("../utils/prompt-utils");
/* ───────────────────────────────────────────────────────────────
   2. CONFIGURATION
------------------------------------------------------------------*/
const ALIGNMENT_CONFIG = {
    THRESHOLD: 70,
    WARNING_THRESHOLD: 50,
    ARCHIVE_PATTERNS: ['z_', 'archive', 'old', '.archived'],
    STOPWORDS: ['the', 'this', 'that', 'with', 'for', 'and', 'from', 'fix', 'update', 'add', 'remove'],
    INFRASTRUCTURE_PATTERNS: {
        'skill/system-spec-kit': ['memory', 'spec-kit', 'speckit', 'spec', 'opencode', 'retrieval', 'testing', 'manual', 'playbook', 'mutation', 'maintenance'],
        'skill/': ['skill', 'opencode'],
        'command/memory': ['memory', 'spec-kit', 'speckit', 'opencode'],
        'command/': ['command', 'opencode'],
        'agent/': ['agent', 'opencode'],
        'scripts/': ['script', 'opencode']
    },
    INFRASTRUCTURE_BONUS: 40,
    INFRASTRUCTURE_THRESHOLD: 0.5
};
exports.ALIGNMENT_CONFIG = ALIGNMENT_CONFIG;
const FALLBACK_TELEMETRY_INTERFACE_NAMES = [
    'RetrievalTelemetry',
    'LatencyMetrics',
    'ModeMetrics',
    'FallbackMetrics',
    'QualityMetrics',
];
const telemetrySchemaDocsValidationCache = {
    checked: false,
};
/* ───────────────────────────────────────────────────────────────
   2.5 ARCHIVE FILTERING
------------------------------------------------------------------*/
/** Check whether a folder name matches any archive pattern from config. */
function isArchiveFolder(name) {
    const lowerName = name.toLowerCase();
    return ALIGNMENT_CONFIG.ARCHIVE_PATTERNS.some((pattern) => lowerName.includes(pattern));
}
/* ───────────────────────────────────────────────────────────────
   2.75 TELEMETRY SCHEMA/DOCS DRIFT VALIDATION
------------------------------------------------------------------*/
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function dedupeAndSort(values) {
    return Array.from(new Set(values)).sort();
}
function extractSchemaInterfaceFields(schemaSource, interfaceName) {
    const interfacePattern = new RegExp(`interface\\s+${escapeRegExp(interfaceName)}\\s*\\{([\\s\\S]*?)\\}`, 'm');
    const match = schemaSource.match(interfacePattern);
    if (!match)
        return [];
    const fields = [];
    const fieldPattern = /^\s*([A-Za-z_][A-Za-z0-9_]*)\??\s*:/gm;
    let fieldMatch = fieldPattern.exec(match[1]);
    while (fieldMatch) {
        fields.push(fieldMatch[1]);
        fieldMatch = fieldPattern.exec(match[1]);
    }
    return dedupeAndSort(fields);
}
function extractDocsInterfaceFields(docsSource, interfaceName) {
    const headingPattern = new RegExp(`^###\\s+${escapeRegExp(interfaceName)}\\s*$`, 'm');
    const headingMatch = headingPattern.exec(docsSource);
    if (!headingMatch)
        return [];
    const startIndex = headingMatch.index + headingMatch[0].length;
    const tail = docsSource.slice(startIndex);
    const nextHeadingMatch = tail.match(/^###\s+/m);
    const section = nextHeadingMatch ? tail.slice(0, nextHeadingMatch.index) : tail;
    const fields = [];
    const fieldPattern = /^\|\s*`([^`]+)`\s*\|/gm;
    let fieldMatch = fieldPattern.exec(section);
    while (fieldMatch) {
        fields.push(fieldMatch[1].trim());
        fieldMatch = fieldPattern.exec(section);
    }
    return dedupeAndSort(fields);
}
function extractTelemetryInterfaceNames(schemaSource) {
    const interfacePattern = /interface\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{/g;
    const names = [];
    let match = interfacePattern.exec(schemaSource);
    while (match) {
        const interfaceName = match[1];
        if (/Telemetry|Metrics|Trace/i.test(interfaceName)) {
            names.push(interfaceName);
        }
        match = interfacePattern.exec(schemaSource);
    }
    const deduped = dedupeAndSort(names);
    if (deduped.length > 0) {
        return deduped;
    }
    return [...FALLBACK_TELEMETRY_INTERFACE_NAMES];
}
function computeTelemetrySchemaDocsFieldDiffs(schemaSource, docsSource) {
    const diffs = [];
    const interfaceNames = extractTelemetryInterfaceNames(schemaSource);
    for (const interfaceName of interfaceNames) {
        const schemaFields = extractSchemaInterfaceFields(schemaSource, interfaceName);
        const docsFields = extractDocsInterfaceFields(docsSource, interfaceName);
        const docsFieldSet = new Set(docsFields);
        const schemaFieldSet = new Set(schemaFields);
        const schemaOnlyFields = schemaFields.filter((field) => !docsFieldSet.has(field));
        const docsOnlyFields = docsFields.filter((field) => !schemaFieldSet.has(field));
        if (schemaOnlyFields.length > 0 || docsOnlyFields.length > 0) {
            diffs.push({
                interfaceName,
                schemaOnlyFields,
                docsOnlyFields,
            });
        }
    }
    return diffs;
}
function formatTelemetrySchemaDocsDriftDiffs(diffs) {
    const lines = ['Field-level differences:'];
    for (const diff of diffs) {
        lines.push(`- ${diff.interfaceName}`);
        for (const field of diff.schemaOnlyFields) {
            lines.push(`  + ${field} (schema-only)`);
        }
        for (const field of diff.docsOnlyFields) {
            lines.push(`  - ${field} (docs-only)`);
        }
    }
    return lines.join('\n');
}
function formatPathForMessage(filePath) {
    const relative = path.relative(process.cwd(), filePath);
    return relative && !relative.startsWith('..') ? relative : filePath;
}
async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    }
    catch (error) {
        if (error instanceof Error) {
            return false;
        }
        return false;
    }
}
async function resolveTelemetrySchemaDocsPaths() {
    const rootCandidates = [
        path.resolve(__dirname, '..', '..'),
        path.resolve(__dirname, '..', '..', '..'),
    ];
    for (const rootDir of rootCandidates) {
        const schemaPath = path.join(rootDir, 'mcp_server', 'lib', 'telemetry', 'retrieval-telemetry.ts');
        const docsPath = path.join(rootDir, 'mcp_server', 'lib', 'telemetry', 'README.md');
        if (await fileExists(schemaPath) && await fileExists(docsPath)) {
            return { schemaPath, docsPath };
        }
    }
    throw new Error('Unable to locate telemetry schema/docs files for drift validation: expected mcp_server/lib/telemetry/retrieval-telemetry.ts and README.md');
}
async function validateTelemetrySchemaDocsDrift(options = {}) {
    const useCache = options.useCache !== false &&
        typeof options.schemaPath !== 'string' &&
        typeof options.docsPath !== 'string';
    if (useCache && telemetrySchemaDocsValidationCache.checked) {
        return;
    }
    let schemaPath = options.schemaPath;
    let docsPath = options.docsPath;
    if (!schemaPath || !docsPath) {
        const defaultPaths = await resolveTelemetrySchemaDocsPaths();
        schemaPath = schemaPath || defaultPaths.schemaPath;
        docsPath = docsPath || defaultPaths.docsPath;
    }
    const schemaSource = await fs.readFile(schemaPath, 'utf-8');
    const docsSource = await fs.readFile(docsPath, 'utf-8');
    const diffs = computeTelemetrySchemaDocsFieldDiffs(schemaSource, docsSource);
    if (diffs.length > 0) {
        const message = [
            `Telemetry schema/docs drift detected between "${formatPathForMessage(schemaPath)}" and "${formatPathForMessage(docsPath)}".`,
            formatTelemetrySchemaDocsDriftDiffs(diffs),
        ].join('\n');
        const error = new Error(message);
        if (useCache) {
            telemetrySchemaDocsValidationCache.checked = false;
        }
        throw error;
    }
    if (useCache) {
        telemetrySchemaDocsValidationCache.checked = true;
    }
}
/* ───────────────────────────────────────────────────────────────
   3. TOPIC EXTRACTION
------------------------------------------------------------------*/
function extractConversationTopics(collectedData) {
    const topics = new Set();
    if (collectedData?.recentContext?.[0]?.request) {
        const request = collectedData.recentContext[0].request.toLowerCase();
        const words = request.match(/\b[a-z]{3,}\b/gi) || [];
        words.forEach((w) => topics.add(w.toLowerCase()));
    }
    if (collectedData?.observations) {
        for (const obs of collectedData.observations.slice(0, 3)) {
            if (obs.title) {
                const words = obs.title.match(/\b[a-z]{3,}\b/gi) || [];
                words.forEach((w) => topics.add(w.toLowerCase()));
            }
        }
    }
    return Array.from(topics).filter((t) => !ALIGNMENT_CONFIG.STOPWORDS.includes(t) && t.length >= 3);
}
function extractObservationKeywords(collectedData) {
    const keywords = new Set();
    if (!collectedData?.observations)
        return [];
    for (const obs of collectedData.observations.slice(0, 10)) {
        if (obs.title) {
            const titleWords = obs.title.match(/\b[a-z]{3,}\b/gi) || [];
            titleWords.forEach((w) => keywords.add(w.toLowerCase()));
        }
        if (obs.narrative) {
            const narrativeSnippet = obs.narrative.substring(0, 200);
            const narrativeWords = narrativeSnippet.match(/\b[a-z]{3,}\b/gi) || [];
            narrativeWords.forEach((w) => keywords.add(w.toLowerCase()));
        }
        if (obs.files) {
            for (const file of obs.files) {
                const filename = path.basename(file).replace(/\.[^.]+$/, '');
                const fileWords = filename.split(/[-_.]/).filter((w) => w.length >= 3);
                fileWords.forEach((w) => keywords.add(w.toLowerCase()));
            }
        }
    }
    return Array.from(keywords).filter((k) => !ALIGNMENT_CONFIG.STOPWORDS.includes(k) && k.length >= 3);
}
/* ───────────────────────────────────────────────────────────────
   3.5 WORK DOMAIN DETECTION
------------------------------------------------------------------*/
function detectWorkDomain(collectedData) {
    const files = [];
    if (collectedData?.observations) {
        for (const obs of collectedData.observations) {
            if (obs.files) {
                files.push(...obs.files);
            }
        }
    }
    if (collectedData?.recentContext) {
        for (const ctx of collectedData.recentContext) {
            if (ctx.files) {
                files.push(...ctx.files);
            }
        }
    }
    if (files.length === 0) {
        return { domain: 'project', subpath: null, confidence: 0, patterns: [] };
    }
    const normalizedFiles = files.map((f) => f.replace(/\\/g, '/'));
    const opencodeFiles = normalizedFiles.filter((f) => f.includes('.opencode/') || f.includes('/.opencode/'));
    const opencodeRatio = opencodeFiles.length / normalizedFiles.length;
    if (opencodeRatio < ALIGNMENT_CONFIG.INFRASTRUCTURE_THRESHOLD) {
        return { domain: 'project', subpath: null, confidence: 1 - opencodeRatio, patterns: [] };
    }
    let detectedSubpath = null;
    let matchedPatterns = [];
    for (const [subpath, patterns] of Object.entries(ALIGNMENT_CONFIG.INFRASTRUCTURE_PATTERNS)) {
        const matchingFiles = opencodeFiles.filter((f) => f.includes(`.opencode/${subpath}`));
        if (matchingFiles.length > 0) {
            if (!detectedSubpath || subpath.length > detectedSubpath.length) {
                detectedSubpath = subpath;
                matchedPatterns = patterns;
            }
        }
    }
    return {
        domain: 'opencode',
        subpath: detectedSubpath,
        confidence: opencodeRatio,
        patterns: matchedPatterns
    };
}
function calculateAlignmentScoreWithDomain(conversationTopics, specFolderName, workDomain = null) {
    const baseScore = calculateAlignmentScore(conversationTopics, specFolderName);
    if (!workDomain || workDomain.domain !== 'opencode') {
        return baseScore;
    }
    const folderLower = specFolderName.toLowerCase();
    const patterns = workDomain.patterns || [];
    let infrastructureBonus = 0;
    for (const pattern of patterns) {
        if (folderLower.includes(pattern)) {
            infrastructureBonus = ALIGNMENT_CONFIG.INFRASTRUCTURE_BONUS;
            break;
        }
    }
    return baseScore + infrastructureBonus;
}
/* ───────────────────────────────────────────────────────────────
   4. SCORE CALCULATION
------------------------------------------------------------------*/
function parseSpecFolderTopic(folderName) {
    // Accept full relative paths (with / separators) and extract topics from ALL segments
    // e.g., "014-manual-testing-per-playbook/001-retrieval" → ["manual", "testing", "per", "playbook", "retrieval"]
    const segments = folderName.split('/').filter((s) => s.length > 0);
    const allTopics = [];
    for (const segment of segments) {
        const topic = segment.replace(/^\d+-/, '');
        const words = topic.split(/[-_]/).filter((w) => w.length > 0);
        allTopics.push(...words);
    }
    return [...new Set(allTopics)];
}
function calculateAlignmentScore(conversationTopics, specFolderName) {
    const specTopics = parseSpecFolderTopic(specFolderName);
    if (specTopics.length === 0)
        return 0;
    let matches = 0;
    for (const specTopic of specTopics) {
        // O4-7: Use word-boundary matching instead of substring inclusion
        const topicRegex = new RegExp(`\\b${escapeRegExp(specTopic)}\\b`, 'i');
        if (conversationTopics.some((ct) => topicRegex.test(ct) || new RegExp(`\\b${escapeRegExp(ct)}\\b`, 'i').test(specTopic))) {
            matches++;
        }
    }
    return Math.round((matches / specTopics.length) * 100);
}
/* ───────────────────────────────────────────────────────────────
   5. VALIDATION FUNCTIONS
------------------------------------------------------------------*/
async function validateContentAlignment(collectedData, specFolderName, specsDir) {
    await validateTelemetrySchemaDocsDrift();
    const conversationTopics = extractConversationTopics(collectedData);
    const observationKeywords = extractObservationKeywords(collectedData);
    const combinedTopics = [...new Set([...conversationTopics, ...observationKeywords])];
    const workDomain = detectWorkDomain(collectedData);
    const baseScore = calculateAlignmentScore(combinedTopics, specFolderName);
    const domainAwareScore = calculateAlignmentScoreWithDomain(combinedTopics, specFolderName, workDomain);
    const finalScore = Math.max(baseScore, domainAwareScore);
    console.log(`   Phase 1B Alignment: ${specFolderName} (${baseScore}% match)`);
    const isInfrastructureMismatch = workDomain.domain === 'opencode' && domainAwareScore === baseScore;
    if (isInfrastructureMismatch) {
        console.log(`   Warning: INFRASTRUCTURE MISMATCH: Work is on .opencode/${workDomain.subpath || ''}`);
        console.log(`      But target folder "${specFolderName}" doesn't match infrastructure patterns`);
        console.log(`      Suggested patterns: ${workDomain.patterns.join(', ')}`);
    }
    if (finalScore >= ALIGNMENT_CONFIG.THRESHOLD && !isInfrastructureMismatch) {
        console.log('   Content aligns with target folder');
        return { proceed: true, useAlternative: false };
    }
    if (finalScore >= ALIGNMENT_CONFIG.WARNING_THRESHOLD && !isInfrastructureMismatch) {
        console.log(`   Warning: Moderate alignment (${finalScore}%) - proceeding with caution`);
        return { proceed: true, useAlternative: false };
    }
    if (isInfrastructureMismatch) {
        console.log('\n   Warning: INFRASTRUCTURE ALIGNMENT WARNING');
        console.log(`   Work domain: .opencode/${workDomain.subpath || '*'} (${Math.round(workDomain.confidence * 100)}% of files)`);
    }
    else {
        console.log('\n   Warning: ALIGNMENT WARNING: Content may not match target folder');
    }
    console.log(`   Conversation topics: ${combinedTopics.slice(0, 5).join(', ')}`);
    console.log(`   Target folder: ${specFolderName} (${baseScore}% match)\n`);
    try {
        const entries = await fs.readdir(specsDir);
        const specFolders = entries
            .filter((name) => /^\d{3}-/.test(name))
            .filter((name) => !isArchiveFolder(name))
            .sort()
            .reverse();
        const alternatives = specFolders
            .map((folder) => ({
            folder,
            score: calculateAlignmentScoreWithDomain(combinedTopics, folder, workDomain)
        }))
            .filter((alt) => alt.folder !== specFolderName && alt.score > finalScore)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
        if (alternatives.length > 0) {
            console.log('   Better matching folders found:');
            alternatives.forEach((alt, i) => {
                console.log(`   ${i + 1}. ${alt.folder} (${alt.score}% match)`);
            });
            console.log(`   ${alternatives.length + 1}. Continue with "${specFolderName}" anyway\n`);
            if (!process.stdout.isTTY || !process.stdin.isTTY) {
                if (finalScore === 0 && isInfrastructureMismatch) {
                    console.log(`   ALIGNMENT_HARD_BLOCK: Non-interactive mode with 0% alignment and infrastructure mismatch — refusing to proceed with "${specFolderName}".`);
                    return { proceed: false, useAlternative: false };
                }
                // O4-8: Block in non-interactive mode when alignment is critically low
                if (finalScore < 20) {
                    console.log(`   ALIGNMENT_HARD_BLOCK: ${finalScore}% alignment is below minimum non-interactive threshold (20%)`);
                    return { proceed: false, useAlternative: false };
                }
                console.log('   Warning: Non-interactive mode - proceeding with specified folder');
                return { proceed: true, useAlternative: false };
            }
            try {
                const choice = await (0, prompt_utils_1.promptUserChoice)(`   Select option (1-${alternatives.length + 1}): `, alternatives.length + 1);
                if (choice <= alternatives.length) {
                    console.log(`   Switching to: ${alternatives[choice - 1].folder}`);
                    return { proceed: true, useAlternative: true, selectedFolder: alternatives[choice - 1].folder };
                }
                console.log(`   Continuing with "${specFolderName}" as requested`);
                return { proceed: true, useAlternative: false };
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(`   Warning: Proceeding with "${specFolderName}"`);
                    return { proceed: true, useAlternative: false };
                }
                console.log(`   Warning: Proceeding with "${specFolderName}"`);
                return { proceed: true, useAlternative: false };
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            // Could not read alternatives - proceed with warning
        }
    }
    if (finalScore === 0 && isInfrastructureMismatch && (!process.stdout.isTTY || !process.stdin.isTTY)) {
        console.log(`   ALIGNMENT_HARD_BLOCK: 0% alignment with infrastructure mismatch and no alternatives — refusing to proceed with "${specFolderName}".`);
        return { proceed: false, useAlternative: false };
    }
    // O4-8: Block in non-interactive mode when alignment is critically low
    if (finalScore < 20 && (!process.stdout.isTTY || !process.stdin.isTTY)) {
        console.log(`   ALIGNMENT_HARD_BLOCK: ${finalScore}% alignment is below minimum non-interactive threshold (20%)`);
        return { proceed: false, useAlternative: false };
    }
    console.log(`   Warning: No better alternatives found - proceeding with "${specFolderName}"`);
    return { proceed: true, useAlternative: false };
}
async function validateFolderAlignment(collectedData, specFolderName, specsDir) {
    await validateTelemetrySchemaDocsDrift();
    const conversationTopics = extractConversationTopics(collectedData);
    const workDomain = detectWorkDomain(collectedData);
    const baseScore = calculateAlignmentScore(conversationTopics, specFolderName);
    const domainAwareScore = calculateAlignmentScoreWithDomain(conversationTopics, specFolderName, workDomain);
    const alignmentScore = Math.max(baseScore, domainAwareScore);
    console.log(`   Alignment check: ${specFolderName} (${baseScore}% match)`);
    const isInfrastructureMismatch = workDomain.domain === 'opencode' && domainAwareScore === baseScore;
    if (isInfrastructureMismatch) {
        console.log(`   Warning: Infrastructure work detected: .opencode/${workDomain.subpath || '*'}`);
    }
    if (alignmentScore >= ALIGNMENT_CONFIG.THRESHOLD && !isInfrastructureMismatch) {
        console.log('   Good alignment with selected folder');
        return { proceed: true, useAlternative: false };
    }
    if (alignmentScore >= ALIGNMENT_CONFIG.WARNING_THRESHOLD && !isInfrastructureMismatch) {
        console.log('   Warning: Moderate alignment - proceeding with caution');
        return { proceed: true, useAlternative: false };
    }
    if (isInfrastructureMismatch) {
        console.log(`\n   Warning: INFRASTRUCTURE MISMATCH (${Math.round(workDomain.confidence * 100)}% of files in .opencode/)`);
        console.log(`   Suggested folder patterns: ${workDomain.patterns.join(', ')}`);
    }
    else {
        console.log(`\n   Warning: LOW ALIGNMENT WARNING (${baseScore}% match)`);
    }
    console.log(`   The selected folder "${specFolderName}" may not match conversation content.\n`);
    try {
        const entries = await fs.readdir(specsDir);
        const specFolders = entries
            .filter((name) => /^\d{3}-/.test(name))
            .filter((name) => !isArchiveFolder(name))
            .sort()
            .reverse();
        const alternatives = specFolders
            .map((folder) => ({
            folder,
            score: calculateAlignmentScoreWithDomain(conversationTopics, folder, workDomain)
        }))
            .filter((alt) => alt.folder !== specFolderName)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
        if (alternatives.length > 0 && alternatives[0].score > alignmentScore) {
            console.log('   Better matching alternatives:');
            alternatives.forEach((alt, i) => {
                console.log(`   ${i + 1}. ${alt.folder} (${alt.score}% match)`);
            });
            console.log(`   ${alternatives.length + 1}. Continue with "${specFolderName}" anyway`);
            console.log(`   ${alternatives.length + 2}. Abort and specify different folder\n`);
            if (!process.stdout.isTTY || !process.stdin.isTTY) {
                console.log('   Warning: Non-interactive mode - proceeding with specified folder');
                return { proceed: true, useAlternative: false };
            }
            const choice = await (0, prompt_utils_1.promptUserChoice)(`   Select option (1-${alternatives.length + 2}): `, alternatives.length + 2);
            if (choice <= alternatives.length) {
                return { proceed: true, useAlternative: true, selectedFolder: alternatives[choice - 1].folder };
            }
            else if (choice === alternatives.length + 1) {
                console.log(`   Proceeding with "${specFolderName}" as requested`);
                return { proceed: true, useAlternative: false };
            }
            else {
                console.log('   Aborted. Please re-run with correct folder.');
                return { proceed: false, useAlternative: false };
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            // If we can't find alternatives, just proceed with warning
        }
    }
    console.log(`   Warning: Proceeding with "${specFolderName}" (no better alternatives found)`);
    return { proceed: true, useAlternative: false };
}
//# sourceMappingURL=alignment-validator.js.map