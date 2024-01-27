import React, { useContext } from "react";
import { AppContext } from "../AppContext";

const useAuth = () => {
  const ctx = useContext(AppContext);
  return {
    user: ctx.user,
    setUser: ctx.setUser,
  };
};

export default useAuth;
