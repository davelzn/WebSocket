const fs = require('fs');
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { Server } = require('socket.io'); // importazione oggetto Server da socket.io
const conf = JSON.parse(fs.readFileSync("./conf.json"));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);

app.use("/", express.static(path.join(__dirname, "public")));
const server = http.createServer(app);
const io = new Server(server);
let users = [];
io.on('connection', (socket) => {
    console.log("socket connected: " + socket.id);
    io.emit("list", users); //invio la lista di chi é gia in chat quando ci si unisce
    socket.on('name', (name) => {
        users.push({Id : socket.id, name : name}) //aggiungo il nuovo utente
        io.emit("list", users);
    })
    socket.on('message', (message) => {
        const response = socket.id + ': ' + message;
        console.log(response);
        io.emit("chat", response);
    });
    socket.on('disconnect', () => { //Se qualcuno si disconnette
        console.log("quit: " + socket.id);
        for (let i = 0; i < userList.length; i++) {
            if (userList[i].socketId === socket.id) {
                userList.splice(i, 1);
                break; 
            }
        }

        io.emit("list", userList);
    });
});
server.listen(conf.port, () => {
    console.log("server running on port: " + conf.port);

});