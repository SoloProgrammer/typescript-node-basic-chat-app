import { userType } from "../types/types.js";
import io from "socket.io-client";

const socket = io();
const user = {
  name: localStorage.getItem("name"),
  id: localStorage.getItem("id"),
  image: localStorage.getItem("image"),
};
var typingdelay: any;
const TypingIndicatorGif =
  "https://user-images.githubusercontent.com/3059371/49334754-3c9dfe00-f5ab-11e8-8885-0192552d12a1.gif";

window.addEventListener("load", () => socket.emit("setup", user));
const input = document.getElementById("input");
function scrollToBottom() {
  const scrollHeight = messagesContainer!.scrollHeight;
  messagesContainer!.scrollTo(scrollHeight, scrollHeight);
}
const messagesContainer: HTMLElement | null =
  document.querySelector(".messages");

const form = document.querySelector("form");

form?.addEventListener("submit", (e: SubmitEvent) => {
  handleSubmit(e);
});

const handleSubmit = (e: SubmitEvent) => {
  e.preventDefault();
  const message = (input as HTMLInputElement).value;
  if (!message.trim()) return;
  (input as HTMLInputElement).value = "";
  socket.emit("new-message", message, user);
};

socket.on("active-users", (activeusers: userType[]) => {});

socket.on("new-message", (messageData: { message: string; user: userType }) => {
  const { user: u, message } = messageData;
  const messageNode = `<div class="${
    u.id !== user.id ? "left" : "right"
  } messageBar">
  ${
    u.id !== user.id ? `<img class="userImg" src="${u.image}" width="30"/>` : ""
  }
  <p class="message">${message}</p>    
  </div>`;

  // removing typing indicator if message reached to the receiver's end before the typing indicator paused/vanished!
  const typingIndicator = getTypingIndicatorNode();
  if (messageData.user.id !== user.id && typingIndicator) {
    clearTimeout(typingdelay);
    (messagesContainer as HTMLElement).removeChild(typingIndicator);
  }

  messagesContainer!.innerHTML += messageNode;

  // moving scroll bar to the start of the messagesContainer
  scrollToBottom();
});

(input as HTMLInputElement).addEventListener("input", (e) => {
  socket.emit("typing", user);
  clearTimeout(typingdelay);
  typingdelay = setTimeout(() => {
    socket.emit("stop-typing", user);
  }, 500);
});

function getTypingIndicatorNode() {
  let indicator = document.getElementById("typingIndicator");
  return indicator as Node;
}

function createTypingIndicatorNode() {
  // 1) this fucntion will trigger everytime when typing event happens so instead of creating indicatorNode again and again
  // 2) we are returning the created Node and for the very first time it will create Node
  // 3) bcz getTypingIndicatorNode() will return undefined!
  if (getTypingIndicatorNode()) return getTypingIndicatorNode();

  const indicator = document.createElement("div");
  indicator.classList.add("messageBar");
  indicator.classList.add("left");
  indicator.setAttribute("id", "typingIndicator");
  const img = document.createElement("img");
  img.setAttribute("src", TypingIndicatorGif);
  img.setAttribute("width", "60");
  indicator.appendChild(img);
  return indicator;
}

socket.on("typing", (u: userType) => {
  scrollToBottom();
  const typingIndicator = createTypingIndicatorNode();

  u.id !== user.id &&
    typingIndicator &&
    (messagesContainer as HTMLElement).appendChild(typingIndicator);
});

socket.on("stop-typing", (u: userType) => {
  getTypingIndicatorNode() &&
    messagesContainer!.removeChild(getTypingIndicatorNode());
});
