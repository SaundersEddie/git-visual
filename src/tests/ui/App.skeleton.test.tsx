import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../app/App';

describe('App skeleton', () => {
  it('renders main layout regions', () => {
    render(<App />);

    expect(screen.getByTestId('app-root')).toBeInTheDocument();
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('commit-list')).toBeInTheDocument();
    expect(screen.getByTestId('details-panel')).toBeInTheDocument();
  });

  it('shows empty state in commit list', () => {
    render(<App />);
    expect(screen.getByText(/no commits loaded/i)).toBeInTheDocument();
  });

  it('loads sample commits when clicking Load Sample', async () => {
    render(<App />);

    const button = screen.getByText(/load sample/i);
    await userEvent.click(button);

    expect(screen.getByText(/abc123/i)).toBeInTheDocument();
    expect(screen.getByText(/def456/i)).toBeInTheDocument();
  });

  it('selects a commit and shows details', async () => {
    render(<App />);

    const user = userEvent.setup();
    await user.click(screen.getByText(/load sample/i));
    await user.click(screen.getByText(/def456/i));

    expect(screen.getByText('SHA')).toBeInTheDocument();

    const details = screen.getByTestId('details-panel');
    expect(within(details).getByText(/def456/i)).toBeInTheDocument();
    expect(within(details).getByText(/add readme/i)).toBeInTheDocument();
  });

  it('filters commits by search query', async () => {
    render(<App />);
    const user = userEvent.setup();

    await user.click(screen.getByText(/load sample/i));

    const search = screen.getByLabelText(/search/i);
    await user.type(search, 'readme');

    // should still show the matching commit
    expect(screen.getByText(/def456/i)).toBeInTheDocument();

    // and not show non-matching ones
    expect(screen.queryByText(/fea111/i)).not.toBeInTheDocument();
  });

  it('hides merge commits when toggle is enabled', async () => {
    render(<App />);
    const user = userEvent.setup();

    await user.click(screen.getByText(/load sample/i));

    // merge commit visible initially
    expect(screen.getByText(/mrg999/i)).toBeInTheDocument();

    await user.click(screen.getByLabelText(/hide merges/i));

    // merge commit should disappear
    expect(screen.queryByText(/mrg999/i)).not.toBeInTheDocument();
  });

  it('pastes JSON and renders commits', async () => {
    render(<App />);
    const user = userEvent.setup();

    await user.click(screen.getByText(/import json/i));

    const json = JSON.stringify({
      repoName: 'x',
      commits: [
        {
          sha: 'p111',
          parents: [],
          author: 'Dev X',
          date: '2026-02-10T10:00:00.000Z',
          message: 'Paste import works',
          refs: ['main'],
        },
      ],
    });

    // await user.type(screen.getByLabelText(/paste json/i), json);
    await user.click(screen.getByLabelText(/paste json/i));
    await user.paste(json);
    await user.click(screen.getByText(/import pasted json/i));

    expect(screen.getByText(/p111/i)).toBeInTheDocument();
    expect(screen.getByText(/paste import works/i)).toBeInTheDocument();
  });

  it('uploads a JSON file and renders commits', async () => {
    render(<App />);
    const user = userEvent.setup();

    await user.click(screen.getByText(/import json/i));

    const json = JSON.stringify({
      repoName: 'x',
      commits: [
        {
          sha: 'u222',
          parents: [],
          author: 'Dev Y',
          date: '2026-02-10T10:00:00.000Z',
          message: 'Upload import works',
          refs: [],
        },
      ],
    });

    const file = new File([json], 'history.json', { type: 'application/json' });
    const input = screen.getByLabelText(/upload json/i) as HTMLInputElement;

    // userEvent.upload is the clean way
    await user.upload(input, file);

    expect(await screen.findByText(/u222/i)).toBeInTheDocument();
    expect(await screen.findByText(/upload import works/i)).toBeInTheDocument();
  });
});
