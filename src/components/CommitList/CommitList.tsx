import styles from './CommitList.module.css';
import type { Commit } from '../../core/types';

type Props = {
  commits: Commit[];
  selectedSha: string | null;
  onSelectSha: (sha: string) => void;
};

export default function CommitList({
  commits,
  selectedSha,
  onSelectSha,
}: Props) {
  if (commits.length === 0) {
    return (
      <div className={styles.container} data-testid='commit-list'>
        <p>No commits loaded.</p>
      </div>
    );
  }

  return (
    <div className={styles.container} data-testid='commit-list'>
      <ul className={styles.list}>
        {commits.map((c) => {
          const isSelected = c.sha === selectedSha;
          return (
            <li key={c.sha}>
              <button
                type='button'
                className={`${styles.row} ${isSelected ? styles.selected : ''}`}
                onClick={() => onSelectSha(c.sha)}
              >
                <strong className={styles.sha}>{c.sha}</strong>
                <span className={styles.msg}>{c.message}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
