import { useMemo, useRef } from 'react';
import styles from './CommitList.module.css';
import type { Commit } from '../../core/types';
import type { LayoutRow } from '../../core/layout/lanes';
import { useVirtualizer } from '@tanstack/react-virtual';

type Props = {
  commits: Commit[];
  selectedSha: string | null;
  onSelectSha: (sha: string) => void;
  laneCount: number;
  laneBySha: Map<string, LayoutRow>;
  disableVirtualization?: boolean;
};

const ROW_H = 28;
const LANE_W = 12;
const DOT_R = 4;

function LaneGraph({
  row,
  laneCount,
}: {
  row: LayoutRow | undefined;
  laneCount: number;
}) {
  const width = Math.max(1, laneCount) * LANE_W;
  const midY = ROW_H / 2;
  const laneColor = (lane: number) => `hsl(${(lane * 47) % 360} 70% 65%)`;

  if (!row) return <div className={styles.graph} style={{ width }} />;

  return (
    <svg
      className={styles.graph}
      width={width}
      height={ROW_H}
      aria-hidden='true'
    >
      {row.activeLanes.map((active, lane) => {
        if (!active) return null;
        const x = lane * LANE_W + LANE_W / 2;
        return (
          <line
            key={lane}
            x1={x}
            y1={0}
            x2={x}
            y2={ROW_H}
            stroke={laneColor(lane)}
            opacity='0.35'
          />
        );
      })}

      {row.merges.map((m) => {
        const x1 = m.fromLane * LANE_W + LANE_W / 2;
        const x2 = m.toLane * LANE_W + LANE_W / 2;
        const y1 = midY;
        const y2 = midY + 8;
        return (
          <line
            key={`${m.parentSha}-${m.toLane}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={laneColor(m.fromLane)}
            opacity='0.6'
          />
        );
      })}

      <circle
        cx={row.laneIndex * LANE_W + LANE_W / 2}
        cy={midY}
        r={DOT_R}
        fill={laneColor(row.laneIndex)}
        opacity='0.95'
      />
    </svg>
  );
}

export default function CommitList({
  commits,
  selectedSha,
  onSelectSha,
  laneCount,
  laneBySha,
  disableVirtualization,
}: Props) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: commits.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_H,
    overscan: 8,
  });

  const items = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const byIndex = useMemo(() => commits, [commits]);

  if (commits.length === 0) {
    return (
      <div className={styles.container} data-testid='commit-list'>
        <p>No commits loaded.</p>
      </div>
    );
  }

  if (disableVirtualization) {
    return (
      <div className={styles.container} data-testid='commit-list'>
        {commits.map((c) => {
          const isSelected = c.sha === selectedSha;
          const row = laneBySha.get(c.sha);

          return (
            <div key={c.sha} style={{ height: ROW_H }}>
              <button
                type='button'
                className={`${styles.row} ${isSelected ? styles.selected : ''}`}
                onClick={() => onSelectSha(c.sha)}
              >
                <LaneGraph row={row} laneCount={laneCount} />
                <div className={styles.summary}>
                  <strong className={styles.sha}>{c.sha.slice(0, 7)}</strong>
                  <span className={styles.msg}>{c.message}</span>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={styles.container} data-testid='commit-list' ref={parentRef}>
      <div style={{ height: totalSize, position: 'relative' }}>
        {items.map((v) => {
          const c = byIndex[v.index];
          const isSelected = c.sha === selectedSha;
          const row = laneBySha.get(c.sha);

          return (
            <div
              key={c.sha}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${v.start}px)`,
                height: ROW_H,
              }}
            >
              <button
                type='button'
                className={`${styles.row} ${isSelected ? styles.selected : ''}`}
                onClick={() => onSelectSha(c.sha)}
              >
                <LaneGraph row={row} laneCount={laneCount} />
                <div className={styles.summary}>
                  <strong className={styles.sha}>{c.sha}</strong>
                  <span className={styles.msg}>{c.message}</span>
                  <div className={styles.refs}>
                    {(c.refs ?? []).slice(0, 3).map((r) => (
                      <span key={r} className={styles.refChip}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
