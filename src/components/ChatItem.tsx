"use client"

import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ChatItem = ({ chat }:any) => {
const [viewDots, setViewDots] = useState(false);
const router = useRouter()

    return (
      <>
      <div onMouseEnter={(e)=>setViewDots(!viewDots)} onMouseLeave={(e)=>setViewDots(!viewDots)} onClick={() => router.push(`/chat/${chat._id}`)} className=" h-7 w-full hover:bg-opacity-20 hover:bg-slate-300  px-2 rounded mt-1 cursor-pointer font-semibold  bg-slate-300 text-black text-sm flex items-center justify-between">  
        {chat.title}
        <div>
       {viewDots &&  <EllipsisVertical size={20} />}
        </div>
      </div>
      {!chat&& (
            <p>NO chats available</p>
          )}
      
      </>
    );
  };

  export default ChatItem