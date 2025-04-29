import projectModel from "@/app/models/project.model";
import { dbConnect } from "@/lib/dbConnect";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
interface reqElements {
    selectedChats:mongoose.Types.ObjectId[];
    projectid:string
}

export async function POST (req:NextRequest){
    await dbConnect();

    const {selectedChats, projectid}:reqElements = await req.json();

    if(!selectedChats || !projectid ){
        return NextResponse.json(
            {
                success:false,
                message:"cannot find chaid or projectid"
            },
            {
                status:400
            }
        );


    }
    console.log(projectid)

    try {
      const project = await projectModel.findById(projectid);

      if(!project ){
        return NextResponse.json(
            {
                success:false,
                message:"project not found"
            },
            {
                status:404
            }
        );


    }
    selectedChats.forEach((chatId:mongoose.Types.ObjectId) => {
        project.chats.push(chatId);
    });
  
     const savedProject = await project?.save()
    const pop = await savedProject?.populate("chats")

      return NextResponse.json(
        {
            success:true,
            message:"chat added successfully ! ",
            chats:pop?.chats,
            project:savedProject
            
        },
        {
            status:200
        }
      )
    } catch (error:any) {
        return NextResponse.json(
            {
                success:false,
                message:error.message || "chat added successfully ",
            },
            {
                status:500
            }
          )
    }
}