import { useEffect, useState } from "react";
import "./App.css";
import { Box, Typography } from "@mui/material";
import useAuth from "./hooks/useAuth";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { socket } from "./socket";
import React from "react";
import Sidebar from "./components/Sidebar";
import HomePage from "./HomePage";
import { Icon } from "@iconify/react";

function SideBarLayout() {
  const { user } = useAuth();

  return (
    <Box display={"flex"} width={"100%"} height={'100vh'} overflow={'hidden'}>
      <Sidebar />
      <Box flex={1} display={"flex"} flexDirection={"column"}>
        <Box
          display={"flex"}
          justifyContent={"flex-end"}
          p={2}
          bgcolor={"#061018"}
          alignItems={"center"}
        >
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <Icon icon="fa:user-circle" color="white" />
            <Typography>{user?.username}</Typography>
          </Box>
        </Box>
        <Box flex={1}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user == null) {
      navigate("/login");
    } else navigate("/");
  }, [user]);

  return (
    <Box
      bgcolor={"#121E2C"}
      minHeight={"100vh"}
      display={"flex"}
    >
      <Routes>
        <Route path="/" element={<SideBarLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Box>
  );
}

export default App;
