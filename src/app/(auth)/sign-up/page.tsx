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
import { signUpSchema } from "@/schemas/signUp-Schema"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { signUpState } from "@/lib/AuthFunctions/api"
import { toast } from "sonner";

const page = () => {

const router = useRouter()
    const form = useForm<z.infer<typeof signUpSchema>>(
        {
            resolver:zodResolver(signUpSchema),
            defaultValues:{
                username:"",
                email:"",
                password:""
            }
        }
    );

    const signupmutate = useMutation({
        mutationFn:signUpState,
        onSuccess:()=>{
            toast.success("Signup sucess") 
            router.replace("/chat") 
        }
    })

    const onsubmit = (data:z.infer<typeof signUpSchema>)=>{
        signupmutate.mutate(data);



    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymus adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="UserName"
                      {...field}
                     
                      
                    />
                  </FormControl>
                   //
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <Button type="submit" disabled={signupmutate.isPending} >
              {
                signupmutate.isPending ? ( 
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
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page