import { useRef, useState } from 'react';
import styles from './ImportPanel.module.css';

type Props = {
  open: boolean;
  error: string | null;
  onClose: () => void;
  onImportText: (text: string) => void;
  onImportFile: (file: File) => void;
};

export default function ImportPanel({
  open,
  error,
  onClose,
  onImportText,
  onImportFile,
}: Props) {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!open) return null;

  return (
    <div className={styles.panel} data-testid='import-panel'>
      <div className={styles.row}>
        <button type='button' onClick={() => onImportText(text)}>
          Import pasted JSON
        </button>

        <input
          ref={fileInputRef}
          type='file'
          accept='application/json,.json'
          aria-label='Upload JSON'
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImportFile(file);
            // allow re-uploading the same file
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
        />

        <button type='button' onClick={onClose}>
          Close
        </button>
      </div>

      <textarea
        className={styles.textarea}
        aria-label='Paste JSON'
        placeholder='Paste JSON here…'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {error ? (
        <pre className={styles.error} role='alert'>
          {error}
        </pre>
      ) : null}
    </div>
  );
}
