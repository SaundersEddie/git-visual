import { describe, it, expect } from 'vitest';
import { computeLaneLayout } from '../../core/layout/lanes';
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
  {
    sha: 'abc123',
    parents: [],
    author: 'Dev A',
    date: '2026-02-10T10:00:00.000Z',
    message: 'Initial commit',
    refs: ['main'],
  },
];

describe('computeLaneLayout', () => {
  it('is deterministic (same input => same lanes)', () => {
    const a = computeLaneLayout(commits);
    const b = computeLaneLayout(commits);
    expect(a).toEqual(b);
  });

  it('keeps first parent on the same lane', () => {
    const layout = computeLaneLayout(commits);
    const row0 = layout.rows[0]; // mrg999
    const row2 = layout.rows[2]; // def456
    expect(row0.laneIndex).toBe(row2.laneIndex);
  });

  it('creates a merge connector to the non-first parent lane', () => {
    const layout = computeLaneLayout(commits);
    const row0 = layout.rows[0]; // mrg999
    expect(row0.merges).toHaveLength(1);
    expect(row0.merges[0].parentSha).toBe('fea111');
    expect(row0.merges[0].fromLane).toBe(row0.laneIndex);
    expect(row0.merges[0].toLane).not.toBe(row0.laneIndex);
  });
});
