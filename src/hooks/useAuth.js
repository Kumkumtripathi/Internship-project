import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const USERS_KEY = 'jobpulse_users';
const CURRENT_USER_KEY = 'jobpulse_current_user';

// Load all registered users
const loadUsers = () => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save users list
const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Load current logged-in user id
const loadCurrentUserId = () => {
  return localStorage.getItem(CURRENT_USER_KEY) || null;
};

// Get user object by id
const getUserById = (id) => {
  const users = loadUsers();
  return users.find((u) => u.id === id) || null;
};

export default function useAuth() {
  const [currentUser, setCurrentUser] = useState(() => {
    const id = loadCurrentUserId();
    return id ? getUserById(id) : null;
  });

  // Sign up a new user
  const signup = useCallback((name, email, password) => {
    const users = loadUsers();

    // Check if email already exists
    const exists = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password, // stored as plain text in localStorage (demo only)
      createdAt: Date.now(),
    };

    users.push(newUser);
    saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, newUser.id);
    setCurrentUser(newUser);
    return { success: true };
  }, []);

  // Log in an existing user
  const login = useCallback((email, password) => {
    const users = loadUsers();

    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    localStorage.setItem(CURRENT_USER_KEY, user.id);
    setCurrentUser(user);
    return { success: true };
  }, []);

  // Update password
  const updatePassword = useCallback((newPassword) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) return { success: false, error: 'User not found' };
    
    users[userIndex].password = newPassword;
    saveUsers(users);
    setCurrentUser(users[userIndex]);
    return { success: true };
  }, [currentUser]);

  // Delete account
  const deleteAccount = useCallback(() => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    const users = loadUsers();
    const updatedUsers = users.filter(u => u.id !== currentUser.id);
    saveUsers(updatedUsers);
    
    // Clear the specific job data for this user
    localStorage.removeItem(`jobpulse_jobs_${currentUser.id}`);
    
    // Log out
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
    return { success: true };
  }, [currentUser]);

  // Log out
  const logout = useCallback(() => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
  }, []);

  return {
    currentUser,
    isLoggedIn: !!currentUser,
    signup,
    login,
    logout,
  };
}
