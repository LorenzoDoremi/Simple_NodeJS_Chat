import { append_user, delete_user, get_users } from "./app.js";

import express from "express";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fetch from "node-fetch";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);


var data =  [
  {gatto: "persiano", peso: 4},
  {gatto: "gattone", peso: 10},
  {gatto: "siamese", peso: 3},
  {gatto: "gattino", peso: 2},
]

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



var options = {
  headers: {
  mode: 'no-cors'
  }
}

// tentativo comprensione CORS
const getApiData = async () => {
  const response = await fetch(
    "https://klinkart.altervista.org/datajson.php", options
  ).then((response) => response.json());
  
  console.log(response);
 
};
getApiData();


// http://localhost:3000/2grade?coeff=[2,3,1]
// questa app REST ritorna le soluzioni di un'equazione di secondo grado
app.get("/2grade", (req,res) => {
  
  var coeffs = JSON.parse(req.query.coeff);
  
  var a  = coeffs[0];
  var b  = coeffs[1];
  var c  = coeffs[2];
  var x1 = -b + Math.sqrt(b*b - 4*a*c);
  var x2 = -b - Math.sqrt(b*b - 4*a*c);
  
  res.json([{x1: x1, x2: x2 }])
})

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
