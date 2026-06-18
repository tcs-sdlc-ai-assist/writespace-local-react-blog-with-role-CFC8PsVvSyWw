import { describe, it, expect, beforeEach } from 'vitest';
import { getPosts, savePosts, getUsers, saveUsers } from '../utils/storage';

describe('storage utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getPosts', () => {
    it('returns an empty array when localStorage has no posts', () => {
      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns stored posts when valid data exists', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Test content',
          authorId: 'user1',
          authorName: 'User One',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Another Post',
          content: 'More content',
          authorId: 'user2',
          authorName: 'User Two',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      const posts = getPosts();
      expect(posts).toEqual(mockPosts);
      expect(posts).toHaveLength(2);
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_posts', '{not valid json!!!');

      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify({ key: 'value' }));

      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns an empty array when localStorage contains a string value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify('just a string'));

      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns an empty array when localStorage contains null', () => {
      localStorage.setItem('writespace_posts', JSON.stringify(null));

      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns an empty array when localStorage contains a number', () => {
      localStorage.setItem('writespace_posts', JSON.stringify(42));

      const posts = getPosts();
      expect(posts).toEqual([]);
    });
  });

  describe('savePosts', () => {
    it('saves posts to localStorage', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Test content',
          authorId: 'user1',
          authorName: 'User One',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      savePosts(mockPosts);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(mockPosts);
    });

    it('saves an empty array to localStorage', () => {
      savePosts([]);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual([]);
    });

    it('overwrites existing posts in localStorage', () => {
      const initialPosts = [{ id: '1', title: 'Old Post', content: 'Old', authorId: 'u1', authorName: 'U1', createdAt: '2024-01-01T00:00:00.000Z' }];
      savePosts(initialPosts);

      const newPosts = [{ id: '2', title: 'New Post', content: 'New', authorId: 'u2', authorName: 'U2', createdAt: '2024-01-02T00:00:00.000Z' }];
      savePosts(newPosts);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(newPosts);
      expect(stored).toHaveLength(1);
    });

    it('persists posts that can be retrieved by getPosts', () => {
      const mockPosts = [
        {
          id: 'abc',
          title: 'Roundtrip Post',
          content: 'Roundtrip content',
          authorId: 'admin',
          authorName: 'Admin',
          createdAt: '2024-06-15T12:00:00.000Z',
        },
      ];

      savePosts(mockPosts);
      const retrieved = getPosts();
      expect(retrieved).toEqual(mockPosts);
    });
  });

  describe('getUsers', () => {
    it('returns an empty array when localStorage has no users', () => {
      const users = getUsers();
      expect(users).toEqual([]);
    });

    it('returns stored users when valid data exists', () => {
      const mockUsers = [
        {
          id: 'u1',
          displayName: 'Alice',
          username: 'alice',
          password: 'pass123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'u2',
          displayName: 'Bob',
          username: 'bob',
          password: 'pass456',
          role: 'admin',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      const users = getUsers();
      expect(users).toEqual(mockUsers);
      expect(users).toHaveLength(2);
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_users', 'corrupted{{{data');

      const users = getUsers();
      expect(users).toEqual([]);
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_users', JSON.stringify({ user: 'object' }));

      const users = getUsers();
      expect(users).toEqual([]);
    });

    it('returns an empty array when localStorage contains a boolean', () => {
      localStorage.setItem('writespace_users', JSON.stringify(true));

      const users = getUsers();
      expect(users).toEqual([]);
    });

    it('returns an empty array when localStorage contains null', () => {
      localStorage.setItem('writespace_users', JSON.stringify(null));

      const users = getUsers();
      expect(users).toEqual([]);
    });
  });

  describe('saveUsers', () => {
    it('saves users to localStorage', () => {
      const mockUsers = [
        {
          id: 'u1',
          displayName: 'Alice',
          username: 'alice',
          password: 'pass123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      saveUsers(mockUsers);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual(mockUsers);
    });

    it('saves an empty array to localStorage', () => {
      saveUsers([]);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual([]);
    });

    it('overwrites existing users in localStorage', () => {
      const initialUsers = [{ id: 'u1', displayName: 'Old', username: 'old', password: 'p', role: 'user', createdAt: '2024-01-01T00:00:00.000Z' }];
      saveUsers(initialUsers);

      const newUsers = [{ id: 'u2', displayName: 'New', username: 'new', password: 'p', role: 'admin', createdAt: '2024-01-02T00:00:00.000Z' }];
      saveUsers(newUsers);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual(newUsers);
      expect(stored).toHaveLength(1);
    });

    it('persists users that can be retrieved by getUsers', () => {
      const mockUsers = [
        {
          id: 'u-roundtrip',
          displayName: 'Roundtrip User',
          username: 'roundtrip',
          password: 'secret',
          role: 'user',
          createdAt: '2024-06-15T12:00:00.000Z',
        },
      ];

      saveUsers(mockUsers);
      const retrieved = getUsers();
      expect(retrieved).toEqual(mockUsers);
    });
  });
});