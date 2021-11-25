const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
var http = require("http");
var express = require("express");
var app = express();
var server = http.createServer(app);
var io = require("socket.io")(server);
server.listen(port);
app.use(express.static("./"));

//modules
const dataUsers = require("./modules/users");
const dataMsgs = require("./modules/msgs");
// const dataaccount = require("./modules/accounts");
const online = require("./modules/online");

mongoose.connect(
  "mongodb+srv://7oda:14759631475963@cluster0.gvujt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

/*-------------------------------------------server side --------------------------------------------------*/

// Expose the node_modules folder as static resources (to access socket.io.js in the browser)
app.use("/static", express.static("node_modules"));
const users = {};

io.on("connection", (socket) => {
  //new user joined the chat handling serverside
  dataMsgs.find().then((result) => {
    socket.emit("getMsgsDb", result);
  });

  socket.on("new-user", (n) => {
    users[socket.id] = n;
    socket.broadcast.emit("user-connected", n);
    //

    var query = dataUsers
      .find({
        user_name: n,
      })
      .lean()
      .limit(1);

    // Find the document
    query.exec(async function (error, result) {
      var savedUser = null;
      if (error) {
        throw error;
      }
      // If the document doesn't exist
      if (!result.length) {
        // Create a new one
        const newUser = new dataUsers({
          user_name: n,
          userMsgsNo: 0,
        });
        //user not found do somthing
        savedUser = await newUser.save();
        savedUser.save(function (error) {
          if (error) {
            return error;
          }
          // do something with the document here
        });
      } else {
        //user found do something
      }
    });
  });

  //user leaved the chat handling serverside
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    socket.broadcast.emit("leaved-users", users[socket.id]);
    delete users[socket.id];
  });

  //handling chat messages
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", message, users[socket.id]);
    let id = users[socket.id];

    // send msg to data bases

    if (id !== "anonymous") {
      const msg = new dataMsgs({ msg: message, name: id });
      msg.save(async function (err) {
        if (err) return handleError(err);
        // saved!
      });
    }
  });
});
