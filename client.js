const socket = io("https://gl-chat.herokuapp.com/", {
  transports: ["websocket"],
});

const messageInput = document.getElementById("message");
const chat = document.getElementById("chat");
const usersList = document.getElementById("users");
// const activeUsers = ["mahmoud", "ayman"];
// if (activeUsers.includes(name)) {
//   console.log("connected");
//   console.log(activeUsers);
//   joinMessage("you joined the chat ");
//   socket.emit("new-user", name);
// } else {
//   const name = prompt(
//     "you are not registered continue as guest enter your name"
//   );
//   if (activeUsers.includes(name)) {
//     console.log("already connected");
//     console.log(activeUsers);
//     joinMessage("you joined the chat ");
//     socket.emit("new-user", name);
//   } else {
//     activeUsers.push(name);
//     socket.emit("new-user", name);
//   }

//   console.log(activeUsers);
// }

const user = prompt("enter you username");
joinMessage("you joined the chat ");
socket.emit("new-user", user);

//if user found in dataBases then alert to conect

//else

//send messages handeling
messageInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const message = messageInput.value;
    console.log(message);
    if (message === "") {
      messageInput.placeholder = "enter message to send";
      setInterval(() => {
        messageInput.placeholder = "type your message";
      }, 1000);
    } else {
      socket.emit("send-chat-message", message);
      sendMessage(message);
      messageInput.value = "";
    }
  }
});

socket.on("getMsgsDb", (data) => {
  if (data.length) {
    data.forEach((data) => {
      if (data.name == user) {
        sendMessage(data.msg);
      } else {
        receiveMessage(data.msg, data.name);
      }
    });
  }
});

socket.on("user-connected", (n) => {
  joinMessage(`${n} connected`);
});

socket.on("user-disconnected", (n) => {
  leaveMessage(`${n} disconnected`);
});

socket.on("active-users", (users) => {
  showActive(users);
  console.log(users);
});
socket.on("leaved-users", (n) => {
  const list = document.querySelectorAll("#users li");
  console.log(n);
  list.forEach((e) => {
    if (e.innerText == n) {
      e.remove;
    }
  });
});
//receive messages throught socket handeling

socket.on("chat-message", (m, n) => {
  console.log(m + "   " + n);
  receiveMessage(m, n);
});

/* helper funcations */

//helper funcation when user join the chat Message & append it on chat

function joinMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.setAttribute("class", "join");
  messageElement.innerText = message;
  chat.append(messageElement);
}

//helper funcation when user leave the chat Message & append it on chat

function leaveMessage(message) {
  console.log(message);
  const messageElement = document.createElement("div");
  messageElement.setAttribute("class", "leave");
  messageElement.innerText = message;
  chat.append(messageElement);
}

//helper funcation send Message & append it on chat

function sendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.setAttribute("class", "msg-row sent");
  messageElement.innerHTML = `<div class="msg-text"><p>${message}</p></div>`;
  chat.append(messageElement);
  setTimeout(() => {
    const messages = document.querySelectorAll("#chat div");
    console.log(messages[messages.length - 1]);
    const lastMessage = messages[messages.length - 1];
    const viewNew = lastMessage.offsetTop;
    chat.scroll({
      top: viewNew,
    });
  }, 1000);
}

//helper funcation receive Message & append it on chat

function receiveMessage(m, n) {
  const messageElement = document.createElement("div");
  messageElement.setAttribute("class", "msg-row received");
  messageElement.innerHTML = `<div class="msg-text"><h3 class="name-text" id="received">${n}</h2><p>${m}<p></div>`;
  chat.append(messageElement);
  setTimeout(() => {
    const messages = document.querySelectorAll("#chat div");
    console.log(messages[messages.length - 1]);
    const lastMessage = messages[messages.length - 1];
    const viewNew = lastMessage.offsetTop;
    chat.scroll({
      top: viewNew,
    });
  }, 1000);
}
function showActive(users) {
  const usersE = document.createElement("li");
  usersE.setAttribute("class", "active");
  usersE.innerText = users;
  usersList.append(usersE);
}
