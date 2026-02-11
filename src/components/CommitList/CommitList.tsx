import styles from './CommitList.module.css';

export default function CommitList() {
  return (
    <div className={styles.container} data-testid='commit-list'>
      <p>No commits loaded.</p>
    </div>
  );
}
