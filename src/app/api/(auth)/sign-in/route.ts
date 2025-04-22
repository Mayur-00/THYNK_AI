import UserModel from "@/app/models/user.model";
import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  // db connection fucntion
  await dbConnect();

  try {
    const { email, password } = await request.json();

    // if check for empty request parameter
    if (!email || !password) {
      console.log("All the Paremeters are required!");
      return NextResponse.json(
        {
          success: false,
          message: "All the Paremeters are required!",
        },
        { status: 400 }
      );
    }

    // check for existing user by email
    const existingUser = await UserModel.findOne({ email: email });

    if (!existingUser) {
      console.log("user not found");
      return NextResponse.json(
        {
          success: false,
          message: "Account Not Found Please LogIn!",
        },
        { status: 404 }
      );
    }
    // password verification
  const verification = await bcrypt.compare(password, existingUser.password);

  // password not verify check 
  if(!verification){
    return NextResponse.json(
        {
          success: false,
          message: "Password does not match",
        },
        { status: 401 }
      );
  };
// jwt token obj
  const tokenObj ={
    userid : existingUser._id,
    username: existingUser.username,
  };

  const token = jwt.sign(tokenObj,process.env.JWT_SECRET!, {expiresIn:"2d"} );

// response obj
    const response =  NextResponse.json(
      {
        message: "user registered successfully",
        sucees: true,
       
      },
      {
        status: 200,
      }
    );

    response.cookies.set("token", token, {
      httpOnly:true
    });

    return response
  } catch (error) {
    console.log("error in signin function", error);

    return NextResponse.json(
      {
        message: "An Error Occured while signining in",
        sucees: false,
      },
      {
        status: 500,
      }
    );
  }
}
