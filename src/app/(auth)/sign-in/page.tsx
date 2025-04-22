"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation";
import React, { use } from 'react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { signInState, signUpState } from "@/lib/AuthFunctions/api"
import { toast } from "sonner";
import { signinSchema } from "@/schemas/signIn-Schema";

const page = () => {

const router = useRouter()
    const form = useForm<z.infer<typeof signinSchema>>(
        {
            resolver:zodResolver(signinSchema),
            defaultValues:{
              
                email:"",
                password:""
            }
        }
    );

    const signinmutate = useMutation({
        mutationFn:signInState,
        onSuccess:()=>{
            toast.success("Signin sucess") 
            router.replace("/chat") 
        }
    })

    const onsubmit = (data:z.infer<typeof signinSchema>)=>{
        signinmutate.mutate(data);



    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
           Welcome Back
          </h1>
          <p className="mb-4">Sign In to Continue</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
          
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                     
                    />
                  </FormControl>
              
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="password"
                      type="password"
                      {...field}
                     
                    />
                  </FormControl>
                
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={signinmutate.isPending} >
              {
                signinmutate.isPending ? ( 
                  <>
                  <Loader className="mr-2 h-4 w-4 animate-spin"/>
                  </>
                ) : ('Sign Up')
              }

            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page