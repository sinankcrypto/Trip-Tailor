// utils/createChatSocket.js
export function createChatSocket(packageId, onMessage) {
  // Read JWT token from cookie (same one used by Axios)
  const getTokenFromCookie = () => {
    const name = "access_token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length);
      }
    }
    return null;
  };

  const token = getTokenFromCookie();

  if (!token) {
    console.error("No JWT token found. Is user logged in?");
    onMessage({ type: "error", message: "Not authenticated" });
    return null;
  }

  // Pass token in query string — your Django middleware already supports this!
  const socket = new WebSocket(
    `ws://localhost:8000/ws/chat/package/${packageId}/?token=${token}`
  );

  socket.onopen = () => {
    console.log("Chat WebSocket connected & authenticated");
  };

  socket.onclose = (e) => {
    console.log("Chat WebSocket disconnected", e.code, e.reason);
  };

  socket.onerror = (e) => {
    console.error("Chat WebSocket error:", e);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error("Failed to parse message:", err);
    }
  };

  const send = (message) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ message }));
    } else {
      console.warn("WebSocket not open. ReadyState:", socket.readyState);
    }
  };

  const close = () => {
    socket.close();
  };

  return { socket, send, close };
}