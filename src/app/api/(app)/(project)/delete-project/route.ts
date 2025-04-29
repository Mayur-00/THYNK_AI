import projectModel from "@/app/models/project.model";
import UserModel from "@/app/models/user.model";
import { getDataFromToken } from "@/helper/getDataFromToken";
import { dbConnect } from "@/lib/dbConnect";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req:NextRequest){
    //TODO: add error handlers
    await dbConnect();
    const {projectid}= await req.json();
    if(!projectid){
        return NextResponse.json(
            {
                success:false,
                message:"please provide projectid",
    
            },
            {status:400}
        )
    }

  const decoded =  getDataFromToken(req);

    const userid = (decoded as JwtPayload).userid;

    if(!userid){
        return NextResponse.json(
            {
                success:false,
                message:"userid not found",
    
            },
            {status:500}
        )
    }
    try {

    const deleted =   await projectModel.findByIdAndDelete(projectid);
    await UserModel.updateOne({userid}, {$pull: {projects:projectid}});
    
    return NextResponse.json(
        {
            success:true,
            message:"project removed sucessfully",
        },
        {status:200}
    )
    } catch (error:any) {
        return NextResponse.json(
            {
                success:true,
                message:error.message || "project removed sucessfully",
    
            },
            {status:500}
        )
    }
}