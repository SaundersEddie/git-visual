import styles from './Toolbar.module.css';

type Props = {
  onLoadSample: () => void;
};

export default function Toolbar({ onLoadSample }: Props) {
  return (
    <div className={styles.toolbar} data-testid='toolbar'>
      <button onClick={onLoadSample}>Load Sample</button>
      <input placeholder='Search…' />
      <label>
        <input type='checkbox' />
        Hide merges
      </label>
    </div>
  );
}
