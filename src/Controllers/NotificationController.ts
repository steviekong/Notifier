import JobCreator from "../Services/JobCreatorService";
import { SingleNotification, SingleNotificationSchema } from "../types/singleNotification";
import express from "express";
import Agenda from "agenda";
import { validateBody } from "..//Middleware/validator";

class NotificationController{
  path = '/notification';
  router = express.Router();
  agenda: Agenda
  constructor(agenda: Agenda){
    this.agenda = agenda;
    this.router.post(this.path, validateBody(SingleNotificationSchema) ,this.create);
  }

  create = async (req : express.Request, res: express.Response) => {
    const data = req.body

    const notification: SingleNotification = {
      medium: data.medium,
      user: data.user,
      subject: data.subject,
      text: data.text,
    }
    const jobCreator = new JobCreator(null, this.agenda, notification);
    try{
      await jobCreator.createOneJob()
    }
    catch(error){
      return res.json({success: false, message: "Message not sent to user"})
    }
    return res.json({success: true, message: "Message dispatched to user"})
  }
}

export default NotificationController