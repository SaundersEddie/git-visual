import { useMemo, useState } from 'react';
import styles from './App.module.css';
import Toolbar from '../components/Toolbar/Toolbar';
import CommitList from '../components/CommitList/CommitList';
import DetailsPanel from '../components/DetailsPanel/DetailsPanel';
import ImportPanel from '../components/ImportPanel/ImportPanel';
import sample from '../data/sample-history.json';
import type { Commit } from '../core/types';
import { filterCommits } from '../core/filters/filterCommits';
import { computeLaneLayout } from '../core/layout/lanes';
import { parseHistoryJson } from '../core/schema/gitHistory';

export default function App() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [selectedSha, setSelectedSha] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [hideMerges, setHideMerges] = useState(false);

  const [importOpen, setImportOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  function loadCommits(next: Commit[]) {
    setCommits(next);
    setSelectedSha(null);
    setQuery('');
    setHideMerges(false);
  }

  function handleLoadSample() {
    loadCommits(sample.commits as Commit[]);
    setImportError(null);
    setImportOpen(false);
  }

  function handleImportText(text: string) {
    const parsed = parseHistoryJson(text);
    if (!parsed.ok) {
      setImportError(parsed.error);
      return;
    }
    loadCommits(parsed.history.commits as Commit[]);
    setImportError(null);
    setImportOpen(false);
  }

  function handleImportFile(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      handleImportText(text);
    };

    reader.onerror = () => {
      setImportError('Failed to read file.');
    };

    reader.readAsText(file);
  }

  const visibleCommits = useMemo(
    () => filterCommits(commits, { query, hideMerges }),
    [commits, query, hideMerges],
  );

  const laneLayout = useMemo(
    () => computeLaneLayout(visibleCommits),
    [visibleCommits],
  );

  const laneBySha = useMemo(() => {
    const map = new Map<string, (typeof laneLayout.rows)[number]>();
    for (const r of laneLayout.rows) map.set(r.sha, r);
    return map;
  }, [laneLayout.rows]);

  const selectedCommit = selectedSha
    ? (visibleCommits.find((c) => c.sha === selectedSha) ?? null)
    : null;

  return (
    <div className={styles.app} data-testid='app-root'>
      <Toolbar
        onLoadSample={handleLoadSample}
        onOpenImport={() => {
          setImportOpen((v) => !v);
          setImportError(null);
        }}
        query={query}
        onQueryChange={setQuery}
        hideMerges={hideMerges}
        onHideMergesChange={setHideMerges}
      />

      <ImportPanel
        open={importOpen}
        error={importError}
        onClose={() => setImportOpen(false)}
        onImportText={handleImportText}
        onImportFile={handleImportFile}
      />

      <div className={styles.main}>
        <div className={styles.listArea}>
          <CommitList
            disableVirtualization={import.meta.env.MODE === 'test'}
            commits={visibleCommits}
            selectedSha={selectedSha}
            onSelectSha={setSelectedSha}
            laneCount={laneLayout.laneCount}
            laneBySha={laneBySha}
          />
        </div>
        <div className={styles.detailsArea}>
          <DetailsPanel commit={selectedCommit} />
        </div>
      </div>
    </div>
  );
}
