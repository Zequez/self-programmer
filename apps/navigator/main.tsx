console.log("Navigator loaded!");

const socket = new WebSocket("ws://localhost:8090");
socket.addEventListener("reload", () => {
  location.reload();
});
