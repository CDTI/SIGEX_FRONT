import React, { createContext, useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { User } from "../interfaces/user";
import { httpClient } from "../services/httpClient";

interface AuthContextData
{
  isUserLoggedIn: boolean;
  user: User | null;
  login?(token: string, user: User): void;
  logout?(): void;
}

export const AuthContext = createContext<AuthContextData>(
{
  isUserLoggedIn: false,
  user: null
});

export const AuthProvider: React.FC = (props) =>
{
  const history = useHistory();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() =>
  {
    const storageUser = localStorage.getItem("@pp:user");
    const storageToken = localStorage.getItem("@pp:token");
    if (storageToken && storageUser)
    {
      authorize(storageToken, JSON.parse(storageUser.toString()));
      history.replace("/home");
    }
  }, []);

  const authorize = useCallback((token: string, user: User) =>
  {
    httpClient.defaults.headers.Authorization = `Bearer ${token}`
    setUser(user);
  }, []);

  const login = useCallback((token: string, user: User) =>
  {
    localStorage.setItem("@pp:token", token);
    localStorage.setItem("@pp:user", JSON.stringify(user));

    authorize(token, user);

    history.replace("/home");
  }, []);

  const logout = useCallback(() =>
  {
    setUser(null);

    localStorage.removeItem("@pp:user");
    localStorage.removeItem("@pp:token");

    history.replace("/login");
  }, []);

  return (
    <AuthContext.Provider
      value={
      {
        isUserLoggedIn: user != null,
        user,
        login,
        logout
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
