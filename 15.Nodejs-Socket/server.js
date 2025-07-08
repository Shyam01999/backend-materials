require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectToDb = require("./database/db");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080
connectToDb();

//initial socket.io and attached this to the http server
const io = socketIo(server) 

//middleware
app.use(express.static('public'));
app.use(express.json());

const users = new Set();
console.log("users", users)
io.on("connection", (socket)=>{
    console.log("A user is now connected")

    //handle user when they will join the chat
    socket.on('join', (userName)=>{
        users.add(userName);
        socket.userName = userName;


        //board to all users that a new user has joined
        io.emit('userJoined', userName);

        //send the updated user list to all clients
        io.emit("userList", Array.from(users));

        
    })  

    //handle incomming chat message
    socket.on('chatMessage', (message)=>{
        //broadcast the message to all users
        io.emit('chatMessage', message);
    })

    //handle user disconnection
    socket.on('disconnect', ()=>{
        console.log("A user is now disconnected", socket.userName)
        //remove the user from the set
        users.forEach((user) => {
            if (user === socket.userName) {
                users.delete(user);

                io.emit('userLeft', user);

                //send the updated user list to all clients
                io.emit("userList", Array.from(users));
            }
        });
    })
})

//routes
// app.use("/api/user", )


server.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})






