import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import * as auth from '../utils/auth';

vi.mock('../utils/auth', () => ({
  getSession: vi.fn(),
  setSession: vi.fn(),
  clearSession: vi.fn(),
}));

describe('Home', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  function renderHome(session = { userId: 'user1', username: 'alice', displayName: 'Alice', role: 'user' }) {
    auth.getSession.mockReturnValue(session);

    return render(
      <MemoryRouter initialEntries={['/blogs']}>
        <Routes>
          <Route path="/blogs" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );
  }

  describe('rendering', () => {
    it('renders the page heading and description', () => {
      renderHome();

      expect(screen.getByText('All Posts')).toBeInTheDocument();
      expect(screen.getByText('Browse the latest posts from the community.')).toBeInTheDocument();
    });

    it('renders the Write New Post button', () => {
      renderHome();

      expect(screen.getByText('Write New Post')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('renders empty state message when no posts exist', () => {
      renderHome();

      expect(screen.getByText('No posts yet. Be the first to share something!')).toBeInTheDocument();
      expect(screen.getByText('Write Your First Post')).toBeInTheDocument();
    });

    it('does not render empty state when posts exist', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Test content',
          authorId: 'user1',
          authorName: 'Alice',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      renderHome();

      expect(screen.queryByText('No posts yet. Be the first to share something!')).not.toBeInTheDocument();
    });
  });

  describe('blog cards', () => {
    it('renders blog cards for all posts', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'First Post',
          content: 'Content of the first post',
          authorId: 'user1',
          authorName: 'Alice',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Second Post',
          content: 'Content of the second post',
          authorId: 'user2',
          authorName: 'Bob',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      renderHome();

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });

    it('renders posts sorted by newest first', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Older Post',
          content: 'Older content',
          authorId: 'user1',
          authorName: 'Alice',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Newer Post',
          content: 'Newer content',
          authorId: 'user2',
          authorName: 'Bob',
          createdAt: '2024-06-15T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      renderHome();

      const olderPost = screen.getByText('Older Post');
      const newerPost = screen.getByText('Newer Post');

      expect(newerPost).toBeInTheDocument();
      expect(olderPost).toBeInTheDocument();

      // Newer post should appear before older post in the DOM
      const allLinks = screen.getAllByRole('link');
      const newerIndex = allLinks.findIndex((link) => link.textContent === 'Newer Post');
      const olderIndex = allLinks.findIndex((link) => link.textContent === 'Older Post');
      expect(newerIndex).toBeLessThan(olderIndex);
    });

    it('renders all posts when there are many', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Post One',
          content: 'Content one',
          authorId: 'user1',
          authorName: 'Alice',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Post Two',
          content: 'Content two',
          authorId: 'user2',
          authorName: 'Bob',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
        {
          id: '3',
          title: 'Post Three',
          content: 'Content three',
          authorId: 'user3',
          authorName: 'Charlie',
          createdAt: '2024-01-03T00:00:00.000Z',
        },
        {
          id: '4',
          title: 'Post Four',
          content: 'Content four',
          authorId: 'user4',
          authorName: 'Diana',
          createdAt: '2024-01-04T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      renderHome();

      expect(screen.getByText('Post One')).toBeInTheDocument();
      expect(screen.getByText('Post Two')).toBeInTheDocument();
      expect(screen.getByText('Post Three')).toBeInTheDocument();
      expect(screen.getByText('Post Four')).toBeInTheDocument();
    });
  });

  describe('edit icon visibility', () => {
    it('shows edit icon on posts owned by the current user', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'My Post',
          content: 'My content',
          authorId: 'user1',
          authorName: 'Alice',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      renderHome({ userId: 'user1', username: 'alice', displayName: 'Alice', role: 'user' });

      const editLinks = screen.getAllByTitle('Edit post');
      expect(editLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('does not show edit icon on posts not owned by the current user', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Other Post',
          content: 'Other content',
          authorId: 'user2',
          authorName: 'Bob',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      renderHome({ userId: 'user1', username: 'alice', displayName: 'Alice', role: 'user' });

      expect(screen.queryByTitle('Edit post')).not.toBeInTheDocument();
    });

    it('shows edit icon on all posts for admin users', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'User Post',
          content: 'User content',
          authorId: 'user1',
          authorName: 'Alice',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Another User Post',
          content: 'Another content',
          authorId: 'user2',
          authorName: 'Bob',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      renderHome({ userId: 'admin', username: 'admin', displayName: 'Admin', role: 'admin' });

      const editLinks = screen.getAllByTitle('Edit post');
      expect(editLinks).toHaveLength(2);
    });

    it('shows edit icon only on own posts when user has multiple posts mixed with others', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'My Post',
          content: 'My content',
          authorId: 'user1',
          authorName: 'Alice',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Not My Post',
          content: 'Not my content',
          authorId: 'user2',
          authorName: 'Bob',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
        {
          id: '3',
          title: 'Also My Post',
          content: 'Also my content',
          authorId: 'user1',
          authorName: 'Alice',
          createdAt: '2024-01-03T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      renderHome({ userId: 'user1', username: 'alice', displayName: 'Alice', role: 'user' });

      const editLinks = screen.getAllByTitle('Edit post');
      expect(editLinks).toHaveLength(2);
    });
  });

  describe('edge cases', () => {
    it('handles corrupted localStorage posts gracefully', () => {
      localStorage.setItem('writespace_posts', '{not valid json!!!');

      renderHome();

      expect(screen.getByText('No posts yet. Be the first to share something!')).toBeInTheDocument();
    });

    it('handles non-array localStorage posts gracefully', () => {
      localStorage.setItem('writespace_posts', JSON.stringify({ key: 'value' }));

      renderHome();

      expect(screen.getByText('No posts yet. Be the first to share something!')).toBeInTheDocument();
    });

    it('renders post content truncated in blog cards', () => {
      const longContent = 'A'.repeat(300);
      const mockPosts = [
        {
          id: '1',
          title: 'Long Content Post',
          content: longContent,
          authorId: 'user1',
          authorName: 'Alice',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      renderHome();

      expect(screen.getByText('Long Content Post')).toBeInTheDocument();
      // The full 300-char content should not appear; it should be truncated
      expect(screen.queryByText(longContent)).not.toBeInTheDocument();
    });

    it('displays author names on blog cards', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Test content',
          authorId: 'user1',
          authorName: 'Alice',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      renderHome();

      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
  });
});