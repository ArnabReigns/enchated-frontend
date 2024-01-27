import React, { createContext, useEffect, useState } from "react";
import api from "./api";
import { socket } from "./socket";

const AppContext = createContext();

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);

  const updateRooms = () => {
    api
      .post("/rooms", {
        username: user?.username,
      })
      .then((res) => setRooms(res.data.rooms))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    updateRooms();
  }, [user]);

  useEffect(() => {
    console.log("active room: " + activeRoom);
  }, [activeRoom]);

  useEffect(() => {
    rooms.forEach((r) => {
      socket.emit("join-room", r?.name);
    });
  }, [rooms]);

  const value = {
    user,
    setUser,
    rooms,
    updateRooms,
    activeRoom,
    setActiveRoom,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default ContextProvider;
export { AppContext };
