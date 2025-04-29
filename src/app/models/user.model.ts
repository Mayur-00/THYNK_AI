import mongoose, {Schema, Document} from "mongoose";


export interface User extends Document{
    username:string,
    email:string,
    password:string,
    isVerified:boolean,
    verifyCode:string,
    verifyCodeExpiry:Date,
    chats: mongoose.Types.ObjectId[]; 
    projects:mongoose.Types.ObjectId[];


};

const userSchema:Schema<User> = new Schema(
    {
        username:{
            type:String,
            required:[true, "username is required"]
        },
        email:{
            type:String,
            required:[true, "email is required"]
        },
        password:{
            type:String,
            required:[true, "password is required"]
        },
       
        chats:[{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
        projects:[{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }]
       
    },
    {
        timestamps:true
    }
);

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", userSchema);


export default UserModel;

