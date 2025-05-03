import ChatModel from "@/app/models/chat.model";
import UserModel from "@/app/models/user.model";
import { getDataFromToken } from "@/helper/getDataFromToken";
import { dbConnect } from "@/lib/dbConnect";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const tokenData = await getDataFromToken(request);
    const userid = (tokenData as JwtPayload).userid;
    if (!userid) {
      return NextResponse.json(
        {
          sucess: false,
          message: "Invalid token or userid not found",
          chats: []
        }
      );
    }

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
    return NextResponse.json(
      {
        sucess:true,
        message:"history retrived successfully",
        chats:user?.chats ||[]
      },
      {
        status:201
      }
    )
    
  } catch (error:any) {
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
