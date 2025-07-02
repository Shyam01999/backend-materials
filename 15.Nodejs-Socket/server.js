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

io.on("connection", (socket)=>{
    console.log("A user is now connected")

    //handle user when they will join the chat
    socket.on('join', (userName)=>{
        users.add(userName)


        //board to all users that a new user has joined
        io.emit('userJoined');

        //send the updated user list to all clients
        io.emit("userList", Array.form(users));

        
    })  
    //handle incomming chat message

    //handle user disconnection
})

//routes
// app.use("/api/user", )


server.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})






