"use client"
import { SendHorizontal } from "lucide-react";
import React, { useState } from "react";

interface Props {
  onSendMessage: (message: string) => void;
}

const InputComponent:React.FC<Props> = ({onSendMessage}) => {
  const [InputText, setInputText] = useState("");
  const handleSubmit = () =>{
    onSendMessage(InputText);
    setInputText("")
  };

  const handleKeyDown = (e:React.KeyboardEvent) =>{
    if(e.key ==='Enter' && InputText.trim()){
      onSendMessage(InputText);
      setInputText('')
    }
  }

  return (
    <div className=" h-20 w-90  sm:h-20 sm:w-150 rounded-xl bg-black fixed sm:left-100 left-5 bottom-1 z-9 mb-5 flex  overflow-hidden p-1">
      <textarea
        className="h-full w-130 resize-none  text-white outline-none p-2 scrollbar-none"
        placeholder="Ask Anything ..."
        onChange={(e)=> setInputText(e.target.value)}
        value={InputText}
        onKeyDown={handleKeyDown}
      />
   
      <div className="h-20 w-20 flex items-center justify-center">
        <button className="h-10 w-10 text-black bg-white rounded-full flex justify-center items-center  " 
        onClick={handleSubmit}
        >
        <SendHorizontal  />
        </button>
      </div>
    </div>
  );
};

export default InputComponent;
