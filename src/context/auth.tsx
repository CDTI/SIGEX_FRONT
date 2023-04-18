import React, { createContext, useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { User } from "../interfaces/user";
import { httpClient } from "../services/httpClient";
import { getUserCoursesAndRoles } from "../services/user_service";

interface AuthContextData {
  isUserLoggedIn: boolean;
  user: User | null;
  login?(token: string, user: User): void;
  logout?(): void;
  update?(user: User): void;
}

export const AuthContext = createContext<AuthContextData>({
  isUserLoggedIn: false,
  user: null,
});

export const AuthProvider: React.FC = (props) => {
  const history = useHistory();

  const [user, setUser] = useState<User | null>(null);

  const update = useCallback(async (user: User) => {
    delete user.password;
    try {
      const coursesAndRolesUpdated = await getUserCoursesAndRoles(user._id!);
      user.roles = coursesAndRolesUpdated.roles;
      user.courses = coursesAndRolesUpdated.courses;
      localStorage.setItem("@pp:user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.log(error);
      logout();
    }
  }, []);

  const authorize = useCallback(async (token: string, user: User) => {
    httpClient.defaults.headers.Authorization = `Bearer ${token}`;
    await update(user);
  }, []);

  const login = useCallback(async (token: string, user: User) => {
    localStorage.setItem("@pp:token", token);

    await authorize(token, user);

    history.replace("/home");
  }, []);

  const logout = useCallback(() => {
    setUser(null);

    localStorage.removeItem("@pp:user");
    localStorage.removeItem("@pp:token");

    history.replace("/login");
  }, []);

  useEffect(() => {
    (async () => {
      const savedUser = localStorage.getItem("@pp:user");
      const savedToken = localStorage.getItem("@pp:token");
      if (savedToken && savedUser) {
        await authorize(savedToken, JSON.parse(savedUser.toString()));
        history.replace("/home");
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isUserLoggedIn: user != null,
        user,
        login,
        logout,
        update,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
