"use client";

import { Ichat } from '@/app/models/chat.model';
import { getHistory } from '@/lib/ChatFunctions/api';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface SideBarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SideBar = ({ isOpen, onToggle }: SideBarProps) => {
  const [chats, setChats] = useState<Ichat[]>([]);
  const router = useRouter();

  const { data: history, error, isLoading } = useQuery({
    queryKey: ["chathistory"],
    queryFn: getHistory
  });

  useEffect(() => {
    if (history) {
      setChats(history);
    }
  }, [history]);

  const NewChatClickHandler = () => {
    toast.success("New chat created");
    router.replace("/chat/new");
  };

  return (
    <div className={`h-screen bg-zinc-100 fixed top-0 left-0 z-10 transition-all duration-300 flex flex-col items-center ${isOpen ? "w-[250px]" : "w-0"} overflow-hidden`}>
      <div className='w-full h-[30%] p-2 flex flex-col gap-10 relative'>
        <div className="flex justify-between items-center">
          <button className='font-bold text-xl h-10'>THYNK</button>
          <button 
            onClick={onToggle} 
            className="p-2 rounded-full hover:bg-zinc-200"
            aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>
        <button 
          className='bg-slate-900 rounded-sm h-10 w-full cursor-pointer text-white' 
          onClick={NewChatClickHandler}
        >
          New Chat
        </button>
      </div>
      <div className='w-full h-[70%] p-2'>
        <span className="font-medium">Recents</span>
        <div id='sidebar-part-2-overflow-div' className='h-[94%] w-full flex flex-col p-2 gap-2 overflow-y-scroll scrollbar-thin'>
          {isLoading ? (
            <div className="text-sm text-gray-500">Loading chats...</div>
          ) : error ? (
            <div className="text-sm text-red-500">Failed to load chats</div>
          ) : chats.length === 0 ? (
            <div className="text-sm text-gray-500">No recent chats</div>
          ) : (
            chats.map((chat, idx) => (
              <div 
                key={idx} 
                className='h-10 w-full bg-zinc-800 px-2 py-2 rounded-xl text-white text-sm cursor-pointer hover:bg-zinc-700'
                onClick={() => router.push(`/chat/${chat._id}`)}
              >
                {chat?.title || "Untitled Chat"}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;