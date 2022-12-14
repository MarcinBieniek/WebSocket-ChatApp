const socket = io();

// socket listener
socket.on('message', ({ author, content }) => addMessage(author, content))

// chat elements 
const loginForm = document.getElementById("welcome-form");
const messagesSection = document.getElementById("messages-section");
const messagesList = document.getElementById("messages-list");
const addMessageForm = document.getElementById("add-messages-form");
const userNameInput = document.getElementById("username");
const messageContentInput = document.getElementById("message-content");

// global variables

let userName;
let loginAlertText;
let loginAlrt = document.getElementById("loginAlert");
let messageAlertText;
let messageAlrt = document.getElementById("messageAlert");

// login function

const login = function(event){
  event.preventDefault();
  
  if(userNameInput.value == ""){
    loginAlertText = "Please write your name";
  } else {
    userName = userNameInput.value;
    socket.emit('join', userName);
    loginForm.classList.remove("show");
    messagesSection.classList.add("show");
  }
  
  loginAlrt.innerHTML = loginAlertText;
  
}

loginForm.addEventListener("submit", function(event){
  login(event);
})

// send message function

const sendMessage = function(event){
  event.preventDefault();

  let messageContent = messageContentInput.value;
  
  if(messageContent == ""){
    messageAlertText = "Please, write a message";
  } else {
    messageAlrt.innerHTML = "";
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent });
    messageContent = "";   
  }

  messageAlrt.innerHTML = messageAlertText;
}

const addMessage = function(author, content){
  const message = document.createElement('li');
  message.classList.add("message");
  message.classList.add("message--received");
  if (author == userName) {
    message.classList.add("message--self")
  };
  message.innerHTML = `
  <h3 class="message__author">${userName === author ? 'You' : author}</h3>
  <div class="message__content">${content}<div>
  `;
  messagesList.appendChild(message);
}

addMessageForm.addEventListener("submit", function(event){
  sendMessage(event);
})

