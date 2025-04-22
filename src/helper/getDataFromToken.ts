import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export const getDataFromToken = (request:NextRequest) => {
  try {
    const secret = process.env.JWT_SECRET;
    const token = request.cookies.get("token")?.value || "";

console.log
    if (!secret) {
      throw new Error("JWT_SECRET not set in environment variables");
    }

    const decoded = jwt.verify(token, secret);
    console.log(decoded)
    return decoded;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message || "Token verification failed");
  }
};
