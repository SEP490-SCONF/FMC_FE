import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";

export function useNotificationSignalR(userId, onReceive) {
  useEffect(() => {
    if (!userId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://fptfmc-ejh2frajb5byguc9.southeastasia-01.azurewebsites.net/notificationHub", {
        accessTokenFactory: () => localStorage.getItem("accessToken") // hoặc từ cookie
      })
      .withAutomaticReconnect()
      .build();

    connection.start();

    connection.on("ReceiveNotification", (title, content) => {
      if (onReceive) onReceive(title, content);
    });

    return () => {
      connection.stop();
    };
  }, [userId, onReceive]);
}