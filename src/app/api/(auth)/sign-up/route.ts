import UserModel from "@/app/models/user.model";
import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  // db connection fucntion
  await dbConnect();

  try {

    const { username, email, password } = await request.json();

    // if check for empty request parameter
    if (!username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All Paremeters are required!",
        },
        { status: 400 }
      );
    }

    // check for existing user by email
    const existingUser = await UserModel.findOne({ email: email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User Already Exists !",
        },
        { status: 409 }
      );
    }
    // password hashing
    const salt = await bcrypt.genSalt(5);
    const hashedPass = await bcrypt.hash(password, salt);

    // new user generation
    const newUser = new UserModel({
      username,
      email,
      password: hashedPass,
    });

    const savedUser = await newUser.save();

    // cookie object
    const tokenObj ={
        userid : savedUser._id,
        username: savedUser.username,
      };
      // signing jwt
      const token = jwt.sign(tokenObj,process.env.JWT_SECRET! );

      //response object
    const response = NextResponse.json(
      {
        message: "user registered successfully",
        sucees: true,
        savedUser,
      },
      {
        status: 200,
      }
    );
    //cookie set
    response.cookies.set("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
       httpOnly: true,
       sameSite: "strict",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: "An Error Occured while regestering user",
        sucees: false,
      },
      {
        status: 500,
      }
    );
  }
}
