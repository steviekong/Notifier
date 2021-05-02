import Agenda, { Job } from "agenda";
import assert from "assert";
import mongoose from "mongoose";
import JobCreator from "../Services/JobCreatorService";
import { User, UserInterface } from "../models/user";
import { SingleNotification } from "../types/singleNotification";
import {NotificationInterface, UserNotification } from "../models/userNotification";
import SendEmailJob from "../Jobs/SendEmailJob";
import { testEmailConfig } from "../Configs/emailConfig";

describe('JobCreatorService', () => {
  const agenda = new Agenda({ db: { address: process.env.MONGO_URL_AGENDA_TEST } });

  it('Should send an email and verify the accepted field', async () => {
    /** This test uses ethereal.email to work */
    const testEmail: string = process.env.TEST_EMAIL;
    const sendEmailJob = new SendEmailJob(testEmail, agenda, testEmailConfig)
    const data = {to: testEmail, subject: "test", text: "test"};
    const job = await agenda.now("sendemail", data)
    const info = await sendEmailJob.sendEmailTransport(job)
    assert(info.accepted.length === 1)
  }).timeout(10000);;

  afterEach(async() => {
    await agenda.cancel({ name: "sendemail" });
  });

});