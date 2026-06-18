import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RegisterPage } from '../pages/RegisterPage';

describe('RegisterPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('rendering', () => {
    it('renders the registration form with all fields', () => {
      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByLabelText('Display Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    });

    it('renders the WriteSpace branding', () => {
      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('WriteSpace')).toBeInTheDocument();
      expect(screen.getByText('Create your account')).toBeInTheDocument();
    });

    it('renders a link to the login page', () => {
      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByText(/Already have an account\?/)).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('shows error when all fields are empty', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('All fields are required.')).toBeInTheDocument();
    });

    it('shows error when display name is empty', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Username'), 'testuser');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('All fields are required.')).toBeInTheDocument();
    });

    it('shows error when username is empty', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Display Name'), 'Test User');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('All fields are required.')).toBeInTheDocument();
    });

    it('shows error when password is empty', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Display Name'), 'Test User');
      await user.type(screen.getByLabelText('Username'), 'testuser');
      await user.type(screen.getByLabelText('Confirm Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('All fields are required.')).toBeInTheDocument();
    });

    it('shows error when confirm password is empty', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Display Name'), 'Test User');
      await user.type(screen.getByLabelText('Username'), 'testuser');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('All fields are required.')).toBeInTheDocument();
    });

    it('shows error when only whitespace is entered in all fields', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Display Name'), '   ');
      await user.type(screen.getByLabelText('Username'), '   ');
      await user.type(screen.getByLabelText('Password'), '   ');
      await user.type(screen.getByLabelText('Confirm Password'), '   ');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('All fields are required.')).toBeInTheDocument();
    });
  });

  describe('password mismatch', () => {
    it('shows error when passwords do not match', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Display Name'), 'Test User');
      await user.type(screen.getByLabelText('Username'), 'testuser');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'differentpass');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    });
  });

  describe('duplicate username', () => {
    it('shows error when username is "admin" (reserved)', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Display Name'), 'Fake Admin');
      await user.type(screen.getByLabelText('Username'), 'admin');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('Username already exists.')).toBeInTheDocument();
    });

    it('shows error when username already exists in localStorage', async () => {
      const user = userEvent.setup();

      const mockUsers = [
        {
          id: 'user1',
          displayName: 'Alice',
          username: 'alice',
          password: 'pass123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Display Name'), 'Another Alice');
      await user.type(screen.getByLabelText('Username'), 'alice');
      await user.type(screen.getByLabelText('Password'), 'newpass');
      await user.type(screen.getByLabelText('Confirm Password'), 'newpass');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('Username already exists.')).toBeInTheDocument();
    });
  });

  describe('successful registration', () => {
    it('redirects to /blogs on successful registration', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Display Name'), 'New User');
      await user.type(screen.getByLabelText('Username'), 'newuser');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
    });

    it('saves user to localStorage on successful registration', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Display Name'), 'New User');
      await user.type(screen.getByLabelText('Username'), 'newuser');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      const storedUsers = JSON.parse(localStorage.getItem('writespace_users'));
      expect(storedUsers).toHaveLength(1);
      expect(storedUsers[0].displayName).toBe('New User');
      expect(storedUsers[0].username).toBe('newuser');
      expect(storedUsers[0].password).toBe('pass123');
      expect(storedUsers[0].role).toBe('user');
      expect(storedUsers[0].id).toBeDefined();
      expect(storedUsers[0].createdAt).toBeDefined();
    });

    it('sets session in localStorage on successful registration', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Display Name'), 'New User');
      await user.type(screen.getByLabelText('Username'), 'newuser');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      const session = JSON.parse(localStorage.getItem('writespace_session'));
      expect(session).toBeDefined();
      expect(session.username).toBe('newuser');
      expect(session.displayName).toBe('New User');
      expect(session.role).toBe('user');
      expect(session.userId).toBeDefined();
    });

    it('appends new user to existing users in localStorage', async () => {
      const user = userEvent.setup();

      const existingUsers = [
        {
          id: 'user1',
          displayName: 'Alice',
          username: 'alice',
          password: 'pass123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(existingUsers));

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Display Name'), 'Bob');
      await user.type(screen.getByLabelText('Username'), 'bob');
      await user.type(screen.getByLabelText('Password'), 'bobpass');
      await user.type(screen.getByLabelText('Confirm Password'), 'bobpass');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      const storedUsers = JSON.parse(localStorage.getItem('writespace_users'));
      expect(storedUsers).toHaveLength(2);
      expect(storedUsers[0].username).toBe('alice');
      expect(storedUsers[1].username).toBe('bob');
    });
  });

  describe('already authenticated redirect', () => {
    it('redirects authenticated admin to /admin', () => {
      const adminSession = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(adminSession));

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
    });

    it('redirects authenticated user to /blogs', () => {
      const userSession = {
        userId: 'user1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(userSession));

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
      expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
    });
  });

  describe('error clearing', () => {
    it('clears previous error on new submission attempt', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      // First attempt with empty fields
      await user.click(screen.getByRole('button', { name: 'Create Account' }));
      expect(screen.getByText('All fields are required.')).toBeInTheDocument();

      // Second attempt with valid credentials
      await user.type(screen.getByLabelText('Display Name'), 'New User');
      await user.type(screen.getByLabelText('Username'), 'newuser');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.queryByText('All fields are required.')).not.toBeInTheDocument();
      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles corrupted users in localStorage gracefully', async () => {
      const user = userEvent.setup();

      localStorage.setItem('writespace_users', '{not valid json!!!');

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Display Name'), 'New User');
      await user.type(screen.getByLabelText('Username'), 'newuser');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
    });

    it('trims whitespace from all fields before validation', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Display Name'), '  New User  ');
      await user.type(screen.getByLabelText('Username'), '  newuser  ');
      await user.type(screen.getByLabelText('Password'), '  pass123  ');
      await user.type(screen.getByLabelText('Confirm Password'), '  pass123  ');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();

      const storedUsers = JSON.parse(localStorage.getItem('writespace_users'));
      expect(storedUsers[0].displayName).toBe('New User');
      expect(storedUsers[0].username).toBe('newuser');
      expect(storedUsers[0].password).toBe('pass123');
    });

    it('creates user with role "user" by default', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Display Name'), 'Regular User');
      await user.type(screen.getByLabelText('Username'), 'regularuser');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      const storedUsers = JSON.parse(localStorage.getItem('writespace_users'));
      expect(storedUsers[0].role).toBe('user');
    });
  });
});