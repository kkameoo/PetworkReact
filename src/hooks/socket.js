import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
const socket = new SockJS("http://localhost:8087/ws/alarm");
const stompClient = new Client({
  webSocketFactory: () => socket,
  reconnectDelay: 5000,
  onStompError: (frame) => {
    console.error("STOMP Error:", frame);
  }
});
let onNotificationCallback = null;
export const connectSocket = (userId, onNotification) => {
  console.log("알람 소켓 연결");
  onNotificationCallback = onNotification;
  stompClient.onConnect = () => {
    stompClient.subscribe(`/user/${userId}/notification`, (message) => {
      console.log(message);
      if (onNotificationCallback) {
        onNotificationCallback(JSON.parse(message.body));
      }
    });
  };
  stompClient.onDisconnect = () => {
    console.log("STOMP 연결 끊어짐");
  };
  stompClient.activate();

};
export default stompClient;
