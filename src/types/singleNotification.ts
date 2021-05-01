import Joi from "joi"

export type SingleNotification = {
  medium: "EMAIL" | "WHATSAPP";
  user: string;
  subject: string;
  text: string;
}

export const SingleNotificationSchema = Joi.object({
  medium: Joi.string().valid("EMAIL", "WHATSAPP").required(),
  user: Joi.string().required(),
  subject: Joi.string().min(1).required(),
  text: Joi.string().min(1).required(),
});
