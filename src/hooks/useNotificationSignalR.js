import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";

export function useNotificationSignalR(userId, onReceive) {
  useEffect(() => {
    if (!userId) return;
    const baseUrl = import.meta.env.VITE_API_DOMAIN_URLHUB;
    const hubUrl = `${baseUrl}/notificationHub`;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => localStorage.getItem("accessToken") // hoặc từ cookie
      })
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        if (import.meta.env.DEV) {
          // console.log("SignalR connected successfully");
        }
      })
      .catch(() => {
        // Ẩn log lỗi trong production
        if (import.meta.env.DEV) {
          console.error("SignalR connection failed");
        }
      });

    connection.on("ReceiveNotification", (title, content) => {
      if (onReceive) onReceive(title, content);
    });

    return () => {
      connection.stop();
    };
  }, [userId, onReceive]);
}