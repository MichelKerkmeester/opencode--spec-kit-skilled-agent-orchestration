// ───────────────────────────────────────────────────────────────
// 1. MESSAGE UTILS
// ───────────────────────────────────────────────────────────────
// Timestamp formatting, exchange summarization, and tool output truncation

// ───────────────────────────────────────────────────────────────
// 2. IMPORTS
// ───────────────────────────────────────────────────────────────
import { CONFIG } from '../core';
import { structuredLog } from './logger';

// ───────────────────────────────────────────────────────────────
// 3. TYPES
// ───────────────────────────────────────────────────────────────
/** Supported timestamp formats */
export type TimestampFormat = 'iso' | 'readable' | 'date' | 'date-dutch' | 'time' | 'time-short' | 'filename';

/** Tool call record within a message */
export interface ToolCall {
  tool?: string;
  TOOL_NAME?: string;
  command?: string;
  file_path?: string;
  result?: string;
  [key: string]: unknown;
}

/** Message record for artifact extraction */
export interface Message {
  timestamp?: string;
  toolCalls?: ToolCall[];
  prompt?: string;
  content?: string;
  [key: string]: unknown;
}

/** Summary of a conversation exchange */
export interface ExchangeSummary {
  userIntent: string;
  outcome: string;
  toolSummary: string;
  fullSummary: string;
}

/** File artifact entry */
export interface FileArtifact {
  path: string;
  timestamp?: string;
}

/** Command artifact entry */
export interface CommandArtifact {
  command: string;
  timestamp?: string;
}

/** Error artifact entry */
export interface ErrorArtifact {
  error: string;
  timestamp?: string;
}

/** Extracted artifacts from messages */
export interface KeyArtifacts {
  filesCreated: FileArtifact[];
  filesModified: FileArtifact[];
  commandsExecuted: CommandArtifact[];
  errorsEncountered: ErrorArtifact[];
}

// ───────────────────────────────────────────────────────────────
// 4. TIMESTAMP FORMATTING
// ───────────────────────────────────────────────────────────────
// NOTE: Similar to lib/simulation-factory.ts:formatTimestamp but differs in:
// - Applies CONFIG.TIMEZONE_OFFSET_HOURS adjustment (simulation-factory uses raw UTC)
// - Logs structuredLog warn for invalid dates (simulation-factory silently falls back)
// - Logs structuredLog warn for unknown format (simulation-factory returns raw ISO string)
function formatTimestamp(date: Date | string | number = new Date(), format: TimestampFormat = 'iso'): string {
  const d: Date = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) {
    structuredLog('warn', `Invalid date: ${date}, using current time`);
    return formatTimestamp(new Date(), format);
  }

  const offsetMs: number = CONFIG.TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000;
  const adjustedDate: Date = new Date(d.getTime() + offsetMs);

  const isoString: string = adjustedDate.toISOString();
  const [datePart, timePart] = isoString.split('T');
  const timeWithoutMs: string = timePart.split('.')[0];

  switch (format) {
    case 'iso':
      return isoString.split('.')[0] + 'Z';

    case 'readable':
      return `${datePart} @ ${timeWithoutMs}`;

    case 'date':
      return datePart;

    case 'date-dutch': {
      const [year, month, day] = datePart.split('-');
      const shortYear: string = year.slice(-2);
      return `${day}-${month}-${shortYear}`;
    }

    case 'time':
      return timeWithoutMs;

    case 'time-short': {
      const [hours, minutes] = timeWithoutMs.split(':');
      return `${hours}-${minutes}`;
    }

    case 'filename':
      return `${datePart}_${timeWithoutMs.replace(/:/g, '-')}`;

    default:
      structuredLog('warn', `Unknown timestamp format "${format}", using ISO`);
      return isoString;
  }
}

// ───────────────────────────────────────────────────────────────
// 5. OUTPUT TRUNCATION
// ───────────────────────────────────────────────────────────────
function truncateToolOutput(output: string, maxLines: number = CONFIG.MAX_TOOL_OUTPUT_LINES): string {
  if (!output) return '';

  const lines: string[] = output.split('\n');

  if (lines.length <= maxLines) {
    return output;
  }

  const truncateFirstLines: number = CONFIG.TRUNCATE_FIRST_LINES;
  const truncateLastLines: number = CONFIG.TRUNCATE_LAST_LINES;

  const firstLines: string[] = lines.slice(0, truncateFirstLines);
  const lastLines: string[] = lines.slice(-truncateLastLines);
  const truncatedCount: number = lines.length - truncateFirstLines - truncateLastLines;

  return [
    ...firstLines,
    '',
    `... [Truncated: ${truncatedCount} lines] ...`,
    '',
    ...lastLines
  ].join('\n');
}

// ───────────────────────────────────────────────────────────────
// 6. EXCHANGE SUMMARIZATION
// ───────────────────────────────────────────────────────────────
function summarizeExchange(userMessage: string, assistantResponse: string, toolCalls: ToolCall[] = []): ExchangeSummary {
  let userIntent: string;
  if (userMessage.length <= 200) {
    userIntent = userMessage;
  } else {
    const sentenceEnd: RegExpMatchArray | null = userMessage.substring(0, 200).match(/^(.+?[.!?])\s/);
    userIntent = sentenceEnd ? sentenceEnd[1] : userMessage.substring(0, 200) + '...';
  }

  const mainTools: string = toolCalls.slice(0, 3).map((t: ToolCall) => t.tool || t.TOOL_NAME).join(', ');
  const toolSummary: string = toolCalls.length > 0
    ? ` Used tools: ${mainTools}${toolCalls.length > 3 ? ` and ${toolCalls.length - 3} more` : ''}.`
    : '';

  const sentences: RegExpMatchArray | null = assistantResponse.match(/[^.!?]+[.!?]+/g);
  const outcome: string = sentences && sentences.length > 0
    ? sentences.slice(0, 2).join(' ').trim()
    : assistantResponse.substring(0, 300);

  return {
    userIntent,
    outcome: outcome + (outcome.length < assistantResponse.length ? '...' : ''),
    toolSummary,
    fullSummary: `${userIntent} \u2192 ${outcome}${toolSummary}`
  };
}

// ───────────────────────────────────────────────────────────────
// 7. ARTIFACT EXTRACTION
// ───────────────────────────────────────────────────────────────
function extractKeyArtifacts(messages: Message[]): KeyArtifacts {
  const artifacts: KeyArtifacts = {
    filesCreated: [],
    filesModified: [],
    commandsExecuted: [],
    errorsEncountered: []
  };

  for (const msg of messages) {
    if (!msg.toolCalls) continue;

    for (const tool of msg.toolCalls) {
      const toolName: string = (tool.tool || tool.TOOL_NAME || '').toLowerCase();

      if (toolName === 'write') {
        artifacts.filesCreated.push({
          path: tool.file_path || 'unknown',
          timestamp: msg.timestamp
        });
      } else if (toolName === 'edit') {
        artifacts.filesModified.push({
          path: tool.file_path || 'unknown',
          timestamp: msg.timestamp
        });
      } else if (toolName === 'bash') {
        artifacts.commandsExecuted.push({
          command: tool.command || 'unknown',
          timestamp: msg.timestamp
        });
      }

      if (tool.result && typeof tool.result === 'string') {
        if (tool.result.includes('Error:') || tool.result.includes('error:')) {
          artifacts.errorsEncountered.push({
            error: tool.result.substring(0, 200),
            timestamp: msg.timestamp
          });
        }
      }
    }
  }

  return artifacts;
}

// ───────────────────────────────────────────────────────────────
// 8. EXPORTS
// ───────────────────────────────────────────────────────────────
export {
  formatTimestamp,
  truncateToolOutput,
  summarizeExchange,
  extractKeyArtifacts,
};
