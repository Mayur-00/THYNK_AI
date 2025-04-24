"use client";

import ChatBubble from "@/components/ChatBubble";
import InputComponent from "@/components/InputComponent";
import React, { useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/types/ChatMessage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getHistoryChats, sendMessage } from "@/lib/ChatFunctions/api";
import { useRouter } from "next/navigation";
import PageLoaderComponent from "@/components/PageLoaderComponent";
import { Menu } from "lucide-react";
import SideBar from "@/components/SideBar";
import { toast } from "sonner";

const Page = ({ params }: { params: Promise<{ chatId: string }> }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  
  // Unwrap the params
  const { chatId: paramChatId } = React.use(params);
  const isNewChat = paramChatId === "new";

  // Fetching chat history (only if not a new chat)
  const { data: chatHistory, isLoading, error, isError } = useQuery({
    queryKey: ["chats", paramChatId],
    queryFn: () => getHistoryChats(paramChatId),
    enabled: !!paramChatId && paramChatId !=="new", // Don't fetch for "new" chat
    retry: 2,
  });

  // Mutation for sending a new message
  const mutation = useMutation({
    mutationFn: sendMessage,
  });

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSubmit = async (message: string) => {
    // Check if we're in the "new" chat page
    if (isNewChat) {
      // Create a new chat with this first message
      mutation.mutate(
        {
          message,
          history: [], // No history for a new chat
          chatId: "newChat",
        },
        {
          onSuccess: (data) => {
            // Navigate to the new chat page with the returned chatId
            if (data.chatId) {
              router.push(`/chat/${data.chatId}`);
            }
          },
        }
      );
    } else {
      // We're in an existing chat, add messages normally
      const newUserMessage = {
        role: "user",
        content: message,
      };
      
      // Add user message
      setMessages((prev) => [...prev, newUserMessage]);
      
      // Add an empty model message as a placeholder for loading
      setMessages((prev) => [...prev, { role: "model", content: "" }]);

      // Scroll to bottom immediately when user sends a message
      setTimeout(scrollToBottom, 50);

      mutation.mutate(
        {
          message,
          history: messages,
          chatId: paramChatId,
        },
        {
          onSuccess: (data) => {
            // Replace the empty message with the actual response
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = { role: "model", content: data.reply };
              return newMessages;
            });
            
            // Scroll to bottom again when response is received
            setTimeout(scrollToBottom, 50);
          },
        }
      );
    }
  };

  // Set initial chat history on load and scroll to bottom
  useEffect(() => {
    if (chatHistory && !isNewChat) {
      setMessages(chatHistory);
      // Initial scroll to bottom after loading chat history
      setTimeout(scrollToBottom, 100);
    }
  }, [chatHistory, isNewChat]);

  // Additional useEffect to handle scrolling when messages change
  useEffect(() => {
    if (messages.length > 0) {
      // Small delay to ensure DOM has updated
      setTimeout(scrollToBottom, 50);
    }
  }, [messages.length]);

  // Skip loading state for new chats
  if (isLoading && !isNewChat) return <PageLoaderComponent />;

  return (
    <div className="bg-white h-screen w-screen flex relative overflow-hidden">
      <SideBar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <div className={`flex flex-col h-full w-full transition-all duration-300`}>
        {/* Header with menu button */}
        <div className="h-12 border-b flex items-center px-4">
          <button 
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
        </div>
        
        {/* Chat messages container */}
        <div 
          className="flex-1 overflow-y-auto flex flex-col gap-5 p-4 scrollbar-thin"
          ref={chatContainerRef}
        >
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <ChatBubble 
                key={index} 
                content={message} 
                error={mutation.error}
                isLoading={mutation.isPending && index === messages.length - 1 && message.role === "model" && message.content === ""} 
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">
              {isNewChat ? "Start a new conversation" : "No messages in this chat yet"}
            </div>
          )}
        </div>
        
        {/* Input container */}
        <div className="p-4 border-t">
          <InputComponent onSendMessage={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Page;