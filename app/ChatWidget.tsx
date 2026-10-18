"use client";

import { useEffect } from "react";
import { createChat } from "@n8n/chat";
import "@n8n/chat/style.css";

/** Floating n8n assistant. Renders nothing when NEXT_PUBLIC_N8N_CHAT_URL is unset. */
export function ChatWidget() {
  useEffect(() => {
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_CHAT_URL;
    if (!webhookUrl) return;
    const app = createChat({
      webhookUrl,
      initialMessages: ["Hi! I'm the Brew & Co assistant.", "Ask me about the menu, opening hours, events or booking a table."],
      i18n: {
        en: {
          title: "Brew & Co",
          subtitle: "Questions about coffee, food or tables? Ask away.",
          footer: "",
          getStarted: "New conversation",
          inputPlaceholder: "Type your question…",
          closeButtonTooltip: "Close chat",
        },
      },
    });
    return () => app.unmount(); // StrictMode mounts twice in dev; avoid two widgets
  }, []);
  return null;
}
