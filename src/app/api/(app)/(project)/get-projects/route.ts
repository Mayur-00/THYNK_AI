import projectModel from "@/app/models/project.model";
import UserModel from "@/app/models/user.model";
import { getDataFromToken } from "@/helper/getDataFromToken";
import { dbConnect } from "@/lib/dbConnect";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req:NextRequest){
    await dbConnect();

      const decoded =  getDataFromToken(req);
      const userid = (decoded as JwtPayload).userid

    try {
        const user = await UserModel.findById(userid).populate("projects");
        if(!user){
            return NextResponse.json(
                {
                    success:false,
                    message:"Projects not found"
                },
                {
                    status:400
                }
            );
        };

        return NextResponse.json(
            {
                success:true,
                message:"Project founded successfully",
                projects:user.projects || []
            },
            {
                status:200
            }
        );

    } catch (error:any) {
        return NextResponse.json(
            {
                success:false,
                message:error.message || "Internal server error",

                
            },
            {
                status:500
            }
        )
        
    }
}