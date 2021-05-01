import Agenda, { Job, JobAttributesData } from "agenda";
import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import { emailConfig } from "../Configs/emailConfig";

/** Job to send an email to a single user */
class SendEmailJob{
  fromAddress: string;
  agenda: Agenda;
  constructor(fromAddress: string, agenda: Agenda){
    this.fromAddress = fromAddress;
    this.agenda = agenda;
  }

  defineJob = () => {
    this.agenda.define("sendemail", this.sendEmail)
  }

  /** Retry at least 5 times before the job is declared a failure and an error is thrown */
  sendEmail = async (job : Job<JobAttributesData>) => {
    let count = 4;
    while(count > 0){
      try{
        await this.sendEmailTransport(job)
        break;
      }
      catch(error){
        count--
      }
    }
    if(count === 0){
      throw new Error("Send email job failed")
    }
  }

  sendEmailTransport = async (job : Job<JobAttributesData>): Promise<any> => {
    const { to, subject, text } = job.attrs.data;
    const transporter = nodemailer.createTransport(emailConfig);

    const mailOptions: MailOptions = {
      from: this.fromAddress,
      to,
      subject,
      text
    }
    return transporter.sendMail(mailOptions)
  }
}

export default SendEmailJob;