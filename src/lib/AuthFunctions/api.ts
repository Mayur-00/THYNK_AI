import { signinSchema } from "@/schemas/signIn-Schema";
import { signUpSchema } from "@/schemas/signUp-Schema"
import axios from "axios"
import {z} from "zod"

export const signUpState = async (data:z.infer<typeof signUpSchema>)=>{
    try {
        
     const res =   await axios.post("/api/sign-up",data)
     console.log(res.data);

     return res.data
        
    } catch (error) {
        console.log("an error in signup state function", error);
        return error
        
        
    }
};
export const signInState = async (data:z.infer<typeof signinSchema>)=>{
    try {
        
     const res =   await axios.post("/api/sign-in",data)
     console.log(res.data);

     return res.data
        
    } catch (error) {
        console.log("an error in signin state function", error);
        return error
        
        
    }
};