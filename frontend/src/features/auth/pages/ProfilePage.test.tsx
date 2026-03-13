import { render, screen } from '@testing-library/react';

import ProfilePage from './ProfilePage';

const mockUseProfilePage = jest.fn();

jest.mock('../hooks/useProfilePage', () => ({
  useProfilePage: () => mockUseProfilePage(),
}));

jest.mock('../components/common/ProfileLoadingState', () => ({
  ProfileLoadingState: () => <div data-testid="profile-loading-state" />,
}));

jest.mock('../components/common/ProfileErrorState', () => ({
  ProfileErrorState: ({ message }: { message: string }) => (
    <div data-testid="profile-error-state">{message}</div>
  ),
}));

jest.mock('../components/profile/ProfileHeader', () => ({
  ProfileHeader: (props: unknown) => {
    const typed = props as { initials: string; updatedLabel: string };
    return (
      <div data-testid="profile-header">
        {typed.initials}::{typed.updatedLabel}
      </div>
    );
  },
}));

jest.mock('../components/profile/ProfileIdentityCard', () => ({
  ProfileIdentityCardBlock: (props: unknown) => {
    const typed = props as { fullName: string; memberSince: string };
    return (
      <div data-testid="profile-identity-card">
        {typed.fullName}::{typed.memberSince}
      </div>
    );
  },
}));

jest.mock('../components/profile/ProfileEmailCard', () => ({
  ProfileEmailCard: () => <div data-testid="profile-email-card" />,
}));

jest.mock('../components/profile/ProfilePasswordCard', () => ({
  ProfilePasswordCard: () => <div data-testid="profile-password-card" />,
}));

jest.mock('../components/profile/ProfileDangerZone', () => ({
  ProfileDangerZone: () => <div data-testid="profile-danger-zone" />,
}));

jest.mock('../components/profile/DeleteAccountDialog', () => ({
  DeleteAccountDialog: (props: unknown) => {
    const typed = props as { open: boolean; deleteError: string };
    return (
      <div data-testid="delete-account-dialog">
        {String(typed.open)}::{typed.deleteError}
      </div>
    );
  },
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state while profile query is loading', () => {
    mockUseProfilePage.mockReturnValue({
      profileQuery: { isLoading: true },
    });

    render(<ProfilePage />);

    expect(screen.getByTestId('profile-loading-state')).toBeInTheDocument();
  });

  it('renders error state when query errors', () => {
    mockUseProfilePage.mockReturnValue({
      profileQuery: {
        isLoading: false,
        error: { message: 'Failed to load profile' },
      },
      profile: null,
    });

    render(<ProfilePage />);

    expect(screen.getByTestId('profile-error-state')).toHaveTextContent(
      'Failed to load profile',
    );
  });

  it('renders fallback error state when profile data is missing', () => {
    mockUseProfilePage.mockReturnValue({
      profileQuery: {
        isLoading: false,
        error: null,
      },
      profile: null,
    });

    render(<ProfilePage />);

    expect(screen.getByTestId('profile-error-state')).toHaveTextContent('No profile data');
  });

  it('renders the full profile view when data is available', () => {
    const vm = {
      profileQuery: {
        isLoading: false,
        error: null,
      },
      profile: {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      initialsFromName: jest.fn().mockReturnValue('JD'),
      updatedLabel: '5m ago',
      refresh: jest.fn(),
      fullName: 'John Doe',
      memberSince: 'Jan 1, 2026',
      newEmail: 'john@example.com',
      setNewEmail: jest.fn(),
      emailMsg: null,
      canSubmitEmail: true,
      updateEmail: { isPending: false },
      submitEmailUpdate: jest.fn(),
      setEmailMsg: jest.fn(),
      currentPwd: '',
      setCurrentPwd: jest.fn(),
      newPwd: '',
      setNewPwd: jest.fn(),
      pwdMsg: null,
      canSubmitPwd: false,
      changePassword: { isPending: false },
      submitPasswordChange: jest.fn(),
      setPwdMsg: jest.fn(),
      openDeleteDialog: jest.fn(),
      deleteOpen: false,
      deleteError: '',
      closeDeleteDialog: jest.fn(),
      confirmDelete: jest.fn(),
      deleteAccount: { isPending: false },
    };

    mockUseProfilePage.mockReturnValue(vm);

    render(<ProfilePage />);

    expect(screen.getByTestId('profile-header')).toHaveTextContent('JD::5m ago');
    expect(screen.getByTestId('profile-identity-card')).toHaveTextContent(
      'John Doe::Jan 1, 2026',
    );
    expect(screen.getByTestId('profile-email-card')).toBeInTheDocument();
    expect(screen.getByTestId('profile-password-card')).toBeInTheDocument();
    expect(screen.getByTestId('profile-danger-zone')).toBeInTheDocument();
    expect(screen.getByTestId('delete-account-dialog')).toHaveTextContent('false::');

    expect(vm.initialsFromName).toHaveBeenCalledWith('John', 'Doe');
  });
});