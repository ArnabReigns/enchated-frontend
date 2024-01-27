import {
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import api from "../api";
import { AppContext } from "../AppContext";
import { socket } from "../socket";

const Sidebar = () => {
  const { user } = useAuth();
  const { rooms, updateRooms, activeRoom, setActiveRoom } =
    useContext(AppContext);

  const activeRoomRef = useRef(activeRoom);

  const [crErr, setcrErr] = useState("");
  const [croom, setCroom] = useState({
    name: "",
    password: "",
  });

  const [jnErr, setjnErr] = useState("");
  const [jroom, setJroom] = useState({
    name: "",
    password: "",
  });

  const joinRoom = () => {
    api
      .post("/add-room", {
        user: user.username,
        room: jroom,
      })
      .then((res) => {
        if (res.data.success) {
          updateRooms();
          setJroom({ name: "", password: "" });
          setJoinRoomOpen(false);
        } else {
          setJroom({ name: "", password: "" });
          setjnErr(res.data.msg);
        }
      })
      .catch((err) => console.log(err));
  };

  const createRoom = () => {
    api
      .post("/create-room", {
        user: user.username,
        room: croom,
      })
      .then((res) => {
        if (res.data.success) {
          updateRooms();
          setJroom({ name: "", password: "" });
          setCreateRoomOpen(false);
        } else {
          setCroom({ name: "", password: "" });
          setcrErr(res.data.msg);
        }
      })
      .catch((err) => console.log(err));
  };

  const [createRoomOpem, setCreateRoomOpen] = useState(false);
  const [joinRoomOpem, setJoinRoomOpen] = useState(false);

  const [nots, setNots] = useState({});

  const manageNotifications = (e) => {
    if (e.room == activeRoomRef.current) return;
    setNots((prev) => ({ ...prev, [e.room]: (prev[e.room] ?? 0) + 1 }));
  };

  useEffect(() => {
    activeRoomRef.current = activeRoom;
    setNots((prev) => ({ ...prev, [activeRoom]: 0 }));
  }, [activeRoom]);

  useEffect(() => {
    console.log(nots);
  }, [nots]);

  useEffect(() => {
    socket.on("notification", manageNotifications);

    return () => {
      socket.off("notification", manageNotifications);
    };
  }, []);

  return (
    <Box
      height={"100%"}
      width={"17rem"}
      bgcolor={"#061018"}
      p={2}
      display={"flex"}
      flexDirection={"column"}
    >
      <Typography
        color={"white"}
        fontWeight={500}
        fontSize={"1.5rem"}
        textTransform={"uppercase"}
      >
        en
        <Typography
          fontWeight={300}
          fontSize={"inherit"}
          component={"span"}
          color={"#E35B32"}
        >
          chated
        </Typography>
      </Typography>

      <Box mt={2} flex={1} overflow={"auto"}>
        <Typography sx={{ mt: 3, mb: 1, fontSize: "0.8rem", color: "#bcbcbc" }}>
          Your Rooms
        </Typography>

        <Box display={"flex"} flexDirection={"column"} gap={1}>
          {rooms?.map((r, i) => (
            <Box
              onClick={() => setActiveRoom(r.name)}
              key={i}
              p={2}
              bgcolor={activeRoom == r.name ? "#121E2C" : "transparent"}
              borderRadius={2}
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                ":hover": {
                  bgcolor: "#121E2C",
                },
              }}
            >
              <Typography
                sx={{
                  color: activeRoom == r.name ? "#E35B32" : "#fff",
                  mr: 'auto'
                }}
              >
                {r?.name}
              </Typography>
              {nots[r?.name] > 0 && (
                <Box
                  sx={{
                    height: "1.5rem",
                    aspectRatio: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: '50%',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                  bgcolor={"success.main"}
                >
                  {nots[r?.name]}
                </Box>
              )}
              {r?.creator == user?.username && (
                <IconButton size="medium">
                  <Icon icon="fa:trash" color="red" fontSize={"1rem"} />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* join room */}
      <Dialog
        open={joinRoomOpem}
        onClose={() => setJoinRoomOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box p={2} py={2}>
          <Typography>Add Room</Typography>

          <Box display={"flex"} gap={1} mt={2}>
            <TextField
              label="Room name"
              fullWidth
              size="small"
              value={jroom.name}
              onChange={(e) => {
                setjnErr("");
                setJroom((prev) => ({ ...prev, name: e.target.value }));
              }}
            />
            <TextField
              label="Password"
              fullWidth
              size="small"
              value={jroom.password}
              onChange={(e) =>
                setJroom((prev) => ({ ...prev, password: e.target.value }))
              }
            />
            <LoadingButton
              size="small"
              sx={{ px: 4 }}
              variant="contained"
              onClick={joinRoom}
            >
              Add
            </LoadingButton>
          </Box>

          <Typography mt={1} color={"error"}>
            {jnErr}
          </Typography>
        </Box>
      </Dialog>
      {/* create room */}
      <Dialog
        open={createRoomOpem}
        onClose={() => setCreateRoomOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box p={2} py={2}>
          <Typography>Create Room</Typography>

          <Box display={"flex"} gap={1} mt={2}>
            <TextField
              label="Room name"
              fullWidth
              size="small"
              value={croom.name}
              onChange={(e) =>
                setCroom((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <TextField
              label="Password"
              fullWidth
              size="small"
              value={croom.password}
              onChange={(e) =>
                setCroom((prev) => ({ ...prev, password: e.target.value }))
              }
            />
            <LoadingButton
              size="small"
              sx={{ px: 4 }}
              variant="contained"
              onClick={createRoom}
            >
              Create
            </LoadingButton>
          </Box>

          <Typography mt={1} color={"error"}>
            {crErr}
          </Typography>
        </Box>
      </Dialog>
      <Button
        variant="outlined"
        sx={{ mb: 1 }}
        onClick={() => setJoinRoomOpen(true)}
      >
        Add Room
      </Button>
      <Button
        fullWidth
        variant="contained"
        mt={1}
        onClick={() => setCreateRoomOpen(true)}
      >
        Create Room
      </Button>
    </Box>
  );
};
// color={"#E35B32"}
export default Sidebar;
