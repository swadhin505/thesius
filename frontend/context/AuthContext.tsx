"use client"

import React, { createContext, useState, ReactNode, Context, useContext } from 'react';
import axios from 'axios'; // Import axios directly
import { useRouter } from 'next/navigation';
import { BACKEND_URL } from '@/lib/constants';

export interface User {
  id: string;
  username: string;
  fullname:string;
  email: string;
  hashed_password: string
}

interface AuthResponse {
  auth_token: string;
  token_type: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user:User) => void
  login: (username: string, password: string) => Promise<void | {message: string}>;
  logout: () => Promise<void>;
}

const AuthContext: Context<AuthContextType | undefined> = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (username: string, password: string) => {
    try {
      // Specify the response type directly within the axios call
      const response = await axios.post<AuthResponse>(
        `${BACKEND_URL}/auth/token`,
        new URLSearchParams({
          username,
          password
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          withCredentials: true,
        }
      );

      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.auth_token}`;
      // localStorage.setItem('token', response.data.auth_token);
      console.log(response)
      router.push('/dashboard');
      return {message: "Login successful"}
    } catch (error:any) {
      console.log('Login Failed:', error.response.data.detail);
      return {message: error.response.data.detail}
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/auth/logout`, {}, { withCredentials: true });
      delete axios.defaults.headers.common['Authorization'];
      // localStorage.removeItem('token');
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.log('Logout Failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser , login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};