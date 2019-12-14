const express = require('express');
const app = express();
const socket = require('socket.io');

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
}); 

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });

const io = socket.listen(server);

io.on("connection", socket => {
    io.send("Hello client!");
    console.log("Client connected through socket");

    socket.on('message', message => {
        console.log("Message received: " + message);
    })
});