import { NextResponse, NextRequest } from "next/server";
import {  ChatRequest } from "@/app/types/chat";
import { run } from "@/app/api/lib/ai";
import ChatModel from "@/app/models/chat.model";
import { getDataFromToken } from "@/helper/getDataFromToken";
import mongoose, { Schema } from "mongoose";
import { Types } from "mongoose";
import UserModel from "@/app/models/user.model";
import { ChatMessage } from "@/types/ChatMessage"
import { dbConnect } from "@/lib/dbConnect";
import { JwtPayload } from "jsonwebtoken";

export async function POST(request: NextRequest) {
  await dbConnect()
  try {
    const {
      message,
      history,
      chatId,
    } = (await request.json()) as ChatRequest;

    const decoded = await getDataFromToken(request);
    const userid = (decoded as JwtPayload).userid;
    

    console.log(history);
    console.log("history update");

    const result = await run({ role: "user", content: message }, history);
    console.log(result);

    let chat;
    let updatedUser;
    if (chatId !== "newChat") {
      chat = await ChatModel.findById(chatId);
      if (chat?.userId.toString() !== userid) {
        return NextResponse.json(
          {
            success: false,
            message: "Chat not found or access denied",
          },
          {
            status: 404,
          }
        );
      }

      chat?.messages.push(
        { role: "user", content: message },
        { role: "model", content: result || "No response available" }
      );

      await chat?.save();
    } else {
      chat = await ChatModel.create({
        userId: userid,
        title: message.substring(0, 20) + (message.length > 20 ? "..." : ""),
        messages: [
          { role: "user", content: message },
          { role: "model", content: result || "No response available" },
        ],

      });

    const currentUser =  await UserModel.findById(userid!);
    currentUser?.chats.push(chat?._id as Types.ObjectId);
     updatedUser =  await currentUser?.save();

    }

    return NextResponse.json({
      reply: result,
      chatId: chat?._id,
      currentchatHistory:chat?.messages,
      allchatHistory:updatedUser?.chats
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}
