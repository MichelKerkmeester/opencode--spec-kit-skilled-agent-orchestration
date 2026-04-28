// ───────────────────────────────────────────────────────────────
// MODULE: Trusted Caller Guard
// ───────────────────────────────────────────────────────────────

import { getCallerContext, type MCPCallerContext } from '../../../lib/context/caller-context.js';

export interface TrustedCallerRejection {
  readonly ok: false;
  readonly code: 'UNTRUSTED_CALLER';
  readonly error: string;
}

export interface TrustedCallerAcceptance {
  readonly ok: true;
  readonly callerContext: MCPCallerContext;
}

export type TrustedCallerResult = TrustedCallerAcceptance | TrustedCallerRejection;

export function requireTrustedCaller(
  callerContext: MCPCallerContext | null = getCallerContext(),
): TrustedCallerResult {
  if (callerContext?.trusted === true) {
    return {
      ok: true,
      callerContext,
    };
  }

  return {
    ok: false,
    code: 'UNTRUSTED_CALLER',
    error: 'skill_graph_scan requires trusted caller context',
  };
}
