import styles from './App.module.css';
import Toolbar from '../components/Toolbar/Toolbar';
import CommitList from '../components/CommitList/CommitList';
import DetailsPanel from '../components/DetailsPanel/DetailsPanel';

export default function App() {
  return (
    <div className={styles.app} data-testid='app-root'>
      <Toolbar />
      <div className={styles.main}>
        <div className={styles.listArea}>
          <CommitList />
        </div>
        <div className={styles.detailsArea}>
          <DetailsPanel />
        </div>
      </div>
    </div>
  );
}
