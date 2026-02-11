import type { Commit } from '../types';

export type MergeConnector = {
  fromLane: number;
  toLane: number;
  parentSha: string;
};

export type LayoutRow = {
  sha: string;
  laneIndex: number;
  activeLanes: boolean[]; // which lanes are "alive" on this row (for vertical lines)
  merges: MergeConnector[];
};

export type LaneLayout = {
  rows: LayoutRow[];
  laneCount: number;
};

export function computeLaneLayout(commitsNewestToOldest: Commit[]): LaneLayout {
  const lanes: Array<string | null> = [];
  const rows: LayoutRow[] = [];

  const findLane = (sha: string) => lanes.findIndex((x) => x === sha);

  const allocLane = (sha: string) => {
    const empty = lanes.findIndex((x) => x === null);
    if (empty !== -1) {
      lanes[empty] = sha;
      return empty;
    }
    lanes.push(sha);
    return lanes.length - 1;
  };

  const ensureLane = (sha: string) => {
    const existing = findLane(sha);
    return existing !== -1 ? existing : allocLane(sha);
  };

  const dedupeLaneTargets = (keepIndex: number) => {
    const target = lanes[keepIndex];
    if (!target) return;
    for (let i = 0; i < lanes.length; i++) {
      if (i !== keepIndex && lanes[i] === target) lanes[i] = null;
    }
  };

  for (const c of commitsNewestToOldest) {
    // pick lane for current commit
    let laneIndex = findLane(c.sha);
    if (laneIndex === -1) laneIndex = allocLane(c.sha);

    const merges: MergeConnector[] = [];

    // allocate lanes for merge parents first so current-row drawing can target them
    const parents = c.parents ?? [];
    for (let i = 1; i < parents.length; i++) {
      const p = parents[i];
      const pLane = ensureLane(p);
      merges.push({ fromLane: laneIndex, toLane: pLane, parentSha: p });
    }

    // active lanes snapshot for rendering vertical lines on this row
    const activeLanes = lanes.map((x) => x !== null);

    // advance lanes: first parent continues same lane, or lane ends if root
    if (parents.length === 0) {
      lanes[laneIndex] = null;
    } else {
      lanes[laneIndex] = parents[0];
      // if the first-parent target is already represented in another lane, collapse it
      dedupeLaneTargets(laneIndex);
    }

    rows.push({ sha: c.sha, laneIndex, activeLanes, merges });
  }

  return { rows, laneCount: lanes.length };
}
