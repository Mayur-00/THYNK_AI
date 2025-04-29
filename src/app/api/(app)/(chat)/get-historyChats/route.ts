import ChatModel from "@/app/models/chat.model";
import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const url = new URL(request.url);
    const chatid = url.searchParams.get("chatid")
    console.log("chatid", chatid);
    
    if (!chatid) {
      return NextResponse.json({
        sucess: false,
        message: "Chat id not provided",
       
      },
      {
        status:401
      }
    );
}

   const chat = await ChatModel.findById(chatid);

   if(!chat){
    return NextResponse.json({
        sucess: false,
        message: "Chat not found",
       
      },
      {
        status:404
      }
    );
   };

   return NextResponse.json({
    sucess: true,
    message: "chat founded sucessfully",
    chat:chat?.messages
   
  },
  {
    status:200
  }
);
    
  } catch (error:any) {
    console.log("error in get history chats function", error);
    return NextResponse.json({
        sucess: false,
        message:error.message || "internal server error",
      },
      {
        status:500
      }
    );
  }
}
