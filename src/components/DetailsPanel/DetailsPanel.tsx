import styles from './DetailsPanel.module.css';
import type { Commit } from '../../core/types';

type Props = {
  commit: Commit | null;
};

export default function DetailsPanel({ commit }: Props) {
  if (!commit) {
    return (
      <div className={styles.container} data-testid='details-panel'>
        <h3>Commit Details</h3>
        <p>Select a commit to view details.</p>
      </div>
    );
  }

  return (
    <div className={styles.container} data-testid='details-panel'>
      <h3>Commit Details</h3>

      <div className={styles.block}>
        <div className={styles.label}>SHA</div>
        <div className={styles.mono}>{commit.sha}</div>
      </div>

      <div className={styles.block}>
        <div className={styles.label}>Message</div>
        <div>{commit.message}</div>
      </div>

      <div className={styles.block}>
        <div className={styles.label}>Author</div>
        <div>{commit.author}</div>
      </div>

      <div className={styles.block}>
        <div className={styles.label}>Date</div>
        <div>{commit.date}</div>
      </div>

      <div className={styles.block}>
        <div className={styles.label}>Parents</div>
        <div className={styles.mono}>
          {(commit.parents?.length ?? 0) === 0
            ? '(none)'
            : commit.parents.join(', ')}
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.label}>Refs</div>
        <div className={styles.mono}>
          {(commit.refs?.length ?? 0) === 0 ? '(none)' : commit.refs.join(', ')}
        </div>
      </div>
    </div>
  );
}
