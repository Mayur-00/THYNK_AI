"use client"

import { getHistory } from '@/lib/ChatFunctions/api';
import { addChatsToProject } from '@/lib/ProjectFunctions/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import mongoose from 'mongoose';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

interface ChatArr {
  _id: string;
  title:string;
  createdAt?:Date;
};

interface FileDialogProps{
    projectid:mongoose.Types.ObjectId;
    onClose: ()=>void;
}
const FileDialog = ({projectid, onClose}:FileDialogProps) => {
    
    const [chats, setchats] = useState<ChatArr[]>([]);
    const [selectedChats, setSelectedChats] = useState<any[]>([])

    const { data: getchats, error, isLoading } = useQuery({
        queryKey: ["chathistory"],
        queryFn: getHistory
      });

      const AddChatToProjectFn = useMutation({
        mutationFn:addChatsToProject ,
         onSuccess: () => {
           toast.success("chats added successfully");
           onClose();
         
      ;
           
         },
       });

      useEffect(() => {
       if(getchats){
        setchats(getchats)
       }
      }, [getchats, chats]);

      function handleCheckBoxChange (chatid:any){
       setSelectedChats(prev => {
        if(prev.includes(chatid)) {
            return prev.filter(id => id !==chatid)
        }else{
            return [...prev, chatid]
        }
       });
      };

      function handleSubmit (){
        const data = {
            selectedChats,
            projectid
        };

        AddChatToProjectFn.mutate(data);

      }


      

  return (
    <div className='h-full w-full bg-black/50 fixed inset-0 flex justify-center items-center '>
        <div className='h-130 w-150 bg-white rounded shadow-lg shadow-black flex flex-col items-center p-2 '>
            <h1 className='font-semibold '>Add Chats To Project</h1>
           
            <div className='h-[85%] w-full  flex flex-col p-2 gap-2 overflow-y-auto border border-black rounded-sm '>
                {chats.map((chat)=>(
                    <div key={chat._id} className="flex items-center py-2 bg-zinc-300 hover:bg-zinc-400 p-2 rounded-sm ">
                    <input
                      type="checkbox"
                      id={`chat-${chat._id}`}
                      checked={selectedChats.includes(chat._id)}
                      onChange={() => handleCheckBoxChange(chat._id)}
                      className="h-4 w-4 text-blue-600 border-gray-300   rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`chat-${chat._id}`} className="ml-2 text-gray-700 cursor-pointer">
                      {chat.title}
                    </label>
                  </div>
                ))}
            </div>
            <div className='flex gap-2 justify-end w-full mt-2 '>
                <button onClick={onClose} className='py-2 px-4 bg-zinc-700 rounded-md text-white cursor-pointer'>Cancel</button>
                <button onClick={handleSubmit} className={`y-2 px-4 bg-black rounded-md text-white ${AddChatToProjectFn.isPending? "cursor-not-allowed": "cursor-pointer"}`} >{AddChatToProjectFn.isPending?(<Loader2 className='animate-spin'/>):`Add ${selectedChats.length}`}</button>
            </div>
        </div>
    </div>
  )
}

export default FileDialog