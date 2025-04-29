import mongoose, { Schema, Document } from "mongoose";

interface IProject extends Document {
  userid: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  chats: mongoose.Types.ObjectId[];
  color: string;
  logo:string
}

const projectSchema: Schema<IProject> = new Schema({
  userid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "userid is required !"],
  },
  name: {
    type: String,
    required: [true, "project name is required !"],
  },
  description: String,
  chats: [
    {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      default:[]
    },
  ],
  color:{
    type:String,
    required:[true, "accent colour is required !"]
  },
  logo:{
    type:String,
    default:""
  }
},
{
  timestamps:true
}
);


const projectModel = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default projectModel as mongoose.Model<IProject>


