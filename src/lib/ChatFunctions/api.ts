import { ChatRequest } from "@/app/types/chat";
import { ChatMessage } from "@/types/ChatMessage";
import axios from "axios"

 export const getHistory = async ()=>{
    try {
    const res = await axios.get("/api/get-history");
    console.log("success", res.data)
    return res.data.chats
    } catch (error) {
        console.log("an error in get history", error)
    }
 };

 export const getHistoryChats = async (chatId:any) =>{
    try {
        const res = await axios.get(`/api/get-historyChats?chatid=${chatId}`);
        console.log("success", res.data)
       
        return res.data.chat

    } catch (error) {
        console.log("an error in get history chats", error)
    }
 };

 export const sendMessage = async (data:{message:string, history:ChatMessage[], chatId:any},) =>{
    try {
        const res = await axios.post("/api/chat",data);

        console.log("success", res.data);

        return res.data
    } catch (error) {
        console.log("an error in send message", error)
    }
 }