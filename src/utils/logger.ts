/**
 * Environment-aware logging utility.
 * Wraps console methods and suppresses output in production builds.
 *
 * Usage:
 *   import { logger } from '@/utils/logger';
 *   logger.info('User loaded', { userId });   // Suppressed in production
 *   logger.error('DB failure', error);          // Always visible
 *   logger.warn('Deprecated API', endpoint);    // Suppressed in production
 */

const isDev = import.meta.env.DEV;

type LogArgs = unknown[];

function formatPrefix(level: string): string {
  return `[${new Date().toISOString()}] [${level}]`;
}

export const logger = {
  /** General info — suppressed in production */
  info(...args: LogArgs): void {
    if (isDev) {
      console.log(formatPrefix('INFO'), ...args);
    }
  },

  /** Debug details — suppressed in production */
  debug(...args: LogArgs): void {
    if (isDev) {
      console.debug(formatPrefix('DEBUG'), ...args);
    }
  },

  /** Warnings — suppressed in production */
  warn(...args: LogArgs): void {
    if (isDev) {
      console.warn(formatPrefix('WARN'), ...args);
    }
  },

  /** Errors — ALWAYS visible (needed for monitoring) */
  error(...args: LogArgs): void {
    console.error(formatPrefix('ERROR'), ...args);
  },
} as const;
