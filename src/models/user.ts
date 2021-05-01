import Joi from "joi";
import mongoose, { Model, Document }  from "mongoose";

/** Basic user object, more fields for communication (slack id, WhatsApp etc could be included later) */

export interface UserInterface extends Document {
  _id: string,
  name: string,
  email: string,
  password: string
}

export const UserSchema : mongoose.Schema = new mongoose.Schema({
  /** Manually setting id here so I can auto populate the notifications */
  _id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 300,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
})
export const User : Model<UserInterface> = mongoose.model("User", UserSchema);