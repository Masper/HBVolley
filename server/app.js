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

var clients = [];

io.on("connection", socket => {
    console.log('Client connected.');
    clients.push(socket);

    io.send("Hello client!");
    socket.on('disconnect', function() {
        console.log('Client disconnected.');
        var i = clients.indexOf(socket);
        clients.splice(i, 1);
     });

     if (clients.length > 1) {
         console.log("more than 1");
     }
   

});
