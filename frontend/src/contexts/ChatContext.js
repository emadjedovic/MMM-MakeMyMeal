import React, { createContext, useState, useContext, useEffect } from "react";
import { fetchUserInfoFromChat, fetchChats } from "../chat/chatApi.js";
import { UserContext } from "./UserContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const { token, user } = useContext(UserContext);

  useEffect(() => {
    const handleFetchChats = async () => {
      try {
        const fetchedChats = await fetchChats(token, user.id);

        const chatsWithInfo = await Promise.all(
          fetchedChats.map(async (chat) => {
            const userInfo = await fetchUserInfoFromChat(token, user.id, chat.id);
            return {
              ...chat,
              firstName: userInfo.first_name,
              lastName: userInfo.last_name,
              role: userInfo.role,
              userId: userInfo.id,
              hasUnreadMessages: chat.hasUnreadMessages || false, // Ensure default value
            };
          })
        );

        setChats(chatsWithInfo);
      } catch (error) {
        console.error("Failed to fetch chats", error);
      }
    };
      handleFetchChats();
  }, [token, user]);

  const markMessagesAsRead = (chatId) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, hasUnreadMessages: false } : chat
      )
    );
  };

  const updateChatUnreadStatus = (chatId, hasUnreadMessages) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, hasUnreadMessages } : chat
      )
    );
  };

  return (
    <ChatContext.Provider value={{ chats, setChats, markMessagesAsRead, updateChatUnreadStatus }}>
      {children}
    </ChatContext.Provider>
  );
};
