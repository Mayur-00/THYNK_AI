import ChatModel from "@/app/models/chat.model";
import UserModel from "@/app/models/user.model";
import { getDataFromToken } from "@/helper/getDataFromToken";
import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { decoded } = await getDataFromToken(request);
    const userid = decoded.userid

    const user = await UserModel.findById(userid).populate("chats");
    if(!user){
      return NextResponse.json(
        {
          sucess:false,
          message:"user not found or unable to populate chats",
          chats:[]
        }
      )
    }
    //TODO:remove log
    console.log(user?.chats);

    return NextResponse.json(
      {
        sucess:true,
        message:"history retrived successfully",
        chats:user?.chats
      },
      {
        status:404
      }
    )
    
  } catch (error:any) {
    console.log("error in get history function", error);
    return NextResponse.json(
      {
        sucess:false,
        message:error.message || "internal server error",
       
      },
      {
        status:500
      }
    )
  }
}
