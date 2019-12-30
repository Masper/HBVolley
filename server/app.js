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

var allClients = [];
let ready1 = false;
let ready2 = false; 

io.on("connection", socket => {
    allClients.push(socket);
    io.send("Hello client!");
    let i = allClients.length; 
    socket.emit('welcome', { message: 'Welcome!', id: socket.id, position: i-1 });

    socket.on('ready1', a => {
        ready1 = true; 
        if (ready1 && ready2 && allClients.length > 2) {
            socket.emit('startgame', "YES!");
        }
    })

    socket.on('ready2', a => {
        ready2 = true; 
        if (ready1 && ready2 && allClients.length > 2) {
            socket.emit('startgame', "YES!");
        }
    })



    socket.on('disconnect', function() {
        console.log('Got disconnect!');
  
        var i = allClients.indexOf(socket);
        allClients.splice(i, 1);
     });
   
    socket.on('ball1', message => {
        console.log("ball: " + message.x + " " + message.y);
    })

    socket.on('dude1', message => {
        socket.emit('dude', message);
        console.log("dude: " + message.x + " " + message.y);
    })

    socket.on('room', message => {
        console.log(message);
        socket.emit('rooms',"testje");
    })
});
