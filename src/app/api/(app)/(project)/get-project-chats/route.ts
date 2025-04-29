import projectModel from "@/app/models/project.model";
import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();

  const url = new URL(req.url);
  const projectId = url.searchParams.get("ProjectId");
``
  if (!projectId) {
    return NextResponse.json(
      {
        sucess: false,
        message: "project id  not provided",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const project = await projectModel.findById(projectId).populate("chats");
    if (!project) {
      return NextResponse.json(
        {
          sucess: false,
          message: "project not provided",
        },
        {
          status: 401,
        }
      );
    };

    return NextResponse.json(
        {
            success:true,
            message:"chat founded successfully",
            chats:project?.chats || []
        },
        {status:200}
    );
  } catch (error:any) {
    return NextResponse.json(
        {
            success:false,
            message:error.message || "internal server error",
        },
        {status:500}
    )
  }
}
