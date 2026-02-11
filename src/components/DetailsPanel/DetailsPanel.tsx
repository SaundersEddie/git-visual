import styles from './DetailsPanel.module.css';

export default function DetailsPanel() {
  return (
    <div className={styles.container} data-testid='details-panel'>
      <h3>Commit Details</h3>
      <p>Select a commit to view details.</p>
    </div>
  );
}
