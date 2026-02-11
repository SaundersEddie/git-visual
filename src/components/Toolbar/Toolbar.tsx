import styles from './Toolbar.module.css';

export default function Toolbar() {
  return (
    <div className={styles.toolbar} data-testid='toolbar'>
      <button>Load Sample</button>
      <input placeholder='Search…' />
      <label>
        <input type='checkbox' />
        Hide merges
      </label>
    </div>
  );
}
