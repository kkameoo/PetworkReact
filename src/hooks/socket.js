import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
const socket = new SockJS("http://localhost:8087/ws");
const stompClient = new Client({
  webSocketFactory: () => socket,
  reconnectDelay: 5000,
});
let onNotificationCallback = null;
export const connectSocket = (userId, onNotification) => {
  onNotificationCallback = onNotification;
  stompClient.onConnect = () => {
    stompClient.subscribe(`/user/${userId}/notification`, (message) => {
      console.log(message);
      if (onNotificationCallback) {
        onNotificationCallback(JSON.parse(message.body));
      }
    });
  };
  stompClient.activate();
};
export default stompClient;
