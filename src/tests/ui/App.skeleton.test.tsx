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
});
