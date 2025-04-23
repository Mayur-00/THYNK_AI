"use client"

import { ChatMessage } from "@/types/ChatMessage";
import React, { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

interface Props {
  content: ChatMessage,
  error?: Error | null,
  isLoading?: boolean
}

const ChatBubble: React.FC<Props> = ({ content, error, isLoading }) => {
  const isUser = content.role === "user";
  const codeBlockRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    if (codeBlockRef.current) {
      const codeElement = codeBlockRef.current.querySelector('code');
      if (codeElement) {
        try {
          await navigator.clipboard.writeText(codeElement.textContent || '');
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
        } catch (err) {
          console.error("Failed to copy text: ", err);
          // Optionally show an error message to the user
        }
      }
    }
  };

  // Check if this is a loading bubble
  const isLoadingBubble = content.role === "model" && content.content === "" && isLoading;

  return (
    <div className={`flex w-full font-sans ${isUser ? "justify-end" : "justify-center"} p-5`}>
      <div
        className={`rounded-lg p-3 break-words ${
          isUser
            ? "bg-blue-600 text-white max-w-[80%] sm:max-w-md"
            : "text-black w-[90%] sm:w-full bg-zinc-100 sm:max-w-xxl"
        } relative`}
      >
        {isLoadingBubble ? (
          <div className="flex space-x-2 items-center p-2">
            <div className="text-gray-500"> THYNKING</div>
            <div className="flex space-x-1">
              {[0, 1, 2].map((index) => (
                <div 
                  key={index}
                  className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"
                  style={{ animationDelay: `${index * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <ReactMarkdown
            components={{
              code: ({ className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || "");
                
                return match ? (
                  <>
                    <div className="w-full text-gray-300 bg-[#282A36] mb-[1px] px-4 py-1 rounded-sm ">
                      {match[1]}
                    </div>
                    <div className="relative" ref={codeBlockRef}>
                      <SyntaxHighlighter
                        language={match[1]}
                        style={dracula as any}
                        PreTag="div"
                        className="rounded-md !m-0" // Override default margins
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                      <button
                        onClick={handleCopyToClipboard}
                        className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-md p-1 hover:bg-opacity-70 focus:outline-none cursor-pointer"
                      >
                        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content.content}
          </ReactMarkdown>
        )}
        
        {content.role === "tool_code" && (
          <div className="text-xs text-gray-500 italic mt-1">Code</div>
        )}
        {content.role === "tool_outputs" && (
          <div className="text-xs text-green-500 italic mt-1">Output</div>
        )}
          {error && (
            <div className="flex space-x-2 items-center p-2">
            <div className="text-gray-500"> {error.message}</div>
  
          </div>
          )}
      </div>
    </div>
  );
};

export default ChatBubble;