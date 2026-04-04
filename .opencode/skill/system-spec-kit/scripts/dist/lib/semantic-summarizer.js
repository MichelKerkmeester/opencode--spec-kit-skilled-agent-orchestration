"use strict";
// ---------------------------------------------------------------
// MODULE: Semantic Summarizer
// ---------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGE_TYPES = void 0;
exports.classifyMessage = classifyMessage;
exports.classifyMessages = classifyMessages;
exports.extractFileChanges = extractFileChanges;
exports.extractDecisions = extractDecisions;
exports.generateImplementationSummary = generateImplementationSummary;
exports.buildWeightedEmbeddingSections = buildWeightedEmbeddingSections;
exports.formatSummaryAsMarkdown = formatSummaryAsMarkdown;
// ───────────────────────────────────────────────────────────────
// 1. SEMANTIC SUMMARIZER
// ───────────────────────────────────────────────────────────────
// Node stdlib
const os_1 = __importDefault(require("os"));
// Internal modules
const semantic_signal_extractor_1 = require("./semantic-signal-extractor");
const file_helpers_1 = require("../utils/file-helpers");
const core_1 = require("../core");
// ───────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────
const MESSAGE_TYPES = {
    INTENT: 'intent',
    PLAN: 'plan',
    IMPLEMENTATION: 'implementation',
    RESULT: 'result',
    DECISION: 'decision',
    QUESTION: 'question',
    CONTEXT: 'context',
};
exports.MESSAGE_TYPES = MESSAGE_TYPES;
// Classification patterns - order matters: specific first, generic last
const CLASSIFICATION_PATTERNS = {
    [MESSAGE_TYPES.DECISION]: [
        /(?:Selected:|Chose:|user chose|user selected|decision made|user decision)/i,
        /^(?:Option\s+)?[A-D](?:\)|:|\s*[-\u2013])/i,
        /(?:selected option|picked option|chose option)/i,
    ],
    [MESSAGE_TYPES.IMPLEMENTATION]: [
        /(?:^Created|^Modified|^Edited|^Wrote|^Added|^Removed|^Changed|^Fixed)\s+[`"']?[\w./-]+/i,
        /(?:Edit|Write)\s*\([^)]*file_path/i,
        /(?:\.js|\.ts|\.md|\.json|\.sh|\.css|\.py)\s*(?:file|module|script)?/i,
        /(?:function|class|const|let|var|export|import)\s+\w+/i,
    ],
    [MESSAGE_TYPES.RESULT]: [
        /(?:complete[d!]?|done[!]?|finished|success)/i,
        /(?:tests? pass|all tests|verified|confirmed)/i,
        /(?:## Implementation Complete|## Summary|## Results|\u2705|\u2713)/i,
        /^(?:It works|Working|Fixed|Resolved)/i,
    ],
    [MESSAGE_TYPES.PLAN]: [
        /(?:^I'll|^Let me|^First,|^Then,|^Next,|^Finally,)/i,
        /(?:plan|approach|strategy|steps to|phases)/i,
        /(?:todo|task list|checklist)/i,
        /(?:^#+\s*Plan|Implementation Plan|will need to)/i,
    ],
    [MESSAGE_TYPES.INTENT]: [
        /^(?:I want|I need|Please|Help me|I'd like|Analyze|Implement|Create|Fix|Improve)/i,
        /^(?:Can you|Could you|Would you)\s+(?:help|implement|create|add|build|fix)/i,
    ],
    [MESSAGE_TYPES.QUESTION]: [
        /^(?:Which|What|How|Where|When|Why|Should|Is|Are|Does|Do).+\?$/i,
    ],
    [MESSAGE_TYPES.CONTEXT]: [],
};
const DESC_MIN_LENGTH = 10;
const DESC_MAX_LENGTH = 100;
const FRONTMATTER_RE = /^---[\s\S]*?\n---\s*\n?/;
// ───────────────────────────────────────────────────────────────
// 4. MESSAGE CLASSIFICATION
// ───────────────────────────────────────────────────────────────
function classifyMessage(content) {
    if (!content || typeof content !== 'string') {
        return MESSAGE_TYPES.CONTEXT;
    }
    const normalized = content.trim();
    for (const [type, patterns] of Object.entries(CLASSIFICATION_PATTERNS)) {
        for (const pattern of patterns) {
            if (pattern.test(normalized)) {
                return type;
            }
        }
    }
    return MESSAGE_TYPES.CONTEXT;
}
function classifyMessages(messages) {
    const classified = new Map();
    for (const type of Object.values(MESSAGE_TYPES)) {
        classified.set(type, []);
    }
    for (const msg of messages) {
        const content = msg.prompt || msg.content || msg.CONTENT || '';
        const type = classifyMessage(content);
        const bucket = classified.get(type);
        if (bucket)
            bucket.push({
                ...msg,
                _semanticType: type,
            });
    }
    return classified;
}
// ───────────────────────────────────────────────────────────────
// 5. FILE CHANGE EXTRACTION
// ───────────────────────────────────────────────────────────────
function findFilePosition(content, filePath, searchFrom = 0) {
    const searchContent = content.substring(searchFrom);
    const index = searchContent.indexOf(filePath);
    return index === -1 ? -1 : searchFrom + index;
}
function extractFileChanges(messages, observations = []) {
    const fileChanges = new Map();
    const filePatterns = {
        created: /(?:created?|wrote?|new file|Write\()/i,
        modified: /(?:modified|edited|changed|updated|Edit\()/i,
        deleted: /(?:deleted|removed|rm\s)/i,
        renamed: /(?:renamed|moved|mv\s)/i,
        read: /(?:read|Read\()/i,
    };
    const extractFilePaths = (text) => {
        const paths = [];
        const quotedPaths = text.match(/["'`]([^"'`]+\.[a-zA-Z]{1,10})["'`]/g);
        if (quotedPaths) {
            paths.push(...quotedPaths.map((p) => p.replace(/["'`]/g, '')));
        }
        const extensionPaths = text.match(/(?:^|[\s(])([./\w-]+\.(?:js|ts|jsx|tsx|json|jsonc|md|sh|css|html|py|yaml|yml))/gi);
        if (extensionPaths) {
            paths.push(...extensionPaths.map((p) => p.trim().replace(/^[(]/, '')));
        }
        return [...new Set(paths)];
    };
    for (const msg of messages) {
        const content = msg.prompt || msg.content || msg.CONTENT || '';
        const type = classifyMessage(content);
        if (type === MESSAGE_TYPES.IMPLEMENTATION || type === MESSAGE_TYPES.RESULT || extractFilePaths(content).length > 0) {
            const paths = extractFilePaths(content);
            let lastSearchPosition = 0;
            for (const filePath of paths) {
                let action = 'modified';
                for (const [action_type, pattern] of Object.entries(filePatterns)) {
                    if (pattern.test(content)) {
                        action = action_type;
                        break;
                    }
                }
                if (action === 'read' && !content.match(/(?:renamed|\bmoved\b|mv\s)/i))
                    continue;
                const fileIndex = findFilePosition(content, filePath, lastSearchPosition);
                if (fileIndex === -1) {
                    const fallbackIndex = content.indexOf(filePath);
                    if (fallbackIndex === -1)
                        continue;
                    const contextStart = Math.max(0, fallbackIndex - 100);
                    const contextEnd = Math.min(content.length, fallbackIndex + filePath.length + 200);
                    const context = content.substring(contextStart, contextEnd);
                    const description = extractChangeDescription(context, filePath);
                    if (!fileChanges.has(filePath)) {
                        fileChanges.set(filePath, { action, description, changes: [], mentions: 1 });
                    }
                    continue;
                }
                lastSearchPosition = fileIndex + filePath.length;
                const contextStart = Math.max(0, fileIndex - 100);
                const contextEnd = Math.min(content.length, fileIndex + filePath.length + 200);
                const context = content.substring(contextStart, contextEnd);
                const description = extractChangeDescription(context, filePath);
                if (!fileChanges.has(filePath)) {
                    fileChanges.set(filePath, {
                        action,
                        description,
                        changes: [],
                        mentions: 1,
                    });
                }
                else {
                    const existing = fileChanges.get(filePath);
                    if (existing) {
                        existing.mentions++;
                        if (description.length > existing.description.length) {
                            existing.description = description;
                        }
                        if (action === 'created' && existing.action !== 'created') {
                            existing.action = action;
                        }
                    }
                }
            }
        }
    }
    for (const obs of observations) {
        if (obs.files && Array.isArray(obs.files)) {
            const narrative = obs.narrative || '';
            for (const file of obs.files) {
                if (!fileChanges.has(file)) {
                    const description = extractChangeDescription(narrative, file);
                    fileChanges.set(file, {
                        action: 'modified',
                        description: description,
                        changes: [],
                        mentions: 1,
                    });
                }
            }
        }
    }
    return fileChanges;
}
// ───────────────────────────────────────────────────────────────
// 6. DESCRIPTION UTILITIES
// ───────────────────────────────────────────────────────────────
// CleanDescription is imported from '../utils/file-helpers' (canonical location)
// NOTE: Similar to utils/file-helpers.ts:isDescriptionValid but differs in garbage patterns.
// This version has 3 additional patterns (/^changed?$/i, /^no description available$/i, /^modified?$/i)
// Specifically needed for semantic extraction where these edge cases arise more frequently.
function isDescriptionValid(description) {
    if (!description || description.length < 8)
        return false;
    const garbagePatterns = [
        /^#+\s/,
        /^[-*]\s/,
        /\s(?:and|or|to|the)\s*$/i,
        /^(?:modified?|updated?)\s+\w+$/i,
        /^filtering\s+(?:pipeline|system)$/i,
        /^And\s+[`'"]?/i,
        /^modified? during session$/i,
        /^changed?$/i,
        /^no description available$/i,
        /^modified?$/i,
        /\[PLACEHOLDER\]/i,
    ];
    return !garbagePatterns.some((p) => p.test(description));
}
/** Caps context at 500 chars to prevent regex backtracking */
function extractChangeDescription(context, filePath) {
    const safeContext = context.substring(0, core_1.CONFIG.MAX_CONTENT_PREVIEW);
    const filename = filePath.replace(/\\/g, '/').split('/').pop() || '';
    const filenameNoExt = filename.replace(/\.[^.]+$/, '');
    const escapedFilename = filenameNoExt.replace(/[-.*+?^${}()|[\]\\]/g, '\\$&');
    const fileSpecificPatterns = [
        new RegExp(`(?:updated?|modified?|changed?|fixed?|edited?)\\s+(?:the\\s+)?['"\`]?${escapedFilename}(?:\\.\\w+)?['"\`]?\\s+(?:to\\s+)?(.{15,100}?)(?:\\s*[.!,]|$)`, 'i'),
        new RegExp(`${escapedFilename}(?:\\.\\w+)?\\s*[:\\-\u2013\u2014]\\s*(.{15,100}?)(?:\\s*[.!,\\n]|$)`, 'i'),
        new RegExp(`(?:in|for|to)\\s+['"\`]?${escapedFilename}(?:\\.\\w+)?['"\`]?[,:]?\\s+(?:we\\s+)?(.{15,100}?)(?:\\s*[.!,]|$)`, 'i'),
        new RegExp(`(?:added?|implemented?|created?)\\s+(.{15,80}?)\\s+(?:to|in|for)\\s+['"\`]?${escapedFilename}`, 'i'),
        new RegExp(`(?:the\\s+)?${escapedFilename}(?:\\.\\w+)?\\s+(?:now\\s+)?(?:handles?|provides?|implements?|contains?)\\s+(.{15,80}?)(?:\\s*[.!,]|$)`, 'i'),
        new RegExp(`['"\`]?${escapedFilename}['"\`]?\\s+(?:now\\s+)?(?:supports?|includes?)\\s+(.{10,80})`, 'i'),
        new RegExp(`modified\\s+['"\`]?${escapedFilename}['"\`]?,\\s+(?:adding|removing|implementing)\\s+(.{10,80})`, 'i'),
    ];
    for (const pattern of fileSpecificPatterns) {
        const match = safeContext.match(pattern);
        if (match && match[1]) {
            let desc = match[1].trim();
            if (desc.includes(filePath) || desc.toLowerCase().includes(filenameNoExt.toLowerCase()))
                continue;
            desc = (0, file_helpers_1.cleanDescription)(desc);
            if (desc.length >= DESC_MIN_LENGTH && desc.length <= DESC_MAX_LENGTH && isDescriptionValid(desc)) {
                return desc;
            }
        }
    }
    const withPatterns = [
        /with\s+(.{10,80}?)(?:\s*[.!,]|$)/i,
        /to\s+(?:add|apply|integrate|include|remove|fix|enhance|validate)\s+(.{10,80}?)(?:\s*[.!,]|$)/i,
        /for\s+(.{10,80}?)(?:\s*[.!,]|$)/i,
        /replaced\s+(.{5,40})\s+with\s+(.{5,40})/i,
    ];
    for (const pattern of withPatterns) {
        const match = safeContext.match(pattern);
        if (match && match[1]) {
            let desc = match[1].trim();
            if (match[2]) {
                desc = `Replaced ${match[1].trim()} with ${match[2].trim()}`;
            }
            if (desc.includes(filePath) || desc.includes(filename))
                continue;
            desc = (0, file_helpers_1.cleanDescription)(desc);
            if (desc.length >= DESC_MIN_LENGTH && desc.length <= DESC_MAX_LENGTH && !/^(the|a|an)\s/i.test(desc)) {
                return desc;
            }
        }
    }
    const actionPatterns = [
        /(\d+-stage\s+\w+\s+pipeline)/i,
        /((?:filtering|content|semantic|noise|validation|processing|analysis|transformation)\s+(?:module|pipeline|system|logic))/i,
        /(configurable\s+.{5,30}\s+(?:settings|config|options|behavior))/i,
        /:\s*(.{10,60}?)(?:\s*[.!,\n]|$)/,
    ];
    for (const pattern of actionPatterns) {
        const match = safeContext.match(pattern);
        if (match && match[1]) {
            let desc = match[1].trim();
            if (desc.includes(filePath) || desc.includes(filename))
                continue;
            desc = (0, file_helpers_1.cleanDescription)(desc);
            if (desc.length >= DESC_MIN_LENGTH && desc.length <= DESC_MAX_LENGTH) {
                return desc;
            }
        }
    }
    const humanReadable = filenameNoExt
        .replace(/[-_]/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase();
    return `Updated ${humanReadable}`;
}
// ───────────────────────────────────────────────────────────────
// 7. DECISION EXTRACTION
// ───────────────────────────────────────────────────────────────
function extractDecisions(messages) {
    const decisions = [];
    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        const content = msg.prompt || msg.content || msg.CONTENT || '';
        const type = classifyMessage(content);
        if (type === MESSAGE_TYPES.DECISION) {
            let question = '';
            if (i > 0) {
                const prevContent = messages[i - 1].prompt || messages[i - 1].content || '';
                const questionMatch = prevContent.match(/([^.!?]+\?)/);
                if (questionMatch) {
                    question = questionMatch[1].trim();
                }
            }
            const choicePatterns = [
                /(?:chose|selected|picked)\s*[:"']?\s*([A-D](?:\)|:|\s)|.{5,50})/i,
                /^(?:Option\s+)?([A-D])(?:\)|:|\s)/i,
                /^([A-D])\s*[-\u2013]\s*(.+)/i,
            ];
            for (const pattern of choicePatterns) {
                const match = content.match(pattern);
                if (match) {
                    decisions.push({
                        question: question || 'User decision',
                        choice: match[1]?.trim() || content.substring(0, 50),
                        context: content.substring(0, 100),
                    });
                    break;
                }
            }
        }
    }
    return decisions;
}
// ───────────────────────────────────────────────────────────────
// 8. IMPLEMENTATION SUMMARY GENERATION
// ───────────────────────────────────────────────────────────────
function generateImplementationSummary(messages, observations = []) {
    const classified = classifyMessages(messages);
    const fileChanges = extractFileChanges(messages, observations);
    const decisions = extractDecisions(messages);
    const intentMessages = classified.get(MESSAGE_TYPES.INTENT) ?? [];
    const questionMessages = classified.get(MESSAGE_TYPES.QUESTION) ?? [];
    let task = 'Development session';
    if (intentMessages.length > 0) {
        const firstIntent = intentMessages[0].prompt || intentMessages[0].content || '';
        const taskPatterns = [
            /^(?:I want to|I need to|Please|Help me)\s+(.{15,120}?)(?:[.!?\n]|$)/i,
            /(?:implement|create|add|build|fix|improve)\s+(.{10,100}?)(?:[.!?\n]|$)/i,
            /^(.{20,120}?)(?:[.!?\n]|$)/,
        ];
        for (const pattern of taskPatterns) {
            const match = firstIntent.match(pattern);
            if (match && match[1]) {
                task = match[1].trim().replace(/[.,;:]+$/, '');
                task = task.charAt(0).toUpperCase() + task.slice(1);
                break;
            }
        }
    }
    if (task === 'Development session' && questionMessages.length > 0) {
        const firstQuestion = questionMessages[0].prompt || questionMessages[0].content || '';
        if (firstQuestion.length > 20) {
            task = firstQuestion.substring(0, 100).replace(/\?.*$/, '').trim();
        }
    }
    const planMessages = classified.get(MESSAGE_TYPES.PLAN) ?? [];
    const implMessages = classified.get(MESSAGE_TYPES.IMPLEMENTATION) ?? [];
    const resultMessages = classified.get(MESSAGE_TYPES.RESULT) ?? [];
    let solution = 'Implementation and updates';
    const allPlanImpl = [...planMessages, ...implMessages, ...resultMessages];
    if (allPlanImpl.length > 0) {
        for (const msg of allPlanImpl) {
            const content = msg.prompt || msg.content || '';
            const solutionPatterns = [
                /(?:create|implement|build)\s+(?:a\s+)?(.{15,80}?(?:pipeline|system|module|filter))/i,
                /with\s+(.{15,80}?(?:filtering|detection|processing|validation))/i,
                /(\d+-stage\s+.{10,50}?(?:pipeline|system|process))/i,
                /(?:solution|approach):\s*(.{15,100})/i,
                /(?:implement|create|add|build|fix)\s+(.{15,80}?)(?:\s+(?:to|for|that|in)|[.!]|$)/i,
                /(?:by\s+)?(?:adding|creating|implementing|fixing)\s+(.{15,80}?)(?:[.!]|$)/i,
                /(?:implemented?|added?|created?)\s+(.{15,80}?(?:for|to|that))/i,
                /^(.{20,100}?)(?:\s+(?:to|for|by)|[.!?\n])/i,
            ];
            for (const pattern of solutionPatterns) {
                const match = content.match(pattern);
                if (match && match[1]) {
                    let extracted = match[1].trim().replace(/[.,;:]+$/, '');
                    if (extracted.length >= 15 && !/^(a|the|some)\s/i.test(extracted)) {
                        solution = extracted.charAt(0).toUpperCase() + extracted.slice(1);
                        break;
                    }
                }
            }
            if (solution !== 'Implementation and updates')
                break;
        }
    }
    const filesCreated = [];
    const filesModified = [];
    for (const [filePath, info] of fileChanges) {
        const entry = {
            path: filePath.replace(new RegExp(`^${os_1.default.homedir().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/[^/]+/`), ''),
            description: info.description,
        };
        if (info.action === 'created') {
            filesCreated.push(entry);
        }
        else {
            filesModified.push(entry);
        }
    }
    const outcomes = [];
    const trimOutcomeToWordBoundary = (outcome, maxLength = 80) => {
        const trimmed = outcome.trim();
        if (trimmed.length < maxLength) {
            return trimmed;
        }
        const lastSpace = trimmed.lastIndexOf(' ');
        return lastSpace > 0 ? trimmed.slice(0, lastSpace).trim() : trimmed;
    };
    for (const msg of resultMessages.slice(0, 5)) {
        const content = msg.prompt || msg.content || '';
        const outcomePatterns = [
            /[-\u2022]\s*(.{15,80})/g,
            /(?:completed?|finished|implemented|working):\s*(.{15,80})/gi,
            /\u2713\s*(.{15,80})/g,
        ];
        for (const pattern of outcomePatterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const outcome = trimOutcomeToWordBoundary(match[1]);
                if (outcome.length > 10 && !outcomes.includes(outcome)) {
                    outcomes.push(outcome);
                    if (outcomes.length >= 5)
                        break;
                }
            }
            if (outcomes.length >= 5)
                break;
        }
    }
    const allContent = messages
        .map((m) => m.prompt || m.content || '')
        .join('\n\n');
    const triggerPhrases = semantic_signal_extractor_1.SemanticSignalExtractor.extract({
        text: allContent,
        mode: 'summary',
        stopwordProfile: 'balanced',
        ngramDepth: 3,
    }).phrases;
    return {
        task,
        solution,
        filesCreated: filesCreated,
        filesModified: filesModified,
        decisions: decisions.slice(0, 5),
        outcomes: outcomes.length > 0 ? outcomes : ['Session completed'],
        triggerPhrases: triggerPhrases,
        messageStats: {
            intent: intentMessages.length,
            plan: planMessages.length,
            implementation: implMessages.length,
            result: resultMessages.length,
            decision: decisions.length,
            total: messages.length,
        },
    };
}
function formatSummaryAsMarkdown(summary) {
    const lines = [];
    lines.push('## Implementation Summary\n');
    lines.push(`**Task:** ${summary.task}\n`);
    lines.push(`**Solution:** ${summary.solution}\n`);
    if (summary.filesCreated.length > 0) {
        lines.push('\n### Files Created');
        for (const file of summary.filesCreated) {
            lines.push(`- \`${file.path}\` - ${file.description}`);
        }
    }
    if (summary.filesModified.length > 0) {
        lines.push('\n### Files Modified');
        for (const file of summary.filesModified) {
            lines.push(`- \`${file.path}\` - ${file.description}`);
        }
    }
    if (summary.decisions.length > 0) {
        lines.push('\n### User Decisions');
        for (const decision of summary.decisions) {
            lines.push(`- **${decision.question}**: ${decision.choice}`);
        }
    }
    if (summary.outcomes.length > 0 && summary.outcomes[0] !== 'Session completed') {
        lines.push('\n### Key Outcomes');
        for (const outcome of summary.outcomes) {
            lines.push(`- ${outcome}`);
        }
    }
    if (summary.triggerPhrases && summary.triggerPhrases.length > 0) {
        lines.push('\n### Trigger Phrases');
        lines.push(`\`${summary.triggerPhrases.join('`, `')}\``);
    }
    return lines.join('\n');
}
function stripFrontmatter(markdown) {
    return markdown.replace(FRONTMATTER_RE, '');
}
function normalizeHeadingLabel(heading) {
    return heading
        .replace(/^\d+\.\s*/, '')
        .trim()
        .toLowerCase();
}
function extractMarkdownTitle(markdown) {
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    return titleMatch ? titleMatch[1].trim() : '';
}
function extractMarkdownSection(markdown, headingNames) {
    const headingPattern = /^#{1,6}\s+(.+)$/gm;
    const headings = Array.from(markdown.matchAll(headingPattern));
    const normalizedHeadingNames = headingNames.map((name) => name.toLowerCase());
    for (let index = 0; index < headings.length; index++) {
        const heading = headings[index];
        const label = normalizeHeadingLabel(heading[1] || '');
        if (!normalizedHeadingNames.includes(label)) {
            continue;
        }
        const start = heading.index ?? 0;
        const contentStart = start + heading[0].length;
        const end = index + 1 < headings.length
            ? (headings[index + 1].index ?? markdown.length)
            : markdown.length;
        const content = markdown.slice(contentStart, end).trim();
        return {
            content,
            start,
            end,
        };
    }
    return null;
}
function extractSectionBullets(sectionContent) {
    return sectionContent
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => /^[-*]\s+/.test(line))
        .map((line) => line.replace(/^[-*]\s+/, '').trim())
        .filter(Boolean);
}
function removeMarkdownSections(markdown, sections) {
    const matches = sections
        .filter((section) => Boolean(section))
        .sort((left, right) => right.start - left.start);
    let nextMarkdown = markdown;
    for (const match of matches) {
        nextMarkdown = `${nextMarkdown.slice(0, match.start)}\n\n${nextMarkdown.slice(match.end)}`;
    }
    return nextMarkdown
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}
function buildWeightedEmbeddingSections(summary, markdownContent) {
    const markdown = stripFrontmatter(markdownContent || '');
    const decisionSection = extractMarkdownSection(markdown, ['decisions']);
    const outcomeSection = extractMarkdownSection(markdown, ['key outcomes', 'outcomes']);
    const markdownDecisions = extractSectionBullets(decisionSection?.content || '');
    const markdownOutcomes = extractSectionBullets(outcomeSection?.content || '');
    const summaryDecisions = summary.decisions.map((decision) => {
        const question = decision.question?.trim();
        const choice = decision.choice?.trim();
        return question && choice ? `${question}: ${choice}` : (choice || question || '');
    }).filter(Boolean);
    const summaryOutcomes = summary.outcomes.filter((outcome) => outcome !== 'Session completed');
    const generalFallback = removeMarkdownSections(markdown, [decisionSection, outcomeSection]);
    const fileDescriptions = [...summary.filesCreated, ...summary.filesModified]
        .map((entry) => `${entry.path}: ${entry.description}`)
        .filter(Boolean)
        .join('\n');
    const general = [summary.solution, fileDescriptions, generalFallback]
        .filter(Boolean)
        .join('\n\n')
        .trim();
    return {
        title: extractMarkdownTitle(markdown) || summary.task,
        decisions: summaryDecisions.length > 0 ? summaryDecisions : markdownDecisions,
        outcomes: summaryOutcomes.length > 0 ? summaryOutcomes : markdownOutcomes,
        general,
    };
}
//# sourceMappingURL=semantic-summarizer.js.map