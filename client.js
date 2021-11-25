const socket = io("https://gl-chat.herokuapp.com/", {
  transports: ["websocket"],
});

const messageInput = document.getElementById("message");
const chat = document.getElementById("chat");
const usersList = document.getElementById("users");

const uid = document.getElementById("uid");
const user = prompt("enter you username");

if (user == "" || user == null) {
  socket.emit("new-user", "anonymous");
  alert(
    "الرسائل المرسله لن يتم حفظها فى قاعده البيانات اذا اردت ان يتم حفظ البيانات اعد ادخال اسم مناسب"
  );
  uid.innerText = "anonymous";
  uid.style.color = "red";
} else {
  socket.emit("new-user", user);
  uid.innerText = user;
  uid.style.color = "var(--sent--bg)";
}

//if user found in dataBases then alert to conect

//else

//send messages handeling
messageInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const message = messageInput.value;

    if (message === "") {
      messageInput.placeholder = "enter message to send";
      messageInput.style.outlineColor = "#e74c3c";
      setInterval(() => {
        messageInput.placeholder = "type your message";
        messageInput.style.outlineColor = "transparent";
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
  showActive(n);
});

socket.on("user-disconnected", (n) => {
  const activeNow = document.querySelectorAll(".active");
  leaveMessage(`${n} disconnected`);
  activeNow.forEach((e) => {
    if (e.innerText == n) {
      e.remove();
    }
  });
});

socket.on("chat-message", (m, n) => {
  // console.log(m + "   " + n);
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
  // console.log(message);
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
    // console.log(messages[messages.length - 1]);
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
  if (n == "anonymous") {
    messageElement.innerHTML = `<div class="msg-text"><h3 style="color:red" class="name-text" id="received">${n}</h2><p>${m}</p></div>`;
    chat.append(messageElement);
  } else {
    messageElement.innerHTML = `<div class="msg-text"><h3 class="name-text" id="received">${n}</h2><p>${m}</p></div>`;
    chat.append(messageElement);
  }
  setTimeout(() => {
    const messages = document.querySelectorAll("#chat div");
    // console.log(messages[messages.length - 1]);
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
