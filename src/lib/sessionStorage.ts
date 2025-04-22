import { WindSong } from "next/font/google";

export interface ChatSession{
    chatId:string | null,
    isActive:boolean
};

export function startNewSession ():void {
    const session: ChatSession = {
        chatId:null,
        isActive:true
    };

    if(typeof window !=='undefined'){
        sessionStorage.setItem(process.env.SESSION_STORAGE_KEY!, JSON.stringify(session));
    }
};

export function getCurrentSession ():ChatSession | null{
if(typeof Window === 'undefined'){
    return null
};

const sessionData = sessionStorage.getItem(process.env.SESSION_STORAGE_KEY!);

if(!sessionData){
    return null
};

return JSON.parse(sessionData);
};


export function updateSessionChatId(chatId: string): void {
    const currentSession = getCurrentSession();
    
    if (currentSession) {
      currentSession.chatId = chatId;
      sessionStorage.setItem(process.env.SESSION_STORAGE_KEY!, JSON.stringify(currentSession));
    }
  }
  
  // Clear the current session
  export function clearSession(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(process.env.SESSION_STORAGE_KEY!);
    }
  }