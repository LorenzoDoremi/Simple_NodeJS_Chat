import { append_user, delete_user, get_users } from "./app.js";

import express from "express";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const IP = process.env.YOUR_HOST || "0.0.0.0";
const port = process.env.PORT || 3000;
// GET FILES
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/config.js", (req, res) => {
  res.sendFile(__dirname + "/config.js");
});
app.get("/app.js", (req, res) => {
  res.sendFile(__dirname + "/app.js");
});
app.get("/socket.js", (req, res) => {
  res.sendFile(__dirname + "/node_modules/socket.io/client-dist/socket.io.js");
});

// funzione per utilizzare file statici
app.use(express.static(__dirname + "/public"));

// SOCKET PART

io.on("connection", (socket) => {
  // nuovo connesso
  socket.on("conn", (connection) => {
  
    console.log(connection.randomid+" HA LOGGATO");
    append_user(connection);
    io.emit("user", get_users());
  });
  // nuovo messaggio
  socket.on("msg", (msg) => {
    io.emit("new message", msg);
  });

  // l'utente x slogga
  socket.on("disconnect", () => {
    console.log(socket.id+" E' USCITO!");
    delete_user(socket.id);
    io.emit("user", get_users());
  });
});

server.listen(port, IP, () => {
  console.log("listening on port: " + port);
});
