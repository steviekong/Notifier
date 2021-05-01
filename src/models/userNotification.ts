import mongoose, { Model, Document, Schema }  from "mongoose";
import { UserInterface } from "./user";

/** Basic notification object, more fields can be added as required by other mediums */
export interface NotificationInterface extends Document {
  medium: "EMAIL" | "WHATSAPP";
  user: UserInterface;
  cron?: string;
  subject: string;
  text: string;
}

/** Notification object includes list of users */
const NotificationSchema: mongoose.Schema = new mongoose.Schema({
  medium: {
    type: String,
    enum: ["EMAIL"], // More enum types can be added here
    required: true,
  },
  user: {type: Schema.Types.ObjectId, ref: "User"},
  cron: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true
  }
})

export const UserNotification: Model<NotificationInterface> = mongoose.model('Notify', NotificationSchema);
