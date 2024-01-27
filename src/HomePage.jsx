import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "./AppContext";
import { socket } from "./socket";
import api from "./api";

const HomePage = () => {
  const { activeRoom } = useContext(AppContext);

  return (
    <Box height={"100%"}>
      {!activeRoom ? (
        <Typography p={2}>Select a room to start</Typography>
      ) : (
        <Box
          display={"flex"}
          flexDirection={"column"}
          height={"100%"}
          sx={{
            overflowY: "auto !important",
          }}
        >
          <ChatWindow />
          <TextWindow />
        </Box>
      )}
    </Box>
  );
};

const ChatWindow = () => {
  const { activeRoom, user } = useContext(AppContext);

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based
    const year = date.getFullYear().toString().slice(-2);

    const formattedTime = `${formattedHours}:${
      minutes < 10 ? "0" : ""
    }${minutes} ${ampm} ${day < 10 ? "0" : ""}${day}.${
      month < 10 ? "0" : ""
    }${month}.${year}`;

    return formattedTime;
  }

  const [chats, setChats] = useState([]);

  const handleChatMessage = (chat) => {
    console.log(chat);
    setChats((prev) => [...prev, chat]);
  };

  const scrollableDivRef = useRef();

  const scrollToBottom = () => {
    if (scrollableDivRef.current) {
      const scrollHeight = scrollableDivRef.current.scrollHeight;
      scrollableDivRef.current.scrollTop = scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    // Scroll to the bottom when the component mounts or whenever the content changes

    socket.on(`chat-message-${activeRoom}`, handleChatMessage);
    setChats([]);
    api
      .post("/chats", {
        room: activeRoom,
      })
      .then((res) => {
        setChats(res.data.chats);
      })
      .catch((err) => console.log(err.response));
    return () => {
      socket.off(`chat-message-${activeRoom}`, handleChatMessage);
    };
  }, [activeRoom]);

  useEffect(() => {
    console.log(chats);
  }, [chats]);

  return (
    <Box
      p={2}
      ref={scrollableDivRef}
      height={"80vh"}
      overflow={"auto"}
      display={"flex"}
      flexDirection={"column"}
      gap={1}
    >
      {chats?.map((c, i) => (
        <Box
          key={i}
          display={"flex"}
          gap={1}
          justifyContent={c.name == user.username ? "flex-end" : "flex-start"}
        >
          <Box
            display={"flex"}
            alignItems={"flex-end"}
            gap={1}
            flexDirection={c.name == user.username ? "row-reverse" : "row"}
          >
            <Avatar>{c?.name?.slice(0, 1).toUpperCase()}</Avatar>
            <Box
              p={2}
              py={0.8}
              bgcolor={"#1b2c41"}
              borderRadius={1}
              minWidth={"10rem"}
            >
              <Typography
                fontSize={"0.8rem"}
                color={"#919aa3"}
                textTransform={"capitalize"}
              >
                {c?.name}
              </Typography>
              <Typography fontSize={"1rem"}>{c?.message}</Typography>
              <Typography
                mt={1}
                textAlign={"right"}
                fontSize={".6rem"}
                color={"gray"}
              >
                {formatTimestamp(c?.timestamp)}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const TextWindow = () => {
  const { activeRoom, user } = useContext(AppContext);

  const [msg, setMsg] = useState("");

  const send = () => {
    setMsg("")
    socket.emit(`chat-message`, {
      sender: user.username,
      room: activeRoom,
      message: msg,
    });
  };

  return (
    <Box
      p={2}
      flex={1}
      display={"flex"}
      gap={1}
      bgcolor={"black"}
      alignItems={"center"}
    >
      <TextField
        multiline
        maxRows={3}
        fullWidth
        variant="standard"
        placeholder="type here"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <Button variant="contained" onClick={send}>
        Send
      </Button>
    </Box>
  );
};

export default HomePage;
