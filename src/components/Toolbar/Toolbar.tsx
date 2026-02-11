import styles from './Toolbar.module.css';

type Props = {
  onLoadSample: () => void;
  onOpenImport: () => void;
  query: string;
  onQueryChange: (v: string) => void;
  hideMerges: boolean;
  onHideMergesChange: (v: boolean) => void;
};

export default function Toolbar({
  onLoadSample,
  onOpenImport,
  query,
  onQueryChange,
  hideMerges,
  onHideMergesChange,
}: Props) {
  return (
    <div className={styles.toolbar} data-testid='toolbar'>
      <button onClick={onLoadSample}>Load Sample</button>
      <button onClick={onOpenImport}>Import JSON</button>

      <input
        placeholder='Search…'
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        aria-label='Search'
      />

      <label>
        <input
          type='checkbox'
          checked={hideMerges}
          onChange={(e) => onHideMergesChange(e.target.checked)}
        />
        Hide merges
      </label>
    </div>
  );
}
