import { render, screen } from '@testing-library/react';
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
});
