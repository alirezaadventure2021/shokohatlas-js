import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../axios-client";

const StateContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  useEffect(() => {
    if (token) {
      axiosClient.get("/user").then(({ data }) => {
        setUser(data.data || data);
      }).catch(() => {
        setToken(null);
        setUser(null);
      });
    }
  }, [token]);

  const logout = () => {
    axiosClient.post("/logout").finally(() => {
      setToken(null);
      setUser(null);
    });
  };

  return (
    <StateContext.Provider value={{ user, token, setUser, setToken, logout }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
