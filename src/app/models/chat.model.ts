import mongoose, {Schema, Document} from "mongoose";



export interface Ichat extends Document{
    userId:mongoose.Types.ObjectId,
    title:string,
    messages:[
        {
            role:string,
            content:string
        },
    ],
    projectid?:mongoose.Types.ObjectId
   
    
};

export interface Imessage extends Document{
    content:string,
    role:string
}


const chatSchema: Schema<Ichat> = new Schema(
    {
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    messages:[
        {
            role:String,
            content:String
        },
    ],
    projectid:{
        type:Schema.Types.ObjectId,
        ref:"Project"

    }
    
},
{
    timestamps:true
}
);

const ChatModel = mongoose.models.Chat as mongoose.Model<Ichat> || mongoose.model<Ichat>("Chat", chatSchema);

export default ChatModel;

