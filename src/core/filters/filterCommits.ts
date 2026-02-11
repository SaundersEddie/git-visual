import type { Commit } from '../types';

export type FilterOptions = {
  query: string;
  hideMerges: boolean;
};

export function filterCommits(
  commits: Commit[],
  opts: FilterOptions,
): Commit[] {
  const q = opts.query.trim().toLowerCase();

  return commits.filter((c) => {
    const parentsLen = c.parents?.length ?? 0;
    if (opts.hideMerges && parentsLen >= 2) return false;
    if (!q) return true;

    const sha = c.sha.toLowerCase();
    const author = c.author.toLowerCase();
    const msg = c.message.toLowerCase();
    const refs = (c.refs ?? []).join(' ').toLowerCase();

    return (
      sha.startsWith(q) ||
      author.includes(q) ||
      msg.includes(q) ||
      refs.includes(q)
    );
  });
}
