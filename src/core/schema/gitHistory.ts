import { z } from 'zod';
import type { Commit } from '../types';

export const CommitSchema: z.ZodType<Commit> = z.object({
  sha: z.string().min(1, 'sha is required'),
  parents: z.array(z.string().min(1)).default([]),
  author: z.string().min(1, 'author is required'),
  date: z.string().datetime({ message: 'date must be an ISO datetime string' }),
  message: z.string().min(1, 'message is required'),
  refs: z.array(z.string().min(1)).optional().default([]),
});

export const HistorySchema = z.object({
  repoName: z.string().optional(),
  generatedAt: z.string().datetime().optional(),
  commits: z.array(CommitSchema).min(1, 'commits must not be empty'),
});

export type History = z.infer<typeof HistorySchema>;

export type ParseOk = { ok: true; history: History };
export type ParseErr = { ok: false; error: string };

export function parseHistoryJson(text: string): ParseOk | ParseErr {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: 'Invalid JSON (could not parse).' };
  }

  const result = HistorySchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.slice(0, 6).map((i) => {
      const path = i.path.length ? i.path.join('.') : '(root)';
      return `• ${path}: ${i.message}`;
    });
    const more =
      result.error.issues.length > 6
        ? `\n…and ${result.error.issues.length - 6} more.`
        : '';
    return {
      ok: false,
      error: `Schema validation failed:\n${issues.join('\n')}${more}`,
    };
  }

  return { ok: true, history: result.data };
}
