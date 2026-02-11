import { describe, it, expect } from 'vitest';
import { filterCommits } from '../../core/filters/filterCommits';
import type { Commit } from '../../core/types';

const commits: Commit[] = [
  {
    sha: 'mrg999',
    parents: ['def456', 'fea111'],
    author: 'Dev A',
    date: '2026-02-10T12:00:00.000Z',
    message: 'Merge feature/login into main',
    refs: ['main', 'HEAD'],
  },
  {
    sha: 'fea111',
    parents: ['abc123'],
    author: 'Dev B',
    date: '2026-02-10T11:30:00.000Z',
    message: 'login: add validation',
    refs: ['feature/login'],
  },
  {
    sha: 'def456',
    parents: ['abc123'],
    author: 'Dev A',
    date: '2026-02-10T11:00:00.000Z',
    message: 'Add README',
    refs: [],
  },
];

describe('filterCommits', () => {
  it('returns all when query empty and merges shown', () => {
    const out = filterCommits(commits, { query: '', hideMerges: false });
    expect(out).toHaveLength(3);
  });

  it('hides merges when hideMerges is true', () => {
    const out = filterCommits(commits, { query: '', hideMerges: true });
    expect(out.map((c) => c.sha)).toEqual(['fea111', 'def456']);
  });

  it('matches sha prefix', () => {
    const out = filterCommits(commits, { query: 'def', hideMerges: false });
    expect(out.map((c) => c.sha)).toEqual(['def456']);
  });

  it('matches author', () => {
    const out = filterCommits(commits, { query: 'dev b', hideMerges: false });
    expect(out.map((c) => c.sha)).toEqual(['fea111']);
  });

  it('matches message', () => {
    const out = filterCommits(commits, { query: 'readme', hideMerges: false });
    expect(out.map((c) => c.sha)).toEqual(['def456']);
  });

  it('matches refs', () => {
    const out = filterCommits(commits, {
      query: 'feature/login',
      hideMerges: false,
    });
    expect(out.map((c) => c.sha)).toEqual(['mrg999', 'fea111']);
  });
});
