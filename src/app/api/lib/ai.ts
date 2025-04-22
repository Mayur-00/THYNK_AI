import { ChatMessage } from "@/app/types/chat";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { SYSTEM_PROMPT } from "./prompt";

export async function run(prompt:ChatMessage, history: ChatMessage[] =[] ) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.API_KEY !);
        const model = genAI.getGenerativeModel({ model: process.env.MODEL_NAME !});
    
        const chat = model.startChat({
            generationConfig: {
              maxOutputTokens: 1000,
              temperature: 0.7,
              topP: 0.9,
            },
            safetySettings: [
              {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
              },
            ],
            history: formatMessageForGemini(history),
          });

          let resposeText;

          if(history.length === 0){
            await chat.sendMessage(SYSTEM_PROMPT);

            const result = await chat.sendMessage(prompt.content);
            console.log(result)
            resposeText = result.response.text();
            console.log(resposeText);
            return resposeText
          }else{
            const result = await chat.sendMessage(prompt.content);
            console.log(result);
            
            resposeText = result.response.text();
            console.log(resposeText);
            return resposeText
          }
    } catch (error : any) {
        console.log(error);
        
    }
}

function formatMessageForGemini(message: ChatMessage[]){


    return message.map(msg =>({
        role:msg.role,
        parts: [{ text: msg.content }]

    }))
};
