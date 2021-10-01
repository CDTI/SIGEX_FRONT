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
  update?(user: User): void;
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

  const update = useCallback((user: User) =>
  {
    delete user.password;

    localStorage.setItem("@pp:user", JSON.stringify(user));
    setUser(user);
  }, []);

  const authorize = useCallback((token: string, user: User) =>
  {
    httpClient.defaults.headers.Authorization = `Bearer ${token}`
    update(user);
  }, []);

  const login = useCallback((token: string, user: User) =>
  {
    localStorage.setItem("@pp:token", token);

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

  useEffect(() =>
  {
    const savedUser = localStorage.getItem("@pp:user");
    const savedToken = localStorage.getItem("@pp:token");
    if (savedToken && savedUser)
    {
      authorize(savedToken, JSON.parse(savedUser.toString()));
      history.replace("/home");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={
      {
        isUserLoggedIn: user != null,
        user,
        login,
        logout,
        update
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
