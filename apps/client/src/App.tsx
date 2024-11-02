import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function Index() {
  const [count, setCount] = useState(0);
  const socket: any = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:5000/counts", {
      withCredentials: true,
      transports: ["websocket"],
    });
  }, []);

  useEffect(() => {
    socket.current.emit("events", { count: count });
    socket.current.on("events", (response: any) => {
      console.log("Server response:", response);
    });
  }, [count]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <button
        onClick={() => {
          axios.post(
            "http://localhost:3000/api/v1/auth/session",
            {
              username: "john",
              password: "changeme",
            },
            {
              withCredentials: true,
            }
          );
        }}
      >
        Session
      </button>
      <button
        onClick={() => {
          const token = "test";
          window.location.href = `http://localhost:3000/api/v1/google?token=${token}`;
        }}
      >
        Google
      </button>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

function NotFound() {
  return (
    <>
      <h1>404 Not Found</h1>
    </>
  );
}

export default App;
