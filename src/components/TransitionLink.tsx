"use client"

import React from 'react'
import Link, {LinkProps} from 'next/link'
import { useRouter } from 'next/navigation'
interface TransitionLinkProps extends LinkProps {
    href:string;
    children: React.ReactNode;
    className?:string;
}
const TransitionLink = ({href, children, ...props}:TransitionLinkProps) => {
    const router = useRouter();

    async function handleNavigation (e:React.MouseEvent<HTMLAnchorElement, MouseEvent>){
        e.preventDefault();
        const body = document.body;
        body.classList.add("exit-animation");
        await new Promise((res)=> setTimeout(res, 1000));
        body.classList.remove("exit-animation");
        
        router.push(href);
        body.classList.add("enter-animation");

        setTimeout(()=>{
            body.classList.remove("enter-animation");
        }, 1000);
    }
  return (
    <Link onClick={handleNavigation} href={href} {...props}>
        {children}
    </Link>
  )
}

export default TransitionLink