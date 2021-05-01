import Agenda from "agenda"
import { SingleNotification } from "../types/singleNotification";
import SendEmailJob from "../Jobs/SendEmailJob";
import { NotificationInterface } from "../models/userNotification"
import { User, UserInterface } from "../models/user";

class JobCreator{
  notificationsList: NotificationInterface[] | null;
  notification:  SingleNotification | null;
  agenda: Agenda;
  constructor(notificationsList: NotificationInterface[] | null, agenda: Agenda, notification: SingleNotification | null ){
    this.notificationsList = notificationsList;
    this.agenda = agenda;
    this.notification = notification;
  }

  createListeners = () => {
    /** More can be added here for additional mediums */
    const sendEmailJob = new SendEmailJob(process.env.SENDER_EMAIL, this.agenda)
    sendEmailJob.defineJob()
  }

  /** Create a job that sends a notification immediately */
  createOneJob = async () => {
    if(this.notification !== null){
      const user: UserInterface = await User.findById(this.notification.user)
      const data = {to: user.email, subject: this.notification.subject, text: this.notification.text};
      /** Switch and dispatch appropriate job based on medium, more can be added here */
      switch(this.notification.medium){
        case "EMAIL":
          this.agenda.now("sendemail", data)
          break;
        default:
          throw new Error("Invalid medium error");
      }
    }
    else{
      throw new Error("Notification object is undefined");
    }
  }

  /** Create a job that sends a notification based on a cron tab string periodically  */
  createJobs = () => {
    console.log(this.notificationsList)
    if(this.notificationsList){
      this.notificationsList.forEach(async (notification: NotificationInterface) => {
        let job;
        /** Switch and dispatch appropriate job based on medium, more can be added here */
        switch(notification.medium){
          case "EMAIL":
            job = this.agenda.create("sendemail", {to: notification.user.email, subject: notification.subject, text: notification.text})
            break;
          default:
            throw new Error("Invalid medium error");
        }
        job.repeatEvery(notification.cron)
        await job.save();
      });
    }
    else{
      throw new Error("Notification list is undefined");
    }
  }
}

export default JobCreator;