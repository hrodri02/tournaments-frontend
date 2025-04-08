import bcrypt from 'bcryptjs';

export interface MockUser {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'user' | 'admin';
}

// Mock users with hashed passwords
export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Regular User',
    password: bcrypt.hashSync('password123', 10),
    role: 'user'
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin'
  }
]; 