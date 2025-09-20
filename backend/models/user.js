
import mongoose from "mongoose";

const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type:String,
    required:true,
  },
  email:{
    type:String,
    unique: true,
    required: true,
  },
  password:{
    type: String,
    required: true,
  }
})

export const UserModel = mongoose.model("users",UserSchema);
