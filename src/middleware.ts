import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getDataFromToken } from './helper/getDataFromToken';
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    
    const path = request.nextUrl.pathname;

    const isPublic = path ==="/sign-in" || path === "/sign-up" || path ==="/verifyemail" || path ==="/"

    if(isPublic && token){
        return NextResponse.redirect(new URL('/chat/new', request.url))
        return NextResponse.next();
    }
    if(!isPublic && token){
       
        return NextResponse.next();
    }
    if(!isPublic && !token){

        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher:[
        "/sign-in",
        "/sign-up",
        "/",
        "/chat/:path*",
        "/verify/:path*"
      ]
}