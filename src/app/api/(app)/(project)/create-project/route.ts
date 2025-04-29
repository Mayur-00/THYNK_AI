import projectModel from "@/app/models/project.model";
import UserModel from "@/app/models/user.model";
import { getDataFromToken } from "@/helper/getDataFromToken";
import { dbConnect } from "@/lib/dbConnect";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export interface createProjectProp{
    name:string,
    description?:string,
    color:string,
}


export async function POST (req:NextRequest){
await dbConnect();
try {
    const {name, description, color}: createProjectProp = await req.json()
    
    if(!name || !color){
        return NextResponse.json(
            {
                success:false,
                message:"add parameters are required"
            },
            {
                status:401
            }
        );
    };

    const decoded =  getDataFromToken(req);
        const userid = (decoded as JwtPayload).userid

        if(!userid){
            return NextResponse.json(
                {
                    success:false,
                    message:"user id not found"
                },
                {
                    status:500
                }
            );
        };

        const newProject = new projectModel(
            {
                userid,
                name,
                description,
                color,

            }
        );

        const savedProject = await newProject.save();

        if(!savedProject){
            return NextResponse.json({
                success:false,
                message:"an error occured while creating and saving project"
            },
            {
                status:500
            }
        );
        };

        const user = await UserModel.findById(userid);

        if(!user){
            return NextResponse.json(
                {
                    success:false,
                    message:"User not found"
                },
                {
                    status:500
                }
            );
        }
        user?.projects.push(savedProject._id as Types.ObjectId);
      const updatedUser =   await user?.save();


        return NextResponse.json(
            {
                success:true,
                message:"new project created successfully",
                projectid:savedProject._id,
                projects:updatedUser.projects || []
            },
            {
                status:200
            }
        );

        
} catch (error:any) {
    return NextResponse.json(
        {
            success:false,
            message:`internal server error : ${error.message} `,
            projectid:null,
            projects: []
        },
        {
            status:500
        }
    );

}
}