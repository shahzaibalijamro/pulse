"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getApiUrl } from "@/lib/api";
import type { LiveEvent } from "@/lib/types";

export function useSocket(apiKey: string | null, onEvent?: () => void) {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      setEvents([]);
      return;
    }

    const socket = io(getApiUrl(), {
      withCredentials: true,
      transports: ["websocket", "polling"]
    });

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("subscribe", { apiKey });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("event:new", (event: LiveEvent) => {
      setEvents((current) => [event, ...current].slice(0, 20));
      onEvent?.();
    });

    return () => {
      socket.disconnect();
    };
  }, [apiKey, onEvent]);

  return { events, connected };
}
