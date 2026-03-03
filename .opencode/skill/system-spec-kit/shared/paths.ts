// ---------------------------------------------------------------
// MODULE: Shared Paths
// ---------------------------------------------------------------

import path from 'path';

import { getDbDir } from './config';

const DEFAULT_DB_PATH = path.join(__dirname, '../../mcp_server/database/context-index.sqlite');

export const DB_PATH: string = (() => {
  const dir = getDbDir();
  return dir ? path.resolve(process.cwd(), dir, 'context-index.sqlite') : DEFAULT_DB_PATH;
})();
