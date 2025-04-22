export interface ChatRequest {
  message:string,
  history?: ChatMessage[],
  chatId:string
};

export interface ChatMessage {
    role: string,
    content: string;
  }