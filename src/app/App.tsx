import { useState } from 'react';
import styles from './App.module.css';
import Toolbar from '../components/Toolbar/Toolbar';
import CommitList from '../components/CommitList/CommitList';
import DetailsPanel from '../components/DetailsPanel/DetailsPanel';
import sample from '../data/sample-history.json';
import type { Commit } from '../core/types';

export default function App() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [selectedSha, setSelectedSha] = useState<string | null>(null);

  function handleLoadSample() {
    setCommits(sample.commits as Commit[]);
    setSelectedSha(null);
  }

  const selectedCommit = selectedSha
    ? (commits.find((c) => c.sha === selectedSha) ?? null)
    : null;

  return (
    <div className={styles.app} data-testid='app-root'>
      <Toolbar onLoadSample={handleLoadSample} />
      <div className={styles.main}>
        <div className={styles.listArea}>
          <CommitList
            commits={commits}
            selectedSha={selectedSha}
            onSelectSha={setSelectedSha}
          />
        </div>
        <div className={styles.detailsArea}>
          <DetailsPanel commit={selectedCommit} />
        </div>
      </div>
    </div>
  );
}
