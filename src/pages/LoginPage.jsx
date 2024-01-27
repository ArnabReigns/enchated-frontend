import { Box, Button, FormControl, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import api from "../api";

const LoginPage = () => {
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (username.length > 0 && password.length > 0) {
      api
        .post("/login", {
          username: username,
          password: password,
        })
        .then((res) => {
          if (res.data.loggedin == true) {
            setUser(res.data.user);
          }
          else 
          {
            console.log(res.data.error)
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Box
      display={"flex"}
      height={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      flex={1}
    >
      <Box width={"min(90%, 30rem)"}>
        <Box
          borderRadius={2}
          p={2}
          bgcolor={"#061018"}
          display={"flex"}
          flexDirection={"column"}
          gap={2}
        >
          <Typography
            mb={0}
            color={"#E35B32"}
            fontSize={"2rem"}
            fontWeight={600}
          >
            Log In
          </Typography>
          <TextField
            label="username"
            fullWidth
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="password"
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={login}>Continue</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
